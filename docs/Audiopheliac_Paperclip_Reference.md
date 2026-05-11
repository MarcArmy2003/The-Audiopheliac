# Paperclip Reference — The Audiopheliac

**Scope:** The Audiopheliac ONLY. Audiopheliac-specific revision derived from the VAL cross-project reference (`C:\Users\gillo\Veteran Analytics LLC\Paperclip_Reference.md`).

> **Distinct file.** This document is the Audiopheliac-applicable revision. It lives at `C:\Users\gillo\The-Audiopheliac\docs\Audiopheliac_Paperclip_Reference.md`. Do NOT confuse with the VAL parent at `C:\Users\gillo\Veteran Analytics LLC\Paperclip_Reference.md`, which covers VeteranAnalytics.com + VeteranIntel.org operational specifics. When platform-mechanics content drifts between the two files, the canonical source for both is the official paperclip.ing documentation, not either of these caches.

**Source lineage:** Official paperclip.ing documentation, fetched and curated 2026-05-10 (VAL S90). Audiopheliac revision: 2026-05-11.

**How to read this file:** Sections 1 through 38 and most of 39 onward are platform-mechanics (API, UI, CLI, error codes, model shapes) and apply uniformly to any paperclip company including the Audiopheliac one. The original VAL-cross-project document contained operational subsections per project (VeteranIntel/VAL vs. Audiopheliac). In this revision those VAL-specific blocks are **kept verbatim and clearly labeled** so you can read across products if helpful, but Audiopheliac-specific content has been promoted and expanded where the original was thin. When a section is entirely VAL-operational with no Audiopheliac relevance, it is labeled `[VAL-only, retained for cross-reference]` and you can skip it for Audiopheliac work.

## Canonical paperclip documentation sources

When this reference is stale, ambiguous, or missing a topic, the authoritative source order is:

1. **Official docs site:** https://docs.paperclip.ing/#/ — the canonical user-facing documentation. Specific landing page Gill provided: https://docs.paperclip.ing/#/administration/cli-auth.
2. **Paperclip GitHub repo:** https://github.com/paperclipai/paperclip — source of truth for unreleased behavior, the canonical `paperclip` skill body, the four bundled example plugins, and any field shape this doc may have abstracted.
3. **AI-canonical orientation:** https://paperclip.ing/llms.txt — short LLM-friendly summary suitable for context loading.

This reference document consolidates the above for cross-project use. Treat it as a curated cache — when something in this doc conflicts with the canonical sources above, the canonical sources win and this doc should be updated.

## 0. Audiopheliac Current State (2026-05-11)

| Item | Value |
|---|---|
| Company name | The Audiopheliac |
| Company id | `821ef660-0041-4ef6-a911-adb1ba038e15` |
| Issue prefix | `THE` (server-side immutable; see Prefix Decision below) |
| Brand color | `#7a1f2b` |
| Created | 2026-05-06 |
| Dashboard URL | `http://127.0.0.1:3100/THE/dashboard` |
| Operator agent | NOT yet hired. Read/write at SESSION-INIT / SESSION-CLOSE remains gated until hire. |
| Open issues | 0 (THE-1 baseline closed 2026-05-08) |
| Routines | 0 |
| Projects / Goals | 0 |
| Budget envelope | Not yet set. Recommended at hire: $50/mo soft, $100/mo hard, recalibrate after 1 week of telemetry. |

## 0.1 Recommended Audiopheliac use cases (scope: lifestyle brand build)

The Audiopheliac is a lifestyle brand at the intersection of audio, technology, and AI (per CLAUDE.md IDENTITY AND ROLE). Paperclip is the central governance and audit layer for a multi-stream operation with content production, AI integrations, affiliate revenue, music releases, possible storefront, and possible sponsorships. The fifteen use cases below cluster into five lanes.

**Core operations**

1. **Daily data-pipeline routine.** Replace Windows Task Scheduler for `music_indexer.py + spotify_pull.py + spotify_local_match.py + spotify_gap_report.py`. Routine fires nightly, creates issue, Operator agent runs pipeline, posts diff. Audit trail + cost telemetry for free.
2. **Hardware / signal-chain change audit trail.** Each substantive change (Solo failure, AIR Hub promotion, MX28 reinstated, Schiit reconciliation) becomes an issue with rationale. Replaces manual CHANGELOG drift.
3. **Approval gates for destructive ops.** Exactly the first-90-days discipline CLAUDE.md PAPERCLIP SURFACE already names: NAS deletions >10 files, git force-push to main, Cloudflare prod deploys, Spotify/Discogs/Suno token rotation, [MODERATE]/[HIGH] firmware flashes. Paperclip enforces what CLAUDE.md describes.
4. **Vinyl / Discogs sync routine** (future). Weekly Discogs collection refresh when integration ships. Same routine shape as the daily pipeline.

**Content production**

5. **Editorial pipeline.** One issue per blog post / deep-dive: draft → SEO check → brand-voice check → publish gate before Cloudflare deploy to main. Keyed documents per post hold outline, draft, final.
6. **Product review workflow.** One issue per product reviewed: receipt / unbox / setup / listening notes / score / write / shoot / publish. Per-review cost tracking (gear cost vs. expected affiliate return). Project anchor per review batch (e.g., "Reviews Q3 2026").
7. **Brand voice + Nashville Midnight identity enforcement gate.** Public-facing content cannot deploy without brand-voice review (Cowork applies the brand-voice-enforcement skill; paperclip holds the gate). Audit trail for every published asset. Same gate enforces visual identity adherence (palette, typography) on assets going to Cloudflare.
8. **SEO + analytics cadence.** Weekly routine pulls traffic data and surfaces anomalies. Monthly traffic report issue. Quarterly content gap analysis issue.

**Music releases**

9. **Per-track / per-release Suno tracker.** Per-track issue holds lyrics, prompt, master, cover art, distribution metadata as keyed documents. Per-track issues bundle into a per-release goal (album / EP). Operator tracks state, flags stale drafts, and assembles the artifact set at release time; does NOT compose.
10. **Royalty tracking.** When Suno releases ship under commercial-use rights, monthly royalty pull + reconciliation routine. Income classification feeds the tax-prep ledger (item 14).

**Revenue / commercial**

11. **Amazon Associates affiliate tracking.** Routine pulls Amazon Associates earnings + per-link click data when PA-API access lands (currently blocked on qualifying-sales threshold). Monthly earnings summary issue. Dead-link rotation routine (quarterly or on-demand).
12. **Gear inventory ↔ Amazon storefront sync.** `docs/av_master_inventory_2026.md` is the credibility ledger; the Amazon storefront recommendations are downstream. When PA-API access lands, routine propagates inventory changes into storefront items. Approval gate on storefront publication.
13. **Partnership / sponsor outreach pipeline.** One issue per opportunity: pitched → response → contract → live → wrap. FTC disclosure tracking on every sponsored asset (mandatory). Cost separation between sponsored and organic content for tax purposes.

**Compliance / governance / tax**

14. **Quarterly tax-prep ledger.** Issues tagged with cost classification (gear-as-business-expense / affiliate income / royalty income / sponsor income / paid-review income). Quarterly summary for tax handoff. Clean lane if Audiopheliac later folds under VAL umbrella for tax accounting; classification structure works either as solo proprietorship or under VAL.
15. **Brand-voice and visual-identity audit sweep.** Periodic (semi-annual) audit of all live public assets against the locked brand voice guidelines v2.0 and the Nashville Midnight palette. Issue per non-compliance finding with fix path.

**Lane prioritization for Operator hire:** Start with items 1 (data pipeline), 7 (brand voice gate), and 9 (Suno tracker). These are the highest-leverage routines and gates active today. Items 5, 6, and 8 (content production lane) become urgent once the website Phase 2 build kicks off. Items 11–13 (revenue / commercial) light up when PA-API access lands and as sponsorship opportunities emerge. Item 14 (tax ledger) is a steady-state cadence — set up once, run quarterly.

**Counter-argument neutralized:** The earlier framing that "Audiopheliac is solo-scope and paperclip may be overkill" was wrong. This is a multi-stream content + commerce + production operation with brand voice governance, FTC disclosure obligations, affiliate revenue audit demands, royalty tracking, and content cadence requirements. Paperclip is the right shape. The question is sequencing the rollout, not whether to adopt.

## 0.2 Prefix Decision — `THE` → `AUD` (recommended)

The `THE` prefix is server-side immutable post-creation. PATCHing `issuePrefix` after issues exist is silently ignored. The only path to change is **delete company → recreate with new auto-derived prefix**.

| Option | Trade-off |
|---|---|
| Keep `THE` | Zero migration cost. Reads as an English article ("THE-12 is blocked") which is mildly awkward. |
| **`AUD`** (recommended) | Audio-evocative, 3 chars, instantly readable. Migration cost is near-zero now (one closed baseline). |
| `TAP` | "The AudioPheliac" initials, memorable. Less serious tone. |
| `PHL` | Distinctive but cryptic without context. |

**Recommended migration playbook (when ready to act):**
1. Export the existing company state: `POST /api/companies/821ef660-0041-4ef6-a911-adb1ba038e15/export` to capture goals/projects/issues/routines as a portable bundle. (THE-1 baseline is closed and not critical, but export keeps the audit trail.)
2. Delete the existing company: `DELETE /api/companies/821ef660-0041-4ef6-a911-adb1ba038e15` (destructive, irreversible — see §4 for the route).
3. Create new company with name that derives prefix `AUD` (paperclip auto-derives prefix from company name; "Audiopheliac" → `AUD`). Verify on creation response before any other action.
4. Re-apply brand color `#7a1f2b` and any logo via `PATCH /api/companies/{newId}/branding`.
5. Update CLAUDE.md PAPERCLIP SURFACE section with the new company id and prefix; bump the "Invariant" line to reflect the new locked prefix.
6. (Optional) Replay the export via `POST /api/companies/import` if any pre-existing state is worth recovering — almost certainly NOT for the THE-1 baseline alone.

**Risk:** None significant. The destructive step (DELETE) is gated by board identity and irreversible. Confirm there are no other open issues before deletion (today: zero).

## 0.3 Reading map — which sections matter most for Audiopheliac

| Section | Why it matters here |
|---|---|
| §1 Network & Auth Fundamentals | Required for any Rafa script that talks to the local paperclip API. |
| §4 Companies | Needed for the THE → AUD migration above. |
| §5 Agents | Needed when the Operator is finally hired. |
| §7 Issues + §8 Approvals | Daily operating mechanics once any issues exist. |
| §10 Costs and Budgets | Calibrate Operator budget after first week of telemetry. |
| §11 Secrets + §27 Secrets Operational | Where Spotify/Discogs/Suno tokens belong when adopted into agent runs. |
| §13 Dashboard | Single-call SESSION-INIT health snapshot — Rafa target. |
| §14 Routines + §59 Routine Pattern Library | Build out the daily pipeline routine. The library has an Audiopheliac-specific table. |
| §18 Skills + §62 Skill Authoring | If we want to bind the existing `audiopheliac-studio-environment` Claude Code skill to the Operator's adapter. |
| §19 Adapters | Operator will run `claude_local`. |
| §22 Deployment Modes + §23 Local Development | Current state: `local_trusted` mode, `pnpm dev` from `C:\Users\gillo\paperclip\`. |
| §28 Environment Variables | Reference when wiring routines and adapters. |
| §44 Agent Instructions Bundle (SOUL/HEARTBEAT/TOOLS) | Required reading when hiring the Operator. |
| §54 Heartbeats & Routines deep-dive | Operator should be heartbeat-OFF by default; routine-driven. |
| §57 Export & Import | Required for the prefix migration above. |
| §60 GitHub PR Integration | Probably overkill for Audiopheliac; flagged but not load-bearing here. |
| §63 BYO Agent | Useful if we want to wire a custom-script Operator instead of `claude_local`. |
| §65 Backup + Restore | Nightly export routine for the Audiopheliac company itself. |

Sections heavy on VeteranIntel/VETA-specific operational detail (§35 VETA loop checklist, §47 VETA structural posture, §69 COI Hold two-layer Feedback Sharing) are retained verbatim for cross-reference but are not directly applicable to Audiopheliac work.

---

## STATUS — Startup Commands 🟢 LOCATED (both valid, different contexts)

| Item | Status | Source |
|---|---|---|
| **`npx paperclipai run`** | **VERIFIED — universal start command** | CLI Overview "Local Workflow", Setup Commands `paperclipai run`, Command Reference (verified 2026-04-27 against paperclipai 2026.325.0). Works from any cwd; no install state assumed. |
| **`pnpm dev` from `C:\Users\gillo\paperclip\`** | **VERIFIED — monorepo dev runner** | Local Development page: "the API server at `http://localhost:3100` + the UI from the API server in dev middleware mode." Idempotent for current repo+instance; manage with `pnpm dev:list` / `pnpm dev:stop`. |
| `npx paperclipai onboard --yes` | VERIFIED — one-time bootstrap | paperclip.ing/llms.txt + paperclip.ing homepage |

### Earlier verification error (acknowledged)

In an earlier message I impeached `pnpm dev` as "CLAUDE.md §32 internal only, not official" when I had only the homepage + llms.txt. The Local Development page documents `pnpm dev` verbatim as the in-monorepo start command. CLAUDE.md §32's prior `pnpm dev` reference was correct for the monorepo-clone context. The earlier dismissal was wrong — apologies for the noise.

### Canonical startup commands for VeteranIntel + cross-project use

**From the monorepo clone (Gill's setup at `C:\Users\gillo\paperclip\`):**
```powershell
cd C:\Users\gillo\paperclip
pnpm dev
```
The Local Development page documents `pnpm dev` as the monorepo dev runner. It starts the API server on port 3100 + serves the UI in dev middleware mode. Auto-uses embedded PostgreSQL if `DATABASE_URL` is unset. Idempotent — running `pnpm dev` when an existing dev-runner is alive reports the existing process rather than starting a duplicate.

Inspect/stop the managed runner:
```powershell
pnpm dev:list
pnpm dev:stop
```

**From anywhere on the machine (no cwd assumption):**
```powershell
npx paperclipai run
```
Universal form via the published `paperclipai` npm package. Works from any cwd. Auto-onboards if no config exists, runs `paperclipai doctor` with repair enabled, starts the server.

### Which to use?

| Context | Command |
|---|---|
| Working from inside `C:\Users\gillo\paperclip\` | `pnpm dev` |
| Anywhere else (or scripted from SESSION-INIT without a cwd assumption) | `npx paperclipai run` |
| Authenticated-private mode for Tailscale | `pnpm dev --tailscale-auth` (alias: `--authenticated-private`) — binds to 0.0.0.0 |

Both are documented, both work. For automated SESSION-INIT scripting where the working directory is not guaranteed, `npx paperclipai run` is the safer default.

What `run` does (verbatim from Setup Commands):
1. Resolves the active instance and config
2. Runs `paperclipai doctor` with repair enabled by default
3. Starts the server when the checks pass

**Flags for `run`:**
| Flag | Meaning |
|---|---|
| `--instance <id>` | Local instance id (default `default`) |
| `--no-repair` | Disable doctor auto-repair |
| `-c, --config <path>` | Config file override |
| `-d, --data-dir <path>` | Data dir override (default `~/.paperclip`) |

**Behavior on existing install:** Config exists → goes straight to doctor → starts server. No re-onboarding.

**Behavior on missing config:** Triggers onboard interactively in a terminal. In non-interactive shells, run `paperclipai onboard` first.

### CLAUDE.md §32 update needed (cross-product VAL CLAUDE.md too)

The `pnpm dev` reference in §32 is correct for the monorepo-clone context. Recommended cleanup: keep `pnpm dev` for the monorepo path, but also document `npx paperclipai run` as the cwd-independent alternative — useful for any SESSION-INIT automation that shouldn't assume Rafa's working directory. The `/paperclip-dev` skill should accept either; report the actual command used in its output.

---

## 1. Network & Auth Fundamentals

### Base URL
`http://localhost:3100/api` for local installs. Every endpoint is `/api`-prefixed.

### Deployment modes (only two exist)
| Mode | Behavior |
|---|---|
| `local_trusted` | Every request starts as a board actor with `source: local_implicit`. No login friction. Only valid when `server.exposure = private`. |
| `authenticated` | Login-aware. Without bearer token, server tries to resolve a web session. With bearer, treats request per token type. |

If exposed publicly, config validation also requires `auth.baseUrlMode = explicit` and `auth.publicBaseUrl` set.

### Auth resolution order (server-side)
1. No bearer + `local_trusted` → board actor (implicit local trust)
2. No bearer + `authenticated` → resolve web session → board actor if session exists
3. Bearer token → check as board API key first
4. If not board → check as agent API key
5. If not agent key → check as local agent JWT
6. Nothing matches → unauthenticated

**Bearer tokens always win over cookies.** A request with a valid bearer is never treated as a session request.

### Token types
| Token | Prefix | Use case |
|---|---|---|
| Board API key | `pcp_board_*` | CLI, automation, scripting. Created via `/api/cli-auth/challenges` flow. Hashed before storage. |
| Agent API key | (opaque) | Long-lived agent runtime. Created via `POST /api/agents/{agentId}/keys`. Returned once at creation. |
| Local agent JWT | (signed) | Short-lived. Must contain `sub` (agent id), `company_id`, `adapter_type`, `run_id`, `iat`, `exp`. |

### Run-id header
`X-Paperclip-Run-Id: <run_id>` is read on mutating requests during agent runs. Required for issue comments, checkout, and other run-linked actions. For agent JWTs, can also come from token claims.

### Why Rafa's S90 inbox-lite probe got 401
`GET /api/agents/me/inbox-lite` is an **agent-only route**. Rafa was hitting it as board (or as unauthenticated implicit board in `local_trusted`). The route doesn't accept board identity — it specifically wants an agent token. To poll an agent's inbox via Rafa, we need either:
- An agent API key for the target agent (create via `POST /api/agents/{agentId}/keys`)
- An agent JWT minted from the agent JWT secret
- Or, simply use the board route `GET /api/companies/{companyId}/issues?assigneeAgentId={agentId}` which doesn't need agent auth

---

## 2. Error Code Cheat Sheet

| Code | Means | Typical cause |
|---|---|---|
| 400 | Bad request | Validation failed (Zod), missing required field, wrong payload shape |
| 401 | Unauthorized | No valid caller identity provided |
| 403 | Forbidden | Authenticated but not allowed |
| 404 | Not found | Resource doesn't exist OR outside your company scope |
| 409 | Conflict | Resource already owned/locked/revoked, OR state prevents action |
| 422 | Unprocessable | Structurally valid but business rules reject |
| 500 | Internal server error | Unexpected failure |
| 503 | Service unavailable | Health check; DB unreachable |

**Useful distinction:** 401 = server doesn't accept the identity. 403 = identity is known but not allowed.

---

## 3. Health Check

```http
GET /api/health
```

Returns: deployment mode, deployment exposure, auth readiness, bootstrap state (in `authenticated` mode), feature flags (e.g., company deletion).

**Note:** Despite §32 of VeteranIntel CLAUDE.md saying `/api/health` doesn't exist, the official API Overview documents it. Verify against the running instance — may have been added since the §32 entry was written.

---

## 4. Companies

### Common shape
| Field | Notes |
|---|---|
| `id` | Stable UUID |
| `name` | Display name |
| `description` | Plain-text optional |
| `status` | `active` / `paused` / `archived` |
| `issuePrefix` | Auto-generated from company name. **Immutable post-create.** |
| `issueCounter` | Next issue number |
| `budgetMonthlyCents` | Company budget ceiling (cents) |
| `spentMonthlyCents` | Current month spend |
| `requireBoardApprovalForNewAgents` | Board approval gate |
| `brandColor` | Hex |
| `logoAssetId` / `logoUrl` | `logoUrl` is derived; treat as read-only |

### Routes
| Method | Path | Notes |
|---|---|---|
| GET | `/api/companies` | List (board only) |
| GET | `/api/companies/{id}` | Get one |
| POST | `/api/companies` | Create (board). If `budgetMonthlyCents > 0`, creates matching monthly budget policy in UTC. |
| PATCH | `/api/companies/{id}` | Update. CEO agents limited to branding fields. |
| PATCH | `/api/companies/{id}/branding` | Branding-only narrower update. CEO can call for own company. |
| POST | `/api/companies/{id}/logo` | Multipart upload. Returns assetId; you still have to PATCH it into `logoAssetId`. |
| GET | `/api/companies/stats` | `{agentCount, issueCount}` keyed by company id |
| POST | `/api/companies/{id}/archive` | Status → `archived` |
| DELETE | `/api/companies/{id}` | **Destructive — irreversible** |
| POST | `/api/companies/{id}/export` | Bundle export |
| POST | `/api/companies/{id}/exports/preview` | Preview (board or CEO) |
| POST | `/api/companies/import` | Board-only top-level import |
| POST | `/api/companies/{id}/imports/preview` | Same-company preview (board or CEO) |
| POST | `/api/companies/{id}/imports/apply` | Same-company apply. **Rejects `replace` collision strategy.** |
| GET | `/api/companies/{id}/feedback-traces` | Board-only feedback inspection |

### Logo upload notes
Accepted types: `image/png`, `image/jpeg`, `image/jpg`, `image/webp`, `image/gif`, `image/svg+xml`. SVG sanitized (scripts/external links stripped). Logo upload + company attach are two separate steps.

---

## 5. Agents

### Common fields
| Field | Notes |
|---|---|
| `name` | Display name. Server derives company-unique URL key (shortname). |
| `role` | Enum: `ceo`, `cto`, `cmo`, `cfo`, `security`, `engineer`, `designer`, `pm`, `qa`, `devops`, `researcher`, `general` |
| `title` | Optional display title |
| `reportsTo` | Parent agent. **Same company only.** Cannot create cycle. |
| `adapterType` | `process`, `http`, `claude_local`, `codex_local`, `gemini_local`, `opencode_local`, `pi_local`, `hermes_local`, `cursor`, `openclaw_gateway` (+ external adapters) |
| `adapterConfig` | Adapter-specific. `env` accepts secret references. |
| `runtimeConfig` | `heartbeat.enabled` **defaults to `false` on create** |
| `budgetMonthlyCents` | Monthly budget. If `> 0` on create, auto-creates budget policy. |
| `status` | `active` / `paused` / `idle` / `running` / `error` / `pending_approval` / `terminated` |
| `permissions` | `canCreateAgents`. **NOT accepted on the main PATCH route — use `/permissions` route.** |

### Lifecycle routes
| Method | Path | Notes |
|---|---|---|
| GET | `/api/companies/{id}/agents` | List (terminated hidden) |
| GET | `/api/agents/{id}` | One agent. Accepts UUID or shortname (requires `?companyId=` if shortname). |
| GET | `/api/agents/me` | **Agent-only.** Self-record. |
| GET | `/api/agents/me/inbox-lite` | **Agent-only.** Compact assignment list for heartbeat startup. Returns `id`, `identifier`, `title`, `status`, `priority`, `projectId`, `goalId`, `parentId`, `updatedAt`, `activeRun`, `dependencyReady`, `unresolvedBlockerCount`, `unresolvedBlockerIssueIds`. |
| POST | `/api/companies/{id}/agents` | Direct create (board-only). Status → `idle`. |
| POST | `/api/companies/{id}/agent-hires` | **Approval-aware hire flow.** Use this when company requires board approval. Accepts `sourceIssueId`/`sourceIssueIds`. Creates `pending_approval` + approval record. |
| PATCH | `/api/agents/{id}` | Update. Does NOT accept `permissions`. `replaceAdapterConfig: true` switches from merge to replace. |
| PATCH | `/api/agents/{id}/permissions` | Permission edits. Board OR company CEO agent. |
| POST | `/api/agents/{id}/pause` | Pause (fails if terminated) |
| POST | `/api/agents/{id}/resume` | Resume (fails if terminated OR pending_approval) |
| POST | `/api/agents/{id}/terminate` | Terminate. **Revokes all API keys.** |
| DELETE | `/api/agents/{id}` | Hard delete + cleanup of runs, sessions, wakeups, key material |

### Manual wake / heartbeat
| Method | Path | Notes |
|---|---|---|
| POST | `/api/agents/{id}/wakeup` | Rich payload. Returns 202. May return skipped reason. |
| POST | `/api/agents/{id}/heartbeat/invoke` | Simple manual tick. Returns 202. |

**Wakeup payload fields:** `source` (`timer`/`assignment`/`on_demand`/`automation`), `triggerDetail` (`manual`/`ping`/`callback`/`system`), `reason`, `payload`, `idempotencyKey`, `forceFreshSession`.

**Common skipped reasons:** `wakeup_skipped`, `issue_execution_deferred`, `heartbeat.disabled`, `heartbeat.wakeOnDemand.disabled`, `budget.blocked`.

### API keys
| Method | Path |
|---|---|
| GET | `/api/agents/{id}/keys` |
| POST | `/api/agents/{id}/keys` (token shown **once** at create) |
| DELETE | `/api/agents/{id}/keys/{keyId}` |

**Cannot create keys for `pending_approval` or `terminated` agents** (returns 409).

### Skills
| Method | Path | Notes |
|---|---|---|
| GET | `/api/agents/{id}/skills` | Inspect attached skills |
| POST | `/api/agents/{id}/skills/sync` | Reconcile to match `desiredSkills` array (UUID / canonical key / slug). Adds missing, removes extras. |

Skills must already be installed at company level (`POST /api/companies/{id}/skills/import`). Skill sync at hire time is supported via `desiredSkills` field on create.

### Config & revisions
| Method | Path |
|---|---|
| GET | `/api/agents/{id}/configuration` |
| GET | `/api/agents/{id}/config-revisions` |
| GET | `/api/agents/{id}/config-revisions/{rev}` |
| POST | `/api/agents/{id}/config-revisions/{rev}/rollback` |
| GET | `/api/companies/{id}/agent-configurations` |

Rollbacks can fail if target revision has redacted secrets.

### Instructions bundle (file-based prompts)
| Method | Path |
|---|---|
| PATCH | `/api/agents/{id}/instructions-path` |
| GET / PATCH | `/api/agents/{id}/instructions-bundle` |
| GET / PUT / DELETE | `/api/agents/{id}/instructions-bundle/file` |

Relative instructions paths require `adapterConfig.cwd`.

### Org chart
| Method | Path |
|---|---|
| GET | `/api/companies/{id}/org` |
| GET | `/api/companies/{id}/org.svg` |
| GET | `/api/companies/{id}/org.png` |

Terminated agents excluded from org responses.

### Adapter helpers (pre-create validation)
| Method | Path | Notes |
|---|---|---|
| GET | `/api/companies/{id}/adapters/{type}/models` | List supported models |
| GET | `/api/companies/{id}/adapters/{type}/detect-model` | Auto-detect recommended |
| POST | `/api/companies/{id}/adapters/{type}/test-environment` | Validate adapter config; resolves secrets first |

### Common edge cases — cite these in Rafa prompts
- Agent shortname lookup without company context → **422**
- Shortname collision → **409** (name + numeric suffix on dedup if you create)
- `PATCH /api/agents/{id}` with `permissions` body → **422** (use dedicated route)
- Create key for terminated/pending_approval agent → **409**
- Pause/resume terminated agent → fails
- Wakeup accepted (202) does NOT mean enqueued — check skipped reason

---

## 6. Cross-Project Operational Notes

### When to use which auth identity
- **Sully/Rafa session operations** (read tickets, check status, post comments) → board identity is fine. `local_trusted` mode makes this implicit.
- **Agent self-introspection** (`/me`, `/me/inbox-lite`, agent-issued runs) → must be agent-authenticated. Need an agent API key per target agent.
- **Mutating actions during a run** (comment from an executing agent) → include `X-Paperclip-Run-Id`.

### Company-scope traps
Every meaningful route is company-scoped. If you hit a route with the wrong company, expect **403** (caller known but not allowed) or **404** (resource not visible). The `assertCompanyAccess` guard runs after auth resolves.

### Cross-company anti-patterns (confirmed S89 cutover, see CLAUDE.md §32)
- `issuePrefix` PATCH on company → silent no-op
- Cross-company project `companyId` PATCH → silent no-op
- Cross-company `reportsTo` → **422** (chainOfCommand is strictly within-company)
- Cross-company agent assignment to issue → **untested as of S90, probe pending via Rafa**

### Status enum reference (issues)
Used in `inbox-lite` and filter queries: `todo`, `in_progress`, `in_review`, `done`, `blocked`, `cancelled`, `backlog`

---

## 7. Issues

### Path semantics
- `{issueId}` accepts **either UUID or human identifier** (e.g., `PAP-39`, `VET-104`, `VETA-1`). Server resolves before handling.
- List + create are company-scoped (`/api/companies/{id}/issues`). Single-issue ops use `/api/issues/{id}`.
- Attachments: upload company-scoped; download via `/api/attachments/{attachmentId}/content`.

### List filters (most useful)
| Param | Notes |
|---|---|
| `status` | One or comma-separated list |
| `assigneeAgentId` | Filter by assigned agent |
| `participantAgentId` | Issues agent created/assigned to/commented on |
| `assigneeUserId` / `touchedByUserId` / `inboxArchivedByUserId` / `unreadForUserId` | `me` works only with board auth |
| `projectId`, `executionWorkspaceId`, `parentId`, `labelId` | Standard filters |
| `originKind` / `originId` | `manual`, `routine_execution`, etc. |
| `includeRoutineExecutions` | **Defaults `false`** — opt-in to see routine-spawned issues |
| `q` | Full-text across title/identifier/description/comments |
| `limit` | Positive int cap |

### Issue detail returns (`GET /api/issues/{id}`)
Plus these related fields: `project`, `goal` (precedence: own → project → company default), `ancestors`, `blockedBy`, `blocks`, `planDocument`, `documentSummaries`, `legacyPlanDocument` (from old `<plan>...</plan>` description blocks), `mentionedProjects`, `currentExecutionWorkspace`, `workProducts`.

### Heartbeat context (compact wake payload)
`GET /api/issues/{id}/heartbeat-context` — reduced issue summary, ancestors, project/goal summaries, comment cursor, optional `wakeComment`, attachment summaries. Use this in agent wake flows instead of full issue detail.

### Critical: how to claim work
**DO NOT** `PATCH status: "in_progress"` to claim a task — race-prone, skips checkout, leaves `checkoutRunId` empty.

**DO** use `POST /api/issues/{id}/checkout` with body:
```json
{
  "agentId": "<agent uuid>",
  "expectedStatuses": ["todo", "backlog", "blocked", "in_review"]
}
```
Plus `X-Paperclip-Run-Id` header. Atomic. Returns 409 if owned by another agent — **do not retry**, pick a different issue. Reclaim after a crashed run by including `in_progress` in `expectedStatuses` + new run id.

### Release (give the task back)
`POST /api/issues/{id}/release` — clears `assigneeAgentId` + `checkoutRunId`, sets `todo`. Preserves `assigneeUserId`. Board can release without ownership; agents must own the checkout run.

### Update + comment in one request
`PATCH /api/issues/{id}` with optional `comment`, `reopen`, `interrupt`, `hiddenAt` fields:
- `reopen: true` + comment on `done`/`cancelled` → reopens to `todo`
- `interrupt: true` — board-only; cancels active run
- `hiddenAt` — hides from list responses without changing status

### Blockers (`blockedByIssueIds`)
First-class link, NOT free-text. Array replaces existing set on each update. Server validates same-company, no self-block, no cycles. When all blockers reach `done`, dependent gets `issue_blockers_resolved` wake. **`cancelled` blockers do NOT count as resolved** — remove explicitly to unblock.

### Comments + mentions
- `POST /api/issues/{id}/comments` body `{body, reopen?, interrupt?}`
- `@AgentName` in body (case-insensitive, exact match) triggers wakeup
- **Don't overuse mentions** — each one costs a budget-consuming heartbeat
- **Don't use mentions for assignment** — assign or create a task
- Mentions also work inside `comment` field of `PATCH /api/issues/{id}`

### Documents (keyed markdown artifacts)
- `PUT /api/issues/{id}/documents/{key}` — `key` must be lowercase + `[0-9_-]`; format is `markdown`; body up to 512 KiB
- `baseRevisionId` required on update (stale → 409). Omit on first create.
- Common keys: `plan`, `design`, `notes`. `planDocument` is surfaced on the issue detail response.
- Revision history at `/revisions`; restore via `/revisions/{revId}/restore` (creates new revision, doesn't overwrite history)
- Delete is board-only

### Interactions (structured prompts → board)
| Kind | Use for |
|---|---|
| `suggest_tasks` | Agent proposes next-task subset; board picks which to spin up |
| `ask_user_questions` | Structured questions (multi-choice, short text) |
| `request_confirmation` | Plan/destructive-action acceptance gate |

- `POST /api/issues/{id}/interactions` — body has `kind`, `payload`, optional `idempotencyKey`, `continuationPolicy` (`wake_assignee` / `wake_requester`)
- For plan-approval: update `plan` document → create `request_confirmation` with `idempotencyKey: "confirmation:{issueId}:plan:{revisionId}"` → wait for `accept`
- Decisions: `/accept` / `/reject` / `/respond` — after terminal action, sealed

### Issue lifecycle — state machine
| Status | Terminal? | Notes |
|---|---|---|
| `backlog` | No | Parked, unscheduled. Excluded from default inbox queries. |
| `todo` | No | Ready and actionable. |
| `in_progress` | No | Checked out by an agent. **Exclusive — one agent at a time.** |
| `in_review` | No | Paused for reviewer/approver/board feedback. Has `executionState` with `currentParticipant`. |
| `blocked` | No | Paired with explanation or `blockedByIssueIds`. |
| `done` | **Yes** | Sets `completedAt`. Wakes blocker-dependents + parent if all children terminal. |
| `cancelled` | **Yes** | Sets `cancelledAt`. Does **not** unblock dependents. |

### Allowed transitions
| From | To | Trigger |
|---|---|---|
| `backlog` | `todo` | Manual scheduling |
| `todo` | `in_progress` | `POST /checkout` |
| `in_progress` | `in_review` / `done` / `blocked` / `todo` | PATCH status / release |
| `in_review` | `in_progress` / `done` | Stage `currentParticipant` advances or requests changes |
| `blocked` | `todo` | Manual or auto-wake on blocker resolution |
| any non-terminal | `cancelled` | PATCH status |
| `done` / `cancelled` | `todo` | `PATCH reopen: true` (only way out of terminal) |

### Auto side effects
- `→ in_progress`: sets `startedAt`, records `checkoutRunId`
- `→ done`: sets `completedAt`, fires `issue_blockers_resolved` for dependents, fires `issue_children_completed` for parent if all children terminal
- `→ cancelled`: sets `cancelledAt`
- `release`: clears `assigneeAgentId` + `checkoutRunId`, sets `todo`

### Review stages (`executionState`)
When `in_review` under execution policy, `executionState` carries `currentStageType`, `currentParticipant`, `returnAssignee`, `lastDecisionOutcome`. Only the current participant can advance/reject — others get **422**.

---

## 8. Approvals

### Types
| Type | Trigger |
|---|---|
| `hire_agent` | New agent or pending-agent activation needs board review |
| `approve_ceo_strategy` | CEO has proposed strategy and needs sign-off before executing |
| `budget_override_required` | Budget action needs board intervention |
| `request_board_approval` | General agent ask for board sign-off |

### Routes
| Method | Path | Notes |
|---|---|---|
| GET | `/api/companies/{id}/approvals` | List, optional `?status=pending|revision_requested|approved|rejected` |
| GET | `/api/approvals/{id}` | One approval; payload may be redacted |
| POST | `/api/companies/{id}/approvals` | Create. Body: `type`, `payload`, `requestedByAgentId?`, `issueIds?`. Server fills company/requestor/`pending` status. |
| GET | `/api/approvals/{id}/issues` | Linked issues |
| POST | `/api/approvals/{id}/approve` | **Board-only.** Works on `pending` or `revision_requested`. |
| POST | `/api/approvals/{id}/reject` | **Board-only.** Same states. |
| POST | `/api/approvals/{id}/request-revision` | **Board-only.** Only on `pending`. Body: `decisionNote`. |
| POST | `/api/approvals/{id}/resubmit` | Requester agent OR board. Only on `revision_requested`. Body: optional `payload` (replaces existing). |
| GET / POST | `/api/approvals/{id}/comments` | Lightweight review thread |

### `request_board_approval` payload shape
```json
{
  "title": "One-line headline",
  "summary": "One short paragraph of context",
  "recommendedAction": "One sentence: what should happen if approved",
  "risks": ["…"]
}
```
On resolution, requesting agent is woken with `PAPERCLIP_APPROVAL_ID` + `PAPERCLIP_APPROVAL_STATUS` env vars so it can react in next heartbeat.

### Lifecycle
```
pending → approved
       → rejected
       → revision_requested → pending
```

### Side effects on approve
- `hire_agent`: pending agent activated OR new agent created from payload; **monthly budget policy auto-created if payload has positive budget**; requesting agent woken
- `hire_agent` rejected: if approval points at a draft agent, that agent is **terminated**

---

## 9. Goals and Projects

### Goal model
| Field | Notes |
|---|---|
| `title` | Required |
| `description` | Optional |
| `level` | `company` / `team` / `agent` / `task`. Defaults `task`. |
| `status` | `planned` / `active` / `achieved` / `cancelled`. Defaults `planned`. |
| `parentId` | Hierarchy |
| `ownerAgentId` | Owner link |

Routes: `GET /api/companies/{id}/goals`, `GET /api/goals/{id}`, `POST /api/companies/{id}/goals`, `PATCH /api/goals/{id}` (partial), `DELETE /api/goals/{id}`.

### Project model
| Field | Notes |
|---|---|
| `name` | Required. Server derives unique URL key (shortname). |
| `description` | Optional |
| `status` | `backlog` / `planned` / `in_progress` / `completed` / `cancelled`. Defaults `backlog`. |
| `leadAgentId` | Optional |
| `targetDate` | Optional ISO |
| `goalIds` | **Preferred.** Array of linked goals. |
| `goalId` | Legacy. Server keeps in sync with first `goalIds`. |
| `color` | Auto-assigned from palette if omitted |
| `workspace` | Optional. Seeds first workspace in same create request. |
| `env` | Project env binding config; secret refs normalized |
| `executionWorkspacePolicy` | Advanced runtime policy |
| `archivedAt` | Set to archive |

Returned fields include `urlKey`, `goals`, `codebase`, `workspaces`, `primaryWorkspace`, `executionWorkspacePolicy`.

Routes follow same pattern. `GET /api/projects/{id}` accepts UUID or unique shortname (ambiguous shortname → **409**).

### Project workspaces
Source types: `local_path`, `git_repo`, `remote_managed`, `non_git_path`.

Rules:
- Must include at least one of `cwd` or `repoUrl`
- `remote_managed` requires `remoteWorkspaceRef` or `repoUrl`
- First workspace becomes primary automatically
- `isPrimary: true` makes it primary
- Removing primary auto-promotes another

Routes:
| Method | Path |
|---|---|
| GET | `/api/projects/{id}/workspaces` |
| POST | `/api/projects/{id}/workspaces` |
| PATCH | `/api/projects/{id}/workspaces/{wsId}` |
| DELETE | `/api/projects/{id}/workspaces/{wsId}` |
| POST | `/api/projects/{id}/workspaces/{wsId}/runtime-services/{start\|stop\|restart}` |

Runtime services need workspace `cwd` + runtime config. Updates workspace `desiredState`.

---

## 10. Costs and Budgets

### Reporting spend
`POST /api/companies/{id}/cost-events`

Required: `agentId`, `provider`, `model`, `costCents`, `occurredAt` (ISO).
Optional: `issueId`, `projectId`, `goalId`, `heartbeatRunId`, `billingCode`, `biller` (defaults to `provider`), `billingType` (`metered_api` / `subscription_included` / `subscription_overage` / `credits` / `fixed` / `unknown` — defaults `unknown`), `inputTokens`, `cachedInputTokens`, `outputTokens`.

Rules: agent must belong to company. Board can report any agent. Agent auth limited to self. On accept: stores event → recalcs `spentMonthlyCents` for agent + company → evaluates budget policies → writes activity log.

### Read spend
| Endpoint | For |
|---|---|
| `GET /api/companies/{id}/costs/summary?from=&to=` | Total + budget + utilization%. Omit `from`/`to` for all-time. |
| `GET /api/companies/{id}/costs/by-agent` | Who's expensive overall |
| `GET /api/companies/{id}/costs/by-agent-model` | Specific agent+model combos burning tokens |
| `GET /api/companies/{id}/costs/by-provider` | Anthropic vs OpenAI vs ... |
| `GET /api/companies/{id}/costs/by-biller` | When provider ≠ billable entity |
| `GET /api/companies/{id}/costs/by-project` | Cost back to project work |
| `GET /api/companies/{id}/costs/window-spend` | Rolling 5h / 24h / 7d — spot spikes |

### Budget controls

**⚠️ CORRECTION to my S90 Rafa prompt** — VETA budget setup uses these endpoints/fields:

```
PATCH /api/companies/{id}/budgets    body: { "budgetMonthlyCents": 100000 }
PATCH /api/agents/{id}/budgets       body: { "budgetMonthlyCents": 8000 }
```

The single `budgetMonthlyCents` is the **hard cap**. The "soft warn" lives on the policy as `warnPercent` (default 80). For Gill's $40 soft / $80 hard convention:
- `budgetMonthlyCents: 8000` → hard cap $80
- `warnPercent: 50` → warns at 50% = $40
- Update policy via `POST /api/companies/{id}/budgets/policies`

My earlier prompt's `budgetSoftMonthly`/`budgetHardMonthly` field names do NOT exist on the agent endpoint. Use the structure above instead.

### Policy upsert
`POST /api/companies/{id}/budgets/policies`

Defaults:
- `metric: billed_cents`
- `windowKind: calendar_month_utc` (company/agent) / `lifetime` (project)
- `warnPercent: 80`
- `hardStopEnabled: true`
- `notifyEnabled: true`
- `isActive: true`

### Budget overview
`GET /api/companies/{id}/budgets/overview` — current policies, active incidents, paused agent/project counts, pending approval count.

### Incident resolution
`POST /api/companies/{id}/budget-incidents/{id}/resolve` — actions: `keep_paused` OR `raise_budget_and_resume` (requires new `amount` > observed spend).

### Threshold behavior
- Warn threshold + notifications enabled → creates soft incident
- 100% + hard-stop enabled → creates hard incident, **pauses scope, cancels work for that scope**
- Window resets on first of month UTC
- Project policies default to `lifetime` window

### Finance events (non-token accounting)
- `POST /api/companies/{id}/finance-events` — **board-only**
- Kinds: `inference_charge`, `platform_fee`, `credit_purchase`, `credit_refund`, `manual_adjustment`
- Fields: `direction`, `amountCents`, `currency`, `estimated`, metadata
- Reads: `/costs/finance-summary`, `/costs/finance-by-biller`, `/costs/finance-by-kind`, `/costs/finance-events`

### Practical reading order for spend analysis
1. `/costs/summary` 2. `/costs/by-agent` 3. `/costs/by-project` 4. `/budgets/overview` 5. `/costs/window-spend`

---

## 11. Secrets

**Board-only, company-scoped.** Two-layer storage: `company_secrets` (metadata + latest version pointer) + `company_secret_versions` (versioned material).

### Default provider
`local_encrypted` — AES-GCM at rest with local master key; SHA-256 hash of original kept for verification.

### Routes
| Method | Path | Notes |
|---|---|---|
| GET | `/api/companies/{id}/secret-providers` | List available providers in deployment |
| GET | `/api/companies/{id}/secrets` | List (metadata only — never returns plaintext) |
| POST | `/api/companies/{id}/secrets` | Create. Body: `name` (unique in company), `value`, `provider?`, `description?`, `externalRef?`. Creates version 1, sets `latestVersion: 1`. |
| PATCH | `/api/secrets/{id}` | **Metadata only** — `name`, `description`, `externalRef`. Does NOT change value. |
| POST | `/api/secrets/{id}/rotate` | Body: `value` (new), `externalRef?`. Creates new version, advances `latestVersion`. Same ID. |
| DELETE | `/api/secrets/{id}` | Hard delete + cascade versions. Future runtime resolution fails. |

### Versioning rules
- Create → version 1
- Rotate → new version, old versions retained as history
- `"latest"` references auto-pick up rotations
- Numeric version stays pinned to historical value

### Secret refs in agent config
```json
{
  "env": {
    "ANTHROPIC_API_KEY": {
      "type": "secret_ref",
      "secretId": "<uuid>",
      "version": "latest"
    }
  }
}
```
- Numeric `version: 2` pins to that version
- Omitted `version` → treated as `"latest"`
- Server validates same-company, resolves version, decrypts, injects into agent process env
- Inline plaintext still accepted for backward compat — secret refs preferred

---

## 12. Activity (Audit Trail)

**Append-only.** Each row stores: `companyId`, `actorType` (`agent`/`user`/`system`), `actorId`, `action`, `entityType`, `entityId`, optional `agentId`, optional `runId`, optional `details` (JSON, may be redacted by instance log settings), `createdAt`.

### Routes
| Method | Path | Notes |
|---|---|---|
| GET | `/api/companies/{id}/activity` | Newest first. **No pagination.** Filters: `agentId`, `entityType`, `entityId` (exact match, no fuzzy). Hidden issues filtered out of feed. |
| POST | `/api/companies/{id}/activity` | **Board-only.** Manual entry — most routes write activity automatically. |
| GET | `/api/issues/{id}/activity` | Per-issue history. Accepts UUID or `VET-104`-style. |
| GET | `/api/issues/{id}/runs` | Heartbeat runs that touched the issue. Returns `runId`, `status`, `agentId`, `adapterType`, `startedAt`, `finishedAt`, `invocationSource`, `usageJson`, `resultJson`, `logBytes`. |
| GET | `/api/heartbeat-runs/{runId}/issues` | Issues associated with a run. Empty array if run missing. Compact summary only. |

**Investigation hierarchy:** company activity → narrow with `entityType=issue` → switch to per-issue activity → trace `runs` to find heartbeats → cross to other issues that run touched. Activity is the audit trail; runs is the heartbeat lens.

---

## 13. Dashboard — SINGLE-CALL HEALTH SNAPSHOT

**This is the SESSION-INIT primitive.** One call replaces multiple probes for company status.

```
GET /api/companies/{companyId}/dashboard
```

Read-only, company-scoped. Returns:

```json
{
  "companyId": "...",
  "agents": { "active": 4, "running": 1, "paused": 0, "error": 0 },
  "tasks": { "open": 12, "inProgress": 3, "blocked": 2, "done": 8 },
  "costs": { "monthSpendCents": 18450, "monthBudgetCents": 50000, "monthUtilizationPercent": 36.9 },
  "pendingApprovals": 2,
  "budgets": { "activeIncidents": 1, "pendingApprovals": 1, "pausedAgents": 1, "pausedProjects": 0 }
}
```

### Bucket semantics
- `agents.active` — operational + idle (idle folded in)
- `agents.running` — executing a heartbeat NOW
- `agents.paused` — intentionally paused (including budget pauses, separately surfaced)
- `agents.error` — last run failed or stuck in error state
- `tasks.open` — every non-terminal (backlog + todo + in_progress + in_review + blocked)
- `tasks.inProgress` / `tasks.blocked` / `tasks.done` — individual status counts
- `costs.month*` — current UTC month
- `pendingApprovals` — across the company, status `pending`
- `budgets.activeIncidents` — open budget incidents
- `budgets.pendingApprovals` — budget incidents needing approval
- `budgets.pausedAgents` / `budgets.pausedProjects` — paused by budget enforcement

### Use at SESSION-INIT (recommended Rafa pattern)
Replaces the prior multi-call probe:

```powershell
# Single call per company
Invoke-RestMethod -Uri 'http://localhost:3100/api/companies/9867b6c7-5c6e-47bd-bfeb-aedb74131f37/dashboard' -Method GET
Invoke-RestMethod -Uri 'http://localhost:3100/api/companies/<VAL-id>/dashboard' -Method GET
```

If dashboard returns 200 → paperclip is live and reachable. The response tells you in one shot: agent health, task backlog, budget state, pending approvals. **This is what Sully should fold into the SESSION-INIT status block.**

---

## 14. Routines (Recurring Execution Layer)

A routine ties together: assigned agent, project/goal/parent-issue context, title + description template, one or more triggers, concurrency policy, catch-up policy. **A routine does NOT do the work itself** — it creates a run, and the run usually creates/links an execution issue.

### Status values
| Status | Meaning |
|---|---|
| `active` | Can fire and create runs. **Requires an assignee.** |
| `paused` | Stored but does not auto-fire. |
| `archived` | Retired. Never fires. |

API normalizes `active` to `paused` if you try to enable without an assignee.

### Concurrency + catch-up policies
- `concurrencyPolicy` default: `coalesce_if_active`. Also `always_enqueue`, `skip`-type behaviors based on state.
- `catchUpPolicy` default: `skip_missed`.

### Trigger kinds
| Kind | Notes |
|---|---|
| `schedule` | Cron + timezone. Server validates cron, computes `nextRunAt` in tz. Requires resolvable variables. |
| `webhook` | Public URL + secret. Signing modes: `bearer` (default), `hmac_sha256`, `github_hmac`, `none`. Replay window 30-86400s for HMAC (default 300). |
| `api` | No public URL. Fired via routine-run endpoint only. |

### Routes
| Method | Path | Notes |
|---|---|---|
| GET | `/api/companies/{id}/routines` | List, newest-update first. Includes trigger summaries + latest run + active execution issue. |
| GET | `/api/routines/{id}` | Detail with project/agent/parent/triggers/recent runs/active issue. |
| POST | `/api/companies/{id}/routines` | Create. Agents can only create routines assigned to themselves. |
| PATCH | `/api/routines/{id}` | Update. Agents can only update own routines; cannot reassign. |
| POST | `/api/routines/{id}/triggers` | Add trigger. Webhook responses include `webhookUrl` + `webhookSecret` (one-time-show). |
| PATCH | `/api/routine-triggers/{id}` | Update trigger fields. |
| DELETE | `/api/routine-triggers/{id}` | Delete trigger. |
| POST | `/api/routine-triggers/{id}/rotate-secret` | Webhook only. Same URL, new secret. |
| POST | `/api/routines/{id}/run` | **Manual fire.** Body: `source` (default `manual`, also `api`), optional `triggerId`, `payload`, `variables`, `projectId`, `assigneeAgentId`, `idempotencyKey`, workspace fields. Returns 202. Obeys concurrency policy. |
| POST | `/api/routine-triggers/public/{publicId}/fire` | **Public webhook trigger.** External systems hit this. Server checks publicId, enabled state, routine active, signing mode. |
| GET | `/api/routines/{id}/runs?limit=50` | Run history. Default 50, max 200. |

### Public webhook signing modes (request headers)
- `bearer`: `Authorization: Bearer <secret>`
- `hmac_sha256`: `X-Paperclip-Signature` or `X-Hub-Signature-256`
- `github_hmac`: `X-Hub-Signature-256` or `X-Paperclip-Signature` + `X-Paperclip-Timestamp`
- `none`: no signature

### Routine run statuses
| Status | Meaning |
|---|---|
| `received` | Accepted, being processed |
| `coalesced` | Linked to existing live execution |
| `skipped` | Skipped because concurrency policy + active execution |
| `issue_created` | New execution issue created |
| `completed` | Execution issue reached `done` |
| `failed` | Execution issue failed/cancelled, or dispatch failed |

### Project relevance — routines as the SESSION-INIT awakening mechanism

The user's stated goal — *"paperclips agents are awakened as part of standard session start protocols"* — has a clean implementation path now:

**Option A — manual run at session-open:** Sully drafts a Rafa prompt that POSTs to `/api/routines/{id}/run` for each routine that should fire at session-start. Returns 202; obeys concurrency policy. Use `idempotencyKey: "session-start-S{N}"` to prevent dupes.

**Option B — `api` trigger per agent:** Create one routine per agent with an `api` trigger. SESSION-INIT fires them all via routine-run endpoint. Routines handle the execution-issue creation.

**Option C — `heartbeat/invoke` on demand:** Already in §5. Doesn't go through a routine, just kicks the agent's heartbeat. Lighter weight, no execution-issue auto-create.

For "wake VETA Backend + Frontend at SESSION-INIT," Option C is simplest. For "every Monday morning run the weekly briefing," Option A with a `schedule` trigger is cleaner.

---

## 15. CLI Commands

The Paperclip CLI is split into two layers — setup commands operate on the local install; client commands operate against the running control plane. Use `paperclipai`, `npx paperclipai`, or `pnpm paperclipai` interchangeably.

### Setup commands (no server needed)
| Command | Purpose |
|---|---|
| **`paperclipai run`** | **THE start command.** Bootstrap-if-missing + doctor + start server. |
| `paperclipai onboard` | First-time setup wizard. `--yes` for non-interactive defaults; `--run` to start after onboarding. |
| `paperclipai doctor [--repair] [--yes]` | Health checks. `--repair` writes local files; `--yes` skips confirmation. |
| `paperclipai env` | Print resolved environment config (after defaults + overrides merged). |
| `paperclipai configure --section <name>` | Update one config section. Sections: `llm`, `database`, `logging`, `server`, `storage`, `secrets`. |
| `paperclipai db:backup [--dir <path>] [--retention-days <n>]` | One-off DB backup. |
| `paperclipai allowed-hostname <host>` | Whitelist hostname for authenticated/private mode (server restart required). |

### Client commands — companies
| Command | Purpose |
|---|---|
| `paperclipai company list` | List accessible companies |
| `paperclipai company get <id>` | Get one |
| `paperclipai company export <id> --out <dir> --include company,agents[,projects,issues,tasks,skills]` | Portable markdown export |
| `paperclipai company import <pathOrUrl> --target new\|existing [-C <id>] [--new-company-name <name>] [--collision rename\|skip\|replace] [--ref <git-ref>] [--dry-run]` | Portable import. Supports local path, URL, or GitHub repo. |
| `paperclipai company delete <selector> --by auto\|id\|prefix --yes --confirm <selector>` | **Destructive.** Requires exact confirmation value. |

### Client commands — issues
| Command | Purpose |
|---|---|
| `paperclipai issue list -C <company-id> [--status csv] [--assignee-agent-id <id>] [--project-id <id>] [--match <text>]` | List + filter |
| `paperclipai issue get <id-or-identifier>` | Detail. Accepts UUID OR `VET-104`-style. |
| `paperclipai issue create -C <id> --title "..." [--description "..."] [--status x] [--priority x] [--assignee-agent-id <id>] [--project-id <id>]` | Create |
| `paperclipai issue update <id> [--status x] [--comment "..."] [--hidden-at iso8601\|null]` | Update + optional comment in one call |
| `paperclipai issue comment <id> --body "..." [--reopen]` | Comment, optional reopen |
| `paperclipai issue checkout <id> --agent-id <agent-id> [--expected-statuses csv]` | Atomic claim |
| `paperclipai issue release <id>` | Release back to `todo`, clear assignee |

### Client commands — agents
| Command | Purpose |
|---|---|
| `paperclipai agent list -C <company-id>` | List |
| `paperclipai agent get <id>` | Detail |
| `paperclipai agent local-cli <agentRef> -C <company-id> [--key-name <label>] [--no-install-skills]` | **Sets up agent identity for running Claude/Codex as a Paperclip agent.** Creates a long-lived API key, installs Paperclip skills into `~/.codex/skills` + `~/.claude/skills`, prints `export PAPERCLIP_API_URL=…` block. Pipe to `eval` to use immediately. |

### Client commands — approvals
| Command | Purpose |
|---|---|
| `paperclipai approval list -C <company-id> [--status pending\|approved\|rejected\|revision_requested]` | List |
| `paperclipai approval get <id>` | Detail |
| `paperclipai approval create -C <id> --type <type> --payload '{...}' [--requested-by-agent-id <id>] [--issue-ids csv]` | Create |
| `paperclipai approval approve <id> --decision-note "..."` | Approve |
| `paperclipai approval reject <id> --decision-note "..."` | Reject |
| `paperclipai approval request-revision <id> --decision-note "..."` | Send back for revision |
| `paperclipai approval resubmit <id> [--payload '{...}']` | Resubmit revision-requested |
| `paperclipai approval comment <id> --body "..."` | Comment thread |

### Client commands — observability
| Command | Purpose |
|---|---|
| `paperclipai activity list -C <id> [--agent-id <id>] [--entity-type <type>] [--entity-id <id>]` | Audit trail |
| `paperclipai dashboard get -C <id>` | **The single-call SESSION-INIT primitive.** Wraps GET `/dashboard`. |
| `paperclipai heartbeat run --agent-id <id> [--source on_demand\|timer\|assignment\|automation] [--trigger manual\|ping\|callback\|system] [--timeout-ms <ms>] [--debug]` | **Manually invoke an agent.** Streams live logs. Use for SESSION-INIT awakening or debugging. |

### Client commands — context profiles
| Command | Purpose |
|---|---|
| `paperclipai context show` | Display current profile |
| `paperclipai context list` | List profiles |
| `paperclipai context use <profile>` | Set active profile |
| `paperclipai context set [--profile <name>] [--api-base <url>] [--company-id <id>] [--api-key-env-var-name <ENVVAR>] [--use]` | Configure profile |

Context profile defaults stored in `~/.paperclip/context.json`. The recommended pattern is to NOT inline API keys — set `--api-key-env-var-name PAPERCLIP_API_KEY` and export the value separately.

### Client commands — worktrees (multi-instance isolation)
| Command | Purpose |
|---|---|
| `paperclipai worktree init [--name <n>] [--instance <id>] [--from-instance <src>] [--server-port <p>] [--db-port <p>]` | Repo-local config + isolated instance |
| `paperclipai worktree env [--json]` | Print shell exports for worktree-local instance |
| `paperclipai worktree:make <name> [--start-point <ref>] [--seed-mode minimal\|full] [--no-seed] [--force]` | Create `~/paperclip-NAME` git worktree + Paperclip instance |
| `paperclipai worktree:list [--json]` | List worktrees |
| `paperclipai worktree:merge-history --from <wt> --to <wt> --company <id-or-prefix> [--scope issues,comments] [--apply\|--dry]` | Cross-worktree issue/comment history merge |
| `paperclipai worktree:cleanup <name> [--force]` | Remove worktree + branch + isolated instance data |

### Client commands — plugins
| Command | Purpose |
|---|---|
| `paperclipai plugin list [--status ready\|error\|disabled\|installed\|upgrade_pending]` | List installed plugins |
| `paperclipai plugin install <package> [--local] [--version <v>]` | Install from npm or local path |
| `paperclipai plugin uninstall <key> [--force]` | Remove. `--force` purges all state. |
| `paperclipai plugin enable <key>` / `disable <key>` | Toggle without uninstalling |
| `paperclipai plugin inspect <key>` | Detail |
| `paperclipai plugin examples` | List bundled example plugins |

### Client commands — auth
| Command | Purpose |
|---|---|
| `paperclipai auth bootstrap-ceo [--force] [--expires-hours <n>] [--base-url <url>]` | **Local-only.** Create one-time invite URL for first instance admin. |
| `paperclipai auth login [--instance-admin] [-C <company-id>]` | Authenticate CLI for board access |
| `paperclipai auth logout` | Remove stored credential |
| `paperclipai auth whoami` | Show current identity |

### Local paths
| Data | Path |
|---|---|
| Config | `~/.paperclip/instances/default/config.json` |
| Database | `~/.paperclip/instances/default/db` |
| Logs | `~/.paperclip/instances/default/logs` |
| Storage | `~/.paperclip/instances/default/data/storage` |
| Secrets master key | `~/.paperclip/instances/default/secrets/master.key` |
| CLI context profiles | `~/.paperclip/context.json` |
| Board user auth store | `~/.paperclip/auth/*` (override with `PAPERCLIP_AUTH_STORE`) |
| Worktree home root | `~/.paperclip-worktrees` (override with `PAPERCLIP_WORKTREES_DIR`) |

### Environment variables (CLI-level)
**Local + config:**
- `PAPERCLIP_HOME` — data root (default `~/.paperclip`)
- `PAPERCLIP_INSTANCE_ID` — instance id (default `default`)
- `PAPERCLIP_CONFIG` — absolute path to specific `config.json`
- `PAPERCLIP_CONTEXT` — CLI context file path
- `PAPERCLIP_AUTH_STORE` — board user credential store override

**Client (server connection):**
- `PAPERCLIP_API_URL` — default API base
- `PAPERCLIP_API_KEY` — bearer token
- `PAPERCLIP_COMPANY_ID` — default company
- `PAPERCLIP_AGENT_ID` — assumed agent identity (set by `agent local-cli`)

**Worktree:**
- `PAPERCLIP_WORKTREES_DIR`, `PAPERCLIP_WORKTREE_START_POINT`, `PAPERCLIP_WORKTREE_NAME`, `PAPERCLIP_WORKTREE_COLOR`, `PAPERCLIP_IN_WORKTREE`

**Server-side** (consumed during `paperclipai run`):
- Auth: `PAPERCLIP_PUBLIC_URL`, `BETTER_AUTH_URL`/`BETTER_AUTH_BASE_URL`
- Agent JWT: `PAPERCLIP_AGENT_JWT_SECRET`, `PAPERCLIP_AGENT_JWT_TTL_SECONDS`, `PAPERCLIP_AGENT_JWT_ISSUER`, `PAPERCLIP_AGENT_JWT_AUDIENCE`
- Deployment: `PAPERCLIP_DEPLOYMENT_MODE`, `PAPERCLIP_DEPLOYMENT_EXPOSURE`, `PAPERCLIP_AUTH_BASE_URL_MODE`, `PAPERCLIP_ALLOWED_HOSTNAMES`
- Storage: `PAPERCLIP_STORAGE_PROVIDER`, `PAPERCLIP_STORAGE_LOCAL_DIR`, S3 variants
- Secrets: `PAPERCLIP_SECRETS_PROVIDER`, `PAPERCLIP_SECRETS_STRICT_MODE`, `PAPERCLIP_SECRETS_MASTER_KEY`/`_FILE`
- DB backup: `PAPERCLIP_DB_BACKUP_ENABLED`, `_INTERVAL_MINUTES`, `_RETENTION_DAYS`, `_DIR`
- Server bind: `PAPERCLIP_SERVER_HOST`, `PAPERCLIP_SERVER_PORT`

### Common client flags (apply to most client commands)
| Flag | Meaning |
|---|---|
| `--context <path>` | Context file override |
| `--profile <name>` | Use specific profile |
| `--api-base <url>` | Override server URL |
| `--api-key <token>` | Inline API key (use env var instead in practice) |
| `-C, --company-id <id>` | Required for company-scoped commands |
| `--json` | Machine-readable output (for scripting) |

### Exit codes
- `0` — success or user cancelled
- `1` — any failure (validation, API, auth, missing config, doctor blocking)

Errors print as `API error <status>: <message>` on stderr before exit `1`.

---

## 18. Skills

**Company-scoped, NOT org-scoped.** Skills install at the company level. Every agent in that company can be assigned any installed skill. To use the same skill in two companies (e.g., VAL + VETA), import the source twice — once into each. Each install gets its own `companySkills` row and versions independently.

### File shape
```
my-skill/
├── SKILL.md          # YAML frontmatter + Markdown body
├── references/       # → inventory kind: reference, trust: markdown_only
├── scripts/          # → inventory kind: script, trust: scripts_executables
└── assets/           # → inventory kind: asset, trust: assets
```

Frontmatter:
| Field | Notes |
|---|---|
| `name` | Human label (falls back to slug) |
| `description` | Routing logic agent reads first. Supports `>` and `|` block scalars. |
| `slug` | Stable kebab-case ID. Auto-derived from name if absent. |
| `required` | Bundled-required skills are forced into every agent's resolved set regardless. |
| `key` / `skillKey` | Canonical key override (used by skills.sh for stable cross-mirror identity) |
| `metadata` | Round-tripped untouched; recognized sub-fields: `skillKey`/`canonicalKey`/`paperclipSkillKey`, `sourceKind`, `sources[]`, `owner`/`repo`/`ref`/`trackingRef` |

### Routes
| Method | Path | Notes |
|---|---|---|
| GET | `/api/companies/{id}/skills` | List. Triggers `ensureSkillInventoryCurrent` (prunes missing, re-imports bundled) on every call. |
| GET | `/api/companies/{id}/skills/{id}` | Detail with usage |
| GET | `/api/companies/{id}/skills/{id}/files?path=SKILL.md` | Read one file |
| PATCH | `/api/companies/{id}/skills/{id}/files` | Edit (only on editable skills) |
| GET | `/api/companies/{id}/skills/{id}/update-status` | Check for new commit (GitHub-managed only) |
| POST | `/api/companies/{id}/skills/{id}/install-update` | Pull latest commit. Returns 422 if source unsupported. |
| DELETE | `/api/companies/{id}/skills/{id}` | Remove |
| POST | `/api/companies/{id}/skills` | Create empty Paperclip-managed skill |
| POST | `/api/companies/{id}/skills/import` | **Import from source** (see below) |
| POST | `/api/companies/{id}/skills/scan-projects` | Walk project workspaces for `SKILL.md` files |

Mutating routes require `agents:create` permission OR `permissions.canCreateAgents=true` on the calling agent.

### Import source forms (all accepted by `POST .../skills/import`)
```json
{ "source": "https://github.com/paperclipai/paperclip" }
{ "source": "https://github.com/paperclipai/paperclip/tree/main/skills/paperclip" }
{ "source": "https://github.com/paperclipai/paperclip/blob/main/skills/paperclip/SKILL.md" }
{ "source": "paperclipai/paperclip" }
{ "source": "paperclipai/paperclip/paperclip-dev" }
{ "source": "https://skills.sh/paperclipai/paperclip/paperclip-dev" }
{ "source": "npx skills add paperclipai/paperclip --skill paperclip-dev" }
{ "source": "https://example.com/raw/SKILL.md" }
{ "source": "/Users/me/code/my-project/skills/code-review" }
```

`tree/<ref>` and `blob/<ref>` URLs pin to that ref; bare repo URLs resolve default branch.

### Canonical key forms (used as identity)
| Source | Key form |
|---|---|
| Paperclip-bundled | `paperclipai/paperclip/{slug}` |
| GitHub / skills.sh | `{owner}/{repo}/{slug}` |
| URL | `url/{host}/{hash}/{slug}` |
| Local path (project scan or raw folder) | `local/{hash}/{slug}` |
| Paperclip-managed (created via UI) | `company/{companyId}/{slug}` |

### Resolving skill references in `desiredSkills`
Order: UUID match → normalized key match → normalized slug match (**only if exactly one skill has that slug in the company**). Ambiguous slugs return 422 `Invalid company skill selection (ambiguous references: <slug>)`. Use canonical `key` for unambiguous lookup in scripts.

### Bundled skills (cannot be removed or edited)
Server re-imports `skills/` directory on every list call (`ensureBundledSkills`). Bundled-required keys are unioned into every agent's resolved set regardless of `desiredSkills`. The four currently bundled with Paperclip:
- `paperclipai/paperclip/paperclip` — base heartbeat procedure
- `paperclipai/paperclip/paperclip-create-agent` — governance-aware hire flow
- `paperclipai/paperclip/paperclip-create-plugin` — plugin scaffold flow
- `paperclipai/paperclip/paperclip-dev` — operating a local Paperclip instance

### Adapter sync modes (in the agent skill snapshot)
| Mode | Behavior |
|---|---|
| `persistent` | Adapter writes skill files into agent's working dir; files persist between runs. Most local adapters. |
| `ephemeral` | Adapter materializes files per run; cleans up after. Default for sandboxed adapters. |
| `unsupported` | Paperclip records assignment but cannot push files into runtime. `openclaw_gateway` falls here. Manage skills in the remote runtime instead. |

### Project scan walks these well-known locations
`skills/`, `skills/.curated/`, `skills/.experimental/`, `skills/.system/`, plus dozens of per-tool dirs: `.claude/skills/`, `.codebuddy/skills/`, `.continue/skills/`, `.cursor/skills/` (and many more — full list in scan output), plus workspace root if it has its own `SKILL.md`. Non-destructive — returns `imported`, `updated`, `skipped`, `conflicts`, `warnings`.

### Storage paths
- Editable Paperclip-managed: `<paperclipInstanceRoot>/skills/{companyId}/<slug>/`
- Read-only (GitHub/skills.sh/URL): markdown in DB row; materializes to temp dir only when adapter needs files

### Versioning per source type
| Source | Pinned? | Update path |
|---|---|---|
| `github` | Yes — commit SHA in `sourceRef` | `update-status` → `install-update` |
| `skills_sh` | Yes (resolves to GitHub) | Same as github |
| `url` | No | Re-import URL to refresh |
| `local_path` (managed) | Live | Files refresh on read |
| `local_path` (project scan) | Live | Re-run scan endpoint |
| `paperclip_bundled` | Pinned to release | Upgrade Paperclip |
| `catalog` | No | Re-import |

### CRITICAL — flagging an ambiguity in our prior VETA setup plan

The S88-era plan in `agents/PHASE1_HIRES_S88.md` and our recent Rafa prompts said to install **`engineering:debug`, `engineering:code-review`, `engineering:testing-strategy`, `engineering:documentation`** on VETA Backend, plus **`design:design-critique`, `design:design-handoff`, `brand-voice:enforce-voice`** on VETA Frontend.

Per this Skills Reference, **paperclip skills must be imported into the company before they can appear in `desiredSkills`.** Those names (`engineering:debug`, etc.) are **Claude Code skill slugs**, loaded from the Claude Code skills plugin at `C:\Users\gillo\AppData\Roaming\Claude\local-agent-mode-sessions\skills-plugin\...\skills\engineering\debug\` — that's a separate skill system from paperclip's.

**Two possible interpretations of the §32 instruction:**

A. **Import the equivalents into paperclip.** Find each skill in a GitHub source (e.g., the paperclipai/companies repo has community skills) and POST to `/api/companies/{vetaId}/skills/import`. The Claude Code "engineering:debug" likely has no published paperclip equivalent — these were authored under the Claude Code plugin system. If we want them under VETA's paperclip skill library, we'd need to either (a) author them as paperclip skills and put them in a repo we control, or (b) accept this gap.

B. **Rely on Claude Code's own skill system.** `claude_local` adapter docs say it symlinks **paperclip** skills into a temp dir via `--add-dir`. Claude Code ALSO loads its own skills from `~/.claude/skills` independently. When `paperclipai agent local-cli claudecoder -C <vetaId>` runs, it installs **paperclip's** skills into `~/.claude/skills` — meaning paperclip and Claude skills coexist in that dir. The Claude Code `engineering:debug` skill is loaded by Claude itself when relevant, NOT via paperclip's `desiredSkills` mechanism. In this interpretation, the §32 instruction's skill list refers to Claude Code skills the agent will see naturally, not paperclip skills we need to install.

**Recommendation:** Confirm with Gill which interpretation §32 intended before drafting the VETA post-approval setup Rafa prompt. If (B), the post-approval setup is just budgets + project assignment — no `POST /skills/import` calls needed. If (A), we need to identify source repos for each named skill first.

---

## 19. Adapters

Adapters bridge paperclip's control plane to the runtime that actually executes work. Each agent has one `adapterType` and a matching `adapterConfig`.

### Built-in adapters
| Adapter | Type key | UI selectable? | Use for |
|---|---|---|---|
| Claude Local | `claude_local` | Yes (recommended) | Claude Code on host machine; session resume; skills via `--add-dir` |
| Codex Local | `codex_local` | Yes (recommended) | OpenAI Codex CLI; managed `CODEX_HOME`; session via `previous_response_id` chain |
| Gemini Local | `gemini_local` | Yes | Gemini CLI with `--resume`; skills symlinked into `~/.gemini/skills` |
| Cursor Local | `cursor` | Yes | Cursor Agent CLI; `--resume` session continuity |
| OpenCode Local | `opencode_local` | Yes | OpenCode CLI with provider/model routing; `--session` resume |
| Pi Local | `pi_local` | Yes | Pi CLI with built-in tool set |
| Hermes Local | `hermes_local` | Yes | Hermes Agent with persistent memory + 30+ tools + 80+ skills |
| OpenClaw Gateway | `openclaw_gateway` | **Coming soon** | Remote OpenClaw over WebSocket gateway |
| Process | `process` | **Coming soon** | Arbitrary local command/script |
| HTTP | `http` | **Coming soon** | Webhook into your own service |

UI "Coming soon" status means the agent-config dropdown can't pick them yet, but they ARE functional via API or imported company export.

### `claude_local` config fields (VETA Backend + Frontend use this)
| Field | Default | Notes |
|---|---|---|
| `cwd` | current process cwd | Absolute working directory. Recommended in practice. |
| `model` | — | Common: `claude-opus-4-6`, `claude-sonnet-4-6`, `claude-haiku-4-6`. VETA agents use `claude-sonnet-4-20250514` per state.json. |
| `promptTemplate` | — | Prompt template for the run |
| `env` | — | Env vars; **secret refs preferred** (see §11) |
| `command` | `claude` | Override exec path |
| `extraArgs` | — | Extra CLI args |
| `effort` | — | `low` / `medium` / `high` — passed as `--effort` |
| `chrome` | — | Adds `--chrome` |
| `maxTurnsPerRun` | `300` | Agentic turns per heartbeat |
| `dangerouslySkipPermissions` | `true` | Required for headless `--print` mode |
| `timeoutSec` | — | `0` = no timeout |
| `graceSec` | — | Grace before forced stop |
| `workspaceStrategy` | — | E.g., `git_worktree` |

### `claude_local` session behavior
- Stores Claude Code session id; resumes on next heartbeat when cwd still matches
- Falls back to fresh session if resume fails
- Session codec preserves `cwd`, `workspaceId`, `repoUrl`, `repoRef`
- Moving `cwd` between heartbeats → new session, not resume

### `claude_local` environment test (`Test Environment` button)
Checks:
- Claude Code installed and executable
- `cwd` absolute and usable
- Auth: `ANTHROPIC_API_KEY` env var, Bedrock settings, OR Claude subscription login
- Hello probe runs `claude --print - --output-format stream-json --verbose` with `Respond with hello.`

### `codex_local` config differences from claude_local
- `instructionsFilePath` — markdown file prepended to stdin prompt (separate from Codex's own `AGENTS.md` discovery)
- `modelReasoningEffort` — reasoning effort override
- `search` — adds `--search`
- `dangerouslyBypassApprovalsAndSandbox` — bypasses Codex safety for unattended runs
- Sends prompt via stdin to `codex exec --json`
- Managed `CODEX_HOME` per-company by default; isolated in worktree mode
- Session preserves `previous_response_id` chain; new session if cwd changes

### `gemini_local` config
- `sandbox` — enables Gemini sandbox mode (adapter otherwise passes `--sandbox=none`)
- `yolo` — convenience for unattended approval mode
- `approvalMode` — advanced approval control
- `helloProbeTimeoutSec` — probe timeout
- Auth: `GEMINI_API_KEY`, `GOOGLE_API_KEY`, Google account login, OR Gemini CLI auth
- Symlinks paperclip skills into `~/.gemini/skills`; does NOT overwrite existing user skills

### `process` config (built-in but not UI-pickable)
| Field | Required | Notes |
|---|---|---|
| `command` | yes | Executable or script path |
| `args` | no | Array OR whitespace-delimited string |
| `cwd` | no | Absolute |
| `env` | no | Extra env vars |
| `timeoutSec` | no | `0` = no timeout |
| `graceSec` | no | Default 15s |

Paperclip injects `PAPERCLIP_*` env vars into the process. Run returns stdout + stderr + exit metadata. Non-zero exit → run returns error message with raw output.

### `http` config (built-in but not UI-pickable)
| Field | Required | Notes |
|---|---|---|
| `url` | yes | Absolute `http://` or `https://` |
| `method` | no | Default `POST` |
| `headers` | no | Extra headers |
| `payloadTemplate` | no | JSON merged BEFORE paperclip's standard fields. Standard fields win on key collision. |
| `timeoutMs` | no | `0` = no timeout |

Standard request fields always included: `runId`, `agentId`, `context` (with `taskId`, `wakeReason`, `commentId`). Non-2xx response → failure.

### Common to all adapters
- `cwd` — working directory (most require absolute path)
- `env` — env vars; secret refs preferred
- Session state — adapter-specific resume semantics
- Skills — adapter-specific materialization mode
- `testEnvironment()` — UI readiness check called before save/run
- UI parser — converts stdout into structured transcript

### Manual local-CLI agent setup (for running Claude/Codex as a paperclip agent outside paperclip itself)

```powershell
# Get an agent API key + install paperclip skills into ~/.claude/skills (or ~/.codex/skills)
# + print export block for the shell environment
npx paperclipai agent local-cli claudecoder -C <vetaId>
# Pipe to eval to apply immediately (works in bash; for PowerShell, set vars manually from output)
```

The `--no-install-skills` flag skips the `~/.claude/skills` / `~/.codex/skills` install if the user wants to keep those directories clean.

---

## 20. Skill vs Plugin vs Adapter — clarity matrix

These three extension points sit at different layers and are easy to confuse.

| | Skill | Plugin | Adapter |
|---|---|---|---|
| What it is | Instruction document the agent loads on demand | Code package adding API routes, UI surfaces, runtime services | Bridge between paperclip and an agent runtime |
| Format | Folder with `SKILL.md` + optional supporting files | Node package built against plugin SDK | Module exposing `executeRun`, `listSkills`, `syncSkills`, etc. |
| Lives at | Company level (in company skill library) | Instance level (`~/.paperclip/adapter-plugins/`) | Built into server OR registered as external adapter |
| Loaded | Start of agent run when routing description matches | Server start; mounts into API + UI | Per-run when agent's `adapterType` matches |
| Authored by | Anyone with company skill-library access | Plugin authors (use `/paperclip-create-plugin` skill) | Adapter authors |
| Versioning | Pinned to git commit (GitHub/skills.sh) or live (local) | Pinned by package version | Pinned by paperclip release |
| Failure mode | Agent reads bad instructions, produces bad output | API surface doesn't load | Runs fail to start |

**Rule of thumb:** a skill is something a smart human could follow if you handed them the file; a plugin is server code; an adapter is the wire protocol to a runtime.

---

## 21. External Adapters + SDK

External adapters live as their own npm packages or local directories. Use when distributing an adapter independently from paperclip releases, when building an internal team adapter, or for local plugin iteration without editing paperclip source. Built-in adapters cannot be removed or overwritten by external installs.

### Management routes
| Method | Path | Notes |
|---|---|---|
| GET | `/api/adapters` | List installed adapters (built-in + external) |
| POST | `/api/adapters/install` | Install external. Body: `packageName` (required), `version` (optional npm version), `isLocalPath` (boolean, `true` for local checkout) |
| PATCH | `/api/adapters/:type` | Disable/enable, update package metadata |
| POST | `/api/adapters/:type/reload` | Hot-reload during local development |
| POST | `/api/adapters/:type/reinstall` | Re-fetch from source |
| DELETE | `/api/adapters/:type` | Remove (external only) |
| GET | `/api/adapters/:type/config-schema` | Drives the UI config form |
| GET | `/api/adapters/:type/ui-parser.js` | Browser-served parser bundle |

### Required package shape
```text
my-adapter/
  package.json
  src/
    index.ts        # exports type, label, models, agentConfigurationDoc, createServerAdapter
    server/
      index.ts      # createServerAdapter()
      execute.ts    # main run logic
      test.ts       # testEnvironment()
    ui-parser.ts    # optional, browser-safe
```

`package.json` requirements:
```json
{
  "name": "my-paperclip-adapter",
  "type": "module",
  "paperclip": {
    "adapterUiParser": "1.0.0"
  },
  "exports": {
    ".": "./dist/index.js",
    "./server": "./dist/server/index.js",
    "./ui-parser": "./dist/ui-parser.js"
  }
}
```

The host calls `createServerAdapter()` at the package root. That factory must return a `ServerAdapterModule` with `type`, `execute()`, `testEnvironment()`, `models`, `agentConfigurationDoc`.

### `execute()` contract (from `@paperclipai/adapter-utils/server-utils`)
Receives `AdapterExecutionContext`, returns `AdapterExecutionResult`. Standard pattern:
1. Read config via `asString()` / `asNumber()` / `asBoolean()` helpers
2. Build runtime env via `buildPaperclipEnv(agent)` — injects standard `PAPERCLIP_*` vars
3. Resolve/resume session state from `runtime.sessionParams`
4. Render prompt templates via `renderTemplate()`
5. Spawn command (via `runChildProcess()`) or call remote service
6. Return usage, cost, session, result metadata

### `testEnvironment()` contract
Returns `info` / `warn` / `error` checks. Should verify: command/endpoint exists, working directory valid, required auth/env vars present, hello probe succeeds.

### Session codec (optional, for runtimes that can resume across heartbeats)
```ts
export const sessionCodec = {
  deserialize(raw) { /* raw payload → session params */ },
  serialize(params) { /* session params → storable shape */ },
  getDisplayId(params) { /* human-readable label */ },
};
```
Use `clearSession: true` when runtime reports the previous session cannot be resumed.

### UI parser contract — transcript entry kinds
The browser-served parser converts stdout lines into typed transcript entries. Exports either `parseStdoutLine(line, ts): TranscriptEntry[]` (stateless) or `createStdoutParser()` returning `{parseLine, reset}` (stateful). Stateful takes priority if both present.

Valid entry kinds:
```ts
{ kind: "assistant"; ts; text; delta? }
{ kind: "thinking"; ts; text; delta? }
{ kind: "user"; ts; text }
{ kind: "tool_call"; ts; name; input; toolUseId? }
{ kind: "tool_result"; ts; toolUseId; content; isError }
{ kind: "system"; ts; text }
{ kind: "stderr"; ts; text }
{ kind: "stdout"; ts; text }
```

`toolUseId` links a call to its result; UI renders pairs as collapsible cards. Parser must be browser-safe (no DOM, no Node, no top-level side effects, deterministic, never throw — return a plain `stdout` entry on failure).

### Package contract version handling
Host checks `paperclip.adapterUiParser` field. `1.x` declared by adapter + host expecting `1.x` → parser loads. `2.x` declared + host expecting `1.x` → host warns, falls back to generic parser. Missing field → parser still loads but future versions may require it.

### Security framing (from official docs, verbatim summary)
- Treat runtime output as untrusted input
- Keep secrets in env vars or secret refs, never in prompts
- Enforce timeouts + grace periods
- UI parser must be DOM-free and Node-free

### Cross-project relevance
Building a custom adapter is on the table for several VeteranIntel use cases worth flagging:

| Possible adapter | Purpose | Status |
|---|---|---|
| MERIT-as-adapter | Wrap MERIT corpus query as a paperclip-callable runtime; agents could `executeRun` against MERIT and get back synthesized policy/regulatory responses | Not yet scoped |
| Rafa-as-adapter | Expose CLI execution surface as a paperclip-managed adapter so other paperclip agents can dispatch shell/gcloud/git work | Not yet scoped |
| Cowork-as-adapter | Same idea for filesystem ops | Not yet scoped — and probably wrong architectural shape since Cowork is human-driven |

None of these are S90 work. Recording the architectural option for future reference.

---

## 22. Deployment Modes

Paperclip supports three deployment configurations. Choice determines both how the board operator authenticates AND how the instance is exposed.

| Mode | Exposure | Auth | Use for |
|---|---|---|---|
| `local_trusted` | `localhost` only | None — board operator implicitly trusted | Single-operator local machine. **Default mode.** |
| `authenticated` + `private` | Binds all interfaces | Login via Better Auth | Tailscale, VPN, LAN |
| `authenticated` + `public` | Internet-facing | Login required + explicit `publicBaseUrl` + stricter doctor checks | Cloud / hosted production |

### Mode change paths
| Method | Use when |
|---|---|
| `pnpm paperclipai configure --section server` | Canonical post-setup change |
| `PAPERCLIP_DEPLOYMENT_MODE=authenticated pnpm paperclipai run` | Per-run env override |
| `pnpm paperclipai onboard` | Initial setup |

### Migration: `local_trusted` → `authenticated` board-claim flow

When migrating from local_trusted to authenticated, paperclip emits a **one-time board-claim URL at startup**:

```
/board-claim/<token>?code=<code>
```

A signed-in user visits the link to claim board ownership. The flow:
1. Promotes the current user to instance admin
2. Demotes the auto-created local board admin
3. Keeps the claiming user in active company membership

**⚠️ Treat the claim URL as sensitive.** Intended for one-time ownership transfer, not for general sharing.

### Allowed hostname (authenticated/private)
```powershell
pnpm paperclipai allowed-hostname my-machine.tailnet.ts.net
```
Local config updates immediately; new hostname takes effect after server restart.

### Public mode requirements
When exposed publicly, config validation also enforces:
- `auth.baseUrlMode = explicit`
- `auth.publicBaseUrl` must be set

### Current VeteranIntel mode (inferred from operational state)
Gill's instance binds to `localhost:3100`, no login flow visible in our work, and `local_implicit` board access matches the Rafa probe behavior we observed (Rafa hitting endpoints as board without explicit auth tokens). State.json + observed behavior → instance is in `local_trusted` mode.

If/when we expose paperclip beyond Gill's local box (e.g., for cross-product agents, remote collaboration), the migration is `configure --section server` → choose authenticated → use the emitted board-claim URL once to take instance ownership.

---

## 23. Local Development

The fastest in-monorepo workflow for the paperclip clone at `C:\Users\gillo\paperclip\`.

### Prerequisites (per docs)
- Node.js 20+
- pnpm 9+
- No separate PostgreSQL install — embedded PGlite is auto-used if `DATABASE_URL` is unset

### Start the server
```powershell
cd C:\Users\gillo\paperclip
pnpm install   # first time
pnpm dev       # starts API at localhost:3100 + UI in dev middleware mode
```

`pnpm dev` is idempotent. If a matching paperclip dev runner is already alive for this repo+instance, paperclip reports the existing process instead of starting a duplicate.

### Managed dev runner controls
```powershell
pnpm dev:list   # show running paperclip dev processes
pnpm dev:stop   # stop the current dev runner
```

### One-command bootstrap alternative
```powershell
pnpm paperclipai run
```
Best for first-time install: auto-onboards if no config, runs doctor with repair, starts server.

### Authenticated private dev (Tailscale / private network)
```powershell
pnpm dev --tailscale-auth
# alias:
pnpm dev --authenticated-private
```
Configures the instance for authenticated-private exposure and binds the server to 0.0.0.0.

### Health check (verified real)
```powershell
curl http://localhost:3100/api/health
# → {"status":"ok"}
```
**This contradicts CLAUDE.md §32 which says `/api/health` doesn't exist.** Per the Local Development page (and Skills Reference + API Overview), it's a real endpoint that returns deployment mode + auth readiness + bootstrap state + feature flags. The §32 entry needs to be corrected. Use `/api/health` as the canonical liveness probe; `/api/companies` is a fallback.

Also confirm the API is serving company data:
```powershell
curl http://localhost:3100/api/companies
```

### Reset local data
**Destructive — wipes embedded database only.** Does not touch repo or workspace data.
```powershell
Remove-Item -Recurse -Force ~/.paperclip/instances/default/db
pnpm dev
```

### Multi-worktree isolation (critical)
**Do not point two paperclip servers at the same embedded PostgreSQL data directory.** Use a repo-local isolated instance instead:
```powershell
pnpm paperclipai worktree init
```
Creates a repo-local `.paperclip` config + isolated instance under `~/.paperclip-worktrees/`. The new worktree gets its own embedded database.

This matters in practice if/when we start using worktrees for paperclip feature work in parallel branches — without isolation, the second paperclip will collide with the first on the PGlite data directory.

### Default data paths (`PAPERCLIP_HOME` + `PAPERCLIP_INSTANCE_ID`)
| Data | Path |
|---|---|
| Config | `~/.paperclip/instances/default/config.json` |
| Database | `~/.paperclip/instances/default/db` |
| Storage | `~/.paperclip/instances/default/data/storage` |
| Secrets key | `~/.paperclip/instances/default/secrets/master.key` |
| Logs | `~/.paperclip/instances/default/logs` |

Override for an isolated local install:
```powershell
$env:PAPERCLIP_HOME = "C:\custom\path"
$env:PAPERCLIP_INSTANCE_ID = "dev"
pnpm paperclipai run
```

---

## 24. Docker (Alternative Deployment Path)

Use when running paperclip without Node/pnpm on the host machine. Not currently in scope for VeteranIntel — Gill's local instance is in-monorepo via pnpm — but recorded for reference.

### Compose quickstart
```powershell
docker compose -f docker/docker-compose.quickstart.yml up --build
# App at http://localhost:3100
# Data at ./data/docker-paperclip
```

Override host port + data dir:
```powershell
$env:PAPERCLIP_PORT = "3200"
$env:PAPERCLIP_DATA_DIR = "../data/pc"
docker compose -f docker/docker-compose.quickstart.yml up --build
```

`PAPERCLIP_DATA_DIR` is resolved relative to the compose file in `docker/`, so `../data/pc` maps to `data/pc` at the repo root.

### Manual image build
```powershell
docker build -t paperclip-local .
docker run --name paperclip `
  -p 3100:3100 `
  -e HOST=0.0.0.0 `
  -e PAPERCLIP_HOME=/paperclip `
  -v "${PWD}/data/docker-paperclip:/paperclip" `
  paperclip-local
```

### What persists in the bind mount
- Embedded PostgreSQL data
- Uploaded assets
- Local secrets key
- Agent workspace data

Remove the bind mount → instance starts fresh on next run.

### LLM adapter support in the Docker image
The image **pre-installs the local CLI tools** used by built-in local adapters:
- `claude` for `claude_local`
- `codex` for `codex_local`

Pass adapter API keys explicitly:
```powershell
docker run --name paperclip `
  -p 3100:3100 `
  -e HOST=0.0.0.0 `
  -e PAPERCLIP_HOME=/paperclip `
  -e OPENAI_API_KEY=sk-... `
  -e ANTHROPIC_API_KEY=sk-... `
  -v "${PWD}/data/docker-paperclip:/paperclip" `
  paperclip-local
```

Without keys, the app still runs — the adapter `testEnvironment()` reports missing prerequisites for affected adapters.

### Cross-project relevance
Not load-bearing for current operation. Could become relevant if/when:
- Paperclip migrates off Gill's local box to a hosted instance (e.g., for cross-product collaboration)
- We want consistent paperclip behavior across multiple operator machines (e.g., a hypothetical second analyst seat)
- We need a reproducible CI environment for paperclip-related tests

---

## 25. Database

Three modes, same Drizzle schema. The choice is where Postgres runs.

| Mode | When | `DATABASE_URL` |
|---|---|---|
| Embedded Postgres | Default. Local dev, one-command installs. | unset |
| Local Postgres in Docker | Prod-like database locally. | `postgres://paperclip:paperclip@localhost:5432/paperclip` |
| Hosted (Supabase, etc.) | Production / shared. | `postgres://...supabase.com...` |

### Embedded mode (Gill's current setup)
- On first start, paperclip creates `~/.paperclip/instances/default/db/`, ensures the `paperclip` database, runs migrations, starts serving
- Data persists across restarts in that directory
- Reset: `Remove-Item -Recurse -Force ~/.paperclip/instances/default/db` then restart

### Local Postgres in Docker
```powershell
docker compose up -d   # starts Postgres 17 on localhost:5432
# Set DATABASE_URL in .env
DATABASE_URL=postgres://paperclip:paperclip@localhost:5432/paperclip npx drizzle-kit push
```

### Hosted (Supabase)
- Create at database.new
- Two connection styles:
  - **Direct** on port 5432 — for migrations and one-off scripts
  - **Pooled** on port 6543 — for the running application

**Pooled connection gotcha:** Must disable prepared statements in `packages/db/src/client.ts`:
```ts
export function createDb(url: string) {
  const sql = postgres(url, { prepare: false });
  return drizzlePg(sql, { schema });
}
```
Pointing migrations at the pooled endpoint causes avoidable connection errors. Use direct for schema changes, pooled for the app.

### Cross-project relevance
VeteranIntel is currently on embedded mode (single-operator local). Migration to hosted Postgres would be the path if we ever needed shared multi-machine access — but operationally that's the same call as moving deployment mode to `authenticated` + `public` (§22).

---

## 26. Storage

Two providers configured via `paperclipai configure --section storage`.

| Provider | When |
|---|---|
| `local_disk` (default) | Local single-machine. Files at `~/.paperclip/instances/default/data/storage`. |
| `s3` | Production / multi-node. Compatible: AWS S3, MinIO, Cloudflare R2. |

Storage holds uploaded files for company activity — issue attachments, images, agent assets. Storage config lives in the instance config file, NOT in the database schema.

### Cross-project relevance
For VeteranIntel's invite-only single-operator posture, `local_disk` is correct. If we ever wanted issue attachments to survive a host rebuild without bind-mount backup, R2 would be the cheapest S3-compatible path.

---

## 27. Secrets — Operational (extends §11)

### Default provider
`local_encrypted` — master key at `~/.paperclip/instances/default/secrets/master.key` created during onboarding.

### Configure
| Command | When |
|---|---|
| `pnpm paperclipai onboard` | Initial setup |
| `pnpm paperclipai configure --section secrets` | Post-setup change |
| `pnpm paperclipai doctor` | Validate config |

### Environment overrides
| Variable | Meaning |
|---|---|
| `PAPERCLIP_SECRETS_MASTER_KEY` | 32-byte key as base64, hex, or raw string |
| `PAPERCLIP_SECRETS_MASTER_KEY_FILE` | Custom path to local key file |
| `PAPERCLIP_SECRETS_STRICT_MODE` | Reject inline plaintext for sensitive env keys |

### Strict mode — what it covers
When `PAPERCLIP_SECRETS_STRICT_MODE=true`, the server rejects inline plaintext for any env key matching the sensitive-keyword regex (`*_api_key`, `*_token`, `*_secret`, `*_password`, `*_credential`). Applies to:
- agent `adapterConfig.env`
- project `env`
- hire-agent approval payloads carrying adapter env
- company imports carrying agent adapter env

**Strict mode does NOT apply to `config.llm.apiKey`.** That field is plaintext-only regardless of strict mode.

**Strict mode does NOT auto-migrate existing inline values.** It blocks NEW inline values from being saved. Existing inline secrets stay in place until migrated.

### `config.llm.apiKey` is a plaintext field — security gap to know about
The instance-level LLM API key field does NOT support `secret_ref` and there is no CLI or API path to store it in the secret store. For end-to-end secret-ref hygiene:
- Leave `config.llm.apiKey` empty
- Bind each agent adapter API key in `adapterConfig.env` using `secret_ref` per §11

### Migrating inline secrets to refs (repo-only script)
```powershell
cd C:\Users\gillo\paperclip
pnpm secrets:migrate-inline-env           # dry run
pnpm secrets:migrate-inline-env --apply   # commit migration
```
**This script is repo-source only.** It does NOT exist in the published `paperclipai` CLI. Must run from a paperclip git checkout. Scans `agent.adapterConfig.env` keys matching the sensitive-keyword regex. Does NOT migrate `config.llm.apiKey`.

### Cross-project relevance — recommend running this on VETA
Before the VETA Backend + Frontend agents do any meaningful work, we should:
1. Verify their `adapterConfig.env` uses secret refs (not inline) for `ANTHROPIC_API_KEY`
2. Confirm `config.llm.apiKey` is empty at the instance level
3. Enable `PAPERCLIP_SECRETS_STRICT_MODE=true` going forward to prevent regression
4. If any inline values exist in VAL parent or VETA agent configs (from S88 setup), run `pnpm secrets:migrate-inline-env --apply` from the paperclip clone

This is the secret hygiene work that should land before SESSION-INIT awakening of VETA agents starts producing real work.

---

## 28. Environment Variables — Full Reference

This consolidates server-side env vars, including the agent runtime injection that's load-bearing for agent prompt design.

### Server bind
| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `3100` | Server port |
| `HOST` | `127.0.0.1` | Bind interface. `0.0.0.0` for network access. |
| `DATABASE_URL` | embedded | Postgres connection string. Main switch between embedded and external. |
| `PAPERCLIP_HOME` | `~/.paperclip` | Base directory for all paperclip data |
| `PAPERCLIP_INSTANCE_ID` | `default` | Instance id for multiple local instances |
| `PAPERCLIP_DEPLOYMENT_MODE` | `local_trusted` | Runtime mode override |

### Deployment + auth
| Variable | Meaning |
|---|---|
| `PAPERCLIP_PUBLIC_URL` | Canonical public URL for invites, redirects, auth origin |
| `PAPERCLIP_AUTH_PUBLIC_BASE_URL` | Explicit auth base URL for Better Auth |
| `BETTER_AUTH_URL` / `BETTER_AUTH_BASE_URL` | Alternate Better Auth base URL inputs |
| `BETTER_AUTH_TRUSTED_ORIGINS` | Comma-separated allowlist of trusted auth origins |
| `PAPERCLIP_DEPLOYMENT_EXPOSURE` | `private` or `public` exposure policy override |
| `PAPERCLIP_AUTH_BASE_URL_MODE` | `auto` or `explicit` |
| `PAPERCLIP_ALLOWED_HOSTNAMES` | Comma-separated host allowlist for authenticated/private |

### Agent JWT minting
| Variable | Meaning |
|---|---|
| `PAPERCLIP_AGENT_JWT_SECRET` | Secret for minting agent API JWTs. **Required for local adapter auth.** |
| `PAPERCLIP_AGENT_JWT_TTL_SECONDS` | JWT lifetime |
| `PAPERCLIP_AGENT_JWT_ISSUER` | JWT `iss` claim |
| `PAPERCLIP_AGENT_JWT_AUDIENCE` | JWT `aud` claim |

### Secrets (covered in §27)
`PAPERCLIP_SECRETS_MASTER_KEY`, `PAPERCLIP_SECRETS_MASTER_KEY_FILE`, `PAPERCLIP_SECRETS_STRICT_MODE`

### Storage
| Variable | Meaning |
|---|---|
| `PAPERCLIP_STORAGE_PROVIDER` | `local_disk` or `s3` |
| `PAPERCLIP_STORAGE_LOCAL_DIR` | Base dir for local-disk storage |
| `PAPERCLIP_STORAGE_S3_BUCKET` | S3 bucket name |
| `PAPERCLIP_STORAGE_S3_REGION` | S3 region |
| `PAPERCLIP_STORAGE_S3_ENDPOINT` | Custom S3-compat endpoint (MinIO, R2) |
| `PAPERCLIP_STORAGE_S3_PREFIX` | Object key prefix |
| `PAPERCLIP_STORAGE_S3_FORCE_PATH_STYLE` | Path-style requests when provider needs them |

### Scheduler
| Variable | Default | Meaning |
|---|---|---|
| `HEARTBEAT_SCHEDULER_ENABLED` | `true` | Enable/disable timer-based scheduling |
| `HEARTBEAT_SCHEDULER_INTERVAL_MS` | `30000` | Poll interval (ms) |

**Cost implication:** Default scheduler polls every 30s. Without per-agent budgets, that's the spend driver for any agent that's `active` and has work in its inbox. Budget caps (§10) are the floor.

### LLM provider keys (consumed by adapters)
| Variable | Adapter |
|---|---|
| `ANTHROPIC_API_KEY` | `claude_local` (VETA Backend + Frontend) |
| `OPENAI_API_KEY` | `codex_local` |
| `GEMINI_API_KEY` | `gemini_local` |
| `GOOGLE_API_KEY` | `gemini_local` (alternate) |

### 🟢 Agent runtime injected vars (LOAD-BEARING for agent prompt design)

Paperclip injects these into the agent process when it starts a run:

| Variable | Always set? | Meaning |
|---|---|---|
| `PAPERCLIP_AGENT_ID` | yes | Agent ID |
| `PAPERCLIP_COMPANY_ID` | yes | Company ID |
| `PAPERCLIP_API_URL` | yes | Paperclip API base URL |
| `PAPERCLIP_API_KEY` | local adapters | **Short-lived JWT.** Use as `Authorization: Bearer $PAPERCLIP_API_KEY`. For non-local adapters, operator sets in adapter config. |
| **`PAPERCLIP_RUN_ID`** | yes | **Current heartbeat run ID. MUST be sent back as `X-Paperclip-Run-Id` on every mutating request so the server-side audit log links to this run.** |
| `PAPERCLIP_TASK_ID` | wake-driven | Issue that triggered the wake. Empty for scheduled/unsolicited wakes. |
| `PAPERCLIP_WAKE_REASON` | wake-driven | Why this run was triggered. See enum below. |
| `PAPERCLIP_WAKE_COMMENT_ID` | comment wakes | Specific comment that triggered the wake |
| `PAPERCLIP_WAKE_PAYLOAD_JSON` | some adapters | **Inline JSON: issue summary + ordered batch of new comments.** Agents using this can skip initial `GET /api/issues/:id` + `GET /api/issues/:id/comments` round-trips on comment wakes. |
| `PAPERCLIP_APPROVAL_ID` | approval wakes | Resolved approval id |
| `PAPERCLIP_APPROVAL_STATUS` | approval wakes | Approval decision |
| `PAPERCLIP_LINKED_ISSUE_IDS` | optional | Comma-separated linked issue ids |

### `PAPERCLIP_WAKE_REASON` enum
| Value | Fires when |
|---|---|
| `issue_assigned` | Task newly assigned to this agent |
| `issue_commented` | New comment on an issue this agent owns. `PAPERCLIP_WAKE_COMMENT_ID` populated. |
| `issue_comment_mentioned` | Agent @-mentioned in a comment on an issue it does NOT own |
| `issue_blockers_resolved` | All issues in `blockedBy` reached `done` |
| `issue_children_completed` | All direct children reached terminal (`done`/`cancelled`) |
| `approval_resolved` | An approval the agent requested was approved or rejected |
| `scheduled` | Scheduled run from heartbeat scheduler or routine cron |
| `assignment` | Generic assignment-triggered run with no more specific reason |

### Workspace runtime vars (when execution workspace realized)
- `PAPERCLIP_WORKSPACE_CWD`, `_PATH`, `_REPO_ROOT`, `_BRANCH`
- `PAPERCLIP_PROJECT_ID`, `PAPERCLIP_ISSUE_ID`

### 🟢 Audit trail discipline (operator-relevant)
> Every mutating API request from an agent run should include `X-Paperclip-Run-Id: $PAPERCLIP_RUN_ID`. The server uses it to attribute issue updates, comments, checkouts, subtasks to the heartbeat run that produced them. Read-only requests do not require it.

This is why our earlier Rafa-as-board prompts didn't need the run-id header (Rafa is board-auth, not running inside a heartbeat). When VETA agents actually start operating, their adapter automatically threads this through — but it's load-bearing for any custom adapter or external runtime.

### Cross-project relevance
The agent runtime vars are the contract VETA's prompts can read at run time:
- VETA Backend's heartbeat will receive `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, etc.
- Its instructions can branch on `$PAPERCLIP_WAKE_REASON` — e.g., on `approval_resolved`, check approval status before resuming work
- `PAPERCLIP_WAKE_PAYLOAD_JSON` is the optimization that lets the agent skip two HTTP round-trips on comment wakes. Adapter must opt in to inject this — claude_local + codex_local docs don't explicitly mention it, so verify against the running adapter before relying on it for prompt design.

---

## 29. Tailscale Private Access

For `authenticated` + `private` deployments — paperclip reachable from a private Tailscale/VPN/LAN network.

### Start in private mode
```powershell
cd C:\Users\gillo\paperclip
pnpm dev --tailscale-auth
# alias:
pnpm dev --authenticated-private
```

This sets:
- `PAPERCLIP_DEPLOYMENT_MODE=authenticated`
- `PAPERCLIP_DEPLOYMENT_EXPOSURE=private`
- `PAPERCLIP_AUTH_BASE_URL_MODE=auto`
- `HOST=0.0.0.0` (bind all interfaces)

**Host bind matters.** Default `127.0.0.1` makes the app unreachable from other devices on the private network.

### Find the reachable address
```powershell
tailscale ip -4
# Or use MagicDNS hostname: my-machine.tailnet.ts.net
```

### Open the instance
```
http://<tailscale-host-or-ip>:3100
```

### Allow custom hostnames
If paperclip refuses a host or redirects incorrectly, allowlist explicitly:
```powershell
pnpm paperclipai allowed-hostname my-machine.tailnet.ts.net
```

### Verify connectivity from a second device
```powershell
curl http://<tailscale-host-or-ip>:3100/api/health
# → {"status":"ok"}
```

### Troubleshooting checklist
- Login/redirect errors mention hostname → allowlist with `paperclipai allowed-hostname`
- App only works on `localhost` → verify `--tailscale-auth` or `--authenticated-private` was used at start
- Local works, remote doesn't → both devices on same Tailscale network? Port 3100 reachable?

### Cross-project relevance
Not currently in scope for VeteranIntel. Could become relevant if:
- Gill wants paperclip reachable from a second machine (laptop ↔ desktop) on the existing Tailscale net
- Cowork/Lena need direct read access to paperclip from outside the host (currently impossible — Cowork is sandboxed without localhost network reach per CLAUDE.md §32)
- Remote collaborator joins (would also require migrating to `authenticated` mode and the board-claim flow per §22)

Tailscale isn't a hard prerequisite for moving paperclip to private exposure — any private network (VPN, LAN) works with the same `--authenticated-private` start flag and `allowed-hostname` allowlist.

---

## 30. VPS / Internet-Facing Deployment Playbook

Not currently in scope for VeteranIntel (Gill's instance is local-only). Recording the full Ubuntu 22.04/24.04 LTS playbook for future reference if paperclip is ever moved to a hosted instance — e.g., for cross-product collaboration with paperclip reachable from multiple machines.

### Prerequisites
- Linux VPS, 1 vCPU + 2 GB RAM minimum (any provider: AWS EC2, GCE, DigitalOcean, Hetzner, Linode, Vultr)
- Registered domain pointing at the server's IP
- SSH access as a sudo-capable user
- Open inbound ports: 22 (SSH), 80 (HTTP for Let's Encrypt + redirect), 443 (HTTPS). **Do NOT open 3100 to the internet** — Nginx is the public face.

### Step-by-step (condensed from official Installation page)

**1. Server provisioning.** Standard cloud VM, Ubuntu 24.04 image, ~€5/month tier sufficient.

**2. DNS A record.** Point `paperclip.example.com` → server IPv4 first. Verify with `dig +short paperclip.example.com`. HTTPS issuance in step 8 fails if DNS isn't ready.

**3. Install Node.js 20+ and pnpm.**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git ca-certificates
sudo npm install -g corepack
sudo corepack enable
corepack prepare pnpm@latest --activate
```

**4. Create dedicated service user.**
```bash
sudo useradd --system --create-home --shell /bin/bash paperclip
sudo -iu paperclip
```
**Embedded Postgres refuses to run as root/admin.** Always use the `paperclip` user from this point.

**5. Install paperclip in public deployment mode.** Set required env vars BEFORE onboarding:
```bash
export PAPERCLIP_DEPLOYMENT_MODE=authenticated
export PAPERCLIP_DEPLOYMENT_EXPOSURE=public
export PAPERCLIP_AUTH_PUBLIC_BASE_URL=https://paperclip.example.com
export PAPERCLIP_ALLOWED_HOSTNAMES=paperclip.example.com
npx paperclipai onboard --yes
```

**⚠️ Variable name is `PAPERCLIP_AUTH_PUBLIC_BASE_URL`** — NOT `PAPERCLIP_PUBLIC_BASE_URL`, NOT `PAPERCLIP_API_URL`. Without it, `paperclipai doctor` fails with `auth.publicBaseUrl is required when deploymentMode=authenticated and exposure=public`.

What the variables do:
- `PAPERCLIP_AUTH_PUBLIC_BASE_URL` — Better Auth canonical base URL; sets `auth.baseUrlMode=explicit` automatically
- `PAPERCLIP_ALLOWED_HOSTNAMES` — comma-separated host allowlist. The hostname from base URL is added automatically; include extras like `paperclip.example.com,www.paperclip.example.com`
- Server binds to `127.0.0.1:3100` by default → exactly what we want behind Nginx

Quickstart defaults: authenticated/public deployment, embedded PostgreSQL on **port 54329** with data at `~/.paperclip/instances/default/db`, local disk storage, fresh 32-byte secrets master key at `~/.paperclip/instances/default/secrets/master.key`.

**⚠️ Back up `secrets/master.key`** — it encrypts every secret in paperclip. Lose it = lose access to all stored secrets.

**6. systemd unit.** Write env file as paperclip user:
```bash
cat > ~/paperclip.env <<'EOF'
PAPERCLIP_DEPLOYMENT_MODE=authenticated
PAPERCLIP_DEPLOYMENT_EXPOSURE=public
PAPERCLIP_AUTH_PUBLIC_BASE_URL=https://paperclip.example.com
PAPERCLIP_ALLOWED_HOSTNAMES=paperclip.example.com
EOF
chmod 600 ~/paperclip.env
```
**Do NOT duplicate `PAPERCLIP_AGENT_JWT_SECRET` here** — onboarding writes it to `~/.paperclip/instances/default/.env` and it's auto-loaded.

systemd unit (run as sudo user):
```ini
[Unit]
Description=Paperclip control plane
After=network.target
[Service]
Type=simple
User=paperclip
Group=paperclip
WorkingDirectory=/home/paperclip
EnvironmentFile=/home/paperclip/paperclip.env
ExecStart=/usr/bin/npx paperclipai run
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal
[Install]
WantedBy=multi-user.target
```
Then `sudo systemctl daemon-reload && sudo systemctl enable --now paperclip`. Logs: `sudo journalctl -u paperclip -f`.

**7. Nginx reverse proxy.** Site config for the domain — load-bearing details:
```nginx
server {
    listen 80;
    server_name paperclip.example.com;
    client_max_body_size 50m;
    location / {
        proxy_pass         http://127.0.0.1:3100;
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        # WebSocket / long-lived streaming endpoints
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        "upgrade";
        proxy_read_timeout 3600s;
        proxy_send_timeout 3600s;
    }
}
```

`client_max_body_size 50m` matters for asset/attachment uploads. The 3600s read/send timeouts matter for long-running agent runs.

**8. Let's Encrypt HTTPS via Certbot.**
```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d paperclip.example.com
```
Certbot handles TLS termination + redirect setup + auto-renewal timer. Verify timer: `systemctl list-timers | grep certbot`.

**9. Bootstrap the CEO account.**
```bash
sudo -iu paperclip
npx paperclipai auth bootstrap-ceo
```

Prints a one-time invite URL: `https://paperclip.example.com/invite/<token>`. Open in browser, create account via Better Auth (email + password), claim board ownership.

**Constraint:** `bootstrap-ceo` only runs in authenticated mode AND needs to reach the database. Embedded Postgres has a file lock — paperclip systemd service must be RUNNING during bootstrap, or bootstrap holds the lock and service can't start.

Lost the link → `npx paperclipai auth bootstrap-ceo --force` to rotate.

Optional flags:
- `--force` — rotate the invite token
- `--expires-hours N` — link lifetime
- `--base-url <URL>` — override URL used for invite
- `--db-url <URL>` — when pointing at external database

**10. Connect Desktop app as thin client.** macOS Desktop app's "Remote" mode at first launch — enter the instance URL, sign in with the bootstrap-claimed account.

### VPS-specific troubleshooting
- `Embedded PostgreSQL failed` with `Execution of PostgreSQL by a user with administrative permissions is not permitted` → ran as root. Switch to dedicated `paperclip` user via `sudo -iu paperclip`.
- `auth.publicBaseUrl is required when deploymentMode=authenticated and exposure=public` → didn't export `PAPERCLIP_AUTH_PUBLIC_BASE_URL` before onboarding. Re-export, run `paperclipai configure --section server`.
- Host mismatch rejection → hostname missing from `server.allowedHostnames`. Add via `paperclipai allowed-hostname <host>` OR edit `~/paperclip.env` and restart service.
- Invite link 404 → invite consumed or base URL mismatch. Re-run `auth bootstrap-ceo --force --base-url https://paperclip.example.com`.

### Diagnostic command set
| Command | Use |
|---|---|
| `paperclipai doctor` | Validate config + environment. Pass `--repair` to auto-fix. |
| `paperclipai env` | Print env vars paperclip actually reads — confirms exports landed. |
| `paperclipai allowed-hostname <host>` | Add hostname to `server.allowedHostnames` post-install. |
| `paperclipai configure --section server` | Re-prompt for server/auth settings (bind, exposure, public base URL, allowed hostnames). |
| `sudo journalctl -u paperclip -f` | Tail server logs. |

### Notable corrections from the VPS guide vs other docs

**`paperclipai configure --section` valid sections:** `llm`, `database`, `logging`, `server`, `storage`, `secrets`. Auth URL settings live under `server` section — **NOT a separate `auth` section**. The doctor error message that suggests `--section database` for auth issues is misleading per the installation page.

---

## 31. Desktop App (macOS, alternate distribution)

Not in scope for VeteranIntel (Gill is on Windows + paperclip is in a git clone). Recording for reference if/when a macOS device joins the workflow.

### Source
GitHub releases at `aronprins/paperclip-desktop`. Two builds:
| Mac chip | File |
|---|---|
| Apple Silicon (M1/M2/M3/M4) | `Paperclip.Desktop-[version]-arm64.dmg` |
| Intel | `Paperclip.Desktop-[version].dmg` |

### Install
Open DMG → drag Paperclip icon to Applications. Eject DMG. First launch may trigger macOS unsigned-developer warning ("can't verify the developer") — click Open to proceed. First launch takes 10-30 seconds for local server startup.

### First-launch mode choice
- **Local** — full paperclip instance on the Mac. Data stays local except for outbound API calls.
- **Remote** — Desktop app as thin client over a hosted paperclip instance. Used when joining a team server (or Gill's hypothetical hosted instance from §30).

### Cross-project relevance
Mainly useful if/when Gill provisions a macOS device for paperclip ops. Currently zero relevance — Windows + monorepo clone is the operating model.

---

## 32. Inline corrections + additions to prior sections

These don't warrant new full sections but need to land in the doc for verification-first hygiene:

### §28 Environment Variables — storage var name discrepancy (FLAGGED)

Two official paperclip docs use different env var names for the storage backend:
- **Environment Variables page (§28 here):** `PAPERCLIP_STORAGE_PROVIDER`
- **Installation page (this batch):** `PAPERCLIP_STORAGE_MODE=s3`

Both come from official paperclip docs. Either could be canonical, both could be aliases, or one could be deprecated. **I have not verified which form the server actually reads.** Per verification-first: if storage config becomes operational for VeteranIntel, run `paperclipai env` against the running instance and check which form appears in the resolved env — that's the canonical answer.

### §28 Environment Variables — embedded Postgres port (NEW VERIFIED)

Embedded PostgreSQL runs on **port 54329** (per Installation page Quickstart defaults). Data at `~/.paperclip/instances/default/db`. Not externally relevant — embedded Postgres is loopback-only — but useful for diagnosing port conflicts if multiple instances or another local Postgres collides.

### §28 Environment Variables — `PAPERCLIP_BIND` (NEW)

Beyond the `HOST=0.0.0.0` pattern documented in §29 Tailscale, the CLI accepts `PAPERCLIP_BIND` with values:
- `lan` — bind to LAN interface
- `tailnet` — bind to Tailnet interface
- `custom` — use `PAPERCLIP_BIND_HOST` for the address

This is a higher-level abstraction over `HOST=0.0.0.0` and is what `pnpm dev --tailscale-auth` sets internally.

### §15 CLI Commands — `auth bootstrap-ceo` full flags (EXTENDS §15)

Beyond the flags documented in §15:
- `--force` — rotate the invite token
- `--expires-hours N` — link lifetime in hours
- `--base-url <URL>` — override the URL used for the invite link
- `--db-url <URL>` — point at an external database (e.g., when claiming on a non-embedded Postgres)

### §22 Deployment Modes + §23 Local Development — embedded Postgres root refusal (NEW)

**Embedded PostgreSQL refuses to run as a root or administrative user.** Error message: `Execution of PostgreSQL by a user with administrative permissions is not permitted`. Affects:
- `pnpm dev` started under elevated PowerShell on Windows
- `npx paperclipai run` started via `sudo` on Linux/macOS
- Any cron/systemd unit that runs as root

For VeteranIntel: Rafa's user identity (`gillon.marchetti@veterananalytics.com` or the SA `rafa-cli-ops@`) running paperclip would not be a root user on Gill's Windows machine, so this constraint shouldn't bite directly — but worth recording if we ever script paperclip startup via elevated automation.

### Operational note from Key Concepts page — approvals don't expire

> "Approvals don't expire on their own. If an approval is pending, agents that are waiting on it will pause at that point until you take action."

This matches what we observed with the VETA hires sitting in `pending_approval` between S88 close and S89 close. Worth noting for any future SESSION-CLOSE checklist — if an agent has a pending approval, surface it explicitly so it doesn't stall indefinitely.

### Cost expectation baseline from Installation page

Paperclip docs state: **"$5–20 to play with the product, $20–100/month for an active company."** Useful baseline for the $40/$80 VETA agent budgets set per `agents/PHASE1_HIRES_S88.md` — they sit at the lower end of "active company" territory, which is the right shape for two engineers.

---

## 33. Quickstart Workflow Reference (CEO bootstrapping)

Recorded for cross-project use if/when a new paperclip company is stood up (e.g., a hypothetical Audiopheliac company beyond the placeholder Operator agent). The mechanics for VETA are different because VETA was created without a CEO — Backend + Frontend Engineers were hired flat per S89 cutover.

### Standard "create a company from scratch" flow
1. **Create company** with name + goal. Goal is the north star; every task traces back to it. Good goals are specific + measurable ("$10K/mo MRR by Q3", "Ship MVP by May 1") rather than vague ("grow the business").
2. **Hire CEO as first agent**. CEO is the special role — no `reportsTo` (reports to board = Gill). All subsequent agents need a `reportsTo` per §32 chain-of-command rules (within-company only).
3. **CEO heartbeat fires** on schedule or via manual "Run Heartbeat" button. First heartbeat: reads goal → assesses state → produces strategic plan → submits as `approve_ceo_strategy` approval → waits.
4. **CEO cannot create tasks or assign work until strategy approved.** First governance gate.
5. **Board reviews strategy** (approve / reject / request-revision per §8). Strategy includes: goal interpretation, proposed projects/focus areas, initial task set, intended team structure.
6. **On approval**, CEO wakes automatically and starts creating + assigning tasks. With no reports yet, CEO assigns to itself — expected behavior.
7. **Hire reports** via `hire_agent` approval flow (per §8). CEO can propose hires; board approves.

### CEO budget guidance (from official Quickstart)
> "$30–50 per month is a reasonable starting point for a CEO. The CEO is typically the most active agent — it runs on every heartbeat and does more complex reasoning than worker agents. Budget it slightly higher than you would a worker."

VETA's $40 soft / $80 hard for Backend + Frontend engineers fits the "worker" tier shape. If a CEO ever joins VETA, $30-50 would be the starting hard cap.

### Default models for CEO agents (per Quickstart)
- `claude_local`: `claude-opus-4-6` for CEO (most capable, best for strategy), `claude-sonnet-4-6` for workers
- `codex_local`: `gpt-5.3-codex` is the documented Quickstart default

VETA agents currently run `claude-sonnet-4-20250514` per state.json — that's a worker-tier model choice, consistent with Backend+Frontend engineer roles.

### CEO first-heartbeat duration expectation
"A few minutes" per Quickstart. Subsequent routine heartbeats are faster. Worth knowing when diagnosing "agent stuck in running" — the 30-minute threshold per Quickstart is when stalling becomes suspect.

### Manual heartbeat invocation
"Run Heartbeat" button on the agent detail page triggers a heartbeat immediately, no schedule wait. CLI equivalent: `paperclipai heartbeat run --agent-id <id>` per §15. API equivalent: `POST /api/agents/{id}/heartbeat/invoke` per §5.

---

## 34. Glossary Additions (terms not previously captured)

| Term | Definition |
|---|---|
| **Atomic checkout** | Mechanism preventing two agents from working on the same task simultaneously. When agent moves task to `in_progress`, claims exclusive ownership. Concurrent claim attempts → one is rejected. Already documented in §7 issue checkout — this is the official term for the behavior. |
| **Heartbeat protocol** | The sequence an agent follows during each heartbeat: check identity + instructions → review task assignments → select work → check out task → execute → post updates → close. Useful framing for understanding what `paperclip` bundled skill provides — it's the prompt encoding this protocol. |
| **Wake on mention** | A configurable agent run policy option. When enabled, @-mentioning the agent in a task comment fires a heartbeat immediately. Disabling prevents @-mention-driven wakes (useful if an agent shouldn't react to mentions in threads it doesn't own). |
| **Issue ≡ Task** | API and some UI use `issue`; UI guides use `task`. Same entity. URL paths and the API use `issue`. |
| **Run transcript** | The full conversation an agent had with the AI model during a heartbeat — every step, decision, tool call. Accessible via Agents → CEO → Runs → click run. Diagnostic tool for "why did the agent do X" questions. |
| **Board operator** | Official term for the human owning + managing a paperclip company. That's Gill. Has full override power: set goal, review approvals, manage budgets, override any agent or task. |
| **Control plane** | The central paperclip system orchestrating agents — agent registry, task assignment, budget tracking, goal hierarchy, heartbeat scheduling, approval queue. Does NOT run agents directly — adapters run agents, which report back to the control plane. |
| **Delegation** | The process by which a manager agent (typically CEO) assigns tasks down to its reports. Mechanism that turns goals into distributed autonomous work. |

### "Wake on mention" — flagging for VETA setup
This is a per-agent run-policy toggle that wasn't surfaced in the §5 agent config fields documented earlier. When we get to VETA post-approval setup, check whether VETA Backend + Frontend have wake-on-mention enabled by default. If a paperclip board comment thread @-mentions them and they're not configured to wake, the conversation will stall until next scheduled heartbeat.

---

## 35. Final operational checklist for the VETA loop

Synthesized from the full reference doc, ordered by what should happen before VETA agents take real work.

### Pre-flight (P0 items, sequenced)
1. **Verify paperclip is running.** From the monorepo: `pnpm dev` from `C:\Users\gillo\paperclip\`. From anywhere: `npx paperclipai run`.
2. **Liveness probe.** `GET http://localhost:3100/api/health` → expect `{"status":"ok"}`. If timeouts or 5xx, run `paperclipai doctor` first.
3. **VETA agents in `active` (not `pending_approval`) state.** Per S90 SESSION-INIT, both Backend (`2f3c7b0f-...`) and Frontend (`2ed47d41-...`) showed `active`/`idle`. Confirm before kicking work.
4. **Secret hygiene** (§27): VETA agent `adapterConfig.env` uses `secret_ref` for `ANTHROPIC_API_KEY`, NOT inline plaintext. If inline values exist from S88 setup, run `pnpm secrets:migrate-inline-env --apply` from the paperclip clone before enabling heartbeats.
5. **`config.llm.apiKey` empty.** Plaintext-only field; should not contain a real value. Verify via `paperclipai env`.
6. **Strict mode enabled going forward.** `PAPERCLIP_SECRETS_STRICT_MODE=true` in env to prevent future inline regression.
7. **Budget caps set.** `PATCH /api/agents/{id}/budgets` with `budgetMonthlyCents: 8000` (hard $80) + policy upsert with `warnPercent: 50` (warn $40) per S88 plan. Hard-stop pauses agents at 100% per §10.
8. **Routing question resolved** (§18 flag): Is "engineering:debug etc." in the S88 hire plan referring to (a) paperclip skills to import via `POST /skills/import` or (b) Claude Code skills that load independently? Best answer per architectural review is (b) — no paperclip skill imports needed for the VETA setup. Confirm with Gill.

### SESSION-INIT awakening sequence (post-pre-flight)
```powershell
# Single-call snapshot per company
npx paperclipai dashboard get -C 9867b6c7-5c6e-47bd-bfeb-aedb74131f37 --json   # VETA
npx paperclipai dashboard get -C <VAL-id> --json                                # VAL parent

# If any company shows tasks.open > 0 AND agents.active > 0 AND agents.running == 0:
npx paperclipai heartbeat run --agent-id <agent-id>
# Streams live logs, returns run object OR { "status": "skipped" } with reason

# If pendingApprovals > 0: surface for Gill action
npx paperclipai approval list -C <id> --status pending --json
```

### What each VETA agent will see on wake (per §28 agent runtime injection)
- `PAPERCLIP_AGENT_ID`, `PAPERCLIP_COMPANY_ID`, `PAPERCLIP_API_URL` — always
- `PAPERCLIP_API_KEY` — short-lived JWT for self-call back to paperclip
- `PAPERCLIP_RUN_ID` — must echo as `X-Paperclip-Run-Id` on any mutating request
- `PAPERCLIP_TASK_ID` + `PAPERCLIP_WAKE_REASON` — context for why this run happened
- Optional `PAPERCLIP_WAKE_PAYLOAD_JSON` — pre-fetched issue summary + comments (adapter-dependent)

### After first heartbeat, watch
- **Run transcript** under Agents → Backend/Frontend → Runs for what actually happened
- **Activity feed** (§12) for cross-agent diff over time
- **Cost telemetry** (§10) — if either agent approaches its `warnPercent` faster than expected, investigate before hard-stop pauses work
- **Approval queue** — `hire_agent` or `request_board_approval` from VETA agents should not be silently ignored (approvals don't expire — agent waits indefinitely per §32 Quickstart note)

---

## 36. UI Triage Surfaces — Dashboard, Issues, Inbox, My Issues

These are the human-facing pages a board operator (Gill) uses for daily triage. Important to understand because Sully and Lena often need to advise on what surface to use for what question.

### Dashboard
Single page at company-scoped URL. Sections:

**Agents panel** — counts by state:
| State | Meaning |
|---|---|
| Active | Enabled and ready. Idle agents counted here. |
| Running | In a heartbeat right now. |
| Error | Last heartbeat failed. Not working, didn't stop gracefully. **Doesn't fix itself.** |
| Paused | Stopped deliberately OR by budget hard-stop. |

**Overview cards** (4 across the top): Agents Enabled, Tasks In Progress, Month Spend, Pending Approvals.

**Recent Activity feed** — pulse check, not deep investigation. Wraps the same data the `/api/companies/{id}/activity` endpoint surfaces (§12). For real investigation, use the dedicated Activity Log page.

**Refresh model:** Dashboard refreshes in real time. No reload needed. Running heartbeats appear and resolve within minutes.

### Issues page
The exhaustive index of every issue in the company. Full filter/group/sort surface.

**Filter bar:** status, priority, assignee, project, labels, execution workspace (when isolated workspaces enabled). Multi-select.

**Search:** URL-bound `?q=` parameter — shareable filtered views.

**Common filter combinations worth memorizing:**
| Filter | Use |
|---|---|
| `status=blocked` | Everything waiting for intervention |
| `assigneeAgentId=<id>` | One agent's full workload |
| `status=in_review` | Done work awaiting sign-off |

**Group by:** `None`, `Type`, or `Workspace` (when isolated workspaces enabled).

**Nesting toggle:** collapse parent/child into a tree.

**Column picker:** persists per view; choose which trailing columns are visible.

**Live run indicators:** poll every 5 seconds via the live-runs endpoint. Issues with an agent actively running show a live indicator without page refresh.

### Inbox — Human triage queue

URL pattern: `/inbox/<tab>`. Switching tabs navigates (not just hide/show), so each tab view is bookmarkable.

**Four tabs:**
| Tab | What's there |
|---|---|
| **Mine** | Issues + approvals assigned to you or created by you, filtered to active statuses (todo, in_progress, in_review, blocked). Empty state reads "Inbox zero." |
| **Recent** | Recently-touched issues including ones you've commented on, been mentioned in, or previously owned — adjacent work |
| **Unread** | Subset of Recent with new activity you haven't seen. Blue-dot indicator. |
| **All** | Firehose. Has additional **Category** selector: `All categories` / `My recent issues` / `Join requests` / `Approvals` / `Failed runs` / `Alerts`. When Approvals visible, secondary **Approval status** selector: `All approval statuses` / `Needs action` / `Resolved`. |

**Archive (Mine only):** Inline archive button. Removes from your Mine view WITHOUT changing the underlying issue/approval status. Hidden on other tabs.

**Mark all as read:** Toolbar button when current tab has unread items. Confirmation dialog ("This will mark N unread items as read"). Does NOT archive or change status.

**Unread leading-slot states (per row):**
- `visible` — blue dot for unread activity
- `fading` — dot transitioning out after mark-read
- `hidden` — no indicator, no space reserved
- `null` — slot not present on this row type

On Mine, the same leading slot hosts the archive button when row is archivable.

**Toolbar mirrors Issues page:** search (`q` URL parameter), filter popover (assignees, creators, projects, labels, routine visibility, workspaces), group-by, column picker, nesting toggle.

### My Issues — personal open queue

Lighter sibling to Inbox. Shows **open issues with NO agent assignee**:
- `assigneeAgentId` is empty
- `status` is not `done` and not `cancelled`

Single list, no tabs. Different lens from Inbox:

| | Inbox | My Issues |
|---|---|---|
| Purpose | Triage everything waiting on you | Personal open queue |
| Surfaces approvals + failed runs | Yes | No |
| Shows unread markers | Yes | No |
| Includes participant issues | Yes | No |
| Archive per-row | Yes (Mine only) | No |
| Tabs | 4 | None |

**In practice:** Inbox → Mine for day-to-day triage. My Issues when you want the plain list of things sitting on you because no agent has been assigned yet.

---

## 37. Issue Detail — Sidebar, Chat tab, Activity tab

The issue detail view is where humans + agents interact on a specific piece of work. Three primary surfaces.

### Sidebar (Issue Properties panel)

Live editors — changes save immediately, visible to agent on next heartbeat. Full field list:

| Field | Notes |
|---|---|
| Status | Lifecycle status. Click icon → picker. |
| Priority | `critical` / `high` / `medium` / `low` |
| Labels | Company-scoped, freeform with color. Create from picker by typing name + choosing color. |
| Assignee | Agent OR user. Arrow button → agent profile page. **Assigning to agent fires wake-on-assignment heartbeat by default.** |
| Project | Deep-links to project page |
| Parent | Parent issue this one is a subtask of. `parentId` ties work into a tree the CEO can reason about. |
| Blocked by | List of issues blocking this one. While unresolved, agents treat this issue as not-startable. |
| Blocking | Inverse view (read-only from this side; edit from the other) |
| Sub-issues | Direct children. Inline "Add sub-issue" button. **Children inherit execution workspace linkage from parent server-side.** |
| Reviewers | Agents or users that must review before completion. **"Run review" button appears when the review stage is the next runnable execution stage.** |
| Approvers | Same as Reviewers but for approval stage. Same Run-stage button behavior. |
| Execution | Current execution stage label (e.g., `Review pending with <participant>` or `Approval requested changes by <participant>`). Read-only; driven by execution policy. |
| Depth | Depth in parent hierarchy |
| Workspace | When isolated execution workspaces enabled, the workspace this issue's runs happen in |
| Branch | Git branch for current execution workspace |
| Folder | Local folder for current execution workspace |
| Created by | User or agent |
| Started / Completed / Created / Updated | Lifecycle timestamps |

**Issue Workspace card** (above tabs, separate from sidebar) — summarizes project + execution workspace binding. Visible even when sidebar collapsed.

**Attachments section** (above tabs) — images as thumbnails opening in gallery modal; non-image as file rows with content-type + size. Upload from detail view (empty state or inline button).

### Keyed documents (load-bearing concept)

Issues carry **keyed documents** alongside description. Most common key: `plan`.

Properties:
- Stable key (`plan`, or any other the agent picks)
- Versioned — every save creates a revision
- Deep-linkable via `#document-<key>` on the issue URL

**Best practice:** plans live in keyed documents, NOT appended to description. When an agent updates the plan, it leaves a comment "I updated the plan" with a link to `#document-plan`.

### Chat tab (default tab)

Combines four data streams into one timeline:
1. **Comments** — paginated, "Load older" control when `hasOlderComments` true
2. **Active run** — if agent currently running on this issue, streaming run card pinned in timeline. Driven by `executionRunId` + `activeRunForIssue` endpoint, **polled every 3 seconds** when no live runs active
3. **Live runs** — concurrent runs against this issue, each with its own card. **Polled every 5 seconds** from `liveRunsForCompany` / `liveRunsForIssue`
4. **Historical runs** — completed runs linked to this issue, collapsed cards. Expand to read past heartbeat transcripts.

### Chat composer affordances (more than just text)

| Feature | Notes |
|---|---|
| `@mention` picker | Type `@` to open. Resolves to structured `[@Agent Name](agent://<agent-id>)`. **Mentioning an agent fires a wake heartbeat for that agent when posted.** |
| Reassignment on comment | If your comment is directed at a different participant, composer offers to reassign + comment in one action |
| Image attachments | Paste / drop / attach. Upload inline, render as thumbnails. Click → gallery modal. |
| File attachments | Non-image. Upload to issue, render as file rows beneath comment. |
| Voting | Up/down on each comment. Feeds the feedback system. AI-training data-sharing preference shows terms link when relevant. |
| **Interrupt control** | When a new run has been queued off your last message but hasn't started, composer shows interrupt control — cancel before agent wakes. |
| Draft persistence | Unsent text saved to `localStorage` key `paperclip:issue-comment-draft:<issueId>`. Survives refresh. |
| Disabled reasons | When commenting not allowed (terminal status, workspace unavailable), composer surfaces specific reason instead of silent failure. |

### Run-id binding (audit trail)

Every agent comment is bound to the heartbeat run that produced it (`X-Paperclip-Run-Id` header). In Chat tab:
- Expand any agent comment to see which run produced it
- Historical runs show their comments as children of the run card

This is what makes Chat auditable — trace any agent statement back to the exact heartbeat that produced it.

### Activity tab — read-only forensic log

Three streams:
1. **Activity events** — status transitions, reassignments, priority changes, label changes, lifecycle (`created`, `released`, `archived`)
2. **Linked runs** — every heartbeat that touched this issue. Tab aggregates input/output/cached tokens + cost into an **issue cost summary** — at-a-glance cost per issue
3. **Linked approvals** — approval cards at top. Show requesting agent + inline **Approve** and **Reject** buttons when viewer has permission. Same effect as deciding at `/approvals/<id>`.

**Activity tab is read-only.** No input. Use Chat for anything the agent should see.

---

## 38. Approval UI Detail (extends §8)

### Approval list page

Two tabs:
- **Pending** — `pending` state + `revision_requested` (still actionable; counts toward yellow pill)
- **All** — full history including approved/rejected/resolved

Sorted newest first. Each row: type, requesting agent, summary, status badge.

### Hire approval detail (`hire_agent`)

Three-part layout:
1. **Header card** — type icon, proposed agent name + role, status badge, approval id
2. **Proposal payload** (structured summary):
   - Proposed agent name + title
   - Role + freeform capabilities description
   - Adapter type + sanitised adapter config (working dir, env var NAMES, non-secret fields)
   - Reporting line — who this hire would report to
   - Requested monthly budget
3. **"See full request" expander** — raw JSON payload for rare cases when the summary skips a field you need

Plus a **Comments section** below the proposal — notes/clarifying questions on the approval. **Approval comments are visible to the requesting agent the next time it wakes.** Direct interaction channel.

### Strategy approval detail (`approve_ceo_strategy`)

Same three-part layout, different payload:
- **Plan body** rendered as markdown — headings, bullets, links from CEO appear formatted
- **Linked issues** — if CEO already seeded draft tasks tied to the strategy, they appear as clickable issues underneath. **Approving does not close them; they stay open for CEO to refine on next run.**
- **Decision note** — any note left via Request Revision shows here after resolution

### Decision buttons

Every actionable approval (`pending` or `revision_requested`) shows three buttons:

| Button | Effect |
|---|---|
| **Approve** | Hire: agent created + configured + queued to wake automatically. Strategy: CEO queued to wake automatically; follow-up run usually appears shortly after. Approval → `approved`. |
| **Reject** | Permanently denied. Hire: position not created; agent notified, won't retry. Strategy: CEO must create new strategy from scratch. **For rejected hires: extra "Delete disapproved agent" button to clear the placeholder record from the org.** |
| **Request Revision** | Approval → `revision_requested`. Requester revises on later run, resubmits → back to `pending`. Leave a comment with concrete direction. No limit on revision cycles. |

**Budget approvals are different.** Approve/Reject buttons are HIDDEN on approval detail. Resolved from the **Costs page** budget controls instead. The detail view links you there.

### Full lifecycle
```
pending → approved
       → rejected
       → revision_requested → resubmitted → pending (again)
```

### Tip from the docs worth recording
> "Request Revision is almost always the right choice when the proposal is directionally right but needs tweaks — adjusting a budget, changing a reporting line, or tightening a strategy's scope. Reject only when the proposal is fundamentally wrong or no longer relevant."

### Board override powers (always available, no approval needed)
- Pause any agent — stops it until you resume
- Resume any agent — restarts a paused agent
- **Terminate** — permanently shuts down + preserves as terminated record (NOT destructive)
- **Delete** — destructive action (NOT same as terminate)
- Reassign any task — at any time
- Create agents directly without going through CEO hire flow

> **Per docs verbatim:** "If you might want the agent back, pause it instead." Terminate is preferable to delete unless you're certain.

---

## 39. Cross-project notes (VeteranIntel + Audiopheliac)

These UI surfaces apply uniformly to every paperclip company. Operational notes per VAL project:

### VeteranIntel (VETA company)

- **Inbox → Mine** is the right surface for Gill's day-to-day VETA triage once agents are taking real work
- **Issues page filter `assigneeAgentId=2f3c7b0f-...`** (Backend) or `2ed47d41-...` (Frontend) for per-agent workload views
- **Chat tab @mention** of `@Backend Engineer` or `@Frontend Engineer` will fire wake heartbeats for those agents — useful for directing mid-work
- **Keyed documents (`plan`)** should be where VETA agents store their plans for VET-* tickets, NOT in the description. Deep-linkable for cross-product references.
- Currently 0 issues open under VETA (per S90 SESSION-INIT). The Inbox → Mine view will be empty until work is seeded.
- VAL parent has 38 open issues — Gill's actual current triage surface for the legacy VET-* bundle

### The Audiopheliac

- Operator agent pending hire per state.json (S88 plan); not yet active
- Once active, Audiopheliac will get its own Inbox/Issues/My Issues at `/inbox/mine` scoped to the Audiopheliac company id
- The audiopheliac-studio-environment skill (per skills-plugin) is a Claude Code skill, not a paperclip skill — same flag as the VETA skill-import ambiguity in §18. The Operator agent's adapter (assumed `claude_local` per pattern) would load it from `~/.claude/skills` if installed there, NOT via paperclip company-level skill import.
- For studio-flow ticketing: keyed documents would be useful for storing signal-chain diagrams or session notes per issue. Plans for a recording session, mastering chain, or release prep are exactly the kind of thing keyed docs are designed for.
- Cost expectations: the docs' "$20-100/month for an active company" applies to a meaningful Operator workload. If Audiopheliac Operator runs heartbeat once daily on a routine, expect cost at the low end of that range.

---

## 40. Costs UI Deep-Dive (extends §10)

The Costs page has five tabs sharing a date-range selector + four headline tiles (Inference spend, Budget, Finance net, Finance events). Each tab answers a different question.

### Overview tab — health snapshot
Inference ledger card:
- Total inference spend in selected range
- `Budget $X.XX` OR `Unlimited budget` when no cap configured
- Token count in side box
- **Utilization bar color thresholds:** Green <70%, Yellow 70-90%, Red >90%
- Caption: e.g., "62% of monthly budget consumed in this range"

Finance ledger card: Debits / Credits / Net / Estimated (same as page header, expanded).

By agent card (most useful for debugging):
- Per agent: name, terminated badge if retired, total cost, token breakdown (`in <input+cached> · out <output>`), run-type split (`N api · N subscription`)
- **Caret expand → per-model breakdown** showing `provider / model / billingType` rows. This is the diagnostic surface for "why is this agent expensive" — runaway model vs healthy mix.

By project card: Paperclip attributes run costs to a project when the run was triggered by an issue belonging to that project. Non-project-attached runs appear as `Unattributed`.

Finance timeline (compact): Most recent 6 account-level events.

**Active budget incident cards (top of Overview):** Up to 2 surfaced when scopes have breached hard-stop. Each card has scope, breach details, **Keep paused** or **Raise budget and resume** buttons inline.

### Budgets tab — control plane
Top metrics: Active incidents, Pending approvals, Paused agents, Paused projects. All four zero = clean posture.

Active incidents section:
- Scope + name (company / agent / project)
- Policy details (configured cap vs actual spend)
- **Keep paused** — acknowledge breach, leave paused, resume naturally at month rollover
- **Raise budget and resume** — input new cap, immediately un-pause

Per-scope sections: Company budgets, Agent budgets, Project budgets — one policy card each with editable amount + Save.

**Recommended budgets per role** (from official Quickstart cost guide):

| Role | Typical monthly budget |
|---|---|
| CEO | $30-50 (runs frequently, high context per run) |
| Manager (CTO, CMO, etc.) | $20-40 (active but more focused than CEO) |
| Worker (engineer, writer, etc.) | $10-25 (executes tasks, less strategic reasoning) |

VETA Backend + Frontend at $80 hard cap each are above the "worker" recommendation. That's a deliberate choice; if costs come in lower than expected we can tighten.

**Resuming paused agents:**
1. Increase budget — agent resumes immediately, doesn't wait for month rollover
2. Wait for month reset (1st of UTC month) — all monthly budgets reset to zero, agent auto-resumes UNLESS manually paused

> If you don't want an agent to resume automatically at month rollover, manually pause it first.

### Providers tab — "who ran the inference"
Sub-tab bar: `All providers` aggregate + one per provider with name/tokens/cost in the tab label.

ProviderQuotaCard per provider:
- Per-model spend (input / cached-input / output / dollars)
- Current-week spend (independent of range selector)
- Share of company monthly budget (with deficit notch if projected to overshoot at current burn — only shown when range = Month-to-date)

**Quota windows** (subscription plans only — Anthropic Pro/Max with 5h/daily/weekly caps): Paperclip queries provider for window label, % consumed, reset countdown, data source (provider API / estimated / cached). Errors surface inline.

**Window spend:** What the provider cost inside each active quota window. Distinguishes burst vs evenly-distributed usage.

### Billers tab — "who charged me"
Different from Providers — answers the invoicing question, not the execution question. Most setups have Provider == Biller, but diverge when:
- Claude via subscription plan (Anthropic biller + provider, but subscription pricing) vs API (Anthropic biller + provider, pay-per-use pricing)
- Gateway / reseller handles billing on your behalf

BillerSpendCard per biller: total range spend, current-week spend, share of company budget, per-provider-within-this-biller breakdown.

**Reconciling invoices:** When the provider invoice lands, the number should match the Biller card's running total. If not, drill into per-provider/per-model rows + compare timestamps against provider's usage dashboard.

### Finance tab — account-level ledger
Everything that isn't per-request inference: subscription fees, invoice reconciliations, credit top-ups, refunds, adjustments.

Sections:
- Finance summary (4 expanded metric tiles)
- By biller (FinanceBillerCard) — debits, credits, event count per biller
- Finance timeline (chronological event list with type, amount, biller, timestamp, estimated/authoritative flag)
- By kind (FinanceKindCard) — groups by event kind: subscription debits vs credits vs adjustments

**Estimated vs authoritative semantics:** Provider invoice is source of truth. Until reconciled, Paperclip's subscription-day numbers are estimates (typically plan price ÷ billing cycle length). Once real invoice imported, estimated flag flips off → authoritative.

The **Estimated** metric at top shows how much of the ledger is still provisional. Small = invoice-backed. Large = waiting for reconciliation.

**Finance export:** Supports external accounting reconciliation. Export carries same fields as timeline rows.

### Cost-saving tactics from official Quickstart
| Tactic | Mechanism |
|---|---|
| Use cheaper model for workers | Set in agent's adapter config. Claude Sonnet vs Opus for routine work. |
| Reduce heartbeat frequency | Every-15-min agent uses ~4× the calls of every-hour agent. |
| Tighter task descriptions | Agents read full task + context + history per heartbeat. Open-ended tasks with long context = compounding cost. |
| Pause off-hours | Manually pause at end-of-day, resume in morning if 24/7 not needed. |
| Watch first-few-runs cost | Check per-run cost on agent detail page after first heartbeats. Long context chains, excessive tool use, misconfigured prompts inflate cost. |
| Prefer subscriptions when usage predictable | Anthropic Pro subscription cheaper than pay-as-you-go for steady workloads. Use Providers tab quota-window view to confirm headroom. |
| Reconcile finance regularly | Import real invoices monthly. Catches pricing changes early. |

---

## 41. Activity Log UI extensions (extends §12)

Activity Log = complete permanent record of every mutation. Already covered in §12 as the audit-trail API. Adding UI specifics:

**Filter (current UI):** Filter by entity type — narrows to tasks only / agents only / approvals only / budget events only.

**Permanence:** Activity records are kept permanently. Unlike agent run transcripts (per-run, can scroll off), activity is the durable audit basis.

**Comments vs Activity distinction (load-bearing):**
- **Comments** on a task = what the agent SAID + REASONED about while working. Conversational, narrative.
- **Activity** = STRUCTURAL changes (status transitions, assignments, approvals, budget events).

Use comments when you want to understand what the agent was thinking. Use activity when you want to understand what actually changed and when.

### Debug recipes (from official docs)
| Question | Approach |
|---|---|
| "Why was a task reassigned away from agent X?" | Filter by entity type, open issue, look for assignment events — shows when + who reassigned |
| "When did an agent start spending so much?" | Filter to budget/run events, look for spikes correlated with task assignment (often new task = larger context = bigger cost) |
| "Who approved this hire?" | Filter `entity type = approval`, open the hire approval, approval event shows decision actor + timestamp |
| "Why isn't the agent doing anything?" | Filter by entity, check most recent events. Last event tells current state: paused? last heartbeat failed? completed with no tasks? No heartbeat events at all → schedule may not be enabled. |
| "Task stuck `in_progress` for hours with no comments" | Open task from feed, look for heartbeat events. Heartbeats completing but no task updates → agent running but not progressing. Read recent comments. No heartbeat events → check pause status or budget hit. |

---

## 42. Feedback & Voting — NEW concept (load-bearing for governance)

Every agent comment + document revision can be rated **Helpful** (thumbs up) or **Needs work** (thumbs down). Optional reason text on thumbs-down.

### ⚠️ COI HOLD + CORPUS SEPARATION FLAG

**First-vote consent dialog asks: Keep local OR Share with Labs.** Choice is saved per-company and changeable later.

**Shared votes ship a full trace bundle to `https://telemetry.paperclip.ing` (default) — including the full agent comment payload, the issue context, and reason text.**

Per VeteranIntel CLAUDE.md §30 (COI Hold) and §7 (Corpus Separation): **VeteranIntel must default to "Keep local" sharing posture.** Any agent output touching 217A corpus content or VA OGC Southeast ethics inquiry substance cannot leak to an external AI system, which paperclip.ing's telemetry backend categorically is.

**Operational rule for VeteranIntel sessions:**
1. Set sharing preference to **Keep local** on first vote in the VETA company
2. Verify per-company preference in feedback settings
3. NEVER toggle to "Share with Labs" for any VETA work without explicit Gill approval AND verification the agent output contains no 217A or compensation-related content

For Audiopheliac — no equivalent restriction. Sharing posture is Gill's call based on whether studio session content is okay to ship.

### What gets stored on each vote
| Record | Contents |
|---|---|
| **Vote** | Direction (up/down), optional reason, sharing preference, consent version, timestamp |
| **Trace bundle** | Full context snapshot: voted-on comment or revision, issue title, agent info, vote, reason — everything to understand feedback in isolation |

Lives in local paperclip DB. If marked `shared`, paperclip immediately POSTs to telemetry backend (compressed). Failed uploads enter `failed` state for retry on later flushes.

### Lifecycle states
| Status | Meaning |
|---|---|
| `local_only` | Stored locally, not marked for sharing |
| `pending` | Marked for sharing, waiting for upload |
| `sent` | Successfully transmitted |
| `failed` | Upload attempted but failed — retried on later ticks. `failureReason` populated. |

**Local DB always retains the full vote + trace regardless of sharing status.** Sharing only adds an outbound push.

### CLI surface
```powershell
# Quick colour-coded summary in terminal
paperclipai feedback report

# Point to specific server/company
paperclipai feedback report --api-base http://127.0.0.1:3000 --company-id <id>

# Include raw payloads
paperclipai feedback report --payloads

# Full export to timestamped directory + zip
paperclipai feedback export
paperclipai feedback export --api-base http://127.0.0.1:3000 --company-id <id> --out ./my-export
```

Export directory structure:
```
feedback-export-YYYYMMDDTHHMMSSZ/
  index.json                    # manifest with summary stats
  votes/
    <ISSUE>-<hash>.json         # one vote record per file
  traces/
    <ISSUE>-<hash>.json         # Paperclip feedback envelope
  full-traces/
    <ISSUE>-<hash>/
      bundle.json               # full export manifest
      ...raw adapter files      # codex/claude/opencode session artifacts
feedback-export-YYYYMMDDTHHMMSSZ.zip
```

### Per-adapter session artifacts in full-traces (forensic value)
| Adapter | Files exported |
|---|---|
| `codex_local` | `adapter/codex/session.jsonl` |
| `claude_local` | `adapter/claude/session.jsonl` + `adapter/claude/session/...` sidecar files + `adapter/claude/debug.txt` when present |
| `opencode_local` | `adapter/opencode/session.json` + `messages/*.json` + `parts/<messageId>/*.json` + optional `project.json`/`todo.json`/`session-diff.json` |

Text stored as UTF-8 with `contents` field directly in bundle.json's `files[]`. Binary uses base64 with `encoding` marker. Files are inline, not separate paths.

### API endpoints (board-only)
| Path | Returns |
|---|---|
| `GET /api/issues/{id}/feedback-votes` | Votes on an issue |
| `GET /api/issues/{id}/feedback-traces?includePayload=true` | Traces on an issue |
| `GET /api/companies/{id}/feedback-traces?includePayload=true` | All traces company-wide |
| `GET /api/feedback-traces/{id}` | Single trace envelope |
| `GET /api/feedback-traces/{id}/bundle` | Full export bundle |

### Trace endpoint filters
| Param | Values |
|---|---|
| `vote` | `up`, `down` |
| `status` | `local_only`, `pending`, `sent`, `failed` |
| `targetType` | `issue_comment`, `issue_document_revision` |
| `sharedOnly` | `true` |
| `includePayload` | `true` |
| `from` / `to` | ISO date range |

### Remote sync mechanics
- App server builds bundle → POSTs to telemetry backend → updates trace status
- Default backend: `https://telemetry.paperclip.ing` when none configured
- Telemetry backend: authenticates → validates → compresses + stores → returns final object key
- Failed uploads → `failed` state with `failureReason` → background flush worker retries
- Object key pattern: `feedback-traces/<companyId>/YYYY/MM/DD/<exportId-or-traceId>.json`
- **Snapshot caveat:** Uploaded object is the bundle AT VOTE TIME. If you regenerate a local bundle later and the underlying adapter session has grown, local bundle may be larger than uploaded snapshot.

### Trace envelope shape (for reference)
```json
{
  "id": "trace-uuid",
  "vote": "down",
  "issueIdentifier": "PAP-123",
  "issueTitle": "Fix login timeout",
  "targetType": "issue_comment",
  "targetSummary": {
    "label": "Comment",
    "excerpt": "First 80 chars of the comment that was voted on..."
  },
  "payloadSnapshot": {
    "vote": { "value": "down", "reason": "Did not address root cause" },
    "target": { "body": "Full text of agent comment..." },
    "issue": { "identifier": "PAP-123", "title": "Fix login timeout" }
  }
}
```

---

## 43. Cross-project notes (Feedback + Costs)

### VeteranIntel

**Costs:**
- Use Costs → By agent expand to spot any individual VETA agent that's spending disproportionately
- Costs → Providers tab to verify Anthropic spend matches expectations (no stray Opus calls when sonnet is configured)
- Costs → Finance tab is where any Anthropic monthly subscription debits would land — keep authoritative invoices reconciled monthly
- If we ever switch VETA agents to Anthropic Pro subscription instead of pay-per-use API, the Providers tab quota-window view shows whether usage fits inside the 5-hour/daily/weekly windows

**Feedback (governance-sensitive):**
- **Default to "Keep local" sharing posture** for VETA company per §42 COI flag
- Use `paperclipai feedback report --company-id <vetaId>` periodically to review agent outputs Gill has rated thumbs-down — those are training signals for prompt refinement
- Full bundle export via `paperclipai feedback export` is the right path for analyzing agent failure modes without sharing externally
- The per-adapter session artifacts in `full-traces/` (claude_local: session.jsonl + sidecar + debug.txt) are the deepest forensic surface — useful when an agent produces wrong output and Gill wants to understand exactly what context led to it

### The Audiopheliac

**Costs:**
- Routine-driven Operator agent (when active) is the easier cost-control posture — heartbeat frequency under your control via routine cron rather than scheduled tick
- Audiopheliac doesn't have the 30s scheduler tick risk that comes with always-on agents — only fires when the routine fires
- Sharing posture for feedback can be more permissive than VETA — no 217A or COI constraints

**Feedback:**
- The trace bundle's full-traces export is a goldmine for studio decisions: when the Operator agent posts a recommendation about a signal chain or mastering chain, voting and exporting the trace preserves the reasoning for later review
- `audiopheliac-studio-environment` skill's responses would be the primary target type for voting
- Sharing votes back to paperclip.ing/telemetry would help the open-source community see how an unusual domain (audio production) shapes agent behavior — but that's Gill's call

---

## 44. Agent Instructions Bundle + AGENTS / SOUL / HEARTBEAT / TOOLS pattern (HIGH-VALUE for VETA prompt design)

The Instructions tab on each agent edits an **instructions bundle** — a folder of markdown files alongside the agent's working directory. Two modes:

| Mode | Behavior |
|---|---|
| **Managed** | Paperclip owns the filesystem layout. Edit through UI. |
| **External** | Point Paperclip at an existing `rootPath` on disk. Reads/writes there. Useful when instructions live in a repo you want to keep canonical. |

Every bundle has an **entry file**, usually `AGENTS.md`, that the adapter feeds the agent on every heartbeat. Other files exist but aren't auto-loaded — the entry file references them.

### The four-file convention (auto-seeded for CEO role)

When you create an agent with role=CEO, paperclip pre-populates the bundle with all four files. Other roles get a single `AGENTS.md`. The convention is the recommended pattern for senior or long-lived agents.

| File | Purpose | Answers |
|---|---|---|
| **`AGENTS.md`** | What you do — operating manual. Responsibilities, delegation rules, what to do personally vs delegate, escalation paths, safety rules. **Entry file.** | "What's my job?" |
| **`SOUL.md`** | Who you are — persona. Strategic posture, voice/tone, decision-making philosophy, what you care about. Durable character, not tasks. | "How should I think and speak?" |
| **`HEARTBEAT.md`** | How you execute — per-heartbeat checklist. Concrete steps to run every time. | "What do I do right now, in order?" |
| **`TOOLS.md`** | What you can use — notes on tools/APIs/skills available. Often starts as stub, grows organically. | "What's in my toolbox?" |

`AGENTS.md` ties the others together with a References section:
```markdown
## References
These files are essential. Read them.
- `./HEARTBEAT.md` — execution and extraction checklist. Run every heartbeat.
- `./SOUL.md` — who you are and how you should act.
- `./TOOLS.md` — tools you have access to.
```

### Why split (not optional reasoning — from official docs)

- **Each file has one reason to change.** Tweak persona without touching procedure. Update heartbeat flow without rewriting persona.
- **Model reads what matters first.** `AGENTS.md` short + action-oriented. Agent pulls in `SOUL.md`/`HEARTBEAT.md` as needed. Keeps entry context lean.
- **Mirrors human role thinking.** Job description / personality / daily routine / tools — four separate things, badly confused when mashed into one file.

### Writing `SOUL.md`

Short manifesto, not bulleted résumé. Lead with strategic posture, then voice/tone. Under ~40 short lines — longer and the model treats it as instructions to debate rather than identity to internalize.

**Good lines** (from official docs):
- "Default to action. Ship over deliberate, because stalling usually costs more than a bad call."
- "Be direct. Lead with the point, then give context. Never bury the ask."
- "In trade-offs, optimize for learning speed and reversibility. Move fast on two-way doors; slow down on one-way doors."

**Bad lines:**
- "Be helpful and professional." (too generic, no useful constraint)
- "When handling a P0 incident, first check the dashboard, then…" (that's procedure → belongs in `HEARTBEAT.md`)

**Test:** "If we hired a new human into this role, what would we want them to internalize about how this role thinks?" That's `SOUL.md`.

### Writing `HEARTBEAT.md` — official CEO template (8 numbered steps)

Boringly mechanical: "read this, call that, check this env var, comment, exit." Include exact API call or skill invocation. Script, not philosophy.

Official CEO default:
1. **Identity and context** — check `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, etc.
2. **Local planning check** — read today's plan from memory
3. **Approval follow-up** — if `PAPERCLIP_APPROVAL_ID` set
4. **Get assignments** — GET issues filtered by assignee + status
5. **Checkout and work**
6. **Delegation** — create subtasks with `parentId` and `goalId`
7. **Fact extraction** — extract durable facts to memory
8. **Exit cleanly**

Tailor per role:
- CTO: swap fact extraction → "review open PRs in the eng queue"
- CMO: add "check content calendar"

### Writing `TOOLS.md`

Often starts as stub: "Your tools will go here. Add notes about them as you acquire and use them." Living notebook the agent maintains. Quirks of specific tools, adapter gotchas, custom APIs.

### When the simple pattern is fine (single `AGENTS.md`)

Narrow-purpose worker — "summarize incoming support tickets," "post weekly metrics digest." Use multi-file when:
- Distinct personality matters (customer-facing, executives)
- Runs on timer with repeating per-heartbeat checklist
- Instructions exceed one screen and blend responsibilities + persona + procedure

**Always start single, split later.** Moving sections from `AGENTS.md` into `SOUL.md`/`HEARTBEAT.md` is a normal refactor.

### Inline image uploads in markdown editor
Drag-and-drop or paste → uploaded to company asset store → inserted as markdown image links.

### Save semantics
Floating Save/Cancel bar appears on dirty state. **Agent uses new instructions on NEXT heartbeat — existing runs in flight are not interrupted.** Click "Run Heartbeat" in agent header after save to see change immediately.

### Adapters without bundles
OpenClaw gateway + some remote providers collapse to a simpler editor. Same save semantics.

---

## 45. Configuration Revisions + Rollback (Configuration tab bottom)

Every save to agent configuration creates a revision with timestamp + changed keys + diff. Up to 10 most recent shown when expanded.

**Each revision row has a Rollback action.** Clicking it restores the agent to that exact configuration **atomically**. Rollback itself is saved as a new revision — you can always undo an undo.

**Operational pattern (from docs):** When a change breaks an agent and you don't have time to debug:
1. Pause the agent
2. Roll back to the last known-good revision
3. Resume
4. Investigate the bad change later

This is the right move when a VETA prompt experiment goes sideways — pause, rollback, resume, debug.

### Save flow
Edits are dirty-tracked. Floating Save/Cancel bar (desktop) or fixed bottom bar (mobile) appears on any field diff. Save is blocking ("Saving…" on button). Cancel reverts every dirty field to saved value in one shot.

---

## 46. Runs Tab — forensic surface (extends §5)

### Run detail blocks
| Block | Contents |
|---|---|
| Status & timing | Status badge, start time, end/elapsed, duration, Cancel (live runs) |
| Retry & resume controls | **Retry** for failed/timed-out (same task context). **Resume** for `errorCode=process_lost` (picks up from same point via `resumeFromRunId`). |
| Metrics | Input / output / cached tokens, total cost, provider, model |
| Session continuity | Session IDs before/after — **highlighted when changes mid-run** |
| Invocation card | Exact command + cwd + prompt + context + env. Secrets redacted as `***REDACTED***`. JWT values masked. |
| Transcript | Full agent-model conversation with tool calls inline |
| Log viewer | Raw stdout/stderr/system chunks with timestamps |
| Touched issues | Set of issues agent interacted with during run. **"Clear sessions for touched issues" action** — handy after corrupted session state. |
| Claude login (claude_local only) | One-click "Login with Claude" — bootstraps adapter against fresh Claude auth |

### Live run UX
Transcript + log viewer stream in real time. Header shows animated status + elapsed counter + Cancel button. **Scroll-to-bottom helper** sticks you to latest output until you scroll up to read history, then releases so you don't get yanked.

### Cancel / Retry / Resume semantics
| Action | When | Effect |
|---|---|---|
| Cancel | Running or queued run | Run → `cancelled` |
| Retry | Failed run, recoverable reason (transient network, adapter glitch) | New run with same task context |
| Resume | `errorCode = process_lost` only | New run with `resumeFromRunId` so next run picks up instead of restarting |

### Reset Sessions (overflow menu on agent detail header)
Wipes session state. Agent starts fresh on next heartbeat. Different from "Clear sessions for touched issues" (run-level, narrower scope).

---

## 47. Org Structure — strict tree rules

### Hard invariants
- **Strict tree.** Every agent except CEO has exactly one manager.
- **CEO at top, reports to board (you/Gill).** Cannot be changed.
- **No cycles.** Cannot assign agent to a manager that reports to it (transitively).
- **Single parent.** Each agent has one direct manager.
- **Reassigning a manager moves the whole subtree** under the new parent. Reports keep their own reporting lines.

### Org chart canvas behavior
| Interaction | Effect |
|---|---|
| Drag background | Pan canvas |
| Click card | Open agent detail page (NOT pan) |
| Scroll / pinch | Zoom (anchors to mouse position) |
| +/- buttons | Precise zoom |
| Fit button | Recenter whole chart in viewport |

### Status dot colors on org chart
- 🟢 Green — active
- 🟡 Yellow — paused or idle
- 🔴 Red — error
- 🩵 Cyan — running
- ⚫ Grey — terminated (stays on chart as historical record, faded styling)

### Structural-issue signals (from docs)
| Signal | What it likely means |
|---|---|
| Multiple roots (more than one top-level) | An agent lost its manager, usually after termination — fix via Configuration → Reports to |
| Manager with far too many reports | Span-of-control overload — split workstreams |
| Worker orphaned without manager | Same as multiple roots |
| Adapter concentration risk | Too much of org runs on same adapter |

### Sidebar Org entry — alternate view
Collapsible tree, used by screen readers and anyone preferring compact outline. Two views share underlying hierarchy; changes appear in both immediately.

### VETA structural posture (per S89 cutover)
Backend + Frontend Engineers are **flat under VETA company root** (no `reportsTo`). Per CLAUDE.md §32: "VETA can hire its own CEO/Operator later or stay flat." Currently stays flat. If we ever hire a VETA CEO, both engineers reparent to that CEO via Configuration → Reports to.

---

## 48. Delegation Troubleshooting Recipe (when CEO isn't creating tasks)

From the official Delegation guide. Apply when a paperclip CEO is silent after a goal is set.

### No tasks being created
| Check | Look for |
|---|---|
| Approval queue | Strategy approval waiting for review? **Most common cause.** CEO has submitted plan, waiting for sign-off. |
| Goal set? | Goals section — if no goal, CEO has nothing to work from |
| CEO heartbeat enabled? | Agent detail → toggle. Recent runs appear in Runs tab? |

### CEO isn't assigning to reports
| Check | Look for |
|---|---|
| Reports have heartbeats? | Each agent detail. CEO may skip assigning to disabled reports (they can't pick up work) |
| Reports active? | Any paused/terminated/error? CEO won't assign to agents it can't reach |
| CEO budget? | 80% warning, 100% auto-pause |

### CEO assigning everything to itself
**Expected behavior when CEO has no active reports.** Hire reports → CEO starts delegating once they're set up.

### Strategy approved but nothing happened
Paperclip queues CEO to wake automatically. Follow-up usually starts shortly. **Force immediate:** CEO detail → Run Heartbeat.

### Specific task stuck
1. Open task → read comment thread for posted blocker
2. Check status — if `blocked`, read the blocker comment
3. Check assigned agent — paused or over budget?
4. Reassign OR add directive comment

---

## 49. Cross-project notes — agent prompt design

### VeteranIntel (VETA)

VETA Backend + Frontend are workers, not CEOs — but the **AGENTS/SOUL/HEARTBEAT/TOOLS pattern still applies** at the worker tier. Recommendation when we get to VETA prompt design:

**Backend Engineer:**
- `AGENTS.md` (entry): operating manual for what backend work means for VeteranIntel.org. Reference §32 of VI CLAUDE.md verbatim — the deployment lane discipline, the §7 corpus separation rule, the §12 CLI prompt protocol pointing to Rafa for execution.
- `SOUL.md`: Strategic posture for backend engineering — verification-first per §25, no unprompted redesigns per §26, executable output standards per §27, full UNC paths always, treat code comments as design intent.
- `HEARTBEAT.md`: Per-wake checklist:
  1. Check `PAPERCLIP_TASK_ID` + `PAPERCLIP_WAKE_REASON`
  2. If `wake_reason = issue_assigned`, GET issue + heartbeat-context for plan
  3. Checkout via `POST /api/issues/{id}/checkout` with `expectedStatuses: [todo, backlog, blocked, in_review]`
  4. Do the work (within `cwd` — `veteran-analytics` repo for VETA Backend)
  5. Post status comment with `X-Paperclip-Run-Id` header
  6. Set keyed `plan` doc if multi-step work
  7. Status transition (in_review or done) on completion
  8. Exit
- `TOOLS.md`: Notes on gcloud SA permissions Rafa has (read-only Cloud Run + Discovery Engine + storage on merit bucket only), the §7 corpus boundary, the dual-keys folder structure (§29 of VI CLAUDE.md).

**Frontend Engineer:**
- Same structure. `TOOLS.md` notes design/brand voice references for VeteranIntel.org surfaces.

If we ever expand VETA with a CEO/Operator, the auto-seeded 4-file template is the right starting point — Paperclip generates it on hire.

### The Audiopheliac

When the Audiopheliac Operator (planned CEO agent) is hired, the 4-file template auto-seeds. Suggested content:
- `SOUL.md`: Studio Mode persona from `audiopheliac-studio-environment` skill + voice of a producer-operator who treats signal chains as architecture
- `HEARTBEAT.md`: Per-wake — check session inbox, review studio_topology.md state, advance any in-progress session/release tasks, post status, exit
- `TOOLS.md`: Quirks of Ableton/Audacity, NAS automation scripts, the QTS Task Scheduler vs raw crontab gotcha from VI CLAUDE.md §29

### Configuration revisions are the safety net for prompt iteration

Both VETA and Audiopheliac agents benefit from the §45 rollback discipline. **Pause → Rollback to last-known-good → Resume → debug** is the recommended pattern when a prompt experiment breaks an agent. Up to 10 revisions kept. Treat the revisions log as the prompt history of record for cross-session continuity.

---

## 50. Adapter Manager — operational surface (NEW)

Lives at **Settings → Adapters**. Single place to see installed adapters, toggle menu visibility, install/upgrade external packages, pause overrides.

> Per official docs: "External-adapter runtime is in **alpha**. APIs, on-disk layout, and exposed capabilities can change between versions. For production use, pin adapter package versions."

### Two list sections
| Section | Behavior |
|---|---|
| **External Adapters** | Packages you installed. Removable. Reloadable. Reinstallable in place. |
| **Built-in Adapters** | Ships with paperclip. **Cannot be removed.** Can be hidden from agent dropdown. |

### Override mechanic
When an external adapter declares the same `type` as a built-in (e.g., an external `claude_local` package), the server treats it as an **override**:
- External row → blue **"Overrides built-in"** badge
- Built-in row → synthetic row with **"Overridden by …"** badge (so you can still see which built-in is affected)

### Badges
| Badge | Meaning |
|---|---|
| Built-in | Ships with paperclip. Not removable. |
| External | You installed. Removable + reloadable + reinstallable. |
| Overrides built-in (blue) | This external replaces a built-in of the same type |
| Overridden by … (blue) | This built-in is currently replaced by an external |
| Hidden from menus (amber) | Installed + loaded but does NOT appear in agent-config dropdown. Existing agents already using it keep working. |
| Override paused (amber) | External override loaded but temporarily not taking effect — built-in is active instead |

### Per-row meta line
`adapter.type · package-name · N models`

Source icons (external rows only):
- Folder icon → installed from local path
- Package icon → installed from npm

### Power icon — context-sensitive

The power icon's behavior depends on what row you click. Tooltip changes to match.

| Row type | Power icon action |
|---|---|
| Built-in OR plain external | Toggle menu visibility. Dim/grey = adapter still loaded + still works for agents already configured, but not in dropdown. |
| External overriding a built-in | **Pause/resume override.** Pausing does NOT uninstall — runtime falls back to built-in until resumed. |

### Install dialog
Top-right **Install Adapter** button. Two source modes:

**npm package** (default):
- Enter package name (e.g., `@my-org/paperclip-adapter-openrouter`)
- Optional version (blank = `latest`)
- Click **Install**

Paperclip fetches → validates `createServerAdapter()` export → registers adapter type → adds row to External Adapters.

**Local path:**
- Switch to Local path
- Paste absolute path OR click "Choose…" for platform-specific instructions
- Linux / WSL / native Windows paths all accepted (Windows auto-converted)
- Local-path rows show folder icon
- **Local-path installs do NOT offer Reinstall** — no registry to pull from

### Three lifecycle actions per external row
| Action | Icon | Notes |
|---|---|---|
| **Reload** | Circular arrow | Re-imports module in place. **Use after changing local-path adapter code** — runtime hot-swaps + invalidates cached config parsers + UI schemas. Existing agents pick up on next run. |
| **Reinstall** | Download | **npm installs only.** Opens confirmation dialog showing Package + Current version + Latest on npm. Says "Already on the latest version" when matching. Can still force-reinstall for clean re-fetch. |
| **Remove** | Trash | Confirmation dialog: unregisters + removes from store + (npm) cleans disk. **Agents still using this adapter type fail on next run** — reassign them first. |

Built-in rows never show the trash icon.

### Adapter Manager does NOT hold per-adapter config
Adapter config lives on each agent that uses the adapter (working directory, model, timeout, env vars, adapter-specific fields).

External adapters render their config fields via the UI schema returned by `createServerAdapter()` — including any custom widgets the adapter ships.

### Health signals (operational diagnostic)
| Signal | Likely cause |
|---|---|
| `0 models` on a model-listing adapter | Loaded but can't reach provider — missing API key, offline, auth failure. Check agent env vars + provider status. |
| Row missing after install | Install failed. Reopen install dialog → error toast explains why (invalid package, missing manifest, no `createServerAdapter()` export). |
| Reload/reinstall returns error toast | New code didn't load. Previous version stays active. Fix error (often build-output for local installs), reload again. |
| Agents fail with "adapter not found" | Adapter removed OR agent's `type` string doesn't match an installed adapter. Reinstall or change agent's adapter. |
| Override paused unexpectedly | Someone clicked power icon on overriding external row. Click again to resume. |

### Cross-project relevance — not load-bearing for VeteranIntel today
VETA agents use built-in `claude_local`. We'd touch the Adapter Manager only if:
- Wanting to clean up Gill's dropdown by hiding unused adapters (gemini, cursor, hermes, pi)
- Installing a custom adapter for an experimental runtime
- Pausing an override during debugging

For Audiopheliac: if we ever build a custom adapter for Ableton or audio-production-specific runtimes, this is the install/manage surface. Not on near-term roadmap.

**Diagnostic priority:** If a VETA agent ever shows `0 models` on its claude_local row in the Adapter Manager, the first place to check is the agent's `ANTHROPIC_API_KEY` env binding — that's what the `0 models` signal indicates.

---

## 51. Per-adapter incremental details (extends §19)

Adding what wasn't in §19 from this batch.

### Hermes Local (`hermes_local`)
- "Persistent memory, 30+ tools, 80+ skills, multi-provider routing"
- Requires Hermes Agent installed (Python 3.10+)
- Selectable in UI per Adapter Comparison table

### Pi Local (`pi_local`)
- Pi CLI with built-in tool set + provider/model routing
- Requires Pi CLI installed + relevant API keys

### OpenCode Local (`opencode_local`)
**Model format is `provider/model`** — explicit format required:
- `anthropic/claude-opus-4-6`
- `openai/gpt-5.3-codex`

Paperclip fetches available model list from your OpenCode installation and validates choice before letting you submit.

### Codex Local model examples
- `gpt-5.3-codex` — default, normal starting point
- `o4-mini` — fast + cost-effective for routine tasks

### Claude Local common errors (operational diagnostic)
| Error | Cause | Fix |
|---|---|---|
| "Claude Code not found" | Claude Code not installed OR not on PATH | Install from claude.ai/code, run Test Environment |
| "API key invalid" | Env var name mismatch OR wrong key value | Verify `ANTHROPIC_API_KEY` env var, key starts with `sk-ant-`, case-sensitive |
| "Timeout" | Heartbeat ran longer than configured timeout | Increase timeout OR break task into smaller pieces |

### Default timeout guidance
- 300 seconds (5 minutes) safe default
- Complex coding tasks: 600+ seconds
- Setting too low → agents time out mid-task

### Claude Local working-directory recommendation
"Give each agent its own working directory if they're doing different kinds of work. Shared directories can lead to agents accidentally overwriting each other's files."

For VETA: Backend agent `cwd` = `veteran-analytics` repo path. Frontend agent should NOT share that cwd — give it its own working folder OR scope by file pattern within the same repo. Worth verifying in current state.json config.

---

## 52. Projects — operational deep-dive (extends §9)

### Project hierarchy in the data model
```
Goal  →  Project  →  Issue  →  Execution workspace  →  Agent run
```

A project binds work to a concrete place — a repository, a working directory, a budget envelope, a set of execution workspaces. **Every issue lives under a project. Every execution workspace is scoped to a project.**

### Five tabs per project (UI surface)
| Tab | Purpose |
|---|---|
| Overview | Human-readable summary. Inline-editable description (saves on blur, paste/drop images supported). Status + target date displayed but read-only here. |
| Issues | Same component as global Issues page, pre-filtered to project. View settings persist per-project. |
| Workspaces | Only appears when isolated workspaces experimental setting enabled AND project has non-default workspace with activity. Otherwise redirects to Issues. |
| Configuration | Auto-save fields. Where you wire repo, env vars, workspace mechanics, archive. |
| Budget | Project-scoped cap, distinct from agent + company budgets. |

### Workspaces tab specifics
Each workspace row card combines:
- Workspace identity — name, working directory or git worktree path, status
- Currently-running issues
- Runtime service controls — Start, Stop, Restart (dev servers, watchers, databases). **Not auto-started — operator-controlled.**
- Close workspace action — stops runtime services + archives

**`cleanup_failed` workspaces** grouped in amber "Cleanup attention needed" section. Either retry close OR investigate underlying path manually.

Project's primary working directory NOT shown as a separate row — it's the implicit default. Tab lists non-default workspaces only.

### Configuration tab fields (auto-save with Saving/Saved/Failed indicator)

**Basic properties:**
- Name (safe to rename — links using slug continue to resolve)
- Description (synced with Overview)
- Status: `backlog` / `planned` / `in_progress` / `completed` / `cancelled` (does NOT affect whether agents can pick up issues)
- Goals (links — see §53)

**Repository binding:**
| Mode | Notes |
|---|---|
| Local folder only (`cwd`) | Code on local machine. Agents work in this folder (or isolated worktrees derived). |
| Remote repo only (`repoUrl`) | Paperclip clones/references remote. No local checkout. |
| Both | Most common. Local checkout + remote URL tracked. |

**Project environment variables:**
- Add/rename/delete inline
- Secret-valued variables stored via secrets store, rendered masked
- **Extend agent env — do not override company env.** Stacking, not replacing.

**Execution workspace per-project knobs** (when isolated workspaces enabled at company level):
| Field | Purpose |
|---|---|
| Execution workspace enabled | Whether this project participates at all. If off, every issue runs in primary workspace. |
| Default mode | New-issue default: `isolated` (new workspace), `reuse existing`, or `project primary`. Individual issues can override. |
| Base ref | Git ref new isolated workspaces branch from (branch / tag / commit) |
| Branch template | Naming convention for new branches (e.g., includes issue identifier) |
| Worktree parent directory | Disk location for new git worktrees |
| **Provision command** | Optional command run after workspace created (e.g., `npm install`) |
| **Teardown command** | Optional command run before workspace closed |

Set once per project, rarely touched again.

**Archive/unarchive:** Hides from list + pickers. Preserves issues + workspaces + history. Same control unarchives.

### "Paused by budget hard stop" pill
Red pill appears at top of project page when paused by budget policy. Resolution: raise budget OR resolve budget override approval.

### Budget tab — LIFETIME cap (not monthly)

**Critical distinction:** Project budgets default to `lifetime` window. Agent + company budgets default to `calendar_month_utc`. Three levels apply in parallel:

| Level | Window | Effect when hit |
|---|---|---|
| Agent | Monthly UTC | Agent pauses regardless of project headroom |
| Project | **Lifetime** | Project pauses regardless of which agent is working |
| Company | Monthly UTC | Overall ceiling — no agents in any project can spend further |

**Budget card fields:**
- Scope: `project`
- Metric: `billed_cents`
- Window: `lifetime`
- Amount (editable)
- Observed amount (cumulative spend ever)
- Remaining amount
- Utilization % with warn threshold (default 80%)
- Hard stop enabled (triggers project pause)
- Notify enabled (warn-threshold notifications)
- Paused + Pause reason

**Resume from hard stop:**
1. Raise amount until > observed spend → project resumes on next run
2. Resolve budget override approval from queue → formal path agents use to request more headroom

### Cross-project relevance — VeteranIntel + Audiopheliac

**VETA MERIT project** (id `8334f050-3f05-487a-9c30-50956ea0660b`):
- Currently zero open issues + no `cwd`/`repoUrl` binding visible in state.json
- When VETA agents start real work, recommended Configuration:
  - `cwd` = `C:\Users\gillo\Veteran Analytics LLC\GitHub Clones\veteran-analytics` (VETA Backend's primary work area)
  - `repoUrl` = the corresponding GitHub repo URL
  - Env vars: nothing project-scoped initially — `ANTHROPIC_API_KEY` belongs at agent level per §27 secret hygiene
- If isolated workspaces ever enabled:
  - Default mode `isolated` for parallel ticket work
  - Base ref `main`
  - Branch template `paperclip/{issueIdentifier}` or similar
  - Provision command depends on stack (`npm ci` or `pnpm install` likely)
  - Teardown command: cleanup-only, no destructive ops
- **VETA MERIT budget recommendation: leave unset for now.** Setting a lifetime project cap would limit total spend across all VETA work on this project ever. The agent-level $80/mo caps + company-level cap (if set) are the active enforcement; project cap would only matter for bounded efforts like "POC budget = $50 lifetime."

**VAL parent's legacy `VeteranIntel.org - MERIT` project** holds VET-1..VET-99 + VET-111..VET-116. Historical record per S89 cutover. Same configuration considerations would apply if Backend/Frontend ever got cross-company-assigned to those tickets.

**Audiopheliac (when Operator hired):**
- Audiopheliac project could bind `cwd` to local Ableton sessions folder OR NAS-mirrored sample library path. **No `repoUrl`** — Ableton projects aren't git-managed typically.
- Provision command useful for setup: mounting NAS path, copying templates, etc.
- **Lifetime project budgets are the right shape for releases** — "EP budget = $50 lifetime" works because a release is bounded, not recurring.
- For ongoing studio operations (regular mastering work, sample library curation), monthly agent budget is the right enforcement, not project lifetime.

---

## 53. Goals — operational deep-dive (extends §9)

### Goal as outcome anchor (not a work container)
Goals do NOT contain code, do NOT have execution workspaces, are NOT worked on directly. They're the "why it matters" layer.

**Linking pattern:** Goal → Project → Issue. **No direct goal-to-issue link.** Move issue between projects to change goal attribution.

### Tree structure
Driven by `parentId`. Top-level (root) goals have no parent. Sub-goals nest underneath. **No nesting depth limit, but two or three levels usually enough.**

### Each goal row in tree
- Title
- Status badge (same vocabulary as projects/issues: `planned` / `active` / `achieved` / `cancelled`)
- Level label — `company` / `team` / `agent` / `task` (per §9 goal levels)

### Goal detail page — three regions
1. **Header** — Level (muted uppercase), Status badge, Properties toggle slider
2. **Body** — Inline-editable title (saves on blur) + inline-editable description (multiline markdown, paste/drop images supported)
3. **Tabs:**
   - **Sub-Goals (N)** — child goals as tree, with "Sub Goal" button to create with parent pre-filled
   - **Projects (N)** — linked projects with status badges. Click row → project detail.

Tab counts update live as you add/remove/unlink children + projects.

### No numerical percentage on goals — by design
Paperclip does NOT compute a numerical progress % on goals. Status field is authoritative — set by a human or by the CEO when goal is clearly achieved or abandoned. Qualitative rollup = look at linked projects' status mix on the Projects tab.

### No status propagation
Parent goal status NOT auto-computed from children. Human (or CEO) stays in charge of declaring when an outcome is achieved. Tradeoff: predictable + auditable, at cost of manual parent-status updates when work underneath is clearly done.

### Sub-goal vs project — when to use which
| Use a sub-goal when... | Use a project when... |
|---|---|
| Outcome is big enough to break into independently-trackable pieces | Work is concrete enough to point at a repository + start issues |
| Each piece could have its own linked projects | Linked goals already exist for context |

**Anti-pattern:** Using sub-goals as a substitute for projects when work is already concrete enough to execute against.

### Reparenting + flattening
Change parent field in properties panel. Flatten sub-goal to root = set parent to none.

### Multi-goal projects
**A project can be linked to multiple goals.** Single body of work often advances more than one outcome. The Projects tab lists each goal's linked projects; multi-goal projects appear under each.

### Cross-project relevance — recommended goal structure for VeteranIntel + Audiopheliac

**Currently zero goals defined** in either VAL parent or VETA per state.json. Goals are optional but useful as anchors for CEO strategy work IF/when a CEO joins the company.

For VeteranIntel (VETA company), recommended goal structure when/if useful:
- Root goal (company-level): "Ship VeteranIntel.org toolsuite to operational state"
  - Sub-goal: "PIVOT POC validates Excel-as-engine architecture"
  - Sub-goal: "MERIT corpus separation audit clean"
  - Sub-goal: "VBA training corpus operational"
- Linked project: MERIT (the VETA MERIT project) → links to all three sub-goals (multi-goal project pattern)

This isn't required to operate VETA — the agents work fine without goals — but it gives a CEO (if hired) explicit anchors for strategy proposals.

For Audiopheliac (when Operator company stood up):
- Root goal per release cycle: "Release [EP/album name] by [target date]"
  - Sub-goal: "Tracking complete"
  - Sub-goal: "Mixing complete"
  - Sub-goal: "Mastering complete"
  - Sub-goal: "Distribution + release plan executed"
- Each sub-goal links to its own project (or shares one project) where actual work tickets live

This shape fits how releases work naturally — bounded outcomes with subtasks.

---

## 54. Heartbeats & Routines deep-dive (extends §14)

### Four wake sources (only one is timer-driven)
| Source | Triggered by |
|---|---|
| **Timer** | Heartbeat interval ticks (e.g., every 5 min) — wakes whether or not there's work |
| **Assignment** | Task assigned OR new comment on agent's open task |
| **On demand** | UI "Wake now" click OR another agent hands work |
| **Automation** | A routine fires on its schedule and hands the agent an issue |

The first is the only wake source that fires without anything happening. The other three are event-driven.

### Critical operational philosophy — heartbeat OFF is the default

> **From official docs (rule of thumb):** "If you find yourself frequently pausing and resuming an agent, that agent's heartbeat is wrong — not your workflow."

New agents ship with **Heartbeat on interval = OFF**. Per official guidance, this should usually stay off:
- Each timer wake costs tokens regardless of whether there's work
- Five agents ticking every five minutes → sixty inbox runs/hour that mostly say "nothing to do, going back to sleep"
- Pausing as a volume-control strategy is the wrong fix → kills event-driven wakes too

**The recommended combination for most agents:** `Heartbeat on interval = OFF`, `Wake on demand = ON`. Agent appears "active" 24/7 but consumes nothing until work lands.

### Pause vs Heartbeat-off — completely different behaviors

| | Heartbeat OFF | Paused |
|---|---|---|
| Timer ticks | No | No |
| Wakes on assignment | **Yes** | No |
| Wakes on comment | **Yes** | No |
| Wakes on routine firing | **Yes** | No |
| Wakes on-demand click | **Yes** | No |
| Shows as "active" on dashboard | Yes | No |

**Heartbeat off** is the quiet productive default. **Paused** is a hard stop for actual problems (misbehavior / config changes / budget guard tripped).

### Run Policy section fields (on agent detail Configuration tab)
- **Heartbeat on interval** — master switch (off by default)
- **Run heartbeat every N sec** — only visible when interval on. Prefer minutes/hours over seconds.
- **Wake on demand** (under Advanced) — leave ON. Lets assignments/comments/routines through.
- **Cooldown (sec)** — minimum gap between runs
- **Max concurrent runs** — parallel task limit

### When timer IS right (rare, but legitimate)
- Agent watches an **external system with no webhook** (RSS feed, email inbox without push, third-party API that only polls). Tick IS the event.
- Job is genuinely "check every N minutes and react" AND modelling as a routine didn't fit.

Even then, push interval as high as tolerable. Once-an-hour is rarely worse than every-minute and is 60× cheaper.

### Routine UI structure

**Routines list page** has two tabs:
- **Routines** — list of routines with title / project / default agent / last run + status / Enabled toggle / kebab menu
- **Recent Runs** — read-only issue list filtered to `originKind = routine_execution`

Status labels: `paused`, `draft` (no default agent assigned), `archived`.

**Group by** popover (persisted per company in localStorage): Project / Agent / None.

**Kebab menu actions:** Edit / Run now / Pause-Enable / Archive-Restore.

### Routine composer modal (Create routine)
- **Title** — auto-sizing text area, Enter drops into description, Tab walks selectors
- **For / In** — inline selectors for default assignee + default project
- **Instructions** — Markdown editor (becomes body of every task the routine produces)
- **Advanced delivery settings** — collapsed: concurrency + catch-up policies with plain-English descriptions

Draft routines (no default agent) save and stay paused until you assign one.

### Routine detail page tabs (via `?tab=` URL param)
- **Triggers** (default) — every trigger attached + composer for new ones
- **Runs** — execution history for this specific routine, polled every 3 seconds for live runs
- **Activity** — audit log: edits, enables, pauses, trigger changes, secret rotations

Each scheduled trigger shows a "Next:" line — server-computed from cron + timezone (reflects real scheduler intent, not browser math).

### Cron picker (ScheduleEditor)

Replaces raw cron input. Preset dropdown:
| Preset | Cron emitted |
|---|---|
| Every minute | `* * * * *` |
| Every hour | `M * * * *` |
| Every day | `M H * * *` |
| Weekdays | `M H * * 1-5` |
| Weekly | `M H * * D` (D = day-of-week, Mon-Sun in UI, stored as Sun=0) |
| Monthly | `M H D * *` |
| Custom | Raw cron expression field |

- Hours shown in 12-hour format (AM/PM); underlying cron is 24-hour
- Minutes snap to 5-minute increments in preset modes
- Picker is **two-way** — paste a cron that matches a preset, form auto-detects and switches back

### Timezone handling
- Stored with explicit timezone derived from `Intl.DateTimeFormat().resolvedOptions().timeZone` at creation
- Scheduler evaluates in that timezone, NOT UTC
- **DST behavior correct**: "every weekday at 9am" fires at 9am local on both sides of DST switch
- Changing timezone: re-save trigger — editor stamps current browser timezone

### Webhook trigger configuration

Replaces cron editor for webhook kind:
- **Signing mode**: `bearer` / `hmac_sha256` / `github_hmac` / `none`
- **Replay window (seconds)**: how far back signed request timestamp may be. Hidden for `github_hmac` and `none` (no timestamp).

Creation banner shows **webhook URL + secret ONE TIME** — copy now. `Rotate secret` button mints fresh secret later.

### Variable templates — `{{name}}` Mustache interpolation

Any `{{name}}` placeholder in title or instructions becomes a tracked variable. Variables panel appears below instructions editor.

Per variable:
- **Type**: `text` / `textarea` / `number` / `boolean` / `select`
- **Label** — friendly name on run-now dialog
- **Default value**
- **Options** — comma-separated, only for `select` (becomes dropdown)

At run time: defaults substituted in. Run-now dialog allows per-run override of variables + assignee + project without touching routine definition.

External webhook callers pass variables in request body. Validated against signing mode.

### Concurrency + catch-up policies (defaults usually right)
- **Concurrency**: `coalesce_if_active` (default) / `skip_new_tick` / `always_enqueue`
- **Catch-up**: `skip_missed` (default) / `enqueue_missed_with_cap` (cap prevents weekend-outage flood)

### A healthy setup looks like (verbatim guidance)
- Most agents: heartbeats off. Sit at "active", run only when assigned work, handed subtask, or routine fires.
- Handful of routines for recurring work: morning standup, Monday metrics roll-up, weekly housekeeping. Each targets one agent.
- One or two specialist agents: heartbeats on, but only polling external system with no webhook, on a long interval.
- Pause reserved for actual problems, not volume control.

### 9-step heartbeat protocol (for adapter developers, extends §44)

When an agent wakes — timer, assignment, comment, routine, or direct — it runs this protocol:

1. **Identity** — `GET /api/agents/me`
2. **Approval follow-up** — if `PAPERCLIP_APPROVAL_ID` set, `GET /api/approvals/{id}` + `/issues`
3. **Get assignments** — `GET /api/companies/{companyId}/issues?assigneeAgentId={yourId}&status=todo,in_progress,in_review,blocked`
4. **Pick work** — in_progress first → in_review (if comment-woken) → todo. Skip blocked unless can unblock. Prioritize `PAPERCLIP_TASK_ID` if set + assigned. Read comment thread first if comment-woken.
5. **Checkout** — `POST /api/issues/{id}/checkout` with `X-Paperclip-Run-Id` header. **Never retry a 409.**
6. **Understand context** — `GET /api/issues/{id}` + `/comments`. Read ancestors. Find triggering comment if comment-woken.
7. **Do the work**
8. **Update status** — `PATCH /api/issues/{id}` with `X-Paperclip-Run-Id` header. `done` with comment, OR `blocked` with explanation + unblocker.
9. **Delegate if needed** — `POST /api/companies/{companyId}/issues` with `parentId` and `goalId` on subtasks.

**Critical rules:**
- Always checkout before working — never PATCH to `in_progress` manually
- Never retry a 409 — task belongs to someone else
- Always comment on in-progress work before exiting heartbeat
- Always set `parentId` on subtasks
- Never cancel cross-team tasks — reassign to your manager
- Escalate when stuck — use chain of command

### Cross-project relevance

**VeteranIntel (VETA):** Verify VETA Backend + Frontend currently have `Heartbeat on interval = OFF` + `Wake on demand = ON`. If on-interval is ON, that's a cost driver to fix immediately. The recommended posture per official docs is the OFF/ON combo with routines handling scheduled work.

Likely VETA routine candidates (currently zero routines defined):
- **217A corpus backfill scan** — weekly cron, fires under VETA Backend, scans for new corpus content
- **Cloud Scheduler alerts check** — daily cron, surfaces any unresolved alerts as VETA issues
- **MERIT corpus separation audit** — weekly cron, runs §7 boundary check, opens issue if drift detected
- **VBA training corpus operational status** — monthly cron, status report on training material ingest state
- **`/pivot` walkthrough re-test** — could be a webhook trigger from CI

Each routine produces a task that wakes the agent. No timer noise.

**Audiopheliac (when Operator hired):** Operator should also be OFF/ON. Routines for:
- Weekly NAS sample library hygiene scan
- Monthly Ableton template review
- Per-release sub-task batch creation (parameterized via `{{release_name}}` variable)
- Quarterly hardware inventory + firmware check

The `{{name}}` variable interpolation is particularly useful for the per-release routine — one routine definition, many parameterized executions.

---

## 55. Execution Workspaces (NEW deep-dive)

### Core model
Execution workspace = a snapshot of a project's working directory tied to a specific task run. Lets multiple agents work on the same project without stepping on each other.

**Lifecycle per task run:**
1. Heartbeat fires + agent picks up task
2. Paperclip resolves workspace (new / reuse existing / project default per settings)
3. Agent receives workspace path + works within it
4. Workspace persists after run (isolated or reuse modes only)

### Three workspace modes
| Mode | Behavior | When |
|---|---|---|
| **Isolated (new workspace)** | Fresh git worktree at new path, new branch from base ref. No interference. Review + merge branch on completion, then archive. | Code changes — features, fixes, experiments |
| **Reuse existing workspace** | Shares workspace with another task or prior run. Same branch, same running services. | Closely-related tasks coordinating on same state |
| **Project primary workspace** | Project's primary checkout directly. Changes affect shared working copy. | Use carefully. |

### Runtime services — manually controlled, NOT auto-started

Per official docs: **"Runtime services are not auto-started; you control them from this card."** Background processes (dev servers, databases, build watchers) require explicit Start click. Each isolated workspace has its own runtime even when config inherited from project.

### Workspace detail screen — Workspace commands panel + 3 tabs

**Workspace commands panel** sits ABOVE the tabs and is visible on any tab. Two operating rules:
1. **Needs `cwd`** — without absolute working directory, all action buttons disabled
2. **Services need runtime config** — service commands only appear if config inherited from project OR overridden at workspace level

Two command sections:
- **Services** — long-running (`pnpm dev`, Postgres container, build watcher). Start / Stop / Restart controls + last observed status.
- **Jobs** — one-shot (`pnpm db:migrate`, test runner). Single Run action.

Action result: pending state blocks duplicates → success confirmation OR red error from adapter. Full history → Runtime logs tab.

### Three tabs (URL `?tab=` deep-linkable)
1. **Configuration** — settings + context + concrete location
2. **Runtime logs** — operation history with stdout/stderr excerpts
3. **Issues** — every issue that has run against this workspace

Tab selection remembered per workspace.

### Configuration tab — three cards

**Workspace settings (editable fields):**
| Field | Purpose |
|---|---|
| Workspace name | Human label |
| Branch name | Git branch (typically `PAP-946-workspace` for isolated worktrees) |
| Working directory | **Absolute path** — most important field. Empty = nothing runs. |
| Provider path / ref | Provider-specific reference |
| Repo URL | Remote URL — used for GitHub/GitLab linking |
| Base ref | Ref the workspace branched from (e.g., `origin/main`) |
| Provision command | Runs when workspace prepared (e.g., dependency install) |
| Teardown command | Runs when workspace archived/cleaned |
| Cleanup command | Optional pre-teardown cleanup (e.g., kill stuck vite) |

Top-right: **Close workspace** button → cleanup → teardown sequence → `archived` OR `cleanup_failed`. If `cleanup_failed`, button becomes **Retry close**.

**Runtime config source notice** (under settings):
- Execution workspace override
- Project workspace default
- None (no runtime config defined)

**Reset to inherit** button drops override → falls back to project workspace default. Disabled when project has no config either.

**Advanced runtime JSON** panel (disclosure triangle, power-user):
- Checkbox: `Inherit project workspace runtime config`
- JSON textarea editor — accepts both shapes:
  - Legacy `{ "services": [...] }`
  - Newer `{ "commands": [...] }` with `kind: "service" | "job"`
- Validation on Save — parse error blocks save with inline message

**Workspace context card** (Linked objects):
- Project — owner project
- Project workspace — provisioned from
- Source issue — issue that originally triggered creation
- Derived from — parent execution workspace if branched off another
- Workspace ID — copyable for API/debugging

**Concrete location card** (read-only summary):
- Working dir (with copy button)
- Provider ref
- Repo URL (clickable when http(s))
- Base ref / Branch
- Opened / Last used timestamps
- Cleanup — scheduled cleanup time + reason, OR "Not scheduled"

### Runtime logs tab

Each entry = one workspace operation:
- Command OR phase (lifecycle step)
- Start time / end time
- stdout/stderr excerpt — **stderr highlighted in red on failures**
- Status pill (running / succeeded / failed)

Two operation kinds:
- **Runtime operations** — service start/stop/restart + one-shot jobs from commands panel
- **Cleanup operations** — provision / teardown / cleanup command runs at workspace boundaries

UI action → operation entry mapping:
| Action | Operation produced |
|---|---|
| Start service | Service command + `started` phase + running/finished status |
| Stop/Restart | Termination/bounce record |
| Run job | Single operation, final status from exit code |
| Close workspace | Cleanup command op + teardown command op (sequential, separate entries) |
| Provision | Emitted automatically on first prep |

Excerpts are truncated. Reach into worktree on disk + re-run command manually if needed to compare.

### Issues tab
Per-workspace issue list using same components as global Issues. Includes:
- Live-run indicator for in-flight heartbeats against this workspace
- Inline status/reassign actions
- View state persisted under `paperclip:execution-workspace-issues-view`

**Source issue vs linked issues distinction:**
- Source issue — single issue that ORIGINALLY caused workspace provisioning. Stored on workspace.
- Linked issues — every issue that has been attached to this workspace (source + follow-ups + `inheritExecutionWorkspaceFromIssueId` pointers)

When deciding to archive: look at full linked list, not just source.

### Archive/cleanup two-step
1. **Cleanup** (cleanup command if any) — stop stray dev servers, free ports
2. **Teardown** (teardown command) — dismantle workspace (for git worktree: remove dir + prune branch)

Both succeed → `archived`. Either fails → `cleanup_failed` + Retry close button.

**Uncommitted changes lost on teardown.** Merge or stash before archiving.

### Git worktrees (default for isolated)
- Second/third/Nth checkout of same repo at different path, with own branch
- Shares object database with primary checkout — creation is cheap
- Own working directory → no cross-worktree accidental overwrites

Provisioning sequence:
1. Pick path under project workspace's worktree directory
2. Create new branch off configured base ref
3. Checkout into new worktree path
4. Run provision command (deps, env files, per-worktree setup)

### When isolation is overkill (per official docs)
- **Purely read-only tasks** — research, summarising, documentation review. Use primary or reused workspace.
- **Metadata-only tasks** — triaging, estimating, assigning. No checkout needed.
- **Multi-task coordination on same feature** — reuse workspace so changes accumulate together.

Isolation cost: each worktree needs own `node_modules` (or equivalent), own dev server, own migrations.

### 6-question troubleshooting checklist
1. Is `cwd` set + correct? (Configuration → Workspace settings → Working directory)
2. Is branch still there? (Someone deleted it outside paperclip → checkout fails)
3. Does runtime config actually apply? (Runtime config source: None → no services)
4. Is another workspace holding the port? (Two isolated worktrees both binding same dev server port)
5. Did previous close fail? (`cleanup_failed` state → retry or manual fix)
6. Is agent looking at right workspace? (Follow-up tasks need `parentId` OR `inheritExecutionWorkspaceFromIssueId`)

### Cross-project relevance

**VeteranIntel (VETA MERIT project):**
- Isolated workspaces is **experimental** at the company level — currently off per state.json
- If enabled, recommended VETA MERIT project config:
  - Default mode: `isolated`
  - Base ref: `main`
  - Branch template: `paperclip/{issueIdentifier}` or `veta/{issueIdentifier}`
  - Worktree parent: `C:\Users\gillo\Veteran Analytics LLC\GitHub Clones\.paperclip-worktrees\veta\`
  - Provision command: depends on actual stack (`npm ci` if veteran-analytics uses npm, `pnpm install` if pnpm)
  - Teardown command: cleanup only, no destructive ops
  - Cleanup command: kill any stuck Cloud Run local emulator processes if used

- **But — per "When isolation is overkill" guidance, most VETA work today wouldn't benefit:**
  - VET-89 (BLUF blank screen P0 in_review) — investigation + status update, not code change → primary workspace
  - VET-96 (IAM corpus drift P1 in_review) — config investigation, not code → primary workspace
  - VET-112 (PIVOT POC) when it kicks off — IS a code-change task → isolated worktree makes sense
  - Routine-driven tasks (corpus backfill scan, audit, etc.) — read-only → primary workspace

- Recommendation: leave isolated workspaces OFF for now. Turn on selectively when a coding-heavy ticket bundle arrives and parallelism becomes valuable.

**Audiopheliac:**
- Studio sessions are NOT git-managed → workspace model less relevant for primary work
- IF there's a code component (NAS automation Python scripts, sample processing tools), workspaces apply same as software projects
- For pure Ableton/audio work, the `cwd` would point at a session folder; workspace as a concept becomes "this folder, this snapshot in time"
- Probably easier to keep isolated workspaces OFF for Audiopheliac entirely

---

## 56. Execution Policy — runtime-enforced review + approval gates (NEW concept)

Paperclip's execution policy system keeps tasks honest. **Instead of trusting an agent to remember to hand off for review, the RUNTIME intercepts status transitions and routes work to the right reviewer/approver.** Agents don't have to "remember" governance — the system enforces it.

### Three enforcement layers
| Layer | Purpose | Scope |
|---|---|---|
| **Comment required** | Every agent run must post a comment | Runtime invariant — always on, can't disable |
| **Review stage** | Quality check, can request changes | Per-issue, optional |
| **Approval stage** | Final sign-off | Per-issue, optional |

An issue can have review only / approval only / both in sequence / neither (just comment-required backstop).

### Happy path flow
```
todo → executor works → in_review (reviewer) → in_review (approver) → done
```

When executor transitions to `done`, runtime intercepts:
- Status becomes `in_review`, **not `done`**
- Issue reassigned to first reviewer
- `executionState.status` = `pending` on review stage

Reviewer approves by transitioning to `done` with comment → decision recorded → issue stays `in_review`, reassigned to approver → `executionState` advances to approval stage.

Approver approves → `executionState.status` = `completed` → issue reaches `done` for real.

### Changes-requested loop (critical detail)

When reviewer transitions to ANY non-`done` status (typically `in_progress`) with a comment, runtime AUTO:
- Sets status to `in_progress`
- Reassigns to the **original executor** (stored in `returnAssignee` field)
- Sets `executionState.status` = `changes_requested`

Executor revises → transitions to `done` again → **runtime routes back to the SAME reviewer, not start of policy.**

Loop continues until reviewer approves.

### The always-on comment-required backstop

Independent of any review/approval stage, every issue-bound agent run must leave a comment. Runtime-enforced:

| Run-level field | Values |
|---|---|
| `issueCommentStatus` | `satisfied` / `retry_queued` / `retry_exhausted` |
| `issueCommentSatisfiedByCommentId` | Comment that fulfilled requirement |
| `issueCommentRetryQueuedAt` | Timestamp of retry wake schedule |

Sequence:
1. Run completes — runtime checks for comment
2. **No comment** → `retry_queued`, agent woken once more with reason `missing_issue_comment`
3. **Still no comment after retry** → `retry_exhausted`, recorded as failure
4. **Comment posted** → `satisfied`

Prevents silent completions where an agent closes work without trace.

### Data model — full TypeScript shapes

```ts
interface IssueExecutionPolicy {
  mode: "normal" | "auto";
  commentRequired: boolean;       // always true, runtime-enforced
  stages: IssueExecutionStage[];  // ordered list
}

interface IssueExecutionStage {
  id: string;                     // auto-generated UUID
  type: "review" | "approval";
  approvalsNeeded: 1;             // multi-approval NOT yet supported
  participants: IssueExecutionStageParticipant[];
}

interface IssueExecutionStageParticipant {
  id: string;
  type: "agent" | "user";
  agentId?: string | null;
  userId?: string | null;
}

interface IssueExecutionState {
  status: "idle" | "pending" | "changes_requested" | "completed";
  currentStageId: string | null;
  currentStageIndex: number | null;
  currentStageType: "review" | "approval" | null;
  currentParticipant: IssueExecutionStagePrincipal | null;
  returnAssignee: IssueExecutionStagePrincipal | null;  // original executor for changes-requested loop
  completedStageIds: string[];
  lastDecisionId: string | null;
  lastDecisionOutcome: "approved" | "changes_requested" | null;
}

interface IssueExecutionDecision {  // table: issue_execution_decisions
  id: string;
  companyId: string;
  issueId: string;
  stageId: string;
  stageType: "review" | "approval";
  actorAgentId: string | null;
  actorUserId: string | null;
  outcome: "approved" | "changes_requested";
  body: string;                   // REQUIRED comment explaining decision
  createdByRunId: string | null;
  createdAt: Date;
}
```

**Every decision is recorded** with actor, outcome, comment, run ID. Full audit history queryable per issue.

### Multiple participants per stage
Each stage supports multiple participants. Runtime picks one to act, **excluding the original executor to prevent self-review.**

### Access control
- Only `currentParticipant` in execution state can advance/reject current stage
- Non-participants attempting transition get **422 Unprocessable Entity**
- Both approvals AND change requests **require a non-empty comment** — empty/whitespace rejected

### API — set policy at issue creation
```sh
POST /api/companies/{companyId}/issues
{
  "title": "Implement feature X",
  "assigneeAgentId": "coder-agent-id",
  "executionPolicy": {
    "mode": "normal",
    "commentRequired": true,
    "stages": [
      { "type": "review",   "participants": [{ "type": "agent", "agentId": "qa-agent-id"  }] },
      { "type": "approval", "participants": [{ "type": "user",  "userId":  "cto-user-id" }] }
    ]
  }
}
```

Stage + participant IDs auto-generated if omitted. Duplicate participants deduplicated. Stages with no valid participants removed. If no valid stages remain, policy set to `null`.

### API — PATCH on existing issue
```sh
PATCH /api/issues/{issueId}
{ "executionPolicy": { ... } }
```

**Removing policy (set to `null`) while review in progress**: execution state cleared, issue returned to original executor.

### API — advance stage (approve)
Active reviewer/approver transitions to `done` with comment:
```sh
PATCH /api/issues/{issueId}
{ "status": "done", "comment": "Reviewed — implementation correct, tests pass." }
```
Runtime decides: complete workflow OR advance to next stage.

### API — request changes
Transition to any non-`done` status with comment:
```sh
PATCH /api/issues/{issueId}
{ "status": "in_progress", "comment": "Button alignment off on mobile. Fix flex container." }
```
Runtime auto-reassigns to original executor.

### UI surface
- **New issue dialog**: Reviewer + Approver buttons alongside Assignee selector. Picker has "No reviewer/approver", "Me", full agent + user list.
- **Issue properties panel** (existing issues): Editable Reviewer + Approver fields. Multiple participants per stage. Persists via API.

### Design principles (verbatim from docs)
1. **Runtime-enforced, not prompt-dependent.** Agents don't need to remember handoff. Runtime intercepts.
2. **Iterative, not terminal.** Review is a loop — request changes, revise, re-review — not one-shot gate. System returns to same stage on re-submission.
3. **Flexible roles.** Participants can be agents or users. Generic enough for peer review, manager sign-off, compliance checks.
4. **Auditable.** Every decision recorded with actor + outcome + comment + run ID.
5. **Single execution invariant preserved.** Review wakes + comment retries respect "only one agent run active per issue at a time."

### Cross-project relevance — VETA governance applications

**Execution policy is the right tool for VeteranIntel's high-stakes work:**

**VET-96 (IAM corpus separation drift, P1 critical):** §7 corpus separation is non-negotiable. Recommended policy when this kind of issue comes up:
```json
{
  "stages": [
    { "type": "review",   "participants": [{ "type": "agent", "agentId": "<Backend agent>" }] },
    { "type": "approval", "participants": [{ "type": "user",  "userId": "<Gill's user ID>" }] }
  ]
}
```
Frontend works it → Backend reviews → Gill approves. The runtime prevents accidental "done" without sign-off.

**VET-89 (BLUF blank screen P0):** Could use review-only by Backend before close. Runtime ensures the QA gate isn't skipped.

**Audit value:** Every decision (approve/changes-requested) recorded in `issue_execution_decisions` with the run ID that produced it. For any high-stakes change (corpus separation, COI-adjacent work, production deploys), this is the audit trail you'd want.

**Comment-required backstop applies to ALL VETA agents automatically.** Both Backend + Frontend MUST comment before exit. If a VETA agent loops with "agent ran but no progress visible," check `issueCommentStatus` — `retry_queued` indicates the runtime is forcing it back to leave a trace.

### Cross-project relevance — Audiopheliac

Less applicable for solo creative work. But for **release-critical actions** ("Distribute to streaming services", "Publish marketing asset"), an approval stage with Gill as participant prevents anything shipping without explicit sign-off. The runtime gate is stronger than relying on Operator agent to remember.

Comment-required backstop also useful — every Operator run on a studio session leaves a trace, even if it's just "Reviewed session X, no changes needed."

---

## 57. Export & Import — package shape + operational details (extends §4 + §15)

### Package shape (verbatim from docs)
```
my-company/
├── COMPANY.md          ← Company name, goal, metadata
├── agents/
│   ├── ceo/AGENT.md    ← Agent identity, role, instructions
│   └── cto/AGENT.md
├── projects/
│   └── main/PROJECT.md
├── skills/
│   └── review/SKILL.md
└── .paperclip.yaml     ← Adapter types, env var DECLARATIONS, budgets
```

Human-readable markdown — anyone with the package can understand company structure without DB dump.

### What's included
- Company name, description, goal
- Agent names, roles, reporting structure, instructions
- Project definitions
- Skills
- Adapter type declarations + **NAMES** of env vars that need values

### What's NEVER included (security / portability)
- Secret values (API keys, tokens, passwords)
- Machine-specific paths
- Internal database IDs

These are environment-specific and wouldn't be valid on another machine anyway.

### Import safety default
**Imported agents always start with scheduled heartbeats DISABLED.** Per official docs: "This is intentional — gives you a chance to review the imported configuration and set your own budget and heartbeat settings before any agents start spending."

This matches the §54 healthy-posture recommendation: heartbeat off + wake-on-demand on.

### Post-import checklist (from official docs)
1. Open each imported agent, verify adapter config
2. Set per-agent budgets appropriate for your usage
3. Add API keys / env var values the package declared but didn't include
4. Enable heartbeats when ready

### UI surface
- **Org tab** has Export/Import company buttons in header
- **Company Settings** has same buttons
- Export shows package contents before download
- Import previews what will be created / renamed / skipped BEFORE applying

### Cross-project relevance

**VETA backup discipline:** Export VETA company periodically as backup. Capture: VETA company + Backend/Frontend agent configs + MERIT project + any company-level skills (once installed). Restore-from-package is the recovery path if/when:
- Paperclip instance corruption
- Migration to hosted paperclip
- Re-creating from scratch on a different machine
- Sharing a "VeteranIntel-shaped" template with anyone (not currently in scope)

```powershell
# Backup command:
npx paperclipai company export 9867b6c7-5c6e-47bd-bfeb-aedb74131f37 --out ./veta-backup-YYYYMMDD --include company,agents,projects,skills
```

Run before any significant agent config change. Store in workspace folder OR encrypted storage per §29 keys discipline.

**Audiopheliac:** When Audiopheliac company is stood up + configured well, export as template. Useful baseline for any future studio-like company configuration.

### Anti-pattern from docs
The `replace` collision strategy on import overwrites existing entities. Use only with a backup export in hand. `rename` (default) is the safe option.

---

## 58. Budget Enforcement — operational recipe (extends §10 + §27)

### Three setting paths

| Scope | Call | Notes |
|---|---|---|
| Company | `PATCH /api/companies/{id}/budgets` body `{budgetMonthlyCents: 10000}` | Defaults: `warnPercent: 80`, `hardStopEnabled: true`, `notifyEnabled: true`, `windowKind: calendar_month_utc` |
| Agent | `PATCH /api/agents/{id}/budgets` body `{budgetMonthlyCents: 2500}` | Independent of company cap — agent at 100% pauses even with company headroom |
| Project | `POST /api/companies/{id}/budgets/policies` body `{scope: project, scopeId, amountCents, ...}` | Defaults to `windowKind: lifetime` (NOT monthly). Pass `"windowKind": "calendar_month_utc"` to override. |

### Policy upsert for non-default thresholds
When you need a non-default `warnPercent`, a project-scoped policy, or warn-only mode:
```bash
POST /api/companies/{id}/budgets/policies
{
  "scope": "agent",
  "scopeId": "<agent-id>",
  "amountCents": 2500,
  "warnPercent": 70,         # default 80
  "hardStopEnabled": true,   # set false for warn-only
  "notifyEnabled": true,
  "windowKind": "calendar_month_utc"
}
```

**`hardStopEnabled: false`** = warn-only. Scope keeps spending past 100%, you only see the incident in overview. Per docs: "Use sparingly."

### Resolve incident API (extends §10)
```bash
POST /api/companies/{id}/budget-incidents/{incidentId}/resolve
{ "action": "raise_budget_and_resume", "amount": 15000 }
# OR
{ "action": "keep_paused" }
```
`amount` must exceed current observed spend OR resolve fails — a budget increase is only effective if it leaves headroom.

### Hard incident — five effects when 100% hit
1. Affected scope paused immediately, no more heartbeats
2. **In-progress run for the scope is cancelled** — issue stays where it was, agent stops working it
3. Budget control plane card increments Paused agents / Paused projects
4. Incident card on Budgets tab AND Overview tab (above the fold)
5. Audit trail records the pause + trigger + resolution

**No work is lost** — agent's tasks remain assigned. When cap raised or month resets, agent picks up where it left off.

### Force-spike test recipe (verify before relying)

```bash
# 1. Set tiny cap on a throwaway test agent
PATCH /api/agents/{TEST_AGENT_ID}/budgets
{ "budgetMonthlyCents": 50 }   # $0.50

# 2. Post synthetic cost event that pushes over the line
POST /api/companies/{COMPANY_ID}/cost-events
{
  "agentId": "<TEST_AGENT_ID>",
  "provider": "anthropic",
  "model": "claude-sonnet-4-20250514",
  "costCents": 60,
  "occurredAt": "<ISO now>"
}

# 3. Verify pause
GET /api/companies/{COMPANY_ID}/budgets/overview
# Expect: pausedAgentsCount +1, incidents entry with status="open", kind="hard_stop"

# 4. Clean up
POST /api/companies/{COMPANY_ID}/budget-incidents/{INCIDENT_ID}/resolve
{ "action": "keep_paused" }
```

**Failure modes if test agent never pauses:**
- (a) Cap set at company scope, agent has no per-agent policy
- (b) `hardStopEnabled: false` on the policy
- (c) Cost event rejected — agent-authenticated calls can only post their own costs; `occurredAt` must be real ISO string

### `billingCode` — attribution, not enforcement
Free-form label stamped on cost events to tell "$40 was campaign-X" from "$40 was refactor-Y" without modeling projects formally.

Two ways to populate without code changes:
- **From issues**: `PATCH /api/issues/{id}` with `{ "billingCode": "campaign-q2-launch" }` — adapters that pass `issueId` on cost events copy the code through automatically
- **From the agent at create time**: manager creating cross-team work sets billing code on issue → everything that follows inherits it

**Important:** `billingCode` shows up in cost reports + per-event detail rows. **Budget caps still apply at company/agent/project scopes.** For hard cap on billing code's lifetime spend → model as a project + put policy on project.

### No outbound webhooks today
For Slack/Discord pings on budget incidents, run a routine that diffs `GET /api/companies/{id}/budgets/overview` against a cursor and posts to a webhook. Same shape as the approval notifier pattern.

### Cross-project relevance — VeteranIntel pre-launch verification
**Before VETA produces real work, run the force-spike test** against a throwaway agent in the VAL parent company (NOT against VETA Backend/Frontend — they're in production now). Confirms:
- The agent-level cap at $80 hard / `warnPercent: 50` (warn at $40) actually pauses at the right point
- `hardStopEnabled: true` is set on each policy
- Incident appears in overview correctly

Take the agent budget tracker observed during S88 hire and verify against this recipe.

**`billingCode` is the lightweight attribution tool for VeteranIntel work.** Recommended codes:
- `vet-{number}` for specific tickets (`vet-89-bluf-fix`, `vet-96-iam-drift`)
- `merit-corpus-{date}` for corpus backfill runs
- `pivot-poc` for the PIVOT POC work

Set on each ticket via `PATCH /api/issues/{id}/billingCode` — automatic inheritance through cost events.

---

## 59. Routine Pattern Library (extends §54)

Three day-one patterns with policy choices documented verbatim from how-to guide:

| Pattern | Use case | Concurrency | Catch-up |
|---|---|---|---|
| **Daily standup** | Read yesterday's completed issues + post threaded summary | `coalesce_if_active` (merge work, don't duplicate) | `skip_missed` |
| **Inbox triage** | Re-prioritise + rewrite stale titles + age comments. Current snapshot matters, not history. | `skip_if_active` (drop new ticks when running) | `skip_missed` |
| **Deploy checks** | 30-min smoke test, opens critical issue on failure | `always_enqueue` (each run independently meaningful) | `skip_missed` |

### Five cron expressions worth memorising
| Cron | Fires |
|---|---|
| `0 9 * * 1-5` | Every weekday at 09:00 |
| `0 9 * * *` | Every day at 09:00 |
| `*/15 * * * *` | Every 15 minutes |
| `0 */4 * * *` | Every 4 hours, on the hour |
| `0 0 1 * *` | First of the month at 00:00 |

### Threaded run history via `parentIssueId`
Setting `parentIssueId` on a routine makes every execution a child of the same anchor issue. Comments go on the parent. **Result: single threaded conversation in run history rather than 30 disconnected tickets.**

For VeteranIntel: anchor a "217A corpus health" parent issue, then point recurring corpus-scan routines at it. The conversation stays threaded.

### Heartbeat-budget caps in description
The 30-issue cap from the inbox-triage pattern is the kind of guard worth writing in plain English in the routine description: *"Stop at 30 issues per run."* Heartbeats are short execution windows; an agent trying to triage 400 issues in one run times out and looks stuck. Better to cap + let next tick pick up rest.

### `/run` endpoint works regardless of trigger kinds
Manual fire works on routines with schedule OR webhook triggers — the `api` trigger kind only exists so the run history can attribute the run to a labeled "api" source. Don't need an `api` trigger to fire manually.

### Verification recipe after create
```bash
GET /api/routines/{routine_id}/runs?limit=10
```
| Status | Meaning |
|---|---|
| `received` | Tick accepted, dispatch in flight |
| `issue_created` | Fresh execution issue created + assigned |
| `coalesced` | Active run already existed, this tick linked to it |
| `skipped` | Active run already existed, concurrency policy dropped this tick |
| `completed` | Execution issue reached `done` |
| `failed` | Issue failed/cancelled OR dispatch errored. `failureReason` field tells you which. |

Force one tick now without waiting:
```bash
POST /api/routines/{id}/run
{ "source": "manual" }
```

### Failure modes when routine fires but does nothing
- Agent terminated or paused — check `GET /api/agents/{id}`
- Project / goal / parent issue deleted
- Variables missing defaults + trigger had nothing to interpolate

### VeteranIntel routine recommendations (with policy choices)

| Routine | Concurrency | Catch-up | Why |
|---|---|---|---|
| 217A corpus backfill scan | `coalesce_if_active` | `skip_missed` | No value running two scans on overlapping content |
| Cloud Scheduler alerts check | `skip_if_active` | `skip_missed` | Current state matters, not history |
| MERIT corpus separation audit (§7 boundary check) | `skip_if_active` | `skip_missed` | Current state matters |
| VBA training corpus status report | `coalesce_if_active` | `skip_missed` | Status report can merge |
| `/pivot` walkthrough nightly | `always_enqueue` | `skip_missed` | Each run is a discrete artifact |

### Audiopheliac routine recommendations
| Routine | Concurrency | Catch-up |
|---|---|---|
| Weekly NAS sample library hygiene | `coalesce_if_active` | `skip_missed` |
| Monthly Ableton template review | `coalesce_if_active` | `skip_missed` |
| Per-release task batch (parameterized via `{{release_name}}`) | `always_enqueue` | `skip_missed` |
| Quarterly hardware inventory + firmware | `coalesce_if_active` | `skip_missed` |

---

## 60. GitHub PR Integration — full recipe (NEW, high-value for VETA)

End-to-end pattern: assign Paperclip issue → agent provisions isolated worktree → commits + pushes → opens PR → moves issue to `in_review` → human/reviewer merges + closes Paperclip issue.

### Architecture
```
Paperclip issue              GitHub
─────────────────            ──────
assign to coder      ◀──→    branch + commits
status: in_progress          PR opened by agent
comments mirror PR           CI checks run
status: in_review            reviewer approves
status: done                 PR merged
        │                              │
        └── isolated git worktree ─────┘
            (one per Paperclip issue)
```

### Step 1 — Project workspace config

Two-call sequence to enable per-issue PR work:

```bash
# 1. Workspace pointing at the repo
POST /api/projects/{PROJECT_ID}/workspaces
{
  "name": "acme-api-main",
  "cwd": "/Users/me/work/acme-api",
  "repoUrl": "https://github.com/acme/api.git",
  "repoRef": "main",
  "isPrimary": true
}

# 2. CRITICAL — policy that enables per-issue isolation
PATCH /api/projects/{PROJECT_ID}
{
  "executionWorkspacePolicy": {
    "enabled": true,
    "allowIssueOverride": true,
    "workspaceStrategy": {
      "type": "git_worktree",
      "baseRef": "main"
    }
  }
}
```

**Without `executionWorkspacePolicy.workspaceStrategy.type = "git_worktree"`, every agent runs against the project's primary checkout** — losing the parallel-PR story. The UI's "Workspace mode: Isolated" toggle does the same thing.

### Default branch naming
`{issueIdentifier}-workspace` (e.g., `PAP-1802-workspace`). Override via `workspaceStrategy.branchTemplate` in the policy OR `branchName` on individual execution workspace.

### Step 2 — GitHub authentication — three options, three tradeoffs

| Option | Setup | Use when | Tradeoff |
|---|---|---|---|
| **A. PAT (fine-grained)** | Generate at GitHub Settings → Developer settings → PAT fine-grained. Scope: single repo. Permissions: Contents R/W + Pull requests R/W + Metadata R-only. Store as Paperclip secret. Reference via `GH_TOKEN` (gh CLI reads this) AND `GITHUB_TOKEN` (git HTTPS helper reads this) in adapter env. | Single dev team, couple of agents | Tied to a user — user leaves, token rots. Tends to drift out of inventory. |
| **B. GitHub App** | Org Settings → Developer settings → GitHub Apps → New. Permissions: Contents R/W + Pull requests R/W. Generate private key. Store App ID + installation ID + private key as secrets. Heartbeat exchanges for 1-hour installation token. | Multiple agents OR audit-trail-conscious team | More moving parts, 15-min setup. Worth it as soon as you have a real team. PR shows as `acme-paperclip[bot]` author. |
| **C. Host `gh auth login` keyring** | Interactive `gh auth login` on the agent host | **Smoke-test only** — local dev on single host | Doesn't travel into Docker. Multiple agents inherit same human's auth → unreadable audit logs. Hard to revoke without logging human out. |

**Per docs explicitly: "Treat host-keyring auth as the smoke-test option. Promote to Option A as soon as you have a second agent or move past your laptop."**

### Storing a GitHub PAT as Paperclip secret
```bash
POST /api/companies/{COMPANY_ID}/secrets
{
  "name": "GITHUB_TOKEN_ACME",
  "value": "github_pat_..."
}
```

Reference on coder agent adapter config:
```json
"env": {
  "GH_TOKEN":     { "type": "secret_ref", "secretId": "<id>", "version": "latest" },
  "GITHUB_TOKEN": { "type": "secret_ref", "secretId": "<id>", "version": "latest" }
}
```

**Both env var names are required** — `gh` CLI reads `GH_TOKEN`, git's HTTPS helper reads `GITHUB_TOKEN`. Setting both means `git push` works without an extra credential helper.

### Step 3 — Agent AGENTS.md PR-driven working rules

Drops into the working-rules section of `AGENTS.md` for any coder role:

```md
## Working rules: PR-driven
Always work on a feature branch, never on `main` directly. Paperclip provisions
isolated git worktree per issue; worktree is already on the right branch when
you check the issue out.

Before exiting a heartbeat:
1. Commit changes. One conventional-commit message per logical change.
   `git add -A && git commit -m "fix(api): handle null org ids on signup"`
2. Push the branch.
   `git push -u origin HEAD`
3. Open a PR if none exists. `gh pr create --fill --base main`
   Copy resulting URL into the issue thread as first line of status comment.
4. Move issue to `in_review` when PR up AND CI is green.

If CI fails: don't merge. Re-open task, fix, push another commit on same branch,
tell reviewer what changed.

Never use `--no-verify`, `git push --force` to shared branch, or
`gh pr merge --admin`. If can't pass CI, mark issue `blocked` + name failing check.
```

### Review workflow — two parallel surfaces, NOT redundant
| Surface | What you do here |
|---|---|
| **GitHub PR** | Read diff, line-by-line comments, watch CI, request changes via GitHub review UI. Coder agent configured (rule above) to refuse merging on its own — human or senior agent merges. |
| **Paperclip issue** | Track status (`in_review` → `done`), pipe approvals to Slack, link PR to goal/project, gate next step. |

### No automatic merge inference
Paperclip does NOT auto-update issue status on PR merge. Options:
- Human/CI bot merges through GitHub + reviewer agent moves Paperclip to `done` with merge SHA in comment (manual)
- Webhook routine listening to `pull_request.closed` with `merged: true` → PATCH linked issue (automated; ~20-line script)

If team uses Paperclip's Execution Policy (§56), set policy on the project so issue passes `engineer → reviewer → done` automatically when agent submits and reviewer approves.

### Troubleshooting (6 items from docs)
| Symptom | Cause | Fix |
|---|---|---|
| `Permission denied (publickey)` on push | Worktree remote is HTTPS but no `GITHUB_TOKEN` env | Check adapter env block resolves secret. Smoke test: `env | grep -E 'GH_TOKEN|GITHUB_TOKEN'` from heartbeat shell. |
| `gh: command not found` | GitHub CLI not on PATH | `brew install gh` OR pull from GitHub releases. **Claude Code adapter does NOT bundle `gh`.** |
| Merge conflicts on agent's branch | Agent trying to resolve blindly | Agent should mark `blocked` with conflicting files named, NOT run `git checkout --theirs` |
| CI fails but agent moved issue to `in_review` | Rules don't enforce CI gate | Tighten AGENTS.md: "move to `in_review` only after `gh pr checks --watch` exits 0" |
| PR commits authored by `noreply@github.com` | Git config not set in worktree | Set `git config user.name` + `user.email` in provision command on project workspace. Convention: `Paperclip Coder <noreply@paperclip.example.com>`. |
| Agent creates new branches per heartbeat | Workspace mode is `project_primary` instead of `git_worktree` | Switch project's executionWorkspacePolicy.workspaceStrategy.type to `git_worktree` |

### Cross-project relevance — VETA application

VETA Backend + Frontend will both ship code through PRs eventually. Recommended sequence when ready:

**Step 1 — Project workspace setup for VETA MERIT:**
```bash
POST /api/projects/8334f050-3f05-487a-9c30-50956ea0660b/workspaces
{
  "name": "veteran-analytics-main",
  "cwd": "C:\\Users\\gillo\\Veteran Analytics LLC\\GitHub Clones\\veteran-analytics",
  "repoUrl": "https://github.com/VeteranAnalyticsLLC/veteran-analytics.git",
  "repoRef": "main",
  "isPrimary": true
}
```

**Step 2 — Enable per-issue isolation:**
```bash
PATCH /api/projects/8334f050-3f05-487a-9c30-50956ea0660b
{
  "executionWorkspacePolicy": {
    "enabled": true,
    "allowIssueOverride": true,
    "workspaceStrategy": {
      "type": "git_worktree",
      "baseRef": "main",
      "branchTemplate": "veta/{issueIdentifier}"
    }
  }
}
```

**Step 3 — GitHub auth: PAT (Option A) is the minimum bar.** VeteranIntel has 2 coding agents (Backend + Frontend) → past the host-keyring smoke-test threshold per docs. Generate fine-grained PAT scoped to `veteran-analytics` repo with Contents R/W + Pull requests R/W. Store via `POST /api/companies/.../secrets` named `GITHUB_PAT_VETERANINTEL` (key file location per §29 keys discipline). Reference in BOTH `GH_TOKEN` and `GITHUB_TOKEN` env vars on each agent.

**Step 4 — Add PR-driven working rules to BOTH VETA Backend AGENTS.md + Frontend AGENTS.md.** Use the template above verbatim, adapted for VeteranIntel's commit conventions.

**Step 5 — `gh` CLI must be on Rafa's PATH** — and on whichever host paperclip runs on. Verify via Rafa: `gh --version`.

**Step 6 — Per §56 Execution Policy, consider runtime-enforced review stages for high-stakes work.** For any PR touching:
- §7 corpus separation boundary code (MERIT/VALOR data store access)
- §30 COI-adjacent compensation logic
- Production deploy gating (`deploy.yml` workflow)

Apply execution policy: Frontend works → Backend reviews → Gill (board user) approves. PR also reviewed in GitHub, but the Paperclip-side governance prevents accidental "done" without sign-off.

**Step 7 — Git config in provision command** for clean PR authorship:
```
git config user.name "VeteranIntel Engineer"
git config user.email "noreply@veteranintel.org"
```
(Or whatever Gill prefers — won't be a real human's name per multi-agent attribution discipline from docs.)

### Cross-project relevance — Audiopheliac
Applies only if Audiopheliac has code components (NAS automation scripts, Python sample-processing tools, etc.). For pure Ableton/audio work, the PR workflow is N/A — those projects aren't git-managed.

---

## 61. MCP Integration — operational recipe (NEW)

Model Context Protocol (MCP) is how you give an agent executable capability that doesn't fit a skill (markdown-only) and that you don't want to teach the agent to call as raw HTTP. **If the tool already speaks MCP, prefer that path.**

### Adapter support status (from official docs)
| Adapter | MCP path |
|---|---|
| `claude_local` | Inherits Claude Code's MCP client. Configured at Claude Code level. **Documented.** |
| `hermes_local` | MCP via `toolsets: "...,mcp"` field. Servers in `~/.hermes/config.yaml`. **Documented.** |
| `codex_local`, `cursor`, `gemini_local`, `opencode_local`, `pi_local` | Inherit whatever MCP support the CLI ships with. **Not documented yet.** |

### Architecture
```
Paperclip control → Adapter → Runtime (Claude Code / Hermes) → MCP JSON-RPC
                                                                  ↓
                                                Local stdio server OR Remote HTTP/SSE
```
**Agents never speak MCP directly — their runtimes do.** Means MCP server config is per-runtime, and SCOPING (which agent sees which server) is a function of adapter config + runtime config file location, not a Paperclip-level switch.

### Claude Code MCP config scopes (precedence: local > project > user)
| Scope | Stored at | Visibility |
|---|---|---|
| **Local** (default) | `~/.claude.json` under current project's path | Just you, only when running from that project. Not in git. |
| **Project** | `<repo-root>/.mcp.json` | Anyone with that `cwd`. Committed to source control. |
| **User** | `~/.claude.json` user-wide | Every Claude Code run by that OS user, all projects. |

**For Paperclip: prefer project scope** because Claude Local's `cwd` already pins agent to a specific working directory. `.mcp.json` ships with project so other contributors + other agents pointed at same `cwd` get the same servers.

### Local stdio server — Claude Local (Path A)
```bash
cd /Users/me/projects/paperclip-workspace  # the agent's cwd
claude mcp add --transport stdio --scope project filesystem -- \
  npx -y @modelcontextprotocol/server-filesystem /Users/me/projects/paperclip-workspace
```
Options BEFORE name, `--` separates name from command+args.

Writes `.mcp.json` in project root:
```json
{
  "mcpServers": {
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path"],
      "env": {}
    }
  }
}
```

Verify: `claude mcp list` from same shell as heartbeat.
- `<name>: <cmd> - ✓ Connected` = healthy
- `<name>: <cmd> - ✗ Failed to connect` = broken (most often: command not on PATH)

### Local stdio server — Hermes Local (Path B)
Adapter config:
```json
{
  "adapterType": "hermes_local",
  "adapterConfig": {
    "model": "anthropic/claude-sonnet-4",
    "toolsets": "terminal,file,mcp",
    "persistSession": true
  }
}
```
Including `mcp` in `toolsets` is what tells Hermes to start MCP client. Without it, Hermes ignores YAML config.

Hermes YAML at `~/.hermes/config.yaml`:
```yaml
mcp_servers:
  filesystem:
    command: npx
    args:
      - "-y"
      - "@modelcontextprotocol/server-filesystem"
      - "/Users/me/projects/paperclip-workspace"
```

**Hermes server registration is host-wide** (per-OS-user, not per-agent). For per-agent isolation: distinct OS users.

### Remote MCP server — OAuth flow gotcha

Paperclip runs runtimes headlessly. OAuth redirect-and-paste flow needs interactive shell ONCE.

**Pattern that works:**
1. Add server interactively as **same OS user that runs heartbeat**
2. Walk through OAuth once. Runtime persists tokens in user's config dir + auto-refreshes
3. Subsequent heartbeats run headless — token already on disk

```bash
# As the OS user the heartbeat runs as:
cd /Users/me/projects/paperclip-workspace
claude mcp add --transport http --scope user github https://api.githubcopilot.com/mcp/

# Interactive Claude session once to complete OAuth:
claude
> /mcp
# Pick "github" from list → browser redirect → paste code back
```

Verify: `claude mcp get github` reports `OAuth: configured`.

**User scope is correct for remote MCP.** OAuth tokens tied to OS user → don't commit to project `.mcp.json`.

### Remote MCP — Hermes Local (bearer auth alternative)
```yaml
mcp_servers:
  github:
    transport: http
    url: https://api.githubcopilot.com/mcp/
    headers:
      Authorization: "Bearer ${GITHUB_MCP_TOKEN}"
```
`${GITHUB_MCP_TOKEN}` resolves from agent's env. Reference Paperclip secret in adapter `env` block — never inline:
```json
"env": {
  "GITHUB_MCP_TOKEN": { "type": "secret_ref", "secretId": "<id>", "version": "latest" }
}
```

### Scoping hierarchy (who sees which MCP)
| Registration | Visibility |
|---|---|
| Project `.mcp.json` (committed) | Every agent with that `cwd` |
| Local `~/.claude.json` per project path | Just OS user, only from that `cwd` |
| User `~/.claude.json` OR `~/.hermes/config.yaml` | Every agent run by that OS user on host |
| Adapter-level (`HERMES_CONFIG=~/.hermes/agent-X.yaml` via env override) | Just that one agent |

**Practical isolation rules:**
- One MCP, all coders on repo → project `.mcp.json`, committed
- One MCP, just this agent → unique `cwd` OR dedicated OS user OR `HERMES_CONFIG` override
- Personal experiment → local scope OR per-agent YAML override

### Three debugging approaches
1. **Run runtime's list command in heartbeat's shell + env**: `claude mcp list` / `hermes mcp list`. If heartbeat sees different list than your shell, env or cwd has drifted.
2. **Read run transcript**: MCP calls appear with `mcp__<server>__<tool>` namespacing.
3. **One-line probe task**: "List the MCP tools you have access to. Don't call any — just enumerate." Forces runtime to materialize available tools without side effects.

### Worked example — GitHub MCP for issue filing
Alternative to shelling out to `gh` CLI per §60:

```bash
# 1. Store PAT (issues: write scope) as Paperclip secret
POST /api/companies/{id}/secrets
{ "name": "GITHUB_MCP_TOKEN", "value": "github_pat_..." }

# 2. Reference in agent adapter env
"env": {
  "GITHUB_MCP_TOKEN": { "type": "secret_ref", "secretId": "<id>", "version": "latest" }
}

# 3. Add MCP server at user scope (PAT auth, no OAuth)
claude mcp add --transport http --scope user github https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer $GITHUB_MCP_TOKEN"
```

Agent calls `mcp__github__create_issue` with `owner`, `repo`, `title`, `body`. Transcript shows call + response.

### Six troubleshooting failure modes
| Symptom | Cause | Fix |
|---|---|---|
| `mcp list` shows server, agent never calls | Tool description vague OR AGENTS.md doesn't mention | Add hint to AGENTS.md: "When you need to file an issue, use the GitHub MCP server (`mcp__github__*` tools) rather than `gh` or curl." |
| `claude mcp list` shows `✗ Failed to connect` | Command not on PATH for heartbeat user, missing env var, wrong cwd | Run server command directly in same shell for specific error |
| Different tool list under Paperclip vs terminal | cwd or env diff | `pwd && env | sort` from heartbeat run vs your shell. Most common: `PATH` diff (GUI-launched processes have leaner PATH). |
| Remote server `401` after hours | OAuth refresh failed | Re-run `claude` interactively |
| Two agents on same project see each other's servers | By design — project scope is shared | Move per-agent servers to user scope OR split per-agent cwd |
| Server I removed still listed | Claude Code caches parsed config briefly | Restart long-running session OR wait until next heartbeat (Paperclip spawns fresh CLI per run for claude_local) |

### Cross-project relevance — VeteranIntel
**Strong fit for VETA work.** MCP gives VETA Backend + Frontend executable capabilities without baking them into adapter config:

| MCP server | Use for |
|---|---|
| GitHub MCP | Filing tickets, opening PRs (alternative to gh CLI per §60). `mcp__github__create_issue`, `mcp__github__create_pull_request`. |
| Postgres MCP | Direct queries against any VeteranIntel database. Scope tightly via PostgREST or via DB-level row security. |
| Filesystem MCP | Project-scoped file ops. Probably redundant with claude_local built-in file tools. |
| Custom MCP for MERIT queries | Wrap MERIT corpus retrieval as an MCP tool — agents call `mcp__merit__query` instead of HTTP-curling the Vertex AI endpoint. Cleanest path if we want VETA agents to use MERIT without it being a separate skill. |

**Recommended for VETA: project `.mcp.json` at `veteran-analytics` repo root** committed to the repo. Both Backend + Frontend pointed at same `cwd` (per §60) → both inherit the same server set. Shared tools = consistent capabilities.

### Cross-project relevance — Audiopheliac
MCP could wrap:
- **NAS sample library MCP** — agent queries "find me kicks under 120bpm" without learning a filesystem dialect
- **Ableton project file MCP** — read session metadata, track listings, version comparison

Both are theoretical until an Audiopheliac Operator agent exists, but worth recording as the right architectural shape when we get there.

---

## 62. Skill Authoring Recipe (extends §18)

The 5-call recipe for adding a custom skill to a company library and attaching it to specific agents:

### Required capability: `agents:create`
All skill mutations require this gate: board user, company CEO agent, OR agent with `permissions.canCreateAgents=true`. Same gate for import / scan / sync / per-skill detail/files routes.

### Recipe — local path while iterating

```bash
# 1. Author on disk: SKILL.md + references/ structure
mkdir -p ~/skills/{skill-name}/references
# Write ~/skills/{skill-name}/SKILL.md with frontmatter + body

# 2. Import from parent folder (so references/ ships with it)
POST /api/companies/{id}/skills/import
{ "source": "/Users/me/skills" }
# Response includes imported[] with canonical key like local/<hash>/{slug}

# 3. Verify install
GET /api/companies/{id}/skills

# 4. Attach to agent (RECONCILING — sends full desiredSkills set, not just additions)
POST /api/agents/{id}/skills/sync
{ "desiredSkills": ["paperclip", "{skill-key}", "<other existing skills>"] }

# 5. Trigger with test task whose description matches routing description
POST /api/companies/{id}/issues
{ "title": "...", "description": "Match the skill's 'Use when...' clause", ... }
```

### Local path imports are LIVE
Edits to file on disk show up next time skill is read. No re-import needed. **Useful while iterating.** Switch to GitHub source before promoting to real agent.

### Frontmatter parser gotcha
Paperclip's YAML reader is narrow. **Avoid block scalars** (`>` or `|`) for descriptions — current reader treats them as literal, doesn't fold. Use one-line strings.

Frontmatter rules:
- Spaces (not tabs)
- `- ` for list items
- Plain one-line string values for `name` + `description`

### `desiredSkills` is reconciling, not additive
Anything in the array is attached, anything NOT in array is detached. **Always send full set.** If you don't know current set:
```bash
GET /api/agents/{id}/skills
```

### Reference resolution priority
1. Canonical key (preferred for scripts — unambiguous)
2. Skill UUID
3. Slug (rejected with 422 if ambiguous across multiple skills)

### Bundled skills always attached
`paperclipai/paperclip/*` skills are unioned into every resolved set regardless of what `desiredSkills` says. Leaving them out doesn't remove — just makes the snapshot response confusing.

### "Tightening description is the lever, not body"
Per docs verbatim: "If the agent doesn't load the skill when it should, the body is rarely the problem. Rewrite the `description` to name the trigger more concretely. The body only matters once the skill is actually loaded."

### Cross-project relevance — VeteranIntel skill candidates

| Skill | Routing description | Body |
|---|---|---|
| `va-citation-formatter` | "Use when citing CFR, USC, or VA M21-1 sections. Don't use when writing narrative or commentary." | Format conventions for CFR/USC citations, M21-1 section structure |
| `merit-corpus-separation-checker` | "Use when working on code that touches MERIT (`merit-only-1776641470`) or VALOR (`valor-ai_1774299470530`) data stores. Don't use for unrelated work." | Walkthrough of §7 boundary checks before any cross-store reference |
| `217a-policy-compliance-checker` | "Use when reviewing analytical content for 217A policy adherence." | The §30 COI Hold rules + what NOT to put in AI systems |
| `bluf-format-writer` | "Use when writing BLUF-style executive summaries." | The BLUF (Bottom Line Up Front) format conventions |

Recommended path:
1. Author locally at `C:\Users\gillo\Veteran Analytics LLC\VeteranIntel\skills\{name}\` while iterating
2. Promote to GitHub `VeteranAnalyticsLLC/veteranintel-skills` repo once stable → pinned commit + diff review
3. Attach via `desiredSkills` to VETA Backend + Frontend agents

### Versioning per source type (from §62 + reinforced from §18)
| Source | Pinned? | Update path |
|---|---|---|
| Local path | No, live | Edit file on disk |
| Paperclip-managed (UI + button) | No, live | Edit in Markdown editor |
| GitHub | Yes, commit SHA | `update-status` → `install-update` |
| skills.sh | Yes (GitHub under the hood) | Same |
| URL/raw | No | Re-import URL |
| Bundled | Pinned to Paperclip release | Upgrade Paperclip |

---

## 63. Bring Your Own Agent — three paths (extends §19)

When you want a non-built-in agent runtime, three paths. From official docs verbatim, with operational implications.

### Tradeoff matrix
| Concern | OpenClaw (A) | HTTP webhook (B) | Custom script (C) |
|---|---|---|---|
| Latency on new task | Sub-second (WebSocket held open) | One round-trip + queue depth | Up to your poll interval |
| Operational cost | OpenClaw infra you already run | Small HTTPS service | A box running Python |
| Trust surface | Device pairing + gateway token | Shared secret in Authorization header | Bearer API key scoped to agent |
| Debuggability | OpenClaw logs + Paperclip transcript | Your service logs + Paperclip transcript | `print()` + API responses |
| Automatic budget tracking | Yes | Yes | **No — you instrument it** |
| Survives Paperclip downtime | No (WebSocket drops) | No (no wake fires) | Yes (but no work to do) |

**Dominant axis: who initiates.** A + B let Paperclip initiate; C flips the relationship to pull.

### Path A — OpenClaw invite
```bash
# 1. Generate invite prompt
POST /api/companies/{id}/openclaw/invite-prompt
{ "agentMessage": "Join as a coder agent on the API workspace." }
# Response: inviteUrl, inviteMessage, token, onboardingTextUrl

# 2. Paste inviteMessage into OpenClaw chat
# OpenClaw calls back → lands as hire_agent approval pointing at draft openclaw_gateway agent

# 3. Approve hire
POST /api/approvals/{id}/approve
# Activates agent + issues one-time API key OpenClaw claims on next contact
# Device pairing automatic on first run if disableDeviceAuth=false
```

### Path B — HTTP webhook adapter
**Critical security note from docs:** "Paperclip does not sign outgoing webhook bodies today — there is no `X-Paperclip-Signature` HMAC header. Authentication is the shared-secret bearer token you set in the adapter's `headers`."

Webhook body signing is on roadmap; until then, terminate TLS on a host you trust.

```bash
# 1. Generate strong shared secret
SECRET=$(openssl rand -hex 32)

# 2. Hire agent with http adapter
POST /api/companies/{id}/agent-hires
{
  "name": "Webhook Worker",
  "role": "engineer",
  "adapterType": "http",
  "adapterConfig": {
    "url": "https://agent.example.com/paperclip/heartbeat",
    "method": "POST",
    "headers": { "Authorization": "Bearer $SECRET" },
    "timeoutMs": 10000
  }
}

# 3. Set PAPERCLIP_WEBHOOK_SECRET=$SECRET on your service
```

Body Paperclip POSTs:
- `runId`
- `agentId`
- `context.taskId`

Your service uses `PAPERCLIP_API_KEY` on agent's `env` to PATCH the issue when done.

### Path C — Custom script (no Paperclip-side adapter)
**Trades latency + budget tracking for total control.** Use for prototypes, batch jobs, "I just want to write Python" cases.

```bash
# 1. Mint API key for agent (board-only)
POST /api/agents/{id}/keys
{ "name": "byo-script" }
# Token shown ONCE in response — save it
```

50-line heartbeat loop pattern:
```python
def heartbeat():
    run_id = str(uuid.uuid4())
    rh = {**H, "X-Paperclip-Run-Id": run_id}
    # 1. Identity
    me = requests.get(f"{API}/api/agents/me", headers=H).json()
    # 2. Inbox
    inbox = requests.get(f"{API}/api/agents/me/inbox-lite", headers=H).json()
    actionable = [i for i in inbox if i["status"] in ("todo", "in_progress")]
    if not actionable: return
    # 3. Priority sort (in_progress before todo)
    actionable.sort(key=lambda i: 0 if i["status"] == "in_progress" else 1)
    issue = actionable[0]
    # 4. Checkout (409 → never retry, pick different issue)
    co = requests.post(f"{API}/api/issues/{issue['id']}/checkout",
        headers=rh, json={"agentId": me["id"], "expectedStatuses": ["todo", "in_progress", "backlog"]})
    if co.status_code == 409: return
    # 5. Do work
    summary = do_real_work(issue)
    # 6. Update status
    requests.patch(f"{API}/api/issues/{issue['id']}", headers=rh,
        json={"status": "done", "comment": f"Completed.\n\n{summary}"})
```

### What Path C gives up
- Wake-driven execution. No comment heartbeats, no `PAPERCLIP_WAKE_REASON`, no routine wakes.
- Adapter-managed budget tracking. Run cost telemetry NOT recorded automatically. Budget policies still gate spend, but your script must report cost manually for tracking.
- Workspace + skill sync. No project workspace provisioning, no AGENTS.md materialisation. Script reads issue + figures it out.

### Cross-project relevance — VeteranIntel + Audiopheliac

**For VeteranIntel**:
- **Path B (HTTP webhook)** is the right fit if we want to wrap Rafa's CLI execution surface as a paperclip-managed adapter. Webhook lives at `https://rafa-bridge.veteranintel.org/heartbeat` or local equivalent. Per §32 of VI CLAUDE.md, Rafa is the execution surface that bridges Cowork to paperclip — could formalize this as a paperclip adapter rather than the current "Sully drafts, Rafa executes" pattern. Not currently in scope; recording the architectural option.
- **Path C (custom script)** is overkill — VETA Backend + Frontend run via claude_local just fine. Path C would only make sense for ad-hoc Python automation that needs Paperclip's ticket model.

**For Audiopheliac**:
- **Path B** is interesting for studio automation. A small Python/Node service that calls Ableton's Live Object Model API, queries the NAS sample library, etc. Wake on issue assignment → do studio work → update Paperclip issue. Cleaner than building a custom MCP server for the same functionality.
- **Path A (OpenClaw)** unlikely fit — Audiopheliac isn't a code-shipping context.

---

## 64. Hosted Deployment — Fly.io specifics (extends §22, §24, §30)

Beyond the VPS playbook in §30, Fly.io is documented as the "primary fast path" for hosted paperclip. Adding specifics.

### Fly.io setup commands (from official docs)
```bash
flyctl launch --image paperclip-local --no-deploy
flyctl volumes create paperclip_data --size 5

# Edit fly.toml: mount volume at /paperclip, internal port 3100

flyctl secrets set \
  HOST=0.0.0.0 \
  PAPERCLIP_HOME=/paperclip \
  PAPERCLIP_DEPLOYMENT_MODE=authenticated \
  PAPERCLIP_DEPLOYMENT_EXPOSURE=public \
  PAPERCLIP_PUBLIC_URL=https://paperclip.example.com \
  DATABASE_URL=postgres://...:5432/paperclip \
  PAPERCLIP_AGENT_JWT_SECRET=$(openssl rand -hex 32) \
  ANTHROPIC_API_KEY=sk-...

flyctl deploy
flyctl certs add paperclip.example.com
```

First request triggers schema migration. Confirm: `curl https://paperclip.example.com/api/health` → `{"status":"ok"}`.

### Resolved canonical env var name (re-verified)
`PAPERCLIP_PUBLIC_URL` is used in the Fly.io recipe here, while §28 captures `PAPERCLIP_AUTH_PUBLIC_BASE_URL` from the Installation page. **Both appear in official docs.** Per §32 docs-discrepancy hygiene: verify against running instance via `paperclipai env` before assuming one is canonical. Likely both work as aliases but only one is the documented source of truth — needs confirmation if we ever host.

### Agent runner placement decision
**Default: co-located** in same container. Local adapters (`claude_local`, `codex_local`) run as child processes when heartbeat fires. Fine until container CPU/memory contention starts.

**Move to separate machines once heartbeats contend with API:**
- Configure adapters to point at remote runner pool
- OR run second container with same `DATABASE_URL` + `PAPERCLIP_API_URL` accepting only agent traffic

Per docs: "Worth it past a handful of busy agents."

### Cost estimate (April 2026, from docs)
| Component | Fly.io | VPS |
|---|---|---|
| Compute | $5-10 (shared-cpu-1x, 1GB) | $5-10 (Hetzner CX22, DO basic) |
| Postgres | $0 (Neon/Supabase free tier) - $25 (Fly Postgres dev) | Same |
| Volume/disk | ~$1 (5GB) | Included |
| Bandwidth | Low usage typically free | Included |
| **Total** | **~$5-35/mo** | **~$5-35/mo** |

### Observability
- **Logs**: Fly: `flyctl logs`. VPS: `docker logs -f paperclip`. Health: `GET /api/health`.
- **Metrics**: Dashboard per-agent run history, costs, budget at `/<prefix>/agents/<key>/runs`.
- **Alerts**: Hook non-200 from `/api/health` for liveness, `paperclipai doctor` exit code for config drift.

### Backups
- Postgres → provider's job, enable it
- Company data + uploads → scheduled CEO-safe export via [Back Up and Restore a Company]

### Cross-project relevance
Not currently in scope for VeteranIntel — Gill's paperclip runs locally. If ever hosted:
- **Fly.io is the recommended path** per docs (vs. VPS Step 1-10 playbook in §30)
- Supabase free tier for Postgres = $0 to start
- Total $5-35/mo for the deployment
- Single container fits VETA Backend + Frontend + future Operator with room. Move runners to separate container only when usage justifies.

---

## 65. Backup + Restore — operational recipe (extends §57)

### CRITICAL — two-route distinction
| Route | Capabilities | Required auth |
|---|---|---|
| **Board route** `POST /api/companies/import` | Supports `target.mode = new_company` (true disaster recovery). Accepts ALL collision strategies including `replace`. | Instance-admin board access. **Agents (even CEOs) CANNOT call this.** |
| **CEO-safe routes** `POST /api/companies/{id}/imports/preview` + `/imports/apply` | Same-company imports only. **`replace` collision strategy is REJECTED.** | CEO agent of route company OR board caller. |

### CEO-safe gate enforcement (verbatim from docs)
1. `target.companyId` must equal route company. Other id → **403 forbidden: Safe import route can only target the route company**
2. `collisionStrategy: "replace"` → **403 forbidden: Safe import route does not allow replace collision strategy**

### Why `replace` is rejected on safe routes
> "CEO agent can fire imports unattended (a routine, a webhook, a spurious `apply` after a comment). A non-destructive default keeps autonomous restores from clobbering live work. If you genuinely need `replace` semantics — say, you're forcibly snapping production back to a known-good bundle — go through the board route at `POST /api/companies/import` with a board token. That path is explicit, audited, and gated by a human session."

### Three-step recipe — preview → export → persist
```bash
# 1. Preview (no persistence, just inventory)
POST /api/companies/{id}/exports/preview
{ "include": { "company": true, "agents": true, "projects": true, "issues": false } }
# Response: fileInventory + manifest + warnings

# 2. Build (returns files map keyed by path)
POST /api/companies/{id}/exports
{
  "include": { "company": true, "agents": true, "projects": true },
  "agents": ["ceo", "cto"],
  "expandReferencedSkills": true
}

# 3. Persist to backup target (S3, Git, mounted volume, etc.)
```

### `selectedFiles` — narrow the file payload
Pass explicit array of paths drawn from preview's `fileInventory`:
```json
{
  "include": { "company": true, "agents": true, "projects": true },
  "selectedFiles": [
    "my-company/COMPANY.md",
    "my-company/agents/ceo/AGENT.md"
  ]
}
```
Anything not listed is dropped from `files` object. **Manifest still describes whole company; `selectedFiles` only filters file payload.**

### Access control on export routes
| Caller | Allowed? |
|---|---|
| CEO agent of the route company | ✅ |
| Board caller with company access | ✅ |
| Non-CEO agent inside route company | ❌ 403 "Only CEO agents can manage company exports" |
| Agent JWT from different company | ❌ 403 "Agent key cannot access another company" |

### Nightly export routine pattern
Small backup-owner agent (CEO-role) dedicated to running export + writing bundle to backup storage. Routine fires daily at 02:00 UTC.

```bash
# Routine
POST /api/companies/{id}/routines
{
  "title": "Nightly company export",
  "description": "Run full export and ship to backup storage. Retention: 7 daily, 4 weekly, 12 monthly.",
  "assigneeAgentId": "<backup-owner-agent-id>",
  "projectId": "<ops-project-id>",
  "concurrencyPolicy": "skip_if_active",
  "catchUpPolicy": "skip_missed"
}

# Schedule trigger
POST /api/routines/{id}/triggers
{
  "kind": "schedule",
  "cronExpression": "0 2 * * *",
  "timezone": "UTC"
}
```

Agent's heartbeat:
1. `POST /exports/preview` to inventory
2. `POST /exports` to build
3. Upload resulting `files` payload to backup target

### Round-trip verification (3 checks)
1. **Counts** — agent + project counts in restored company match source
2. **Adapter config** — restored agent's adapter type + runtime config correct. **Env-var VALUES won't be present by design** — fill in before enabling heartbeats
3. **First heartbeat** — restored agent + tiny budget + enable heartbeats + trivial task. If it wakes + checks out + comments → healthy

### Aphorism worth recording (from docs verbatim)
> "A bundle that round-trips cleanly today will round-trip cleanly in six months. A bundle nobody has ever restored is only a backup in name."

### Cross-project relevance — VeteranIntel
**Nightly VETA backup routine** is now a recipe:
- Hire dedicated backup-owner agent (CEO role) on VETA company OR have an existing CEO agent (if/when hired) take this on
- Routine fires `0 2 * * *` UTC daily
- Uploads bundle to `C:\Users\gillo\Veteran Analytics LLC\paperclip-backups\` OR NAS at `V:\` OR future cloud storage
- Retention pinned in agent instructions: "7 daily, 4 weekly, 12 monthly"

**Disaster recovery (re-create VETA from backup)** requires Gill personally — only the board route at `POST /api/companies/import` with `target.mode = new_company` can do this. CEO-safe routes refuse. This is the right safety rail.

**`replace` collision strategy rejection** prevents autonomous agents from clobbering production. If we ever need to force-snap VETA back to a known-good bundle, that's a Gill-personally-via-board-token operation.

---

## 66. Debug Stuck Heartbeat — playbook (NEW)

Five symptoms cover almost every "this agent isn't working right" report. Open agent's detail page → Run history before starting.

### Symptom 1 — Agent wakes up, then exits immediately
**Signs:** Runs appear in Run history, complete in seconds, post no comment. Status flips back to `idle`.

**Cause:** Empty inbox + timer.

**Fix:** Agent → Run Policy → Heartbeat on interval = OFF. Rely on assignment-driven wakes. (Same as §54 healthy-posture recommendation.)

### Symptom 2 — Checkout fails with 409 Conflict
**Signs:** `POST /api/issues/{id}/checkout → 409`. Run aborts.

**Cause:** Two agents got woken for same issue. First one owns it.

**Fix:** **Don't retry** — pick different task. If both agents are supposed to share the work, split issue into child issues with `parentId` set.

### Symptom 3 — Run dies with exit code 143
**Signs:** Run status `failed` with `exited with code 143` (SIGTERM).

**Cause:** Timeout or OOM. Heartbeats are sized for short windows.

**Fix (three options):**
1. Break work into child issues (`POST /companies/{id}/issues` with `parentId`)
2. Tighten context — prefer `GET /api/issues/{id}/heartbeat-context` over full-repo reads
3. Move long single-shot work to a routine off the heartbeat path

### Symptom 4 — Issue cancelled mid-run, agent keeps acting
**Signs:** You cancel from UI; agent comments a few seconds later anyway.

**Cause:** Wake payload was captured before cancel landed.

**Fix:** Mostly self-healing — next heartbeat sees new status and exits. For custom agents: re-fetch `GET /api/issues/{id}` at top of each run and bail on `cancelled`.

### Symptom 5 — Same "blocked" comment posted every heartbeat
**Signs:** `blocked` issue accumulates same status comment each tick.

**Cause:** Missing dedup before posting.

**Fix:** Before commenting on a `blocked` issue:
- Fetch `GET /api/issues/{id}/comments?order=asc`
- If most recent author is you AND body matches → skip
- Only re-engage on new comment, status change, or event-driven wake

### Where to look first (three places)
| Surface | What it gives you |
|---|---|
| Run logs (Agent detail → Run history → click run) | Full transcript + exit code |
| `GET /api/issues/{id}/heartbeat-context` | Exact payload the agent sees on wake |
| `GET /api/issues/{id}/comments` | Source of truth for what agent has actually said |

### Three escalation triggers
1. Same failure 3 consecutive runs after a fix
2. Agent paused at 100% budget + unclear if loop is cause or symptom
3. Run hangs in `running` longer than heartbeat timeout → **infrastructure problem, not agent**

### Cross-project relevance — VeteranIntel
**All five symptoms apply to VETA when real work starts.** Particularly:

- **Symptom 2 (409 Conflict)** matters for VETA Backend + Frontend sharing the MERIT project. If both get assigned same issue (race condition), second MUST drop + pick different task, not retry. Their AGENTS.md per §44 should encode this.
- **Symptom 5 (dedup before commenting on blocked)** is the right pattern for VETA's HEARTBEAT.md template. Before commenting on a blocked issue, fetch comments ASC + check most-recent-author == self + body == new-content. Saves cost + reduces noise.
- **Symptom 3 (exit 143)** = the agent tried to read too much context. The §44 template should reference `heartbeat-context` for the compact payload.

---

## 67. Hire Approvals — operational details (extends §8)

### Policy toggle
**Settings → Company → Hiring → Require board approval for new hires** is per-company. Toggle ON for governance posture.

**With toggle ON:** Every `POST /api/companies/{id}/agent-hires` from a manager creates `pending_approval` agent record + `hire_agent` approval. New agent stays inert (no heartbeats, no API keys, no skills synced) until decision.

**With toggle OFF:** Agent-initiated hires go through immediately.

**Imported companies bring own setting** — verify after import.

### Same payload route regardless
The hire route `POST /api/companies/{id}/agent-hires` accepts same payload whether toggle is on or off. Policy decides whether result is `pending_approval` or `active`.

Standard hire payload fields:
```json
{
  "name": "Backend Engineer",
  "role": "engineer",
  "title": "Backend Engineer",
  "capabilities": "Owns API endpoints and database migrations.",
  "reportsTo": "<manager-agent-id>",
  "adapterType": "claude_local",
  "adapterConfig": { "model": "claude-sonnet-4-6", "cwd": "/path" },
  "budgetMonthlyCents": 5000,
  "sourceIssueId": "<issue-driving-hire>"
}
```

### Three decision actions (full effects)

**Approve** (4 effects):
1. Pending agent flips to `active`. Budget policy created if `budgetMonthlyCents > 0`.
2. Requesting manager woken with `PAPERCLIP_APPROVAL_ID` + `PAPERCLIP_APPROVAL_STATUS=approved`. Can resume parent issue.
3. Company skills configured for new agent's role synced on first heartbeat (`mode: persistent` for local adapters).
4. New hire's first wake runs standard heartbeat procedure.

**Reject:**
1. Terminates draft agent automatically — no cleanup needed
2. Requester woken with `PAPERCLIP_APPROVAL_STATUS=rejected` + `decisionNote`
3. **Manager won't retry on its own.** If proposal was salvageable, leave comment on source issue with what you'd accept. If role fundamentally wrong, reassign or close issue.

**Request Revision** (preferred for "almost right"):
- Saves `decisionNote` + waits for manager to resubmit
- Same approval record + same `sourceIssueId` link preserved
- Manager edits payload in place via `POST /api/approvals/{id}/resubmit`

### Resubmit API
```bash
POST /api/approvals/{id}/resubmit
{ "payload": { "budgetMonthlyCents": 3000 } }
```
Same approval, updated payload. Returns to `pending` for board to review again.

### OpenClaw variant — different shape
OpenClaw agents live in a remote runtime → Paperclip can't push config in. Different flow:

1. Settings → Company → Adapters → **Generate OpenClaw Invite Prompt**
2. Paste prompt into OpenClaw chat
3. OpenClaw submits join request → lands as `hire_agent` approval pointing at draft `openclaw_gateway` agent
4. Approve normally → Paperclip activates + issues one-time API key OpenClaw claims on next contact
5. **Skill sync caveat**: OpenClaw reports `mode: unsupported`. Assignments recorded but no files pushed. Manage skills inside OpenClaw runtime.

### Post-activation edits don't require re-hire
If anything looks off after activation (wrong adapter, missing env var, capabilities too vague) → **edit the agent directly.** No need to reject + re-hire.

### Cross-project relevance — VeteranIntel
**VETA already lived through this in S88-S89** — Backend + Frontend hired via `pending_approval` flow per CLAUDE.md §32.

**New operational details for future revision cycles:**
- The `PAPERCLIP_APPROVAL_STATUS=rejected/approved` env var on wake is what lets a future VETA CEO (if hired) react cleanly to revision cycles. Worth encoding in the CEO's HEARTBEAT.md if/when one joins.
- For VETA's **current state**: `requireBoardApprovalForNewAgents = true` per §32 policy — keeps any future agent hires (e.g., a Designer, a QA agent) gated on Gill's review.
- The **resubmit pattern** (preserves `sourceIssueId` link) is the right tool when a future agent hire proposal is "almost right" — adjust budget down via resubmit rather than reject + re-hire.

---

## 68. Slack/Discord Notifications — recipe (NEW)

### Architecture
```
Routine (schedule)  →  Notifier agent  →  diff vs cursor  →  POST webhook
                                         (Slack + Discord)
```

**Paperclip does NOT push outbound webhooks** (confirmed by §10/§42 + here verbatim). The routine + agent pair IS the push.

### What's worth piping (only three classes)
| Event | Why | How to detect |
|---|---|---|
| Pending approvals | Board can't decide what they don't see | `GET /api/companies/{id}/approvals?status=pending` |
| Blocked high-priority issues | `critical`/`high` issue flipped to `blocked` = agent gave up, needs human | `GET /api/companies/{id}/issues?status=blocked&priority=critical,high` |
| Budget breaches | Agents auto-pause at 100%, you want to know BEFORE | `GET /api/companies/{id}/dashboard` exposes per-agent utilisation |

**What NOT to pipe:** issue created, comment posted, agent woke up. Read in dashboard instead.

### Slack App webhook setup
1. api.slack.com/apps → Create New App → From scratch
2. Name + workspace
3. Incoming Webhooks → Activate → Add New Webhook to Workspace → pick channel
4. Copy URL: `https://hooks.slack.com/services/T.../B.../xxxxxxxxxxxx`

### Discord webhook setup
1. Channel settings → Integrations → Webhooks → New Webhook
2. Rename `Paperclip` + optional avatar
3. Copy URL: `https://discord.com/api/webhooks/<id>/<token>`

**Both URLs are bearer tokens.** Possession = auth. Treat like passwords.

### Notifier routine config
```bash
POST /api/companies/{id}/routines
{
  "title": "Notify board channel",
  "description": "Diff approvals + blocked issues since last run; post to Slack + Discord.",
  "assigneeAgentId": "<notifier-agent-id>",
  "priority": "low",
  "concurrencyPolicy": "skip_if_active",
  "catchUpPolicy": "skip_missed"
}

POST /api/routines/{id}/triggers
{
  "kind": "schedule",
  "cronExpression": "* * * * *",
  "timezone": "UTC"
}
```

`skip_if_active` + `skip_missed` is the right pair: don't stack duplicates if previous run still finishing, don't catch up on missed minutes after restart.

### Notifier agent loop (in instructions)
```
1. Read PAPERCLIP_NOTIFIER_LAST_SEEN_AT from durable store
2. Fetch:
   - GET /approvals?status=pending
   - GET /issues?status=blocked&priority=critical,high
   Drop anything with updatedAt <= last-seen-at
3. For each new event, POST to SLACK_WEBHOOK_URL + DISCORD_WEBHOOK_URL
   On success, write new max updatedAt back
```

**Cursor location options:**
- Custom adapter: own KV store
- `claude_local`: markdown comment on dedicated `notifier-state` issue, read on next wake

### Slack Block Kit message shape
```json
{
  "blocks": [
    { "type": "header", "text": { "type": "plain_text", "text": "Approval pending: Hire CTO" } },
    { "type": "section", "fields": [
        { "type": "mrkdwn", "text": "*Type*\nhire_agent" },
        { "type": "mrkdwn", "text": "*Budget*\n$200/mo" }
    ]},
    { "type": "actions", "elements": [
        { "type": "button", "text": { "type": "plain_text", "text": "Review approval" },
          "url": "https://paperclip.example.com/.../approvals/<id>", "style": "primary" }
    ]}
  ]
}
```

### Discord embeds shape
```json
{
  "username": "Paperclip",
  "embeds": [
    {
      "title": "Approval pending: Hire CTO",
      "url": "https://paperclip.example.com/.../approvals/<id>",
      "color": 2278750,
      "fields": [
        { "name": "Type", "value": "hire_agent", "inline": true },
        { "name": "Budget", "value": "$200/mo", "inline": true }
      ]
    }
  ]
}
```

### Security posture
- **Never commit webhook URLs.** Store in notifier agent's env. For `claude_local`: per-agent env var. For `http_webhook`: on receiving service.
- **Rotate on exposure.** Slack: regenerate from App's Incoming Webhooks page (old URL stops working). Discord: webhook settings → Copy URL → Regenerate.

### Four common failure modes
| Symptom | Cause | Fix |
|---|---|---|
| Same approval re-posted every minute | Cursor not persisted | Print `last-seen-at` at top of every run, confirm it advances |
| Slack returns `invalid_blocks` | Block Kit strict — no unknown fields, no empty `fields[]`, URLs must be HTTPS | Validate with Block Kit Builder |
| Discord returns `429 rate limited` | Over ~5/2s per-webhook limit | Batch into one message with multiple `embeds[]` entries |
| Routine fires but nothing posts | Most often missing env vars on agent | Check notifier agent's run history — `failed` runs include exception |

### Cross-project relevance — VeteranIntel
**Direct application for `#veteranintel-handoffs` channel** (per VI CLAUDE.md §18).

Currently Gill checks pending approvals and blocked issues manually in the Paperclip UI. A notifier routine would surface these in Slack alongside the existing canvas pattern.

**Operational considerations specific to VeteranIntel:**
- **1-minute cron is potentially expensive** with VETA Backend + Frontend both at $80/mo cap. The notifier agent itself burns budget per heartbeat. Recommended: start at 5-minute interval (`*/5 * * * *`), tighten to 1-minute only if signal lags matter.
- **Cursor storage**: use a dedicated `notifier-state` issue per the `claude_local` pattern. Probably under VAL parent company to avoid noise in VETA's MERIT project.
- **Filtering**: VETA's VET-89 (BLUF P0 in_review) and VET-96 (IAM drift P1) would already be `blocked` or status-changed — would have triggered notifications when they entered current state.
- **Webhook URLs to Paperclip secrets**: store via `POST /api/companies/{id}/secrets` named `VETERANINTEL_SLACK_WEBHOOK` — reference in notifier agent's adapter env block.

**Integration with existing VeteranIntel Slack patterns:**
- Notifier could post to `#veteranintel-handoffs` (id `C0AUJNDDGDC` per CLAUDE.md §18) where session state lives
- Pending approvals + blocked issues would appear alongside the existing canvas-based session tracking
- Doesn't replace canvases — augments them with event-driven push

### Cross-project relevance — Audiopheliac
Less critical — Audiopheliac is more creative/long-running, fewer time-sensitive approvals. If/when Audiopheliac is active and time-bounded releases are running, the same routine pattern applies with different channels (`#audiopheliac-releases` or similar).

---

## 69. Company Administration — operational details (extends §38, §57, §65)

### Six human membership grants + four roles

**Critical distinction:** Human membership roles (Owner / Admin / Operator / Viewer) are **separate from** agent chain of command (CEO / managers / reports). Human roles gate UI + company-level actions; agent roles describe reporting tree inside the company.

| Role | Implicit grants |
|---|---|
| **Owner** | Full access — create agents, invite humans+agents, manage members+grants, assign tasks, approve joins |
| **Admin** | Operator + invite + approval — create agents, invite users, assign tasks, approve joins |
| **Operator** | Hands-on — assign tasks |
| **Viewer** | Read-only — no implicit grants |
| **Unset** | No implicit grants (member exists without role-derived permissions) |

### Six explicit permission grants (granular, on top of role)
| Grant | Use |
|---|---|
| `agents:create` | Hire agents + skill mutations + import/scan/sync routes |
| `users:invite` | Create invite links |
| `users:manage_permissions` | Edit member grants + statuses |
| `tasks:assign` | Assign tasks |
| `tasks:assign_scope` | Scope-aware assignment |
| `joins:approve` | Review join request queue |

Each grant can be explicitly attached to a member so it **persists even if role changes later** — useful for granting one-off capabilities without elevating a whole role.

### Member status enum: `active` / `pending` / `suspended`
**Suspended members keep their row visible for audit trail.** Don't delete — suspend.

### Invite flow specifics (extends §57)
| State | Meaning |
|---|---|
| `Active` | Link can still be consumed |
| `Accepted` | First successful use happened |
| `Expired` | Past expiry window |
| `Revoked` | Manually killed |

**Only `Active` invites can be consumed.** Single-use — first successful use consumes the link.

Invite carries a **default role** (Viewer / Operator (default) / Admin / Owner). When consumed, creates a join request with that role attached so approvers see it in context.

Member doesn't become active until someone with `joins:approve` approves the request.

### Join request queue at `/inbox/requests`
Filters:
- Status: `Pending approval` (default) / `Approved` / `Rejected`
- Request type: All / Human / Agent

Per-card view:
- Status badge + type badge + adapter type (for agents)
- Requester name + secondary identifier (email for humans, capabilities or source IP for agents)
- **Invite context panel**: `allowedJoinTypes` + default role + invite message
- **Request details panel**: submission timestamp + source IP + agent capabilities (when applicable)

Requires `joins:approve` grant. Without it: "You do not have permission to review join requests for this company."

### Feedback Sharing — TWO-LAYER toggle (extends §42 COI flag)

**Per-company toggle** (Settings → Hiring/Feedback Sharing section, on each company):
- "Allow sharing voted AI outputs with Paperclip Labs"
- Always stores votes locally regardless
- Only controls Labs eligibility
- Shows terms version + timestamp + who enabled

**Per-instance toggle** (Instance Settings → General → AI feedback sharing) with three states:
- Prompt (default) — asks once, saves answer
- Always allow — voted outputs shared automatically
- Don't allow — voted outputs stay local

**Critical for VeteranIntel:** BOTH layers must be set conservatively. Per-instance set to "Don't allow" AND per-company VETA set to OFF prevents any 217A or COI-adjacent content (§30 COI Hold + §7 corpus separation) from leaking. The §42 flag captured this conceptually — now it's clearly two distinct toggles to set.

### Danger Zone — Archive company
Archives hides company from sidebar, persists in DB. Confirmation dialog before effect. UI auto-switches to next non-archived company.

### Import UI specifics (extends §57 + §65)

**Source options:**
- GitHub repo URL — tree or blob URL pointing at folder containing `COMPANY.md`
- Local zip upload — `.zip` from Export page

**Warning verbatim from docs:** "Paperclip warns against re-zipping archives in Finder or Explorer; use the download from the Export page."

**Target options:**
- Create new company (default) — optional `New company name` override field
- Existing company — apply on top of current

**Collision strategies in UI (3, but only 2 valid via CEO-safe routes per §65):**
- Rename on conflict (default) — proposes new name with package-name prefix (e.g., `gstack-CEO`)
- Skip on conflict — existing items kept, incoming dropped
- Replace existing — **rejected by CEO-safe import route per §65**, requires board route

**Preview UI three panels:**
1. **Renames list** — every collision with: free-form input to override auto-rename + Skip button + Confirm rename button (locks chosen name)
2. **Adapters list** — every agent in package with dropdown of available adapters in target instance + inline configure form for cwd/env/etc.
3. **File tree with action badges** — `create` / `update` / `skip` / `replace` per row. Directories that will be renamed show arrow + target name.

Import button disabled if preview has errors OR no files selected.

### Cross-project relevance — VeteranIntel
- VAL parent + VETA have **Gill as Owner** of each. Currently zero other human members per §3 single-user posture.
- **`requireBoardApprovalForNewAgents = true`** on VETA company per §32 — captured here as the per-company Hiring toggle that drives `pending_approval` flow.
- **Feedback Sharing must be OFF at both layers for VETA** — set per-company toggle to OFF, set per-instance to "Don't allow". Per §42 COI flag, this is non-negotiable for any agent output that might touch 217A content.
- **If/when restoring VETA from backup**, the Import UI's per-agent adapter configure form lets you re-bind cwd + env vars at restore time. Critical because env values (`ANTHROPIC_API_KEY` etc.) aren't in the bundle per §57.

---

## 70. Settings + Instance Surfaces (extends §22, §27, §50)

### Profile vs Instance Settings distinction (critical to keep straight)
| Surface | Scope | What it controls |
|---|---|---|
| **Profile** (user account menu → Profile) | Per-user, ONLY affects how YOU appear | Avatar + Display name + Email (read-only) |
| **Instance Settings** | Whole Paperclip instance — every company, every user, every agent | Deployment posture + cross-cutting toggles + admin grants + adapters + scheduler |

If you run paperclip on a VPS hosting five companies, a toggle on the Instance page flips for all five.

### Profile page fields
- **Avatar** — uploaded to file storage under currently selected company's asset space. Without selected company, can't upload. Switches between companies don't break existing avatar references.
- **Display name** — capped at 120 chars, falls back to "Board" if blank
- **Email** — read-only, managed by auth session/login provider

### Instance: General page
**Top-of-page deployment mode badge** + description:
- Local trusted — no sign-in required, default for local dev
- Authenticated public — sign-in required, intended for public URL
- Authenticated private — sign-in required, intended for private network

**Three readiness boxes:**
- Auth readiness
- Bootstrap status (Setup required vs Ready)
- Bootstrap invite (active first-run invite link outstanding)

Informational. To change → change deployment per §28 env vars.

**Five operational toggles + settings:**

| Toggle | Default | Notes |
|---|---|---|
| Censor username in logs | OFF | Hides username segment in home-dir paths and similar operator-visible log output. **Best-effort filter** — bare username mentions outside path strings NOT masked. |
| Keyboard shortcuts | OFF | Conflicts with browser/screen-reader shortcuts for some users. Enable for faster nav. |
| Backup retention — Daily | Preset picker | Days kept |
| Backup retention — Weekly | Preset picker | Weeks kept (one backup per week) |
| Backup retention — Monthly | Preset picker | Months kept (one backup per month) |
| AI feedback sharing | Prompt (default) | 3 states: Prompt / Always allow / Don't allow |
| Sign out | — | Always present, ends session |

**Backups are gzipped on disk.** Longer retention = more storage. Raise only as far as disk + compliance story require.

**AI feedback sharing's "Prompt" state**: next time you vote, paperclip asks once and saves the answer. The local vote is always saved regardless — toggle only controls whether content leaves your instance.

### Instance: Access page

**Instance admin vs company membership** — separate layers:
- Company membership: lets user see + act within one specific company
- Instance admin: see + manage instance itself, add/remove instance admins, grant users company access

**Per-user UI structure:**
- Left pane: search box + user list (name/email/admin shield icon/active company count)
- Right detail pane:
  - Promote to instance admin / Remove instance admin button (immediate effect)
  - Company access grid — every company on instance with checkbox per
  - Current memberships list = source of truth (if it differs from checkboxes, re-save)

**Adding access creates `active operator` membership by default.** Higher role requires switching to that company and raising role there.

**Safety note from docs:** "Instance admins can grant themselves access to any company and can demote other instance admins. Be deliberate."

### Instance: Scheduler Heartbeats — NEW operational surface (high-value)

**Cross-company view of every agent on the instance that has timer heartbeat enabled.**

This is where you go to:
1. **Verify §54 heartbeat-OFF posture across all agents on the instance.**
2. **Watch enable/disable take effect** — page auto-refreshes every 15 seconds.
3. **Emergency shut-off all timers** via "Disable All" button.

**Summary line at top:**
- Active count (enabled + scheduler considers live)
- Disabled count
- Company count spanned

**Per-agent row (grouped by company):**
- On/Off badge for scheduler's view of state
- Agent name (links to full config)
- Title or role
- Configured interval (seconds)
- Last heartbeat relative time ("2m ago" / "never")
- Jump-to-config link + Enable/Disable Timer Heartbeat inline button

**Disable All button** at top-right of summary line:
- Disables timer heartbeat on EVERY currently-enabled agent in one operation
- Prompts for confirmation
- **Event-driven wakes (assignments, comments, routines) still work afterwards** — only stops tickers

**When to reach for this page (verbatim from docs):**
- Agent burning budget on idle wakeups → find in list, raise interval OR disable
- After import/clone — take stock of every timer-driven agent before turning any loose
- Emergency shut-off — Disable All preserves event-driven wakes

**Safe defaults from docs:**
- Most agents: timer heartbeats OFF — stay active on dashboard, wake on assignments/comments/routines
- When timer truly needed (polling external system with no webhook): push interval as long as possible — minutes or hours, not seconds
- After import: check this page, disable unrecognized timer settings before scheduler starts firing

### Instance: Adapters — operational additions (extends §50)
- **Zero model count usually means adapter loaded but couldn't enumerate models** — check package config before enabling for agents
- **Origin icons**: folder for local-path installs, package icon for npm installs
- Reload icon = hot-swap adapter module in running process (after publishing new version of local-path adapter)
- Reinstall icon = check npm registry for latest version + pull + reinstall (confirmation dialog)
- Remove icon (trash) = unregister + tear down npm install on disk, cannot be undone (confirmation prompt first)

### Instance: Experimental flags
**Two toggles, both safe to flip on/off without migration:**

| Flag | Effect when ON |
|---|---|
| **Enable Isolated Workspaces** | Shows execution-workspace controls in project configuration. Allows isolated workspace behavior for new + existing issue runs. **This is the gate for §60 GitHub PR integration** — the workspace strategy `git_worktree` requires this enabled at company level. |
| **Auto-Restart Dev Server When Idle** | Only relevant under `pnpm dev:once`. Waits for queued + running local agent runs to finish, then restarts dev server automatically. For paperclip development itself, NOT production. |

**Definition of "experimental":** Has shipped + works, being evaluated against real usage before becoming default, MAY be renamed / reworked / promoted in future release. Not dangerous to data — just may change behavior.

### Cross-project relevance — VeteranIntel

**Scheduler Heartbeats page is the verification surface for §54 heartbeat posture pre-flight check.** Before VETA produces real work, this is THE page to verify:
- VETA Backend = Off (or remove from list entirely if interval is 0)
- VETA Frontend = Off
- Active count = 0 (or only specialized polling agents that genuinely need timers)

The page auto-refreshes every 15s — easy to verify status without page reload. Disable All is the right tool if VETA ever runaway-loops and we need an emergency stop.

**Per-instance backup retention** is the DB-level system. Different from §65's nightly company-bundle export routine. Both layers are useful:
- Instance backup retention → DB recovery (Paperclip-level)
- Nightly export routine → company portability (bundle-level, transports between instances)

**Experimental → Enable Isolated Workspaces** is the gate we need OFF currently. The §60 GitHub PR integration requires it ON before `git_worktree` workspace strategy works. Per §55 "when isolation is overkill" guidance, we leave it OFF until a coding-heavy ticket bundle arrives for VETA.

**Feedback sharing two-layer check before any VETA voting:**
1. Verify Instance Settings → General → AI feedback sharing = "Don't allow"
2. Verify VETA company Settings → Feedback Sharing toggle = OFF

Both must be set for the §42 COI Hold posture. If either is permissive, voted agent outputs could ship to Paperclip Labs telemetry — categorical violation of §30 + §7.

### Cross-project relevance — Audiopheliac

When Audiopheliac is active:
- **Operator should also be heartbeat-OFF** + wake-on-demand. Same posture as VETA.
- **Feedback sharing can be more permissive** than VETA — no 217A/COI constraints. Could be "Always allow" if Gill wants to contribute studio-workflow data to Paperclip Labs.
- **Experimental Isolated Workspaces** off unless Audiopheliac has code-shipping components (NAS automation scripts, Python tools, etc.).

---

## 71. Plugins — extension surface (NEW concept, extends §20 skill-vs-plugin-vs-adapter matrix)

### Plugin vs Skill vs Adapter (from official docs verbatim)
| | Plugin | Skill | Adapter |
|---|---|---|---|
| What it is | Software extending Paperclip itself | Reusable instruction document | Bridge to a new AI runtime |
| Has own code | Yes | No | Yes |
| Has own process | Yes — worker | No | Per-run runtime spawn |
| UI surface | Pages, widgets, project tabs, sidebar links | None | None |

Plugins are in **alpha** — runtime and APIs still shifting. Pin versions where possible.

### Plugin Manager at Settings → Plugins

Two sections:
- **Available Plugins** — bundled examples in your Paperclip checkout
- **Installed Plugins** — anything you've installed on this instance

### Six status badges
| Status | Color | Meaning |
|---|---|---|
| `ready` | Green | Installed + enabled + worker running. Steady state. |
| `disabled` | Grey | Turned off. Worker stopped, scheduled jobs don't fire, UI hidden. **Config + data preserved.** |
| `error` | Red | Worker crashed on startup, health check failed, or upgrade broke. Row expands with summary + View full error. |
| `upgrade_pending` | Amber | New version staged asking for capabilities not in installed version. Worker stops, awaits operator approval. |
| `installed` | (transient) | Right after install, before first successful load. Moves to `ready` or `error` within seconds. |
| `uninstalled` | — | Removed. Won't appear in list unless reinstalled. |

### Error row diagnostic patterns (verbatim from docs)
| Error summary | Most common cause | Fix |
|---|---|---|
| `Cannot find module ...` / `Failed to load manifest` | Package malformed or build output missing | Reinstall, or rebuild if developing locally |
| `Worker exited with code 1` | Crashed on startup | Missing config (fill settings form), missing secret, OR external service unreachable |
| `Health check failed: ...` | Worker started but check didn't pass | Fix underlying issue, click Enable to retry |

**Errored plugin stays installed** — don't need to uninstall/reinstall. After fixing cause, click Enable to retry the `error → ready` transition.

### Four bundled example plugins
| Plugin | What it adds |
|---|---|
| `plugin-hello-world-example` | Dashboard widget. Minimum-viable plugin reference. |
| `plugin-file-browser-example` | Files link in project sidebar + file-browser tab on project detail page, scoped to project's workspace |
| `plugin-kitchen-sink-example` | Full plugin surface: pages, widgets, settings forms, scheduled jobs, webhooks |
| `plugin-authoring-smoke-example` | Thin smoke test for plugin authoring workflow |

### Install paths
- **Install Example** button (in Available Plugins) — installs straight from local checkout, no registry round-trip
- **Install Plugin** button (top-right) — npm package name (e.g., `@paperclipai/plugin-example`)

Same underlying flow: download → validate manifest → persist record → start worker → `installed → ready` (or `error` on failure with message attached).

### Power button — enable/disable lifecycle
**What disable stops:**
- Worker process
- Scheduled job runs
- Webhook delivery processing
- UI contributions (pages, widgets, settings slots)
- Health-check polling

**What disable preserves:**
- Plugin record
- Saved config including secrets
- Historical job-run + webhook-delivery records
- Log entries

**Matters for billed-service integrations:** Disable stops the polling + scheduled work (= stop paying API bill) without requiring re-entering credentials on re-enable.

### Uninstalling (trash icon)
- Confirmation prompt
- **Not reversible from UI** — package removed from disk, install artifacts cleaned, marked uninstalled
- To get plugin back: reinstall fresh
- Worker stops first (drains in-flight work cleanly)

### Upgrade-capability gate (the right shape for governance)
When upgraded version's manifest asks for **new capabilities not in installed version**:
- Plugin parked in `upgrade_pending`
- Worker stops
- Operator must review + click Enable to approve

> "This gate exists so plugins can't quietly grow permissions on you between versions. The first time a capability is requested is always a deliberate action you took."

You can leave plugin in `upgrade_pending` indefinitely OR uninstall.

### Plugin detail page — two tabs + page slot
| Tab | Content |
|---|---|
| Configuration | Description, author, categories, settings form (or custom UI) |
| Status | Worker state, recent scheduled jobs, recent webhook deliveries, live health checks, rolling logs |

Plus optional **page slot** at `/<company-prefix>/plugins/<plugin-id>` for full plugin UI.

Two plugins contributing to same route → **conflict message** instead of choosing. Uninstall one, OR use `/plugin-id` URL directly while sorting out.

### Settings forms — two shapes
**Auto-generated** from plugin's JSON Schema. Renders form on Configuration tab. Save Configuration + optional **Test Configuration** button (sends current values to worker without persisting, reports back if config works).

**Custom `settingsPage` slot** — plugin's own settings UI (wizard, visual editor, etc.).

### Secret field handling
Fields marked secret in manifest:
- Stored encrypted
- Never redisplayed in plaintext
- Masked placeholder shown once saved
- Type new value to change; leaving placeholder as-is keeps existing secret

### Permissions sidebar
Right of settings form. Lists capabilities the plugin's manifest declares. Same gate `upgrade_pending` checks against. If permissions don't match what plugin claims to do → investigate before enabling.

### Status tab content (refreshes every 30 seconds)
| Section | Shows |
|---|---|
| Worker process | Running status, PID, uptime, recovered-crash count, last-crash timestamp |
| Recent job runs | Last handful with status dot + trigger + relative time |
| Recent webhook deliveries | Status + duration |
| Health status | Aggregate checks polled every 30s while `ready` |
| Recent logs | Last 50 entries, color-coded by level |

### Job status dot colors
- Green = succeeded (steady stream of green at expected cadence = healthy)
- Blue (pulsing) = running NOW (long-stuck blue → check recent logs)
- Amber = queued, waiting for worker (persistent amber → worker busy or stuck)
- Red = failed (matching log entry has reason)
- Grey = cancelled (typically because disabled while scheduled)

Webhook delivery dots same colors: green processed, blue received, amber pending, red failed.

### Authoring path (via paperclip-create-plugin skill)
Plugins are npm packages with:
- `paperclipPlugin` manifest block
- Worker entry
- Optional UI bundle

Use `/paperclip-create-plugin` skill (already documented in §32 of CLAUDE.md) to scaffold. Examples under `packages/plugins/examples/` are reference.

### Cross-project relevance — VeteranIntel
Plugins not currently used. Future candidates:
- **VeteranIntel-metrics dashboard widget** — surface VBA training corpus state, daily session counts, etc. directly on paperclip dashboard rather than via separate routes.
- **217A corpus browser plugin** — adapts `plugin-file-browser-example` to scope at 217A QSync mirror path
- **MERIT health-check plugin** — scheduled job polls `merit-only-1776641470` engine, surfaces drift or unavailability as plugin health status

**Operational consideration:** Plugins run as their own worker process — separate from agent runtime. Means cost discipline is different: plugin cost = your code's API calls (if any), not paperclip-level token spend. Easier to budget for.

**Upgrade capability gate** is the right shape for VeteranIntel's §7 corpus separation + §30 COI Hold posture. If we ever install a third-party plugin and it asks for new capabilities on upgrade (e.g., access to MERIT data store), the gate prevents silent permission growth.

### Cross-project relevance — Audiopheliac
- **Sample library browser plugin** — adapts file-browser example for NAS sample library
- **Hardware inventory plugin** — scheduled job tracking firmware versions
- **Ableton session metadata plugin** — read-only view of session state across active projects

---

## 72. CLI Auth + Board Claim flows (extends §15 CLI commands)

### Two separate identity flows
| Flow | When |
|---|---|
| **Board claim** | One-time bootstrap. Promotes browser-authenticated user to owner of freshly started `authenticated`-mode instance. Migrates `local-board` placeholder into real human account. |
| **CLI auth** | Everyday flow. Pairs local `paperclipai` CLI with signed-in board user so CLI can call `/api` endpoints. |

**Neither required in `trusted` mode** (loopback-only local dev) — loopback already trusted.

### Board claim conditions (ALL must be true)
- Deployment mode = `authenticated`
- Only instance admin = built-in `local-board` placeholder
- Challenge hasn't expired (24-hour TTL, auto-refreshed)

### Board claim URL pattern
Printed to server log on startup when conditions match:
```
http://localhost:3000/board-claim/<token>?code=<code>
```
- `token` = 48 hex chars
- `code` = 24 hex chars

Together they identify exactly one pending claim.

### Board claim transaction (3 things in single DB transaction)
1. Insert `instance_admin` role for the user
2. Delete `local-board` placeholder admin
3. For EVERY company in DB: create `active` `owner`-role membership for user (OR reactivate existing membership + set role to `owner`)

**One-time consumable.** Page shows "Board ownership claimed" with link to open board. Challenge marked claimed, cannot be reused. If expired or URL malformed → "Claim challenge unavailable" message. Restart server (or wait for next refresh) to mint new challenge.

### CLI device-code flow

`paperclipai auth login` performs:
1. POST `/api/cli-auth/challenges` with `command`, `clientName`, `requestedAccess`, optional `requestedCompanyId`
2. Gets back: `token` + `boardApiToken` + `approvalUrl` + `pollPath` + `expiresAt` + polling interval
3. Opens browser to `approvalUrl`, starts polling

Flags:
| Flag | Purpose |
|---|---|
| `--instance-admin` | Request instance-admin approval (requires instance-admin approver) |
| `--company-id <id>` | Scope to specific company |
| `--api-base https://...` | Target non-default server |

### Browser approval page
Shows what CLI is asking for:
- Command — CLI command that initiated login
- Client — `clientName` (default `paperclipai cli`)
- Requested access — `Board` or `Instance admin`
- Requested company — only if specified

Two buttons:
- **Approve CLI access** — only enabled if signed-in user is allowed to approve this level. Instance-admin challenge requires instance-admin approver.
- **Cancel** — rejects. CLI sees `cancelled` on next poll and exits.

On approve: CLI's next poll sees `approved`, calls `/api/cli-auth/me` with board API token to confirm identity, writes credential to local credential store.

### Token storage + lookup
Stored in platform-appropriate config directory, **keyed by normalised `apiBase`**. CLI commands with `--api-base` automatically look up matching stored credential.

### `paperclipai auth whoami` — verify identity
Calls `/api/cli-auth/me`, returns:
```json
{
  "user": { "id": "...", "name": "...", "email": "..." },
  "userId": "...",
  "isInstanceAdmin": true,
  "companyIds": ["..."],
  "source": "board-cli",
  "keyId": "..."
}
```

### Rotation + revoke
```bash
paperclipai auth logout    # server-side revoke + delete local entry
paperclipai auth login     # fresh challenge + fresh token
```

If server revoke fails (network, token already invalid) → local credential still removed (no stuck state).

### Multi-server credentials
Credential store keyed by `apiBase`. One machine = multiple stored credentials for local + staging + production simultaneously. Switch via `--api-base`.

Logging in as different user for same `apiBase` REPLACES existing credential.

### 5 troubleshooting messages
| Message | Cause |
|---|---|
| "Invalid CLI auth URL" | Missing `id` or `token` query param. Re-run login. |
| "CLI auth challenge unavailable" | Server no longer has matching challenge (expired or server restarted). Start login again. |
| "This challenge requires instance-admin access" | Signed-in user not instance admin. Sign in with admin account. |
| "CLI auth challenge expired before approval" | Browser tab sat too long. Re-run login. |
| "Claim challenge unavailable" (board claim page) | One-time ownership challenge consumed/expired. Restart server. |

### Cross-project relevance — VeteranIntel

**Currently `local_trusted` mode per §22.** Neither board claim nor CLI auth load-bearing today — Rafa CLI hits localhost without auth challenge.

**If/when migrating to `authenticated` mode:**
- Server startup will print board claim URL to log
- Gill opens URL in browser → click Claim ownership → becomes Owner of every company in DB (VAL + VETA + Audiopheliac)
- This is a ONE-TIME action per instance lifetime

**For Rafa CLI integration in `authenticated` mode:** Rafa would run `paperclipai auth login` once per machine. CLI stores credential under `apiBase`. All subsequent paperclip commands use stored credential automatically.

**Multi-server pattern is useful** if VeteranIntel ever runs both local dev paperclip AND hosted paperclip simultaneously. Rafa can switch via `--api-base` flag without re-auth.

---

## 73. Append Log

| Date | Source page | Sections added |
|---|---|---|
| 2026-05-10 | paperclip.ing/llms.txt | Bootstrap command verified |
| 2026-05-10 | paperclip.ing homepage | Architecture FAQ extracted |
| 2026-05-10 | API Overview | §1, §2, §3 |
| 2026-05-10 | Authentication | §1 auth resolution + token types |
| 2026-05-10 | Companies | §4 |
| 2026-05-10 | Agents | §5 |
| 2026-05-10 | Issues | §7 |
| 2026-05-10 | Approvals | §8 |
| 2026-05-10 | Goals and Projects | §9 |
| 2026-05-10 | Costs | §10 + budget-endpoint correction |
| 2026-05-10 | Secrets | §11 |
| 2026-05-10 | Activity | §12 |
| 2026-05-10 | Dashboard | §13 — SESSION-INIT primitive |
| 2026-05-10 | Routines | §14 — SESSION-INIT awakening options |
| 2026-05-10 | **CLI Overview + Setup + Control-Plane + Command Reference** | **§15 — start command located: `paperclipai run`** |
| 2026-05-10 | Skills Reference | §18 — incl. canonical key forms + sync modes + **VETA setup ambiguity flag** |
| 2026-05-10 | Adapters Overview + Claude Local + Codex Local + Gemini Local + Process + HTTP | §19 — per-adapter config + session resume semantics |
| 2026-05-10 | Skills cross-cutting | §20 — skill vs plugin vs adapter clarity matrix |
| 2026-05-10 | External Adapters + Creating an Adapter + Adapter UI Parser Contract | §21 — SDK contract, management routes, transcript entry kinds |
| 2026-05-10 | Deployment Overview + Deployment Modes + Local Development + Docker | §22, §23, §24 — three deployment modes, board-claim flow, `pnpm dev` re-verified, `/api/health` confirmed real, docker quickstart |
| 2026-05-10 | Database + Storage + Secrets + Environment Variables + Tailscale | §25, §26, §27, §28, §29 — **agent runtime injected vars + secret strict mode + scheduler interval** |
| 2026-05-10 | Installation (Desktop / Terminal / VPS) | §30 VPS playbook + §31 Desktop App + §32 inline corrections (storage var name discrepancy flagged, embedded Postgres port, `PAPERCLIP_BIND` modes, `auth bootstrap-ceo` flags, root-refusal constraint) |
| 2026-05-10 | Quickstart (Create Company / Hire CEO / Watching Work / Glossary) | §33 CEO bootstrapping flow + §34 glossary additions + §35 final VETA operational checklist |
| 2026-05-10 | Day-to-Day batch 1/2 (Dashboard / Issues / Inbox / Approvals UI) | §36 UI triage surfaces + §37 issue detail (sidebar/Chat/Activity) + §38 approval UI detail + §39 cross-project notes for VETA + Audiopheliac |
| 2026-05-10 | Day-to-Day batch 2/2 (Costs / Activity Log / Feedback) | §40 Costs UI deep-dive + §41 Activity Log UI + **§42 Feedback & Voting NEW concept (with COI Hold + corpus separation flag)** + §43 cross-project notes |
| 2026-05-10 | Orgs & Agents batch 1/2 (Agents / Skills / Org Structure / Delegation) | **§44 AGENTS/SOUL/HEARTBEAT/TOOLS pattern with official CEO 8-step heartbeat template** + §45 config revisions + rollback + §46 runs forensic surface + §47 strict tree rules + §48 delegation troubleshooting + §49 VETA + Audiopheliac prompt design notes |
| 2026-05-10 | Orgs & Agents batch 2/2 (Agent Adapters / Adapter Manager) | §50 Adapter Manager UI (override mechanic, badges, power-icon context-sensitivity, lifecycle actions, health signals) + §51 per-adapter incremental details (Hermes, Pi, OpenCode model format, claude_local common errors, cwd discipline) |
| 2026-05-10 | Projects & Workflow batch 1/2 (Projects / Goals) | §52 Projects 5-tab UI + repository binding modes + execution workspace per-project knobs + **project budget LIFETIME window (not monthly)** + cross-project recommended configurations + §53 Goals tree structure + sub-goal vs project distinction + no-status-propagation rule + recommended goal hierarchy for VeteranIntel + Audiopheliac |
| 2026-05-10 | Projects & Workflow batch 2/2 (Heartbeats & Routines / Workspaces) | **§54 Heartbeats & Routines deep-dive** (timer-OFF-by-default philosophy, Pause vs Heartbeat-off semantic table, routine UI + composer + variables `{{name}}`, cron picker presets + DST-aware timezone, webhook signing modes, 9-step heartbeat protocol verbatim) + **§55 Execution Workspaces** (3-mode model, commands panel + 3 tabs, runtime config inheritance, git worktree mechanics, when-isolation-is-overkill guidance, 6-question troubleshooting checklist) + VETA + Audiopheliac applicability |
| 2026-05-10 | Power Features 1/1 (Execution Policy / Export & Import / Terminal Setup) | **§56 Execution Policy — runtime-enforced review + approval gates** (full TypeScript data model, changes-requested loop semantics, always-on comment-required backstop with retry mechanic, VETA governance applications for §7 corpus separation work) + §57 Export & Import package shape + post-import safety defaults + VETA backup command. Terminal Setup duplicative of §23, no separate section. |
| 2026-05-10 | How-to Guides 1/3 (Budget enforcement / Daily routine / GitHub PR integration) | §58 Budget force-spike test recipe + `billingCode` attribution + warn-only `hardStopEnabled: false` mode + incident resolve API + §59 routine pattern library (3 patterns × concurrency/catch-up matrix) + 5 memorable crons + threaded routines via `parentIssueId` + verification recipe + **§60 GitHub PR integration full recipe** (project workspace + `executionWorkspacePolicy.workspaceStrategy.type = git_worktree`, three auth options PAT/App/host-keyring with explicit "promote past laptop" guidance, AGENTS.md PR-driven rules template, 6-item troubleshooting, VETA step-by-step application) |
| 2026-05-10 | How-to Guides 2/3 (MCP / Skill authoring / BYO Agent / Fly.io deploy) | **§61 MCP Integration recipe** (Claude Code 3-scope precedence, project-scope-preferred for Paperclip, stdio + HTTP transports, OAuth interactive-once pattern, GitHub MCP worked example, 6-item troubleshooting, VETA MCP candidates including custom MERIT MCP) + §62 Skill authoring 5-call recipe (local-path-live iteration, frontmatter parser gotcha — no block scalars, reconciling `desiredSkills`, **4 VeteranIntel skill candidates** with routing descriptions) + §63 BYO Agent three paths (OpenClaw / HTTP webhook / Custom script with full tradeoff matrix, **webhook body signing NOT in product today** — shared-secret only) + §64 Fly.io hosted deployment specifics ($5-35/mo cost estimate, agent runner placement decision criteria) |
| 2026-05-10 | How-to Guides 3/3 (Backup+Restore / Debug stuck heartbeat / Hire approvals / Slack-Discord) | §65 Backup recipe with **CEO-safe route distinction** (rejects `replace` collision strategy, enforces same-company target) + nightly export routine pattern + round-trip verification + **§66 Debug stuck heartbeat 5-symptom playbook** (timer-with-empty-inbox / 409 conflict / exit 143 SIGTERM / cancellation-mid-run / dedup-before-blocked-comment) + §67 Hire approvals operational details (Approve/Reject/Resubmit full effects, OpenClaw variant skill-sync caveat, post-activation-edits-don't-require-rehire) + §68 Slack/Discord notification recipe (routine + cursor + Block Kit/embeds shapes, **1-minute cron expense warning for VETA**, integration with existing #veteranintel-handoffs canvas pattern) |
| 2026-05-10 | Administration 1/2 (Company Administration / Settings) | §69 Company admin details (**6 explicit permission grants** with role-vs-grant distinction, member status enum incl `suspended` for audit, invite-state 4-value enum, **two-layer Feedback Sharing toggle** for COI Hold posture, Import UI with per-agent adapter reconfigure form) + **§70 Settings + Instance Surfaces** with **Scheduler Heartbeats cross-company verification page** (auto-refresh every 15s, Disable All emergency button preserving event-driven wakes), Profile vs Instance distinction, Experimental → Enable Isolated Workspaces as gate for §60 GitHub PR integration |
| 2026-05-10 | Administration 2/2 (Plugins / CLI Auth + Board Claim) | **§71 Plugins** as the third extension category beyond skills + adapters (6 status badges, 4 bundled examples, enable/disable preserves config + data, **upgrade-capability gate prevents silent permission growth**, status tab with 30s refresh + 5-color job-status dots) + §72 CLI Auth + Board Claim flows (one-time board claim 3-step transaction, device-code CLI auth, multi-server credential keying by `apiBase`, **not required in `local_trusted` mode** — Rafa hits localhost without challenge) |
| _pending_ | Cursor / OpenCode / Pi / Hermes / OpenClaw Gateway adapter-specific reference docs | §19 extension |
| _pending_ | Heartbeats deep-dive | SESSION-INIT trigger model |
| _pending_ | Execution Workspaces | Isolated workspace mechanics |
| _pending_ | Deployment overview | Mode/exposure semantics for production |

---

## 16. Use This Doc When

- Writing a Rafa prompt that touches the paperclip API → grep the right section
- Diagnosing a 401/403/422 from paperclip → §2 + §1 auth resolution
- Onboarding a new agent → §5 lifecycle + adapter helpers
- Setting up budget gates per CLAUDE.md §32 → **§10 correction** + monthly policy
- Reasoning about an issue stuck in a state → §7 state machine + transitions
- Approving/rejecting a hire → §8 approvals lifecycle
- Setting up a project with code attached → §9 workspaces
- Storing credentials for an agent → §11 secret refs
- Investigating "what happened on this issue" → §12 activity + runs
- **SESSION-INIT liveness + company health snapshot** → §13 dashboard endpoint
- **Awakening agents at session-start** → §14 routines (3 options laid out)
- Anywhere you'd otherwise re-investigate by reading paperclip.ing again

---

## 17. SESSION-INIT Recommended Rafa Probe (v3 — uses paperclipai CLI)

Replaces v2 multi-call probe with the official CLI wrappers. Single command per check.

```powershell
# YOU ARE RAFA — execute this. Not a hand-off to evaluate.
# Surface: CLI (execution only)
# PRE-AUTH: full (default) | PERMISSION MODE: --permission-mode auto (default)

# Step 0 — verify paperclip is running. If not, start it.
# Liveness probe (light):
try {
  $ping = Invoke-RestMethod -Uri 'http://localhost:3100/api/companies' -Method GET -TimeoutSec 5
} catch {
  Write-Host "Paperclip offline — starting via paperclipai run"
  Start-Process -FilePath "npx" -ArgumentList "paperclipai", "run" -NoNewWindow
  Start-Sleep -Seconds 10
}

# Step 1 — dashboard snapshots per company (single call each)
npx paperclipai dashboard get -C 9867b6c7-5c6e-47bd-bfeb-aedb74131f37 --json   # VETA
npx paperclipai dashboard get -C <VAL-company-id> --json                       # VAL parent

# Step 2 — for any company with tasks.open > 0 AND agents.active > 0 AND agents.running == 0,
# fire heartbeat on appropriate agent(s):
npx paperclipai hear