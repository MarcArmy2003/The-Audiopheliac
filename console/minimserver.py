"""UPnP/DLNA control-point client for MinimServer + Yamaha R-N800A.

The Cockpit talks to MinimServer (UPnP MediaServer on the QNAP) directly
via SOAP over HTTP and pushes track URIs to the Yamaha (UPnP MediaRenderer)
via SOAP over HTTP. No third-party UPnP library required; built on the
stdlib + requests. Mirrors the yamaha.py pattern: thin, hand-rolled,
explicit.

Architecture
------------
1. SSDP M-SEARCH discovery (multicast 239.255.255.250:1900) finds
   MediaServer (MinimServer) and MediaRenderer (Yamaha) endpoints.
2. Device description XML is fetched once per device and parsed to
   extract service control URLs (ContentDirectory on the server,
   AVTransport on the renderer).
3. SOAP invocation against ContentDirectory:Browse / :Search returns
   DIDL-Lite XML embedded in a SOAP envelope; we re-parse it into
   plain Python dicts.
4. Playback handoff: SetAVTransportURI(track_url) + Play on the
   renderer. The renderer pulls the file from MinimServer directly.

Why no `upnpclient` / `aioupnp` / etc.: keeps the dependency surface
small, avoids async/sync mismatch with Flask, gives the Cockpit
explicit control over SOAP envelope construction and DIDL-Lite parsing.
The protocol is just XML over HTTP; spelling it out is clearer than
adding a library.

Caching: SSDP discovery runs once at first request and caches results
in module-level state. Re-discovery is triggered by an explicit
discover(force=True) call from /api/minim/discover, or automatically
when a cached service URL returns a connection error.
"""
from __future__ import annotations

import re
import socket
import threading
import time
import xml.etree.ElementTree as ET
from dataclasses import dataclass, field
from html import unescape
from typing import Any, Optional
from urllib.parse import urljoin, urlparse

import requests


# ---------- namespaces (explicit; ET's default-NS handling is awkward) -----

NS_SOAP = "http://schemas.xmlsoap.org/soap/envelope/"
NS_CDS = "urn:schemas-upnp-org:service:ContentDirectory:1"
NS_AVT = "urn:schemas-upnp-org:service:AVTransport:1"
NS_DIDL = "urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"
NS_UPNP = "urn:schemas-upnp-org:metadata-1-0/upnp/"
NS_DC = "http://purl.org/dc/elements/1.1/"
NS_DEVICE = "urn:schemas-upnp-org:device-1-0"

NS = {
    "s": NS_SOAP,
    "cds": NS_CDS,
    "avt": NS_AVT,
    "didl": NS_DIDL,
    "upnp": NS_UPNP,
    "dc": NS_DC,
    "d": NS_DEVICE,
}

# Device types we care about (urn match prefix; allow v1/v2/v3)
DEVICE_TYPE_MEDIA_SERVER = "urn:schemas-upnp-org:device:MediaServer"
DEVICE_TYPE_MEDIA_RENDERER = "urn:schemas-upnp-org:device:MediaRenderer"


# ---------- exceptions ------------------------------------------------------

class MinimServerError(RuntimeError):
    """Raised on any UPnP/DLNA protocol or transport failure."""


# ---------- dataclasses -----------------------------------------------------

@dataclass
class UPnPService:
    """One UPnP service on a device."""
    service_type: str       # urn:schemas-upnp-org:service:ContentDirectory:1
    service_id: str
    control_url: str        # absolute URL (joined with device baseURL)
    event_sub_url: str
    scpd_url: str


@dataclass
class UPnPDevice:
    """A discovered UPnP device with its service endpoints."""
    location: str           # device description XML URL
    usn: str                # unique service name from SSDP
    server: str             # SERVER header from SSDP response
    device_type: str        # urn:schemas-upnp-org:device:MediaServer:1 etc.
    friendly_name: str
    udn: str
    manufacturer: str
    model_name: str
    base_url: str           # http://host:port for relative URL joining
    services: dict[str, UPnPService] = field(default_factory=dict)

    def service(self, service_urn_prefix: str) -> Optional[UPnPService]:
        """Return the first service matching the URN prefix.

        Pass `NS_CDS` for ContentDirectory or `NS_AVT` for AVTransport.
        Handles v1/v2/v3 transparently by prefix-matching.
        """
        for svc in self.services.values():
            if svc.service_type.startswith(service_urn_prefix):
                return svc
        return None


# ---------- module-level discovery cache ------------------------------------

_discovery_lock = threading.Lock()
_discovered: dict[str, UPnPDevice] = {}    # keyed by UDN
_last_discovery_at: float = 0.0
_DISCOVERY_TTL_SEC = 300.0                  # re-discover after 5 min


# ---------- SSDP discovery --------------------------------------------------

_SSDP_MULTICAST_GROUP = "239.255.255.250"
_SSDP_PORT = 1900


def _msearch_packet(search_target: str = "ssdp:all", mx: int = 3) -> bytes:
    """Build an SSDP M-SEARCH discovery request."""
    return (
        f"M-SEARCH * HTTP/1.1\r\n"
        f"HOST: {_SSDP_MULTICAST_GROUP}:{_SSDP_PORT}\r\n"
        f'MAN: "ssdp:discover"\r\n'
        f"MX: {int(mx)}\r\n"
        f"ST: {search_target}\r\n"
        f"\r\n"
    ).encode("ascii")


def _parse_ssdp_response(data: bytes) -> dict[str, str]:
    """Parse an SSDP response into a header dict (lowercased keys)."""
    text = data.decode("utf-8", errors="replace")
    headers: dict[str, str] = {}
    for line in text.splitlines()[1:]:  # skip the HTTP/1.1 200 OK line
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        headers[key.strip().lower()] = value.strip()
    return headers


def _ssdp_search(targets: list[str], mx: int = 3, listen_secs: float = 4.0
                 ) -> list[dict[str, str]]:
    """Send M-SEARCH for each target, collect responses for `listen_secs`.

    Returns a list of header dicts. Each dict has lowercase keys (location,
    usn, st, server, etc.).
    """
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.IPPROTO_UDP)
    try:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 4)
        sock.bind(("0.0.0.0", 0))
        sock.settimeout(0.5)

        for tgt in targets:
            try:
                sock.sendto(
                    _msearch_packet(tgt, mx),
                    (_SSDP_MULTICAST_GROUP, _SSDP_PORT),
                )
            except OSError:
                continue

        responses: list[dict[str, str]] = []
        deadline = time.time() + listen_secs
        seen_usn: set[str] = set()
        while time.time() < deadline:
            try:
                data, _addr = sock.recvfrom(2048)
            except socket.timeout:
                continue
            except OSError:
                continue
            headers = _parse_ssdp_response(data)
            usn = headers.get("usn", "")
            if not usn or usn in seen_usn:
                continue
            seen_usn.add(usn)
            responses.append(headers)
        return responses
    finally:
        sock.close()


# ---------- device description parsing --------------------------------------

def _fetch_device_description(location: str, timeout: float = 3.0
                              ) -> tuple[str, ET.Element]:
    """Fetch the device description XML, return (base_url, root_element)."""
    try:
        r = requests.get(location, timeout=timeout)
        r.raise_for_status()
    except requests.RequestException as e:
        raise MinimServerError(f"device description fetch failed: {e}") from e
    try:
        root = ET.fromstring(r.text)
    except ET.ParseError as e:
        raise MinimServerError(f"device description parse failed: {e}") from e
    parsed = urlparse(location)
    base_url = f"{parsed.scheme}://{parsed.netloc}"
    return base_url, root


def _build_upnp_device(headers: dict[str, str]) -> Optional[UPnPDevice]:
    """Fetch description for an SSDP response and return a UPnPDevice."""
    location = headers.get("location", "")
    if not location:
        return None
    try:
        base_url, root = _fetch_device_description(location)
    except MinimServerError:
        return None

    # The device element is under root/device
    dev_el = root.find("d:device", NS)
    if dev_el is None:
        return None

    def _txt(el: Optional[ET.Element], tag: str) -> str:
        if el is None:
            return ""
        found = el.find(f"d:{tag}", NS)
        return (found.text or "").strip() if found is not None else ""

    device_type = _txt(dev_el, "deviceType")
    friendly_name = _txt(dev_el, "friendlyName")
    udn = _txt(dev_el, "UDN")
    manufacturer = _txt(dev_el, "manufacturer")
    model_name = _txt(dev_el, "modelName")

    # Service list
    services: dict[str, UPnPService] = {}
    svc_list = dev_el.find("d:serviceList", NS)
    if svc_list is not None:
        for svc_el in svc_list.findall("d:service", NS):
            stype = _txt(svc_el, "serviceType")
            sid = _txt(svc_el, "serviceId")
            ctrl = urljoin(base_url, _txt(svc_el, "controlURL"))
            evt = urljoin(base_url, _txt(svc_el, "eventSubURL"))
            scpd = urljoin(base_url, _txt(svc_el, "SCPDURL"))
            if stype and ctrl:
                services[sid or stype] = UPnPService(
                    service_type=stype,
                    service_id=sid,
                    control_url=ctrl,
                    event_sub_url=evt,
                    scpd_url=scpd,
                )

    return UPnPDevice(
        location=location,
        usn=headers.get("usn", ""),
        server=headers.get("server", ""),
        device_type=device_type,
        friendly_name=friendly_name,
        udn=udn,
        manufacturer=manufacturer,
        model_name=model_name,
        base_url=base_url,
        services=services,
    )


# ---------- public discovery API --------------------------------------------

def discover(force: bool = False, listen_secs: float = 4.0
             ) -> dict[str, UPnPDevice]:
    """Discover UPnP MediaServer + MediaRenderer devices on the LAN.

    Cached for _DISCOVERY_TTL_SEC seconds. Call with force=True to bypass
    the cache and re-scan immediately.
    """
    global _last_discovery_at
    now = time.time()
    with _discovery_lock:
        if (not force
                and _discovered
                and (now - _last_discovery_at) < _DISCOVERY_TTL_SEC):
            return dict(_discovered)

        # Two M-SEARCH packets: one for servers, one for renderers. Sending
        # both increases the chance both reply quickly (some devices only
        # respond to ST matches, others to ssdp:all).
        targets = [
            DEVICE_TYPE_MEDIA_SERVER + ":1",
            DEVICE_TYPE_MEDIA_RENDERER + ":1",
        ]
        headers_list = _ssdp_search(targets, listen_secs=listen_secs)

        found: dict[str, UPnPDevice] = {}
        for headers in headers_list:
            st = headers.get("st", "")
            if not (st.startswith(DEVICE_TYPE_MEDIA_SERVER)
                    or st.startswith(DEVICE_TYPE_MEDIA_RENDERER)):
                continue
            dev = _build_upnp_device(headers)
            if dev is None or not dev.udn:
                continue
            found[dev.udn] = dev

        _discovered.clear()
        _discovered.update(found)
        _last_discovery_at = now
        return dict(_discovered)


def media_server(force_discover: bool = False) -> Optional[UPnPDevice]:
    """Return the preferred MediaServer (MinimServer, if present).

    Multiple MediaServers can coexist on the LAN (e.g. the QNAP's built-in
    "Windows Media Player Sharing" DLNA server alongside MinimServer). Prefer
    MinimServer explicitly by manufacturer/model/friendly-name so browse and
    search resolve to the rich music library, not the generic
    Music/Videos/Photos tree. Fall back to the first MediaServer found only
    if no MinimServer is present.
    """
    servers = [d for d in discover(force=force_discover).values()
               if d.device_type.startswith(DEVICE_TYPE_MEDIA_SERVER)]
    for d in servers:
        if "minimserver" in (d.manufacturer + d.model_name
                              + d.friendly_name).lower():
            return d
    return servers[0] if servers else None


def media_renderer(force_discover: bool = False,
                   friendly_name_hint: Optional[str] = None
                   ) -> Optional[UPnPDevice]:
    """Return the first MediaRenderer found, optionally filtered by name.

    Pass `friendly_name_hint` (case-insensitive substring) to disambiguate
    when multiple renderers are on the LAN.
    """
    devs = discover(force=force_discover).values()
    renderers = [d for d in devs
                 if d.device_type.startswith(DEVICE_TYPE_MEDIA_RENDERER)]
    if friendly_name_hint:
        h = friendly_name_hint.lower()
        for d in renderers:
            if h in d.friendly_name.lower():
                return d
    return renderers[0] if renderers else None


# ---------- SOAP envelope helpers -------------------------------------------

def _soap_envelope(service_type: str, action: str,
                   args: dict[str, str]) -> bytes:
    """Build a SOAP 1.1 envelope for a UPnP action."""
    arg_xml = "".join(
        f"<{k}>{_xml_escape(v)}</{k}>" for k, v in args.items()
    )
    body = (
        '<?xml version="1.0" encoding="utf-8"?>'
        '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" '
        's:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">'
        '<s:Body>'
        f'<u:{action} xmlns:u="{service_type}">'
        f'{arg_xml}'
        f'</u:{action}>'
        '</s:Body></s:Envelope>'
    )
    return body.encode("utf-8")


def _xml_escape(s: str) -> str:
    """Escape XML special chars for SOAP envelope construction."""
    return (s.replace("&", "&amp;")
             .replace("<", "&lt;")
             .replace(">", "&gt;")
             .replace('"', "&quot;")
             .replace("'", "&apos;"))


def _soap_call(control_url: str, service_type: str, action: str,
               args: dict[str, str], timeout: float = 6.0) -> ET.Element:
    """POST a SOAP action and return the parsed response body element."""
    headers = {
        "Content-Type": 'text/xml; charset="utf-8"',
        "SOAPAction": f'"{service_type}#{action}"',
    }
    body = _soap_envelope(service_type, action, args)
    try:
        r = requests.post(control_url, data=body, headers=headers,
                          timeout=timeout)
    except requests.RequestException as e:
        raise MinimServerError(f"SOAP {action} transport failed: {e}") from e
    if r.status_code >= 400:
        # Try to surface UPnPError detail if present
        detail = _extract_upnp_error(r.text) or r.text[:200]
        raise MinimServerError(
            f"SOAP {action} HTTP {r.status_code}: {detail}"
        )
    try:
        root = ET.fromstring(r.text)
    except ET.ParseError as e:
        raise MinimServerError(f"SOAP {action} response parse failed: {e}") from e
    return root


def _extract_upnp_error(body: str) -> str:
    """Try to pull the UPnPError code/description from a 500 response."""
    try:
        root = ET.fromstring(body)
    except ET.ParseError:
        return ""
    # Body / Fault / detail / UPnPError / errorCode + errorDescription
    fault = root.find(".//s:Fault", NS)
    if fault is None:
        return ""
    code_el = fault.find(".//{*}errorCode")
    desc_el = fault.find(".//{*}errorDescription")
    code = (code_el.text or "").strip() if code_el is not None else ""
    desc = (desc_el.text or "").strip() if desc_el is not None else ""
    return f"UPnP error {code}: {desc}" if (code or desc) else ""


# ---------- DIDL-Lite parsing -----------------------------------------------

_DURATION_RE = re.compile(r"^(\d+):(\d{2}):(\d{2})(?:\.\d+)?$")


def _parse_duration_to_ms(s: str) -> Optional[int]:
    """Parse 'H:MM:SS' or 'H:MM:SS.frac' to milliseconds."""
    if not s:
        return None
    m = _DURATION_RE.match(s)
    if not m:
        return None
    h, mi, sec = int(m.group(1)), int(m.group(2)), int(m.group(3))
    return (h * 3600 + mi * 60 + sec) * 1000


def _parse_didl_lite(didl_xml: str) -> list[dict[str, Any]]:
    """Parse a DIDL-Lite XML string into a list of item dicts.

    Each dict carries: kind ('container' or 'item'), id, parent_id, title,
    upnp_class, artist, album, genre, duration_ms, track_uri, thumb_url,
    and any other helpful fields. Unknown fields are dropped to keep the
    surface small.
    """
    if not didl_xml:
        return []
    try:
        root = ET.fromstring(didl_xml)
    except ET.ParseError:
        return []

    out: list[dict[str, Any]] = []

    # DIDL-Lite has containers and items. They share most metadata fields.
    for el in list(root):
      try:
        tag = el.tag.split("}", 1)[-1]
        if tag not in ("container", "item"):
            continue
        kind = tag
        obj_id = el.get("id") or ""
        parent_id = el.get("parentID") or ""
        child_count = el.get("childCount")

        title = _didl_text(el, "dc:title")
        upnp_class = _didl_text(el, "upnp:class")
        artist = _didl_text(el, "upnp:artist") or _didl_text(el, "dc:creator")
        album = _didl_text(el, "upnp:album")
        genre = _didl_text(el, "upnp:genre")
        date = _didl_text(el, "dc:date")
        original_track_no = _didl_text(el, "upnp:originalTrackNumber")
        album_art = _didl_text(el, "upnp:albumArtURI")

        # Track URI: <res> elements. Pick the first http(s) URL. Multiple
        # <res> entries are possible (different bitrates/formats); we take
        # the first that looks playable.
        track_uri = ""
        duration_ms = None
        protocol_info = ""
        for res_el in el.findall("didl:res", NS):
            uri = (res_el.text or "").strip()
            if not uri:
                continue
            track_uri = uri
            protocol_info = res_el.get("protocolInfo") or ""
            dur = res_el.get("duration") or ""
            duration_ms = _parse_duration_to_ms(dur)
            break

        item: dict[str, Any] = {
            "kind": kind,                   # container | item
            "id": obj_id,
            "parent_id": parent_id,
            "title": title,
            "upnp_class": upnp_class,
            "artist": artist,
            "album": album,
            "genre": genre,
            "date": date,
            "track_number": int(original_track_no) if original_track_no.isdigit() else None,
            "art_url": album_art or None,
            "track_uri": track_uri or None,
            "duration_ms": duration_ms,
            "protocol_info": protocol_info or None,
        }
        if child_count is not None:
            try:
                item["child_count"] = int(child_count)
            except ValueError:
                pass
        out.append(item)
      except Exception:
        # One malformed element must not discard the whole page.
        continue
    return out


def _didl_text(el: ET.Element, qname: str) -> str:
    """Get the text content of a DIDL-Lite child element by namespaced qname.

    `qname` is like 'dc:title' or 'upnp:artist'.
    """
    found = el.find(qname.replace("dc:", "{%s}" % NS_DC)
                       .replace("upnp:", "{%s}" % NS_UPNP)
                       .replace("didl:", "{%s}" % NS_DIDL))
    return (found.text or "").strip() if found is not None else ""


# ---------- MediaServer (MinimServer) ---------------------------------------

class MediaServer:
    """Wrapper around a discovered UPnP MediaServer (MinimServer)."""

    def __init__(self, device: UPnPDevice):
        self.device = device
        svc = device.service(NS_CDS)
        if svc is None:
            raise MinimServerError(
                f"device {device.friendly_name} has no ContentDirectory service"
            )
        self.cds = svc

    def browse(self, object_id: str = "0",
               browse_flag: str = "BrowseDirectChildren",
               start: int = 0, count: int = 200,
               sort: str = "") -> dict[str, Any]:
        """Browse a container (or fetch metadata for a single object).

        BrowseDirectChildren returns the children of `object_id`.
        BrowseMetadata returns metadata for `object_id` itself.
        Returns: {items, returned, total_matches, update_id, raw_didl}.
        """
        args = {
            "ObjectID": object_id,
            "BrowseFlag": browse_flag,
            "Filter": "*",
            "StartingIndex": str(int(start)),
            "RequestedCount": str(int(count)),
            "SortCriteria": sort,
        }
        return self._invoke("Browse", args)

    def search(self, container_id: str = "0",
               criteria: str = "", start: int = 0, count: int = 200,
               sort: str = "") -> dict[str, Any]:
        """Run a ContentDirectory:Search against the server.

        `criteria` is a UPnP search expression, e.g.
            'dc:title contains "shaboozey"'
            'upnp:class derivedfrom "object.item.audioItem"'
            'upnp:artist contains "zach bryan"'
        Returns same shape as browse().
        """
        args = {
            "ContainerID": container_id,
            "SearchCriteria": criteria,
            "Filter": "*",
            "StartingIndex": str(int(start)),
            "RequestedCount": str(int(count)),
            "SortCriteria": sort,
        }
        return self._invoke("Search", args)

    def get_search_capabilities(self) -> list[str]:
        """Return the properties supported by Search (CSV string -> list)."""
        root = _soap_call(self.cds.control_url, NS_CDS,
                          "GetSearchCapabilities", {})
        caps_el = root.find(".//{*}SearchCaps")
        caps = (caps_el.text or "") if caps_el is not None else ""
        return [c.strip() for c in caps.split(",") if c.strip()]

    def _invoke(self, action: str, args: dict[str, str]) -> dict[str, Any]:
        """Internal: invoke Browse/Search and unwrap the result."""
        root = _soap_call(self.cds.control_url, NS_CDS, action, args)
        # The response is /Envelope/Body/{Browse,Search}Response/{Result,...}
        result_el = root.find(".//{*}Result")
        returned_el = root.find(".//{*}NumberReturned")
        total_el = root.find(".//{*}TotalMatches")
        update_el = root.find(".//{*}UpdateID")
        result_xml = (result_el.text or "") if result_el is not None else ""
        # The DIDL-Lite arrives as an escaped string inside <Result>.
        # ElementTree already decodes one level of escaping when it reads
        # result_el.text, so result_xml is well-formed DIDL XML. Do NOT
        # html.unescape() it again: a second pass turns a legitimately
        # escaped "&amp;" in a title or albumArtURI into a raw "&", which
        # makes the DIDL invalid XML and (because _parse_didl_lite returns
        # [] on ParseError) silently zeroes the entire page.
        items = _parse_didl_lite(result_xml)
        return {
            "items": items,
            "returned": _safe_int(returned_el),
            "total_matches": _safe_int(total_el),
            "update_id": _safe_int(update_el),
            "raw_didl": result_xml,
        }


# ---------- MediaRenderer (Yamaha R-N800A) ---------------------------------

class MediaRenderer:
    """Wrapper around a discovered UPnP MediaRenderer (the Yamaha)."""

    def __init__(self, device: UPnPDevice):
        self.device = device
        svc = device.service(NS_AVT)
        if svc is None:
            raise MinimServerError(
                f"device {device.friendly_name} has no AVTransport service"
            )
        self.avt = svc

    def set_av_transport_uri(self, uri: str, didl_metadata: str = "") -> None:
        """Load a URI into the renderer (does NOT start playback)."""
        _soap_call(self.avt.control_url, NS_AVT, "SetAVTransportURI", {
            "InstanceID": "0",
            "CurrentURI": uri,
            "CurrentURIMetaData": didl_metadata,
        })

    def play(self, speed: str = "1") -> None:
        """Start playback of the currently-loaded URI."""
        _soap_call(self.avt.control_url, NS_AVT, "Play", {
            "InstanceID": "0",
            "Speed": speed,
        })

    def stop(self) -> None:
        _soap_call(self.avt.control_url, NS_AVT, "Stop", {"InstanceID": "0"})

    def pause(self) -> None:
        _soap_call(self.avt.control_url, NS_AVT, "Pause", {"InstanceID": "0"})


# ---------- one-shot helpers ------------------------------------------------

def play_track(track_uri: str, didl_metadata: str = "",
               renderer_hint: Optional[str] = "Yamaha") -> dict[str, Any]:
    """Push a track URI to the Yamaha (or named renderer) and play it.

    `track_uri` is the HTTP URL extracted from a MinimServer DIDL-Lite item.
    `didl_metadata` is the DIDL-Lite XML for that item (optional; some
    renderers ignore it but Yamaha may use it for display).
    Returns a small status dict with the renderer's friendly name.
    """
    dev = media_renderer(friendly_name_hint=renderer_hint)
    if dev is None:
        raise MinimServerError(
            f"no MediaRenderer found (hint='{renderer_hint}'); discovery may be "
            f"stale or the renderer may be off the LAN"
        )
    r = MediaRenderer(dev)
    r.set_av_transport_uri(track_uri, didl_metadata)
    r.play()
    return {
        "renderer": dev.friendly_name,
        "renderer_udn": dev.udn,
        "track_uri": track_uri,
    }


# ---------- small utilities -------------------------------------------------

def _safe_int(el: Optional[ET.Element]) -> int:
    """ET element -> int, or 0."""
    if el is None or not el.text:
        return 0
    try:
        return int(el.text.strip())
    except ValueError:
        return 0


def status_snapshot() -> dict[str, Any]:
    """Quick health report for the /api/miniserver/status route.

    Uses media_server() and media_renderer(friendly_name_hint="Yamaha") so
    the reported state mirrors what the actual play path will resolve to.
    Previously this function used a last-wins for-loop over SSDP order,
    which displayed whichever MediaRenderer happened to answer SSDP last
    (e.g. a Bose Lifestyle) rather than the renderer the Cockpit pushes
    URIs to. The functional play() path always preferred Yamaha; this
    function now matches that preference.
    """
    # Trigger discovery (no-op if cache is warm).
    discover()
    server_dev = media_server()
    renderer_dev = media_renderer(friendly_name_hint="Yamaha")

    def _short(d: Optional[UPnPDevice]) -> Optional[dict[str, str]]:
        if d is None:
            return None
        return {
            "friendly_name": d.friendly_name,
            "manufacturer": d.manufacturer,
            "model_name": d.model_name,
            "udn": d.udn,
            "location": d.location,
        }

    server = _short(server_dev)
    renderer = _short(renderer_dev)
    return {
        "state": "ready" if (server and renderer) else
                 ("server_only" if server else
                  ("renderer_only" if renderer else "unavailable")),
        "media_server": server,
        "media_renderer": renderer,
        "last_discovery_at": _last_discovery_at,
    }
