# Canva Brand Kit — Paste Sheet

**For Canva brand kit ID:** `kAHGkHrcJYU`
**Brand:** The Audiopheliac
**Version:** v3.0 Full Spectrum (2026-05-12)
**Logo already uploaded:** Yes (per Gill 2026-05-12)

Copy the values below directly into the corresponding Canva brand kit fields.

---

## Brand Colors

Canva brand kit color palette. Each row maps to one color slot. Name the swatch with the descriptor; paste the hex.

| Slot label | Name in Canva | Hex |
|---|---|---|
| Primary CTA | Sunlamp Yellow | `#F8E91F` |
| Accent — warm transition | Spring Lime | `#99E257` |
| Accent — center / success | Signal Green | `#41D99A` |
| Body accent (NEVER CTAs) | Cyan Pulse | `#0ABED3` |
| Info / structural | Sapphire Run | `#0F82DF` |
| Deep secondary | Indigo Drift | `#5E54D4` |
| CTA hover lift | Magenta Lift | `#C24CC8` |
| Field — primary | Ink | `#0A0A0B` |
| Field — secondary | Paper | `#F5F5F7` |
| Outlines only | Hairline | `#FFFFFF` |

**Recommended palette grouping inside Canva** (if Canva allows multiple palettes per kit):
- "Spectrum" palette: the 7 spectrum colors
- "Field" palette: Ink, Paper, Hairline

---

## Brand Fonts

Set in Canva Brand Kit > Fonts:

| Slot | Font | Use |
|---|---|---|
| Headings (H1) | **Unica One** | Hero, page titles |
| Headings (H2/H3) | **Unica One** | Section headers |
| Body | **Inter** | Body, captions, all running text |
| Other (mono, if available) | **JetBrains Mono** | Hex codes, technical notation |

Unica One and Inter are both Google Fonts. They should be available in Canva natively. If JetBrains Mono is not available, fall back to any monospace face.

---

## Logo

Already uploaded by Gill 2026-05-12.

**Canonical mark file:** `assets/The_Audiopheliac_Primary_Logo_GPT.jpg`
**Use as:** Primary logo for all templates.
**Treatment notes:** Place on Ink field (`#0A0A0B`) for default appearance. Do not recolor. Do not crop. Do not place on Paper field (loses contrast on cream background — needs a darker container).

---

## Brand Voice (paste into Canva Brand Kit > Brand Voice if available)

**Tone in one line:** Signal and emotion, stated as data. Direct, technically precise, anti-pretense, anti-snake-oil.

**Audience:** Adult middle-class DIY-creative audio enthusiast, not a credentialed audiophile reviewer. Wants the most from affordable gear and available technology. Family-context realistic.

**Two voice registers:**
- **Manifesto** — long-form, slow, declarative. For About narrative, design philosophy, gear deep-dives.
- **Direct** — short sentences, real opinions stated as fact. For content curation, microcopy, social, error states, Cockpit UI.

**Preferred vocabulary:** signal, signal chain, fidelity, groove, body, home hi-fi (lowercase), lived-in, The Audiopheliac presents...

**Forbidden vocabulary:** innovative, disruption, premium, luxury, curated for you, lo-fi (as aesthetic), audiophile (applied to ourselves).

**Style rules:**
- No em dashes in direct register.
- Sentence case for headings, never Title Case or ALL CAPS in body.
- Oxford comma.
- Active voice default.
- No emoji in body copy.

**Motto:** "Rock 'n' roll. Deal with it." (after Bret Easton Ellis).

---

## CTA Contract

Default CTA appearance for Canva templates:

- Background: `#F8E91F` (Sunlamp Yellow)
- Text: `#0A0A0B` (Ink)
- Hover lift (if interactive template): `#C24CC8` (Magenta Lift) background, `#F5F5F7` (Paper) text
- Border radius: pill (999px) or rounded (12px)
- Font: Inter, 600 weight
- Letter-spacing: 0.04em

**Forbidden CTA color:** `#0ABED3` (Cyan Pulse). Hard rule. Cyan is body-accent only.

---

## Hero Gradient

Reserved for one or two hero moments per surface. Full spectrum sweep:

```
linear-gradient(90deg,
  #F8E91F 0%,
  #99E257 16%,
  #41D99A 32%,
  #0ABED3 48%,
  #0F82DF 64%,
  #5E54D4 80%,
  #C24CC8 100%)
```

In Canva: build as a custom gradient on a hero element. Apply to text via "apply as text fill" if the template supports it.

---

## Template Suggestions for Canva

Templates to create or set up in this brand kit:

1. **Playlist cover** — 3000x3000 (Spotify) and 1500x1500 (Suno). Vinyl-era album-art style. "The Audiopheliac presents: [Title]" lockup at top.
2. **Social tile** — 1080x1080. Spectrum bar at top, mark in corner, single declarative line in Unica One on Ink.
3. **Suno profile banner** — 1500x500. Atmospheric studio photography or full-spectrum gradient with the canonical mark centered.
4. **Gear review card** — 1200x630. Product image left, technical-spec callout right in Inter, hex/spec values in mono.
5. **Manifesto post header** — 1200x630. Sentence-case Unica One title on Ink, single spectrum bar, no other ornament.

---

## Reference deliverables on disk (not for Canva paste, but related)

- [Visual brand kit reference card (PDF)](computer://C:\Users\gillo\The-Audiopheliac/_dev/01_brand/audiopheliac_brand_kit_reference.pdf) — one-page Frequency Cartography composition; pin in Canva as a reference.
- [Frequency Cartography design philosophy (markdown)](computer://C:\Users\gillo\The-Audiopheliac/_dev/01_brand/frequency_cartography_design_philosophy.md) — the aesthetic worldview the reference card expresses.
- [Brand voice guidelines v3.0](computer://C:\Users\gillo\The-Audiopheliac/brand-voice-guidelines-v3.md) — full voice and visual identity guide.
- [Full Spectrum design tokens (CSS)](computer://C:\Users\gillo\The-Audiopheliac/site/src/styles/tokens.v3.css) — code-side source of truth for the same palette.

---

## Workflow note

Canva MCP is not currently connected to this session, so I can't push these values directly into the kit. Two-step process:

1. Open the Canva brand kit at `kAHGkHrcJYU` in your browser.
2. Paste from this sheet into the corresponding fields (colors, fonts, voice).
3. Pin the reference PDF inside the kit as a quick-reference card.

When the Canva MCP is connected in a future session, the kit can be populated programmatically.
