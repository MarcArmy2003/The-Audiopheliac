# Audiopheliac Cockpit — System Design v2026.05

**Status:** Draft, design phase
**Owner:** Gill Marchetti
**Date:** 2026-05-08

A private web-based control center for the Audiopheliac home AV system. Lives at a private route on theaudiopheliac.com. Unifies music sources, controls playback across four zones, integrates lighting, and exposes an LLM agent over the connected MCP servers for natural-language orchestration.

---

## 1. Functional Requirements

**Core capabilities:**

1. Browse and play music from multiple sources unified in one UI: local FLAC library (NAS via MinimServer/UPnP), Spotify (catalog + Spotify Connect playback control), Suno (account library + prompt iteration), Net Radio (R-N800A built-in), Discogs (vinyl collection cross-reference), and vinyl-as-source (manual track entry while a record spins).
2. Route audio to four zones: Office Studio, Family Room, Lanai, Garage. Each zone has its own endpoint protocol (YXC for R-N800A, Cast for Chromecast 4K and Shield Pro, SoundTouch HTTP API for Garage Bose, MinimServer/UPnP push for any DLNA renderer).
3. Per-zone transport controls: power, volume, mute, source select, play/pause/skip, seek.
4. Multi-zone grouping via MusicCast distribution (R-N800A as server) for sync playback in supported zones.
5. Album-art-driven theming: dominant color extracted from current track art animates CSS accent variables and pushes matching color to Hue Entertainment for room-scale theming.
6. Hue scene control: per-zone scene presets, "music mode" reactive to BPM and frequency content via Entertainment API.
7. Natural-language control via embedded LLM agent: "play something like Zach Bryan but more upbeat in the Family Room and dim the lights" maps to a series of MCP tool calls.
8. Action targets (not sources): send selected track to Ableton as audio reference, fire Live scene, trigger named Hue scene.
9. Listening history viz: genre/BPM/zone heatmap, source distribution, weekly/monthly trends.

**Out of scope for v1:**

- Real-time mixing of Spotify and local audio in a single output stream (DRM boundary; cannot bypass).
- Amazon Music, iTunes, Tidal (Gill does not subscribe).
- Public/external user access (single-user private dashboard).
- Mobile-first design (desktop primary, mobile responsive but not hand-tuned for v1).

## 2. Non-Functional Requirements

**Latency:** Source selection, volume, and transport actions must complete in under 200 ms perceived (network round-trip + UI update). LLM tool calls allowed up to 3 s (model latency dominant).

**Availability:** Single-user, single-instance. Down means down. No SLA. Local-first architecture means dashboard works on LAN even if WAN is out (Spotify and Suno features degrade; Yamaha YXC, Hue, MinimServer, SoundTouch, Cast all keep working).

**Security:** Private by default. Cloudflare Access in front of the route, restricted to Gill's accounts (gillon.marchetti@gmail.com, gillon.marchetti@veterananalytics.com). Service tokens for backend-to-MCP-server auth. No user-supplied secrets in the browser.

**Cost:** Free or near-free. Cloudflare Pages free tier. Cloudflare Access free for up to 50 users. No paid SaaS for the dashboard layer itself. Spotify Web API free tier sufficient for personal use. Suno automation through third-party MCP wrapper has a per-request cost (AceData Cloud's pricing); usage-bounded.

**Maintainability:** Solo operator. Stack must be Gill-maintainable a year from now without re-onboarding. Favor boring, durable tech over shiny.

## 3. Components

```
┌───────────────────────────────────────────────────────────────────┐
│                  COCKPIT WEB UI (browser)                         │
│  React/Astro Islands — Nashville Midnight theme                   │
│  - Zone selector / tab nav                                        │
│  - Now Playing canvas with album-art color extraction             │
│  - Source bar (13 sources)                                        │
│  - Signal flow visualization (node-based)                         │
│  - Hue scene panel                                                │
│  - LLM chat panel                                                 │
│  - Listening history viz                                          │
└────────────────┬──────────────────────────────────────────────────┘
                 │ WebSocket (state) + HTTP (commands)
                 ▼
┌───────────────────────────────────────────────────────────────────┐
│            COCKPIT BACKEND (Cloudflare Worker + Durable Object)   │
│  - Auth: Cloudflare Access JWT verification                       │
│  - State: Durable Object holds per-zone state, connection registry│
│  - LLM agent loop: Anthropic API + MCP server registry            │
│  - Webhook receivers: scrobble events, Hue events                 │
└────────┬──────────────────────────────────────────────────────────┘
         │
   ┌─────┴─────┬───────────┬───────────┬───────────┬───────────────┐
   │           │           │           │           │               │
   ▼           ▼           ▼           ▼           ▼               ▼
┌─────┐   ┌──────┐   ┌─────────┐  ┌──────┐  ┌──────────┐  ┌─────────────┐
│ YXC │   │ Hue  │   │ Spotify │  │ Suno │  │ MinimSrv │  │ Cast / ADB  │
│ MCP │   │ MCP  │   │ Web API │  │ MCP  │  │ UPnP MCP │  │ MCP         │
└──┬──┘   └──┬───┘   └────┬────┘  └──┬───┘  └─────┬────┘  └──────┬──────┘
   │         │            │          │            │              │
   ▼         ▼            ▼          ▼            ▼              ▼
R-N800A   Hue Bridge   Spotify    AceData      QNAP          Chromecast 4K
SoundTouch                        proxy        (NAS)         Shield Pro
                                                              (mDNS LAN)
```

**MCP servers run on the local LAN edge** (a Raspberry Pi, the QNAP TS-473A in Container Station, or GDMARCHE) so the cloud Worker reaches them via Cloudflare Tunnel for secure inbound. This avoids opening any port on the home network.

## 4. Data Flow — Two Representative Operations

### 4a. "Play album X on Family Room"

1. User clicks album art on the Now Playing card. Browser sends `POST /api/zones/family_room/play { source: 'minimserver', uri: 'urn:upnp:...' }` over HTTPS.
2. Worker verifies Cloudflare Access JWT, authorizes the zone+source pair, forwards to MinimServer UPnP MCP via Tunnel.
3. MinimServer MCP issues UPnP `SetAVTransportURI` + `Play` to the R-N800A's UPnP renderer endpoint.
4. R-N800A starts playback. YXC MCP polls `netusb/getPlayInfo` every 1 s and pushes track metadata + album art URL up to the Worker, which fans out to the browser over WebSocket.
5. Browser fetches the album art, runs Color Thief (browser-side, ~30 ms), updates CSS variable `--accent-current`, pushes the same RGB to the Hue MCP via the Worker for Entertainment API streaming.

### 4b. "Play something like Zach Bryan but more upbeat in the Family Room"

1. User types prompt into LLM chat panel. Browser sends `POST /api/agent/turn { prompt: '...', context: { active_zone: 'family_room' } }`.
2. Worker invokes Anthropic API (Claude Haiku, fast tier) with system prompt describing available MCP tools and current state.
3. Claude returns a tool-call plan: search Spotify for "Zach Bryan adjacent, BPM > 110," select top 3, queue them on R-N800A's Spotify Connect.
4. Worker executes the tool calls in sequence: Spotify Web API search, Spotify Web API queue add, YXC `setInput?input=spotify`.
5. Worker streams the agent's narration ("queueing 3 tracks: Tyler Childers, Sam Barber, Wyatt Flores") back to the browser as the calls complete.

## 5. Storage

**State storage (Durable Object):**

- Per-zone live state: power, volume, current source, current track, queue position
- LLM conversation history (last 20 turns per session, expires after 24 h)
- Hue scene definitions (custom user-defined scenes beyond Hue's defaults)
- Vinyl-as-source manual entries (active "now spinning" entry per zone)

**Listening history (D1 SQLite on Cloudflare):**

- Track plays: track ID, source, zone, timestamp, duration played
- Used for the listening graph viz and LLM context ("you've played a lot of country lately")
- Schema: `plays(id, ts, zone, source, track_id, track_name, artist, album, duration_played_sec, completion_pct)`

**Static asset storage:**

- Album art cache in Cloudflare KV (URL-keyed), TTL 30 days
- Hue Entertainment color palettes precomputed per album, KV-cached

**External sources of truth (read-only or scrobble):**

- Spotify: playlists, library, listening history (via Spotify Web API)
- Discogs: collection, wantlist (via Discogs token)
- MinimServer: local FLAC catalog (via UPnP CDS browse)

## 6. API Contracts (Backend Endpoints)

```
GET  /api/zones                              List all zones with current state
GET  /api/zones/:id                          One zone's full state
POST /api/zones/:id/play                     Start playback
POST /api/zones/:id/pause                    Pause
POST /api/zones/:id/skip                     Next track
POST /api/zones/:id/volume   { delta | set } Volume control
POST /api/zones/:id/source   { source }      Source select
POST /api/zones/:id/queue    { uri | track } Add to queue
POST /api/zones/:id/group    { with: [...] } Form MusicCast group
POST /api/zones/:id/ungroup                  Leave group

GET  /api/sources                            List active sources + connection state
GET  /api/sources/:id/search?q=...           Search within a source
GET  /api/sources/:id/library                Browse source library

GET  /api/hue/scenes                         List Hue scenes per zone
POST /api/hue/scenes/:id/activate            Activate a scene
POST /api/hue/sync   { zone, mode: 'music'|'art'|'off' }

POST /api/vinyl/now-spinning  { zone, ... }  Manual vinyl track entry
DELETE /api/vinyl/now-spinning/:zone

POST /api/agent/turn  { prompt, context }    LLM agent turn
GET  /api/agent/history                      Recent conversation

GET  /api/history?range=...                  Listening history for viz
GET  /api/history/aggregate?dimension=...    Aggregations for charts

WS   /ws/state                               WebSocket: live zone+source updates
```

## 7. UI Information Architecture

**Single-page app, three primary modes (toggle in top nav):**

- **Cockpit** — default. Zones, sources, transport, queue, signal flow, Hue, LLM chat. The control center.
- **Library** — browse local FLAC, Spotify, Discogs collection, Suno output, Net Radio stations. Searches across all in scope, returns unified results with per-source provenance badges. Click a result to surface "play in zone" options.
- **Studio** — Suno production view (prompts, generations, drafts) + Ableton control surface (scene fire, Live API target). Optional split into separate page after v0 review per Gill's call.

**Cockpit layout (16-col grid, desktop ≥ 1280 px):**

- Top nav (full width): Audiopheliac mark, mode toggle, account, theme toggle
- Left rail (cols 1-2): Zone selector, vertical stack of 4 zones + master bedroom placeholder + "All zones"
- Main canvas (cols 3-11): Now Playing for selected zone — album art (dominant color extracted), track metadata, transport controls, queue strip, signal flow visualization toggle
- Right rail (cols 12-16): Sources panel (13 sources as toggleable cards), Hue scene panel (4-6 cards per zone), LLM chat panel (collapsible)

**Mobile (≤ 768 px):** zone selector becomes top horizontal scroll, sources collapse to a bottom sheet, LLM chat collapses to a floating button.

## 8. Trade-offs and Open Questions

**T1. Cloud Worker vs local-only backend.** Local backend (Pi or QNAP container) eliminates Cloudflare hop, but requires Tailscale or VPN for off-network access. Cloud Worker requires Tunnel for inbound to MCP servers but gets free TLS, free CDN for static assets, and Cloudflare Access for auth. Lean: Cloud Worker. Revisit if Cloudflare costs spike or if home network goes WAN-down for extended periods.

**T2. Astro vs Next.js vs Remix.** Phase 2 of theaudiopheliac.com is Astro per CLAUDE.md WEBSITE STATE. Cockpit slots into the same Astro app as a private route with React islands for the interactive parts. Picks up brand layer for free. Trade: Astro's WebSocket story is not as tight as Next.js's; route the WS through Cloudflare Worker directly, not through Astro.

**T3. LLM model choice.** Claude Haiku (fast, cheap, good enough for tool-call planning) vs Sonnet (richer reasoning for multi-step orchestration). Lean: Haiku for default turns, Sonnet for "scene composition" turns where the user asks for a curated playlist or multi-zone choreography.

**T4. MCP server hosting.** Pi vs QNAP Container Station vs GDMARCHE. QNAP is always-on, low-power, already running MinimServer. Lean: QNAP Container Station for the YXC, Hue, and MinimServer MCPs; GDMARCHE only for Ableton-OSC MCP since Live runs there.

**T5. Suno integration risk.** AceData Cloud is a third-party scraping wrapper. ToS gray area; account-ban risk is real. Limit dashboard scope to: prompt drafting (always safe), generation status polling (gray), library browse (gray). No automated mass-generation. Manual generation stays in the browser at suno.com.

**T6. Vinyl-as-source detection.** Manual entry is reliable but tedious. Shazam-style mic capture from a USB mic (the Scarlett Solo input, when it's working) would auto-populate. Free APIs: ACRCloud (free tier 14 days), AcoustID (free, requires Chromaprint fingerprinting). Lean: manual for v1, ACRCloud experiment in v2.

## 9. What I'd Revisit at Scale

This is single-user, so "scale" means feature scale, not user scale.

- **MCP server proliferation.** Each new source adds a server to maintain. Watch for MCP-Apps (SEP-1865) maturity in 2026 — server-pushed UI components could replace bespoke React per source.
- **Listening history depth.** D1 SQLite is fine for years of personal data, but if Discogs price-tracking, Spotify play-along, and vinyl manual entries all converge into one analytics layer, consider a dedicated Pi-hosted Postgres or DuckDB.
- **Cloudflare Tunnel reliability.** Single point of failure between cloud Worker and home MCP servers. If Tunnel flakes, fallback could be dashboard rendering "LAN-only mode" using direct browser-to-MCP calls when on home network.
- **Voice surface.** Echo in the Garage. Could add Alexa Skills or a wake-word listener on a Pi for voice-first control as a v3 feature.
