# Software Package Configuration Profile - Roon

**Package:** Roon (Server + Bridge + Remote)
**Owner:** Gillon "Gill" Marchetti (MarcArmy2003)
**Profile version:** 2026.05.1
**Last reviewed:** 2026-05-11
**Status:** Trial (free 14-day; subscription begins 2026-05-25 at $149.88/yr unless cancelled)

---

## 1. Overview

Roon is the library, search, browse, and playback brain for The Audiopheliac. Roon Server runs as a Docker container on the QNAP TS-473A and indexes the local FLAC/MP3 library on `\\NAS87828E\Music`. Roon Remote (desktop app) on GDMARCHE is the operator UI. Roon Bridge runs as a Windows service on GDMARCHE to expose the M-Audio AIR Hub as a Roon endpoint zone for studio monitoring. The Yamaha R-N800A is enabled as an AirPlay 2 zone for Family Room playback. The Audiopheliac Cockpit (`console/`) authenticates as a Roon extension and drives library + playback through the Roon API; YXC stays in service for receiver-side controls (power, volume, source select, transport, Net Radio presets).

Hardware references: `docs/av_master_inventory_2026.md` (NAS, GDMARCHE, R-N800A, AIR Hub). Topology: `config/audiopheliac_signal_map_v_2026_01.md` (local, gitignored).

---

## 2. Installation

### Roon Server (NAS, Docker)

| Field | Value |
|---|---|
| Install source | GitHub Container Registry official image |
| Image | `ghcr.io/roonlabs/roonserver:latest` |
| Host | NAS87828E (QNAP TS-473A, 192.168.1.230) |
| Container runtime | Container Station |
| Docker binary on NAS | `/share/CACHEDEV1_DATA/.qpkg/container-station/bin/docker` (symlink) |
| Docker engine | 27.1.2-qnap8 |
| Compose file | `/share/Container/RoonServer/docker-compose.yml` (deployed 2026-05-11) |
| Roon Server version | 2.66 (build 1658) production |
| Auto-update | Container restart policy `unless-stopped`; Roon auto-updates within the running container |
| Branch | production |

### Roon Bridge (GDMARCHE, Windows service)

| Field | Value |
|---|---|
| Install source | https://roonlabs.com/downloads → "Roon Bridge for Windows (64-bit)" |
| Install path | Default vendor path (typically `C:\Users\gillo\AppData\Local\Roon Bridge\Application\`) |
| Service name | `Roon Bridge` (Windows service) |
| Auto-update | Built-in updater |
| Run as | Administrator install required to register the service |

### Roon Remote (GDMARCHE, desktop app)

| Field | Value |
|---|---|
| Install source | https://roonlabs.com/downloads → "Roon for Windows (64-bit)" |
| Install path | Default vendor path |
| Auto-update | Built-in updater |

### License / subscription

| Field | Value |
|---|---|
| Plan | Annual subscription (trial → paid 2026-05-25) |
| Price | $149.88/yr |
| Auth email | gillon.marchetti@gmail.com |
| Account email | gillon.marchetti@gmail.com |

---

## 3. Account / Credentials

| Field | Value |
|---|---|
| Roon Account email | gillon.marchetti@gmail.com |
| Location Name (Roon) | Home4 |
| Location ID | `4c40ba316e0a4b6cb785b67b82ce49b8` |
| License ID (trial) | `874a4efd-4a67-4a3a-b360-ed8b29d23e81` |
| Support contact | https://help.roonlabs.com |
| Forum | https://community.roonlabs.com |

Tokens for the Cockpit Roon Extension auth live at `console/roon_token.json` (gitignored).

---

## 4. Configuration

### Roon Server (Docker container)

Compose file at `/share/Container/RoonServer/docker-compose.yml`:

| Setting | Value | Why |
|---|---|---|
| `image` | `ghcr.io/roonlabs/roonserver:latest` | Roon Labs official image, production tag |
| `network_mode` | `host` | Required for Roon's mDNS/SSDP discovery; bridged mode breaks zone discovery silently |
| `ROON_INSTALL_BRANCH` | `production` | Stable channel; switch to `earlyaccess` deliberately and only after backup |
| `TZ` | `America/New_York` | Local timezone for scheduled tasks and logs |
| Volume `/share/Container/RoonServer:/Roon` | rw | Roon database, settings, identity, logs |
| Volume `/share/Music:/Music` | rw (Roon docs say can be ro; left rw for index/metadata writes) | Library scan source |
| Volume `/share/Container/roon-backups:/RoonBackups` | rw | Roon-driven backup target |
| Volume `/run/udev:/run/udev:ro` | ro | udev events for device discovery |
| `cap_add` | `SYS_ADMIN`, `DAC_READ_SEARCH` | Roon's audio/file access requirements per generator |
| `security_opt` | `apparmor:unconfined`, `label:disable` | QNAP Container Station compatibility |
| `devices` | `/dev/snd`, `/dev/bus/usb` | USB / audio passthrough |
| `devices` (DELETED) | `/dev/dri` | TS-473A's Ryzen V1500B exposes no iGPU; `/dev/dri` is an empty dir, not a device node, and Docker rejects the passthrough. Roon runs fine without it for headless network playback. |
| `group_add` | `audio` | required for `/dev/snd` access |
| `restart` | `unless-stopped` | Survives QNAP reboots |
| `logging.driver` | `local` | Default Docker logging |

### Roon Server (in-app settings, set via Roon Remote at first run)

| Setting (Settings >) | Value | Why |
|---|---|---|
| Storage > Music folders | `/Music` (container path mapping `/share/Music`) | The local FLAC/MP3 library |
| Storage > Backups | `/RoonBackups` (container path mapping `/share/Container/roon-backups`) | Backup destination |
| Setup > Library Loading | (default) | First-run scan of 13,450 tracks completed cleanly |
| Audio > System Output (GDMARCHE) | Disabled | Routes through Windows mixer; non-bit-perfect; replaced by AIR HUB ASIO |
| Audio > M-Audio AIR HUB ASIO (GDMARCHE) | Enabled, named "The Audiopheliac Library" | Studio monitoring path: GDMARCHE > AIR Hub > MX28 > HS7 |
| Audio > AirPlay > Yamaha Receiver | Enabled, named "The Audiopheliac Library" | Family Room: Roon > AirPlay 2 > R-N800A > Polk ES60 |
| Backups (recommended, not yet scheduled) | Weekly to `/RoonBackups` | Roon DB recovery; queue for after trial decision |

Note: both zones currently share the name "The Audiopheliac Library." Rename one to disambiguate (suggested: AirPlay zone → "Family Room", AIR HUB ASIO zone → "Studio") in a future session.

### Roon Bridge (GDMARCHE)

Headless service, no UI. Service registration verified via:

```powershell
Get-Service -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "*Roon*" }
```

Should return `Roon Bridge` (or similar) with `Status: Running`, `StartType: Automatic`.

### Roon Remote (GDMARCHE)

Desktop UI. No persistent settings worth capturing here; all real config is server-side.

---

## 5. Signal Chain / Integration Points

### Family Room (AirPlay zone)

```
Roon Server (NAS Docker) > AirPlay 2 (LAN) > Yamaha R-N800A > Polk ES60 (Speaker A)
```

The R-N800A's AirPlay 2 service is auto-enabled when on the network; no MusicCast or front-panel toggle exists for it. Sample rate is fixed at 44.1 kHz over AirPlay; Roon will resample anything higher.

### Studio (AIR HUB ASIO zone)

```
Roon Server (NAS Docker) > Roon Bridge (GDMARCHE Windows service) > M-Audio AIR Hub ASIO > Rolls MX28 > Yamaha HS7 + JBL LSR310S
```

ASIO is exclusive-access. When Roon holds the AIR Hub via ASIO, Spotify desktop, Ableton, Audacity, browser audio cannot use it simultaneously. Switch to WASAPI for Roon if simultaneous use is needed (trade: WASAPI is shared-mode through the Windows mixer, no longer bit-perfect).

### Cockpit integration

```
Browser (UI) > Flask app.py > roon.py (RoonClient) > roonapi (Python lib) > Roon Core extension protocol > Roon Server
```

The Cockpit registers as a Roon extension named "Audiopheliac Cockpit" with extension_id `com.audiopheliac.cockpit`. First-run authorization requires user approval in Roon → Settings → Extensions. Token persists at `console/roon_token.json` (gitignored).

### What Roon does NOT touch

YXC (receiver) controls remain on the Yamaha YXC client (`console/yamaha.py`). The Cockpit calls YXC for: power on/off, volume, mute, source select, transport (Spotify Connect / Net Radio when Yamaha is the active source rather than a Roon-driven playback path), Net Radio preset recall.

---

## 6. Related Automation

| Artifact | Path | Purpose |
|---|---|---|
| docker-compose.yml | `/share/Container/RoonServer/docker-compose.yml` (NAS) | Roon Server container definition |
| docker-compose.yml (working copy) | `C:\Users\gillo\Downloads\docker-compose.yml` (GDMARCHE) | Pre-deploy edit copy; canonical source on NAS |
| Cockpit Roon client | `console/roon.py` | RoonClient class wrapping `roonapi`; library, search, browse, transport |
| Cockpit Flask routes | `console/app.py` `@app.route("/api/roon/*")` | HTTP surface to the browser UI |
| Token cache | `console/roon_token.json` | Roon extension auth token; gitignored |
| Pip dependency | `console/requirements.txt` `roonapi>=0.1.6` | Python wrapper for Roon API |

---

## 7. Troubleshooting Runbook

### Issue: Roon Server container won't start (device passthrough error)
- **Symptom:** `docker compose up -d` reports `error gathering device information while adding custom device "/dev/dri": not a device node`
- **Cause:** Roon's compose generator assumed iGPU-equipped hardware. TS-473A's AMD Ryzen V1500B has no exposed iGPU; `/dev/dri` is an empty directory, not a device node.
- **Fix:** Remove the `- /dev/dri:/dev/dri` line from the `devices:` block in docker-compose.yml. `docker compose down` then `docker compose up -d`.
- **Verification:** `docker ps --filter name=roonserver` shows `Up X seconds`.

### Issue: "This PC" section missing from Roon Audio settings
- **Symptom:** Roon Settings > Audio shows Roon Tested + Other network devices, but no "This PC" section listing GDMARCHE outputs (AIR HUB, Realtek, etc.)
- **Cause:** Roon Bridge service on GDMARCHE is not running, or was never installed. The Roon desktop Remote app provides endpoint capability while open, but it disappears when Remote closes or disconnects.
- **Fix:** Verify with `Get-Service -ErrorAction SilentlyContinue | Where-Object { $_.Name -like "*Roon*" }`. If empty, install Roon Bridge from https://roonlabs.com/downloads as Administrator. If present but Stopped, `Get-Service "Roon Bridge" | Start-Service`.
- **Verification:** "This PC" section reappears in Roon Settings > Audio after refresh (top-right circular arrow).

### Issue: "Device initialization failed" on AIR HUB ASIO row
- **Symptom:** Red error on the `M-Audio AIR HUB ASIO` row in Roon Settings > Audio. Won't play.
- **Cause:** Most often, ASIO contention (another app holds the driver: Ableton, Audacity, Spotify launcher routing through AIR Hub). Sometimes stale Roon state from a prior dock-undock cycle.
- **Fix:** (1) Close Ableton, Audacity, Spotify desktop, and any browser playing audio. (2) Click gear on the AIR HUB ASIO row > Disable > wait 3 s > Enable. (3) If still failing: `Get-Service "Roon Bridge" | Restart-Service`.
- **Verification:** Roon plays a track; AIR Hub Driver Control Panel shows "Streaming."

### Issue: Cockpit shows "Roon: discovering..." indefinitely
- **Symptom:** Top bar of `http://localhost:5000` shows discovering or waiting_for_auth and never connects.
- **Cause:** First-run extension authorization not completed.
- **Fix:** Open Roon Remote > Settings > Extensions. Find "Audiopheliac Cockpit" listed as pending. Click Enable. Token saves to `console/roon_token.json`.
- **Verification:** Top bar flips to `Roon: <core_name>`; Roon Zone card lists active zones.

### Issue: Cockpit Roon connection drops after working
- **Symptom:** Top bar flips to "Roon: error" or "Roon: discovering" mid-session
- **Cause:** Roon Server container restart, network blip, or the `roonapi` connection timed out
- **Fix:** Wait 10 s for auto-reconnect. If persistent, restart Flask: `Get-Process pythonw, python -ErrorAction SilentlyContinue | Stop-Process -Force` then `python app.py` from `C:\Users\gillo\The-Audiopheliac\console`.
- **Verification:** Top bar returns to `Roon: <core_name>`.

---

## 8. Known Limitations

- **No /dev/dri on TS-473A:** Removed from compose file. Roon's video/album-art codec acceleration falls back to CPU. Negligible impact for headless network playback.
- **R-N800A AirPlay 2 sample rate cap:** AirPlay 2 caps at 44.1 kHz / 16-bit. Higher-res files in the library get resampled by Roon for the Family Room zone. Studio (AIR HUB ASIO) is not affected; native sample rates pass through.
- **ASIO exclusivity on AIR Hub:** Only one app can hold the ASIO driver at a time. Concurrent use of Roon + Spotify (via launcher) + Ableton on the AIR Hub is not possible without switching some clients to WASAPI.
- **Roon Server database on spinning HDD:** The TS-473A has no SSD slot for the Roon database. Performance on the 12TB WD Red is workable but not optimal. Roon's official guidance recommends SSD; a USB 3.0 SSD upgrade is the cheap fix if Roon is kept past trial. Search and library page loads will be sluggish until then.
- **Two zones share the same display name** (both "The Audiopheliac Library"). Rename to disambiguate.
- **Roon on this firmware does not expose Yamaha R-N800A tone control via YXC.** Tone (bass/treble) and Pure Direct stay receiver-side, controlled via the front panel or MusicCast Controller. See `docs/software/Yamaha-RN800A.md` §8.
- **Trial expires 2026-05-25.** Subscription auto-renews at $149.88/yr unless cancelled at https://account.roon.app/account/manage-billing.

---

## 9. Change Log

| Date | Profile version | Change |
|---|---|---|
| 2026-05-11 | 2026.05.1 | Initial profile. Roon Server deployed via Docker on QNAP TS-473A (replacing failed 2023 community QPKG). Library scan completed (13,450 tracks). Roon Bridge installed on GDMARCHE. Two zones enabled (AirPlay > R-N800A; AIR HUB ASIO via Bridge). Cockpit pivoted from YXC-only to Roon-backed library + playback; YXC retained for receiver controls. |
