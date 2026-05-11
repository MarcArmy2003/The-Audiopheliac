# 🎛️ Audiopheliac System Map – v2026.05.2 (Full Home A/V + Network Topology)
**Curated by Gillon "Gill" Marchetti (MarcArmy2003)**  
Version: 2026.05.2 | Updated: May 11, 2026  
**Changes (2026-05-11):**
- Focusrite Scarlett Solo 4th Gen failed (fried). M-Audio AIR Hub (AIRXHUB) promoted to primary monitoring/playback interface. Recording offline pending input-capable replacement.
- Rolls MX28 Mini-Mix VI documented as central Office Studio mixer with three line inputs (AIR Hub TRS, AT-LP120XUSB via Schiit Mani II, 1Mii RX #1).
- 1Mii RT5066R2 system reclassified ACTIVE: TX in Family Room (Yamaha Line Out via Rolls MB15b boost) feeding RX #1 (Office Studio → MX28) and RX #2 (Lanai → Schiit SYS). RX #2 location corrected from Garage to Lanai.
- SVS SoundPath TX/RX retired to reserve (removed from chain months ago).
- **Schiit Mani II** confirmed active in Office Studio as the phono preamp for AT-LP120XUSB. LP120 set to PHONO out; Mani II RCA out → Rolls MX28 Input B.
- **Schiit SYS** relocated to Lanai. Now serves as a passive A/B switch between 1Mii RX #2 (Family Room wireless) and Singing Machine (karaoke), feeding the Bose 3·2·1 AUX IN.

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
     └──► (Vinyl path stays local to Family Room; wireless distribution is driven from Yamaha Line Out via 1Mii TX, see below)

[Yamaha R-N800A]
     ├──► [Polk ES60 L/R Speakers] (12AWG Copper)
     ├──► [SVS SB-1000 Pro Subwoofer] (RCA Sub Out)
     └──► Line Out → [Rolls MB15b (boost)] → [1Mii RT5066R2 TX]
                                                  │ (2.4GHz wireless, ~20ms latency, 320ft range)
                                                  ├──► [1Mii RX #1 (Office Studio)] → Rolls MX28
                                                  └──► [1Mii RX #2 (Lanai)] → Lanai playback
```

**1Mii RT5066R2 System Status (2026-05-11): ACTIVE**
- TX sources Yamaha Line Out boosted by Rolls MB15b.
- RX #1 lives in Office Studio, feeds Rolls MX28 Mini-Mix VI.
- RX #2 lives on Lanai, feeds Lanai playback (replacing former SVS SoundPath RX).
- Replaces the SVS SoundPath TX/RX system, which was removed from chain months ago and is now stored as reserve.

**Playback Modes:**
- 5.1 Surround via Bose Lifestyle 650.
- Simultaneous 2.1 stereo via Yamaha R-N800A for audiophile listening.
- Vinyl playback independent of A/V sources.
- **Multi-room wireless audio distribution** via 1Mii TX to Office Studio + Lanai.

**Cabling Summary:**
| Connection | Cable Type | Purpose |
|-------------|-------------|----------|
| HDMI 2.1 | Digital A/V | Shield / Consoles → Bose → TV |
| Optical (TOSLINK) | Digital Audio | TV → Yamaha |
| RCA | Analog Audio | Turntable → Phono → Yamaha; Yamaha → Rolls → 1Mii TX |
| Speaker Wire | 12AWG Copper | Yamaha → Polk Towers |
| RCA Sub Out | Analog LFE | Yamaha → SVS Sub |
| 2.4GHz Wireless | Digital RF | 1Mii TX → Office Studio RX #1 + Lanai RX #2 |

---

## 💼 3️⃣ Home Office / Studio – Production & Monitoring Suite

```
[Audio-Technica AT-LP120XUSB (stock AT95E)] ──► [Schiit Mani 2 Phono Preamp]
     │ (RCA analog)
     ▼
[Audio-Technica AT-LP120XUSB] (PHONO out)
     │
     └──► [Schiit Mani II Phono Preamp] (RCA out, line level)
              │
              └──► [Rolls MX28 Mini-Mix VI Input B]

[1Mii RT5066R2 RX #1] (Family Room wireless feed)
     │
     └──► [Rolls MX28 Mini-Mix VI Input C]

[Rolls MX28 Mini-Mix VI] (Central studio mixer; active; 6-channel)
     ├──── Input A: AIR Hub TRS L/R (Dell Precision DAW / playback / streaming)
     ├──── Input B: AT-LP120XUSB → Schiit Mani II
     ├──── Input C: 1Mii RT5066R2 RX #1 (Family Room wireless feed)
     │
     └──► Master Out (TRS balanced) → [JBL LSR310S Subwoofer] (TRS balanced in)
                                            └──► [Yamaha HS7 Monitors L/R] (TRS balanced out)

[Dell Precision 7540 Workstation]
     │
     └──► [M-Audio AIR Hub (AIRXHUB)] (USB-C device → USB-A on WD19DCS dock)
              │  Primary monitoring/playback interface (24-bit/96kHz, output only)
              ├──► Balanced 1/4" TRS L/R → Rolls MX28 Input A (DAW source into central mixer)
              ├──► 1/4" Headphone Out (independent level) → Audio-Technica ATH-M50x (direct monitor)
              └──► Powered USB-A hub (3 ports, external PSU required):
                       ├──► Audio-Technica AT-LP120XUSB (USB-A; host-side digital, separate from MX28 audio path)
                       ├──► Positive Grid Spark 40
                       └──► Casio Privia PX-870

[Dell Precision 7540 Workstation]
     ├──► [QNAP NAS Access via 2.5GbE LAN] (NAS physically in Family Room)
     └──► [External SSD / Backup Drives]

[FAILED — Removed from chain 2026-05-11]
     Focusrite Scarlett Solo 4th Gen (S/N S1XJ7HX57AF107)
     Status: Fried, no signal. Warranty attempt pending (receipt missing, assume lost).

[Schiit pair — resolved 2026-05-11]
     Mani II: ACTIVE in Office Studio as the LP120 phono preamp (LP120 PHONO out → Mani II → MX28 Input B).
     SYS: relocated to Lanai as an A/B switch (see Lanai section).
```

**Studio Highlights:**
- Balanced TRS chain from sub → HS7 monitors (unchanged).
- M-Audio AIR Hub is the **primary monitoring/playback interface**, replacing the failed Focusrite Solo.
- AIR Hub is **output only** (no ADC). Recording capability is offline until an input-capable interface is sourced.
- AIR Hub's powered USB-A hub consolidates LP120, Spark 40, and Casio Privia into one host port on the WD19DCS dock.
- Connected via TP-Link TL-SG108E switch to QNAP NAS for fast session storage.
- **AT-LP120XUSB** with stock AT95E cartridge (AT-VM95SH Shibata on backorder).
- **1Mii RX #1** routes the Family Room wireless feed into Rolls MX28 Input C (active).
- **Schiit Mani II** is the phono preamp for AT-LP120XUSB (LP120 PHONO out → Mani II → MX28 Input B).
- **Schiit SYS** is no longer in the Studio chain — relocated to the Lanai (see Lanai section).

**Cabling Summary:**
| Connection | Type | Direction | Purpose |
|-------------|------|------------|----------|
| RCA | Analog | LP120 PHONO Out → Schiit Mani II → Rolls MX28 (Input B) | Turntable phono preamp into central mixer |
| RCA | Analog | 1Mii RX #1 → Rolls MX28 (Input C) | Family Room wireless feed into central mixer |
| TRS | Balanced Analog | Rolls MX28 Master → JBL LSR310S → HS7 L/R | Studio playback to monitors |
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

**1Mii RX #2 Status (2026-05-11):**
- 1Mii RX #2 is **NOT in the Garage** — it lives on the Lanai (see Lanai section).
- Garage currently has no wireless audio receiver. Amazon Echo (Bluetooth / Wi-Fi) is the only audio source here.

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

[1Mii RT5066R2 RX #2] (Family Room wireless audio)
     │
     └──► RCA L/R → [Schiit SYS Input 1]

[Singing Machine ISM9033 3.5mm OUT] (karaoke)
     │
     └──► RCA L/R → [Schiit SYS Input 2]

[Schiit SYS Output] (A/B passive switch — selects whole-house audio vs. karaoke)
     │
     └──► RCA L/R → [Bose 3·2·1 AUX IN]

[Bose 3·2·1 VIDEO OUT (Yellow) + AUDIO OUT (R/W)]
     │
     ▼
[Mini AV→HDMI Upscaler (1080p)]
     │
     └──► [Samsung HDMI 3]

[1Mii RT5066R2 RX #2] receives 2.4GHz wireless from [1Mii TX] (Family Room, fed by Yamaha Line Out via Rolls MB15b boost)
     └──► Routed via Schiit SYS Input 1 (see switching block above)

[Bose SoundTouch Genius] ← Portable Bluetooth speaker (occasional use)
```

**Notes:**
- **Bose 3·2·1** relocated from Garage; requires HDMI→RCA conversion via J-Tech AE4KA (aging system, no HDMI input).
- **REI UHD-PRO102 splitter** mirrors Chromecast video to both Samsung TV and Singing Machine.
- **Mini AV upscaler** returns Bose video output to Samsung HDMI 3 for DVD playback.
- **Schiit SYS** (relocated from Office Studio) acts as a passive A/B switch in front of the Bose AUX IN: Input 1 = 1Mii whole-house audio, Input 2 = Singing Machine karaoke. Output = Bose 3·2·1 AUX IN.
- **1Mii RT5066R2 RX #2** receives wireless Yamaha audio from Family Room (Yamaha Line Out → Rolls MB15b boost → 1Mii TX → RX #2). Replaces former SVS SoundPath RX.
- **Amazon Echo relocated to Garage** — Lanai now uses 1Mii wireless (via SYS) + Bose SoundTouch for streaming.

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
| 2.4 GHz / BT | Wireless | Audio / IoT | 1Mii (active), Echo, SVS (reserve only) |

---

## 🧩 System Summary

| Zone | Function | Core Hardware |
|------|-----------|----------------|
| Family Room | Cinema + Audiophile Stereo + **Wireless Hub** | Bose Lifestyle 650, Yamaha R-N800A, Polk ES60, SVS SB-1000 Pro, Rolls MB15b, 1Mii TX (active) |
| Home Office / Studio | Monitoring + Central Mixing + **Wireless RX** (recording offline) | AT-LP120XUSB, Schiit Mani II (phono preamp), Rolls MX28 Mini-Mix VI (central mixer), M-Audio AIR Hub (primary monitor I/F), HS7, JBL LSR310S, 1Mii RX #1. Focusrite Solo failed 2026-05-11. |
| Garage / Gym | Standalone Audio | Amazon Echo (no wireless RX in this zone) |
| Lanai | Smart Playback + **Wireless RX** + A/B switching | Samsung UN65U7900FD, Singing Machine, Bose 3·2·1, 1Mii RX #2, Schiit SYS (1Mii vs. karaoke selector → Bose AUX), Bose SoundTouch |
| Network Core | Data Backbone | Spectrum Modem, Wi-Fi 6E Router, QNAP NAS, Switches |

---

## 🎚️ Multi-Room Wireless Audio Transmission (v2026.04)

### Current Configuration: 1Mii RT5066R2 System (Family Room → Office Studio + Lanai)

```
[Technics SL-1200MK2]
     │
     ▼
[Pro-Ject Phono Box S2 Ultra]
     │
     └──► RCA → [Yamaha R-N800A Line In 1] (local Family Room playback)

[Yamaha R-N800A Line Out]
     │
     └──► [Rolls MB15b ProMatch] (boost)
              │
              └──► [1Mii RT5066R2 TX]
                       │ (2.4GHz wireless, ~20ms latency, 320ft range)
                       ├──► [1Mii RX #1 (Office Studio)] → Rolls MX28 Input C
                       └──► [1Mii RX #2 (Lanai)] → Lanai playback

[SVS SoundPath TX + RX] — REMOVED FROM CHAIN months ago. Held as reserve only.
```

### Equipment Status (2026-05-11): 1Mii ACTIVE, SVS RESERVE

- **1Mii RT5066R2 TX (Family Room):** ACTIVE — Yamaha Line Out → Rolls MB15b boost → 1Mii TX
- **1Mii RX #1 (Office Studio):** ACTIVE — feeds Rolls MX28 Mini-Mix VI
- **1Mii RX #2 (Lanai):** ACTIVE — feeds Lanai playback (replaces former SVS SoundPath RX)
- **SVS SoundPath TX + RX:** REMOVED from chains months ago. Stored as reserve.

---

**Total Networked Devices:** 28+  
**Studio Channels:** Output-only via M-Audio AIR Hub (24-bit/96kHz, no ADC). Recording offline.  
**AV Domains:** 4 (Family Room, Studio, Garage, Lanai)  
**Backbone Speed:** 2.5GbE wired core with Wi-Fi 6E mesh coverage.  
**Wireless Audio Zones (Active):** 2 — Office Studio via 1Mii RX #1, Lanai via 1Mii RX #2.  
**Turntables:** 2 (Technics SL-1200MK2 in Family Room with Ortofon Blue; AT-LP120XUSB in Studio with AT95E, line-out feeds MX28 Input B)

> *The Audiopheliac Signal Map represents live topology as of May 11, 2026. Updated to reflect: M-Audio AIR Hub as primary monitor interface (Solo failed); Rolls MX28 as central Studio mixer; 1Mii TX/RX system fully active (Family Room → Office Studio + Lanai); SVS SoundPath retired to reserve.*
