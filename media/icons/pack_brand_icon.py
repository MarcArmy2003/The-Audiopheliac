"""Pack the canonical Audiopheliac brand mark into a transparent multi-resolution .ico.

Input:  The_Audiopheliac_Primary_Logo_GPT.jpg (canonical mark on near-black field)
Output: audiopheliac.ico (16, 32, 48, 64, 128, 256) plus PNG masters

Near-black background pixels are converted to alpha=0 with a soft threshold so the
disc reads cleanly against any Windows desktop wallpaper. The spectrum body and
white tonearm remain fully opaque.

Run from this directory:
    python pack_brand_icon.py

Idempotent. Re-running overwrites the output set.
"""
from __future__ import annotations

import os
from pathlib import Path

import numpy as np
from PIL import Image


HERE = Path(__file__).resolve().parent
SRC = HERE / "The_Audiopheliac_Primary_Logo_GPT.jpg"

# Sizes that ship inside the .ico
ICO_SIZES = [16, 32, 48, 64, 128, 256]
# Additional PNG masters retained for downstream use
PNG_SIZES = [16, 32, 48, 64, 128, 256, 512, 1024]

# Soft alpha threshold for near-black background removal.
# max(R,G,B) <= T_LOW  -> fully transparent
# max(R,G,B) >= T_HIGH -> fully opaque
# Between: linear ramp. Tuned for the #181818-ish JPG canvas while
# preserving the violet wedge (which has channel maxima around 200+).
T_LOW = 14
T_HIGH = 44


def to_transparent_rgba(src: Image.Image) -> Image.Image:
    """Drop the near-black background; preserve the disc and tonearm."""
    rgba = src.convert("RGBA")
    arr = np.array(rgba)
    max_ch = arr[:, :, :3].max(axis=2).astype(np.float32)
    alpha = np.clip((max_ch - T_LOW) / (T_HIGH - T_LOW), 0.0, 1.0) * 255.0
    arr[:, :, 3] = alpha.astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


def main() -> None:
    if not SRC.exists():
        raise SystemExit(f"Source not found: {SRC}")

    os.chdir(HERE)
    src = Image.open(SRC)
    cleaned = to_transparent_rgba(src)

    # Save PNG masters at every standard size, supersampled from the cleaned
    # high-resolution source via LANCZOS.
    for sz in PNG_SIZES:
        img = cleaned.resize((sz, sz), Image.LANCZOS)
        img.save(HERE / f"audiopheliac_{sz}.png", optimize=True)

    # Pack the .ico. Pillow downsamples from the 256 master for each size.
    master_256 = cleaned.resize((256, 256), Image.LANCZOS)
    master_256.save(
        HERE / "audiopheliac.ico",
        format="ICO",
        sizes=[(n, n) for n in ICO_SIZES],
    )

    print("Built:")
    for f in sorted(HERE.iterdir()):
        if f.name.startswith("audiopheliac") and f.suffix in {".png", ".ico"}:
            print(f"  {f.name}  ({f.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
