# Spotify - Configuration Profile

**Package:** Spotify (Windows desktop client)
**Owner:** Gillon "Gill" Marchetti (MarcArmy2003)
**Profile version:** 2026.05.1
**Last reviewed:** 2026-05-11
**Status:** Active (Premier / Lossless tier)

> Per-package configuration profile for The Audiopheliac. Source of truth for Spotify desktop client, Developer App registration, bit-perfect playback chain through the M-Audio AIR Hub, Local Files indexing into the music library at `M:\The Audiopheliac\`, and the automation pipeline that pulls library state into `data/spotify/`. Cross-references to canonical inventory at `docs/av_master_inventory_2026.md` and to the live signal map at `config/audiopheliac_signal_map_v_2026_01.md`.

---

## 1. Overview

Spotify is the primary streaming source on GDMARCHE. The desktop client streams from the workstation to two destinations: the Office Studio monitoring chain via the M-Audio AIR Hub (currently locked bit-perfect to Spotify's lossless tier), and the Family Room Yamaha R-N800A via MusicCast / DLNA / Spotify Connect. Local Files functionality indexes the album-output library at `M:\The Audiopheliac\First Tracks\` for MP3 playback alongside streamed content. A Spotify Developer App registration drives the project's `automation/spotify_pull.py` library export and the gap-report pipeline against the on-disk FLAC index.

---

## 2. Installation

| Field | Value |
|---|---|
| Install source | Microsoft Store |
| App package path | `C:\Users\gillo\AppData\Local\Packages\SpotifyAB.SpotifyMusic_zpdnekdrzrea0\LocalState\Spotify\` |
| App executable | `C:\Users\gillo\AppData\Local\Microsoft\WindowsApps\Spotify.exe` (Store stub) |
| Vendor version (last verified) | Tracked via Microsoft Store auto-update |
| Auto-update | On (Microsoft Store policy) |
| Plan | Premier (includes Lossless) |
| Auth email | gillon.marchetti@gmail.com |
| Support | https://support.spotify.com |

Note: `gdmarche-user` is the Microsoft Store app identifier, not the Spotify social username.

---

## 3. Account

| Field | Value |
|---|---|
| Username (canonical) | `MarcArmy2003` |
| Display name | The Audiopheliac |
| Public profile URL | https://open.spotify.com/user/marcarmy2003 |
| MFA | Per Spotify account security settings |

---

## 4. Configuration

### 4.1 Spotify desktop client - Audio Quality

| Setting path | Value | Rationale |
|---|---|---|
| Settings > Audio Quality > Streaming Quality | Lossless | Spotify Premier lossless tier, 16-bit / 44.1 kHz FLAC |
| Settings > Audio Quality > Download Quality | Lossless | Match streaming tier for parity offline |
| Settings > Audio Quality > Auto Adjust Quality | Off | Prevent quality drops on transient network blips |
| Settings > Audio Quality > Normalize Volume | Off | Bit-perfect output requires no volume processing |
| Settings > Audio Quality > Loudness Setting | N/A (Normalize Off) | Disabled with Normalize Off |

### 4.2 Spotify desktop client - Playback

| Setting path | Value | Rationale |
|---|---|---|
| Settings > Playback > Autoplay | On (personal preference) | Continues queue after user content ends |
| Settings > Playback > Crossfade | Off | Crossfade introduces sample-rate processing that breaks bit-perfect |
| Settings > Playback > Gapless Playback | On | Required for properly mastered albums |

### 4.3 Spotify desktop client - Local Files

| Setting path | Value | Rationale |
|---|---|---|
| Settings > Library > Show Local Files | On | Enables Local Files source |
| Settings > Library > Show songs from > `M:\The Audiopheliac` | On | Album-output library root; M: maps to `\\NAS87828E\Music` |
| Spotify indexes | MP3 only (WAVs not indexed, vendor format limitation) | Suno bounces saved as WAV + MP3 side-by-side under `M:\The Audiopheliac\First Tracks\` |

### 4.4 M-Audio AIR Hub - Windows Sound properties

| Setting path | Value | Rationale |
|---|---|---|
| Control Panel > Sound > AIR Hub > Properties > Advanced > Default Format | 16 bit, 44100 Hz (CD Quality) | Matches Spotify lossless source rate; zero resampling in Windows shared mixer |
| Control Panel > Sound > AIR Hub > Properties > Advanced > Exclusive Mode > Allow applications to take exclusive control | Unchecked | Spotify uses WDM shared mode; leaving exclusive disabled prevents other apps from forcing rate changes mid-session |
| Control Panel > Sound > AIR Hub > Properties > Enhancements > Disable all enhancements | Checked | Any DSP enhancement breaks bit-perfect |

### 4.5 M-Audio AIR Hub Driver Control Panel

| Setting | Value | Rationale |
|---|---|---|
| Sample Rate | 44100 | Matches Windows default format and Spotify lossless source |
| Preferred Buffer Size | 256 samples (~5.8 ms one-way latency at 44.1 kHz) | Comfortable playback default. AIR Hub has no ADC, so live monitoring latency is irrelevant. Move to 512 or 1024 if dropouts appear under CPU load. |
| Bit depth setting | Not exposed | AIR Hub DAC runs at 24-bit natively. 16-bit Spotify stream is word-extended to 24-bit with zero-padded LSBs by the driver, which is mathematically lossless. |
| Driver version (last verified) | 1.0.5 | Confirmed 2026-05-11. |

---

## 5. Signal Chain / Integration Points

### 5.1 Bit-perfect playback chain (Office Studio)

```
Spotify desktop client (Lossless tier, 16-bit / 44.1 kHz FLAC)
  > Windows WDM shared mixer (16/44.1, no resampling, no enhancements)
  > M-Audio AIR Hub WDM driver (44.1 kHz, 256-sample buffer)
  > AIR Hub 24-bit DAC (16 bits in upper word, zero-padded LSBs)
  > AIR Hub balanced 1/4" TRS L/R out
  > Rolls MX28 Mini-Mix VI Input A
  > Rolls MX28 Master Out (TRS balanced)
  > JBL LSR310S Subwoofer (TRS in)
  > Yamaha HS7 L/R (TRS balanced out)

Headphone monitoring path:
AIR Hub 1/4" Headphone Out (independent level control)
  > Audio-Technica ATH-M50x
```

### 5.2 Spotify Connect / MusicCast (Family Room)

Spotify Connect targets the Yamaha R-N800A directly. The Yamaha registers itself as a Spotify Connect endpoint on the LAN at 192.168.1.191. Streaming from any Spotify client (desktop, mobile, web) can hand off playback to the R-N800A natively, which then drives the Polk ES60 towers and SVS SB-1000 Pro subwoofer.

Cross-reference: `docs/av_master_inventory_2026.md` Section "Family Room" for the full Yamaha chain.

### 5.3 Data pipeline (this repo)

```
Spotify Web API
  > automation/spotify_pull.py
  > data/spotify/spotify_library.json
  > automation/spotify_local_match.py (joined with data/library_index/library_index.json from music_indexer.py)
  > data/manifests/spotify_local_matches.json
  > automation/spotify_gap_report.py
  > data/manifests/spotify_missing_tracks.txt
```

Pipeline driver auth credentials live in `config/spotify.env` (gitignored).

---

## 6. Related Automation

| Artifact | Path | Purpose |
|---|---|---|
| Spotify lossless bit-perfect wrapper | `C:\Scripts\Set-AIRHub-And-Launch-Spotify.ps1` | Pins AIR Hub default format to 16-bit / 44.1 kHz via NirSoft SoundVolumeView, then launches Spotify. Runs every session to defeat driver auto-renegotiation. |
| Start menu shortcut | `C:\Users\gillo\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Spotify_Bit_Perfect.lnk` | Target: `powershell.exe -NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File "C:\Scripts\Set-AIRHub-And-Launch-Spotify.ps1"`. Icon: `%USERPROFILE%\Icons\Spotify_Script.ico`. |
| Format-pin utility | `C:\Tools\SoundVolumeView\SoundVolumeView.exe` | NirSoft portable executable. Source: https://www.nirsoft.net/utils/sound_volume_view.html |
| Library export | `automation/spotify_pull.py` | Exports authorized Spotify library snapshot to `data/spotify/spotify_library.json`. |
| Local-match join | `automation/spotify_local_match.py` | Joins Spotify library against `data/library_index/library_index.json` to identify which streamed tracks also exist locally. |
| Gap report | `automation/spotify_gap_report.py` | Produces `data/manifests/spotify_missing_tracks.txt` for tracks present on Spotify but missing from the local FLAC library. |
| Indexer (upstream dependency) | `automation/music_indexer.py` | Scans `\\NAS87828E\Music` for FLAC. Must run before `spotify_local_match.py`. Indexer exclusion rules live in `config/music_sources.json`. |

Daily refresh (run from GDMARCHE at `C:\Users\gillo\The-Audiopheliac\`):

```powershell
python automation\music_indexer.py
python automation\spotify_pull.py
python automation\spotify_local_match.py
python automation\spotify_gap_report.py
```

---

## 7. Spotify Developer App

| Field | Value |
|---|---|
| App name | The Audiopheliac |
| Client ID | `7b8b0cd38be7496b864a0380b8c2a16c` |
| Client secret | Stored in `config/spotify.env` (gitignored). Not in this file. |
| Status | Development mode |
| User cap | Max 5 authorized users |
| Redirect URI | `https://github.com/MarcArmy2003/The-Audiopheliac` |
| Authorized users | gillon.marchetti@gmail.com, gillon.marchetti@veterananalytics.com |
| Dashboard | https://developer.spotify.com/dashboard |

---

## 8. Troubleshooting Runbook

### Issue: AIR Hub default format reverts between Spotify tracks or after Spotify restart
- **Symptom:** Audio plays bit-perfect on the first track, then sounds different on the next track or after closing and reopening Spotify. Windows Sound Advanced tab shows the format has changed away from 16-bit / 44.1 kHz.
- **Cause:** Windows USB audio drivers can renegotiate sample rate when an audio session ends and a new one begins. M-Audio AIR Hub firmware prefers 24-bit / 96 kHz at the hardware level, so without an app holding the device, the driver can pull rank during negotiation.
- **Fix:** Launch Spotify only via the `Spotify_Bit_Perfect.lnk` shortcut, which runs `Set-AIRHub-And-Launch-Spotify.ps1`. The wrapper re-pins the default format every session.
- **Verification:** After launching via the shortcut, open `Control Panel > Sound > AIR Hub > Properties > Advanced` and confirm "16 bit, 44100 Hz (CD Quality)" is shown. Play three consecutive tracks. Format must remain pinned.

### Issue: Spotify plays through the wrong output device
- **Symptom:** Audio routes to Yamaha R-N800A, Bose Lifestyle 650, or another endpoint instead of the AIR Hub.
- **Cause:** Spotify Connect can hand off playback to any device on the LAN that advertises itself as a Spotify endpoint, or Windows default playback device may not be set to the AIR Hub.
- **Fix:**
  1. In Spotify, click the device selector (bottom right of the now-playing bar) and select "This computer".
  2. Confirm the AIR Hub is the Windows default playback device. Run `& 'C:\Tools\SoundVolumeView\SoundVolumeView.exe' /SetDefault 'M-Audio AIR Hub' all 1` from PowerShell 5.1, or relaunch via the bit-perfect shortcut.
- **Verification:** Sound icon system tray should show the AIR Hub as the active output. Audio should be heard through the HS7 monitors via the MX28.

### Issue: Local Files not appearing in Spotify library
- **Symptom:** Tracks under `M:\The Audiopheliac\First Tracks\` do not show in Spotify's Local Files view.
- **Cause:** Spotify indexes only MP3 (not WAV) from Local Files sources. M: drive mapping may also be offline.
- **Fix:**
  1. Verify M: mapping is live: `Test-Path 'M:\The Audiopheliac\First Tracks\'`. If false, remap with `net use M: "\\NAS87828E\Music" /persistent:yes`.
  2. Confirm MP3 versions exist alongside WAV files. Spotify will only show MP3.
  3. In Spotify, toggle Settings > Library > Show songs from `M:\The Audiopheliac` off and on. Reindex.
- **Verification:** MP3 tracks appear under Your Library > Local Files.

### Issue: `automation/spotify_pull.py` returns 401 Unauthorized
- **Symptom:** Pipeline script fails with 401 or "token expired" error.
- **Cause:** OAuth refresh token is expired or revoked, or Client ID / secret has been rotated.
- **Fix:**
  1. Verify `config/spotify.env` contains current `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.
  2. Re-run the OAuth flow per the script's auth bootstrap (see comments inside `automation/spotify_pull.py`).
  3. Confirm the authorized account is still listed under the Spotify Developer App's User Management page.
- **Verification:** `python automation\spotify_pull.py` writes a fresh `data/spotify/spotify_library.json` without errors.

### Issue: Spotify quality silently downgrades
- **Symptom:** Lossless icon disappears from the now-playing bar, or audio quality audibly drops.
- **Cause:** Spotify may downgrade quality on transient network issues if Auto Adjust Quality is on, or the account tier may have lapsed.
- **Fix:**
  1. Confirm Settings > Audio Quality > Auto Adjust Quality is OFF.
  2. Confirm Streaming Quality is set to Lossless.
  3. Verify Premier subscription is current at https://www.spotify.com/account/subscription/.
- **Verification:** Lossless badge visible on the now-playing bar during playback of a track from a verified lossless album.

---

## 9. Known Limitations

- Spotify desktop on Windows does not support native ASIO or WASAPI Exclusive Mode. Bit-perfect playback requires the Windows shared-mode default format to be locked at 16-bit / 44.1 kHz with no enhancements and no resampling.
- Spotify Local Files indexes MP3 only; WAV files are ignored (vendor limitation, not a configuration error).
- Spotify Developer App is in Development mode and capped at 5 authorized users. Promoting to Extended Quota requires Spotify's review process.
- No official public Suno API exists, so Suno > Spotify cross-platform automation is not viable through Spotify's Developer surface.
- M-Audio AIR Hub bit-depth is fixed at 24-bit by hardware; not a Spotify-side concern, but worth noting when interpreting the playback chain.

---

## 10. Change Log

| Date | Profile version | Change |
|---|---|---|
| 2026-05-11 | 2026.05.1 | Initial profile. Documents Premier / Lossless tier, full bit-perfect chain through M-Audio AIR Hub (after Focusrite Solo failure), Local Files config against `M:\The Audiopheliac\`, Developer App registration, `Set-AIRHub-And-Launch-Spotify.ps1` wrapper, full troubleshooting runbook covering format reversion, output routing, Local Files visibility, OAuth failures, and quality downgrades. |

---

*Cross-references: `docs/av_master_inventory_2026.md` (Home Office / Studio table for AIR Hub, MX28, HS7), `config/audiopheliac_signal_map_v_2026_01.md` (Office Studio signal block), repo CLAUDE.md (Platform Credentials, Software and DAW Environment).*
