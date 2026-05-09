# Audiopheliac Cockpit — Architecture Decisions v2026.05

Companion to `Cockpit_System_Design_v2026_05.md`. Five ADRs covering the major tech-choice decisions. Status: all Proposed. Awaiting Gill's sign-off.

---

# ADR-001: Hosting model — Cloudflare Worker vs Local-only Backend

**Status:** Proposed
**Date:** 2026-05-08
**Deciders:** Gill

## Context

The Cockpit needs a backend to translate user actions into MCP tool calls, hold per-zone state, run the LLM agent loop, and serve the SPA. Two hosting models are viable.

## Options Considered

### Option A: Cloudflare Worker + Durable Object (cloud-hosted backend, MCP servers on LAN reached via Cloudflare Tunnel)

| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium |
| Cost | $0 at this usage |
| Latency | Cloud round-trip adds ~30-80 ms vs local |
| Off-network access | Built-in (works anywhere) |
| Auth | Cloudflare Access free tier handles it |
| TLS | Free, automatic |
| Single point of failure | Cloudflare Tunnel between Worker and MCP servers |

**Pros:**
- Phase 2 site is already on Cloudflare Pages. Same Worker runtime, same brand layer, single deployment surface.
- Cloudflare Access provides identity-based auth without building a login system.
- Off-network access works without VPN, route hijacks, or Tailscale unblocking.
- Durable Objects give consistent state without standing up a database.

**Cons:**
- Cloudflare Tunnel is the single inbound path to the LAN. If it flakes, dashboard breaks.
- Spotify Web API rate limits hit the Worker's IP; not a problem at single-user scale.
- More moving parts than "everything on one box."

### Option B: Self-hosted Node/Python backend on QNAP Container Station

| Dimension | Assessment |
|-----------|------------|
| Complexity | Low to medium |
| Cost | $0 |
| Latency | LAN-local, sub-10 ms |
| Off-network access | Requires Tailscale or WireGuard (currently broken at home, per CLAUDE.md) |
| Auth | Build it, or front with reverse-proxy + OAuth2 |
| TLS | Self-signed or LAN-only; Cloudflare Tunnel adds it back if added |
| Single point of failure | Home internet, but for off-network only |

**Pros:**
- Sub-10 ms local latency. Snappy.
- One box, one process, easy mental model.
- Works during ISP outages.
- No cloud vendor lock-in.

**Cons:**
- Off-network access requires the Tailscale/WireGuard route-hijack issue to be resolved (open action item in CLAUDE.md).
- Auth has to be built or wired through OAuth2 proxy.
- TLS requires self-cert + browser exception, or putting it behind Cloudflare anyway.

## Trade-off Analysis

The decisive factor is off-network access. Gill is mobile (federal policy work, travel). A dashboard that only works inside the LAN is half a product. Resolving the Tailscale route-hijack issue is a separate open action item that has been open for months; not gating Cockpit on it is the right call.

Cloud Worker also gives Gill the auth layer free, which removes a non-trivial design+build burden.

Latency cost (~50 ms cloud round-trip) is imperceptible for the actions the user does (volume, source switch, queue add). Album-art color extraction happens browser-side, so the visual layer is not bottlenecked.

## Decision

**Option A — Cloudflare Worker + Durable Object, MCP servers on LAN reached via Cloudflare Tunnel.**

## Consequences

**Easier:**
- Deploy unified with Phase 2 site Astro build.
- Auth handled by Cloudflare Access.
- TLS, CDN, DDoS, all free.
- Off-network access works on day one.

**Harder:**
- Cloudflare Tunnel has to be configured and monitored.
- MCP servers live on LAN but talk to a cloud Worker; logging across the boundary needs intentional plumbing.
- If Cloudflare goes down, dashboard goes down. Acceptable for personal use.

**Revisit when:**
- LAN MCP servers exceed Cloudflare Worker free tier limits (millions of subrequests per month — unlikely for single user).
- Tailscale/WireGuard route issue gets resolved AND Gill wants sub-10 ms control AND off-network use stops mattering. (Three conditions; unlikely all three hit.)

---

# ADR-002: Frontend — Embed in Phase 2 Astro site vs standalone SPA

**Status:** Proposed
**Date:** 2026-05-08
**Deciders:** Gill

## Context

The Cockpit lives at a private route on theaudiopheliac.com per Gill's directive ("essentially put the app in the website"). Phase 2 of the website is targeted at Astro + Cloudflare Pages per CLAUDE.md WEBSITE STATE. The Cockpit is interactive (real-time state, transport controls, LLM chat) where the rest of the site is content-driven (gear curation, vinyl catalog, signal chains).

## Options Considered

### Option A: Astro app with React Islands for the Cockpit route

| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium |
| Brand consistency | Free (shares tokens.css and components) |
| Build complexity | One build, one deploy |
| Bundle size | Cockpit JS only loads on /cockpit route |
| WebSocket support | Route WS through Worker, not Astro |

**Pros:**
- One deployment, one auth boundary, one brand layer.
- Astro Islands keep the marketing site fast (zero JS by default) while letting the Cockpit be a heavy React app.
- Shared design tokens (Nashville Midnight palette) and component library.

**Cons:**
- Astro's interactivity model is opinionated; React state lifecycle inside an Astro shell needs care.
- WebSocket has to be routed through the Worker, not through Astro's dev server.

### Option B: Standalone Vite + React SPA on a separate Pages project

**Pros:**
- Clean separation, no Astro learning curve for the interactive layer.
- Easier to iterate on the Cockpit without affecting the marketing site.

**Cons:**
- Duplicates auth, brand layer, deployment, domain routing.
- Two apps to maintain, two sets of build configs.
- Loses the "essentially put the app in the website" intent; it becomes "an adjacent app at app.theaudiopheliac.com or similar."

## Decision

**Option A — Astro app with React Islands at /cockpit (or /control, name TBD).**

## Consequences

**Easier:**
- Single domain, single deploy, single brand kit.
- Cockpit benefits from any improvement to the shared design system.

**Harder:**
- Need to learn Astro's Islands hydration model if not already familiar.
- WebSocket connection management lives in a useEffect inside an island, not in an Astro component.

**Revisit when:**
- Cockpit complexity makes the Astro shell feel like overhead. At that point, eject the Cockpit to its own app and reverse-proxy from the Astro site. Day-1 cost of that move is low because the API boundary is already clean.

---

# ADR-003: LLM provider — Anthropic Claude (Haiku + Sonnet)

**Status:** Proposed
**Date:** 2026-05-08
**Deciders:** Gill

## Context

The Cockpit's killer feature is natural-language control over a fleet of MCP servers. The LLM needs strong tool-use, low latency for transport-style commands, and richer reasoning for multi-step scene composition.

## Options Considered

### Option A: Anthropic Claude — Haiku 4.5 default, Sonnet 4.6 for complex turns

| Dimension | Assessment |
|-----------|------------|
| Tool-use quality | Strongest in class as of May 2026 |
| Latency (Haiku) | ~400-800 ms first token |
| Cost (Haiku) | ~$0.25/M input, $1.25/M output (illustrative) |
| MCP integration | First-class (Anthropic authored MCP) |
| Vendor lock-in | Owned by Anthropic; portable enough via standard MCP layer |

### Option B: OpenAI GPT-4-class

Tool use comparable. Cost slightly higher. MCP support added 2025. No first-mover advantage either direction at single-user scale.

### Option C: Self-hosted (Llama 3, Mixtral, Qwen) on GDMARCHE GPU or via Together/Groq

Open-weight models with tool-use have closed the gap but trail Claude/GPT for multi-tool orchestration. Gill has no GPU box dedicated to inference. Hosted open-source (Together, Groq) reintroduces vendor coupling without the brand recognition of Anthropic.

## Decision

**Option A — Anthropic Claude. Haiku 4.5 for default turns, Sonnet 4.6 for "scene composition" prompts (multi-zone choreography, curated playlist generation, listening-graph queries).**

Routing logic: any prompt under 100 tokens with no curation keywords → Haiku. Prompts containing "curate", "build a playlist", "match the mood", "across all zones", or LLM agent self-escalation → Sonnet. Override available in chat: prefix with `!sonnet` or `!haiku`.

## Consequences

**Easier:**
- MCP integration is native, no glue layer.
- Tool-call quality means fewer clarifying turns per command.
- Anthropic API key already in Gill's possession (presumed).

**Harder:**
- Vendor concentration. If Anthropic prices change or API breaks, alternative needs validation.
- Cost is usage-bounded but not zero. Track in Cloudflare Worker logs and alert if monthly spend exceeds $20.

**Revisit when:**
- Open-weight tool-use catches up (likely 2027 baseline given current trajectory).
- Self-hosted GPU box becomes available (separate aspirational item).

---

# ADR-004: MCP server hosting — QNAP Container Station + GDMARCHE

**Status:** Proposed
**Date:** 2026-05-08
**Deciders:** Gill

## Context

The Cockpit needs MCP servers for: YXC (Yamaha), Hue, Spotify, Suno, MinimServer/UPnP, Bose SoundTouch, Cast (mDNS), Discogs, Net Radio (subset of YXC), and Ableton-OSC. Each server is a long-lived process. They need network reachability from the Cloudflare Worker (via Tunnel) and from each other (for cross-source operations).

## Options Considered

### Option A: All on QNAP Container Station

**Pros:** Always-on, low-power, single host. NAS is the most stable box on the LAN.
**Cons:** Ableton-OSC MCP must reach Live, which runs on GDMARCHE. Cross-host network call from QNAP → GDMARCHE works but adds a hop.

### Option B: Split — QNAP for everything except Ableton-OSC; GDMARCHE for Ableton-OSC

**Pros:** Each MCP runs where its dependency lives. Ableton-OSC needs Live, which is on GDMARCHE; everything else has no host affinity.
**Cons:** Two hosts to monitor.

### Option C: Pi 5 dedicated to MCPs

**Pros:** Isolation. Doesn't compete with NAS file ops or DAW for resources.
**Cons:** Another box to buy, power, manage. No clear win over QNAP Container Station for a single-user load.

## Decision

**Option B — Split. QNAP Container Station hosts YXC, Hue, Spotify, Suno, MinimServer/UPnP, Bose SoundTouch, Cast, Discogs MCPs. GDMARCHE hosts Ableton-OSC MCP. Cloudflare Tunnel terminates on QNAP and reverse-proxies the GDMARCHE MCP via LAN.**

## Consequences

**Easier:**
- QNAP runs the bulk; one host, one Tunnel endpoint.
- Ableton-OSC is co-located with Live so OSC traffic stays local-host.

**Harder:**
- GDMARCHE has to be on for Live-related dashboard features. Acceptable: it is on whenever Gill uses Live anyway.
- Container Station can be a mild pain point for QNAP firmware updates. Pin container versions and snapshot before updates.

**Revisit when:**
- QNAP load becomes an issue (very unlikely at this scale).
- Pi 5 becomes free or repurposable.

---

# ADR-005: Authentication — Cloudflare Access + Google identity

**Status:** Proposed
**Date:** 2026-05-08
**Deciders:** Gill

## Context

Cockpit must be private. Single user. No public access. Need to gate `/cockpit*` routes and the `/api/*` paths on the Worker.

## Options Considered

### Option A: Cloudflare Access with Google OIDC, restricted to gillon.marchetti@gmail.com and gillon.marchetti@veterananalytics.com

**Pros:** Free tier covers it. Identity-based, no passwords. JWT issued per session. Worker validates JWT in middleware. Same accounts already used for Spotify Developer App per CLAUDE.md.

**Cons:** Bound to Cloudflare. If Cloudflare is down, dashboard is unreachable (already true via Worker dependency).

### Option B: Self-hosted auth (Lucia, Auth.js, etc.) with magic links

**Pros:** No Cloudflare dependency for auth.
**Cons:** Build, maintain, secure. Email infrastructure for magic links. Session storage. Solo operator should not own this.

### Option C: HTTP Basic Auth at the Worker

**Pros:** Trivial.
**Cons:** Reuses a single password across all sessions, no revocation per device, no audit trail.

## Decision

**Option A — Cloudflare Access with Google OIDC, allowed identities locked to Gill's two Google accounts.**

## Consequences

**Easier:**
- No login form to design or maintain.
- Identity in Worker requests via signed JWT in `Cf-Access-Jwt-Assertion` header.
- Per-device session revocation through Cloudflare dashboard.

**Harder:**
- One more Cloudflare configuration surface to learn (Access policies).
- API clients (curl, Postman testing) need service tokens, separately issued.

**Revisit when:**
- Multi-user access becomes a need (Gill + family member). Trivial to add to the Access policy.

---

## Cross-cutting Action Items

1. Authorize Phase 2 Astro scaffold per CLAUDE.md WEBSITE STATE before Cockpit work begins.
2. Resolve open question: which subdomain or path serves the Cockpit. Lean: theaudiopheliac.com/cockpit. Alternative: cockpit.theaudiopheliac.com.
3. Provision Cloudflare Tunnel from QNAP Container Station to Cloudflare. cloudflared QPKG exists for QNAP; install and configure.
4. Stand up first MCP server (YXC) as a proof-of-concept end-to-end before building the rest. Validates Worker → Tunnel → MCP → Yamaha path.
5. Get Anthropic API key into Cloudflare Worker secrets.
6. Decide auth route name (Cloudflare Access policy is route-scoped).
