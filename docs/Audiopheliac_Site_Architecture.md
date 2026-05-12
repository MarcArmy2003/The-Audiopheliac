# The Audiopheliac — Site Architecture

**Version:** 1.0
**Date:** 2026-05-11
**Status:** Architecture spec for Phase 2 build, drafted during brand rework session.
**Posture:** Built for Gill first. Public-extraction is a side effect, not the design goal.

---

## 1. Framing

The site is a Gill-first sandbox. Every page exists because Gill personally uses it or wants it. If the page is also useful to a visitor, great. If not, the page still earns its place.

This framing reverses the standard content-site economics. Standard sites build for an audience and instrument the result; this site builds for one operator and exposes what's reusable. The audience is found, not chased.

Consequence: every feature decision can be tested against a single question. "Would Gill open this on a Tuesday night with the kids asleep?" If yes, build it. If no, defer it regardless of imagined audience demand.

## 2. Surfaces (top-level navigation)

| Route | Purpose | Audience | Build cost | Priority |
|---|---|---|---|---|
| `/` | Hero, motto, current-presenting playlists, Cockpit teaser, signal-chain summary | Visitor, Gill | Low (static) | P0 |
| `/gear` | Documented signal chain across four zones, device deep-dives | Visitor, Gill | Medium (markdown content) | P0 |
| `/vinyl` | Collection catalog, wishlist, grading reference, recent additions | Gill primarily | Medium (Discogs sync) | P1 |
| `/playlists` | Programmed sets, "The Audiopheliac presents..." catalog | Visitor, Gill | Low (static + cover art) | P0 |
| `/cockpit` | Local control panel (port 3100, in-home only) | Gill only | Already built (`console/`) | P0 |
| `/tools` | Hobbyist utilities (converter, signal-chain diagram, daypart playlist gen, vinyl tracker) | Visitor, Gill | High (per-tool varies) | P1-P2 |
| `/about` | Manifesto-register narrative, philosophy, who-this-is-for/not | Visitor | Low (single content piece) | P0 |
| `/posts` | Long-form content, gear deep-dives, manifesto pieces | Visitor, Gill | Ongoing | P1 |

Reading the table: P0 ships in the Phase 2 scaffold. P1 ships once P0 is stable and traffic warrants. P2 ships when a specific Gill workflow makes it inevitable.

## 3. Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro 6.x (TypeScript strict) | Static-first, content-collections, fast builds, file-based routing. Already partially scaffolded; partial deletion at `site/` to be resolved per THE-17 in the rework plan |
| Styling | Vanilla CSS with `tokens.v3.css` design tokens | No Tailwind. Tokens give us system consistency without framework overhead. WCAG-AAA verified at the contract level |
| Fonts | Google Fonts CDN initially (Unica One, Inter) | Self-host as a Phase 2.5 optimization once usage stabilizes |
| Hosting | Cloudflare Pages, deployed via GitHub Actions or Wrangler | Already provisioned; account ID in CLAUDE.md |
| Content | Markdown in `docs/` and Astro content collections in `site/src/content/` | Reuse what already lives in the repo; no CMS |
| Tools backend | Cloudflare Workers (Pages Functions) when needed; client-side WASM when possible | Avoids server complexity; respects converter feature's no-upload principle |
| Analytics | None initially; Cloudflare Web Analytics if needed later | "Built for Gill" framing means metrics aren't load-bearing |
| Auth | None on the public site. The Cockpit is firewalled by being on the home LAN | The site has nothing to log in for |

## 4. Content sources

- **Gear documentation:** Existing `docs/av_master_inventory_2026.md`, `docs/Processing_Hardware.md`, `docs/Lifestyle_650_Console_Summary.md`, etc. These render into `/gear` page templates at build time.
- **Signal chain:** Existing `config/audiopheliac_signal_map_v_2026_05.md`. Rendered as ASCII or as a generated SVG diagram per zone.
- **Vinyl collection:** Existing `Vinyl/vinyl_master_v_2026_02_full.md`, `Vinyl_Wish_List_v2026.02.md`. Discogs sync pipeline (planned per CLAUDE.md GEAR DISCOVERY PLATFORM section) feeds updates.
- **Listening profile / playlists:** `docs/Audiopheliac_Listening_Profile_v2026_04.md`, `docs/Playlist_Generation_Spec_v2026_04.md`. Powers `/playlists` content and the daypart playlist generator tool when built.
- **About / manifesto:** Drafted as part of this session (see brand voice guidelines v3.0 §3A exemplars). Single long-form piece on the About page.
- **Brand assets:** `media/` directory. Canonical mark, supporting marks, photography, playlist covers.

The pipeline is "markdown in, static HTML out." No CMS. No headless service. The repo is the database.

## 5. Tools

The tools surface is what makes the site useful beyond a portfolio. Each tool must satisfy two tests: (1) Gill uses it personally, (2) it's small enough to ship in under two weeks.

### 5A. File converter (THE-19, reactivated 2026-05-11)

- **Use case:** Convert Suno WAV exports to MP3 for Spotify Local Files indexing. Convert vinyl rip cleanups between FLAC and WAV. Convert image formats for playlist covers.
- **Execution:** Client-side ffmpeg.wasm. No file ever leaves the browser. No retention. No upload limit beyond browser memory.
- **Differentiation from saturated converter market (8+ free services):** Lifestyle-integrated workflows. Preset workflows for "Suno to Spotify Local Files," "vinyl rip cleanup," "playlist cover conversion." The same engine other tools use, but with Gill's actual workflows as named presets.
- **Scope:** Audio (WAV ↔ MP3 ↔ FLAC ↔ AIFF ↔ ALAC), Image (PNG ↔ JPG ↔ WEBP), Video (MP4 ↔ MOV ↔ WEBM) where the WASM engine supports it.
- **Out of scope (v1):** Server-side processing, batch upload, format conversion for licensed/DRM-encumbered audio (Apple Music, etc.).
- **Spec doc:** `docs/tools/file_format_converter_spec_v3.md` (written this session).

### 5B. Signal-chain diagram tool

- **Use case:** Document a home AV system visually. Drag-drop components, label cable types, mark gain stages, export PNG.
- **Execution:** Client-side canvas or SVG. No backend.
- **Differentiation from existing tools (Patchify, X-DRAW are pro-grade and pro-priced):** Built for the home enthusiast. Component library oriented to consumer AV (turntables, integrated amps, monitors, AV receivers, wireless TX/RX, NAS) rather than rack-mount pro audio.
- **Scope:** Single-room or multi-zone diagrams. Up to ~20 components per diagram. Export PNG/SVG.
- **Out of scope (v1):** Auto-routing, simulation, real-time gain calculation.
- **Priority:** P2 (build after converter ships and earns its place).

### 5C. Daypart playlist generator

- **Use case:** Given a time-of-day mode (morning warm-up, work block, late-afternoon swagger, reflective night, system-reward night, situational adrenaline), output a 20-30 track playlist sequenced for that mode.
- **Execution:** Spotify API (already configured in `automation/spotify_pull.py`). Server-side or build-time generation.
- **Inputs:** Listening profile, time-of-day mode, optional genre filter, optional length.
- **Differentiation:** Not "for you" algorithm; explicit programmed sequencing. Outputs a paste-ready track list and a Spotify URL.
- **Priority:** P2.

### 5D. Vinyl pricing tracker

- **Use case:** Track median Discogs pricing across the existing collection. Surface outliers, ride a wishlist, decide when to sell or hold.
- **Execution:** Discogs API (token already in `config/` per CLAUDE.md). Server-side or scheduled build.
- **Output:** Sortable table on `/vinyl/pricing`, with optional alerts.
- **Priority:** P2 (after Discogs sync pipeline stabilizes).

## 6. The Cockpit (`/cockpit`)

The Cockpit is the local control panel for the Yamaha R-N800A and Roon Server. It runs on `http://localhost:3100` on Gill's workstation (GDMARCHE). It is not accessible from the public web.

### Architecture (existing, per CLAUDE.md)

- Python/Flask backend at `console/app.py` with YXC and Roon clients.
- Browser UI loaded by `console/launch.pyw` via `pythonw + Chrome --app`.
- YXC client (`console/yamaha.py`): power, volume, mute, source select, transport, Net Radio presets.
- Roon client (`console/roon.py`): zones, library browse/search, transport, Now Playing.
- Token persistence: `console/roon_token.json` (gitignored).
- Config: `console/config.json` (yamaha_ip, roon_host, host, port).

### Redesign (this session, mockup at `_dev/01_brand/cockpit_redesign_mockup.html`)

- Port from Nashville Midnight palette to Full Spectrum.
- Add Now Playing card as a hero block with album art, scrub bar, transport controls.
- Add Roon Zones card with active state, per-zone volume sliders.
- Retain Yamaha R-N800A card with power, source select, master volume, Net Radio presets.
- Add Library browse card with search, tabs (Recent, Albums, Artists, Playlists, Genres).
- Add Up Next queue card.
- Remove tone control and Pure Direct sections (firmware doesn't support, verified by YXC probes).
- Replace bronze/cream/indigo palette with Sunlamp Yellow CTAs, Signal Green active states, Magenta Lift hovers.

### Site link

The public site's `/cockpit` page is informational only. It tells visitors what the Cockpit is (a local control panel), shows a screenshot of the UI, links to the source on GitHub. Visitors cannot operate Gill's Cockpit from the public web.

## 7. Content posture

### 7A. Voice consistency

All content surfaces apply `brand-voice-guidelines-v3.md`. The register-switching table in §3D of that document maps to surface-by-surface. The `brand-voice:enforce-voice` skill runs on every piece before publish.

### 7B. Posting cadence

- No posting calendar. The site is documentation-first. Pieces ship when they are ready.
- Long-form posts in manifesto register: aim for one per quarter. Quality bar high.
- Gear updates / shorter pieces in direct register: as warranted.
- No newsletter at launch. Decide before Phase 2.5 whether to start one.

### 7C. Affiliate disclosure

If any post includes Amazon affiliate links (via the planned `audiopheliac-gear-proxy/` integration or direct), disclosure appears at the top of the post, not buried in a footer. Pattern:

> This piece includes Amazon affiliate links to gear in active use here. The reviews aren't influenced by the affiliate relationship.

### 7D. SEO posture

The site is built for Gill. SEO is a side effect of consistent topical coverage of country/classic-rock/blues-rock home hi-fi content. No keyword stuffing, no AI-generated content, no link-trading. The voice and the substance are the SEO strategy.

## 8. Build pipeline

```
Markdown sources (docs/, Vinyl/, brand-voice-guidelines-v3.md, this file)
  ↓
Astro content collections + page templates
  ↓
Static HTML output to site/dist/
  ↓
Cloudflare Pages (deployed via GitHub Actions on push to main)
  ↓
theaudiopheliac.com
```

Optional steps:
- `site/src/content/playlists/*.md` (per-playlist metadata) feeds `/playlists` index.
- `site/src/content/posts/*.md` feeds `/posts` index and RSS.
- `media/` referenced via Astro `~/assets` path; bundled and hashed by Astro.

## 9. Data sources (read-only at build, optional live)

- **Spotify:** existing `spotify_pull.py` produces `data/spotify/spotify_library.json`. Can be referenced at build time for `/playlists` page content.
- **Discogs:** planned sync pipeline produces `data/discogs/collection.json`. Feeds `/vinyl/catalog` page.
- **Listening profile:** static markdown, no live data.
- **Cockpit state:** never read at site build time. Cockpit is local-only.

Live data (if any) is fetched client-side from public APIs only. No proxying through Cloudflare Workers unless absolutely required.

## 10. Privacy and tracking

- No analytics by default.
- No third-party JS beyond Google Fonts (which Self-host as Phase 2.5 fix).
- No cookies. No localStorage for tracking.
- The converter tool processes files entirely client-side; no uploads, no retention.
- The footer of the site asserts: "No tracking. No ads. No newsletter (yet)."

## 11. Outstanding decisions

1. **Resolve `site/` directory git state (THE-17 in rework plan).** All Astro scaffold files are staged for deletion in the index. Decide before Phase 2 scaffold execution: restore from index or hard-reset and rebuild clean.
2. **Self-host fonts vs. Google Fonts CDN.** Defer until Phase 2.5.
3. **Newsletter posture.** Decide before launch.
4. **Affiliate program activation.** Amazon PA-API access pending qualifying sales. Best Buy Developer API is a viable interim per CLAUDE.md.
5. **RSS feed.** Plan for it. Astro has good RSS support out of the box.
6. **Sitemap.** Plan for it. Astro generates this automatically when configured.

## 12. Acceptance criteria (Phase 2 first deploy)

- All P0 routes serve content (`/`, `/gear`, `/playlists`, `/cockpit`, `/about`)
- Full Spectrum palette applied consistently
- Canonical mark in header on all pages
- Cloudflare Pages build green
- theaudiopheliac.com serving
- Mobile responsive at standard breakpoints
- Zero console errors in Chrome and Safari
- WCAG-AAA contrast verified on all CTA contracts
- Brand voice spot-check passes `brand-voice:enforce-voice` on each route

---

*The site is a working document, not a marketing asset. Build for Gill, expose what's reusable, ignore the rest.*
