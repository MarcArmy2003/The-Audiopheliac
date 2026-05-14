"""Roon API client for the Audiopheliac Cockpit.

Wraps the `roonapi` package to provide library browse, full-library
search, and transport control. Communicates with the Roon Core via the
Roon extension protocol (WebSocket).

First-run authorization:
    1. The Cockpit registers itself as a Roon extension on first
       connect with no token.
    2. Open Roon (desktop, iPad, or phone remote), go to
       Settings -> Extensions, find "Audiopheliac Cockpit", and tap
       "Enable".
    3. The library returns an auth token, which the client persists at
       `console/roon_token.json` so subsequent runs reconnect silently.

Until authorization completes, library / search / playback calls raise
RoonNotAuthorized. The Yamaha YXC client remains available for the
receiver-side controls regardless.
"""
from __future__ import annotations

import json
import threading
import time
from pathlib import Path
from typing import Any, Optional

try:
    from roonapi import RoonApi, RoonDiscovery
except ImportError as e:  # pragma: no cover - import-time guard
    RoonApi = None  # type: ignore
    RoonDiscovery = None  # type: ignore
    _IMPORT_ERROR = str(e)
else:
    _IMPORT_ERROR = None


APPINFO = {
    "extension_id": "com.audiopheliac.cockpit",
    "display_name": "Audiopheliac Cockpit",
    "display_version": "0.2.0",
    "publisher": "The Audiopheliac",
    "email": "gillon.marchetti@gmail.com",
    "website": "http://127.0.0.1:5000",
}


class RoonNotAuthorized(Exception):
    """Raised when the Cockpit has not yet been authorized in Roon."""


class RoonError(Exception):
    """Raised for any other Roon API failure."""


# Connection state machine:
#   disconnected       initial
#   discovering        looking for a Roon Core via SSDP or config host
#   waiting_for_auth   connected to core, waiting for user to enable extension
#   connected          authorized; ready
#   error              fatal error; see RoonClient.error
class RoonClient:
    def __init__(self, token_path: Path, configured_host: Optional[str] = None):
        self.token_path = token_path
        self.configured_host = configured_host
        self.api: Optional[Any] = None
        self.state: str = "disconnected"
        self.error: Optional[str] = None
        self.core_name: Optional[str] = None
        self.host: Optional[str] = None
        self.port: Optional[int] = None
        self._lock = threading.Lock()
        self._thread: Optional[threading.Thread] = None

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    def start(self) -> None:
        if RoonApi is None:
            self.state = "error"
            self.error = f"roonapi not installed: {_IMPORT_ERROR}"
            return
        if self._thread and self._thread.is_alive():
            return
        t = threading.Thread(target=self._connect_loop, daemon=True, name="roon-connect")
        self._thread = t
        t.start()

    def _connect_loop(self) -> None:
        try:
            host, port = self._locate_core()
            if not host or not port:
                self.state = "error"
                self.error = "No Roon Core located (check NAS IP and Roon Core running)"
                return
            self.host, self.port = host, port
            token = self._load_token()
            self.state = "connected" if token else "waiting_for_auth"
            api = RoonApi(APPINFO, token=token, host=host, port=port, blocking_init=False)
            self.api = api

            # Poll until we have a token or fall over.
            deadline = time.time() + 300  # 5 minutes; user has to enable the extension
            while time.time() < deadline:
                if getattr(api, "token", None):
                    break
                time.sleep(1)
            if not getattr(api, "token", None):
                self.state = "error"
                self.error = "Authorization timed out. Enable the extension in Roon and restart."
                return

            self._save_token(api.token)
            self.state = "connected"
            # core_name attribute name varies between roonapi versions; try a few
            self.core_name = (
                getattr(api, "core_name", None)
                or getattr(api, "host", None)
                or host
            )
        except Exception as e:
            self.state = "error"
            self.error = f"{type(e).__name__}: {e}"

    def _locate_core(self) -> tuple[Optional[str], Optional[int]]:
        # Prefer the configured host (config.json roon_host) — skips SSDP entirely.
        if self.configured_host:
            return self.configured_host, 9330  # Roon's default extension port
        if RoonDiscovery is None:
            return None, None
        try:
            discovery = RoonDiscovery(None)
            for _ in range(10):
                cores = discovery.all()
                if cores:
                    return cores[0]
                time.sleep(1)
        except Exception:
            pass
        return None, None

    # ------------------------------------------------------------------
    # Persistence
    # ------------------------------------------------------------------

    def _load_token(self) -> Optional[str]:
        if not self.token_path.exists():
            return None
        try:
            with self.token_path.open("r", encoding="utf-8") as f:
                return json.load(f).get("token")
        except Exception:
            return None

    def _save_token(self, token: str) -> None:
        try:
            with self.token_path.open("w", encoding="utf-8") as f:
                json.dump({"token": token}, f)
        except Exception:
            pass

    # ------------------------------------------------------------------
    # Status & introspection
    # ------------------------------------------------------------------

    def status(self) -> dict[str, Any]:
        return {
            "state": self.state,
            "error": self.error,
            "core_name": self.core_name,
            "host": self.host,
            "port": self.port,
        }

    def _require_api(self):
        if self.state != "connected" or self.api is None:
            raise RoonNotAuthorized(self.error or f"Roon state: {self.state}")
        return self.api

    # ------------------------------------------------------------------
    # Zones & now playing
    # ------------------------------------------------------------------

    def zones(self) -> list[dict[str, Any]]:
        api = self._require_api()
        out = []
        zones = getattr(api, "zones", {}) or {}
        for zid, z in zones.items():
            outputs = z.get("outputs") or []
            # Pull volume info from the first output so the UI can render
            # per-zone sliders without a separate round-trip.
            vol_info: dict[str, Any] = {}
            if outputs:
                vol = outputs[0].get("volume") or {}
                vol_info = {
                    "value": vol.get("value"),
                    "min": vol.get("min", 0),
                    "max": vol.get("max", 100),
                    "is_muted": bool(vol.get("is_muted", False)),
                    "type": vol.get("type"),
                }
            out.append({
                "zone_id": zid,
                "display_name": z.get("display_name"),
                "state": z.get("state"),
                "outputs": [o.get("display_name") for o in outputs],
                "now_playing": z.get("now_playing"),
                "volume": vol_info,
            })
        return out

    def now_playing(self, zone_id: str) -> Optional[dict[str, Any]]:
        api = self._require_api()
        zones = getattr(api, "zones", {}) or {}
        z = zones.get(zone_id)
        if not z:
            return None
        np = z.get("now_playing") or {}
        three = np.get("three_line") or {}
        two = np.get("two_line") or {}
        one = np.get("one_line") or {}
        return {
            "title": three.get("line1") or two.get("line1") or one.get("line1") or np.get("title"),
            "artist": three.get("line2") or two.get("line2") or np.get("artist"),
            "album": three.get("line3") or np.get("album"),
            "image_key": np.get("image_key"),
            "seek_position": np.get("seek_position", 0),
            "length": np.get("length", 0),
            "state": z.get("state"),
        }

    def image_url(self, image_key: str, size: int = 256) -> Optional[str]:
        api = self._require_api()
        try:
            return api.get_image(image_key, scale="fit", width=size, height=size)
        except Exception:
            return None

    # ------------------------------------------------------------------
    # Browse / search
    # ------------------------------------------------------------------

    def _browse_browse(self, opts: dict[str, Any]) -> dict[str, Any]:
        api = self._require_api()
        try:
            return api.browse_browse(opts) or {}
        except Exception as e:
            raise RoonError(f"browse_browse failed: {e}") from e

    def _browse_load(self, hierarchy: str = "browse", offset: int = 0,
                     count: int = 100) -> dict[str, Any]:
        api = self._require_api()
        try:
            result = api.browse_load({
                "hierarchy": hierarchy,
                "offset": offset,
                "count": count,
            }) or {}
        except Exception as e:
            raise RoonError(f"browse_load failed: {e}") from e
        # Enrich items with resolved image URLs so the browser doesn't
        # round-trip through this server for every thumbnail.
        for item in result.get("items", []) or []:
            key = item.get("image_key")
            if key:
                item["image_url"] = self.image_url(key, size=80)
        return result

    def browse_root(self, zone_id: str) -> dict[str, Any]:
        self._browse_browse({
            "hierarchy": "browse",
            "pop_all": True,
            "zone_or_output_id": zone_id,
        })
        return self._browse_load()

    def browse_descend(self, zone_id: str, item_key: str) -> dict[str, Any]:
        self._browse_browse({
            "hierarchy": "browse",
            "item_key": item_key,
            "zone_or_output_id": zone_id,
        })
        return self._browse_load()

    def browse_back(self, zone_id: str) -> dict[str, Any]:
        self._browse_browse({
            "hierarchy": "browse",
            "pop_levels": 1,
            "zone_or_output_id": zone_id,
        })
        return self._browse_load()

    def browse_page(self, offset: int = 0, count: int = 100) -> dict[str, Any]:
        return self._browse_load(offset=offset, count=count)

    def browse_path(self, zone_id: str, segments: list[str]) -> dict[str, Any]:
        """Navigate Roon browse hierarchy by segment names without playing.

        Walks from root through each named segment (case-insensitive).
        Returns the browse_load result at the destination.
        Returns {} if any segment is not found or segments list is empty.
        Does NOT play anything.
        """
        if not segments:
            return {}
        # Start at root; load up to 200 items to cover all top-level entries.
        self._browse_browse({
            "hierarchy": "browse",
            "pop_all": True,
            "zone_or_output_id": zone_id,
        })
        result = self._browse_load(count=200)
        for seg in segments:
            items = result.get("items") or []
            match = next(
                (it for it in items
                 if (it.get("title") or "").strip().lower() == seg.strip().lower()),
                None,
            )
            if not match or not match.get("item_key"):
                return {}  # segment not found at this level
            result = self.browse_descend(zone_id, match["item_key"])
            if not result:
                return {}
        return result

    def search(self, zone_id: str, query: str) -> dict[str, Any]:
        """Roon full-library search.

        Roon's Search entry is typically nested under Library, not at the
        root. Walk: root -> find an entry whose title contains "search"
        OR descend into Library first then look for Search. Whichever is
        found, descend, submit input=query, load results.

        Field-test 2026-05-12: the v0.6 implementation only checked the
        root for a Search entry and fell through to "input at root" which
        Roon ignores, returning the regular root menu.
        """
        api = self._require_api()

        def _find_search_item(items: list[dict]) -> dict | None:
            for it in items or []:
                title = (it.get("title") or "").strip().lower()
                if title == "search" or title.startswith("search "):
                    return it
            return None

        try:
            # Step 1: pop to root.
            api.browse_browse({
                "hierarchy": "browse",
                "pop_all": True,
                "zone_or_output_id": zone_id,
            })
            root = api.browse_load({
                "hierarchy": "browse", "offset": 0, "count": 200,
            }) or {}

            # Step 2: try to find Search at the root first.
            search_item = _find_search_item(root.get("items") or [])

            # Step 3: if not at root, descend into Library and look there.
            if not search_item:
                library_item = next(
                    (it for it in (root.get("items") or [])
                     if (it.get("title") or "").strip().lower() == "library"),
                    None,
                )
                if library_item and library_item.get("item_key"):
                    api.browse_browse({
                        "hierarchy": "browse",
                        "item_key": library_item["item_key"],
                        "zone_or_output_id": zone_id,
                    })
                    library = api.browse_load({
                        "hierarchy": "browse", "offset": 0, "count": 200,
                    }) or {}
                    search_item = _find_search_item(library.get("items") or [])

            # Step 4: descend into Search.
            if search_item and search_item.get("item_key"):
                api.browse_browse({
                    "hierarchy": "browse",
                    "item_key": search_item["item_key"],
                    "zone_or_output_id": zone_id,
                })

            # Step 5: submit the query as input at the current level.
            api.browse_browse({
                "hierarchy": "browse",
                "input": query,
                "zone_or_output_id": zone_id,
            })

            # Step 6: load the results.
            result = api.browse_load({
                "hierarchy": "browse", "offset": 0, "count": 200,
            }) or {}
        except Exception as e:
            raise RoonError(f"search failed: {e}") from e

        for item in result.get("items", []) or []:
            key = item.get("image_key")
            if key:
                item["image_url"] = self.image_url(key, size=80)
        return result

    # ------------------------------------------------------------------
    # Raw browse access (for debugging / UI inspection)
    # ------------------------------------------------------------------

    def debug_browse(self, zone_id: str | None = None) -> dict[str, Any]:
        """Return the current browse state at the cursor without moving it.

        Used by `/api/roon/debug/browse` to surface Roon's actual response
        shape so the UI can adapt. No side effects on the browse cursor.
        """
        api = self._require_api()
        try:
            loaded = api.browse_load({
                "hierarchy": "browse", "offset": 0, "count": 200,
            }) or {}
        except Exception as e:
            raise RoonError(f"debug_browse failed: {e}") from e
        return loaded

    # ------------------------------------------------------------------
    # Playback
    # ------------------------------------------------------------------

    # Titles that mean "fire this action now" if found inside an action sub-list.
    PLAY_TITLES = (
        "play now", "play", "play album", "play track", "play artist",
        "play playlist", "play tracks", "play song", "start radio",
    )

    def select_action(self, zone_id: str, item_key: str) -> dict[str, Any]:
        """Click any browse item.

        - If Roon descends into a sub-list whose items are all action-hinted,
          look for a "Play Now"-style entry and auto-fire it. Up to two
          levels of descent (covers "Play Album" -> action menu -> Play Now).
        - Otherwise, return the loaded list so the UI can render it.

        Sets `_auto_played` and `_descent_depth` on the returned payload for
        the UI to surface what happened.
        """
        api = self._require_api()
        depth = 0
        auto_played = False

        def _do_click(key: str) -> dict[str, Any]:
            api.browse_browse({
                "hierarchy": "browse",
                "item_key": key,
                "zone_or_output_id": zone_id,
            })
            return api.browse_load({
                "hierarchy": "browse", "offset": 0, "count": 200,
            }) or {}

        try:
            loaded = _do_click(item_key)
            depth = 1
            for _ in range(2):
                items = loaded.get("items") or []
                if not items:
                    break
                action_items = [
                    it for it in items
                    if (it.get("hint") or "").lower() == "action"
                ]
                if not action_items:
                    break
                play_item = self._pick_play_item(action_items)
                if not play_item or not play_item.get("item_key"):
                    break
                loaded = _do_click(play_item["item_key"])
                depth += 1
                auto_played = True
        except Exception as e:
            raise RoonError(f"select_action failed: {e}") from e

        for item in loaded.get("items", []) or []:
            key = item.get("image_key")
            if key:
                item["image_url"] = self.image_url(key, size=80)
        loaded["_auto_played"] = auto_played
        loaded["_descent_depth"] = depth
        return loaded

    def _pick_play_item(self, items: list[dict]) -> dict | None:
        """Return the first action item whose title indicates 'play now'."""
        for needle in self.PLAY_TITLES:
            for it in items:
                title = (it.get("title") or "").strip().lower()
                if title == needle:
                    return it
        # Looser: any title that starts with "play"
        for it in items:
            title = (it.get("title") or "").strip().lower()
            if title.startswith("play "):
                return it
        return None

    def play_path(self, zone_id: str, path: list[str]) -> dict[str, Any]:
        """Walk a browse path by name match at each level, then play.

        Example path: ["Library", "Albums", "Mom, We See You"]
        At each segment, browse_loads the current level, finds an item whose
        title matches (case-insensitive), and descends. At the final segment,
        relies on select_action's auto-play-now logic to fire playback.

        Raises RoonError if any segment fails to match.
        """
        if not path:
            raise RoonError("play_path: empty path")
        api = self._require_api()
        try:
            api.browse_browse({
                "hierarchy": "browse",
                "pop_all": True,
                "zone_or_output_id": zone_id,
            })
            for i, segment in enumerate(path):
                loaded = api.browse_load({
                    "hierarchy": "browse", "offset": 0, "count": 500,
                }) or {}
                items = loaded.get("items") or []
                target = next(
                    (it for it in items
                     if (it.get("title") or "").strip().lower() == segment.strip().lower()),
                    None,
                )
                if not target:
                    target = next(
                        (it for it in items
                         if segment.strip().lower() in (it.get("title") or "").strip().lower()),
                        None,
                    )
                if not target or not target.get("item_key"):
                    raise RoonError(
                        f"play_path: segment {segment!r} not found at level {i}. "
                        f"Available titles: "
                        + ", ".join(repr(it.get("title")) for it in items[:10])
                    )
                api.browse_browse({
                    "hierarchy": "browse",
                    "item_key": target["item_key"],
                    "zone_or_output_id": zone_id,
                })
        except RoonError:
            raise
        except Exception as e:
            raise RoonError(f"play_path navigation failed: {e}") from e
        # Now at the leaf; reuse select_action's auto-play logic.
        loaded = api.browse_load({
            "hierarchy": "browse", "offset": 0, "count": 200,
        }) or {}
        items = loaded.get("items") or []
        action_items = [
            it for it in items if (it.get("hint") or "").lower() == "action"
        ] or items
        play_item = self._pick_play_item(action_items)
        if not play_item:
            raise RoonError(
                "play_path: leaf reached but no play action available. "
                "Items: " + ", ".join(repr(it.get("title")) for it in items[:10])
            )
        try:
            api.browse_browse({
                "hierarchy": "browse",
                "item_key": play_item["item_key"],
                "zone_or_output_id": zone_id,
            })
        except Exception as e:
            raise RoonError(f"play_path play action failed: {e}") from e
        return {"played": True, "path": path}

    def set_zone_volume(self, zone_id: str, level: int) -> None:
        """Set absolute volume (0-100) on the first output of a zone.

        Uses roonapi.change_volume(output_id, "absolute", level). Volume
        range is 0-100; values are clamped before the call. Some outputs
        may report a narrower range via volume.min / volume.max -- the
        clamp here is conservative; Roon will silently cap at hard limits.
        """
        api = self._require_api()
        zones = getattr(api, "zones", {}) or {}
        z = zones.get(zone_id)
        if not z:
            raise RoonError(f"Zone {zone_id!r} not found")
        outputs = z.get("outputs") or []
        if not outputs:
            raise RoonError(f"Zone {zone_id!r} has no outputs")
        output_id = outputs[0].get("output_id")
        if not output_id:
            raise RoonError(f"Zone {zone_id!r} first output has no output_id")
        level = max(0, min(100, int(level)))
        try:
            api.change_volume(output_id, "absolute", level)
        except Exception as e:
            raise RoonError(f"set_zone_volume failed: {e}") from e

    def zone_queue(self, zone_id: str) -> list[dict[str, Any]]:
        """Return upcoming tracks in a zone's play queue (up to 30 items).

        Navigates browse root with zone context and looks for a top-level
        "Queue" entry. Returns an empty list if Roon has no queue loaded,
        the zone is idle, or browse navigation fails -- the UI handles all
        three states gracefully.
        """
        api = self._require_api()
        try:
            api.browse_browse({
                "hierarchy": "browse",
                "pop_all": True,
                "zone_or_output_id": zone_id,
            })
            root = api.browse_load({
                "hierarchy": "browse", "offset": 0, "count": 100,
            }) or {}
            queue_item = next(
                (it for it in (root.get("items") or [])
                 if (it.get("title") or "").strip().lower() == "queue"),
                None,
            )
            if not queue_item or not queue_item.get("item_key"):
                return []
            api.browse_browse({
                "hierarchy": "browse",
                "item_key": queue_item["item_key"],
                "zone_or_output_id": zone_id,
            })
            loaded = api.browse_load({
                "hierarchy": "browse", "offset": 0, "count": 30,
            }) or {}
            return [
                {
                    "title": it.get("title"),
                    "subtitle": it.get("subtitle"),
                    "duration": it.get("duration"),
                    "image_key": it.get("image_key"),
                }
                for it in (loaded.get("items") or [])
            ]
        except Exception:
            return []

    def transport(self, zone_id: str, action: str) -> None:
        api = self._require_api()
        # roonapi exposes playback_control(zone_or_output_id, control)
        # Valid controls: play, pause, playpause, stop, previous, next
        if action not in ("play", "pause", "playpause", "stop", "previous", "next"):
            raise RoonError(f"Unsupported transport action: {action}")
        try:
            api.playback_control(zone_id, control=action)
        except Exception as e:
            raise RoonError(f"transport failed: {e}") from e


# ----------------------------------------------------------------------
# System dependencies: Roon Bridge service (Windows) and Roon Server
# container (QNAP NAS). Used by the Cockpit's single-trigger bootstrap.
# ----------------------------------------------------------------------

import subprocess

# When the Cockpit runs under pythonw.exe (no console), every subprocess
# that spawns a console child (sc, tasklist, ssh) will flash a black
# window for a few hundred ms unless we explicitly suppress it.
# Field-test 2026-05-12: Gill saw "annoying black flashing box every
# 3 - 5 seconds." Cause was unsuppressed tasklist polling from
# windows_process_running. Same fix applied to every helper here.
_NO_WINDOW = 0x08000000  # subprocess.CREATE_NO_WINDOW on Windows


def windows_service_status(service_name: str) -> str:
    """Return 'running', 'stopped', 'not_installed', or 'unknown'.

    Uses `sc query` (no admin required for read).
    """
    try:
        r = subprocess.run(
            ["sc", "query", service_name],
            capture_output=True, text=True, timeout=5,
            creationflags=_NO_WINDOW,
        )
    except (subprocess.SubprocessError, OSError):
        return "unknown"
    out = (r.stdout or "") + (r.stderr or "")
    if "FAILED 1060" in out or "does not exist" in out.lower():
        return "not_installed"
    if "RUNNING" in out:
        return "running"
    if "STOPPED" in out or "STOP_PENDING" in out:
        return "stopped"
    if "START_PENDING" in out:
        return "starting"
    return "unknown"


def windows_service_start(service_name: str) -> tuple[bool, str]:
    """Start a Windows service. Returns (success, message).

    `sc start` requires the user to have Service Control permissions.
    Gill is local admin on GDMARCHE; if not, returns the OS error message.
    """
    try:
        r = subprocess.run(
            ["sc", "start", service_name],
            capture_output=True, text=True, timeout=10,
            creationflags=_NO_WINDOW,
        )
    except (subprocess.SubprocessError, OSError) as e:
        return False, str(e)
    out = (r.stdout or "") + (r.stderr or "")
    if r.returncode == 0 or "START_PENDING" in out or "RUNNING" in out:
        return True, "service start requested"
    if "FAILED 5" in out or "Access is denied" in out:
        return False, "access denied; run Cockpit as admin or grant service-start permission"
    if "FAILED 1056" in out:
        return True, "already running"
    return False, out.strip()[:200] or "unknown"


def windows_process_running(process_name: str) -> bool:
    """Return True if a Windows process by image name is running.

    `process_name` should be the executable name without `.exe`. Uses
    `tasklist` with a name filter and CSV output, no header row.

    Detects user-mode Roon Bridge (`RAATServer.exe`) which does not
    register as a Windows service. Complement to `windows_service_status`.
    """
    exe = process_name if process_name.lower().endswith(".exe") else f"{process_name}.exe"
    try:
        r = subprocess.run(
            ["tasklist", "/FI", f"IMAGENAME eq {exe}", "/FO", "CSV", "/NH"],
            capture_output=True, text=True, timeout=5,
            creationflags=_NO_WINDOW,
        )
    except (subprocess.SubprocessError, OSError):
        return False
    out = (r.stdout or "").strip()
    if not out:
        return False
    # tasklist prints "INFO: No tasks are running..." to stdout (not stderr)
    # when nothing matches. Treat that as not-running.
    if out.lower().startswith("info:"):
        return False
    return exe.lower() in out.lower()


def nas_ssh_exec(host: str, key_path: str, command: str, timeout: float = 8.0) -> tuple[int, str, str]:
    """Run a command on the NAS over SSH using Windows' built-in ssh.exe.

    Returns (returncode, stdout, stderr). No interactive prompts.
    """
    try:
        r = subprocess.run(
            [
                "ssh",
                "-i", key_path,
                "-o", "BatchMode=yes",
                "-o", "StrictHostKeyChecking=accept-new",
                "-o", f"ConnectTimeout={int(timeout)}",
                host,
                command,
            ],
            capture_output=True, text=True, timeout=timeout + 2,
            creationflags=_NO_WINDOW,
        )
        return r.returncode, r.stdout or "", r.stderr or ""
    except (subprocess.SubprocessError, OSError) as e:
        return -1, "", str(e)
