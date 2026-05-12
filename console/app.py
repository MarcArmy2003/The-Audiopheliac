"""Audiopheliac Cockpit v0 - local Flask app controlling Yamaha R-N800A.

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
from typing import Any

from flask import Flask, jsonify, render_template, request

from yamaha import Yamaha, YamahaError
from roon import RoonClient, RoonNotAuthorized, RoonError


HERE = Path(__file__).resolve().parent
CONFIG_PATH = HERE / "config.json"
PLAYLIST_PATH = HERE / "playlist.json"
ROON_TOKEN_PATH = HERE / "roon_token.json"
_playlist_lock = threading.Lock()
DEFAULT_CONFIG = {
    "yamaha_ip": "192.168.1.191",
    "yamaha_name": "Yamaha R-N800A (Family Room)",
    "roon_host": "192.168.1.230",
    "host": "127.0.0.1",
    "port": 5000,
}


def load_config() -> dict[str, Any]:
    if CONFIG_PATH.exists():
        with CONFIG_PATH.open("r", encoding="utf-8") as f:
            return {**DEFAULT_CONFIG, **json.load(f)}
    return DEFAULT_CONFIG


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
roon = RoonClient(token_path=ROON_TOKEN_PATH,
                  configured_host=config.get("roon_host"))
roon.start()
app = Flask(__name__)


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


@app.errorhandler(RoonNotAuthorized)
def _roon_unauth(e: RoonNotAuthorized):
    return jsonify({"ok": False, "error": str(e), "code": "roon_unauthorized"}), 403


@app.errorhandler(RoonError)
def _roon_err(e: RoonError):
    return _err(str(e))


# ---------- pages ----------

@app.route("/")
def index():
    return render_template(
        "index.html",
        device_name=config["yamaha_name"],
        yamaha_ip=config["yamaha_ip"],
    )


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
    index = int(request.args.get("index", 0))
    # YXC caps the page size at 8; clamp here so callers don't trip a 4.
    size = max(1, min(int(request.args.get("size", 8)), 8))
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


# ---------- Roon (library, search, browse, transport) ----------

@app.route("/api/roon/status")
def roon_status():
    return _ok(roon.status())


@app.route("/api/roon/zones")
def roon_zones():
    return _ok({"zones": roon.zones()})


@app.route("/api/roon/now-playing")
def roon_now_playing():
    zone_id = request.args.get("zone_id")
    if not zone_id:
        return _err("Missing zone_id", status=400)
    return _ok({"now_playing": roon.now_playing(zone_id)})


@app.route("/api/roon/image")
def roon_image():
    image_key = request.args.get("key")
    size = int(request.args.get("size", 256))
    if not image_key:
        return _err("Missing key", status=400)
    url = roon.image_url(image_key, size=size)
    return _ok({"url": url})


@app.post("/api/roon/browse/root")
def roon_browse_root():
    body = request.get_json(silent=True) or {}
    zone_id = body.get("zone_id")
    if not zone_id:
        return _err("Missing zone_id", status=400)
    return _ok({"list": roon.browse_root(zone_id)})


@app.post("/api/roon/browse/descend")
def roon_browse_descend():
    body = request.get_json(silent=True) or {}
    zone_id = body.get("zone_id")
    item_key = body.get("item_key")
    if not zone_id or not item_key:
        return _err("Missing zone_id or item_key", status=400)
    return _ok({"list": roon.browse_descend(zone_id, item_key)})


@app.post("/api/roon/browse/back")
def roon_browse_back():
    body = request.get_json(silent=True) or {}
    zone_id = body.get("zone_id")
    if not zone_id:
        return _err("Missing zone_id", status=400)
    return _ok({"list": roon.browse_back(zone_id)})


@app.route("/api/roon/browse/page")
def roon_browse_page():
    offset = int(request.args.get("offset", 0))
    count = int(request.args.get("count", 100))
    return _ok({"list": roon.browse_page(offset=offset, count=count)})


@app.post("/api/roon/search")
def roon_search():
    body = request.get_json(silent=True) or {}
    zone_id = body.get("zone_id")
    query = (body.get("query") or "").strip()
    if not zone_id or not query:
        return _err("Missing zone_id or query", status=400)
    return _ok({"list": roon.search(zone_id, query)})


@app.post("/api/roon/select-action")
def roon_select_action():
    body = request.get_json(silent=True) or {}
    zone_id = body.get("zone_id")
    item_key = body.get("item_key")
    if not zone_id or not item_key:
        return _err("Missing zone_id or item_key", status=400)
    return _ok({"list": roon.select_action(zone_id, item_key)})


@app.post("/api/roon/transport/<action>")
def roon_transport(action: str):
    body = request.get_json(silent=True) or {}
    zone_id = body.get("zone_id")
    if not zone_id:
        return _err("Missing zone_id", status=400)
    roon.transport(zone_id, action)
    return _ok()


if __name__ == "__main__":
    app.run(host=config["host"], port=int(config["port"]), debug=False)
