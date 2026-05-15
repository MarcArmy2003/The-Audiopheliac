"""Yamaha Extended Control (YXC) HTTP client.

YXC is Yamaha's HTTP/JSON control surface for MusicCast devices, including
the R-N800A. No authentication on the LAN. Endpoints follow the pattern
http://<host>/YamahaExtendedControl/v1/<area>/<command>. Most commands are
GET requests with query-string parameters.

The R-N800A is a stereo receiver, so the only zone is "main".

This client is intentionally thin: each method maps to one YXC endpoint.
No caching beyond getFeatures, which is static per device.
"""
from __future__ import annotations

import requests
from typing import Any, Optional


class YamahaError(Exception):
    """Raised when YXC returns a non-zero response_code or a transport error occurs."""


class Yamaha:
    """Thin HTTP client around the YXC /v1 API."""

    def __init__(self, host: str, zone: str = "main", timeout: float = 3.0):
        self.host = host
        self.zone = zone
        self.timeout = timeout
        self._features: Optional[dict] = None

    # ---------- core HTTP ----------

    def _get(self, path: str) -> dict:
        url = f"http://{self.host}/YamahaExtendedControl/v1{path}"
        try:
            r = requests.get(url, timeout=self.timeout)
            r.raise_for_status()
        except requests.RequestException as e:
            raise YamahaError(f"YXC GET {path} failed: {e}") from e
        try:
            data = r.json()
        except ValueError as e:
            raise YamahaError(f"YXC GET {path} returned non-JSON: {r.text[:200]}") from e
        code = data.get("response_code")
        if code is not None and code != 0:
            raise YamahaError(f"YXC GET {path} returned response_code={code}")
        return data

    # ---------- system ----------

    def device_info(self) -> dict:
        return self._get("/system/getDeviceInfo")

    def features(self, refresh: bool = False) -> dict:
        if self._features is None or refresh:
            self._features = self._get("/system/getFeatures")
        return self._features

    # ---------- main zone ----------

    def status(self) -> dict:
        return self._get(f"/{self.zone}/getStatus")

    def set_power(self, on: bool) -> dict:
        state = "on" if on else "standby"
        return self._get(f"/{self.zone}/setPower?power={state}")

    def toggle_power(self) -> dict:
        return self._get(f"/{self.zone}/setPower?power=toggle")

    def set_volume(self, value: int) -> dict:
        return self._get(f"/{self.zone}/setVolume?volume={int(value)}")

    def volume_up(self, step: int = 1) -> dict:
        return self._get(f"/{self.zone}/setVolume?volume=up&step={int(step)}")

    def volume_down(self, step: int = 1) -> dict:
        return self._get(f"/{self.zone}/setVolume?volume=down&step={int(step)}")

    def set_mute(self, enable: bool) -> dict:
        return self._get(f"/{self.zone}/setMute?enable={'true' if enable else 'false'}")

    def set_direct(self, enable: bool) -> dict:
        # Pure Direct bypasses tone/balance/loudness. Engage only when the
        # source warrants flat reproduction.
        return self._get(
            f"/{self.zone}/setDirect?enable={'true' if enable else 'false'}"
        )

    def set_input(self, input_name: str) -> dict:
        # input_name is from getFeatures input_list (e.g. spotify, net_radio, server, phono, optical2)
        return self._get(f"/{self.zone}/setInput?input={input_name}")

    # ---------- netusb (Spotify, Net Radio, Server playback context) ----------

    def play_info(self) -> dict:
        return self._get("/netusb/getPlayInfo")

    def playback(self, action: str) -> dict:
        # action in {play, stop, pause, play_pause, previous, next,
        #            fast_reverse_start, fast_reverse_end,
        #            fast_forward_start, fast_forward_end}
        return self._get(f"/netusb/setPlayback?playback={action}")

    def preset_info(self) -> dict:
        return self._get("/netusb/getPresetInfo")

    def recall_preset(self, num: int) -> dict:
        return self._get(f"/netusb/recallPreset?zone={self.zone}&num={int(num)}")

    # ---------- netusb list browse (Server / Net Radio / Spotify catalog) ----------

    # YXC caps getListInfo size at 8 per page on most firmwares; larger
    # values return response_code=4 (Invalid Parameter).
    LIST_MAX_PAGE = 8

    def list_info(self, input_name: str, index: int = 0, size: int = 8,
                  lang: str = "en") -> dict:
        # The device maintains the current browse position per source. This
        # call returns a page of items from wherever the source's cursor is.
        size = max(1, min(int(size), self.LIST_MAX_PAGE))
        return self._get(
            f"/netusb/getListInfo"
            f"?input={input_name}&index={int(index)}&size={size}&lang={lang}"
        )

    def list_select(self, index: int, action: str = "select") -> dict:
        # action: "select" (descend container or move cursor), "play" (play track now).
        return self._get(
            f"/netusb/setListControl?type={action}&index={int(index)}&zone={self.zone}"
        )

    def list_return(self) -> dict:
        # Steps back up one menu layer.
        return self._get(f"/netusb/setListControl?type=return&zone={self.zone}")

    def get_server_list(self, index: int = 0, size: int = 8) -> dict:
        """Convenience wrapper: browse the UPnP/DLNA Server source."""
        return self.list_info("server", index, size)

    def play_server_item(self, index: int) -> None:
        """Play the item at page-position `index` from the current server list."""
        self.list_select(index, action="play")

    # ---------- tone (receiver EQ: bass and treble shelves) ----------

    def set_tone(self, kind: str, value: int) -> dict:
        # kind in {"bass", "treble"}; value in dB per the device range.
        return self._get(f"/{self.zone}/setTone?type={kind}&value={int(value)}")

    def tone_range(self, kind: str) -> tuple[int, int, int]:
        """Return (min, max, step) for the named tone control.

        Yamaha exposes ranges via getFeatures under range_step entries
        named "tone_bass" or "tone_treble" (flat schema). Falls back to
        a conservative default if the device does not advertise them.
        """
        target = f"tone_{kind}"
        feats = self.features()
        for z in feats.get("zone", []):
            if z.get("id") == self.zone:
                for r in z.get("range_step", []):
                    if r.get("id") == target:
                        return r.get("min", -10), r.get("max", 10), r.get("step", 1)
        return -10, 10, 1

    # ---------- helpers ----------

    def volume_range(self) -> tuple[int, int, int]:
        """Return (min, max, step) for the active zone, learned from getFeatures."""
        feats = self.features()
        for z in feats.get("zone", []):
            if z.get("id") == self.zone:
                for r in z.get("range_step", []):
                    if r.get("id") == "volume":
                        return r.get("min", 0), r.get("max", 100), r.get("step", 1)
        return 0, 100, 1

    def input_list(self) -> list[str]:
        feats = self.features()
        for z in feats.get("zone", []):
            if z.get("id") == self.zone:
                return list(z.get("input_list", []))
        return []
