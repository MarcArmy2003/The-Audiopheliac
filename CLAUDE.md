# CLAUDE.md — The Audiopheliac | Cowork Project Instructions

**Version:** 2026.05 | **Owner:** Gillon "Gill" Marchetti (MarcArmy2003)

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

The Audiopheliac is Gill Marchetti's personal music intelligence and home AV system. It spans signal chain engineering, studio production, vinyl collection management, Spotify/Discogs integration, Suno AI music production, and a public-facing web presence.

**Motto (website and company):** "Rock 'n' roll. Deal with it." — Bret Easton Ellis, *The Rules of Attraction*
**Persona:** Enthusiastic, witty, unflinchingly honest.
**Tone:** Direct, technically precise, conversational. Explain the why behind every recommendation.
**Companion project:** `The Audiopheliac | Studio Assistant` on claude.ai handles complex research, reasoning, and technical validation. Cowork handles file operations, script execution, and automation tasks against the local filesystem.

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

---

## PLATFORM CREDENTIALS

### Spotify Developer App
- **App Name:** The Audiopheliac
- **Client ID:** `7b8b0cd38be7496b864a0380b8c2a16c`
- **Status:** Development mode (max 5 authorized users)
- **Redirect URI:** `https://github.com/MarcArmy2003/The-Audiopheliac`
- **Authorized users:** gillon.marchetti@gmail.com, gillon.marchetti@veterananalytics.com

### Suno
- **Handle:** `@marcarmy2003`
- **Public profile:** https://suno.com/@marcarmy2003
- **Display name:** Gdmarche Marchetti (pending brand alignment update)
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
- IP: 192.168.1.75 | MAC: 4C:1D:96:3F:95:62 | Wi-Fi 5GHz via Spectrum SAX2V1R
- DHCP reservation at 192.168.1.75 is an open action item

### Audio Interface
- Focusrite Scarlett Solo Gen 4 (ASIO driver; simultaneous WDM + ASIO supported)

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
- Rolls MB15b signal booster — Family Room distribution
- Schiit SYS passive switcher — Lanai
- Sprodio K2 stereo-to-mono converter (stored; left-channel PRE OUT attenuation issue resolved, no longer in active signal path)

### Wireless Distribution
- 1Mii RT5066R2: one TX (from Rolls MB15b, Family Room); one RX in Office Studio, one RX on Lanai
- SVS SoundPath TX/RX kit: disconnected, stored for future use

### NAS
- QNAP TS-473A (hostname: NAS87828E) | IP: 192.168.1.230 | 16GB RAM
- Drives: WD Red Plus 12TB + 10TB | balance-alb trunking across 2x 2.5GbE
- Passive 5GbE switch (QNAP QSW-1105-5T) between router and both NAS ports

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
AT-LP120XUSB
  > Rolls MX28 Mini-Mix VI

1Mii RX
  > Rolls MX28 Mini-Mix VI

GDMARCHE (Spotify / streaming)
  > Rolls MX28 Mini-Mix VI

Rolls MX28 Mini-Mix VI
  > Yamaha HS7 monitors + JBL LSR310S subwoofer

Headphone monitoring: Scarlett Solo headphone output preferred for all
streaming and DAW listening. MX28 headphone output reserved for multi-source
blended monitoring only. Direct Monitor switch stays off for all playback;
on only for live zero-latency recording.
```

### Lanai
```
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

Note: Samsung UN65U7900F has no optical out. J-Tech JTECH-AE4KA handles eARC audio extraction and feeds the Bose TV 1 input directly. Schiit SYS switches between whole-house audio (1Mii RX) and karaoke (Singing Machine), feeding the Bose AUX input. Bose source selection handles TV vs AUX natively on the unit.

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
- **Driver:** Focusrite ASIO (simultaneous WDM + ASIO supported)
- **Ableton paths:**
  - Cache: `D:\Ableton Cache`
  - User Library: `D:\Ableton User Library`
- **Spotify:** Microsoft Store install | username: `gdmarche-user`
  Path: `C:\Users\gillo\AppData\Local\Packages\SpotifyAB.SpotifyMusic_zpdnekdrzrea0\LocalState\Spotify\`
  Network path: Streamed from GDMARCHE to Yamaha R-N800A
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

**Daily refresh (PowerShell 5.1, run from `C:\Users\gillo\The-Audiopheliac\`):**
```powershell
python automation\music_indexer.py
python automation\spotify_pull.py
python automation\spotify_local_match.py
python automation\spotify_gap_report.py
```

---

## WEBSITE STATE (CURRENT)

- **Phase 1 complete:** Brand layer locked and pushed to origin/main.
- **Phase 2 palette approved:** Nashville Midnight (2026-04-28). tokens.css updated.
- **Stack target:** Astro + Cloudflare Pages (scaffold pending Phase 2 authorization)
- **Canonical mark:** Vinyl turntable logo (shape retained from Phase 1; recolored to Nashville Midnight)
- **Palette: Nashville Midnight** (derived from listening profile emotional lanes)
  - Neon cream `#E8D5A3` (CTA primary, hero accent)
  - Stage bronze `#B87333` (main accent, logo lines)
  - Steel blue `#3D5A80` (body accent only; not CTAs)
  - Deep indigo `#1B2340` (structural dark, logo fills)
  - Midnight `#1A1A2E` (deep field)
  - Warm gold `#D4B08C` (CTA hover lift)
  - Ink `#0A0A0B` | Paper `#F5F5F7` | Hairline `#FFFFFF` (unchanged)
- **CTA contract:** Solid neon cream on ink (WCAG AAA ~14.1:1). Nashville gradient (cream > bronze > steel > indigo) reserved for one to two hero moments only. Teal CTAs remain forbidden (VALOR brand separation).
- **Logo treatments:** (A) Monochrome bronze for favicons/small; (B) Duotone cream+indigo as primary mark; (C) Nashville gradient for hero moments; (D) Reversed indigo on paper for light contexts.
- **Typography:** Unica One (display), Inter (body). Scale 1.250, base 16px. Tokens in `site/src/styles/tokens.css`.
- **Brand voice guidelines:** v2.0 at `brand-voice-guidelines-v2.md` (voice content unchanged from v1.0; Nashville Midnight visual identity added as §7).
- **Canva brand kit:** `kAHGkHrcJYU` (to be updated with Nashville Midnight palette)
- **Phase 2 open decisions:** (1) Astro public-dir convention for brand files; (2) Tailwind vs vanilla CSS with tokens.css; (3) content approach (reuse `docs/*.md` at build time vs Astro content collections); (4) logo asset regeneration (PNG/SVG in new colorways); (5) favicon regeneration with Nashville Midnight palette

---

## SUNO PRODUCTION ENVIRONMENT

### Account State
- **Handle:** `@marcarmy2003` | https://suno.com/@marcarmy2003
- **Plan:** Premier Annual | 10,000 credits/month | Up to 2,000 songs/month | Model: v5.5
- **Suno Studio:** Enabled | Commercial use rights: Included
- **Profile:** Bio, profile photo, and background image not yet configured
- **My Taste:** Empty (0/2000) — populate to improve AI style suggestions
- **My Styles:** Toggle enabled (no effect until Taste profile has data)
- **Existing playlist:** "Ackypaleto" (placeholder; to be renamed or repurposed)

### Profile Setup (Open Action Items)
- **Display Name:** Pending decision — options: "The Audiopheliac", "Gill Marchetti", "Gill Marchetti | The Audiopheliac"
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
| Merge vinyl wishlist PR to `main` | Pending |
| DHCP reservation for GDMARCHE at 192.168.1.75 | Open |
| Realtek HD Audio driver fix on GDMARCHE (use Dell Service Tag at dell.com/support, not generic Realtek package) | Open |
| WireGuard/Tailscale necessity for VALOR remote NAS access | Unresolved |
| Qfiling recipes for 217A working folder and VALOR repo | Deferred |
| Amazon PA-API access (monitor Associates for qualifying sales) | Monitoring |
| Phase 2 authorization for Astro + Cloudflare Pages scaffold | Pending decis