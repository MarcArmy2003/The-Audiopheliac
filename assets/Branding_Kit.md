# The Audiopheliac Branding Kit

**Phase:** 1 (tokens and asset set locked)
**Last updated:** 2026-04-20
**Canonical mark:** `media/The_Audiopheliac_Primary_Logo_Only.png`

---

## 1. Brand mark

The primary mark is a circular vinyl record rendered as a full-spectrum rainbow on a near-black field, with a tonearm in pure white. Six chromatic wedges flow from yellow at the top through light green, green, teal, blue, and violet. The design reads as a spectrogram cast onto a record.

**Canonical source file:** `media/The_Audiopheliac_Primary_Logo_Only.png` (1024x1024, raster PNG).
**Format deliverables:**
- Raster PNG: exists (canonical source, 1024x1024)
- Favicon set: `site/public/favicons/favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png` (180), `icon-192.png`, `icon-512.png`, `favicon.ico` (multi-resolution)
- SVG: deferred to a dedicated design session (raster-to-vector auto-trace does not produce acceptable results on this gradient mark; manual SVG rebuild required)

**Mark is used only on the canonical near-black field (`--ink #0A0A0B`).** Do not place on white or saturated backgrounds. The PNG's canvas is a charcoal `#181818`; when re-exported it will match `--ink`. In the interim, set containers to `--ink` and accept a subtle one-pixel seam where needed.

---

## 2. Color tokens

All color values are sourced from pixel sampling of the canonical mark, clustered and snapped to a clean hex. Full token spec lives at `site/src/styles/tokens.css`.

### Core field
| Token | Hex | Role |
|-------|-----|------|
| `--ink` | `#0A0A0B` | Background, deep near-black field |
| `--paper` | `#F5F5F7` | Body text on dark field |
| `--hairline` | `#FFFFFF` | Pure white outlines and rules |

### Brand spectrum (logo order, yellow to violet)
| Token | Hex | Share of mark | Notes |
|-------|-----|---------------|-------|
| `--spectrum-1` | `#F8E91F` | 36% | Yellow; hero brand color; CTA default |
| `--spectrum-2` | `#99E257` | 6% | Light green |
| `--spectrum-3` | `#41D99A` | 11% | Green |
| `--spectrum-4` | `#0ABED3` | 19% | Teal; reserved for body accent only, not CTAs (conflicts with VALOR) |
| `--spectrum-5` | `#0F82DF` | 11% | Blue |
| `--spectrum-6` | `#5E54D4` | 5% | Violet |

### Spectrum gradient
```css
--spectrum-gradient: linear-gradient(135deg,
  #F8E91F 0%, #41D99A 33%, #0ABED3 55%, #0F82DF 78%, #5E54D4 100%);
```

Used only for the landing page primary CTA and the Spotify-connect button on `/dashboard`. Not for routine CTAs.

---

## 3. CTA contract

| Rule | Value |
|------|-------|
| Default CTA background | `--spectrum-1` yellow solid |
| Default CTA text | `--ink` black |
| Hover background | `#FFF04A` lifted yellow |
| Focus ring | `rgba(248, 233, 31, 0.45)` |
| Hero CTA (rare, 1-2 placements total) | `--spectrum-gradient` with black text |
| Forbidden | Teal for CTAs (VALOR brand separation), white text on yellow (contrast fails), gradient on every button (kills hierarchy) |

Accessibility baseline: yellow-on-black ratio is approximately 16.6:1, passes WCAG AAA for all text sizes.

---

## 4. Typography

| Role | Family | Source | Fallback |
|------|--------|--------|----------|
| Display (headlines, wordmark) | Unica One | Google Fonts | Archivo Black, Impact, sans-serif |
| Body (UI, paragraphs) | Inter | Google Fonts | -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif |

**Rationale:** Unica One gives the 1970s-80s stereo hi-fi typography character called out in Phase 1's original brief (retro hi-fi aesthetic) without tipping into novelty. Inter pairs cleanly for all UI copy, reads well at small sizes on dark, and is available as a variable font for full weight control.

**Modular scale:** 1.250 (major third), base 16px. Full scale tokens in `tokens.css`.

---

## 5. Icon pack

Derived from the canonical primary mark via LANCZOS downsampling. All icons live under `site/public/favicons/`.

| File | Size | Use |
|------|------|-----|
| `favicon-16.png` | 16x16 | Browser tab |
| `favicon-32.png` | 32x32 | Browser tab (retina) |
| `favicon.ico` | 16/32/48 | Legacy browser fallback |
| `apple-touch-icon.png` | 180x180 | iOS home screen |
| `icon-192.png` | 192x192 | Android, PWA manifest |
| `icon-512.png` | 512x512 | PWA install, high-density |

**Note:** The full vinyl-and-tonearm mark remains legible down to 32px. At 16px the tonearm collapses; the favicon reads as a spectrum ring, which is the intended behavior.

A "simplified mark" variant (waveform only, no tonearm) for smaller applications is not yet produced. Flag as a Phase 1 deferred item.

---

## 6. Playlist cover set

Out of scope for this Phase 1 update. Will be specified once core site and authenticated dashboard exist. Planned direction: vinyl fragments and soundwave abstractions on `--ink` field, spectrum-accent compositions, no default text so covers can be reused across playlists.

---

## 7. Deferred brand work

1. SVG rebuild of the primary mark (manual reconstruction from circles, arcs, and gradient stops)
2. Simplified icon variant (waveform-only, for sub-32px applications)
3. Logo-plus-wordmark lockups (Minimalist Sweep, Retro Hi-Fi, Modern Audiophile per original Phase 1 brief) in square and wide formats
4. PNG re-export of primary mark with `--ink #0A0A0B` canvas (or transparent bg) to eliminate current `#181818` seam
5. Playlist cover template set
6. Canva brand kit (`kAHGkHrcJYU`) synchronization: push these tokens and typography into Canva so future in-Canva work stays in brand

---

*This kit supersedes the prior Phase 1 specification that described the mark as "burnt orange vinyl + waveform." That direction was superseded by the current rainbow-spectrum mark. Historical note retained here for traceability.*
