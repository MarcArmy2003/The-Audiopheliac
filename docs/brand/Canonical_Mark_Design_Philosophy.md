# Canonical Mark — Design Philosophy

**Version:** 1.0 (Full Spectrum, 2026-05-11)
**Mark:** The Audiopheliac canonical mark — vinyl turntable rendered as concentric segmented arcs across the full visible spectrum, on near-black ink, with a tonearm sweeping from upper right.
**Canonical asset:** `assets/The_Audiopheliac_Primary_Logo_GPT.jpg` (raster master). This is THE mark. Use it everywhere the mark is rendered until a vector tool trace produces a faithful SVG.
**Approximation reference (do NOT use as asset):** `_dev/01_brand/canonical_mark_rebuild_v0.svg` is a code-driven structural approximation, not faithful to the canonical's organic details (acorn cartridge, continuous outer-ring spectrum sweep, tonearm proportions). Kept as a structural reference for the eventual vector rebuild.
**Vector rebuild status:** Deferred to a dedicated design session in Illustrator / Inkscape / Affinity Designer, tracing the raster path-by-path.
**Template lineage:** This document's structure derives from `media/icons/Microgroove_Ritual.md`, which served as the Cockpit launcher icon's Nashville Midnight philosophy doc. That document is now shelved as historical exploration. This document supersedes it for the primary mark in Full Spectrum.

---

## Manifesto

The mark is the brand. Everything else is application.

The canonical Audiopheliac mark renders the act of playing a record as a single visible idea: a turntable seen from above, its grooves lit across the full audible spectrum from yellow through magenta, with a tonearm laid into the playing field like an engineer's signature. The viewer who knows audio reads it as a spectrogram cast onto a record. The viewer who does not know audio reads it as a rainbow vinyl. Both readings are correct. Both lead to the same conclusion: this is a brand made by someone for whom listening is structural, not decorative.

Color is doing real work here. The visible spectrum from approximately 380 to 700 nanometers maps to the audible spectrum from approximately 20 hertz to 20 kilohertz by analogy, not by physics. The brand makes the analogy load-bearing. Yellow is presence. Green is grounding. Blue is space. Magenta is the warm terminus where high frequencies meet emotional weight. The seven bands of the canonical mark are the brand's full statement about what music is, applied through the structural metaphor of a record.

The geometry is engineered, not retro. Concentric arcs cut by perpendicular axes. The tonearm pivot at the upper right. The stylus dot at the playing position. The center spindle as Signal Green, the one fixed point in the spectrum, the same color used for confirmation states in the Cockpit UI. Nothing in the mark is decorative. Every line is doing a job that another line is not.

The mark must hold its character at every scale. At 16 pixels it collapses to a quiet spectrum disc, the tonearm gone, the spindle gone, only the gradient ring visible. At 1024 pixels every concentric band reads as a discrete segment, the tonearm reads as a precise instrument, the stylus dot reads as a single point of contact with the playing field. Between those extremes the mark interpolates gracefully because the geometry is mathematical, not raster-decorated. This is the structural argument for an SVG rebuild: the mark deserves to scale by math, not by interpolation.

---

## Visual specifications

### Subject

Vinyl turntable, top-down view. Four concentric arc bands divided into four quadrants by perpendicular axes. Tonearm enters from upper-right pivot, sweeps to a stylus contact point on the right playing area. Center spindle as a small Signal Green dot.

### Palette (Full Spectrum, per `site/src/styles/tokens.v3.css`)

The mark sweeps the full prismatic spectrum continuously around the disc:

| Quadrant | Hue family | Token range |
|---|---|---|
| Top-left arc | Sunlamp Yellow → Spring Lime | `--spectrum-1` → `--spectrum-2` |
| Bottom-left arc | Spring Lime → Cyan Pulse | `--spectrum-2` → `--spectrum-4` |
| Bottom-right arc | Cyan Pulse → Sapphire Run | `--spectrum-4` → `--spectrum-5` |
| Top-right arc | Sapphire Run → Indigo Drift → Magenta Lift | `--spectrum-5` → `--spectrum-7` |

- Field: `--ink #0A0A0B`. Never pure `#000`. The slight non-black preserves rendering on OLED, dark mode, and printed black.
- Center spindle: `--spectrum-3` (Signal Green). The single fixed reference point.
- Tonearm shaft: `--paper #F5F5F7` at 14px stroke (scaled).
- Tonearm pivot: `--ink` body, `--paper` rim, `--paper` center dot.
- Stylus cartridge: `--paper` quadrilateral. Stylus tip: `--spectrum-1` (Sunlamp Yellow), 9px radius (scaled).
- Dividers: `--ink` (12-16px width, scaled), crossing the disc at horizontal and vertical axes.

### Geometry

- Outer disc radius: 458 of 1024 viewBox (≈ 89.4% diameter).
- Outermost arc band: radius 400-468 (outer ring).
- Mid arc band: radius 300-360.
- Inner arc band: radius 210-270.
- Center playing area (label position): radius < 210, dark field.
- Center spindle: 22 radius, Signal Green fill.
- Dividers: 12px wide vertical (`x=-6 to x=6`) and horizontal (`y=-6 to y=6`), full diameter, Ink fill.
- Tonearm pivot: center at `(330, -340)` in viewBox coordinates (translated +512,+512 to canvas).
- Tonearm shaft: line from `(330, -340)` to `(180, -100)`.
- Stylus cartridge: small quadrilateral at line endpoint, Paper fill.
- Stylus tip: 8-9 radius circle, Sunlamp Yellow fill.

### Scale behavior

| Scale | Treatment |
|---|---|
| ≥ 256px | Full mark: all bands, tonearm, cartridge, stylus tip, spindle |
| 64-256px | Full mark with proportional element scaling; verify tonearm legibility |
| 32-64px | Drop the stylus tip; retain tonearm shaft and cartridge |
| 16-32px | Drop the tonearm entirely; render as concentric spectrum ring with center spindle |
| < 16px | Collapse to a single-color disc (Sunlamp Yellow or Magenta Lift on Ink). The spectrum becomes implied rather than drawn |

### Treatment variants

- **A — Primary (default):** Prismatic full spectrum on Ink. Used for website hero, social profiles, Suno avatar, GitHub README, Cockpit launcher icon.
- **B — Monochrome (small):** Single-color Sunlamp Yellow on Ink or Magenta Lift on Ink. For favicons ≤32px and contexts where the gradient cannot render.
- **C — Reversed (light contexts):** Indigo Drift mark on Paper field. For print, email, light-mode UI, business cards.
- **D — Hero gradient lockup (rare):** Prismatic spectrum extended into a horizontal sweep below the mark, as a separator or section anchor. Max two uses per page.

---

## Typography

Typography is absent from the mark itself. The geometry has already said what needs saying. When typography appears in lockup or adjacent surfaces:

- Display face: **Unica One** (all-caps geometric face, distinctive at large sizes).
- Body face: **Inter** (variable sans-serif, reads cleanly 13-20px).
- Wordmark: "THE AUDIOPHELIAC" in Unica One. Letterspacing approximately 0.04em. Color: Paper on Ink for primary; Ink on Paper for reversed.
- Sub-line ("HOME HI-FI, ANTI-PRETENSE", "PRESENTS...", "COCKPIT"): Inter 500 weight, 0.78rem, 0.18em letterspacing, Paper-muted color.

No script faces. No serifs in primary brand applications. The mark and the typography both want to read as engineered, not retro.

---

## Off-limits

- Text inside the mark.
- Drop shadows, glows, skeuomorphic gloss, or 3D extrusion.
- Tonearm at sub-48px renders (collapses to noise; let the disc read as a ring).
- Saturation higher than the Full Spectrum palette specifies.
- Hue rotation or palette substitution. The seven bands are fixed.
- Recoloring the spindle. Signal Green is the only allowed center color.
- Adding an inner platter pattern or label graphic.
- Cropping the mark. Always rendered whole or not at all.
- Pairing with teal CTAs (`--spectrum-4` Cyan Pulse). Cyan is body-accent only.

---

## Sub-brands

### The Audiopheliac Cockpit

The Cockpit is the local control panel for Gill's home AV system. It is a sub-product of The Audiopheliac, not a separate brand. The Cockpit UI uses the Full Spectrum palette (per the v3.0 rework) and the canonical mark in its header. The Cockpit launcher icon is the canonical mark in Treatment A.

Previously, an alternate Nashville Midnight treatment was explored for the Cockpit launcher icon (`media/icons/Microgroove_Ritual.md`). That exploration is shelved. The Cockpit and the primary brand share one mark and one palette.

### Future sub-marks

If The Audiopheliac develops sub-brands later (e.g., a separate label for Suno releases, a separate utility for the converter), each sub-mark must derive geometrically from the canonical mark. Sub-marks may use a single-color variant (Treatment B) or a quadrant of the spectrum, but they may not introduce new geometric vocabulary, new fonts, or new structural shapes.

---

## Production discipline

- Canonical asset is `assets/The_Audiopheliac_Primary_Logo_GPT.jpg` (raster). Use this everywhere the mark is rendered.
- Working raster masters at `media/icons/audiopheliac_*.png` (8 sizes: 16, 32, 48, 64, 128, 256, 512, 1024). Generated from the canonical via `media/icons/pack_brand_icon.py`.
- Packed ICO at `media/icons/audiopheliac.ico` (entries: 16, 32, 48, 64, 128, 256).
- Vector master does NOT yet exist. The structural approximation at `_dev/01_brand/canonical_mark_rebuild_v0.svg` is reference only; deferred work is a proper vector tool trace of the canonical raster.
- Every change to the canonical mark requires regenerating the full raster set and the ICO. No hand-edited rasters.

---

*"The mark is not generation. It is engraving."*
