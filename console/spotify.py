"""Spotify Web API client for the Audiopheliac Cockpit.

Server-side OAuth Authorization Code flow via spotipy.
Token cache is local (gitignored), no secrets ever leave the Flask process.
"""
from __future__ import annotations

import json
import threading
from pathlib import Path
from typing import Any

try:
    import spotipy
    from spotipy.oauth2 import SpotifyOAuth
except ImportError as exc:  # pragma: no cover
    raise RuntimeError(
        "spotipy is not installed. Run: pip install -r console/requirements.txt"
    ) from exc


SCOPES = " ".join([
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-private",
    "user-library-read",
    "playlist-read-private",
    "playlist-read-collaborative",
])


class SpotifyConfigError(RuntimeError):
    pass


class SpotifyError(RuntimeError):
    pass


class SpotifyClient:
    """Thin wrapper around spotipy.Spotify scoped for the Cockpit's needs."""

    def __init__(
        self,
        client_id: str,
        client_secret: str,
        redirect_uri: str,
        token_path: Path,
    ) -> None:
        if not client_id or not client_secret:
            raise SpotifyConfigError(
                "Spotify client_id and client_secret must be set "
                "(see console/config.json and console/spotify_secret.json)."
            )
        self.client_id = client_id
        self.client_secret = client_secret
        self.redirect_uri = redirect_uri
        self.token_path = token_path
        self._lock = threading.Lock()
        self._oauth = SpotifyOAuth(
            client_id=client_id,
            client_secret=client_secret,
            redirect_uri=redirect_uri,
            scope=SCOPES,
            cache_path=str(token_path),
            open_browser=False,
        )

    # ----- auth -----

    def auth_url(self) -> str:
        return self._oauth.get_authorize_url()

    def exchange_code(self, code: str) -> dict[str, Any]:
        token = self._oauth.get_access_token(code, as_dict=True, check_cache=False)
        return token

    def is_authorized(self) -> bool:
        try:
            token = self._oauth.get_cached_token()
        except Exception:
            return False
        return bool(token and token.get("access_token"))

    # ----- client -----

    def _client(self) -> "spotipy.Spotify":
        with self._lock:
            return spotipy.Spotify(auth_manager=self._oauth)

    def _call(self, fn_name: str, *args, **kwargs):
        try:
            sp = self._client()
            fn = getattr(sp, fn_name)
            return fn(*args, **kwargs)
        except spotipy.SpotifyException as e:
            raise SpotifyError(f"{fn_name}: {e}") from e
        except Exception as e:
            raise SpotifyError(f"{fn_name}: {e}") from e

    # ----- playback state -----

    def me(self) -> dict[str, Any]:
        return self._call("current_user") or {}

    def status(self) -> dict[str, Any]:
        cp = self._call("current_playback") or {}
        if not cp:
            return {"is_playing": False, "device": None, "item": None}
        return cp

    def now_playing(self) -> dict[str, Any]:
        cp = self.status()
        if not cp:
            return {}
        item = cp.get("item") or {}
        device = cp.get("device") or {}
        artists = ", ".join(a.get("name", "") for a in (item.get("artists") or []))
        album = (item.get("album") or {}).get("name", "")
        images = (item.get("album") or {}).get("images") or []
        art_url = images[0]["url"] if images else None
        return {
            "is_playing": cp.get("is_playing", False),
            "progress_ms": cp.get("progress_ms"),
            "track_id": item.get("id"),
            "track_uri": item.get("uri"),
            "track_name": item.get("name"),
            "track_artists": artists,
            "track_album": album,
            "track_duration_ms": item.get("duration_ms"),
            "track_explicit": item.get("explicit"),
            "art_url": art_url,
            "device": {
                "id": device.get("id"),
                "name": device.get("name"),
                "type": device.get("type"),
                "volume_percent": device.get("volume_percent"),
                "is_active": device.get("is_active"),
                "is_restricted": device.get("is_restricted"),
            } if device else None,
            "shuffle_state": cp.get("shuffle_state"),
            "repeat_state": cp.get("repeat_state"),
            "context_uri": (cp.get("context") or {}).get("uri") if cp.get("context") else None,
        }

    def devices(self) -> list[dict[str, Any]]:
        d = self._call("devices") or {}
        return d.get("devices", [])

    def transfer_to(self, device_id: str, play: bool = False) -> None:
        self._call("transfer_playback", device_id=device_id, force_play=play)

    # ----- playback control -----

    def play(self, device_id: str | None = None, context_uri: str | None = None,
             uris: list[str] | None = None, offset: dict | None = None,
             position_ms: int | None = None) -> None:
        kwargs: dict[str, Any] = {}
        if device_id: kwargs["device_id"] = device_id
        if context_uri: kwargs["context_uri"] = context_uri
        if uris: kwargs["uris"] = uris
        if offset: kwargs["offset"] = offset
        if position_ms is not None: kwargs["position_ms"] = position_ms
        self._call("start_playback", **kwargs)

    def pause(self, device_id: str | None = None) -> None:
        self._call("pause_playback", device_id=device_id) if device_id else self._call("pause_playback")

    def next(self, device_id: str | None = None) -> None:
        self._call("next_track", device_id=device_id) if device_id else self._call("next_track")

    def previous(self, device_id: str | None = None) -> None:
        self._call("previous_track", device_id=device_id) if device_id else self._call("previous_track")

    def seek(self, position_ms: int, device_id: str | None = None) -> None:
        if device_id:
            self._call("seek_track", position_ms, device_id=device_id)
        else:
            self._call("seek_track", position_ms)

    def set_volume(self, level: int, device_id: str | None = None) -> None:
        level = max(0, min(100, int(level)))
        if device_id:
            self._call("volume", level, device_id=device_id)
        else:
            self._call("volume", level)

    def set_shuffle(self, state: bool, device_id: str | None = None) -> None:
        if device_id:
            self._call("shuffle", state, device_id=device_id)
        else:
            self._call("shuffle", state)

    def set_repeat(self, state: str, device_id: str | None = None) -> None:
        # state must be one of: track, context, off
        if state not in ("track", "context", "off"):
            raise SpotifyError(f"invalid repeat state: {state}")
        if device_id:
            self._call("repeat", state, device_id=device_id)
        else:
            self._call("repeat", state)

    # ----- search + library -----

    def search(self, q: str, kinds: str = "track,album,artist,playlist",
               limit: int = 20, market: str | None = None) -> dict[str, Any]:
        # Spotify enforces limit * num_types <= 50 on multi-type searches.
        # With 4 types and limit=20 the API returns a 400 "Invalid limit".
        # Cap to floor(50 / num_types) so the constraint is always satisfied.
        type_list = [k.strip() for k in kinds.split(",") if k.strip()]
        # Spotify Development Mode apps are capped at 10 results per search call
        # regardless of type count. Empirically verified: limit=11 with any type
        # count returns HTTP 400 "Invalid limit".
        safe_limit = min(limit, 10)
        kwargs: dict[str, Any] = {"q": q, "type": kinds, "limit": safe_limit}
        if market: kwargs["market"] = market
        result = self._call("search", **kwargs) or {}
        flattened: dict[str, list[dict[str, Any]]] = {}
        for kind in type_list:
            bucket = result.get(f"{kind}s") or {}
            items = bucket.get("items") or []
            flattened[kind] = [self._flatten_search_item(kind, it) for it in items if it]
        return flattened

    @staticmethod
    def _flatten_search_item(kind: str, item: dict[str, Any]) -> dict[str, Any]:
        images = item.get("images") or (item.get("album") or {}).get("images") or []
        art_url = images[0]["url"] if images else None
        if kind == "track":
            artists = ", ".join(a.get("name", "") for a in (item.get("artists") or []))
            album = (item.get("album") or {}).get("name", "")
            return {
                "kind": "track",
                "uri": item.get("uri"),
                "id": item.get("id"),
                "name": item.get("name"),
                "subtitle": f"{artists} · {album}".strip(" ·"),
                "art_url": art_url,
                "duration_ms": item.get("duration_ms"),
                "explicit": item.get("explicit"),
            }
        if kind == "album":
            artists = ", ".join(a.get("name", "") for a in (item.get("artists") or []))
            return {
                "kind": "album",
                "uri": item.get("uri"),
                "id": item.get("id"),
                "name": item.get("name"),
                "subtitle": artists,
                "art_url": art_url,
            }
        if kind == "artist":
            return {
                "kind": "artist",
                "uri": item.get("uri"),
                "id": item.get("id"),
                "name": item.get("name"),
                "subtitle": ", ".join(item.get("genres") or [])[:80],
                "art_url": art_url,
            }
        if kind == "playlist":
            owner = (item.get("owner") or {}).get("display_name", "")
            tracks = (item.get("tracks") or {}).get("total")
            return {
                "kind": "playlist",
                "uri": item.get("uri"),
                "id": item.get("id"),
                "name": item.get("name"),
                "subtitle": f"{owner} · {tracks} tracks" if tracks else owner,
                "art_url": art_url,
            }
        return {"kind": kind, "uri": item.get("uri"), "name": item.get("name"), "art_url": art_url}

    def playlists(self, limit: int = 50) -> list[dict[str, Any]]:
        out: list[dict[str, Any]] = []
        offset = 0
        while True:
            page = self._call("current_user_playlists", limit=min(50, limit), offset=offset) or {}
            items = page.get("items") or []
            for it in items:
                images = it.get("images") or []
                art = images[0]["url"] if images else None
                out.append({
                    "uri": it.get("uri"),
                    "id": it.get("id"),
                    "name": it.get("name"),
                    "owner": (it.get("owner") or {}).get("display_name"),
                    "tracks": (it.get("tracks") or {}).get("total"),
                    "art_url": art,
                    "public": it.get("public"),
                })
                if len(out) >= limit:
                    return out
            if not page.get("next"):
                break
            offset += len(items) or 50
            if not items:
                break
        return out

    def queue(self) -> dict[str, Any]:
        """Return up to 20 upcoming tracks in the Spotify playback queue."""
        try:
            result = self._call("queue") or {}
        except SpotifyError:
            return {"queue": []}
        items = []
        for t in result.get("queue") or []:
            if not t or t.get("type") != "track":
                continue
            artists = ", ".join(a.get("name", "") for a in (t.get("artists") or []))
            items.append({
                "track_name": t.get("name") or "",
                "track_artists": artists,
                "track_duration_ms": t.get("duration_ms") or 0,
                "track_uri": t.get("uri") or "",
                "track_album": (t.get("album") or {}).get("name") or "",
            })
        return {"queue": items}
