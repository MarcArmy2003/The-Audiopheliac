"""Audiopheliac Cockpit v0.9 - Spotify + YXC only (Roon removed).

Run with:  python app.py            (foreground, dev)
       or  pythonw launch.pyw       (silent, Chrome --app, production)
"""
from __future__ import annotations

import json
import random
import threading
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path
from secrets import token_urlsafe
from typing import Any

from flask import Flask, abort, jsonify, render_template, request
from markupsafe import escape

from yamaha import Yamaha, YamahaError
from spotify import SpotifyClient, SpotifyConfigError, SpotifyError


__version__ = "0.9"

HERE = Path(__file__).resolve().parent
CONFIG_PATH = HERE / "config.json"
PLAYLIST_PATH = HERE / "playlist.json"
SPOTIFY_TOKEN_PATH = HERE / "spotify_token.json"
SPOTIFY_SECRET_PATH = HERE / "spotify_secret.json"
_playlist_lock = threading.Lock()
DEFAULT_CONFIG = {
    "yamaha_ip": "192.168.1.191",
    "yamaha_name": "Yamaha R-N800A (Family Room)",
    "host": "127.0.0.1",
    "port": 5000,
}


def load_config() -> dict[str, Any]:
    if CONFIG_PATH.exists():
        with CONFIG_PATH.open("r", encoding="utf-8") as f:
            return {**DEFAULT_CONFIG, **json.load(f)}
    return DEFAULT_CONFIG


def load_spotify_secret() -> str | None:
    """Read the Spotify client_secret from gitignored local config.

    Checks two locations in order:
      1. console/spotify_secret.json   -- {"client_secret": "..."}
      2. config/spotify.env            -- SPOTIFY_CLIENT_SECRET=...

    The second is the pipeline's canonical secret store (consumed by
    automation/spotify_pull.py and friends). The Cockpit reads from the
    same source so we don't fork the secret across two files.
    """
    if SPOTIFY_SECRET_PATH.exists():
        try:
            with SPOTIFY_SECRET_PATH.open("r", encoding="utf-8") as f:
                data = json.load(f)
            secret = data.get("client_secret")
            if secret:
                return secret
        except (json.JSONDecodeError, OSError):
            pass
    pipeline_env = HERE.parent / "config" / "spotify.env"
    if pipeline_env.exists():
        try:
            with pipeline_env.open("r", encoding="utf-8") as f:
                for raw in f:
                    line = raw.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    key, val = line.split("=", 1)
                    if key.strip() == "SPOTIFY_CLIENT_SECRET":
                        return val.strip().strip('"').strip("'") or None
        except OSError:
            pass
    return None


def build_spotify_client(cfg: dict[str, Any]) -> SpotifyClient | None:
    sp_cfg = cfg.get("spotify") or {}
    client_id = sp_cfg.get("client_id")
    redirect_uri = sp_cfg.get("redirect_uri", "http://127.0.0.1:5000/spotify/callback")
    secret = load_spotify_secret()
    if not client_id or not secret:
        return None
    try:
        return SpotifyClient(
            client_id=client_id,
            client_secret=secret,
            redirect_uri=redirect_uri,
            token_path=SPOTIFY_TOKEN_PATH,
        )
    except SpotifyConfigError:
        return None


def load_playlist() -> list[dict[str, Any]]:
    if not PLAYLIST_PATH.exists():
        return []
    try:
        with PLAYLIST_PATH.open("r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError):
        return []


def save_playlist(items: list[dict[str, Any]]) -> None:
    tmp = PLAYLIST_PATH.with_suffix(".json.tmp")
    with tmp.open("w", encoding="utf-8") as f:
        json.dump(items, f, indent=2)
    tmp.replace(PLAYLIST_PATH)


config = load_config()
yam = Yamaha(host=config["yamaha_ip"])
spotify = build_spotify_client(config)
app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0  # no browser cache for local dev

SPOTIFY_YAMAHA_HINT_DEFAULT = "Yamaha R-N800A"
SPOTIFY_YAMAHA_HINT_FALLBACKS = ["Yamaha R-N800A", "R-N800A", "Yamaha", "MusicCast"]

# Per-process CSRF token + loopback Host allowlist. Generated fresh on each
# Flask start so a browser tab from a previous process gets a 403 and must
# reload (the UI surfaces that on 403). Codex audit 2026-05-12, HIGH-1.
CSRF_TOKEN = token_urlsafe(32)
_MUTATING_METHODS = {"POST", "PUT", "PATCH", "DELETE"}
_ALLOWED_HOSTS = {"127.0.0.1", "localhost"}


@app.before_request
def protect_local_control_surface():
    """Enforce loopback Host header on all requests, Origin allowlist and
    CSRF token on mutating methods. Defense against DNS rebinding and
    cross-site form submissions targeting the Cockpit."""
    host = (request.host or "").split(":", 1)[0].lower()
    if host not in _ALLOWED_HOSTS:
        abort(403)
    if request.method in _MUTATING_METHODS:
        port = int(config.get("port", 5000))
        allowed_origins = {
            f"http://127.0.0.1:{port}",
            f"http://localhost:{port}",
        }
        origin = request.headers.get("Origin")
        if origin and origin not in allowed_origins:
            abort(403)
        if request.headers.get("X-Cockpit-CSRF") != CSRF_TOKEN:
            abort(403)


def _clamp_int(raw, default: int, lo: int, hi: int) -> int:
    """Parse `raw` as int, clamp to [lo, hi], return default on failure.
    Used for limit/count/size params to prevent runaway requests."""
    try:
        v = int(raw)
    except (TypeError, ValueError):
        return default
    if v < lo:
        return lo
    if v > hi:
        return hi
    return v


def _ok(payload: dict | None = None, **kwargs) -> Any:
    body = {"ok": True}
    if payload:
        body.update(payload)
    body.update(kwargs)
    return jsonify(body)


def _err(message: str, status: int = 502) -> Any:
    return jsonify({"ok": False, "error": message}), status


@app.errorhandler(YamahaError)
def _yamaha_err(e: YamahaError):
    return _err(str(e))


@app.errorhandler(SpotifyError)
def _spotify_err(e: SpotifyError):
    return _err(str(e))


@app.errorhandler(SpotifyConfigError)
def _spotify_cfg_err(e: SpotifyConfigError):
    return jsonify({"ok": False, "error": str(e), "code": "spotify_unconfigured"}), 503


# ---------- pages ----------

@app.route("/")
def index():
    return render_template(
        "index.html",
        device_name=config["yamaha_name"],
        yamaha_ip=config["yamaha_ip"],
        csrf_token=CSRF_TOKEN,
        version=__version__,
    )


# ---------- client config ----------

@app.route("/api/config")
def client_config():
    """Subset of config.json that the browser UI needs at startup."""
    return _ok({
        "enabled_sources": config.get("enabled_sources", []),
        "net_radio_suggestions": config.get("net_radio_suggestions", []),
        "device_name": config.get("yamaha_name"),
        "spotify_configured": spotify is not None,
        "spotify_authorized": bool(spotify and spotify.is_authorized()),
    })


# ---------- Spotify: auth + status + control ----------

def _require_spotify() -> SpotifyClient:
    if spotify is None:
        raise SpotifyConfigError(
            "Spotify is not configured. Add client_id to config.json under 'spotify' "
            "and create console/spotify_secret.json with {\"client_secret\": \"...\"}."
        )
    return spotify


@app.route("/spotify/auth")
def spotify_auth():
    sp = _require_spotify()
    from flask import redirect
    return redirect(sp.auth_url())


@app.route("/spotify/callback")
def spotify_callback():
    # Codex audit 2026-05-12 HIGH-2: escape reflected query params; never
    # leak exception text to the client. Detailed errors go to the log only.
    sp = _require_spotify()
    code = request.args.get("code")
    error = request.args.get("error")
    if error:
        return (
            f"<h1>Spotify authorization failed</h1><p>{escape(error)}</p>",
            400,
        )
    if not code:
        return "<h1>Missing authorization code</h1>", 400
    try:
        sp.exchange_code(code)
    except Exception:
        app.logger.exception("Spotify token exchange failed")
        return (
            "<h1>Token exchange failed</h1>"
            "<p>Check the Cockpit logs for details.</p>",
            500,
        )
    return (
        "<h1>Spotify connected</h1>"
        "<p>The Audiopheliac Cockpit is now authorized. You can close this tab "
        "and return to the Cockpit.</p>"
        "<p><a href='/'>Back to the Cockpit</a></p>"
    )


@app.route("/api/spotify/status")
def spotify_status():
    sp = _require_spotify()
    if not sp.is_authorized():
        return _ok({"authorized": False, "now_playing": None, "devices": []})
    np = sp.now_playing()
    devices = sp.devices()
    return _ok({"authorized": True, "now_playing": np, "devices": devices})


@app.route("/api/spotify/devices")
def spotify_devices():
    sp = _require_spotify()
    return _ok({"devices": sp.devices()})


@app.post("/api/spotify/transfer")
def spotify_transfer():
    sp = _require_spotify()
    body = request.get_json() or {}
    device_id = body.get("device_id")
    play = bool(body.get("play", False))
    if not device_id:
        return _err("device_id is required", status=400)
    sp.transfer_to(device_id, play=play)
    return _ok()


@app.post("/api/spotify/playback/<action>")
def spotify_playback(action: str):
    sp = _require_spotify()
    body = request.get_json(silent=True) or {}
    device_id = body.get("device_id")
    if action == "play":
        sp.play(
            device_id=device_id,
            context_uri=body.get("context_uri"),
            uris=body.get("uris"),
            offset=body.get("offset"),
            position_ms=body.get("position_ms"),
        )
    elif action == "pause":
        sp.pause(device_id)
    elif action in ("next", "skip"):
        sp.next(device_id)
    elif action in ("previous", "prev"):
        sp.previous(device_id)
    elif action == "seek":
        pos = int(body.get("position_ms", 0))
        sp.seek(pos, device_id)
    else:
        return _err(f"unsupported action: {action}", status=400)
    return _ok()


@app.post("/api/spotify/play-track")
def spotify_play_track():
    """Play specific tracks by URI. Avoids Spotify radio/context mode."""
    sp = _require_spotify()
    data = request.get_json(silent=True) or {}
    uris = data.get("uris") or []
    device_id = str(data.get("device_id") or "").strip() or None
    if not uris:
        return _err("uris required", 400)
    sp.play(uris=uris, device_id=device_id)
    return _ok()


@app.post("/api/spotify/queue-track")
def spotify_queue_track():
    sp = _require_spotify()
    data = request.get_json(silent=True) or {}
    uri = str(data.get("uri") or "").strip()
    device_id = str(data.get("device_id") or "").strip() or None
    if not uri:
        return _err("uri required", 400)
    sp._call("add_to_queue", uri, device_id=device_id)
    return _ok()


@app.route("/api/spotify/albums")
def spotify_albums():
    sp = _require_spotify()
    result = sp._call("current_user_saved_albums", limit=50) or {}
    albums = []
    for item in (result.get("items") or []):
        alb = item.get("album") or {}
        images = alb.get("images") or []
        art = images[0]["url"] if images else None
        artists = ", ".join(a.get("name", "") for a in (alb.get("artists") or []))
        albums.append({
            "id": alb.get("id"),
            "uri": alb.get("uri"),
            "name": alb.get("name"),
            "artist": artists,
            "art_url": art,
            "total_tracks": alb.get("total_tracks"),
            "release_date": (alb.get("release_date") or "")[:4],
        })
    return _ok({"albums": albums})


@app.route("/api/spotify/album/<album_id>")
def spotify_album(album_id: str):
    sp = _require_spotify()
    alb = sp._call("album", album_id) or {}
    images = alb.get("images") or []
    art = images[0]["url"] if images else None
    artists = ", ".join(a.get("name", "") for a in (alb.get("artists") or []))
    tracks_result = sp._call("album_tracks", album_id, limit=50) or {}
    tracks = []
    for t in (tracks_result.get("items") or []):
        tracks.append({
            "id": t.get("id"),
            "uri": t.get("uri"),
            "name": t.get("name"),
            "duration_ms": t.get("duration_ms"),
            "track_number": t.get("track_number"),
            "explicit": t.get("explicit"),
        })
    return _ok({
        "album": {
            "id": alb.get("id"),
            "uri": alb.get("uri"),
            "name": alb.get("name"),
            "artist": artists,
            "art_url": art,
            "total_tracks": alb.get("total_tracks"),
            "release_date": (alb.get("release_date") or "")[:4],
        },
        "tracks": tracks,
    })


@app.post("/api/spotify/volume")
def spotify_volume():
    sp = _require_spotify()
    body = request.get_json() or {}
    level = body.get("level")
    if level is None:
        return _err("level (0-100) is required", status=400)
    sp.set_volume(int(level), device_id=body.get("device_id"))
    return _ok()


@app.post("/api/spotify/shuffle")
def spotify_shuffle():
    sp = _require_spotify()
    body = request.get_json() or {}
    sp.set_shuffle(bool(body.get("state", False)), device_id=body.get("device_id"))
    return _ok()


@app.post("/api/spotify/repeat")
def spotify_repeat():
    sp = _require_spotify()
    body = request.get_json() or {}
    sp.set_repeat(str(body.get("state", "off")), device_id=body.get("device_id"))
    return _ok()


@app.route("/api/spotify/search")
def spotify_search():
    sp = _require_spotify()
    q = (request.args.get("q") or "").strip()[:200]  # cap query length
    if not q:
        return _ok({"results": {"track": [], "album": [], "artist": [], "playlist": []}})
    kinds = request.args.get("type", "track,album,artist,playlist")
    limit = _clamp_int(request.args.get("limit"), default=20, lo=1, hi=50)
    results = sp.search(q=q, kinds=kinds, limit=limit)
    return _ok({"results": results})


@app.route("/api/spotify/playlists")
def spotify_playlists():
    sp = _require_spotify()
    limit = _clamp_int(request.args.get("limit"), default=50, lo=1, hi=200)
    return _ok({"playlists": sp.playlists(limit=limit)})


@app.route("/api/spotify/queue")
def spotify_queue():
    """Return the Spotify playback queue (up to 20 upcoming tracks)."""
    sp = _require_spotify()
    return _ok(sp.queue())


# ---------- state ----------

@app.route("/api/status")
def status():
    s = yam.status()
    vmin, vmax, vstep = yam.volume_range()
    tone = s.get("tone_control", {}) or {}
    bmin, bmax, bstep = yam.tone_range("bass")
    tmin, tmax, tstep = yam.tone_range("treble")
    return _ok({
        "power": s.get("power"),
        "input": s.get("input"),
        "volume": s.get("volume"),
        "mute": s.get("mute"),
        "direct": s.get("direct"),
        "volume_min": vmin,
        "volume_max": vmax,
        "volume_step": vstep,
        "input_list": yam.input_list(),
        "tone_bass": tone.get("bass"),
        "tone_treble": tone.get("treble"),
        "bass_range": [bmin, bmax, bstep],
        "treble_range": [tmin, tmax, tstep],
    })


@app.route("/api/play-info")
def play_info():
    return _ok({"play": yam.play_info()})


@app.route("/api/presets")
def presets():
    return _ok({"presets": yam.preset_info().get("preset_info", [])})


# ---------- power ----------

@app.post("/api/power/on")
def power_on():
    yam.set_power(True)
    return _ok()


@app.post("/api/power/off")
def power_off():
    yam.set_power(False)
    return _ok()


@app.post("/api/power/toggle")
def power_toggle():
    yam.toggle_power()
    return _ok()


# ---------- volume ----------

@app.post("/api/volume/set")
def volume_set():
    body = request.get_json(silent=True) or {}
    value = int(body.get("value", 0))
    yam.set_volume(value)
    return _ok()


@app.post("/api/volume/up")
def volume_up():
    yam.volume_up()
    return _ok()


@app.post("/api/volume/down")
def volume_down():
    yam.volume_down()
    return _ok()


@app.post("/api/mute/toggle")
def mute_toggle():
    s = yam.status()
    yam.set_mute(not bool(s.get("mute")))
    return _ok()


@app.post("/api/direct/toggle")
def direct_toggle():
    s = yam.status()
    yam.set_direct(not bool(s.get("direct")))
    return _ok()


# ---------- input ----------

@app.post("/api/input")
def input_set():
    body = request.get_json(silent=True) or {}
    name = body.get("name")
    if not name:
        return _err("Missing 'name' in body", status=400)
    yam.set_input(name)
    return _ok()


# ---------- transport ----------

@app.post("/api/transport/<action>")
def transport(action: str):
    yam.playback(action)
    return _ok()


# ---------- preset ----------

@app.post("/api/preset/<int:num>")
def preset(num: int):
    yam.recall_preset(num)
    return _ok()


# ---------- library browse (Server / Net Radio / Spotify catalog) ----------

@app.route("/api/browse")
def browse_list():
    input_name = request.args.get("input", "server")
    index = _clamp_int(request.args.get("index"), default=0, lo=0, hi=100000)
    # YXC caps the page size at 8; clamp here so callers don't trip a 4.
    size = _clamp_int(request.args.get("size"), default=8, lo=1, hi=8)
    return _ok({"list": yam.list_info(input_name, index, size)})


@app.post("/api/browse/select")
def browse_select():
    body = request.get_json(silent=True) or {}
    idx = int(body.get("index", 0))
    action = body.get("action") or "select"
    if action not in ("select", "play"):
        return _err(f"Unsupported action: {action}", status=400)
    yam.list_select(idx, action=action)
    return _ok()


@app.post("/api/browse/back")
def browse_back():
    yam.list_return()
    return _ok()


# ---------- tone (receiver EQ) ----------

@app.post("/api/tone/<kind>")
def tone_set(kind: str):
    if kind not in {"bass", "treble"}:
        return _err(f"Unsupported tone kind: {kind}", status=400)
    body = request.get_json(silent=True) or {}
    value = int(body.get("value", 0))
    yam.set_tone(kind, value)
    return _ok()


# ---------- playlist (Cockpit-managed bookmarks of library items) ----------
# v0.1 scope: capture-only. Items survive reloads (persisted to playlist.json).
# Replay from playlist requires walking the DLNA tree back to the saved item;
# that is v0.2 work. Until then, the playlist is a session bookmark list.

@app.route("/api/playlist")
def playlist_get():
    with _playlist_lock:
        return _ok({"items": load_playlist()})


def _build_playlist_item(*, text: str, subtext: str = "", source: str = "",
                         path: list[str] | None = None, menu_name: str = "",
                         thumbnail: str = "") -> dict[str, Any]:
    return {
        "id": uuid.uuid4().hex,
        "text": text,
        "subtext": subtext or "",
        "source": source or "",
        "path": list(path or []),
        "menu_name": menu_name or "",
        "thumbnail": thumbnail or "",
        "added_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    }


@app.post("/api/playlist/add")
def playlist_add():
    body = request.get_json(silent=True) or {}
    text = (body.get("text") or "").strip()
    if not text:
        return _err("Missing 'text' in body", status=400)
    item = _build_playlist_item(
        text=text,
        subtext=(body.get("subtext") or "").strip(),
        source=(body.get("source") or "").strip(),
        path=body.get("path") or [],
        menu_name=(body.get("menu_name") or "").strip(),
        thumbnail=(body.get("thumbnail") or "").strip(),
    )
    with _playlist_lock:
        items = load_playlist()
        items.append(item)
        save_playlist(items)
    return _ok({"item": item})


@app.post("/api/playlist/add-folder")
def playlist_add_folder():
    """Descend into a folder, enumerate its tracks, add them all, then return."""
    body = request.get_json(silent=True) or {}
    folder_index = int(body.get("index", 0))
    folder_text = (body.get("folder_text") or "").strip()
    source = (body.get("source") or "server").strip()
    parent_path = list(body.get("path") or [])
    full_path = parent_path + ([folder_text] if folder_text else [])

    # Descend
    yam.list_select(folder_index, action="select")
    time.sleep(0.6)

    added: list[dict[str, Any]] = []
    cursor = 0
    pages = 0
    MAX_PAGES = 64  # bound the enumeration (~512 tracks)
    while pages < MAX_PAGES:
        page = yam.list_info(source, cursor, 8)
        items = page.get("list_info", []) or []
        if not items:
            break
        for it in items:
            attr = it.get("attribute", 0) or 0
            is_container = (attr & 0x01) != 0
            if not is_container and it.get("text"):
                added.append(_build_playlist_item(
                    text=it["text"],
                    subtext=it.get("subtext", ""),
                    source=source,
                    path=full_path,
                    menu_name=folder_text,
                    thumbnail=it.get("thumbnail", ""),
                ))
        cursor += len(items)
        if cursor >= int(page.get("max_line", 0) or 0):
            break
        pages += 1

    # Return cursor to parent so the user's browse view is preserved
    yam.list_return()
    time.sleep(0.3)

    with _playlist_lock:
        items = load_playlist()
        items.extend(added)
        save_playlist(items)
    return _ok({"added": len(added)})


@app.delete("/api/playlist/<item_id>")
def playlist_remove(item_id: str):
    with _playlist_lock:
        items = [i for i in load_playlist() if i.get("id") != item_id]
        save_playlist(items)
    return _ok()


@app.post("/api/playlist/clear")
def playlist_clear():
    player.stop()
    with _playlist_lock:
        save_playlist([])
    return _ok()


# ---------- playlist playback (sequential, optional shuffle) ----------

class PlaylistPlayer:
    """Background thread that navigates to each playlist item and plays it.

    Uses YXC's hierarchical browse. For each queued item, walks the cursor
    back to the source root via `setListControl?type=return`, then descends
    through `path` by name match, then selects the item by name and issues
    `action=play`. Polls `netusb/getPlayInfo` to detect track-end and
    advances. Single-user, single-instance: only one playback session at a
    time.
    """

    def __init__(self, yam: Yamaha):
        self.yam = yam
        self._lock = threading.Lock()
        self._thread: threading.Thread | None = None
        self._stop = threading.Event()
        self.queue: list[dict[str, Any]] = []
        self.current_id: str | None = None
        self.shuffle: bool = False

    def state(self) -> dict[str, Any]:
        with self._lock:
            return {
                "playing": self._thread is not None and self._thread.is_alive(),
                "current_id": self.current_id,
                "shuffle": self.shuffle,
                "queue_len": len(self.queue),
            }

    def start(self, items: list[dict[str, Any]], shuffle: bool = False,
              start_id: str | None = None) -> None:
        self.stop()
        queue = list(items)
        if start_id:
            # Rotate so the chosen item is first; preserve order after it
            for i, it in enumerate(queue):
                if it.get("id") == start_id:
                    queue = queue[i:] + queue[:i]
                    break
        if shuffle:
            random.shuffle(queue)
        with self._lock:
            self.queue = queue
            self.shuffle = shuffle
            self._stop.clear()
            t = threading.Thread(target=self._run, daemon=True)
            self._thread = t
            t.start()

    def stop(self) -> None:
        self._stop.set()
        t = self._thread
        if t and t.is_alive():
            t.join(timeout=4)
        with self._lock:
            self._thread = None
            self.queue = []
            self.current_id = None

    # ----- internals -----

    def _run(self) -> None:
        for item in list(self.queue):
            if self._stop.is_set():
                break
            with self._lock:
                self.current_id = item.get("id")
            try:
                ok = self._play_one(item)
            except YamahaError:
                ok = False
            if not ok:
                # Skip on navigation failure rather than wedge
                continue
            self._wait_track_end()
        with self._lock:
            self.current_id = None

    def _play_one(self, item: dict[str, Any]) -> bool:
        source = item.get("source") or "server"
        path = item.get("path") or []
        text = item.get("text") or ""
        if not text:
            return False
        self.yam.set_input(source)
        time.sleep(0.5)
        self._cursor_to_root(source)
        for segment in path:
            if self._stop.is_set():
                return False
            idx = self._find_index_by_text(source, segment)
            if idx is None:
                return False
            self.yam.list_select(idx, action="select")
            time.sleep(0.5)
        idx = self._find_index_by_text(source, text)
        if idx is None:
            return False
        self.yam.list_select(idx, action="play")
        return True

    def _cursor_to_root(self, source: str, max_hops: int = 12) -> None:
        for _ in range(max_hops):
            page = self.yam.list_info(source, 0, 1)
            if int(page.get("menu_layer", 0) or 0) == 0:
                return
            try:
                self.yam.list_return()
            except YamahaError:
                return
            time.sleep(0.3)

    def _find_index_by_text(self, source: str, text: str,
                            max_pages: int = 64) -> int | None:
        cursor = 0
        for _ in range(max_pages):
            page = self.yam.list_info(source, cursor, 8)
            items = page.get("list_info", []) or []
            if not items:
                return None
            for i, it in enumerate(items):
                if (it.get("text") or "") == text:
                    return cursor + i
            cursor += len(items)
            if cursor >= int(page.get("max_line", 0) or 0):
                return None
        return None

    def _wait_track_end(self) -> None:
        last_play_time = -1
        stagnant = 0
        while not self._stop.is_set():
            try:
                p = self.yam.play_info()
            except YamahaError:
                time.sleep(2)
                continue
            playback = (p.get("playback") or "").lower()
            play_time = int(p.get("play_time", 0) or 0)
            total_time = int(p.get("total_time", 0) or 0)
            if total_time > 0 and play_time >= total_time - 2:
                return
            if playback in ("stop", "pause"):
                stagnant += 1
                if stagnant >= 3:
                    return
            else:
                stagnant = 0
            if play_time == last_play_time:
                stagnant += 1
                if stagnant >= 6:
                    return
            last_play_time = play_time
            self._stop.wait(2.0)


player = PlaylistPlayer(yam)


@app.route("/api/playlist/state")
def playlist_state():
    return _ok(player.state())


@app.post("/api/playlist/play")
def playlist_play():
    body = request.get_json(silent=True) or {}
    shuffle = bool(body.get("shuffle", False))
    start_id = body.get("start_id")
    with _playlist_lock:
        items = load_playlist()
    if not items:
        return _err("Playlist is empty", status=400)
    player.start(items, shuffle=shuffle, start_id=start_id)
    return _ok(player.state())


@app.post("/api/playlist/stop")
def playlist_stop():
    player.stop()
    return _ok(player.state())


# ---------- system bootstrap ----------

@app.route("/api/system/bootstrap")
def system_bootstrap():
    """One-shot health report for every Cockpit dependency.

    Returns the topbar/launcher's source of truth: each component's state
    and whether the Cockpit can recover it from the UI.
    """
    yam_ok = False
    yam_err: str | None = None
    try:
        s = yam.status()
        yam_ok = s.get("power") in ("on", "standby")
    except YamahaError as e:
        yam_err = str(e)

    spotify_state = "unconfigured"
    if spotify is not None:
        spotify_state = "authorized" if spotify.is_authorized() else "unauthorized"

    return _ok({
        "yamaha": {
            "state": "reachable" if yam_ok else "unreachable",
            "host": config.get("yamaha_ip"),
            "error": yam_err,
        },
        "spotify": {"state": spotify_state},
    })


# ---------- smart play routing (intent-driven) ----------

def _find_spotify_yamaha_device(devices: list[dict], hints) -> tuple[str | None, str | None]:
    """Locate the Yamaha receiver in a Spotify devices list.

    Accepts a single hint string or a list of candidate substrings.
    Returns (device_id, device_name) for the first match, else (None, None).
    Case-insensitive substring match.
    """
    if not devices or not hints:
        return None, None
    if isinstance(hints, str):
        hints = [hints]
    candidates = [h.lower().strip() for h in hints if h and h.strip()]
    for needle in candidates:
        for d in devices:
            nm = (d.get("name") or "").lower()
            if needle in nm:
                return d.get("id"), d.get("name")
    return None, None


@app.post("/api/playback/play-to")
def play_to():
    """Intent-driven play. Resolves source/transport/handoff automatically.

    Body:
      {
        "intent": {
          "kind": "spotify-uri" | "net-radio-preset",
          // spotify-uri: "context_uri" or "uris", optional "offset", "position_ms"
          // net-radio-preset: "preset_num"
        }
      }

    Returns:
      { ok, source_switched: "spotify"|"net_radio"|null,
        engine: "spotify"|"yamaha", warning: "..." }
    """
    body = request.get_json(silent=True) or {}
    intent = body.get("intent") or {}
    kind = (intent.get("kind") or "").strip()
    source_switched: str | None = None
    warning: str | None = None

    if kind == "spotify-uri":
        sp = _require_spotify()

        # Two device-id sources: explicit (from the Cockpit's picker) takes
        # priority and skips name matching entirely. Otherwise we do a
        # multi-hint substring match against Spotify's reported device list.
        explicit_device_id = body.get("device_id")

        # Switch Yamaha to spotify and poll until the receiver confirms,
        # up to ~3s. Field-test 2026-05-12: a flat 0.6s sleep was racing
        # the receiver and Spotify saw "device not active" -> silent fail.
        try:
            yam.set_input("spotify")
            source_switched = "spotify"
        except YamahaError as e:
            return _err(f"Couldn't switch Yamaha to Spotify input: {e}", status=502)
        confirmed = False
        for _ in range(15):
            time.sleep(0.2)
            try:
                s = yam.status()
                if (s.get("input") or "").lower() == "spotify":
                    confirmed = True
                    break
            except YamahaError:
                continue
        if not confirmed:
            return _err(
                "Yamaha didn't confirm input switch to spotify within 3s. "
                "Check the receiver's front panel for source state.",
                status=502,
            )

        if explicit_device_id:
            device_id = explicit_device_id
            matched_name = None
        else:
            sp_cfg = config.get("spotify") or {}
            cfg_hint = body.get("yamaha_device_hint") or sp_cfg.get("yamaha_device_name_hint")
            # Build the candidate list: any explicit hint first, then the
            # standard fallbacks. De-duplicate while preserving order.
            hints: list[str] = []
            for h in [cfg_hint, *SPOTIFY_YAMAHA_HINT_FALLBACKS]:
                if h and h not in hints:
                    hints.append(h)
            devices = sp.devices()
            device_id, matched_name = _find_spotify_yamaha_device(devices, hints)
            retries = 0
            # Give the Yamaha up to ~6 seconds to register as a Spotify
            # Connect endpoint after the source switch.
            while not device_id and retries < 6:
                time.sleep(1.0)
                devices = sp.devices()
                device_id, matched_name = _find_spotify_yamaha_device(devices, hints)
                retries += 1
            if not device_id:
                visible = [d.get("name") for d in (devices or []) if d.get("name")]
                msg = (
                    "Spotify doesn't see the Yamaha. Tried hints "
                    + ", ".join(repr(h) for h in hints)
                    + ". Devices Spotify currently sees: "
                    + (", ".join(repr(n) for n in visible) if visible else "none")
                    + ". If your receiver is in that list under a different name, "
                    + "set config.spotify.yamaha_device_name_hint to a substring "
                    + "of that name and restart Flask. Or pick it in the Cockpit "
                    + "device dropdown before pressing Play."
                )
                return _err(msg, status=503)

        sp.play(
            device_id=device_id,
            context_uri=intent.get("context_uri"),
            uris=intent.get("uris"),
            offset=intent.get("offset"),
            position_ms=intent.get("position_ms"),
        )
        engine = "spotify"

    elif kind == "net-radio-preset":
        preset_num = int(intent.get("preset_num") or 0)
        if preset_num < 1:
            return _err("Missing preset_num", status=400)
        try:
            yam.set_input("net_radio")
            source_switched = "net_radio"
            time.sleep(0.4)
        except YamahaError as e:
            return _err(f"Couldn't switch Yamaha to Net Radio: {e}", status=502)
        yam.recall_preset(preset_num)
        engine = "yamaha"

    else:
        return _err(f"Unknown intent kind: {kind!r}", status=400)

    payload: dict[str, Any] = {"source_switched": source_switched, "engine": engine}
    if warning:
        payload["warning"] = warning
    return _ok(payload)


# ---------- active engine detection ----------

@app.route("/api/playback/active")
def playback_active():
    """Detect which engine is producing sound right now.

    Decision tree:
      1. If Yamaha source is "spotify" AND Spotify reports is_playing -> spotify
      2. Otherwise -> yamaha (whatever YXC says is playing, or idle)
    """
    yam_src = None
    yam_power = None
    try:
        s = yam.status()
        yam_src = s.get("input")
        yam_power = s.get("power")
    except YamahaError:
        pass

    spotify_playing = False
    spotify_device = None
    if spotify is not None and spotify.is_authorized():
        try:
            np = spotify.now_playing()
            spotify_playing = bool(np.get("is_playing"))
            spotify_device = (np.get("device") or {}).get("name")
        except SpotifyError:
            pass

    if yam_src == "spotify" and spotify_playing:
        return _ok({
            "engine": "spotify",
            "yamaha_source": yam_src,
            "yamaha_power": yam_power,
            "spotify_device": spotify_device,
        })

    return _ok({
        "engine": "yamaha",
        "yamaha_source": yam_src,
        "yamaha_power": yam_power,
    })


# ---------- MinimServer (DLNA via Yamaha YXC proxy) ----------

@app.route("/api/miniserver/status")
def miniserver_status():
    import requests as _req
    try:
        r = _req.get("http://192.168.1.230:9790/", timeout=2)
        return _ok({"reachable": r.status_code < 500})
    except Exception:
        return _ok({"reachable": False})


@app.route("/api/miniserver/browse")
def miniserver_browse():
    index = _clamp_int(request.args.get("index"), default=0, lo=0, hi=100000)
    size = _clamp_int(request.args.get("size"), default=8, lo=1, hi=8)
    data = yam.list_info("server", index, size)
    return _ok({"list": data})


@app.post("/api/miniserver/select")
def miniserver_select():
    body = request.get_json(silent=True) or {}
    idx = _clamp_int(body.get("index"), default=0, lo=0, hi=7)
    yam.list_select(idx, action="select")
    return _ok()


@app.post("/api/miniserver/play")
def miniserver_play():
    body = request.get_json(silent=True) or {}
    idx = _clamp_int(body.get("index"), default=0, lo=0, hi=7)
    yam.set_input("server")
    yam.list_select(idx, action="play")
    return _ok()


@app.post("/api/miniserver/back")
def miniserver_back():
    yam.list_return()
    return _ok()


if __name__ == "__main__":
    app.run(host=config["host"], port=int(config["port"]), debug=False)
