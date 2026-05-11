# 🎛️ Audiopheliac System Map – v2026.05 (Full Home A/V + Network Topology)
**Curated by Gillon "Gill" Marchetti (MarcArmy2003)**  
Version: 2026.05 | Updated: May 11, 2026  
**Change (2026-05-11):** Focusrite Scarlett Solo 4th Gen failed (fried). M-Audio AIR Hub (AIRXHUB) promoted to primary monitoring/playback interface. Recording capability offline pending input-capable replacement.

---

## 🧭 1️⃣ Network Core – Backbone Infrastructure
```
[Internet / Spectrum EN2251 Modem]
     │ (Coax)
     ▼
[Spectrum Wi-Fi 6E Router SAX2V1R]
     ├──► [QNAP QSW-1105-5T Switch] (2.5GbE backbone)
     │       ├──► [QNAP TS-473A NAS] (192.168.1.230)
     │       ├──► [Dell Precision 7540 Workstation]
     │       ├──► [Yamaha R-N800A Receiver]
     │       ├──► [NVIDIA Shield Pro]
     │       └──► [TP-Link TL-SG108E 5Gb Switch (Home Studio Subnet)]
     │                 ├──► [Dell Precision 7540 DAW PC → M-Audio AIR Hub (USB-C to USB-A on WD19DCS)]
     │                 ├──► [AIR Hub powered USB-A hub: LP120, Spark 40, Casio Privia PX-870]
     │                 └──► [Schiit SYS + Schiit Mani 2 Signal Chain]
     │                       (Focusrite Scarlett Solo 4th Gen — FAILED 2026-05-11, removed from chain)
     │
     ├──► [Samsung NU6950 TV (Wi-Fi 6)]
     ├──► [Amazon Echo]
     ├──► [Samsung UN65U7900FD TV – Lanai]
     ├──► [Bose Lifestyle 650 Console]
     ├──► [Philips Hue Bridge]
     ├──► [Honeywell Home ProSeries Thermostat]
     └──► [Phones / Tablets / Smart Devices]
```
**Status:** Google Nest Mesh Router stored (inactive).  
**NAS Functionality:** QNAP TS-473A provides DLNA, Plex, and media backup for Family Room, Studio, and Mobile.

---

## 🎬 2️⃣ Family Room – Dual-System A/V Environment + Wireless Transmission Hub

```
[NVIDIA Shield Pro] ───► [Bose Lifestyle 650 Console (HDMI Input 1)]
     │
     ├──► [PlayStation 5] (HDMI Input 2)
     ├──► [Xbox One] (HDMI Input 3)
     ├──► [Nintendo Switch] (HDMI Input 4)
     │
     ▼
[Bose Lifestyle HDMI Out] ───► [Samsung NU6950 TV HDMI 2 (ARC)]

[Samsung TV Optical Out] ───► [Yamaha R-N800A Optical In 2]

[Technics SL-1200MK2 (Ortofon Blue)] ───► [Pro-Ject Phono Box S2 Ultra]
     │
     ├──► RCA Output 1 → [Yamaha R-N800A Line In 1] (local playback)
     │
     └──► RCA Output 2 → [Rolls MB15b] → [SVS SoundPath TX] → Lanai RX
                               Boosts vinyl signal for wireless transmission

[Yamaha R-N800A]
     ├──► [Polk ES60 L/R Speakers] (12AWG Copper)
     └──► [SVS SB-1000 Pro Subwoofer] (RCA Sub Out)
```

**1Mii RT5066R2 System Status:**
- **TX + 2× RX:** Purchased Jan 16, 2026 — **NOT YET CONNECTED**
- **Planned Function:** Multi-room wireless audio distribution to Studio + Garage
- **Pending:** Signal routing analysis and connection methodology

**Playback Modes:**
- 5.1 Surround via Bose Lifestyle 650.
- Simultaneous 2.1 stereo via Yamaha R-N800A for audiophile listening.
- Vinyl playback independent of A/V sources.
- **Multi-room wireless audio distribution** via 1Mii TX to Studio + Garage.

**Cabling Summary:**
| Connection | Cable Type | Purpose |
|-------------|-------------|----------|
| HDMI 2.1 | Digital A/V | Shield / Consoles → Bose → TV |
| Optical (TOSLINK) | Digital Audio | TV → Yamaha |
| RCA | Analog Audio | Turntable → Phono → Yamaha; Yamaha → Rolls → 1Mii TX |
| Speaker Wire | 12AWG Copper | Yamaha → Polk Towers |
| RCA Sub Out | Analog LFE | Yamaha → SVS Sub |
| 2.4GHz Wireless | Digital RF | 1Mii TX → Studio RX #1 + Garage RX #2 |

---

## 💼 3️⃣ Home Office / Studio – Production & Monitoring Suite

```
[Audio-Technica AT-LP120XUSB (stock AT95E)] ──► [Schiit Mani 2 Phono Preamp]
     │ (RCA analog)
     ▼
[Schiit SYS Passive Preamp]
     ├──── Input 1: Schiit Mani 2 (Turntable)
     ├──── Input 2: **Available for 1Mii RX #1** (not yet connected)
     │
     ├──► [JBL LSR310S Subwoofer] (TRS balanced)
     │        └──► [Yamaha HS7 Monitors L/R] (TRS balanced out)
     │
     └──► [SVS SoundPath Wireless RX] (Optional alternate input)

[Dell Precision 7540 Workstation]
     │
     └──► [M-Audio AIR Hub (AIRXHUB)] (USB-C device → USB-A on WD19DCS dock)
              │  Primary monitoring/playback interface (24-bit/96kHz, output only)
              ├──► Balanced 1/4" TRS L/R → Yamaha HS7 L/R (via JBL LSR310S TRS pass-through)
              ├──► 1/4" Headphone Out (independent level) → Audio-Technica ATH-M50x
              └──► Powered USB-A hub (3 ports, external PSU required):
                       ├──► Audio-Technica AT-LP120XUSB (digital audio out)
                       ├──► Positive Grid Spark 40
                       └──► Casio Privia PX-870

[Dell Precision 7540 Workstation]
     ├──► [QNAP NAS Access via 2.5GbE LAN] (NAS physically in Family Room)
     └──► [External SSD / Backup Drives]

[FAILED — Removed from chain 2026-05-11]
     Focusrite Scarlett Solo 4th Gen (S/N S1XJ7HX57AF107)
     Status: Fried, no signal. Warranty attempt pending (receipt missing, assume lost).
```

**Studio Highlights:**
- Balanced TRS chain from sub → HS7 monitors (unchanged).
- M-Audio AIR Hub is the **primary monitoring/playback interface**, replacing the failed Focusrite Solo.
- AIR Hub is **output only** (no ADC). Recording capability is offline until an input-capable interface is sourced.
- AIR Hub's powered USB-A hub consolidates LP120, Spark 40, and Casio Privia into one host port on the WD19DCS dock.
- Connected via TP-Link TL-SG108E switch to QNAP NAS for fast session storage.
- **AT-LP120XUSB** with stock AT95E cartridge (AT-VM95SH Shibata on backorder).
- **Schiit SYS Input 2** available for 1Mii RX #1 (Family Room wireless vinyl feed — not yet connected).

**Cabling Summary:**
| Connection | Type | Direction | Purpose |
|-------------|------|------------|----------|
| RCA | Analog | LP120 → Mani → SYS | Vinyl input chain |
| RCA | Analog | 1Mii RX #1 → SYS Input 2 | Family Room wireless feed |
| TRS | Balanced Analog | SYS → Sub → Monitors | Studio playback |
| USB-C → USB-A | Digital | AIR Hub → WD19DCS (workstation dock) | Primary monitoring/playback interface |
| 1/4" TRS (balanced) | Analog | AIR Hub → JBL → HS7 L/R | DAW playback to monitors |
| 1/4" TRS | Analog | AIR Hub Headphone Out → ATH-M50x | Independent headphone monitoring |
| USB-A | Digital | LP120, Spark 40, Casio Privia → AIR Hub powered hub | Peripheral consolidation |
| Ethernet | Cat6 | Workstation → NAS | Data & project storage |

---

## 🏋️ 4️⃣ Garage / Gym – Independent Audio Zone

```
[Amazon Echo (4th Gen)] ──► Bluetooth / Wi-Fi Playback (relocated from Lanai)
```

**1Mii RX #2 Status:**
- **Purchased:** Jan 16, 2026 — **NOT YET CONNECTED**
- **Planned Function:** Wireless Family Room audio feed for future integration

---

## 🌴 5️⃣ Lanai / Outdoor – Smart Playback Zone

```
[Google Chromecast 4K]
     │
     ▼
[REI UHD-PRO102 HDMI Splitter (1 in 2 out)]
     │
     ├──► Output 1 → [Samsung UN65U7900FD HDMI 1]
     │
     └──► Output 2 → [Singing Machine ISM9033 HDMI IN]

[Samsung HDMI 2 (ARC)]
     │
     ▼
[J-Tech AE4KA HDMI→RCA PCM Converter]
     │
     └──► RCA L/R → [Bose 3·2·1 TV AUDIO IN]

[Singing Machine 3.5mm OUT]
     │
     └──► RCA L/R → [Bose 3·2·1 AUX IN]

[Bose 3·2·1 VIDEO OUT (Yellow) + AUDIO OUT (R/W)]
     │
     ▼
[Mini AV→HDMI Upscaler (1080p)]
     │
     └──► [Samsung HDMI 3]

[SVS SoundPath Wireless RX] ← [SVS TX (Family Room, fed by Rolls MB15b)]
     └──► Provides wireless Yamaha pre-out audio to Lanai

[Bose SoundTouch Genius] ← Portable Bluetooth speaker (occasional use)
```

**Notes:**
- **Bose 3·2·1** relocated from Garage; requires HDMI→RCA conversion via J-Tech AE4KA (aging system, no HDMI input).
- **REI UHD-PRO102 splitter** mirrors Chromecast video to both Samsung TV and Singing Machine.
- **Mini AV upscaler** returns Bose video output to Samsung HDMI 3 for DVD playback.
- **SVS SoundPath RX** receives wireless Yamaha pre-out from Family Room (boosted via Rolls MB15b).
- **Amazon Echo relocated to Garage** — Lanai now uses SVS wireless + Bose SoundTouch for streaming.

---

## 💡 6️⃣ Smart & IoT Devices

| Device | Location | Connection | Status |
|---------|-----------|-------------|----------|
| Philips Hue Bridge | Family Room | Ethernet | Active |
| Honeywell Thermostat | Hallway | Wi-Fi | Active |
| Google Nest Router | Stored | — | Inactive |
| Amazon Echo | Lanai / Family Room | Wi-Fi | Active |
| Smart TVs (Samsung / Vizio) | Family Room / Lanai | Wi-Fi | Active |
| THIRDREALITY Motion Sensors | Various | Zigbee | Active |
| LiftMaster MyQ Garage Hub | Garage | Wi-Fi | Active |

---

## 🔗 7️⃣ Cable & Connection Legend

| Symbol | Connection Type | Medium | Common Use |
|:--|:--|:--|:--|
| HDMI 2.1 | Digital A/V | High-bandwidth video & audio | Consoles, Shield, Bose, TV |
| Optical (TOSLINK) | Digital Audio | PCM / Stereo link | TV → Yamaha |
| RCA | Analog Stereo | Line-level | Turntable, preamps, signal converters |
| TRS | Balanced Analog | Pro audio | Studio monitors |
| USB A/B/C | Digital | Interface / instruments | DAW, Spark, Casio |
| Ethernet (Cat6) | Network | Wired LAN | NAS / PC / AV gear |
| 2.4 GHz / BT | Wireless | Audio / IoT | 1Mii, Echo, SVS |

---

## 🧩 System Summary

| Zone | Function | Core Hardware |
|------|-----------|----------------|
| Family Room | Cinema + Audiophile Stereo + **Wireless Hub** | Bose Lifestyle 650, Yamaha R-N800A, Polk ES60, SVS SB-1000 Pro, Rolls MB15b, 1Mii TX |
| Home Office / Studio | Monitoring + **Wireless RX** (recording offline) | AT-LP120XUSB, Schiit Stack, M-Audio AIR Hub (primary), HS7, JBL LSR310S, 1Mii RX #1. Focusrite Solo failed 2026-05-11. |
| Garage / Gym | Standalone Audio + **Wireless RX** | Bose 3·2·1 System, 1Mii RX #2, Amazon Echo |
| Lanai | Smart Playback | Amazon Echo, Samsung UN65U7900FD, Singing Machine, SVS Bluetooth RX |
| Network Core | Data Backbone | Spectrum Modem, Wi-Fi 6E Router, QNAP NAS, Switches |

---

## 🎚️ Multi-Room Wireless Audio Transmission (v2026.04)

### Current Configuration: SVS SoundPath System (Family Room → Lanai)

```
[Technics SL-1200MK2] 
     │
     ▼
[Pro-Ject Phono Box S2 Ultra]
     │
     ├──► RCA Output 1 → [Yamaha R-N800A Line In 1] (local playback)
     │
     └──► RCA Output 2 → [Rolls MB15b ProMatch]
                              │ (Boosts vinyl signal for wireless transmission)
                              ▼
                         [SVS SoundPath TX]
                              │
                              └──► 2.4GHz Wireless → [SVS SoundPath RX (Lanai)]
                                        Provides wireless Yamaha pre-out audio
```

### Planned Integration: 1Mii 2.4GHz System (Family Room → Studio + Garage)

**Equipment Status:**
- ✅ **1Mii RT5066R2 TX:** Purchased Jan 16, 2026 — **NOT YET CONNECTED**
- ✅ **1Mii RX #1:** Purchased Jan 16, 2026 — **NOT YET CONNECTED**
- ✅ **1Mii RX #2:** Purchased Jan 16, 2026 — **NOT YET CONNECTED**

**Planned Signal Path (TBD):**
```
[Source Audio] → [1Mii RT5066R2 TX]
     │
     ├──► 2.4GHz Wireless (320 ft range, ~20ms latency)
     │
     ├──► [1Mii RX #1 (Studio)] → Schiit SYS Input 2 → Monitors
     │
     └──► [1Mii RX #2 (Garage)] → Future AUX connection
```

**Pending Decisions:**
1. **Source connection method:** Direct from Yamaha Line Out vs. Rolls MB15b split
2. **Signal routing:** Compatibility with existing SVS TX path
3. **Integration testing:** Verify latency and signal quality

**Objective:** Establish accurate baseline documentation to guide connection methodology.

---

**Total Networked Devices:** 28+  
**Studio Channels:** 2-input / 2-output + balanced monitor chain  
**AV Domains:** 4 (Family Room, Studio, Garage, Lanai)  
**Backbone Speed:** 2.5GbE wired core with Wi-Fi 6E mesh coverage.  
**Wireless Audio Zones (Current):** 1 active (Lanai via SVS RX)  
**Wireless Audio Zones (Planned):** +2 additional (Studio via 1Mii RX #1, Garage via 1Mii RX #2)  
**Turntables:** 2 (Technics SL-1200MK2 in Family Room with Ortofon Blue, AT-LP120XUSB in Studio with AT95E)

> *The Audiopheliac Signal Map represents live topology as of Jan 2026. All components verified by model, connection type, and use case for archival and system maintenance. 1Mii system purchased but not yet integrated — documentation provides accurate baseline for future connection planning.*
