"""Audiopheliac Cockpit icon set generator.

Renders the canonical vinyl-disc mark in Nashville Midnight duotone
(neon cream + deep indigo with stage bronze label), at every Windows
icon resolution, and packs a multi-resolution .ico for use with the
Cockpit Desktop shortcut.

Design philosophy: ./Microgroove_Ritual.md
Output set:        ./audiopheliac_cockpit_<size>.png and ./audiopheliac_cockpit.ico

Run from this directory:
    python build_icons.py

Idempotent. Re-running overwrites the previous output set.
"""
from __future__ import annotations

import math
import os
from pathlib import Path

from PIL import Image, ImageDraw

# Nashville Midnight palette (per CLAUDE.md WEBSITE STATE, approved 2026-04-28)
INK     = (10,  10,  11,  255)
INDIGO  = (27,  35,  64,  255)
CREAM   = (232, 213, 163, 255)
BRONZE  = (184, 115, 51,  255)
GOLD    = (212, 176, 140, 255)
PAPER   = (245, 245, 247, 255)

# Sizes that ship in the .ico (Windows convention; 256 is PNG-encoded internally)
ICO_SIZES = [16, 32, 48, 64, 128, 256]
# Additional PNG masters retained for future use (apple-touch, PWA, social)
PNG_SIZES = [16, 32, 48, 64, 128, 256, 512, 1024]


def render_mark(size: int, *, full_detail: bool, transparent: bool = True) -> Image.Image:
    """Render the canonical vinyl mark at `size` px square.

    `full_detail` includes the tonearm and cartridge. Disable for sizes
    below 48 px where the tonearm collapses to noise.

    Rendering is supersampled 2x and downsampled with LANCZOS for clean edges.
    """
    SS = 2
    s = size * SS
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0) if transparent else INK)
    d = ImageDraw.Draw(img, "RGBA")

    cx, cy = s / 2.0, s / 2.0
    R = s * 0.47  # outer disc radius

    # Disc body
    d.ellipse([cx - R, cy - R, cx + R, cy + R], fill=INDIGO)

    # Microgrooves: 14 concentric cream rings, easing density outward
    inner_r = s * 0.135
    outer_r = R - s * 0.012
    n_rings = 14
    stroke = max(1, int(round(s * 0.0028)))
    for i in range(n_rings):
        t = i / (n_rings - 1)
        radius = inner_r + (outer_r - inner_r) * (1.0 - (1.0 - t) ** 1.4)
        d.ellipse(
            [cx - radius, cy - radius, cx + radius, cy + radius],
            outline=CREAM,
            width=stroke,
        )

    # Center label (stage bronze)
    label_r = s * 0.115
    d.ellipse([cx - label_r, cy - label_r, cx + label_r, cy + label_r], fill=BRONZE)

    # Spindle hole (indigo to read as a void in the bronze label)
    spindle_r = s * 0.012
    d.ellipse(
        [cx - spindle_r, cy - spindle_r, cx + spindle_r, cy + spindle_r],
        fill=INDIGO,
    )

    if full_detail:
        # Tonearm: pivot upper-right, needle on outer playing area
        pivot_x = s * 0.84
        pivot_y = s * 0.16
        needle_angle = math.radians(-30)
        needle_r = s * 0.32
        needle_x = cx + needle_r * math.cos(needle_angle)
        needle_y = cy + needle_r * math.sin(needle_angle)

        arm_width = max(2, int(round(s * 0.016)))
        d.line(
            [(pivot_x, pivot_y), (needle_x, needle_y)],
            fill=CREAM,
            width=arm_width,
        )

        # Pivot ring (cream) with indigo core
        pivot_r = s * 0.028
        d.ellipse(
            [pivot_x - pivot_r, pivot_y - pivot_r, pivot_x + pivot_r, pivot_y + pivot_r],
            fill=CREAM,
        )
        pivot_dot_r = s * 0.011
        d.ellipse(
            [
                pivot_x - pivot_dot_r,
                pivot_y - pivot_dot_r,
                pivot_x + pivot_dot_r,
                pivot_y + pivot_dot_r,
            ],
            fill=INDIGO,
        )

        # Cartridge: slim rotated rectangle in cream, perpendicular to arm
        arm_angle = math.atan2(needle_y - pivot_y, needle_x - pivot_x)
        cos_a = math.cos(arm_angle)
        sin_a = math.sin(arm_angle)
        cart_w = s * 0.052
        cart_h = s * 0.028
        cc_x = needle_x - cos_a * cart_w * 0.4
        cc_y = needle_y - sin_a * cart_w * 0.4
        corners = []
        for dx, dy in [
            (-cart_w / 2, -cart_h / 2),
            ( cart_w / 2, -cart_h / 2),
            ( cart_w / 2,  cart_h / 2),
            (-cart_w / 2,  cart_h / 2),
        ]:
            rx = cc_x + dx * cos_a - dy * sin_a
            ry = cc_y + dx * sin_a + dy * cos_a
            corners.append((rx, ry))
        d.polygon(corners, fill=CREAM)

        # Stylus dot (bronze) at the needle tip
        sty_r = s * 0.009
        d.ellipse(
            [needle_x - sty_r, needle_y - sty_r, needle_x + sty_r, needle_y + sty_r],
            fill=BRONZE,
        )

    return img.resize((size, size), Image.LANCZOS)


def main() -> None:
    here = Path(__file__).resolve().parent
    os.chdir(here)

    images: dict[int, Image.Image] = {}
    for sz in PNG_SIZES:
        # Sub-48 px loses the tonearm cleanly (matches Branding_Kit.md guidance:
        # "At 16px the tonearm collapses; the favicon reads as a [...] ring,
        # which is the intended behavior.").
        img = render_mark(sz, full_detail=(sz >= 48))
        out = here / f"audiopheliac_cockpit_{sz}.png"
        img.save(out, optimize=True)
        images[sz] = img

    # Build multi-resolution .ico from the rendered masters. Pillow accepts
    # a single source and downsamples per `sizes`; we supply the 256 master
    # since it carries the full-detail rendering for >= 48 sizes, and rely
    # on Pillow's LANCZOS resize for the sub-48 entries (which still read
    # well after the tonearm's collapse).
    ico_path = here / "audiopheliac_cockpit.ico"
    images[256].save(
        ico_path,
        format="ICO",
        sizes=[(n, n) for n in ICO_SIZES],
    )

    print("Built:")
    for f in sorted(here.iterdir()):
        if f.suffix in {".png", ".ico"}:
            print(f"  {f.name}  ({f.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
