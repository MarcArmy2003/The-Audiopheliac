# 🎛️ Audiopheliac System Map – v2025.12 (Full Home A/V + Network Topology)
**Curated by Gillon “Gill” Marchetti (MarcArmy2003)**  
Version: 2025.12 | Updated: December 22, 2025  

---

## 🧭 1️⃣ Network Core – Backbone Infrastructure
```
[Internet / Spectrum EN2251 Modem]
     │ (Coax)
     ▼
[Spectrum Wi-Fi 6E Router]
     ├──► [QNAP QSW-1105-5T Switch] (2.5GbE backbone)
     │       ├──► [QNAP TS-473A NAS]
     │       ├──► [Dell Precision 7540 Workstation]
     │       ├──► [Yamaha R-N800A Receiver]
     │       ├──► [NVIDIA Shield Pro]
     │       └──► [TP-Link 5Gb Switch (Home Studio Subnet)]
     │                 ├──► [Focusrite Scarlett Solo / DAW PC]
     │                 ├──► [AIRHub USB DAC / Spark 40 / Casio Privia PX-870]
     │                 └──► [Schiit SYS + Schiit Mani 2 Signal Chain]
     │
     ├──► [Samsung NU6950 TV (Wi-Fi 6)]
     ├──► [Amazon Echo]
     ├──► [Vizio Smart TV – Lanai]
     ├──► [Bose Lifestyle 650 Console]
     ├──► [Philips Hue Bridge]
     ├──► [Honeywell Home ProSeries Thermostat]
     └──► [Phones / Tablets / Smart Devices]
```
**Status:** Google Nest Mesh Router stored (inactive).  
**NAS Functionality:** QNAP TS-473A provides DLNA, Plex, and media backup for Family Room, Studio, and Mobile.

---

## 🎬 2️⃣ Family Room – Dual-System A/V Environment
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
[Yamaha R-N800A]
     ├──► [Polk ES60 L/R Speakers] (12AWG Copper)
     ├──► [SVS SB-1000 Pro Subwoofer] (RCA Sub Out)
     └──◄── [Pro-Ject Phono Box S2 Ultra (RCA Line In 1)]

[Technics SL-1200MK2] ───► [Pro-Ject Phono Box S2 Ultra] (RCA)
```
**Playback Modes:**
- 5.1 Surround via Bose Lifestyle 650.
- Simultaneous 2.1 stereo via Yamaha R-N800A for audiophile listening.
- Vinyl playback independent of A/V sources.

**Cabling Summary:**
| Connection | Cable Type | Purpose |
|-------------|-------------|----------|
| HDMI 2.1 | Digital A/V | Shield / Consoles → Bose → TV |
| Optical (TOSLINK) | Digital Audio | TV → Yamaha |
| RCA | Analog Audio | Turntable → Phono → Yamaha |
| Speaker Wire | 12AWG Copper | Yamaha → Polk Towers |
| RCA Sub Out | Analog LFE | Yamaha → SVS Sub |

---

## 💼 3️⃣ Home Office / Studio – Production & Monitoring Suite
```
[Audio-Technica AT-LP120XUSB] ──► [Schiit Mani 2 Phono Preamp]
     │ (RCA analog)
     ▼
[Schiit SYS Passive Preamp]
     ├──► [Focusrite Scarlett Solo (USB-C to DAW PC)]
     ├──► [AIRHub USB DAC]
     │        ├──► [Casio Privia PX-870 (USB-B to A)]
     │        └──► [Positive Grid Spark 40 (USB-B to A)]
     ├──► [JBL LSR310S Subwoofer] (TRS balanced)
     │        └──► [Yamaha HS7 Monitors L/R] (TRS balanced out)
     └──► [SVS SoundPath Wireless RX] (Input 2, Family Room stream)

[Dell Precision 7540 Workstation]
     ├──► [Focusrite Scarlett Solo]
     ├──► [QNAP NAS Access via 2.5GbE LAN]
     └──► [External SSD / Backup Drives]
```
**Studio Highlights:**
- Balanced TRS chain from sub → HS7 monitors.
- Integrated USB-AIRHub handles Spark 40, Casio keyboard, and recording I/O.
- Focusrite Scarlett Solo (4th Gen, 2025) for DAW input/output.
- Connected via TP-Link 5Gb switch to QNAP NAS for fast session storage.

**Cabling Summary:**
| Connection | Type | Direction | Purpose |
|-------------|------|------------|----------|
| RCA | Analog | LP120 → Mani → SYS | Vinyl input chain |
| TRS | Balanced Analog | SYS → Sub → Monitors | Studio playback |
| USB-C | Digital | Scarlett → Workstation | Audio interface |
| USB-B/A | Digital | Spark, Casio → AIRHub | Instrument input |
| Ethernet | Cat6 | Workstation → NAS | Data & project storage |

---

## 🏋️ 4️⃣ Garage / Gym – Independent Audio Zone
```
[Bose 3·2·1 Series II Console]
     ├──► [Built-in DVD Source]
     ├──► [AUX Input (3.5 mm Stereo)]
     ▼
[Bose 2.1 Speaker Array]
```
**Notes:**
- Legacy setup, self-contained.
- No Wi-Fi or Ethernet integration.
- AUX occasionally fed from phone or portable Bluetooth transmitter.

---

## 🌴 5️⃣ Lanai / Outdoor – Smart Playback Zone
```
[Amazon Echo]  ← (Wi-Fi / Alexa / Spotify Connect)
     │
     ├──► [22" Vizio Smart TV] (HDMI ARC / Wi-Fi)
     └──► [Bose SoundTouch Genius] (Bluetooth, occasional use)

[SVS SoundPath Wireless TX (Family Room)] ───► [SVS SoundPath Wireless RX (Lanai)]
     └──► [Optional Input: Schiit SYS Input 2 – Studio Vinyl Streaming]
```
**Notes:**
- Echo is primary playback device (default music and voice control).
- Vizio Smart TV used for streaming / background audio.
- Bose SoundTouch Genius occasionally used for Bluetooth playback.
- SVS Wireless RX enables whole-home vinyl streaming when powered.

---

## 💡 6️⃣ Smart & IoT Devices
| Device | Location | Connection | Status |
|---------|-----------|-------------|----------|
| Philips Hue Bridge | Family Room | Ethernet | Active |
| Honeywell Thermostat | Hallway | Wi-Fi | Active |
| Google Nest Router | Stored | — | Inactive |
| Amazon Echo | Lanai / Family Room | Wi-Fi | Active |
| Smart TVs (Samsung / Vizio) | Family Room / Lanai | Wi-Fi | Active |

---

## 🔗 7️⃣ Cable & Connection Legend
| Symbol | Connection Type | Medium | Common Use |
|:--|:--|:--|:--|
| HDMI 2.1 | Digital A/V | High-bandwidth video & audio | Consoles, Shield, Bose, TV |
| Optical (TOSLINK) | Digital Audio | PCM / Stereo link | TV → Yamaha |
| RCA | Analog Stereo | Line-level | Turntable, preamps |
| TRS | Balanced Analog | Pro audio | Studio monitors |
| USB A/B/C | Digital | Interface / instruments | DAW, Spark, Casio |
| Ethernet (Cat6) | Network | Wired LAN | NAS / PC / AV gear |
| 2.4 GHz / BT | Wireless | Audio / IoT | SVS, Echo, Bose |

---

## 🧩 System Summary
| Zone | Function | Core Hardware |
|------|-----------|----------------|
| Family Room | Cinema + Audiophile Stereo | Bose Lifestyle 650, Yamaha R-N800A, Polk ES60, SVS SB-1000 Pro |
| Home Office / Studio | Recording + Monitoring | LP120XUSB, Schiit Stack, Focusrite, HS7, JBL LSR310S |
| Garage / Gym | Standalone Audio | Bose 3·2·1 System |
| Lanai | Smart Playback | Amazon Echo, Vizio TV, SoundTouch Genius |
| Network Core | Data Backbone | Spectrum Modem, Wi-Fi 6E Router, QNAP NAS, Switches |

---

**Total Networked Devices:** 24+  
**Studio Channels:** 2-input / 2-output + balanced monitor chain  
**AV Domains:** 4 (Family Room, Studio, Garage, Lanai)  
**Backbone Speed:** 2.5GbE wired core with Wi-Fi 6E mesh coverage.  

> *The Audiopheliac Signal Map represents live topology as of Dec 2025. All components verified by model, connection type, and use case for archival and system maintenance.*

