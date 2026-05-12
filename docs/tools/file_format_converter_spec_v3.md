# File Format Converter — Spec v3 (Reactivated)

**Version:** 3.0
**Date:** 2026-05-11
**Status:** Reactivated from parked. THE-19 in the brand rework plan (`_dev/03_decision-log/brand_rework_plan_v1.md`).
**Supersedes:** `docs/Converter_Feature_Evaluation_v2026_05.md` (parked 2026-05-08).

---

## 1. Use case (Gill-first)

Three concrete workflows the tool exists to serve:

1. **Suno WAV → MP3 for Spotify Local Files.** Suno exports WAV. Spotify's Local Files feature indexes MP3 but not WAV. Manual ffmpeg work today. Should be one drop-and-go action.
2. **Vinyl rip cleanup.** AT-LP120XUSB rips to WAV; archival target is FLAC. Loudness normalization optional. One drop, one settings preset, one output.
3. **Playlist cover image format normalization.** Suno banners, AI-generated covers, photography inputs. Convert PNG ↔ JPG ↔ WEBP with optional resize.

If the tool serves these three, it earns its place. Anything beyond is bonus.

## 2. Execution model

**Client-side WASM.** No server. No upload. No retention.

Engine: ffmpeg.wasm for audio and video. Native browser canvas for image.

Reasons:
- Privacy: files never leave the device.
- Cost: zero server cost; Cloudflare Pages stays free-tier.
- Cloudflare Worker constraint: CPU time limits make server-side ffmpeg unworkable for large files.
- Reliability: no quota, no rate limits, no third-party dependency on a free converter service.
- Brand fit: the site asserts "no tracking, no uploads, no retention." The converter has to honor that.

**Concession:** ffmpeg.wasm is large (~25 MB gzipped). Loaded lazily only on the `/tools/converter` route. Workers cache after first visit. Acceptable for a tool with deliberate use, not for a viral landing.

## 3. Format support

### Audio (v1)

| Direction | Formats |
|---|---|
| Read | WAV, MP3, FLAC, AIFF, ALAC (m4a), OGG, OPUS |
| Write | WAV, MP3 (CBR/VBR), FLAC, AIFF, ALAC |

Bit depth: 16/24/32-bit. Sample rate: passthrough or transcode (44.1/48/88.2/96/192 kHz).

### Image (v1)

| Direction | Formats |
|---|---|
| Read | PNG, JPG, WEBP, GIF (first frame), BMP, TIFF |
| Write | PNG, JPG, WEBP |

Operations: format conversion, resize (preserve aspect or fixed dimensions), quality target for lossy formats.

### Video (v1.1 if WASM size allows)

| Direction | Formats |
|---|---|
| Read | MP4, MOV, WEBM, MKV |
| Write | MP4 (H.264), WEBM |

Defer if ffmpeg.wasm bundle is impractical at >50 MB.

## 4. Workflow presets

The differentiation from generic converters (RouteNote, CloudConvert, etc.) is named workflows for Gill's actual use cases. Each preset is one click.

### Preset 1: "Suno → Spotify Local Files"

- Input: WAV (any sample rate, any bit depth)
- Output: MP3, 320 kbps CBR (Spotify's preferred local files quality)
- Sample rate: 44.1 kHz (Spotify's native rate)
- Bit depth: N/A for MP3
- Metadata: preserve title and artist if present in WAV (rare); otherwise prompt for it
- Output naming: `{artist} - {title}.mp3`

### Preset 2: "Vinyl rip → FLAC archive"

- Input: WAV from AT-LP120XUSB or Audacity export
- Output: FLAC, level 5 compression (good balance)
- Sample rate: passthrough (preserve original)
- Bit depth: passthrough (preserve original)
- Metadata: prompt for album/artist/track if not present
- Output naming: `{artist} - {album} - {trackno} - {title}.flac`

### Preset 3: "Playlist cover normalize"

- Input: PNG, JPG, or WEBP at any size
- Output: JPG, quality 85, resized to 3000x3000 (Spotify max) and 1500x1500 (Suno banner)
- Two output files per input
- Output naming: `{input-name}_3000.jpg`, `{input-name}_1500.jpg`

### Custom mode

Free-form: pick format, quality, sample rate, dimensions, naming pattern. Power-user mode. Not the default.

## 5. UI design

- **Drop zone:** Dashed border, accepts drag-drop and file picker.
- **Preset selector:** Three cards for the named workflows + a fourth for Custom. Clear, large, brand-aligned per `tokens.v3.css`.
- **Settings inspector:** Once a preset is selected, settings appear as read-only fields with a "Customize" toggle that exposes editable controls.
- **Output destination:** Browser download (default). Optional: write to a user-selected directory using the File System Access API where supported (Chromium-based browsers).
- **Progress:** Real-time progress bar per file. WASM operations are CPU-bound; show seconds elapsed and estimated time remaining where calculable.
- **Result list:** Completed conversions with output filenames, sizes, and download buttons. Persists for the session only.
- **Batch:** Drop multiple files; the preset applies to all. Run in series (WASM is single-threaded by default; concurrent runs risk memory).

Brand voice for microcopy (direct register, per `brand-voice-guidelines-v3.md`):
- "Drop a file or pick one. WAV in, MP3 out, or pick your own settings."
- "Files never leave your browser. Nothing uploaded. Nothing saved."
- On error: "Something broke. Most likely: unsupported codec inside the container. Try a different file or open the console."

## 6. Technical implementation

### Stack

- Framework: Astro page route `/tools/converter` (static HTML shell + client-side hydration).
- WASM engine: `@ffmpeg/ffmpeg` v0.12+ (modern API with web worker support).
- File handling: standard `<input type="file">` and HTML5 drag-drop. File System Access API for output destination (Chromium only).
- State: in-memory JavaScript. No localStorage for files. Settings preferences (preset choice, custom values) persisted to localStorage.
- Build: bundled with the rest of the Astro site, but the ffmpeg.wasm payload loaded lazily.

### Performance budget

- Initial route load: < 200 KB JS (lazy ffmpeg).
- ffmpeg.wasm load: < 30 MB. Browser cache after first visit.
- Memory: WASM heap up to 2 GB (browser limit). Large file conversions may fail on low-memory devices; show a clear error.

### Browser support

- Chromium-based (Chrome, Edge, Brave, Arc): full support.
- Firefox: full support except File System Access API (falls back to download).
- Safari: ffmpeg.wasm works; File System Access API is iOS-limited.

## 7. Acceptance criteria

- All three named workflows complete end-to-end without manual settings adjustment.
- Custom mode supports every format combination listed in §3.
- No file is ever sent to a server. Verified by network panel inspection.
- Brand voice microcopy passes `brand-voice:enforce-voice`.
- Page passes WCAG AA contrast and AAA on CTA contract.
- Total page weight excluding ffmpeg WASM payload: < 250 KB.
- Conversion runtime: 30-second 44.1/16 WAV → MP3 completes in < 5 seconds on a modern laptop.

## 8. Out of scope (v1)

- DRM-protected formats (Apple Music, Spotify downloads, etc.).
- Real-time streaming conversion.
- Cloud storage integration (Drive, Dropbox).
- Server-side fallback.
- Mobile-first UI (responsive yes, mobile-optimized no).
- Metadata editing beyond what the preset surfaces.
- Account or login of any kind.

## 9. Future ideas (parked)

- Suno-specific preset that detects Suno WAVs and applies stem-separation-aware encoding (if Suno releases an export format that includes stems).
- Vinyl rip preset with click/pop detection (ML-based, would need a separate WASM dependency).
- Daypart-aware MP3 tagging for playlist tooling (cross-feature integration with the daypart playlist generator at THE-7 in tools roadmap).

## 10. Dependencies and risk

- **ffmpeg.wasm size growth:** Each minor version bump can add MB to the payload. Lock to a known version, audit before upgrading.
- **Browser memory limits:** Large video conversions may OOM. Show graceful failure with clear messaging.
- **File System Access API browser drift:** Currently Chromium-only. Don't rely on it; download is the default.
- **Mobile performance:** ffmpeg.wasm runs slowly on mobile CPUs. Acceptable; mobile is not the primary surface for this tool.

---

*The converter exists to serve three workflows. Everything else is feature creep. Ship the three, then decide.*
