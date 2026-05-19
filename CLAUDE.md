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
**Companion project:** `The Audiopheliac | Studio Assistant` on claude.ai is available for research, copy iteration, and exploratory prompting while Cowork is processing. It is not part of the production workflow and does not relay, review, or gate any deliverables. Cowork is the primary development surface and executes all work it is capable of directly. Rafa handles only what Cowork cannot reach: Windows-native PowerShell on GDMARCHE, Cockpit/Flask localhost work on GDMARCHE, and Cloudflare deployments.

---

## CANONICAL PRODUCT REFERENCES

**These documents define what The Audiopheliac and the Cockpit ARE. They are required reading at session-init and required citation in any Rafa prompt or task brief that touches product scope. CLAUDE.md describes operations and project hygiene; the documents below describe the product itself. Do not treat the PROJECT FOLDER STRUCTURE section as a specification — it describes the prototype layout, not the canonical design.**

This section is load-bearing. A session that hasn't loaded these docs is a session that will rebuild things on guessed premises. The forensic record for what that failure looks like is the 2026-05-18 HISTORY entry titled "session-level reorientation."

| Document | Path | When to read |
|---|---|---|
| **Cockpit System Design v2026.05** | `docs/Cockpit_System_Design_v2026_05.md` | Always at session-init. Required before any Cockpit feature, UX, or architecture work. Defines the Cockpit as a private web-based control center living at a route on theaudiopheliac.com, unifying music across four zones (Office Studio, Family Room, Lanai, Garage), integrating Hue lighting, exposing an LLM agent over MCP servers, and surfacing listening history. The `console/` Flask app is a prototype of one slice of this; the canonical product is bigger. |
| **Cockpit Architecture Decisions v2026.05** | `docs/Cockpit_Architecture_Decisions_v2026_05.md` | Always at session-init. Required before any deployment, hosting, frontend, or integration decision. Five ADRs covering hosting model (Cloudflare Worker + Durable Object), frontend embedding (Astro Islands inside theaudiopheliac.com), auth (Cloudflare Access), MCP server topology, and state storage. All marked Proposed pending Gill's sign-off. |
| **Brand voice guidelines v3** | `brand-voice-guidelines-v3.md` | Required before any user-facing UI copy, marketing copy, blog post, social content, or visual identity decision. Includes the dual-register voice modes (manifesto + direct), forbidden vocabulary list, and the Full Spectrum palette tie-in. |
| **Listening Profile** | `docs/Audiopheliac_Listening_Profile_v2026_04.md` | Required before any playlist generation, recommendation, or music-curation task. Defines the genre spine (country/country-adjacent, classic rock, hard rock, blues-rock, selective hip-hop, selective pop), sonic priorities (bass-conscious, full low mids, clear lead vocals, muscular drums), and playlist design rules. |
| **Site Architecture** | `docs/Audiopheliac_Site_Architecture.md` | Required before any work on the public-facing site at theaudiopheliac.com. The Cockpit lives at a private route on this site (per System Design §1) so site-level architecture decisions constrain Cockpit-level decisions too. |
| **Audio System Playbook** | `media/audio_system_playbook.md` | Required before any signal-chain, gain-staging, or Office Studio routing decision. Documents the Office chain (GDMARCHE → AIR Hub → MX28 → HS7) which is independent of the Yamaha and easy to mistake for downstream-of-receiver. Some details are version-aged (mentions Scarlett Solo); cross-check against §SIGNAL CHAIN MAP below. |

**Pattern for using this section:** When asked to do feature, UX, or architecture work, first read the relevant doc(s) from the table above, then state back the product framing before proposing anything. Citing the canonical doc by section in proposals is the discipline that catches scope drift before it costs commits.

---

## COWORK OPERATING CONSTRAINTS

- No memory across sessions. All state must be read from this file or from project files on disk.
- No artifacts. All outputs are written to disk.
- No project KB. This CLAUDE.md is the sole persistent instruction source.
- Use absolute or UNC paths for all filesystem references. Never assume mapped drives persist.
- Default script output: `C:\Scripts` unless a project folder already exists.
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

Cowork drafts; Rafa executes anything that touches the running stack on GDMARCHE. The table below is the default routing for ops that come up frequently; treat it as the lane discipline for this project specifically.

| Operation | Lane |
|---|---|
| Edit `console/config.json` (preferred_zones, enabled_sources, net_radio_suggestions, IPs, etc.) | Rafa |
| Cockpit Flask process lifecycle (start, stop, restart) | Rafa |
| Run any of `automation/*.py` (music_indexer, spotify_pull, spotify_local_match, spotify_gap_report) | Rafa |
| Edit `.gitignore`, `automation/`, `console/static/`, `console/templates/`, `console/*.py` | Cowork drafts → Rafa commits / restarts if process is affected |
| Touch `site/` Astro source files | Cowork directly (hot reload picks up changes) |
| Astro `npm install`, `npm run build`, `npm audit`, `wrangler pages deploy` | Rafa |
| Brand voice guidelines, design philosophy, brand docs under `docs/brand/`, mockups under `_dev/01_brand/` | Cowork directly |
| CLAUDE.md surgical edits | Cowork directly |
| Doc updates downstream of an ops change (e.g. signal map after a hardware swap, software profiles after a version bump) | Cowork drafts → Rafa applies in the same prompt that runs the ops change |
| Git stage, commit, push to origin/main | Rafa |
| Slack channel posts + canvas updates at session close | Cowork (Cowork has the Slack MCP) |
| Canva brand kit operations | Cowork (Cowork has the Canva MCP) |
| YXC probes / direct calls to `http://192.168.1.191/YamahaExtendedControl/v1/` | Rafa |
| MusicCast app configuration (Net Radio preset save, source enable/disable, MusicCast Linking) | Gill (iOS app, manual) |

**Lane discipline note:** anything that requires the MusicCast iOS app stays with Gill — it is a walled-garden UI with no API surface. Cowork's job there is to draft the walkthrough; Gill's job is to click through it.

**Default Rafa prompt shape** for Cockpit / Yamaha ops tasks:

1. State the working directory: `C:\Users\gillo\The-Audiopheliac`.
2. State the shell: PowerShell.
3. State the scope in numbered steps with concrete file paths and exact expected JSON edits or commands.
4. Provide an Acceptance block — observable state that proves the task ran.
5. Provide an Out-of-Scope block — what NOT to touch.
6. Close with: post a brief note to Slack channel `#theaudiopheliac` (ID `C0AUH2RLZ41`) and surface tag `Rafa`. Always include the channel ID explicitly — the VAL CLAUDE.md at `C:\Users\gillo\CLAUDE.md` loads in the same session and contains `C0AUU3PLJGP` (#val_dev); without an explicit ID, Rafa may post to the wrong channel.

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
  Creative Studio\        Creative workspace — songs, samples, integrations
    01_Songs\
      Published Masters\  Final WAV archives for published songs
      Discarded Versions\ Retained alternates and unpublished versions
      Family Fun Songs\   Personal/family-use tracks
      Splice Samples\     Splice sample library (relocated from NAS music library)
      User Library\       Ableton User Library component (relocated from NAS music library)
    09_Integrations\
      Suno\
        style_prompts\    Finalized Suno style prompt files per song (see Song Archive Protocol)
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
- **Structure:** Flat (no album subdirectories as of 2026-05-15). All Suno-produced tracks stored directly at `M:\The Audiopheliac\` as MP3s for streaming. WAV masters for published songs are archived at `D:\The Audiopheliac\Creative Studio\01_Songs\Published Masters\`. Alternate and unpublished versions are at `\Discarded Versions\`.

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
  - MinimServer (primary, 2026-05-18) — serving `\\NAS87828E\Music` to R-N800A via UPnP/DLNA. Confirmed working. Promoted back to primary after Roon trial was cancelled.
  - Roon Server — **DEPRECATED 2026-05-18.** Trial cancelled before subscription kicked in; Roon did not meet Audiopheliac's playback purposes. Docker container at `/share/Container/RoonServer/` and the `ghcr.io/roonlabs/roonserver:latest` image may still be on disk pending explicit removal. See HISTORY entry dated 2026-05-18 for the rationale.

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

Note: Samsung UN65U7900F has no optical out. J-Tech JTECH-AE4KA handles eARC audio extraction and feeds the Bose TV 1 input directly. Schiit SYS switches between whole-house audio (1Mii RX) and karaoke (Singing Machine), feeding the Bose AUX input. Bose source selection handles TV vs AUX natively on the unit. The 1Mii wireless route downstream of `Family Room — Yamaha PRE OUT > Rolls MB15b > 1Mii TX` is the active Lanai listening path as of 2026-05-18. The Lanai TV (192.168.1.239) retains Chromecast capability if needed but is not actively routed under the current MinimServer-primary architecture.

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
- **Roon — DEPRECATED 2026-05-18.** Trial cancelled before subscription kicked in; Roon did not meet playback purposes. Server (Docker on NAS), Bridge (Windows service on GDMARCHE), and Remote (desktop app on GDMARCHE) may still be present on disk pending explicit removal. Profile retained as historical archive at `docs/software/Roon.md`. See HISTORY entry dated 2026-05-18 for rationale. **MinimServer is the active library/playback path** (UPnP/DLNA serving `\\NAS87828E\Music` to the R-N800A).
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

console/            **PROTOTYPE** Flask implementation of one slice of the Cockpit.
                    Not the spec. Canonical product design lives in:
                      - docs/Cockpit_System_Design_v2026_05.md
                      - docs/Cockpit_Architecture_Decisions_v2026_05.md
                    Read both before touching scope or architecture here.
                    Currently covers: Spotify Web API + YXC for Yamaha + MinimServer
                    via DLNA, single-zone (Family Room) implicitly. Missing from the
                    canonical Cockpit: Chromecast/Cast (Office Shield, Lanai TV),
                    SoundTouch (Garage Bose), Hue lighting, LLM agent, MCP server
                    registry, listening history, Cloudflare Worker + Astro hosting,
                    private route under theaudiopheliac.com, Cloudflare Access auth,
                    multi-zone grouping via MusicCast distribution. Treat console/
                    as a place to keep the prototype functional while the canonical
                    architecture is built, NOT as the product. Do not add scope to
                    this folder without first checking whether it should be in the
                    canonical implementation instead.
  app.py            Flask routes (Spotify Web API + YXC + DLNA `/api/miniserver/*`)
  yamaha.py         YXC HTTP/JSON client (Yamaha R-N800A)
  spotify.py        Spotify Web API client (spotipy wrapper; server-side OAuth)
  minimserver.py    UPnP/DLNA control-point client (SSDP discovery + ContentDirectory browse/search + AVTransport playback push). Hand-rolled, stdlib + requests, no new deps.
  launch.pyw        Silent launcher (pythonw + Chrome --app); singleton anchor = cockpit_version
  Create-Shortcut.ps1   Desktop shortcut generator
  config.json       yamaha_ip, host, port, enabled_sources, net_radio_suggestions, spotify {client_id, redirect_uri}
  requirements.txt  flask, requests, spotipy
  README.md         Prototype-vs-spec framing + canonical references
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
- `excluded_path_segments: ["_Archive"]` — skips any path containing `_Archive` as a folder segment. Rule is dormant. Retain; revisit after library architecture settles.

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
| Brand rework plan v1 (issue-by-issue format) | `_dev/03_decision-log/brand_rework_plan_v1.md` |
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

**Prompt file:** `D:\The Audiopheliac\Creative Studio\09_Integrations\Suno\style_prompts\[Song-Title].md`
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

## CROSS-PROJECT SCOPE BOUNDARIES

Some platforms span multiple Gill workspaces. The Audiopheliac workspace is not the only Claude-managed environment that touches the NAS, the LAN, or the audio chain — the Lab workspace handles infrastructure, server administration, and platform health for the same hardware. To prevent duplicate work and conflicting recommendations, scope splits are codified here. When a task crosses a boundary, hand off explicitly rather than reaching across.

### Plex Media Server

Per the Lab workspace CLAUDE.md §1, the split between Lab and Audiopheliac is:

**Lab scope (handle Plex infrastructure work in the Lab workspace):**
- Plex Media Server qpkg health on the NAS (start/stop, version, claim status, transcoder enable)
- Networking: LAN reachability, port 32400, removing stale router port-forward expectations, decisions about whether to re-enable any external access through Tailscale only
- Storage: library paths on the NAS (likely under `5277_Marc/Multimedia`), watched folders, library scan intervals, file permissions on the share, scan failures
- Container or qpkg conflicts (Plex Media Server, Multimedia Console, QuMagie, QuMagie AI Core, Video Station, Music Station, Cayin Media Viewer, CAYIN MediaSign Player, MinimServer, and QNAP DLNA Media Server all live on the same NAS and step on each other's indexing if not coordinated)
- Plex client apps on GDMARCHE, phones, tablets
- Plex Pass account, sign-in, server-claim status
- Transcoder settings (the NAS now has 64 GB so RAM-cache transcoding is finally viable; this is a real win waiting to be claimed)

**Audiopheliac scope (handle the audio-side decisions in this workspace):**
- Audio quality, lossless integrity, bit-perfect playback chains
- DLNA push from Plex (or any other UPnP server) into the Yamaha R-N800A receiver
- MinimServer audiophile renderer config (already integrated via `console/minimserver.py`)
- Music library curation, tagging standards, metadata for the music collection specifically, brand-voice for playlists and album art
- Signal-chain decisions (Plex audio out → which interface → which speaker chain — Yamaha vs Office direct, etc.)
- Anything that touches the M-Audio AIR Hub, Ableton Live, the vinyl-rip pipeline, or the Yamaha as the AVR

**Hand-off pattern:** start in the Lab for any infrastructure question (qpkg, network, storage paths, library scanning, client apps, transcoder). Hand off to the Audiopheliac workspace the moment the question becomes "but does it sound right" or "how should the music be organized" or "which DAC does this hit." When in doubt, ask Gill — do not assume the boundary.

**Known scanner-conflict failure mode (Lab-side, documented here for cross-reference):** multiple media apps competing on the same NAS is the single most common cause of Plex feeling unreliable. Symptoms include device-side inconsistency (clients see whichever app's metadata reached the database last) and stale indexing. The Lab workspace owns the consolidation work (the six-phase reset Gill scoped). When the Lab phase work is done and Plex is healthy, any *audio routing* questions about Plex output land back in the Audiopheliac workspace.

### Future cross-project surfaces

Other surfaces likely to need a boundary line (capture here when they come up):
- YouTube integration (Cockpit feature vs Lab/platform admin)
- Roon footprint removal (NAS-side / GDMARCHE-side Roon cleanup is Lab; Cockpit-side Roon integration cleanup is Audiopheliac — already complete)
- Any cross-workspace MCP server (the Cockpit System Design references an MCP server registry; some servers may be Lab-administered)

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
| Music library reorganized (flat structure, WAVs to D:\Creative Studio\01_Songs\, MP3s in M:\) — re-run music_indexer.py from GDMARCHE to rebuild index | Pending |
| Roon Server: trial activated, Docker deploy on QNAP complete, library scanned (13,450 tracks), two zones live | Complete (then deprecated 2026-05-18 — trial cancelled) |
| Roon subscription decision (auto-renews 2026-05-25 at $149.88/yr unless cancelled) | Complete — trial cancelled before subscription |
| Roon: schedule weekly DB backup to `/RoonBackups` once trial decision is made | Closed — Roon out (2026-05-18) |
| Roon footprint removal: stop Docker container at `/share/Container/RoonServer/`, remove `ghcr.io/roonlabs/roonserver:latest` image, uninstall Roon Bridge service from GDMARCHE, uninstall Roon Remote desktop app from GDMARCHE, clear `roon_token.json` cache | Open (Rafa lane) |
| Cockpit Roon-integration removal: drop `console/roon.py`, remove Roon endpoints from `console/app.py`, remove Roon UI elements from `console/static/app.js` + `console/templates/index.html` + `console/static/style.css`, remove `roon_host` / `preferred_zones` from `console/config.json`, drop `roonapi` from `console/requirements.txt`, revalidate Flask app boots cleanly | Complete (Phase A, 2026-05-18) |
| Cockpit launcher singleton anchor fix: launch.pyw `is_existing_cockpit` was checking for `preferred_zones` in /api/config (broken since v0.9 dropped that field; SO_REUSEADDR masked the bind collision so every shortcut click silently spawned a second Flask). Replaced anchor with `cockpit_version` exposed by /api/config | Complete (Phase A, 2026-05-18) |
| Phase E (direct DLNA MinimServer integration): SSDP discovery, ContentDirectory:Browse + Search, AVTransport playback push to Yamaha, `/api/miniserver/*` Flask surface, frontend wiring for MinimServer tab. Verified end-to-end (Rafa Prompt 3, 2026-05-18): 520 albums / 6719 items / 148 playlists indexed; Oasis "Hello" played through Yamaha from MinimServer. | Complete (Phase E, 2026-05-18) |
| Phase C re-probe (vTuner navigation depth) — needed for Phase G decision. First probe ran in network standby; vTuner directory empty. Re-probe with receiver powered on is drafted as Rafa Prompt 4. | Open (gated on Rafa Prompt 4 run) |
| Phase D + F (source-aware UX redesign + per-session queue + Cockpit-owned M3U playlist creation): hide Yamaha controls when Spotify is active, source-switch loading state, status-pill semantics, unified search across sources, queue management, M3U playlist write to NAS. Big frontend pass scoped after Phase E foundation verified. | Open (next major work block) |
| Audiopheliac Cockpit v0.2 (console/) — YXC + Roon integrated, library + zones + transport functional | Complete (then Roon integration deprecated 2026-05-18; YXC + library tabs against MinimServer remain) |
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
- Copy-paste-ready commands with environment (PowerShell, Ableton menu path, hardware UI), working directory, and privilege level specified.
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
- **Flag software-profile updates proactively.** When working in or with any software application related to The Audiopheliac (Spotify, Ableton Live, Audacity, Suno, MinimServer, MusicCast Controller, Discogs CLI, NirSoft SoundVolumeView, M-Audio AIR Hub Control Panel, vendor utilities, etc.), or when changing the configuration of an existing application, Cowork must flag Gill that the corresponding profile at `docs/software/<Package>.md` should be updated. If no profile exists for the package yet, flag that one should be created from `docs/software/_TEMPLATE.md`. This applies to: setting changes, version upgrades, account or credential changes, signal-chain or pipeline integration changes, new automation that depends on the package, and any troubleshooting outcome worth durable capture. The flag is mandatory; Gill decides whether to act on it during the current session or queue it.
- **Do not collapse Audiopheliac scope to solo/hobby framing.** The Audiopheliac is a lifestyle brand build with monetization paths active or in flight (see IDENTITY AND ROLE). When planning operations, governance, or architecture, reflect the full scope: content production, AI integrations, affiliate revenue, music releases, possible storefront, possible sponsorships. The hardware and signal chain are credibility foundation, not the project boundary.
- **Scope contract — required on every Rafa prompt and every non-trivial Cowork task brief.** The first line of any prompt or brief that touches product scope must cite the canonical doc and section the work is scoped against. Example: "Scope: docs/Cockpit_System_Design_v2026_05.md §4a (zone routing). This work fits inside that section's data flow." If no canonical-doc citation is possible because the work doesn't fit any documented section, that itself is the signal to stop and ask whether the work is in scope at all. PROJECT FOLDER STRUCTURE descriptions are NOT specs; do not cite them as scope authority.
- **Ambient assumption check before architectural or UX decisions.** Before drafting a design change, state the premises back explicitly. "I'm assuming X about the product, Y about the user, Z about the implementation." If those premises haven't been verified against the canonical references, do that first. The failure mode this catches: building successively correct fixes against a wrong mental model. See the 2026-05-18 HISTORY entry "session-level reorientation" for what skipping this looks like.
- **`console/` is a prototype, not the product.** Never treat its current shape as the specification for further work. When asked to add scope to `console/`, ask first whether the scope belongs in the canonical Cloudflare Worker + Astro architecture instead. Patching the prototype while the canonical implementation is unbuilt is debt against the eventual real thing; do it only when the prototype-patching is consciously chosen and named as such.

---

## DATA SOURCE PRIORITY

1. This CLAUDE.md and project files on disk at `C:\Users\gillo\The-Audiopheliac\`
2. GitHub raw content (`https://raw.githubusercontent.com/MarcArmy2003/The-Audiopheliac/main/...`)
3. Slack canvas (Session Development Log: https://veterananalyticsllc.slack.com/docs/T0AS3KMJ82X/F0AU7FEMA7M)
4. Web search for firmware notes, changelogs, driver downloads (prefer manufacturer sources: focusrite.com, ableton.com, yamaha.com, qnap.com, help.suno.com)

---

## CROSS-SURFACE ARCHITECTURE

**Lane discipline: Cowork executes directly; Rafa for localhost/deploy only. No relay through Chat.**

Cowork does the work. Rafa is invoked only when the task requires Windows-native PowerShell on GDMARCHE, Cockpit/Flask localhost work on GDMARCHE, or Cloudflare deployments. If a larger task bundles Rafa-dependent steps with Cowork-capable steps, Rafa may handle the full series to avoid context-switching overhead. Studio Assistant (Chat) is not in the workflow chain.

| Surface | Persona/Tool | Role |
|---|---|---|
| Cowork | Audiopheliac (this CLAUDE.md governs behavior) | Primary development surface. File ops, docs, Python automation, git staging and commit, session state, Slack channel + canvas management, MCP operations (Slack, GitHub, Ableton Knowledge). Delegates to Rafa only for localhost, PowerShell, or deploy. |
| CLI | **Rafa** | Windows-native PowerShell execution on GDMARCHE, Cockpit/Flask localhost work on GDMARCHE, Cloudflare Pages deployments. Reports back to Cowork. Does not independently scope work. |
| Chat | **Studio Assistant** (claude.ai project) | Optional sidebar. Research, copy iteration, exploratory prompts. **Not a workflow participant.** Does not relay work to Cowork or Rafa, does not review or gate deliverables. Gill uses it when convenient, not as a handoff point. |

**Anti-pattern (do not repeat):** Relaying decisions, action items, or state through Chat to Cowork or vice versa. If information originates in a Chat session, Gill pastes it into the Cowork conversation directly. No "phone tag" between surfaces.

---

## SESSION-INIT PROTOCOL

**Trigger:** Gill types `audio:open` (or just `open`). See SESSION TRIGGER WORDS.
**Required at start of every session. Execute before any other action.**

1. Read this CLAUDE.md (sole persistent instruction source per COWORK OPERATING CONSTRAINTS)
2. **Read the CANONICAL PRODUCT REFERENCES.** Specifically: `docs/Cockpit_System_Design_v2026_05.md` and `docs/Cockpit_Architecture_Decisions_v2026_05.md` are required reading on every session, not just when Cockpit work is on the table. They define what the product IS. The other entries in the §CANONICAL PRODUCT REFERENCES table are read as scoped to the task (brand voice for any UI/copy work, listening profile for any music-curation work, etc.). A session that skips this step will rebuild on guessed premises — see the 2026-05-18 HISTORY entry "session-level reorientation" for the forensic record of what that looks like.
3. Read Slack channel #theaudiopheliac (channel ID `C0AUH2RLZ41`): most recent messages for last action, blockers, in-flight work. The Session Development Log canvas (F0AU7FEMA7M) may also be consulted as legacy reference; daily_log.md is primary for prior session detail.
4. Read `docs/daily_log.md` last entries for the durable archive view of recent sessions (per the hybrid logging charter, this is the archive of record)
5. Read on-disk state files relevant to active work (e.g., `data/library_index/library_index.json`, `data/manifests/spotify_local_matches.json`, `Suno/suno_my_taste_draft.md`) as scoped by the task
6. Output status block (see format below) — the `Product framing` line is a forced restatement of what The Audiopheliac is, what the Cockpit is, what's prototype vs canonical, and where the implementation gap sits today. If you cannot write that line from the canonical references you just read, you didn't read them well enough; go back to step 2 before proceeding.
7. Proceed with session work

**Status block format:**
```
AUDIOPHELIAC SESSION-INIT, [YYYY-MM-DD]
Product framing: The Audiopheliac is [one-sentence brand summary]. The Cockpit is [one-sentence purpose per System Design §1]. Current implementation: [console/ Flask prototype vs canonical Cloudflare Worker + Astro + MCP-registry architecture — where the gap is today].
Last action: [one-line from #theaudiopheliac or daily_log.md, or "first session of day"]
Active: [top in-flight item or "none"]
Blockers: [list or "none"]
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

**Logs and durable archive:** Not updated mid-session. The `docs/daily_log.md` append and the session-close Slack post happen at SESSION-CLOSE only.

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

**Step 3, Dual-Write Close Record (charter 2026-05-18):**

Per the #theaudiopheliac channel charter (hybrid logging architecture, Option C), every session-close writes BOTH a Slack close summary AND a durable archive entry. Neither alone is sufficient.

- *3a, Slack channel post (live signal):* Post a session close summary to channel #theaudiopheliac (channel ID `C0AUH2RLZ41`) as a channel message. Include: session date, work done, commits, decisions, corrections, next actions. Always include the channel ID explicitly when delegating to Rafa; the VAL CLAUDE.md loads in the same session and contains `C0AUU3PLJGP` (#val_dev). Without an explicit ID, the wrong channel gets the post.
- *3b, daily_log.md append (durable archive of record):* Append a timestamped entry to the Audiopheliac-only daily log at `C:\Users\gillo\The-Audiopheliac\docs\daily_log.md` (repo-relative: `docs/daily_log.md`). This file is dedicated to The Audiopheliac. It is NOT shared with `valor-core/docs/daily_log.md` (VAL), nor with any VeteranIntel.org daily log. Each product maintains its own log; do not write Audiopheliac entries into a VAL or VI log under any circumstance, and do not pull VAL or VI entries into this one. **Append-only. Never overwrite. Never merge with prior entries.** Format mirrors valor-core: a section header (`## Session [N] — [YYYY-MM-DD]`) followed by bullets covering work done, commits (with short SHAs), decisions, corrections, next actions. This file is grep-able, git-versioned, and audit-ready. It is the archive of record, not the Slack channel.
- *3c, Pre-close verification (dual-write contract enforcement):* Before reporting session complete, verify both writes landed. For daily_log.md: line-count diff before/after the append (`wc -l docs/daily_log.md` or equivalent) — confirm the line count grew by the expected amount. Slack alone has historically silently absorbed the close signal while the GitHub append dropped out; the verification step exists specifically to catch that failure mode.
- *3d, Session Development Log canvas (legacy):* The canvas at `F0AU7FEMA7M` ("The Audiopheliac - Session Development Log") is the legacy session log under the pre-charter architecture. Under the new contract, daily_log.md is primary. The canvas may continue to receive entries for continuity if Gill chooses, but it is no longer load-bearing. Flag for explicit retirement decision once the daily_log pattern is established.
- *3e, Scope lock:* Do not cross-write Audiopheliac session content into `#val_dev`, `#veteranintel-handoffs`, or any other VeteranAnalytics / VeteranIntel channel. Do not cross-write into valor-core's `daily_log.md` or any other product's daily_log. Per the channel charter, products stay separate. If a session legitimately touched multiple products, split the close summary by product and write each to its own surface.

**Step 4, Report to Gill:** Confirm all steps complete, including the line-count verification on `docs/daily_log.md` (Step 3c). List anything that failed and why.

---

## SESSION TRIGGER WORDS

Universal trigger words to standardize SESSION-INIT, MID-SESSION SYNC, and SESSION-CLOSE across production surfaces (Cowork / Rafa). Honored by every surface that runs against this CLAUDE.md. Studio Assistant may honor triggers if Gill uses it, but it is not a production surface.

| Trigger | Surfaces | Maps to | Action |
|---|---|---|---|
| `audio:open` (or `open`) | Cowork, Rafa | SESSION-INIT PROTOCOL | Read CLAUDE.md + Slack #theaudiopheliac + `docs/daily_log.md` + on-disk state; output status block; ready to work |
| `audio:sync` (or `sync`) | Cowork, Rafa | MID-SESSION SYNC PROTOCOL | Post mid-session status to `#theaudiopheliac`; refresh any in-flight on-disk state |
| `audio:close` (or `close`) | Cowork + Rafa (Cowork orchestrates) | SESSION-CLOSE PROTOCOL | Update docs; commit; dual-write close record (Slack #theaudiopheliac + `docs/daily_log.md` append, line-count verified); report |

**Recognition rules:**

- Match is case-insensitive. `AUDIO:OPEN`, `audio:Open`, `open session`, and `Open` all trigger. Phrase tolerance > exactness.
- The un-prefixed forms (`open` / `sync` / `close`) only fire inside this Audiopheliac workspace. Outside, use the project-prefixed form (e.g., `vi:open` for VeteranIntel, `val:open` for VeteranAnalytics).
- All surfaces stop whatever they are doing and run the named protocol when one of these triggers appears in a user message. No "let me finish this first."

**Cross-project consistency:** Same trigger pattern (`<project>:open`, `:sync`, `:close`) is being adopted across all Veteran Analytics LLC project folders and Gill's personal projects. The prefix changes per project, `audio:` for The Audiopheliac, `vi:` for VeteranIntel, `val:` for VeteranAnalytics, etc., but the protocol shape is identical in form.

**Why these exist:** Eliminates ambiguity at session boundaries. One word triggers the full alignment ritual.

**Optional adjuncts (not required, not substitutes):**

- `/productivity:start` and `/productivity:update` are productivity-system slash commands and do NOT replace `audio:open`.
- Mode triggers `/woodshed`, `/produce`, `/studio` (see MODE CONTRACTS) are independent of session triggers and may be used inline during a session.
- General-purpose plugin slash commands (e.g., `/diagnose-why-work-stopped`) may be invoked inline as needed.

---

## PAPERCLIP SURFACE — DEPRECATED 2026-05-18

Paperclip was deprecated and fully removed from active Audiopheliac workflow on 2026-05-18. The Audiopheliac runs on Cowork + Rafa only. The dual-write close record (Slack `#theaudiopheliac` for live signal + `docs/daily_log.md` for durable archive) is the operating contract; see SESSION-CLOSE PROTOCOL.

**State of the retired paperclip footprint:**

- The Audiopheliac paperclip company (id `821ef660-0041-4ef6-a911-adb1ba038e15`, prefix `THE`, created 2026-05-06) is retired. THE-1 (baseline, closed 2026-05-08) was the only ticket that ever existed under the prefix. No active issues to migrate.
- The local paperclip installation at `C:\Users\gillo\paperclip\` remains on disk but is not part of any session protocol. No `pnpm dev`, no heartbeat, no inbox reads, no ticket writes.
- The legacy reference doc at `docs/Audiopheliac_Paperclip_Reference.md` is retained as platform-mechanics archive only. It is NOT a guide to current Audiopheliac workflow.
- Paperclip slash commands (`/paperclip`, `/paperclip-converting-plans-to-tasks`, `/paperclip-create-agent`, `/paperclip-create-plugin`, `/paperclip-dev`) may still be loaded in Rafa's runtime via Claude Desktop config but are not invoked by any Audiopheliac session protocol.

**Approval-gate replacement for destructive operations:**

The first-90-days approval-gate language is retired with paperclip, but the underlying caution is not. Destructive operations still require explicit Gill confirmation in-session before Rafa proceeds. Specifically: NAS file deletions of more than 10 files or any folder, git history rewrites / force-pushes to `main`, Cloudflare Pages production deploys, Spotify/Discogs/Suno token rotation, firmware flashes marked [MODERATE] or [HIGH], DAW project file overwrites, and any new cost-bearing automation. Gill confirms verbally in chat; Cowork does not infer consent.

See HISTORY entry dated 2026-05-18 for the full deprecation rationale.

---

## HISTORY

**2026-05-18 (session-level reorientation: structural fixes after a session that built on the wrong product frame):** Gill called a hard stop on Cockpit dev after a long session in which I shipped three commits (`4ae6e7d`, `4d9ba2e`, `12d55bb`) and drafted further changes against a guessed product model — "the Cockpit is a Spotify+Yamaha+MinimServer remote, the Yamaha is the canonical destination." The canonical product, documented at `docs/Cockpit_System_Design_v2026_05.md`, is much larger: a private web-based control center at a route on theaudiopheliac.com, four zones (Office Studio / Family Room / Lanai / Garage), per-zone playback protocols (YXC + Cast + SoundTouch + UPnP), MusicCast multi-zone grouping, Hue lighting with album-art-driven theming, an LLM agent over an MCP server registry, listening history viz, and action targets (send-to-Ableton, fire Live scene, trigger Hue scene). The companion ADR doc at `docs/Cockpit_Architecture_Decisions_v2026_05.md` codifies the architecture: Cloudflare Worker + Durable Object backend, Astro frontend embedded in theaudiopheliac.com, Cloudflare Access auth, MCP servers on LAN via Cloudflare Tunnel. Neither doc was opened during the session. The forensic root cause: I treated the CLAUDE.md PROJECT FOLDER STRUCTURE entry for `console/` ("Audiopheliac Cockpit v0.9.x — Spotify + YXC + MinimServer-via-DLNA local control panel") as the spec, when it was just describing one prototype implementation. Every subsequent fix anchored to that wrong frame. UX problems Gill raised got patched at the surface (MUTE tile overflow, Spotify Devices ambiguity, Yamaha source row filtering, atomic Library-tab dispatch) inside the wrong model. The "Yamaha is the canonical destination" assumption cascaded — Office listening was systematically routed wrong, source switching looked broken because the destination model itself was wrong, and I built up to proposing more code (Office MinimServer renderer options A/B/C) on premises I should have verified by reading the spec on turn one. Structural fixes landed in this commit pass to prevent recurrence: (1) new top-level §CANONICAL PRODUCT REFERENCES section near the top of CLAUDE.md naming the System Design, ADR, brand voice, listening profile, site architecture, and audio system playbook as required reading with summaries and when-to-read guidance; (2) §SESSION-INIT PROTOCOL updated to require reading the System Design + ADR docs every session (not just when Cockpit work is on the table) and to require a "Product framing" line in the status block that restates what the product is, what's prototype vs canonical, and where the implementation gap sits; (3) PROJECT FOLDER STRUCTURE entry for `console/` rewritten to explicitly mark it as a prototype, list what's missing from the canonical Cockpit, and direct any scope work to ask first whether the right home is the canonical Cloudflare Worker + Astro implementation; (4) three new §BEHAVIORAL RULES — a Scope-contract rule requiring every Rafa prompt and non-trivial Cowork task brief to cite the canonical doc + section the work is scoped against, an Ambient assumption check rule requiring premise statements before architectural or UX decisions, and an explicit "console/ is a prototype, not the product" rule; (5) new §CROSS-PROJECT SCOPE BOUNDARIES section with the Lab/Audiopheliac split for Plex per Gill's Lab CLAUDE.md §1 (Lab handles Plex qpkg health + networking + storage + container conflicts + clients + Plex Pass + transcoder; Audiopheliac handles audio quality + DLNA into Yamaha + MinimServer + music library curation + signal-chain decisions + Scarlett/Ableton/vinyl-rip/AVR), with hand-off pattern documented; (6) `console/README.md` rewritten to lead with the prototype framing, list canonical references, enumerate what's missing from the canonical Cockpit, and codify the discipline for working in the folder; (7) `console/app.py` module docstring updated to name the prototype status and point at the canonical docs; (8) two new auto-memory entries — `project_cockpit_scope.md` (the four-zone framing + canonical-doc pointers) and `feedback_canonical_doc_first_for_cockpit.md` (the verification-first discipline applied to Cockpit work specifically). No code commits in this pass — the entire delivery is project-hygiene documentation. Gill explicitly stopped dev to reorient. Next session starts fresh against the canonical references.

**2026-05-18 (Phase E ship: direct DLNA MinimServer integration in the Cockpit):** Direct UPnP/DLNA control-point integration shipped in `console/`, replacing the previously broken YXC-proxy stubs in the frontend (which were calling `/api/miniserver/*` routes that didn't exist). New hand-rolled module `console/minimserver.py` (~500 lines, stdlib + requests, no new dependencies): SSDP M-SEARCH multicast discovery of MediaServer + MediaRenderer, device description XML parsing, SOAP envelope construction for ContentDirectory:Browse + :Search, AVTransport:SetAVTransportURI + Play handoff, DIDL-Lite XML parsing. New routes in `console/app.py`: `/api/miniserver/{discover,status,browse,search,search-capabilities,play,stop,pause}` with CSRF + Host allowlist preserved. Frontend in `console/static/app.js`: `checkMinimServer` updated to new status shape, `browseMinimServer` rewritten for DLNA item shapes with breadcrumb navigation, new `searchMinimServer`, `doSearch` dispatches by `_activeLibSource`. Rafa Prompt 3 verified end-to-end (2026-05-18): SSDP discovery returns state="ready" with both MinimServer and Yamaha; Browse root returns the real MinimServer tree (520 albums, 6719 items, 148 playlists, plus Artist/Genre/Date/Composer indexes — not the QNAP generic Music/Videos/Photos); search returns coherent results; play handoff loaded Oasis "Hello" from MinimServer and played it through the Yamaha (woke the receiver from standby on the SetAVTransportURI+Play call); stop works. Four defects caught by Rafa during verification: (1) duplicate route block in `app.py` from a stale legacy MinimServer-via-YXC-proxy paradigm that collided with the new endpoint name — Rafa removed the legacy block; (2) `status_snapshot()` was last-wins on SSDP order, displaying Bose Lifestyle as the renderer when Yamaha was the actual play target — Cowork fixed to use `media_server()` and `media_renderer(friendly_name_hint="Yamaha")`; (3) `media_server()` returned the first MediaServer in SSDP order which was the QNAP generic DLNA server, defeating the whole integration — Rafa fixed to prefer MinimServer by manufacturer/model/friendly-name substring; (4) double-unescape silently zeroed pages when titles contained legitimate `&amp;` (e.g. Crosby, Stills, Nash & Young) — Rafa fixed by parsing result_xml directly without the extra `html.unescape()`, plus added per-element try/except in `_parse_didl_lite` so one malformed item can't discard a whole page. One functional limitation fixed by Cowork in the same pass: search was title-only (`dc:title contains "X"`), so artist-name queries returned 0 results even when the artist was in the library; rewrote `_build_search_criteria` to compound across `dc:title`, `upnp:artist`, `upnp:album`, `dc:creator` for `kind=all` and `kind=track`. Phase D + F (source-aware UX redesign and per-session queue management) is the next major work block; the DLNA foundation is now verified ready to support it.

**2026-05-18 (Roon trial cancelled; Roon officially out; MinimServer back as primary):** Gill cancelled the Roon trial before the auto-renew subscription ($149.88/yr) kicked in. Roon did not meet The Audiopheliac's playback purposes — the value proposition did not justify the recurring cost. Roon is officially out of the active stack. Cleanup pass through CLAUDE.md updated: HARDWARE NAS media-servers list (MinimServer promoted back to primary with the 2026-05-18 date stamp; Roon Server entry replaced with a DEPRECATED notice naming the trial-cancellation rationale and flagging the Docker container at `/share/Container/RoonServer/` + the `ghcr.io/roonlabs/roonserver:latest` image as on-disk pending explicit removal); SIGNAL CHAIN MAP Lanai block (removed the "Roon Lanai - TV Chromecast (192.168.1.239)" primary path; restored the 1Mii RX > Schiit SYS > Bose AUX route as the active Lanai listening path downstream of `Family Room — Yamaha PRE OUT > Rolls MB15b > 1Mii TX`; Lanai TV Chromecast retained as capability-not-actively-routed); SIGNAL CHAIN MAP Master Bedroom block (removed entirely — the room is no longer an actively-addressable zone under MinimServer-primary; TV at 192.168.1.154 retains Chromecast / AirPlay 2 capability if a future re-routing is wanted); SOFTWARE AND DAW ENVIRONMENT (Roon bullet replaced with a DEPRECATED notice that points back to HISTORY and confirms MinimServer is the active library/playback path); PROJECT FOLDER STRUCTURE `console/` block (annotated to mark Roon integration as "pending removal"); BEHAVIORAL RULES software-profile-update list (dropped Roon from the in-scope-package enumeration); RAFA operational routing table (dropped the "Restart Roon Server container on QNAP" row, dropped the "Roon UI configuration" row, updated the doc-update-downstream example from "Roon rename" to "hardware swap", removed the "Roon Remote app" reference from the lane-discipline note, and changed the Default Rafa prompt-shape header from "Cockpit / Roon / Yamaha" to "Cockpit / Yamaha"); OPEN ACTION ITEMS table (closed the Roon subscription decision, closed the Roon DB backup item, marked the Roon-Server-trial item complete-then-deprecated, opened a new Roon footprint removal item flagged Rafa-lane covering the Docker container stop + image removal + Bridge uninstall + Remote uninstall + `roon_token.json` cache clear, and opened a separate Cockpit Roon-integration removal item flagged Rafa-lane covering `console/roon.py` deletion, Roon endpoint removal from `console/app.py`, Roon UI removal from `console/static/app.js` + `console/templates/index.html` + `console/static/style.css`, removal of `roon_host` / `preferred_zones` from `console/config.json`, and `roonapi` removal from `console/requirements.txt` with a clean Flask boot revalidation). The `docs/software/Roon.md` profile got a top-of-file DEPRECATED banner and the Status line was updated; the profile body is retained as historical archive. The Roon HISTORY entries from 2026-05-11 (Roon pivot + Cockpit v0.2), 2026-05-12 (zone lock + preferred_zones), and 2026-05-13 (Cockpit audio fix — ghost zone rebind) remain unchanged as historical record. Active library/playback substrate going forward: MinimServer serving `\\NAS87828E\Music` to the R-N800A via UPnP/DLNA, with Yamaha YXC controls intact and the Cockpit (post-cleanup) running on YXC + MinimServer browse only.

**2026-05-18 (paperclip deprecated and removed from active workflow):** Paperclip is fully out of The Audiopheliac's workflow. Cleanup pass through CLAUDE.md stripped paperclip from: IDENTITY AND ROLE companion-project description (Rafa's reach no longer references paperclip API), RAFA operational routing table (dropped the "Lane once Operator agent exists" column entirely; removed the dedicated paperclip-ticket row; collapsed conditional language in Roon/Astro/Cockpit rows), the Default Rafa prompt-shape closing paragraph about Operator filing issues, the BEHAVIORAL RULES scope-lock language (replaced "operations, governance, architecture, or paperclip use" with "operations, governance, or architecture"), CROSS-SURFACE ARCHITECTURE (Paperclip row removed from surface table; lane-discipline header simplified to "Cowork executes; Rafa for localhost/deploy"; Rafa's role rewritten to PowerShell on GDMARCHE + Cockpit/Flask localhost + Cloudflare deploys), SESSION-INIT PROTOCOL (former Step 4 paperclip-inbox-via-Rafa read removed; status block "Paperclip:" line dropped; daily_log.md read added as Step 3 per the hybrid logging charter), MID-SESSION SYNC PROTOCOL (replaced "paperclip ticket transitions" with "docs/daily_log.md append"), SESSION-CLOSE PROTOCOL (former Step 4 paperclip-update-via-Rafa block removed in full; Report promoted to Step 4), SESSION TRIGGER WORDS (Paperclip-agents surface removed from table and recognition rules; "Paperclip slash commands available locally" adjunct removed), and the entire PAPERCLIP SURFACE section (replaced with a deprecation notice that names the retired footprint). The Audiopheliac paperclip company (id `821ef660-0041-4ef6-a911-adb1ba038e15`, prefix `THE`, created 2026-05-06) is retired; THE-1 baseline was closed 2026-05-08 and is the only ticket that ever existed under the prefix, so no open issues to migrate. The local paperclip installation at `C:\Users\gillo\paperclip\` and the reference doc at `docs/Audiopheliac_Paperclip_Reference.md` remain on disk as historical artifacts only; neither is load-bearing for current workflow. Auto-memory entries for paperclip lane discipline and paperclip local dev are removed in the same pass. Active workflow going forward: Cowork + Rafa only, with the dual-write close record (Slack `#theaudiopheliac` live signal + `docs/daily_log.md` durable archive, line-count verified) as the operating contract per the 2026-05-18 channel charter.

**2026-05-13 (Cockpit audio fix — ghost zone rebind, AIR Hub confirmed live):** Diagnosed and resolved the root cause of silent playback from the Cockpit's "Studio · AIR HUB" zone. Root cause: the zone was bound to the Focusrite Scarlett Solo output descriptor at creation time; when Scarlett failed 2026-05-11 and the M-Audio AIR Hub replaced it, Bridge re-enumerated a new output entity with a different ID. The saved zone accepted transport commands (returned `{"ok": true}`) but could not move audio — seek_position never advanced. Identified the ghost zone (zone_id `160141bdcc8e52a9362cc2201451d2ff5ef1`, outputs pointing to dead Scarlett) and the real AIR Hub output (zone_id `1601719ffefb1f01317269556ac2fcb99790`, outputs: [] — not yet enabled). Fix executed in Roon Settings > Audio: ghost zone disabled/deleted; real AIR Hub output enabled; Device Setup confirmed (Unidentified device / M-Audio AIR HUB ASIO, No MQA, Fixed volume, 0ms resync). AIR Hub zone confirmed connected in Roon. Additional fixes committed this session: (1) `console/roon.py` APPINFO `website` field changed from `"https://theaudiopheliac.com"` to `"http://127.0.0.1:5000"` (was causing Roon to show broken extension link). (2) `console/launch.pyw` Bridge pre-start candidate list corrected — was searching for `Bridge.exe` at wrong paths; GDMARCHE uses `RoonBridge.exe` at `%LOCALAPPDATA%\RoonBridge\Application\RoonBridge.exe`. (3) CLAUDE.md HARDWARE / SOFTWARE sections updated with confirmed Bridge binary paths: supervisor `C:\Users\gillo\AppData\Local\RoonBridge\Application\RoonBridge.exe`, audio daemon `C:\Users\gillo\AppData\Local\RoonBridge\Application\RAATServer.exe`, Remote app `C:\Users\gillo\AppData\Local\Roon\Application\Roon.exe`. Pending from this session: zone rename to "Studio · AIR HUB" (Roon UI, Gill), Roon Bridge update 2.60 → 2.66 (installer `RoonBridgeInstaller64.exe` downloaded, not yet run), git commit for roon.py + launch.pyw + CLAUDE.md changes (Rafa), Focusrite software uninstall (deferred until Cockpit audio verified).

**2026-05-13 (Cockpit v0.7 final ship + two functional bug fixes, bb2df9b):** Completed the v0.7 rebuild that was parked at session close the same day. Built new `console/static/style.css` (Full Spectrum, two-column grid layout, per-zone volume sliders, library tabs, queue card, topbar clock pill), new `console/static/app.js` (1,677 lines — clock, per-zone volume, Roon/Spotify library tabs with search, Up Next queue, transport shuffle/repeat toggles, full CSRF wiring), new `console/templates/index.html` (matching v0.7 mockup structure: Now Playing hero, Roon Zones card, Yamaha card with Power/Mute/Source/Master/Net Radio, Library card with tabs, Up Next queue, topbar canonical mark + Cockpit sub-label, v0.7 footer). Added `/api/roon/zone-volume` (POST) and `/api/roon/queue` (GET) to `app.py`; `set_zone_volume()` and `zone_queue()` to `roon.py`. Fixed two functional bugs in this commit: (1) CSS class mismatch — `renderInputList()` used `input-btn` but style defines `.source-btn`; active source never got Sunlamp Yellow highlight. (2) Silent Yamaha control failures — `wireMasterVolume()` and `wireReceiver()` had no error handling; added `flashToast()` on non-ok API responses for volume up/down, mute toggle, power toggle. Net Radio suggest list and `config.json` stations already complete (8 stations across country roots, classic rock, alt, blues). Committed as `bb2df9b` to origin/main.

**2026-05-13 (Cockpit clear-auth endpoint + Reconnect UI, fed615f):** Follow-on to bb2df9b. Fixed two additional field-test failures: (3) Roon stale token — `roon_token.json` from the prior QPKG Roon install causes the roonapi client to stay in `discovering`/`error` indefinitely; added `POST /api/roon/clear-auth` endpoint (deletes token file, creates fresh `RoonClient`, calls `start()`). (4) Added "Reconnect" + "Clear auth & reconnect" button row in the zones card for all non-connected Roon states (`discovering`, `waiting_for_auth`, `error`, `disconnected`), not just zero-zones. Toast wiring on buttons uses try/catch/finally to guarantee re-enable on failure; debounced refresh timeouts. Committed as `fed615f` to origin/main.

**2026-05-13 (Cockpit v0.6 polish, Codex audit, packaged-app launcher, v0.7 redesign parked):** Session covered v0.6 polish (Bridge user-mode detection, field-test rounds 1 + 2, source-flip pre-flight, CMD-flash elimination via `CREATE_NO_WINDOW`), full Codex security audit application (CSRF + Host allowlist, `/spotify/callback` XSS escape, preset DOM rebuild, param clamps, container regex), single-trigger packaged-app launcher rewrite (singleton via JSON probe, Bridge wake, Server SSH wake, Flask on main thread, post-boot on daemon, `launch_error.log`), formal system-design documentation at `docs/architecture/cockpit_launcher_system_design.md` and architecture artifact at `docs/architecture/cockpit_launcher_architecture.html`, plus a v0.7 UI redesign attempt paused mid-port and parked at `_dev/01_brand/cockpit_v07_template_draft.html` for next session. Five uncommitted deltas at session close, queued for one feature commit via Rafa. Full close summary at `_dev/04_progress/session_close_2026_05_13.md`.

**2026-05-12 (PS5.1 service-management rule removed, late):** Struck the COWORK OPERATING CONSTRAINTS bullet that required PowerShell 5.1 (not PS7) for service management on GDMARCHE on the claim that "PowerShell 7 lacks service permissions in this environment." Origin of the rule unknown to current authors; the technical claim does not hold up generally (PS7 and PS5.1 both call the same Windows Service Control Manager via the same Win32 APIs; access is determined by the process token, not the shell version). Gill owns GDMARCHE and is local admin. Five downstream version pins ("PowerShell 5.1") generalized to "PowerShell" in IDENTITY AND ROLE, CROSS-SURFACE ARCHITECTURE, the Default Rafa prompt shape, OUTPUT STANDARDS, and the lead-in to the operational routing table. If a genuine permission gap surfaces in either shell, document it as a one-off observation and elevate the process; do not re-introduce a blanket version pin.

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
