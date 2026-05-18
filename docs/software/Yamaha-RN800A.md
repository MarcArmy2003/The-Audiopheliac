# Software Package Configuration Profile - Yamaha R-N800A (YXC API)

**Package:** Yamaha Extended Control (YXC) API on R-N800A receiver firmware
**Owner:** Gillon "Gill" Marchetti (MarcArmy2003)
**Profile version:** 2026.05.1
**Last reviewed:** 2026-05-11
**Status:** Active (firmware 1.13 build 2404, API 2.17)

---

## 1. Overview

The Yamaha R-N800A network stereo receiver is the Family Room playback hub. Its YXC (Yamaha Extended Control) HTTP/JSON API on TCP/80 is the control surface The Audiopheliac Cockpit uses for receiver-side functions: power on/off, volume, mute, source select, transport (Spotify Connect / Net Radio), Net Radio preset recall. YXC is unauthenticated on the LAN; commands are GET requests with query-string parameters at the path `/YamahaExtendedControl/v1/...`. Roon-driven playback bypasses YXC entirely for transport (Roon controls the AirPlay 2 stream end-to-end) but YXC remains the right surface for non-Roon sources.

Hardware spec: `docs/av_master_inventory_2026.md` (R-N800A entry). Receiver topology: `config/audiopheliac_signal_map_v_2026_05.md` (Family Room signal chain).

---

## 2. Installation

YXC is built into the R-N800A firmware. No install action.

| Field | Value |
|---|---|
| Receiver model | Yamaha R-N800A |
| Firmware version | 1.13 (build 2404) |
| YXC API version | 2.17 |
| System UDID | `9ab0c000-f668-11de-9976-54b7bd9fac18` |
| MAC (wired) | `54:7B:BD:9F:AC:18` |
| MAC (wireless, unused) | `54:7B:BD:9F:AC:19` |
| IP (DHCP-reserved) | 192.168.1.191 |
| Connection | Wired Ethernet |
| Subnet / Gateway / DNS | 255.255.255.0 / 192.168.1.1 / 192.168.1.1 |
| MusicCast room name | Family Room |
| MusicCast network name | Yamaha Receiver |
| Firmware auto-update | On (Network Standby + auto firmware check) |

---

## 3. Account / Credentials

YXC has no authentication on the LAN. The MusicCast app (iOS/Android) uses the same un-authenticated API for control. AirPlay 2 pairing is one-time per Apple device.

| Field | Value |
|---|---|
| MusicCast Controller (iOS) | App version 5.60 (build 1897) |
| AirPlay 2 | Auto-enabled when on network; no toggle |
| Spotify Connect | Active when receiver is online; no separate sign-in (Spotify Connect uses your Spotify desktop/mobile session) |

---

## 4. Configuration

### YXC API (built into firmware)

| Setting / Endpoint | Value | Why |
|---|---|---|
| `/YamahaExtendedControl/v1/system/getDeviceInfo` | (read-only) | Device identity, firmware, API version |
| `/YamahaExtendedControl/v1/system/getFeatures` | (read-only) | Per-zone capabilities, input list, volume range, range_step entries |
| `/YamahaExtendedControl/v1/main/getStatus` | (read-only) | Current power, volume, mute, input, max_volume |
| `/main/setPower?power=on\|standby\|toggle` | POST-equivalent GET | Power control |
| `/main/setVolume?volume=N\|up\|down` | POST-equivalent GET | Volume; range learned from getFeatures, typically 0-161 in 1-step units (max 161 = 0 dB) |
| `/main/setMute?enable=true\|false` | POST-equivalent GET | Mute toggle |
| `/main/setInput?input=<name>` | POST-equivalent GET | Source select; input names from getFeatures input_list |
| `/netusb/getPlayInfo` | (read-only) | Now-playing for net sources (Spotify Connect, Net Radio, Server) |
| `/netusb/setPlayback?playback=play\|pause\|next\|previous` | POST-equivalent GET | Transport control for net sources |
| `/netusb/getPresetInfo` | (read-only) | Net Radio preset slots |
| `/netusb/recallPreset?zone=main&num=N` | POST-equivalent GET | Recall Net Radio preset |

### Receiver in-app settings (front panel + MusicCast Controller)

| Setting | Value | Why |
|---|---|---|
| Network > IP Address | DHCP reserved at 192.168.1.191 | Stable address for Cockpit / Roon discovery |
| Network > Network Standby | On | Required for AirPlay 2 advertise + remote wake |
| AirPlay 2 | Auto-enabled (no user toggle) | Roon "The Audiopheliac Library" zone targets this |
| Spotify Connect | Enabled by default | Direct Spotify > receiver; bypasses GDMARCHE |
| MusicCast Distribution | Enabled (`distribution_enable: true` per getStatus) | Multi-room sync support (not yet used) |
| Tone (Bass / Treble) | Front-panel only | YXC does not expose tone control on this firmware (verified 2026-05-11; see Known Limitations) |
| Pure Direct | Front-panel only | YXC does not expose direct toggle on this firmware |

### Cockpit YXC client (`console/yamaha.py`)

| Field | Value |
|---|---|
| Base URL | `http://192.168.1.191/YamahaExtendedControl/v1` |
| Zone | `main` (R-N800A is stereo; only main zone) |
| Timeout | 3 seconds per request |
| Auth | none |
| Error handling | non-zero `response_code` raises `YamahaError`; surfaces as HTTP 502 to the browser |

Volume conversion: YXC uses raw integer 0-161. The Cockpit UI normalizes to a percentage on display. The slider min/max get reset on the first `/api/status` call from the device-reported range.

---

## 5. Signal Chain / Integration Points

```
Cockpit browser UI
  > Flask /api/{power,volume,mute,input,transport,preset/*}
  > yamaha.py Yamaha class
  > HTTP GET to 192.168.1.191/YamahaExtendedControl/v1/...
  > R-N800A firmware
  > selected source > Polk ES60 (Speaker A)
```

For non-Roon sources (Phono via Pro-Ject, Optical In 2 from TV, Spotify Connect, Net Radio, Bluetooth), YXC is the only control surface in play. For Roon-driven playback (the "The Audiopheliac Library" AirPlay 2 zone), Roon owns transport; YXC is used for power/volume/mute only.

---

## 6. Related Automation

| Artifact | Path | Purpose |
|---|---|---|
| Cockpit YXC client | `console/yamaha.py` | Yamaha class wrapping YXC HTTP/JSON; methods cover all in-use endpoints |
| Cockpit Flask routes | `console/app.py` `@app.route("/api/{power,volume,mute,input,transport,preset/*}")` | HTTP surface to the browser UI |
| Cockpit launcher | `console/launch.pyw` | Silent launcher (pythonw + Chrome --app) used by Desktop shortcut |
| Cockpit shortcut generator | `console/Create-Shortcut.ps1` | Creates Desktop .lnk pointing at launch.pyw |
| Configuration | `console/config.json` | yamaha_ip, yamaha_name, host, port |

---

## 7. Troubleshooting Runbook

### Issue: Cockpit reports YXC GET ... failed
- **Symptom:** Status dot turns red; toast or 502 error in browser
- **Cause:** Receiver unreachable on LAN, or in deep standby with network off
- **Fix:** (1) `ping 192.168.1.191` from GDMARCHE PowerShell. If no reply, confirm Network Standby is On in receiver settings (front panel or MusicCast). (2) If ping replies but YXC errors, restart receiver (front panel power, full off then on after 10 s).
- **Verification:** `Invoke-RestMethod -Uri 'http://192.168.1.191/YamahaExtendedControl/v1/system/getDeviceInfo'` returns JSON with `response_code: 0`.

### Issue: Volume slider in Cockpit jumps unexpectedly
- **Symptom:** Slider position differs from receiver display
- **Cause:** Receiver volume changed via remote control or front panel; Cockpit polls every 2 s and reflects authoritative state
- **Fix:** Not a bug. Cockpit will sync within 2 seconds of any external change.

### Issue: Net Radio Presets card empty
- **Symptom:** Cockpit shows "no presets saved on receiver"
- **Cause:** No presets actually saved
- **Fix:** Save presets from the front panel or MusicCast Controller. YXC `recallPreset` only triggers existing slots; the Cockpit does not write new presets.

### Issue: Source list doesn't show a source you expect
- **Symptom:** Source listed in MusicCast Controller but not in Cockpit's Yamaha Source card
- **Cause:** Cockpit reads input_list from `getFeatures.zone[main].input_list`; the receiver advertises only the inputs supported on this firmware
- **Fix:** Compare against the YXC raw response: `Invoke-RestMethod -Uri 'http://192.168.1.191/YamahaExtendedControl/v1/system/getFeatures' | ConvertTo-Json -Depth 6`. If the source name isn't there, the firmware doesn't expose it.

---

## 8. Known Limitations

**These were verified by direct YXC probes on 2026-05-11; not assumptions.**

- **No tone control via YXC on this firmware.** `getStatus` does not include a `tone_control` field. `setTone?type=bass&value=4` returns `response_code: 3` (Invalid Request). Bass and treble shelves work from the front panel only. The Cockpit's Tone card was removed accordingly. If a future firmware exposes it, add it back.
- **No Pure Direct toggle via YXC.** `setDirect?enable=true` returns `response_code: 4` (Invalid Parameter). Pure Direct is a front-panel-only function.
- **YXC list browse capped at 8 items per page.** `/netusb/getListInfo?size=20` returns `response_code: 4` (Invalid Parameter). The R-N800A enforces an 8-item maximum per `getListInfo` call. Larger requests are rejected. (The Cockpit no longer uses YXC list browse for the library; Roon handles that. The cap is documented for any future scripting that needs `getListInfo`.)
- **AirPlay 2 has no enable/disable toggle.** Always on when receiver is on the network. Cannot be toggled via YXC, MusicCast app, or front panel.
- **No on-receiver MusicCast multi-zone with Roon.** When Roon owns the AirPlay 2 stream, the receiver is locked to that source; MusicCast Distribution from the receiver to other speakers is unavailable until Roon releases the stream. (Use Roon's own multi-zone grouping instead, which works across both AirPlay and AIR HUB ASIO endpoints.)
- **Volume scale is 0-161 (max_volume 154 reported in getStatus from a recent probe; range_step `getFeatures` says 161).** Treat as device-reported, not hard-coded.
- **No public YXC spec.** Yamaha does not host the spec publicly. Endpoint behavior is documented across community projects (Home Assistant `aiomusiccast`, `python-musiccast`, mirror PDFs). Treat any new endpoint as test-then-trust, not assume-then-ship.
- **`/netusb/setPlayUrl` is NOT exposed on firmware 1.13.** Verified 2026-05-18: `setPlayUrl?url=<encoded>` returns `response_code: 3` (Invalid Request) regardless of whether the receiver is on net_radio input or any other state. Direct HTTP/HTTPS stream-URL playback via YXC is not a path on this device. To play a stream URL, either use UPnP/DLNA AVTransport (`SetAVTransportURI` via the receiver's UPnP MediaRenderer service — see `console/minimserver.py::MediaRenderer.set_av_transport_uri`) or navigate the vTuner directory and tune the station via `getListInfo`/`setListControl`.
- **`/netusb/storePreset` and `/netusb/clearPreset` ARE exposed on firmware 1.13.** Verified 2026-05-18: both return `response_code: 0`. Net Radio preset slots can be written and cleared programmatically via YXC. The Cockpit's `yamaha.py` client does not yet expose `store_preset(num)` / `clear_preset(num)` methods — adding them is straightforward. Caveat: `storePreset` only stores the *currently playing* item, so programmatic preset population requires a tune-then-store flow (navigate vTuner to the desired station, wait for playback to begin, then `storePreset?num=N`).
- **vTuner navigation via `getListInfo?input=net_radio`: TBD.** First probe (2026-05-18) ran with the receiver in network standby (LAN/YXC stack alive but vTuner session not initialized); `getListInfo` returned `response_code: 0` with an empty `list_info` array and `max_line: 0`. Inconclusive: the empty tree may be because the vTuner directory session only initializes once the receiver is fully powered on with net_radio active. Re-probe pending with receiver powered on. Phase G (Net Radio decision) is gated on this re-probe per `/verification-first-rule`.

---

## 9. Change Log

| Date | Profile version | Change |
|---|---|---|
| 2026-05-11 | 2026.05.1 | Initial profile. Documented YXC endpoints in active use by the Cockpit. Verified firmware-side limitations on tone control, Pure Direct, and `getListInfo` page size via direct API probes. Tone card removed from Cockpit on the strength of those probes. |
| 2026-05-18 | 2026.05.2 | YXC probe pass 1 (Rafa). Confirmed `storePreset`/`clearPreset` exposed (response_code=0). Confirmed `setPlayUrl` NOT exposed (response_code=3). vTuner navigation inconclusive — first probe ran in network standby, returning empty vTuner tree; re-probe with receiver powered on is pending. Roon-era reference in §1 (Roon-driven playback bypasses YXC) is now historical: Roon was deprecated 2026-05-18; the Cockpit is Spotify + YXC + MinimServer-via-DLNA only. |
