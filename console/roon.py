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
    "website": "https://theaudiopheliac.com",
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
            out.append({
                "zone_id": zid,
                "display_name": z.get("display_name"),
                "state": z.get("state"),
                "outputs": [o.get("display_name") for o in (z.get("outputs") or [])],
                "now_playing": z.get("now_playing"),
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

    def search(self, zone_id: str, query: str) -> dict[str, Any]:
        # Roon search: pop the browse session to root and pass the query
        # as `input`. Roon returns a results hierarchy (Artists, Albums,
        # Tracks, etc.) which we then load.
        self._browse_browse({
            "hierarchy": "browse",
            "pop_all": True,
            "zone_or_output_id": zone_id,
            "input": query,
        })
        return self._browse_load()

    # ------------------------------------------------------------------
    # Playback
    # ------------------------------------------------------------------

    def select_action(self, zone_id: str, item_key: str) -> dict[str, Any]:
        """Click an action-list item (e.g. "Play Now", "Queue", "Add Next")."""
        self._browse_browse({
            "hierarchy": "browse",
            "item_key": item_key,
            "zone_or_output_id": zone_id,
        })
        # Action items return empty or move on; reload to surface what happened
        return self._browse_load()

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
