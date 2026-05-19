# `console/` — Audiopheliac Cockpit PROTOTYPE

**This folder is a prototype. It is not the product specification.**

The canonical Cockpit design lives in:
- [`../docs/Cockpit_System_Design_v2026_05.md`](../docs/Cockpit_System_Design_v2026_05.md) — what the Cockpit IS (private web-based control center at a route on theaudiopheliac.com, four zones, Hue integration, LLM agent over MCP servers, listening history, album-art-driven theming)
- [`../docs/Cockpit_Architecture_Decisions_v2026_05.md`](../docs/Cockpit_Architecture_Decisions_v2026_05.md) — five ADRs covering hosting (Cloudflare Worker + Durable Object), frontend (Astro Islands embedded in theaudiopheliac.com), auth (Cloudflare Access), MCP server topology, state storage

Read both before adding scope, changing architecture, or making UX decisions here. The shape of this folder is an early, single-zone, locally-hosted Flask slice. It is not what the product is supposed to become.

This is the v0 descope of that full spec. No Cloudflare. No Worker. No auth. Single device. Loopback only.

## What this prototype currently does

- Power on, standby
- Volume slider with up/down and mute toggle (UNMUTED / Muted state on a `.power` button)
- Input source select (driven by the receiver's reported `input_list`, filtered through `enabled_sources` and the `LIBRARY_DRIVEN_SOURCES` exclusion list)
- Now Playing card with album art (Spotify Connect, Net Radio, Server/DLNA)
- Transport controls (play, pause, next, previous) where the source supports them
- Net Radio preset recall (recalls existing presets; does not create new ones)
- Spotify Web API: browse, search, transport, queue, Spotify Connect device transfer (auth via spotipy OAuth)
- MinimServer via hand-rolled UPnP/DLNA control point (SSDP discovery, ContentDirectory browse + search, AVTransport push to the Yamaha as MediaRenderer)
- CSRF + Host allowlist hardening on the Flask surface
- Single-trigger desktop launch via `launch.pyw` (Chrome `--app`, singleton check anchored on `cockpit_version`)

## What this prototype is MISSING from the canonical Cockpit

- Multi-zone routing (Office Studio, Family Room, Lanai, Garage) per System Design §1. Current implementation is implicitly single-zone (Family Room via Yamaha).
- Cast endpoints for Chromecast 4K and Shield Pro per System Design §1.
- SoundTouch HTTP API for the Garage Bose per System Design §1.
- Hue lighting integration with album-art-driven color extraction per System Design §1.5–§1.6.
- Natural-language LLM agent over an MCP server registry per System Design §1.7.
- Listening history viz per System Design §1.9.
- Action targets (send-to-Ableton, fire Live scene, trigger Hue scene) per System Design §1.8.
- Cloudflare Worker + Durable Object backend per ADR-001.
- Astro frontend embedded in theaudiopheliac.com at a private route per ADR-002.
- Cloudflare Access auth boundary.
- Multi-zone grouping via MusicCast distribution (R-N800A as server).

## Discipline for working here

- Cite the canonical doc and section in every prompt and task brief that touches this folder. `CLAUDE.md` PROJECT FOLDER STRUCTURE entries are descriptions, not specs.
- Do not treat the prototype's current UX as the design. If a UX problem surfaces, ask first whether the fix belongs in the canonical Cloudflare Worker + Astro implementation rather than in `console/`.
- Patches to `console/` are debt against the eventual canonical implementation. Land them only when consciously chosen as bridge work, named as such in the commit message.

See `../CLAUDE.md` §CANONICAL PRODUCT REFERENCES and §BEHAVIORAL RULES (scope contract + ambient assumption check) for the discipline that prevents the failure mode documented in the 2026-05-18 HISTORY entry "session-level reorientation."

## Install

Environment: PowerShell 5.1+ on GDMARCHE, Python 3.10+, network reach to
192.168.1.191 (Yamaha R-N800A).

```powershell
cd C:\Users\gillo\The-Audiopheliac\console
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run (dev, foreground with logs)

```powershell
cd C:\Users\gillo\The-Audiopheliac\console
.\.venv\Scripts\Activate.ps1
python app.py
```

Browse `http://localhost:5000`.

## Run as an application (icon launch)

```powershell
cd C:\Users\gillo\The-Audiopheliac\console
.\Create-Shortcut.ps1
```

This drops `Audiopheliac Cockpit.lnk` on the Desktop. Double-click to
launch. Flask starts silently (pythonw.exe, no console window) and Chrome
(or Edge as fallback) opens the page in `--app` mode so the window has no
URL bar or tabs and feels like a native application.

To stop: close the Chrome/Edge window, then end the `pythonw.exe` process
from Task Manager (Details tab). v1 will add a Shutdown button.

## Icon

The shortcut uses the canonical Audiopheliac brand mark (rainbow-spectrum
vinyl with tonearm on a transparent field). Source JPG lives at
`..\media\icons\The_Audiopheliac_Primary_Logo_GPT.jpg`; the packing
script at `..\media\icons\pack_brand_icon.py` strips the near-black
background, normalises alpha, and writes a multi-resolution
`audiopheliac.ico` (16, 32, 48, 64, 128, 256).

To regenerate after the source mark changes:

```powershell
cd C:\Users\gillo\The-Audiopheliac\media\icons
python pack_brand_icon.py
```

Then re-run `Create-Shortcut.ps1` from `console\` to refresh the
shortcut's icon reference.

Note: the brand identity is scheduled for re-discovery. Earlier
exploratory marks (Microgroove Ritual experiment, Nashville Midnight
duotone) are retained under `..\media\icons\audiopheliac_cockpit*` as
reference for that future session, not as live brand assets.

## Configuration

Edit `config.json`:

```json
{
  "yamaha_ip": "192.168.1.191",
  "yamaha_name": "Yamaha R-N800A (Family Room)",
  "host": "127.0.0.1",
  "port": 5000
}
```

`host` and `port` are the Flask bind address. Keep `host` as `127.0.0.1`
for loopback-only access.

## Troubleshooting

- **Status dot stays bronze:** Yamaha unreachable from GDMARCHE. Confirm
  the receiver is on or in network standby, then `ping 192.168.1.191`
  from PowerShell. Reload the page.
- **Power says `unknown`:** Receiver responded but in an unexpected
  state. Power-cycle the receiver.
- **Album art blank:** Source does not expose art (Phono, Optical,
  Bluetooth). Spotify Connect and Net Radio do.
- **Net Radio presets empty:** No presets saved on the receiver. Save
  stations from the front panel or the MusicCast mobile app, then
  reload.
- **Sources list empty or missing:** Receiver returned an unexpected
  `getFeatures` payload. Power-cycle and reload.

## File layout

```
console/
  app.py                 Flask app
  yamaha.py              YXC HTTP client
  launch.pyw             silent launcher (pythonw + Chrome --app)
  config.json            local config
  requirements.txt
  Create-Shortcut.ps1    Desktop .lnk generator
  static/
    style.css            Nashville Midnight palette
    app.js               UI controller
  templates/
    index.html
  README.md              this file
```

## API contract (for future scripting or v1 work)

```
GET   /api/status               Power, input, volume, mute, ranges, input_list
GET   /api/play-info            netusb getPlayInfo (track, artist, album, art)
GET   /api/presets              Net Radio preset list

POST  /api/power/on             Power on
POST  /api/power/off            Standby
POST  /api/power/toggle         Toggle

POST  /api/volume/set           { "value": <int> }
POST  /api/volume/up
POST  /api/volume/down
POST  /api/mute/toggle

POST  /api/input                { "name": "spotify" | "net_radio" | ... }

POST  /api/transport/<action>   action in: play, pause, next, previous, stop

POST  /api/preset/<num>         Recall Net Radio preset by 1-based index
```

## YXC reference notes

The YXC spec is not officially published by Yamaha. The endpoints used
here are well-documented through Home Assistant's `aiomusiccast`, the
`python-musiccast` project, and community mirrors of the original PDF.
All endpoints are GET with query parameters; responses include a
`response_code` field where 0 means success. This client treats any
non-zero `response_code` as `YamahaError` and surfaces the HTTP 502 to
the browser.
