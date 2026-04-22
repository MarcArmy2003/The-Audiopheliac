# The Audiopheliac Website — Progress Snapshot

**Date:** 2026-04-21
**Phase:** 1 complete (brand layer locked). Pre-scaffold.
**Domain:** theaudiopheliac.com (registered; see `docs/Audiopheliac_Domain_Registration.md`)
**Target stack:** Astro + Cloudflare Pages (scaffold pending authorization)

---

## Phase 1 — Brand layer (complete, committed, pushed)

**Direction resolved.** The canonical mark is `media/The_Audiopheliac_Primary_Logo_Only.png` (rainbow-spectrum vinyl on near-black). The prior "burnt orange vinyl + waveform" direction was superseded; `assets/Branding_Kit.md` was rewritten to reflect the current mark.

**Color tokens extracted.** Six spectrum colors sampled via pixel clustering (KMeans on vivid saturated pixels) and snapped to clean hex: yellow `#F8E91F` (36% of mark, hero CTA), light green `#99E257`, green `#41D99A`, teal `#0ABED3` (reserved for body accent only — not CTAs, to preserve VALOR brand separation), blue `#0F82DF`, violet `#5E54D4`. Core field tokens: `--ink #0A0A0B`, `--paper #F5F5F7`, `--hairline #FFFFFF`.

**CTA contract locked.** Solid yellow on black is the default treatment (WCAG AAA at ~16.6:1 contrast). The full spectrum gradient is reserved for one to two hero moments only (landing page primary CTA, `/dashboard` Spotify-connect button). Teal CTAs forbidden; gradient-on-every-button forbidden.

**Typography locked.** Unica One for display (retro hi-fi character), Inter for body. Modular scale 1.250, base 16px. Full token set in `site/assets/css/tokens.css`.

**Favicon set generated.** LANCZOS downsample of the 1024x1024 canonical PNG into six files: `favicon-16.png`, `favicon-32.png`, `favicon.ico` (multi-res 16/32/48), `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`. All under `site/assets/favicons/`.

**Deferred Phase 1 items.** SVG rebuild of the primary mark (manual reconstruction required; auto-trace unacceptable on gradient), simplified icon variant (sub-32px use), logo + wordmark lockups, PNG re-export on `--ink` canvas to eliminate `#181818` seam, playlist cover template set, Canva brand kit sync (`kAHGkHrcJYU`).

---

## Repo hygiene (complete, committed, pushed)

**Canonical working tree consolidated.** CLAUDE.md aligned across five sites (§2 storage block, §4 path table and warning paragraph, §11 docs tree listing, §12 session checklist) to `C:\Users\gillo\The-Audiopheliac\`. Stale `GitHub Clones\The-Audiopheliac\` references removed; the LLC folder is now correctly scoped to VALOR and Veteran Analytics LLC repos only.

**Filename cleanup.** `docs/faimly_room_network_topology` → `docs/family_room_network_topology.md` (typo + missing extension).

---

## Commits live on origin/main

| Hash | Commit |
|------|--------|
| `b011cac` | docs: fix filename typo and add .md extension for family room network topology |
| `1a2a202` | docs: align CLAUDE.md canonical paths with April 2026 consolidation |
| `1dbc5ee` | brand: lock Phase 1 tokens, favicon set, and rainbow-spectrum branding kit |

Range pushed: `d92143a..1dbc5ee`. Working tree clean except the deferred `The-Audiopheliac-Guitar-Literacy/` sibling.

---

## Next decision gate

Phase 2 authorization pending: scaffold Astro + Cloudflare Pages under `site/` and wire the initial routes (`/`, `/about`, `/gear`, `/vinyl`, stub `/dashboard`) to consume `tokens.css`. Three sub-decisions still open: (1) Astro public-dir convention — move brand files into `site/public/` or keep current `site/assets/` layout via config; (2) Tailwind vs vanilla CSS with tokens.css; (3) content approach — reuse `docs/*.md` at build time or create Astro content collections. Sully will package the scaffold spec for Rafa once these three are locked.
