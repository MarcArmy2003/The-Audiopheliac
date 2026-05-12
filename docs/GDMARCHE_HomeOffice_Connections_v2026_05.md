# GDMARCHE Home Office — Connection Reference (Final)

**The Audiopheliac | Tech Lab** | 2026-05-12 | Version: v2 (supersedes 2026-05-11 initial)

---

## Stations

### 1. Dell WD19DCS — GDMARCHE Primary Dock

| Port | Connected To | Cable | Notes |
|---|---|---|---|
| DP1 | Sansui Monitor 1 | DP → HDMI (passive) | HDMI input on Sansui |
| DP2 | Sansui Monitor 2 | DP → HDMI (passive) | HDMI input on Sansui |
| HDMI | VACANT | — | Available — Anker HDMI switch or direct use |
| USB-C | VACANT | — | **Must remain empty — DP alt mode kills HDMI port** |
| USB-A | M-Audio AIR Hub | USB-A → USB-C | Primary audio monitoring interface |
| USB-A | J5 Create JCD543 dock (peripheral mode) | USB-A → USB-C | Passive USB expansion only — no video, no Ethernet, no PD |
| Ethernet | Spectrum puck | Ethernet | Wired LAN — direct to dock |

### 2. Dell Monitor (Older) — Shared Display

Serves both GDMARCHE and the GFE Latitude 5340 via separate inputs. Input switching via monitor OSD menu.

| Monitor Input | Source Device | Cable | Notes |
|---|---|---|---|
| DisplayPort | WD19DCS (GDMARCHE) | DP → DP | Primary GDMARCHE display |
| HDMI | J5 Create JCD543 dock (GFE Latitude 5340) | HDMI → HDMI | GFE display — switch via OSD |

### 3. J5 Create JCD543 — GFE Dock (Dell Latitude 5340)

Operates in full-feature mode when connected to the Latitude 5340 TB4 port. Video, Ethernet, and USB all functional.

| Port | Connected To | Cable | Notes |
|---|---|---|---|
| Host cable (USB-C) | Dell Latitude 5340 TB4 | Built-in USB-C cable | Full TB4 — video + data + PD active |
| HDMI | Dell monitor HDMI input | HDMI → HDMI | GFE display via monitor OSD switch |
| USB-A ports | Available | — | GFE peripherals as needed |
| Ethernet | Available | — | Can connect to Spectrum puck if needed |
| Power In (USB-C) | J5 power adapter | USB-C | Required for video and PD to function |

### 4. M-Audio AIR Hub — Audio Monitoring Interface

| Port | Connected To | Cable | Notes |
|---|---|---|---|
| Host (USB-C) | WD19DCS USB-A | USB-C → USB-A | Windows sees as audio device |
| 1/4" TRS L+R | Powered monitors | 1/4" TRS | Primary monitoring output |
| 1/4" Headphone | Headphones | 1/4" | Independent level control |
| USB-A (×3) | LP120 / Spark 40 / Casio Privia | USB-B → USB-A | Powered — requires external PSU |
| Power | AC outlet | External PSU | Required for hub ports to function |

### 5. Anker HDMI Switch — Opportunistic Use

Not in primary monitor chain.

- Connected to WD19DCS HDMI port when in use
- Use cases: iPhone display mirroring, guest device, secondary screen as needed
- One-button input switching between connected sources

### 6. Hyper HyperDrive Flex 5-Port USB-C Hub — Lanai / Portable

Not deployed at desk — lanai and portable use only.

- Connects to GDMARCHE or GFE USB-C port when on lanai
- Single monitor support — no DP alt mode conflict risk in portable config
- No external power required

---

## Standing Constraints

1. **WD19DCS USB-C port must remain empty at all times.** Any DP alt mode device on that port disables the dock HDMI port.
2. **J5 connected to WD19DCS USB-A** operates in degraded mode (USB hub only, no video, no Ethernet, no PD). The full-featured J5 connection is to the Latitude 5340 TB4 port.
3. **AIR Hub is DAC / output only** — no recording input. Replacement audio interface required for recording.
4. **Replacement interface (Scarlett Solo or equivalent)** goes to WD19DCS USB-A directly, not through AIR Hub.
5. **GDMARCHE IP 192.168.1.75 is DHCP — reservation pending.** Verify before scripting.

> **Conflict flag:** CLAUDE.md > HARDWARE > Workstation currently records GDMARCHE IP as 192.168.1.119 with DHCP reservation confirmed 2026-05-05. This document records 192.168.1.75 as DHCP, reservation pending. Resolve before next scripted operation that depends on the IP.

---

## Source

Lab notes captured 2026-05-12. Supersedes initial summary dated 2026-05-11. Filed by Lena (Studio Assistant, chat); saved by Cowork.

## Cross-reference

- `config/audiopheliac_signal_map_v_2026_05.md` — full signal chain across all zones.
- `docs/av_master_inventory_2026.md` — gear inventory and serials.
- `docs/Dell_Precision_7540_Specs.md` — workstation specs.
- `CLAUDE.md` HARDWARE section — current state of record (IP conflict noted above).
