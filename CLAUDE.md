# CLAUDE.md — The Audiopheliac | Cowork Project Instructions

**Version:** 2026.05.2 | **Owner:** Gillon "Gill" Marchetti (MarcArmy2003)

**Project Folder:** `C:\Users\gillo\The-Audiopheliac`
**GitHub:** https://github.com/MarcArmy2003/The-Audiopheliac
**Website:** theaudiopheliac.com (Cloudflare Pages, domain registered 2026-04-19, expiry 2028-04-19)

**Project Logs:**
- Channel: #theaudiopheliac | ID: `C0AUH2RLZ41`
- https://veterananalyticsllc.slack.com/archives/C0AUH2RLZ41

**Task Observer:**
At the start of any task-oriented session — any interaction where you will use tools and produce deliverables — invoke the task-observer skill before beginning work. This ensures skill improvement opportunities are captured throughout the session.

---

## IDENTITY AND ROLE

The Audiopheliac is Gill Marchetti's lifestyle brand at the intersection of audio, technology, and AI. It is built around `theaudiopheliac.com` (domain registered through 2028-04-19) and spans: a public-facing website on Cloudflare Pages with locked brand voice guidelines and Nashville Midnight visual identity; a content production pipeline (blog posts, product testing and reviews, technical deep-dives); AI integrations including Suno AI music production with commercial-use rights; an Amazon affiliate revenue stream via the gear-discovery proxy (Amazon Associates store `veterananalyt-20`, PA-API access pending qualifying sales); a potential Amazon storefront of recommended equipment; a personal music intelligence and home AV system (signal-chain engineering, studio production, vinyl, Spotify/Discogs) that grounds the brand with hands-on authority; and downstream Suno-produced music releases under the Audiopheliac name.

**Scope framing (non-negotiable, do not collapse):** The Audiopheliac is a lifestyle brand build with monetization paths active or in flight, including affiliate revenue, commercial-use music releases, product reviews, possible sponsorships, and a possible Amazon storefront. It may eventually fold under VAL (Veteran Analytics LLC) for tax and financial accounting purposes; the subject matter remains independent of VAL and is unrelated to veterans content. When Gill calls The Audiopheliac a "hobby," that phrasing distinguishes it from VAL as an existing legal business entity, NOT a signal that the project lacks commercial scope or governance demands. Plan, recommend, and architect accordingly. The hardware, signal chain, and studio components are the credibility foundation, not the brand itself.

**Motto:** "Rock 'n' roll. Deal with it." — after Bret Easton Ellis, *The Rules of Attraction* (Gill's paraphrase; not verbatim — intentionally kept)
**Persona:** Enthusiastic, witty, unflinchingly honest.
**Tone:** Direct, technically precise, conversational. Explain the why behind every recommendation.
**Companion project:** `The Audiopheliac | Studio Assistant` on claude.ai is available for research, copy iteration, and exploratory prompting while Cowork is processing. It is not part of the production workflow and does not relay, review, or gate any deliverables. Cowork is the primary development surface and executes all work it is capable of directly. Rafa handles only what Cowork cannot reach: localhost (paperclip API), Windows-native PowerShell 5.1, and Cloudflare deployments.

---

## COWORK OPERATING CONSTRAINTS

- No memory across sessions. All state must be read from this file or from project files on disk.
- No artifacts. All outputs are written to disk.
- No project KB. This CLAUDE.md is the sole persistent instruction source.
- Use absolute or UNC paths for all filesystem references. Never assume mapped drives persist.
- Default script output: `C:\Scripts` unless a project folder already exists.
- PowerShell 5.1 (not pwsh / PowerShell 7) required for service management on GDMARCHE. PowerShell 7 lacks service permissions in this environment.
- Confirm before any destructive operation: shell commands, firmware flashes, file deletions, driver uninstalls.
- Mark firmware procedures with risk level: [LOW], [MODERATE], or [HIGH].

---

## RAFA (CLAUDE CODE CLI) — PRE-AUTHORIZATION

**Settings file:** `C:\Users\gillo\The-Audiopheliac\.claude\settings.json`

All tools listed in `permissions.allow` run without prompting Gill for approval. This is intentional and permanent. Rafa is trusted to scope full tasks end-to-end including git operations and deployments.

**Pre-authorized tool patterns (as of 2026.05):**
- `Bash(git *)` — all git operations: add, commit, push, pull, checkout, merge, stash, config, log, status, diff
- `Bash(pwsh *)` — PowerShell execution
- `Bash(python *)` / `Bash(pip *)` / `Bash(pip3 *)` — Python and package management
- `Bash(npm *)` / `Bash(node *)` / `Bash(npx *)` — Node.js and npm
- `Bash(wrangler *)` — Cloudflare Workers / Pages deployments
- `Bash(schtasks *)` — Windows Task Scheduler (for Robocopy job setup)
- `Bash(net *)` — network share operations
- Standard file ops: `rm`, `mv`, `cp`, `mkdir`, `find`, `grep`, `chmod`

**Behavioral rule for Rafa:** When a task has been scoped and Sully/Gill have provided context, execute the entire scope without interrupting for git checkpoints or deployment confirmations. Pre-auth means the task runs start to finish. If something goes wrong, report it in the closeout summary — do not pause mid-task to seek permission already granted.

**Scope independence:** This repo is independent of VALOR scope. When Rafa is addressed directly for Audiopheliac tasks, that address is sufficient authorization — no VALOR scope-guard confirmation required. The canonical working tree is C:\Users\gillo\The-Audiopheliac. Do not apply VALOR identity, VALOR branch conventions, or VALOR pipeline rules here.

### Operational routing — who runs what

Cowork drafts; Rafa executes anything that touches the running stack on GDMARCHE; the Audiopheliac Operator paperclip agent (when hired) absorbs the recurring slice. The table below is the default routing for ops that come up frequently; treat it as the lane discipline for this project specifically.

| Operation | Lane today | Lane once Operator agent exists |
|---|---|---|
| Edit `console/config.json` (preferred_zones, enabled_sources, net_radio_suggestions, IPs, etc.) | Rafa | Operator |
| Cockpit Flask process lifecycle (start, stop, restart) | Rafa | Operator |
| Run any of `automation/*.py` (music_indexer, spotify_pull, spotify_local_match, spotify_gap_report) | Rafa | Operator (and likely a recurring routine) |
| Restart Roon Server container on QNAP (SSH + docker compose) | Rafa | Operator if granted SSH; otherwise stays with Rafa |
| Edit `.gitignore`, `automation/`, `console/static/`, `console/templates/`, `console/*.py` | Cowork drafts → Rafa commits / restarts if process is affected | Operator drafts and commits when adapter has file tools |
| Touch `site/` Astro source files | Cowork directly (hot reload picks up changes) | Cowork directly |
| Astro `npm install`, `npm run build`, `npm audit`, `wrangler pages deploy` | Rafa | Operator if granted Node toolchain; otherwise Rafa |
| Brand voice guidelines, design philosophy, brand docs under `docs/brand/`, mockups under `_dev/01_brand/` | Cowork directly | Cowork directly |
| CLAUDE.md surgical edits | Cowork directly | Cowork directly |
| Doc updates downstream of an ops change (e.g. signal map after a Roon rename, software profiles after a version bump) | Cowork drafts → Rafa applies in the same prompt that runs the ops change | Operator |
| Git stage, commit, push to origin/main | Rafa | Operator (file paperclip approval gate for force pushes per PAPERCLIP SURFACE §approval gates) |
| Slack canvas updates at session close | Cowork (Cowork has the Slack MCP) | Cowork remains |
| Paperclip ticket reads / writes | Rafa (only surface with localhost reach) | Operator agents post directly; Cowork still drafts comments via Rafa bridge |
| Canva brand kit operations | Cowork (Cowork has the Canva MCP) | Cowork remains |
| YXC probes / direct calls to `http://192.168.1.191/YamahaExtendedControl/v1/` | Rafa | Operator |
| Roon UI configuration (zone naming, output enabling, account settings) | Gill (Roon Remote desktop app, manual) | Gill — paperclip cannot drive the Roon Remote UI |
| MusicCast app configuration (Net Radio preset save, source enable/disable, MusicCast Linking) | Gill (iOS app, manual) | Gill — same reason as Roon |

**Lane discipline note:** anything that requires the Roon Remote app or the MusicCast iOS app stays with Gill regardless of which agent exists — those are walled-garden UIs with no API surface. Cowork's job there is to draft the walkthrough; Gill's job is to click through it. When the Operator exists, Cowork still drafts; Operator becomes the persistent record-keeper for which steps were done when.

**Default Rafa prompt shape** for Cockpit / Roon / Yamaha ops tasks:

1. State the working directory: `C:\Users\gillo\The-Audiopheliac`.
2. State the shell: PowerShell 5.1.
3. State the scope in numbered steps with concrete file paths and exact expected JSON edits or commands.
4. Provide an Acceptance block — observable state that proves the task ran.
5. Provide an Out-of-Scope block — what NOT to touch.
6. Close with: post a brief note to Slack canvas `F0AU7FEMA7M` and surface tag `Rafa`.

When the Audiopheliac Operator paperclip agent exists, the same prompt shape can be filed as a paperclip issue assigned to Operator. Operator picks it up, runs it, posts work products to the issue, transitions to `done`. Cowork drafts the issue body; Rafa files it via `POST /api/issues` until Cowork gains direct paperclip reach.

---

## WORKSPACE BINDINGS

### Project Folder (Canonical)
```
C:\Users\gillo\The-Audiopheliac
```
This is the live git repo and working tree. All Cowork file operations target this path.

### D: Drive (DAW / Audio Data — NOT project code)
```
D:\The Audiopheliac\
  Ableton Cache\          Ableton project cache — configured in Live preferences
  Ableton User Library\   User samples, presets, racks, templates
  Audacity\               Audacity working files
  BonusPresets\           Additional preset packs
  DisplayProfiles\        Monitor layout configs (MultiMonitorTool)
```
The D: drive is the second internal drive on GDMARCHE (original factory drive, swapped when C: was upgraded to Samsung 990 PRO NVMe). It is synced to the NAS via QSync. Project code, CLAUDE.md, and documentation live on C:, not D:.

**D: drive is NOT the project root.** Do not create scripts, CLAUDE.md copies, or documentation there. If Cowork or any tool asks for a working directory, always use the C: path above.

### GitHub Repository
- **URL:** https://github.com/MarcArmy2003/The-Audiopheliac
- **README:** https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/README.md
- **Raw content fetch pattern:** `https://raw.githubusercontent.com/MarcArmy2003/The-Audiopheliac/main/docs/[filename].md`
- **Note:** Use raw.githubusercontent.com URLs. Blob URLs return 429s.
- **Vinyl files:** `Vinyl/` directory
- **Signal map files:** `Signal_Map/` directory
- **Pending PR:** Vinyl wishlist rename (`claude/stage-vinyl-rename-N4MQf`, commit `801ba0f`) — merge to `main` pending
- **Worktree note:** `C:\Users\gillo\Veteran Analytics LLC\GitHub Clones\the-audiopheliac` is a git worktree linked to this repo, not an independent clone. It contains a stale CLAUDE.md (April 5, 2026) and should not be used as a working directory.

### Slack (Veteran Analytics LLC Workspace)
- **Workspace:** https://veterananalyticsllc.slack.com
- **Section:** https://veterananalyticsllc.slack.com/channel-section/Csl0AVBSYJ125
- **Channel:** #theaudiopheliac | Channel ID: `C0AUH2RLZ41`
- **Canvas:** "The Audiopheliac - Session Development Log"
  https://veterananalyticsllc.slack.com/docs/T0AS3KMJ82X/F0AU7FEMA7M

### NAS Canonical Root
- **UNC:** `\\NAS87828E\The Audiopheliac`
- **Mapped:** `A:\` (verify mapping is live before use)
- **Backup path:** `\\NAS87828E\The Audiopheliac\The-Audiopheliac\` — QSync sync target of D: drive contents. The nesting is expected: D:\The Audiopheliac contains a subfolder The-Audiopheliac\ which QSync replicates at the NAS level.

### Music Library (Album Output)
- **Path:** `M:\The Audiopheliac`
- **Purpose:** Local music library folder for Audiopheliac album outputs. Destination for downloaded Suno tracks, finished masters, and organized assets across albums.
- **Established:** 2026-05-07
- **UNC equivalent:** `\\NAS87828E\Music\The Audiopheliac\` (M: maps to `\\NAS87828E\Music`, confirmed 2026-05-09).
- **Note:** M: is a mapped drive. Verify mapping is live before scripts target it; fall back to the UNC above when off-mapping.
- **Albums:**
  - `First Tracks/` — Suno-generated music (WAV + MP3 side by side). Early experiments and first production efforts. Spotify Local Files pointed here for MP3 indexing (WAVs not indexed by Spotify, format limitation).

---

## PLATFORM CREDENTIALS

### Spotify Developer App
- **App Name:** The Audiopheliac
- **Client ID:** `7b8b0cd38be7496b864a0380b8c2a16c`
- **Status:** Development mode (max 5 authorized users)
- **Redirect URI:** `https://github.com/MarcArmy2003/The-Audiopheliac`
- **Authorized users:** gillon.marchetti@gmail.com, gillon.marchetti@veterananalytics.com

### Suno
- **Handle:** `@audiopheliac`
- **Public profile:** https://suno.com/@audiopheliac
- **Display name:** The Audiopheliac
- **Plan:** Premier (Annual) | Next billing: Apr 29, 2027
- **Credits:** 10,000/month, up to 2,000 songs/month | Model: v5.5
- **Features:** Suno Studio, full feature unlock, commercial use rights
- **Auth email:** gillon.marchetti@gmail.com
- **Support:** billing@suno.com
- **Knowledge base:** https://help.suno.com
- **Local project folder:** `C:\Users\gillo\The-Audiopheliac\Suno\`
- **Status:** Account active. Profile bio, profile photo, and background image not yet set. My Taste profile empty (0/2000). My Styles toggle enabled.

### Cloudflare
- **Account ID:** `6b62d46e5ce9b468ae75995a6d7e6354`
- **Deployment target:** Cloudflare Pages (`site/` directory is the Pages root)

### Amazon Associates
- **Store ID:** `veterananalyt-20`
- **Status:** PA-API access pending qualifying sales threshold (monitoring)

### Discogs
- **Auth:** Single `Authorization: Discogs token={TOKEN}` header
- **Collection endpoint:** `/users/{username}/collection/folders/0/releases`
- **Note:** Personal access token for collection/wantlist sync; no OAuth required for single-user access

---

## HARDWARE (CURRENT STATE)

### Workstation
- **Dell Precision 7540** (hostname: GDMARCHE)
- Intel Xeon E-2286M | 112GB ECC RAM | Samsung 990 PRO NVMe (C:) + original HDD (D:)
- IP: 192.168.1.119 | MAC: 98:e7:43:d3:de:90 | Wi-Fi 5GHz via Spectrum SAX2V1R
- DHCP reservation at 192.168.1.119 confirmed (toggle set in Spectrum router admin 2026-05-05)

### Audio Interface
- **Primary (2026-05-11):** M-Audio AIR Hub (AIRXHUB) — USB-C device to USB-A on WD19DCS dock; 24-bit/96kHz DAC; 2× balanced 1/4" TRS monitor outs; 1× 1/4" headphone (independent level); 3× powered USB-A hub (LP120, Spark 40, Casio Privia); M-Audio AIR Hub ASIO driver. **Output only — no ADC.** Recording capability offline until input-capable replacement is sourced.
- **Failed:** Focusrite Scarlett Solo Gen 4 (S/N S1XJ7HX57AF107) — fried 2026-05-11, removed from chain. Warranty attempt pending without receipt; assume unrecoverable.

### Office Studio Monitors
- Yamaha HS7 (pair) + JBL LSR310S subwoofer

### Turntables
- Technics SL-1200MK2 (Ortofon Blue cartridge) — Family Room
- AT-LP120XUSB — Office Studio

### Receivers and Preamps
- Yamaha R-N800A (IP: 192.168.1.191, wired) — Family Room
- Pro-Ject Phono Box S2 Ultra — Family Room phono preamp

### Mixer and Signal Processing
- Rolls MX28 Mini-Mix VI (active mixer; center-negative power — use only included PSU) — Office Studio
- Schiit Mani II phono preamp — Office Studio (preamp for AT-LP120XUSB; feeds MX28 Input B)
- Rolls MB15b signal booster — Family Room distribution
- Schiit SYS passive switcher — Lanai (switches between 1Mii RX #2 and Singing Machine output, feeds Bose 3·2·1 AUX IN)
- Sprodio K2 stereo-to-mono converter (stored; left-channel PRE OUT attenuation issue resolved, no longer in active signal path)

### Wireless Distribution
- 1Mii RT5066R2: one TX (from Rolls MB15b, Family Room); one RX in Office Studio, one RX on Lanai
- SVS SoundPath TX/RX kit: disconnected, stored for future use

### NAS
- QNAP TS-473A (hostname: NAS87828E) | IP: 192.168.1.230 | 16GB RAM
- Drives: WD Red Plus 12TB + 10TB | balance-alb trunking across 2x 2.5GbE
- Passive 5GbE switch (QNAP QSW-1105-5T) between router and both NAS ports
- **Media servers installed:**
  - MinimServer (fallback role) — serving `\\NAS87828E\Music` to R-N800A via UPnP/DLNA. Confirmed working. Retained as fallback if Roon trial does not convert.
  - Roon Server (Docker, primary) — `ghcr.io/roonlabs/roonserver:latest` running in Container Station at `/share/Container/RoonServer/`. Replaced the failed 2023 community QPKG (cangerie/RoonServer_QNAP_Installer) on 2026-05-11. Trial active until 2026-05-25, auto-renews to $149.88/yr unless cancelled. Library scan complete (13,450 tracks indexed). See `docs/software/Roon.md` for the full deploy spec, container config, and runbook.

### Network
- Spectrum SAX2V1R router (192.168.1.1)
- QNAP QSW-1105-5T passive 5GbE switch
- TP-Link TL-SG105 switch also present

### Instruments (Office Studio)
- Seagull SC-6W (acoustic guitar)
- Epiphone Les Paul Standard Pro (electric)
- Ibanez PF5NT1201 (acoustic)
- Casio Privia PX-870WE (digital piano)
- Positive Grid Spark 40 amp

### Headphones
- Audio-Technica ATH-M50x (primary monitoring)
- Beats Fit Pro (wireless)

---

## SIGNAL CHAIN MAP (ACTIVE ZONES)

### Family Room
```
Technics SL-1200MK2 (Ortofon Blue)
  > Pro-Ject Phono Box S2 Ultra
  > Yamaha R-N800A
  > Polk ES60 (Speaker A)

Samsung TV (Family Room)
  > Yamaha R-N800A (Optical In 2)

Yamaha PRE OUT
  > Rolls MB15b (boost)
  > 1Mii TX — broadcasts to RX in Office Studio and RX on Lanai
```

### Office Studio
```
AT-LP120XUSB (phono out)
  > Schiit Mani II (phono preamp)
  > Rolls MX28 Mini-Mix VI (Input B)

1Mii RX #1 (Family Room wireless)
  > Rolls MX28 Mini-Mix VI (Input C)

GDMARCHE (Spotify / streaming / DAW)
  > M-Audio AIR Hub (USB-C to USB-A on WD19DCS; 24-bit/96kHz, output only)
  > balanced 1/4" TRS L/R
  > Rolls MX28 Mini-Mix VI (Input A)

Rolls MX28 Mini-Mix VI (Master Out, TRS balanced)
  > JBL LSR310S (TRS in)
  > Yamaha HS7 monitors (TRS out)

Headphone monitoring: M-Audio AIR Hub 1/4" headphone output (independent
level control) preferred for all streaming and DAW listening. MX28 headphone
output reserved for multi-source blended monitoring only. Note: AIR Hub has
no Direct Monitor switch and no inputs; live zero-latency recording is
unavailable until a replacement interface with ADC is sourced.
```

### Lanai
```
Roon Lanai - TV Chromecast (192.168.1.239)
  > Lanai TV speakers (primary Roon endpoint, 2026-05-12)

1Mii RX
  > Schiit SYS Input 1

Singing Machine
  > Schiit SYS Input 2

Schiit SYS Output
  > Bose 3-2-1 Series II AUX IN

Samsung UN65U7900F (eARC)
  > J-Tech JTECH-AE4KA (HDMI eARC to RCA)
  > Bose 3-2-1 Series II TV 1 Input
```

Note: Samsung UN65U7900F has no optical out. J-Tech JTECH-AE4KA handles eARC audio extraction and feeds the Bose TV 1 input directly. Schiit SYS switches between whole-house audio (1Mii RX) and karaoke (Singing Machine), feeding the Bose AUX input. Bose source selection handles TV vs AUX natively on the unit. The Roon Chromecast endpoint at 192.168.1.239 is the primary Lanai listening path as of 2026-05-12; the 1Mii wireless route is retained as the secondary/legacy path downstream of `Family Room — Yamaha`.

### Master Bedroom
```
Roon Cast / AirPlay 2
  > Master Bedroom TV (192.168.1.154)
  > Master Bedroom TV speakers
```

Note: TV exposes Chromecast and AirPlay 2 on the same hardware (192.168.1.154). Both protocols appear as Roon zones; either is addressable. Added 2026-05-12 as part of the seven-zone Roon rename pass.

### Garage
```
Bose SoundTouch Genius
  Primary: phone via Bluetooth or 3.5mm line-in
  Secondary: Yamaha R-N800A Bluetooth (available; sporadic due to distance)

Amazon Echo (parallel, independent BT/Wi-Fi)
```

---

## INFRASTRUCTURE AND SYNC

### NAS Shares
- `\\NAS87828E\The Audiopheliac` (mapped as `A:\`) — canonical data/media source
- `\\NAS87828E\Veteran Analytics LLC` — separate business domain (do not cross-contaminate)

### Sync Architecture
- **HBS 3:** One-way NAS > Google Drive (non-native files; indexing delay 5-30 min is normal; full-text search does not index markdown or PDF via HBS 3 — use name-based queries)
- **Robocopy (VALOR):** `D:\VeteransAnalytics_NVMe` > `\\NAS87828E\Veteran Analytics LLC` (Task Scheduler, `/MIR /XO`, log at `C:\Scripts\Logs\VA_NVMe_sync.log`)
- **Robocopy (Audiopheliac — PENDING):** `C:\Users\gillo\The-Audiopheliac` > `D:\The Audiopheliac\The-Audiopheliac\` — scheduled nightly sync not yet configured. Currently manual. See Open Action Items.
- **Qsync:** `D:\The Audiopheliac` paired to `\\NAS87828E\The Audiopheliac` — syncs D: drive contents (Ableton Cache, Ableton User Library, and the nested The-Audiopheliac\ project backup) to NAS.

### Sync Chain (Audiopheliac project files)
```
C:\Users\gillo\The-Audiopheliac   (live repo — edit here)
  > Robocopy (pending schedule)
  > D:\The Audiopheliac\The-Audiopheliac\   (daily D: backup)
  > Qsync (automatic)
  > \\NAS87828E\The Audiopheliac\The-Audiopheliac\   (NAS backup)
```

### Remote Access
- WireGuard and Tailscale are installed but currently deactivated at home (both hijack routing and break internet when active). Whether either is necessary for remote NAS access is an unresolved open question.

---

## SOFTWARE AND DAW ENVIRONMENT

- **DAWs:** Ableton Live 12 Suite (default), Audacity (editing)
- **AI Music:** Suno (Premier Annual) — see Platform Credentials and Suno Production Environment
- **Default session:** 48 kHz / 24-bit unless specified otherwise
- **Driver:** M-Audio AIR Hub ASIO (current as of 2026-05-11). Focusrite ASIO retained on system but no longer in active use (Solo hardware failed).
- **Ableton paths:**
  - Cache: `D:\Ableton Cache`
  - User Library: `D:\Ableton User Library`
- **Spotify:** Microsoft Store install | username: `gdmarche` (URL slug, immutable) | display name: The Audiopheliac (changed from `MarcArmy2003` 2026-05-12)
  Profile URL: `https://open.spotify.com/user/gdmarche`
  App path: `C:\Users\gillo\AppData\Local\Packages\SpotifyAB.SpotifyMusic_zpdnekdrzrea0\LocalState\Spotify\`
  Network path: Streamed from GDMARCHE to Yamaha R-N800A
  Profile: `docs/software/Spotify.md`
- **Roon (library + playback brain):** Server in Docker on NAS, Bridge as Windows service on GDMARCHE, Remote desktop app on GDMARCHE.
  - Server image: `ghcr.io/roonlabs/roonserver:latest` (production, 2.66 build 1658). Compose at `/share/Container/RoonServer/docker-compose.yml`.
  - Two zones: "The Audiopheliac Library" (AirPlay 2 to R-N800A, Family Room) and AIR HUB ASIO (via Bridge, Studio).
  - Trial expires 2026-05-25. Subscription $149.88/yr unless cancelled.
  - Profile: `docs/software/Roon.md`
- **Yamaha R-N800A (YXC API):** Receiver-side controls (power, volume, mute, source, transport, Net Radio presets) via the unauthenticated YXC HTTP/JSON API at `http://192.168.1.191/YamahaExtendedControl/v1/`. Tone control and Pure Direct are NOT exposed by this firmware (verified 2026-05-11 via direct probes); front panel only. Profile: `docs/software/Yamaha-RN800A.md`
- **Default script location:** `C:\Scripts` unless a project folder already exists

---

## PROJECT FOLDER STRUCTURE (AUTHORITATIVE)

**Local root:** `C:\Users\gillo\The-Audiopheliac`

```
automation/         All executable scripts. No outputs, no configs.
  music_indexer.py
  spotify_pull.py
  spotify_local_match.py
  spotify_gap_report.py

console/            Audiopheliac Cockpit v0.2 (Roon-backed local control panel)
  app.py            Flask routes (YXC + Roon)
  yamaha.py         YXC HTTP/JSON client
  roon.py           Roon API extension client (wraps roonapi)
  launch.pyw        Silent launcher (pythonw + Chrome --app)
  Create-Shortcut.ps1   Desktop shortcut generator
  config.json       yamaha_ip, roon_host, host, port (config; safe to commit)
  requirements.txt  flask, requests, roonapi
  static/           style.css (Nashville Midnight), app.js (UI controller)
  templates/        index.html
  README.md         Install, run, extension auth, troubleshooting

config/             Credentials (.env) and structured config (.json) — gitignored
  music_sources.json
  spotify.env

data/               All generated outputs. Never edit manually.
  library_index/
    library_index.json
  spotify/
    spotify_library.json
  discogs/          (future)
  manifests/
    spotify_local_matches.json
    spotify_missing_tracks.txt

Suno/               Suno account reference, prompt templates, output archives — gitignored for PDFs
  Suno_Account_Info.pdf
  Suno_Account_Info.txt

site/               Cloudflare Pages root. Pure presentation, no scripts.
  src/
    styles/
      tokens.css
  assets/
    css/
    js/
    favicons/

skills/             Local Claude skill definitions
  monitor-layout-lock/

prompts/            Reusable AI workflows (future productization layer)

docs/               System memory: changelog, lessons learned, spec, reference docs
  Instruction_Addendum_log.md
  av_master_inventory_2026.md
  software/         Per-package configuration and troubleshooting profiles
    README.md       Convention, index, and "when to create a profile" rules
    _TEMPLATE.md    Reusable skeleton for new package profiles
    Spotify.md      First profile (2026-05-11)
  (see full listing in docs/)

.gitignore
README.md
CLAUDE.md           (this file — canonical, single source of truth)
```

**Structure rules (non-negotiable):**
- No cross-contamination between layers: scripts in `automation/`, outputs in `data/`, presentation in `site/`
- `automation/` produces `data/`. Data never feeds back into automation except as input.
- All scripts are idempotent: running twice produces the same result and breaks nothing.
- Git tracks code and config templates. Never raw data, never secrets.
- If `data/` is deleted, the system must fully rebuild from source.
- `Suno/` is reference and archive only. No executable scripts, no pipeline outputs.
- CLAUDE.md lives only at the project root. Do not maintain copies in subdirectories.
- `docs/software/` holds per-package configuration profiles. One file per package, named in PascalCase (e.g., `Spotify.md`, `AbletonLive12.md`). Profiles are created only when a package is actively in focus, not speculatively. Template at `docs/software/_TEMPLATE.md`; convention and index at `docs/software/README.md`.

---

## DATA PIPELINE

```
Local FLAC Files (NAS)
  > music_indexer.py
  > library_index.json
  > spotify_pull.py
  > spotify_library.json
  > spotify_local_match.py
  > spotify_local_matches.json
  > spotify_gap_report.py
  > spotify_missing_tracks.txt
```

**Daily refresh (run from GDMARCHE at `C:\Users\gillo\The-Audiopheliac\`):**
```powershell
python automation\music_indexer.py
python automation\spotify_pull.py
python automation\spotify_local_match.py
python automation\spotify_gap_report.py
```

**Indexer exclusion rules** (in `config/music_sources.json`):
- `excluded_path_segments: ["_Archive"]` — skips any path containing `_Archive` as a folder segment. Rule is dormant (the `_Archive\Suno_Bounces\` folder under `\\NAS87828E\Music` was emptied when WAVs moved to `First Tracks\`). Retain the rule; revisit after Roon evaluation determines final folder architecture.

**Note:** The indexer must run from GDMARCHE (Windows host) because it scans `\\NAS87828E\Music` via UNC. Cannot run from Cowork sandbox.

---

## WEBSITE STATE (CURRENT)

- **Phase 1 complete:** Brand layer locked and pushed to origin/main.
- **Phase 2 brand rework complete (2026-05-11 to 2026-05-12):** Palette restored from Nashville Midnight to Full Spectrum (prismatic). Dual voice register codified. Canonical mark locked as the existing raster. See `_dev/04_progress/session_close_2026_05_11_brand_rework.md` for the full deliverable index.
- **Stack target:** Astro + Cloudflare Pages (Rafa's 7-page scaffold live at localhost:3000 as of 2026-05-12; pending palette port to Full Spectrum and `npm audit` resolution of 6 vulns from the Astro 6.3.1 upgrade)
- **Canonical mark:** Original rainbow prismatic vinyl turntable raster at `assets/The_Audiopheliac_Primary_Logo_GPT.jpg`. Do NOT use the code-driven SVG approximation at `_dev/01_brand/canonical_mark_rebuild_v0.svg` — structural reference only. Faithful vector rebuild remains deferred to a dedicated vector-tool design session.
- **Palette: Full Spectrum** (locked 2026-05-12, derived from the canonical mark's prismatic sweep)
  - Sunlamp Yellow `#F8E91F` (CTA primary on ink, ~17.5:1 AAA)
  - Spring Lime `#99E257` (warm green transition)
  - Signal Green `#41D99A` (mid-spectrum, success state, spindle anchor)
  - Cyan Pulse `#0ABED3` (body accent only; teal CTAs FORBIDDEN, VALOR separation)
  - Sapphire Run `#0F82DF` (structural blue, info state)
  - Indigo Drift `#5E54D4` (deep secondary)
  - Magenta Lift `#C24CC8` (CTA hover, warm spectrum terminus)
  - Ink `#0A0A0B` | Paper `#F5F5F7` | Hairline `#FFFFFF` (unchanged)
- **CTA contract:** Solid Sunlamp Yellow on ink (WCAG AAA ~17.5:1). Hover to Magenta Lift. Spectrum gradient (90° linear, 7-stop) reserved for one to two hero moments only.
- **Logo treatments:** Use the canonical raster at all sizes ≥32px. Below 32px, fall back to working PNG masters at `media/icons/audiopheliac_*.png`. No recoloring of the canonical.
- **Typography:** Unica One (display), Inter (body). Scale 1.250, base 16px. Tokens at `site/src/styles/tokens.v3.css` (replaces `tokens.css` when Astro `global.css` import is swapped).
- **Brand voice guidelines:** v3.0 at `brand-voice-guidelines-v3.md`. Adds §3 Voice Modes (manifesto + direct registers). §8 visual identity updated to Full Spectrum. Forbidden-vocabulary list includes "Nashville Midnight" as a primary-palette claim. v2.0 (`brand-voice-guidelines-v2.md`) retained on disk as historical reference.
- **Canva brand kit:** `kAHGkHrcJYU`. Canonical mark uploaded as asset `MAHJda6fxms`. Brand kit reference poster lives at design `DAHJd6bWQgU` in the "The Audiopheliac" Canva folder (`FAHJd1gp6cg`). Brand kit color/font values still need manual paste into Canva UI — values pre-staged in `_dev/01_brand/canva_brand_kit_paste_sheet.md`.
- **Nashville Midnight:** Archived as future classic-audiophile sub-brand. Index at `_dev/99_archive/nashville_midnight_sub_brand/README.md`. Do not use for The Audiopheliac primary.
- **Phase 2 open decisions:** (1) Palette port — swap `@import './tokens.css'` to `@import './tokens.v3.css'` in `site/src/styles/global.css`; (2) hero gradient mapping rebuild (4-stop diagonal → 7-stop linear); (3) Cockpit UI port from Nashville Midnight to Full Spectrum (`console/static/style.css`); (4) `npm audit` resolution before Cloudflare deploy; (5) faithful vector rebuild of canonical mark in a dedicated design session.

### Branding doc location index

| Doc | Path |
|---|---|
| Brand voice guidelines | `brand-voice-guidelines-v3.md` |
| Canonical mark design philosophy | `docs/brand/Canonical_Mark_Design_Philosophy.md` |
| Frequency Cartography design philosophy | `docs/brand/Frequency_Cartography_Design_Philosophy.md` |
| Brand kit reference card (PDF) | `docs/brand/Audiopheliac_Brand_Kit_Reference.pdf` |
| Canva brand kit paste sheet | `docs/brand/Canva_Brand_Kit_Paste_Sheet.md` |
| Site architecture spec | `docs/Audiopheliac_Site_Architecture.md` |
| File format converter spec v3 | `docs/tools/file_format_converter_spec_v3.md` |
| Full Spectrum custom theme | `outputs/themes/full-spectrum.md` |
| Palette decision aid mockup | `_dev/01_brand/palette_decision_aid.html` |
| Cockpit redesign mockup | `_dev/01_brand/cockpit_redesign_mockup.html` |
| Homepage mockup (Full Spectrum) | `_dev/01_brand/audiopheliac_homepage_mockup.html` |
| Brand discovery report | `outputs/audiopheliac_brand_discovery_report.md` |
| Brand voice analysis (/market brand) | `outputs/BRAND-VOICE.md` |
| Competitor / web qualitative scan | `outputs/WEB-SCAN.md` |
| Brand rework paperclip-shaped plan | `_dev/03_decision-log/brand_rework_plan_v1.md` |
| Session close summary | `_dev/04_progress/session_close_2026_05_11_brand_rework.md` |
| Nashville Midnight archive index | `_dev/99_archive/nashville_midnight_sub_brand/README.md` |
| Canonical mark structural approximation (SVG, do NOT use as asset) | `_dev/01_brand/canonical_mark_rebuild_v0.svg` |
| Canva folder | https://www.canva.com/folder/FAHJd1gp6cg |
| Canva brand kit reference poster | https://www.canva.com/d/jEnhAHTCul9LV1p |

---

## SUNO PRODUCTION ENVIRONMENT

### Account State
- **Handle:** `@audiopheliac` | https://suno.com/@audiopheliac
- **Plan:** Premier Annual | 10,000 credits/month | Up to 2,000 songs/month | Model: v5.5
- **Suno Studio:** Enabled | Commercial use rights: Included
- **Profile:** Bio, profile photo, and background image not yet configured
- **My Taste:** Populated (1519/2000) — v1.1 saved 2026-05-05. Draft at Suno/suno_my_taste_draft.md
- **My Styles:** Toggle enabled (no effect until Taste profile has data)
- **Existing playlist:** "Ackypaleto" — active collaborative project with Kevin (Backlog on Suno). Band/duo concept originating from junior high. At least one song exists as a children's track. Playlist functions as project folder. Do not rename or delete.

### Profile Setup (Open Action Items)
- **Display Name:** The Audiopheliac (set 2026-05-05)
- **Bio:** Draft a brand-aligned bio using the Listening Profile and Audiopheliac persona (1,200 char max)
- **Profile photo:** Use Audiopheliac primary mark or a derivative
- **Background image:** Brand-consistent header image (warm tone or Nashville Midnight palette)
- **My Taste:** Write a taste profile using the Listening Profile as source material (2,000 char max)

### Local Reference Files
```
C:\Users\gillo\The-Audiopheliac\Suno\
  Suno_Account_Info.pdf
  Suno_Account_Info.txt
```

### Integration Notes
- No official public Suno API. Production is browser-based via https://suno.com
- Third-party MCP wrappers exist (AceDataCloud/SunoMCP, CodeKeanu/suno-mcp, mcp-suno on PyPI) and are viable for automation — require separate API key evaluation
- AI-assisted prompt drafting for Suno is in scope: style descriptors, lyric scaffolding, genre tags, metatags
- All Suno outputs with commercial intent are eligible under Premier plan commercial use rights
- Ableton Knowledge MCP is active in Cowork sessions (Live 12 manual, Push, ~450 YouTube tutorials)
- Woodshed learning mode: trigger word `/woodshed` — instructive, doing-first engagement. Exit: `/produce` or `/studio`

### Song Archive Protocol
Once Gill confirms a song is finalized (lyrics, style, exclusions, and a generated result he's happy with), save the following to disk before closing the session:

**Lyrics file:** `C:\Users\gillo\The-Audiopheliac\Suno\lyrics\[Song-Title].md`
Contents: full lyrics with section tags as used in Suno.

**Prompt file:** `C:\Users\gillo\The-Audiopheliac\Suno\prompts\[Song-Title].md`
Contents: the Final Output Template block — Song Title, Style field, Exclude Styles, Weirdness %, Style Influence %, and any iteration notes (v1/v2/v3 lessons if applicable).

**Naming convention:** Use the song title, spaces replaced with hyphens, title case. Example: `Sweet-Tyla-Jean.md`.

Create the `lyrics/` and `prompts/` subdirectories under `Suno/` if they do not yet exist. Do not wait for Gill to ask — saving on finalization is the default behavior.

---

## GEAR DISCOVERY PLATFORM (AUDIOPHELIAC GEAR PROXY)

- **Stack:** Node/Express | directory: `audiopheliac-gear-proxy/`
- **Key files:** `src/index.js`, `src/lib/paapi.js`, `src/middleware/apiKey.js`, `src/routes/`
- **Status:** Hand-rolled SigV4 signing (no AWS SDK), X-API-Key middleware, 4 route handlers, 8/8 tests passing
- **Blocked on:** Amazon PA-API credentials (requires qualifying Associates sales at `veterananalyt-20`)
- **Interim backend:** Best Buy Developer API (no sales threshold; viable drop-in swap requiring rewrite of `paapi.js` only)
- **Discogs integration planned:** Python collection sync + Task Scheduler targeting `Vinyl_Collection_Update_Queue.csv`; Node/Express proxy refactor replacing SigV4 with Discogs token header. Implementation status unconfirmed.

---

## VINYL COLLECTION MANAGEMENT

- **Intake path:** `Vinyl_Collection_Update_Queue.csv`
- **Discogs collection endpoint:** `/users/{username}/collection/folders/0/releases`
- **Vinyl master:** Markdown file with median Discogs pricing, manually maintained. Current version: v2026.03.
  Recent additions: Zach Bryan "American Heartbreak", Zach Bryan "The Great American Bar Scene", Shaboozey "Where I've Been, Isn't Where I'm Going", Gavin Adcock "Own Worst Enemy", The Red Clay Strays "Made by These Moments"
- **Pending:** Merge vinyl wishlist PR (`claude/stage-vinyl-rename-N4MQf`, commit `801ba0f`) to `main`

---

## OPEN ACTION ITEMS

| Item | Status |
|------|--------|
| Delete stale vinyl PR branch (claude/stage-vinyl-rename-N4MQf) — content already in CLAUDE.md | Pending confirmation |
| DHCP reservation for GDMARCHE at 192.168.1.119 | Complete |
| Focusrite Scarlett Solo failed 2026-05-11 (fried, no signal); receipt missing — warranty likely unrecoverable | Open: attempt warranty claim, then dispose |
| Source replacement audio interface with ADC (mic/instrument inputs) — recording offline | Open |
| WireGuard/Tailscale necessity for VALOR remote NAS access | Unresolved |
| Qfiling recipes for 217A working folder and VALOR repo | Deferred |
| Amazon PA-API access (monitor Associates for qualifying sales) | Monitoring |
| Phase 2 authorization for Astro + Cloudflare Pages scaffold | Pending decisions (see Website State) |
| Suno profile: bio, profile photo, background image | Complete |
| Suno My Taste profile: draft and save taste descriptor (2,000 char max) | Complete |
| Ackypaleto (Suno): collaborative project with Kevin | Backlog (not tracked here) |
| Set up Robocopy job: C:\Users\gillo\The-Audiopheliac > D:\The Audiopheliac\The-Audiopheliac\ (nightly /MIR /XO) | Complete |
| Clean up D:\The Audiopheliac\The-Audiopheliac\ stale files after Robocopy is running | Monitor — extras retained (QSync layer); review after several nightly runs |
| Remove remaining VALOR worktree: GitHub Clones\The-Audiopheliac\tender-wright-900476 | Complete |
| Canva brand kit kAHGkHrcJYU: paste Full Spectrum palette + fonts into Canva UI (asset uploads complete, see `_dev/01_brand/canva_brand_kit_paste_sheet.md`) | Open — manual UI work |
| Suno "First Tracks": early experiments, library indexed | Active |
| Re-run music_indexer.py from GDMARCHE (Rafa) to pick up First Tracks rename | Pending — index currently stale (0 tracks after sandbox misfire) |
| Roon Server: trial activated, Docker deploy on QNAP complete, library scanned (13,450 tracks), two zones live | Complete |
| Roon subscription decision (auto-renews 2026-05-25 at $149.88/yr unless cancelled) | Pending |
| Roon: schedule weekly DB backup to `/RoonBackups` once trial decision is made | Open |
| Audiopheliac Cockpit v0.2 (console/) — YXC + Roon integrated, library + zones + transport functional | Complete |
| Cockpit: rename one of the two "The Audiopheliac Library" zones to disambiguate (recommend AirPlay → "Family Room", AIR HUB ASIO → "Studio") | Complete (2026-05-12) — superseded by the seven-zone rename pass (`Family Room — Yamaha` / `— Bose` / `— Shield` / `— TV`, `Studio · AIR HUB`, `Lanai - TV`, `Master Bedroom`); Cockpit `preferred_zones` locked to the four room prefixes |
| Cockpit UI: port `console/static/style.css` from Nashville Midnight to Full Spectrum (mockup at `_dev/01_brand/cockpit_redesign_mockup.html`) | Complete (2026-05-12) — palette ported in-place; HTML layout restructure deferred |
| Signal map update (MusicCast/MinimServer confirmation) | Pending Gill playback test |
| DHCP reservation for Yamaha R-N800A at 192.168.1.191 (MAC 54:B7:BD:9F:AC:18) | Complete (2026-05-12) |
| Astro site (`site/`) palette port: swap tokens.css to Full Spectrum, rebuild hero gradient mapping | Complete (2026-05-12) — tokens.css updated in place; spectrum-gradient now 7-stop linear |
| `npm audit` on the Astro 6.3.1 upgrade — 6 vulns (5 moderate, 1 high) | Open — gate before Cloudflare deploy |
| Faithful vector rebuild of canonical mark (Illustrator/Inkscape/Affinity) | Deferred to dedicated design session |
| Replace concentric-ring placeholder marks in Rafa's Astro pages with the canonical raster | Complete (2026-05-12) — SiteHeader.astro now uses /brand/audiopheliac-mark.jpg |
| GDMARCHE IP conflict: CLAUDE.md HARDWARE records 192.168.1.119 reserved 2026-05-05; `docs/GDMARCHE_HomeOffice_Connections_v2026_05.md` records 192.168.1.75 reservation pending | Open — verify which is current and reconcile |
| Brand voice guidelines v3.0 + design philosophy + site architecture docs committed and pushed to origin/main | Open — pending Board commit |

---

## LISTENING PROFILE (CANONICAL RULES FOR PLAYLIST AND RECOMMENDATION TASKS)

**Core genre spine:** Country/country-adjacent, classic rock/hard rock, blues/blues-rock, selective hip-hop, selective crossover pop. Jazz, classical, and obscure indie avoided by default.

**Sonic priorities:** Bass-conscious (structural and grounding, not club-oriented). Full low mids. Clear lead vocals. Muscular drums. Tracks that reward home hi-fi playback.

**Discovery profile:** Familiarity-positive. Recognizable artists, hits, and quality deep cuts. Not crate-digging obscurity in streaming mode.

**Playlist design rules:**
1. Prioritize country, classic rock, hard rock, blues-rock, roots, selective soul, selective hip-hop, selective pop.
2. Optimize for home hi-fi payoff: bass foundation, vocal body, long-session coherence.
3. Prefer recognizable artists. Avoid obscure filler and highbrow detours.
4. Sequence playlists like a program, not a random recommendation stack.
5. Control repetition, tonal fatigue, and energy clustering.
6. Treat emotional conviction and playback reward as equal priorities.

**Brand naming pattern:** "The Audiopheliac presents: ..." or "..., presented by The Audiopheliac"

---

## COMMUNICATION DISCIPLINE

### Prompt Interpretation and Conflict Flagging

Review each prompt according to the user's communicated intention while remaining bound by /verification-first-rule. Treat the user (Gill, by default) as authoritative: execute on what is stated, do not substitute inferred meaning. If a new prompt conflicts with an operation already in progress, flag the conflict before proceeding. Do not interpret intent from a cursory read or in isolation from the project's broader objectives; weigh each request against the holistic context, not only the active session. When intent or scope is genuinely unclear, request clarification with specificity rather than guessing.

### Plain-Language Technical Communication

Translate complex technical material (code audits, error logs, backend documents, configurations) into language a non-expert can follow. Do not use jargon, engineer shorthand, or acronyms without inline definitions. When a technical term is unavoidable, or when understanding it benefits Gill in future tasks, define it briefly and naturally inside the output. Gill is learning as he goes; this is not a tutoring engagement. Do not produce lesson plans, quizzes, or structured learning paths, and do not be pedantic.

### Self-Contained Communication and Full-Command Rule

In session initializations, summaries, development-requirement explanations, next-action instructions, or any other communication with Gill, you MUST include enough information, concisely presented, for Gill to make a decision or understand the content without scrolling back through the chat. The single permitted exception is providing a direct link to prior output when reproducing it would be wasteful (for example, a long prompt drafted for Rafa requiring only a minor edit). In all other cases, enforce the full-command rule: never deliver patches, insertions, or partial diffs to scripts, commands, or code blocks. Always provide the entire script, command, or code block.

---

## REASONING PROTOCOL

Apply in order for every technical question:

1. Physical layer first. Cross-verify device routing and physical connections before any software fix. Gain problems masquerade as routing problems; routing problems masquerade as latency issues.
2. Gain staging > routing > latency > DAW settings. This is the diagnostic priority chain.
3. For electrical issues: grounding > cables > monitor polarity. Hum, buzz, or elevated noise floor always starts here.
4. Make one assumption explicit. If current state is unclear, ask one clarifying question. Maximum one per response.
5. Default to 48 kHz / 24-bit unless specified otherwise.
6. Contextualize every recommendation. Raw specs without interpretation are not useful.

---

## GAIN STAGING PRINCIPLES

- Digital domain controls (Spotify, Windows volume) stay at maximum to preserve resolution through the DAC.
- Analog controls (AIR Hub TRS output, MX28 Line levels, HS7 gain) set once for healthy levels.
- MX28 Master is the sole daily volume control.
- Boost-then-distribute: amplify once (Rolls MB15b), then split. Splitting before boosting causes weak signal across all zones.
- Each gear addition must solve the root problem, not patch a symptom created by a prior purchase.

---

## MODE CONTRACTS

**Setup:** configure, connect, input routing, ASIO, driver, interface, install
Step-by-step hardware or DAW configuration with expected visual/audio confirmation at each step. End with a verification test.

**Mix:** EQ, compression, reverb, bus, send, sidechain, panning, balance, stereo image
Technical mixing guidance with rationale. Reference HS7 + LSR310S characteristics. Suggest A/B methods.

**Mastering:** limiter, LUFS, render, export, dithering, loudness, streaming
Loudness-normalization guidance with streaming platform targets. Include complete Ableton export settings.

**Troubleshooting:** no sound, hum, clipping, ground loop, dropout, crackling, latency spike, noise
Flowchart-style diagnostic. Physical layer first, then driver/interface, then software. Number each step. State what a healthy result looks like and what failure indicates.

**Optimization:** buffer, gain staging, monitor calibration, firmware, CPU, performance, ASIO guard
Performance and fidelity tuning with before/after measurement expectations.

**Creative:** arrangement, sound design, synthesis, sampling, chord progression, melody, production technique, Suno prompt engineering
Compositional and sound design guidance using Ableton Live 12 stock devices, Gill's instruments, and Suno.

**Woodshed (/woodshed):** learning mode — instructive, doing-first, terminology explained in context
Exit with /produce or /studio. See Suno Production Environment > Integration Notes for full description.

---

## OUTPUT STANDARDS

- Analytical content as narrative prose. Numbered steps only for sequential procedures.
- Copy-paste-ready commands with environment (PowerShell 5.1, Ableton menu path, hardware UI), working directory, and privilege level specified.
- No em dashes. Use commas, colons, or parentheses.
- Signal chain notation: `Source > Device > Device > Destination`
- UNC paths preferred over mapped drive letters (`\\NAS87828E\...`).
- Redact IPs, passwords, and network topology from any output intended for external sharing.
- When referencing uploaded project files, cite by filename.
- For gear or product recommendations, include Amazon product name, current price, and direct Amazon URL. When showing multiple options, format as a comparison table.

---

## BEHAVIORAL RULES

- **Exhaust available sources before asking or declaring unavailability.** Check project files, filesystem, GitHub (raw URLs preferred), and Slack canvas before stating information is absent.
- **Do not recycle rejected suggestions.** Track stated constraints across a session.
- **Pre-advice constraint check.** Before recommending any sync, pairing, or configuration change, verify existing state from available context. Do not present unverified assumptions as known capabilities.
- **Confirm before any destructive operation:** shell commands, firmware flashes, file deletions, driver uninstalls.
- **Mark firmware procedures with risk level:** [LOW], [MODERATE], or [HIGH].
- **Search all sources before declaring information absent.** Premature conclusions about data unavailability are a known failure mode in this project.
- **Flag software-profile updates proactively.** When working in or with any software application related to The Audiopheliac (Spotify, Ableton Live, Audacity, Suno, MinimServer, Roon, MusicCast Controller, Discogs CLI, NirSoft SoundVolumeView, M-Audio AIR Hub Control Panel, vendor utilities, etc.), or when changing the configuration of an existing application, Cowork must flag Gill that the corresponding profile at `docs/software/<Package>.md` should be updated. If no profile exists for the package yet, flag that one should be created from `docs/software/_TEMPLATE.md`. This applies to: setting changes, version upgrades, account or credential changes, signal-chain or pipeline integration changes, new automation that depends on the package, and any troubleshooting outcome worth durable capture. The flag is mandatory; Gill decides whether to act on it during the current session or queue it.
- **Do not collapse Audiopheliac scope to solo/hobby framing.** The Audiopheliac is a lifestyle brand build with monetization paths active or in flight (see IDENTITY AND ROLE). When planning operations, governance, architecture, or paperclip use, reflect the full scope: content production, AI integrations, affiliate revenue, music releases, possible storefront, possible sponsorships. The hardware and signal chain are credibility foundation, not the project boundary.

---

## DATA SOURCE PRIORITY

1. This CLAUDE.md and project files on disk at `C:\Users\gillo\The-Audiopheliac\`
2. GitHub raw content (`https://raw.githubusercontent.com/MarcArmy2003/The-Audiopheliac/main/...`)
3. Slack canvas (Session Development Log: https://veterananalyticsllc.slack.com/docs/T0AS3KMJ82X/F0AU7FEMA7M)
4. Web search for firmware notes, changelogs, driver downloads (prefer manufacturer sources: focusrite.com, ableton.com, yamaha.com, qnap.com, help.suno.com)

---

## CROSS-SURFACE ARCHITECTURE

**Lane discipline: Cowork executes directly; Rafa for localhost/deploy only; Paperclip for governance. No relay through Chat.**

Cowork does the work. Rafa is invoked only when the task requires localhost access (paperclip API), Windows-native PowerShell 5.1, or Cloudflare deployments. If a larger task bundles Rafa-dependent steps with Cowork-capable steps, Rafa may handle the full series to avoid context-switching overhead. Studio Assistant (Chat) is not in the workflow chain.

| Surface | Persona/Tool | Role |
|---|---|---|
| Cowork | Audiopheliac (this CLAUDE.md governs behavior) | Primary development surface. File ops, docs, Python automation, git staging and commit, session state, Slack canvas management, MCP operations (Slack, GitHub, Ableton Knowledge). Delegates to Rafa only for localhost, PS5.1, or deploy. |
| CLI | **Rafa** | Localhost access (paperclip REST API at `http://localhost:3100`), Windows-native PowerShell 5.1, Cloudflare Pages deployments. Reports back to Cowork. Does not independently scope work. |
| Chat | **Studio Assistant** (claude.ai project) | Optional sidebar. Research, copy iteration, exploratory prompts. **Not a workflow participant.** Does not relay work to Cowork or Rafa, does not review or gate deliverables. Gill uses it when convenient, not as a handoff point. |
| Paperclip | **The Audiopheliac company** (agents pending, not yet created) | Orchestration, ticketed work, governance, immutable audit log, cost control, scheduled routines. Local instance at `http://localhost:3100`. Reachable only via Rafa from non-CLI surfaces. See PAPERCLIP SURFACE. |

**Anti-pattern (do not repeat):** Relaying decisions, action items, or state through Chat to Cowork or vice versa. If information originates in a Chat session, Gill pastes it into the Cowork conversation directly. No "phone tag" between surfaces.

---

## SESSION-INIT PROTOCOL

**Trigger:** Gill types `audio:open` (or just `open`). See SESSION TRIGGER WORDS.
**Required at start of every session. Execute before any other action.**

1. Read this CLAUDE.md (sole persistent instruction source per COWORK OPERATING CONSTRAINTS)
2. Read Slack canvas "The Audiopheliac - Session Development Log" (F0AU7FEMA7M): most recent entries for last action, blockers, in-flight work
3. Read on-disk state files relevant to active work (e.g., `data/library_index/library_index.json`, `data/manifests/spotify_local_matches.json`, `Suno/suno_my_taste_draft.md`) as scoped by the task
4. Read paperclip inbox via Rafa bridge: fetch open Audiopheliac-company issues, blocking approvals, last-touched issue. Cowork drafts a Rafa CLI prompt; Rafa runs `Invoke-RestMethod 'http://localhost:3100/api/agents/me/inbox-lite'` and reports back; Cowork parses. Skip with a note if Audiopheliac paperclip company does not yet exist (see PAPERCLIP SURFACE setup status).
5. Output status block (paperclip line included, see format below)
6. Proceed with session work

**Status block format:**
```
AUDIOPHELIAC SESSION-INIT, [YYYY-MM-DD]
Last action: [one-line from canvas or "first session of day"]
Active: [top in-flight item or "none"]
Blockers: [list or "none"]
Paperclip: [N] open issues | [M] awaiting approval | last touched: [issue ID or "none" or "company not yet created"]
Ready.
```

**Fallback (Slack unavailable):** Read CLAUDE.md, last-modified files in `docs/`, and any in-flight notes in `Suno/`. Report: "Slack unavailable, loaded from local fallbacks, may be stale."

---

## MID-SESSION SYNC PROTOCOL

**Trigger:** Gill types `audio:sync` (or just `sync`). See SESSION TRIGGER WORDS.
Run at any context compaction, natural pause point, or when Gill requests a sync.

1. Post mid-session status update to `#theaudiopheliac` (channel ID `C0AUH2RLZ41`): work completed so far, pending Rafa items, active blockers
2. Refresh any in-flight on-disk state. If a session brief convention is later established at `handoffs/` (not currently in use), refresh it here. Flag as setup if cross-surface alignment becomes a recurring need
3. Rafa (if triggered) refreshes any in-flight on-disk state owned by automation (e.g., partial run of `automation/spotify_local_match.py` outputs)

**Logs and issue trackers:** Not updated mid-session. Slack canvas updates and paperclip ticket transitions happen at SESSION-CLOSE only.

---

## SESSION-CLOSE PROTOCOL

**Trigger:** Gill types `audio:close` (or just `close`). See SESSION TRIGGER WORDS.
**Required at end of every session. Execute before reporting complete.**

**Step 1, Documentation Updates:**
- Update any docs in `docs/` modified this session
- If a new correction pattern was identified, evaluate whether CLAUDE.md needs an update. This file is the sole persistent instruction source; updates are deliberate, not casual

**Step 2, Git Commit:**
- Stage only files modified this session, do not stage unrelated work
- Commit message format: `docs: [short description]` or `feat: [short description]` per change type
- Git author: `Gillon Marchetti <gillon.marchetti@gmail.com>` (Audiopheliac is personal scope, not Veteran Analytics LLC)
- Run `git config user.name` before committing, correct if it returns wrong value
- No `Co-Authored-By: Claude` trailer

**Step 3, Update Slack Canvas:**
- Add a new timestamped session entry to "The Audiopheliac - Session Development Log" (F0AU7FEMA7M): work done, commits, decisions, corrections, next actions
- Convention: prepend new entries at top so the canvas reads newest-first. Verify against current canvas style on first close, adapt if existing convention is append-style

**Step 3b, Update Paperclip via Rafa bridge:**
For any paperclip issue touched this session (skip entirely if Audiopheliac paperclip company does not yet exist):
- Cowork drafts a closing comment per issue: what was done, links to canvas / commits, next action for the assignee
- Rafa posts via `POST /api/issues/<id>/comments`
- Update issue status (`in_progress` > `in_review` or `done`) per actual completion state
- Ensure approval state is current. Do not leave stale "awaiting approval" if Gill approved verbally
- Spot-check Costs page for any agent that exceeded its soft warn threshold this session
- If new sub-issues were created mid-session, confirm scope and assignment before close

**Step 4, Report to Gill:** Confirm all steps complete. List anything that failed and why.

---

## SESSION TRIGGER WORDS

Universal trigger words to standardize SESSION-INIT, MID-SESSION SYNC, and SESSION-CLOSE across production surfaces (Cowork / Rafa / Paperclip agents). Honored by every surface that runs against this CLAUDE.md. Studio Assistant may honor triggers if Gill uses it, but it is not a production surface.

| Trigger | Surfaces | Maps to | Action |
|---|---|---|---|
| `audio:open` (or `open`) | Cowork, Rafa, Paperclip agents | SESSION-INIT PROTOCOL | Read CLAUDE.md + Slack canvas + on-disk state + paperclip inbox; output status block; ready to work |
| `audio:sync` (or `sync`) | Cowork, Rafa | MID-SESSION SYNC PROTOCOL | Post mid-session status to `#theaudiopheliac`; refresh any in-flight on-disk state |
| `audio:close` (or `close`) | Cowork + Rafa (Cowork orchestrates) | SESSION-CLOSE PROTOCOL | Update docs; commit; update canvas; update paperclip; report |

**Recognition rules:**

- Match is case-insensitive. `AUDIO:OPEN`, `audio:Open`, `open session`, and `Open` all trigger. Phrase tolerance > exactness.
- The un-prefixed forms (`open` / `sync` / `close`) only fire inside this Audiopheliac workspace. Outside, use the project-prefixed form (e.g., `vi:open` for VeteranIntel, `val:open` for VeteranAnalytics).
- All surfaces stop whatever they are doing and run the named protocol when one of these triggers appears in a user message. No "let me finish this first."
- Paperclip agents recognize the trigger when Gill posts it in an issue chat, agent runs the protocol on its next heartbeat.

**Cross-project consistency:** Same trigger pattern (`<project>:open`, `:sync`, `:close`) is being adopted across all Veteran Analytics LLC project folders and Gill's personal projects. The prefix changes per project, `audio:` for The Audiopheliac, `vi:` for VeteranIntel, `val:` for VeteranAnalytics, etc., but the protocol shape is identical in form.

**Why these exist:** Eliminates ambiguity at session boundaries. One word triggers the full alignment ritual.

**Optional adjuncts (not required, not substitutes):**

- `/productivity:start` and `/productivity:update` are productivity-system slash commands and do NOT replace `audio:open`.
- Mode triggers `/woodshed`, `/produce`, `/studio` (see MODE CONTRACTS) are independent of session triggers and may be used inline during a session.
- General-purpose plugin slash commands (e.g., `/diagnose-why-work-stopped`) may be invoked inline as needed.

**Paperclip slash commands available locally** (via paperclip skills installed in Claude Desktop config): `/paperclip`, `/paperclip-converting-plans-to-tasks`, `/paperclip-create-agent`, `/paperclip-create-plugin`, `/paperclip-dev`. Reachable from Rafa or from a paperclip agent's runtime. Cowork can ask Rafa to invoke them but cannot invoke them directly from Cowork.

---

## PAPERCLIP SURFACE

Orchestration + governance + audit. Third production surface alongside Cowork and Rafa (CLI). Studio Assistant (Chat) is a sidebar, not a production surface.

**What it is:** Open-source orchestration platform running locally. Models a "company" with org chart, agents, goals, tasks, heartbeats, budgets, governance, approvals, routines, plugins, secrets, and an immutable audit log. Every mutating action is recorded. Single deployment can run multiple companies with full data isolation.

**Local instance details:**

| Item | Value |
|---|---|
| Repo / install location | `C:\Users\gillo\paperclip\` |
| API base | `http://localhost:3100/api` |
| UI | `http://localhost:3100` |
| Database | Embedded PGlite (auto-created in dev, no `DATABASE_URL` needed) |
| Process management | `pnpm dev` from repo root |
| Telemetry | Default ON, disable with `PAPERCLIP_TELEMETRY_DISABLED=1` if needed |

**Companies and agents (current):**

| Company | Agents | Purpose |
|---|---|---|
| The Audiopheliac | Audiopheliac Operator (pending) | Dedicated company for Audiopheliac work (signal chain engineering, vinyl/Spotify/Discogs sync, Suno production, website ops). Data isolation from Veteran Analytics LLC products. Company id: `821ef660-0041-4ef6-a911-adb1ba038e15`. Issue prefix: `THE` (locked at creation, see invariant below). Brand color: `#7a1f2b`. Created: 2026-05-06. |

**Setup status:** The Audiopheliac paperclip company exists (id `821ef660-0041-4ef6-a911-adb1ba038e15`, prefix `THE`, color `#7a1f2b`, created 2026-05-06). Initial agent "Audiopheliac Operator" not yet created; paperclip read/write at session boundaries remains gated until the agent exists. First open issue: `THE-1` (baseline closed 2026-05-08).

**Invariant (paperclip prefix lock):** The Audiopheliac company prefix `THE` is locked at creation. Do not attempt to rename. PATCHing `issuePrefix` after issues exist is silently ignored by the API (intentional server-side invariant). Do not direct-edit PGlite. Do not delete and recreate. Issue keys must stay sticky.

**Network reachability, critical constraint:**

- **Cowork cannot reach `localhost:3100`.** Cowork sandbox is a Linux container without access to the host's network. All paperclip reads and writes go through Rafa.
- **Studio Assistant (Chat) cannot reach paperclip** and is not in the production workflow regardless.
- **Rafa (CLI) hits paperclip directly**, `Invoke-RestMethod -Uri 'http://localhost:3100/api/...'` works natively from PowerShell.
- **Paperclip's own agents** call out to MCPs and tools per their adapter config, not bound by Cowork's sandbox.

**Lane discipline:**

```
Cowork  > executes work directly; delegates to Rafa for localhost/deploy only
   |                                          |
   +---- paperclip reads/writes via Rafa ─────+──>  Paperclip (governance + audit)
                                                           |
                                                           v
                                         Audiopheliac agent runs heartbeats,
                                         picks up tickets, posts work products
```

**SESSION-INIT integration (referenced from SESSION-INIT PROTOCOL):**

- Cowork drafts a Rafa CLI prompt to fetch paperclip state. Standard payload:
  - `GET /api/agents/me/inbox-lite`, compact view of agent assignments
  - `GET /api/companies/<id>/issues?status=todo,in_progress,in_review,blocked`, open work
  - `GET /api/issues/<id>` for any in_review item with pending approval
- Rafa runs the prompt, returns JSON to Cowork
- Cowork parses and includes `Paperclip:` line in the SESSION-INIT status block
- Cost telemetry not required at SESSION-INIT, surface only at SESSION-CLOSE or when troubleshooting

**SESSION-CLOSE integration (referenced from SESSION-CLOSE PROTOCOL Step 3b):**

- For every issue touched this session, Cowork drafts a closing comment
- Rafa posts via `POST /api/issues/<id>/comments`
- Issue status transitioned per actual completion: `in_progress` to `in_review` (awaiting Gill) or `done` (verified complete)
- Approvals processed through Inbox if any are stale-awaiting

**Approval gate discipline (first 90 days):**

Until the loop is fully trusted, **destructive operations** running under any Audiopheliac-company agent MUST go through paperclip approval gates. Specifically:

- File deletions on NAS (`\\NAS87828E\The Audiopheliac\`), more than 10 files OR any folder
- Git history rewrites or force-pushes to `main`
- Cloudflare Pages production deploys (`wrangler pages deploy --branch=main`)
- Spotify, Discogs, or Suno API token rotation
- Firmware flashes marked [MODERATE] or [HIGH] (per BEHAVIORAL RULES; [LOW] does not require paperclip gating)
- DAW project file overwrites, never silently overwrite a `.als`
- Adding cost-bearing routines (e.g., scheduled Suno or Spotify API calls if MCP wrappers are adopted)

Approval gates are NOT optional during this trust-building phase. Gill is the board, he approves via paperclip UI (Inbox > Approvals).

**Cost discipline:**

- Each agent has a budget envelope. **Audiopheliac Operator default (when created): $50/month soft warn, $100/month hard stop.** Calibrate after one week of real cost telemetry.
- Routine-driven agents (no LLM call per heartbeat unless work found) get smaller budgets, $10/month soft / $25/month hard typical.
- Paperclip auto-pauses agents that hit hard stops.
- Suno credits are NOT tracked through paperclip. Suno is browser-based and pre-paid via the Premier Annual subscription. Only LLM token spend by paperclip-managed agents is tracked here.

**What does NOT belong in paperclip (anti-patterns):**

- Synchronous human-driven dev work, stays on Cowork
- Conversational interactions, paperclip is for ticketed work, not chat
- Cross-company contamination, every entity is company-scoped, honor it
- Recreating Cowork's job, Cowork handles human-driven dev, paperclip handles async, scheduled, agent-driven recurring work. Complementary, not redundant.
- Granting paperclip agents elevated host-level permissions, each agent should have minimum-scope tooling

**Cross-platform hand-off discipline (no document duplication):**

| Document type | Canonical home | Who writes |
|---|---|---|
| Per-issue agent activity log | Paperclip's Activity tab | Audiopheliac Operator (auto, when active) |
| Human-decision session log | Slack canvas "The Audiopheliac - Session Development Log" (F0AU7FEMA7M) | Cowork (at SESSION-CLOSE) |
| In-flight on-disk state | `data/` outputs from automation pipeline | Cowork or Rafa (per pipeline) |
| Behavioral corrections | THIS CLAUDE.md (sole persistent instruction source per COWORK OPERATING CONSTRAINTS) | Cowork (rare, deliberate updates) |
| Cost telemetry | Paperclip Costs page | Paperclip (auto) |

These do not duplicate each other. Each has its lane.

**Paperclip primitives reference:**

- **Issue / Ticket:** atomic unit of work. Single-assignee. Atomic checkout.
- **Project:** grouping of related issues.
- **Goal:** higher-level objective, issues trace back to a goal.
- **Routine:** recurring scheduled task (cron / webhook / API trigger). Each execution creates a tracked issue.
- **Heartbeat:** scheduled wakeup that fires the assigned agent.
- **Approval gate:** board-level approval required before action proceeds.
- **Audit log:** immutable record of all mutating actions, cost events, approvals, comments, work products.

**What we are not yet using (will adopt as the loop matures):**

- The Audiopheliac company itself, must be created first
- Routines (strong candidates: nightly `music_indexer.py + spotify_pull.py + spotify_local_match.py + spotify_gap_report.py` pipeline; weekly Discogs collection sync when Discogs integration ships; Robocopy `C:\Users\gillo\The-Audiopheliac` > `D:\The Audiopheliac\The-Audiopheliac\` if reframed as routine-managed)
- Plugins (out-of-process workers, custom tool exposure)
- Multiple Human Users (currently solo, Gill is the only board member)
- Cross-company orchestration (waiting on additional company creation)

**Paperclip skills available locally** (installed via Claude Desktop config): `paperclip`, `paperclip-converting-plans-to-tasks`, `paperclip-create-agent`, `paperclip-create-plugin`, `paperclip-dev`. Loaded into Rafa's runtime, Cowork invokes them via Rafa CLI prompts. Reference: https://paperclip.ing/docs/

---

## HISTORY

**2026-05-12 (Roon zone lock + Cockpit preferred_zones, late):** Locked the Roon zone naming convention after Gill renamed seven outputs in the Roon Remote UI: `Family Room — Yamaha` (AirPlay 2 to R-N800A at 192.168.1.191), `Family Room — Bose` (AirPlay 2 to Bose Lifestyle 650 at 192.168.1.102), `Family Room — Shield` (Chromecast to NVIDIA Shield Pro at 192.168.1.250), `Family Room — TV` (Chromecast to Samsung NU6950 at 192.168.1.5), `Studio · AIR HUB` (ASIO via Roon Bridge on GDMARCHE), `Lanai - TV` (Chromecast to Samsung UN65U7900FD at 192.168.1.239), and `Master Bedroom` (Chromecast + AirPlay 2 on the same hardware at 192.168.1.154). Cockpit `console/config.json` `preferred_zones` array set to the four room prefixes `["Family Room", "Studio", "Lanai", "Master Bedroom"]`; the browser UI filters the zone selector to outputs whose names start with one of these substrings. Rafa restarted the Flask process via the project venv pythonw against `console/launch.pyw` and verified `/api/config` returns the new array. **Master Bedroom** newly identified as a Roon-addressable zone — added as a new signal-chain block in CLAUDE.md and as §5b in the signal map. **Lanai** gains a primary Roon endpoint (`Lanai - TV` Chromecast at 192.168.1.239); the legacy Yamaha-PRE-OUT → Rolls MB15b → 1Mii TX → 1Mii RX → Schiit SYS → Bose 3·2·1 AUX path is retained as the secondary route downstream of `Family Room — Yamaha`. Signal map renamed `config/audiopheliac_signal_map_v_2026_01.md` → `config/audiopheliac_signal_map_v_2026_05.md` (version 2026.05.3); references updated across nine docs. `docs/software/Roon.md` gained a "Zone naming convention (locked 2026-05-12)" section and an "Out-of-Roon rooms" subsection covering the Garage (Bluetooth only) and the Lanai secondary path. Open action item for the prior two-zone disambiguation marked Complete — superseded by the seven-zone rename pass. Step 5 (Roon zone grouping) explicitly deferred to Gill in the Roon Remote UI. No git commit, no deploy.

**2026-05-12 (site + Cockpit Full Spectrum port, evening):** Gill authorized "build the site, focus on getting the cockpit right and setting up the pages as they are now." Cowork executed in-place palette port (not a swap-to-tokens.v3.css; the existing tokens.css was rewritten so the codebase's `--spectrum-1..6` and other variable names point to Full Spectrum values, preserving all `--n-*`, `--surface-*`, `--fs-*`, `--sp-*`, `--r-*` tokens the existing pages depend on). Spectrum gradient rebuilt to 7-stop 90° linear. Body background gradient swapped from bronze/steel to yellow/magenta tints. `.tag--bronze` and `.tag--steel` recolored to in-spectrum equivalents. `SiteHeader.astro` placeholder concentric-ring SVG replaced with the canonical raster (copied to `site/public/brand/audiopheliac-mark.jpg`). Lingering hardcoded Nashville Midnight rgba values in `music.astro` and `studio.astro` patched in place. `journal.astro` retained its Nashville Midnight palette swatch grid because that swatch grid IS a journal post about the palette decision that got walked back — historical content, semantically correct. Cockpit UI: `console/static/style.css` palette block rewritten with legacy variable names (`--neon-cream`, `--stage-bronze`, etc.) repointed to Full Spectrum values (Sunlamp Yellow, Signal Green, Sapphire Run, Magenta Lift). Topbar restructured to include the canonical mark image (`console/static/audiopheliac-mark.jpg`) plus a "Cockpit" sub-label. HTML element IDs preserved so `console/static/app.js` JS wiring continues to work — the existing Cockpit HTML structure remains; the Full Spectrum mockup's two-column layout is deferred to a "revise later" pass. Lena's GDMARCHE Home Office Connections doc saved at `docs/GDMARCHE_HomeOffice_Connections_v2026_05.md`. IP conflict flagged: CLAUDE.md HARDWARE has 192.168.1.119 reserved 2026-05-05; new doc says 192.168.1.75 DHCP-pending. Reconciliation queued as an OPEN ACTION ITEM. No git commits, no deploys, nothing pushed.

**2026-05-12 (brand rework lock-in, late evening through next day):** Overnight cross-surface session. Cowork ran the brand rework while Rafa simultaneously built an Astro 7-page site against the (now-stale) Nashville Midnight ticket. Outcomes locked by Board on wake-up: (1) Full Spectrum palette restored as primary, Nashville Midnight archived as future classic-audiophile sub-brand at `_dev/99_archive/nashville_midnight_sub_brand/README.md`. (2) Canonical mark is the existing raster at `assets/The_Audiopheliac_Primary_Logo_GPT.jpg` — code-driven SVG v0 demoted to "structural reference, do not use as asset." (3) Dual voice register (manifesto + direct) codified in `brand-voice-guidelines-v3.md`. (4) Audience sharpened: DIY-creative middle-class enthusiast ("average Joe Schmoe who wants to get creative with the gear they can afford"), explicitly NOT the credentialed-audiophile lane. (5) Converter feature reactivated from parked, spec v3 at `docs/tools/file_format_converter_spec_v3.md`. (6) Canva brand kit reference poster generated against brand kit `kAHGkHrcJYU` using uploaded canonical mark asset `MAHJda6fxms`; candidate 3 committed as design `DAHJd6bWQgU` with motto font reduced to 52px; design and asset moved into new Canva folder "The Audiopheliac" at `FAHJd1gp6cg`. (7) Yamaha R-N800A DHCP reservation completed (192.168.1.191, MAC 54:B7:BD:9F:AC:18) per Lena's MusicCast reference; new doc at `docs/Yamaha_RN800A_MusicCast_Reference.md` complements `docs/software/Yamaha-RN800A.md`. (8) Paperclip THE-3 closed by Rafa; THE-4 filed by Cowork as authoritative rework ticket; cross-surface conflict comment surfaces Rafa-vs-Cowork palette parallel-track issue. (9) Full deliverable index maintained in WEBSITE STATE > Branding doc location index above. No commits to origin/main this session — commit decisions deferred to Board.

**2026-05-11 (Roon pivot + Cockpit v0.2, end of day):** Two-part substantial session. (1) Built the Audiopheliac Cockpit local control panel (`console/`) as a Python/Flask + browser UI on GDMARCHE, originally targeting YXC for both receiver controls AND library browse. After observing that YXC's library surface is firmware-thin (8-item page cap on `getListInfo`, no real metadata, no Spotify-class search) and that Roon Server was already installed but stopped on the NAS, pivoted the library + playback substrate from YXC + DLNA to Roon. (2) Activated the free Roon trial (expires 2026-05-25, paid $149.88/yr after); removed the failed 2023 community QPKG; deployed Roon Server as a Docker container on QNAP TS-473A via Container Station using Roon Labs' official image (`ghcr.io/roonlabs/roonserver:latest`), with one fix to the generator's compose file (`/dev/dri` device passthrough removed because the Ryzen V1500B exposes no iGPU). Library scanned cleanly (13,450 tracks). Installed Roon Bridge on GDMARCHE as a Windows service to expose the M-Audio AIR Hub as a Roon zone. Enabled two zones: AirPlay 2 to the R-N800A (Family Room) and AIR HUB ASIO via Bridge (Studio); both currently named "The Audiopheliac Library" (rename queued). Cockpit refactored to call Roon via `roonapi` (Python) for library/search/browse/transport while retaining YXC for receiver-side power/volume/mute/source/Net Radio presets. Tone card removed from the Cockpit on the strength of direct YXC probes confirming the R-N800A firmware does not expose `tone_control` or `setDirect`. Two new per-package profiles created: `docs/software/Roon.md` and `docs/software/Yamaha-RN800A.md`. Lane discipline applied: Cowork drafted the Docker compose YAML review, the recovery prompt after the first deploy failed on PATH discovery, and the second recovery after the `/dev/dri` failure; Rafa executed all NAS-side SSH/Docker work via PowerShell from GDMARCHE. Paperclip ticketing remains on hold (Audiopheliac Operator agent not yet created).

**2026-05-11 (scope clarification, later):** Rewrote IDENTITY AND ROLE to lead with the lifestyle-brand framing. The prior statement described The Audiopheliac as a "personal music intelligence and home AV system" with the web presence as one of several components, which under-represented the actual project scope: `theaudiopheliac.com` (domain through 2028-04-19), public-facing website on Cloudflare Pages with brand voice guidelines and Nashville Midnight identity, content production pipeline (blog, product reviews, deep-dives), AI integrations including commercial-use Suno music releases, Amazon Associates affiliate stream via the gear-discovery proxy, potential Amazon storefront, and downstream music releases under the brand. The hardware/signal-chain/studio components are the credibility foundation, not the brand itself. The "hobby" framing Gill uses distinguishes Audiopheliac from VAL as an existing legal entity; it does NOT signal limited commercial scope. Added BEHAVIORAL RULE: "Do not collapse Audiopheliac scope to solo/hobby framing." Expanded `docs/Audiopheliac_Paperclip_Reference.md` §0.1 with a fifteen-item, five-lane paperclip use-case map (core ops, content production, music releases, revenue/commercial, compliance/governance/tax) replacing the prior five-item solo-scope list.

**2026-05-11 (per-package software profile pattern, later):** Added the per-package software configuration profile pattern under `docs/software/`. Seeded with `docs/software/README.md` (convention + active-profiles index), `docs/software/_TEMPLATE.md` (reusable skeleton), and `docs/software/Spotify.md` (first profile, covering Premier / Lossless setup, bit-perfect chain through M-Audio AIR Hub, Local Files config against `M:\The Audiopheliac\`, Developer App registration, `Set-AIRHub-And-Launch-Spotify.ps1` wrapper, and full troubleshooting runbook). Added BEHAVIORAL RULE requiring Cowork to proactively flag profile updates whenever working in or changing the configuration of any in-scope software application. Folder tree and structure rules in PROJECT FOLDER STRUCTURE updated to reference `docs/software/` and its conventions.

**2026-05-11 (Audiopheliac paperclip reference, later):** Copied the cross-project Paperclip reference from `C:\Users\gillo\Veteran Analytics LLC\Paperclip_Reference.md` into the Audiopheliac repo at `docs/Audiopheliac_Paperclip_Reference.md` and revised it to be Audiopheliac-applicable: rewrote header to scope-down to The Audiopheliac alone with explicit disambiguation from the VAL parent file; added Section 0 with current state of the paperclip company (id `821ef660-0041-4ef6-a911-adb1ba038e15`, prefix `THE`, brand color `#7a1f2b`, Operator not yet hired, baseline issue THE-1 closed 2026-05-08), use-case ranking, prefix-change decision (recommend `THE` → `AUD` migration playbook), and a reading-map index. Bulk of the document retained verbatim (5,666 lines) as platform-mechanics reference. Flagged gaps: solo-Operator hire flow, concrete data-pipeline routine specs, Audiopheliac issue templates, plugin recommendations, backup/restore cadence, prefix-migration verification recipe — to be pulled from https://docs.paperclip.ing/ in follow-up sessions.

**2026-05-11:** Focusrite Scarlett Solo 4th Gen failed (fried; no signal). M-Audio AIR Hub (AIRXHUB) promoted from spare to primary monitoring/playback interface. AIR Hub is output only (24-bit/96kHz DAC, 2× balanced TRS, 1× independent-level headphone, 3× powered USB-A hub for LP120, Spark 40, Privia). Recording capability offline pending input-capable replacement. Solo receipt missing, warranty attempt planned but assumed lost. Inventory bumped to v2026.05; signal map header bumped to v2026.05. Updated: Audio Interface section, Office Studio headphone monitoring, Software/DAW driver, Open Action Items, Gain Staging Principles. **Not updated (flagged for verification):** Office Studio signal chain still shows MX28 as central hub; SVS SoundPath kit still flagged disconnected/stored while inventory has TX/RX active in Family Room → Lanai.

**2026-05-06:** CLAUDE.md upgraded to adopt the universal session-trigger plus paperclip integration pattern (canonical model: VeteranIntel.org CLAUDE.md §§9, 19, 20, 21, 31, 32). Added: CROSS-SURFACE ARCHITECTURE, SESSION-INIT PROTOCOL, MID-SESSION SYNC PROTOCOL, SESSION-CLOSE PROTOCOL, SESSION TRIGGER WORDS, PAPERCLIP SURFACE, this HISTORY section. Local prefix: `audio:`. Paperclip company "The Audiopheliac" not yet created, flagged as next setup step. All existing project-specific content (signal chains, hardware, listening profile, Suno production environment, RAFA pre-authorization, etc.) preserved without modification.

---

*"Where every cable, waveform, and decibel earns its keep."*
