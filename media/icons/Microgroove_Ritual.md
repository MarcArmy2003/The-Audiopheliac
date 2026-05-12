# Microgroove Ritual

**Design philosophy for The Audiopheliac Cockpit launcher icon and adjacent brand glyphs.**

---

## Manifesto

This is the aesthetic discipline that governs every Audiopheliac mark, glyph, and surface rendered at small scale. Microgroove Ritual treats the act of cueing a record as a sacrament and the visual vocabulary as a liturgy of perfect concentric form. Each composition is reduced to the geometry that mattered before reproduction became disposable: the precise circle, the radius engraved by a cutting lathe, the diamond on a cantilever lowered with a hand that does not shake. The viewer should feel that decades of craftsmanship and a hundred careful listening sessions are compressed into the form, and that the mark was made by someone for whom this is a daily practice, not a hobby.

The philosophy demands restraint. No ornament that does not serve the geometry. No second color that does not also serve weight. Every concentric line is a microgroove, every microgroove a unit of time, every unit of time the territory of an engineer who labored over the master. The composition rewards the eye that lingers: at distance, a quiet bronze and indigo medallion; up close, an engraved cadence of arcs and a single tonearm sweep that locks the eye into the playing field.

Color is duotone and disciplined. A transparent or near-black field gives way to deep indigo for the body of the disc, neon cream for the precision rings that cut across the vinyl like raked light at golden hour in a Nashville bedroom studio, and a single stage bronze label at the center to anchor the gaze. Color carries information: bronze is the focal point, cream is structure, indigo is mass. Anything that does not earn a place in that hierarchy is removed. The palette is not decoration. It is signal flow rendered visible.

Scale is the test of the work. The mark must read at sixteen pixels and at one thousand twenty four pixels with equal authority. At small scale the tonearm collapses, the cartridge collapses, and the disc becomes a quiet ring, the way a real record reads from across a room. At large scale every microgroove is a deliberate, hand placed gesture. This is not generation, it is engraving. The result must look as though it was cut by a master at a cutting lathe by a person who has done this for thirty years and would notice the eccentricity of a single missed groove.

Typography is absent. The mark stands alone. When typography appears on adjacent surfaces, it is Unica One for display and Inter for body, and it whispers rather than declares. The geometry has already said what needs saying. Words would be redundant. The icon is the entire statement.

Every detail is a discipline: anti aliased edges, exact concentricity to the sub pixel, perfectly tangent tonearm, even spacing of grooves, the cartridge a clean angled rectangle and not a cartoon. Master level execution is the floor, not the ceiling. The piece must look like the product of countless hours, painstaking attention, master level craftsmanship by someone at the absolute top of their field. Nothing slapdash. Nothing shipped. Only carved.

---

## Visual specifications

**Subject:** Vinyl disc with tonearm, top down view. Canonical Audiopheliac mark.

**Palette (Nashville Midnight, per CLAUDE.md WEBSITE STATE):**
- Disc body: `--deep-indigo #1B2340`
- Microgrooves: `--neon-cream #E8D5A3`
- Tonearm and pivot ring: `--neon-cream #E8D5A3`
- Center label: `--stage-bronze #B87333`
- Spindle hole and pivot center: `--deep-indigo #1B2340`
- Stylus tip: `--stage-bronze #B87333`
- Background: transparent (so the disc reads as the icon shape on any desktop)

**Treatment:** Variant B duotone (cream and indigo) with a single stage bronze focal label. Falls between Treatment A (monochrome bronze, favicons) and Treatment B (duotone primary mark, branding).

**Geometry:**
- Outer disc radius: 47 percent of canvas (square aspect)
- Center label radius: 11.5 percent of canvas
- Spindle hole radius: 1.2 percent of canvas
- Microgroove count: 14 rings, density easing toward the outer edge
- Tonearm: pivot at upper right, sweep to needle on outer playing area, cartridge a slim rotated rectangle, stylus a 0.9 percent bronze dot

**Output set:**
- Source masters: PNG at 16, 32, 48, 64, 128, 256, 512, 1024
- Packed icon: `audiopheliac_cockpit.ico` containing 16, 32, 48, 64, 128, 256 entries
- Generator script retained for reproducibility: `build_icons.py`

**Off limits:**
- Text inside the mark
- Drop shadows or skeuomorphic gloss
- Tonearm at sub 48 pixel renders (collapses to noise; let the disc read as a ring)
- Saturation higher than the Nashville Midnight palette specifies
