<p align="center">
  <img src="https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/media/The_Audiopheliac_Primary_Logo_GPT.jpg" 
       alt="The Audiopheliac Primary Logo" width="300" />
</p>

# AV_Master_Inventory_v2026.05

**The Audiopheliac – Comprehensive AV, Studio & Network Inventory**
Author & Maintainer: *Gillon "Gill" Marchetti (MarcArmy2003)*
Version: v2026.05
Date: March 15, 2026
Merged from: AV_Master_Inventory_v2026.01 + Dell Precision network record update

---

## 📘 Table of Contents

1. [🎮 Family Room](#-family-room)  
2. [💼 Home Office / Studio](#-home-office--studio)  
3. [🏋️ Garage / Gym](#%EF%B8%8F-garage--gym)  
4. [🌴 Lanai / Pool](#-lanai--pool)  
5. [🛏️ Bedrooms](#%EF%B8%8F-bedrooms)  
6. [🎸 Instruments & Studio Gear](#-instruments--studio-gear)  
7. [🌐 Network Core](#-network-core)  
8. [🌡️ Smart Home & Environmental Control](#-smart-home--environmental-control)  
9. [🚪 Garage & Utility Systems](#-garage--utility-systems)  
10. [🖥️ Family / Reserve Systems](#%EF%B8%8F-family--reserve-systems)  
11. [🔗 Cross-Reference Index](#-cross-reference-index)  
12. [🪾 Version History](#-version-history)

---

## 🎮 Family Room

| Device                 | Make / Model                                                                                                           | Serial Number                     | Purchase Date | Est. Resale (USD) | Notes                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ------------- | ----------------- | ------------------------------------------------------------------------- |
| Receiver               | [Yamaha R-N800A](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/Processing_Hardware.md)               | YN8A23090154                      | Apr 2024      | $950              | Network stereo receiver with MusicCast, DAC, Wi-Fi, and AirPlay 2         |
| NAS                    | [QNAP TS-473A](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/QNAP_TS473A_Specs.md)                   | NAS87828E                         | Oct 2024      | $900              | 4-bay NAS; 16GB RAM; 22TB total (WD Red drives); in entertainment center  |
| Signal Converter       | Rolls MB15b ProMatch 2-Way Stereo Converter                                                                            | TBD                               | Jan 16, 2026  | $55               | Consumer ↔ Pro level conversion; RCA ↔ XLR balanced; passive; Made in USA |
| Wireless TX (1Mii)     | 1Mii RT5066R2 Wireless Audio Transmitter                                                                               | TBD                               | Jan 16, 2026  | $25               | 2.4GHz digital; ~20ms latency; 320ft range; RCA + 3.5mm I/O               |
| Wireless TX (SVS)      | SVS SoundPath Wireless Audio Adapter TX                                                                                | TBD                               | Oct 2025      | $100              | Feeds Lanai RX; connected to Rolls MB15b to boost Yamaha pre-out signal   |
| Turntable              | Technics SL-1200MK2                                                                                                    | GE4CQ71315                        | Pre-owned     | $800              | Direct drive; Ortofon Blue cartridge installed                            |
| Phono Preamp           | Pro-Ject Phono Box S2 Ultra                                                                                            | 25A001611                         | Oct 2025      | $266              | Silver finish; Made in Slovakia                                           |
| Speakers               | Polk ES60 Towers (Pair)                                                                                                | ES60L-PO2020004 / ES60R-PO2020005 | Jul 2025      | $640              | Purchased new; excellent condition                                        |
| Subwoofer              | SVS SB-1000 Pro                                                                                                        | SVS-PRO-002151                    | Jul 2025      | $768              | DSP-tuned sealed 12" subwoofer; isolated via Auralex ProPAD (pair)        |
| Home Theater           | [Bose Lifestyle 650](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/Lifestyle_650_Console_Summary.md) | 078932HLF650A1                    | Sep 2021      | $1,600            | 5.1.2 Atmos-ready system with console + remote                            |
| Media Streamer         | NVIDIA Shield Android TV Pro S                                                                                         | 89SHIELDTVP2537                   | Oct 2025      | $213              | Primary streaming device, replaces 2022 Shield Pro                        |
| Gaming Console         | Sony PlayStation 5 (CFI-1015A)                                                                                         | CFI1015A45207                     | Dec 2021      | $400              | Disk edition                                                              |
| Gaming Console         | Xbox One                                                                                                               | 096373751904                      | Jun 2017      | $130              | Functional, standard model                                                |
| Gaming Consoles        | Nintendo Switch / NS Lite                                                                                              | XAW10042371238 / XAL007519814     | Apr 2019      | $180              | Standard Switch + NS Lite combo                                           |
| TV                     | Samsung NU6950 65" UHD                                                                                                 | 07ML3CEN700934K                   | Dec 2019      | $300              | 4K UHD smart display                                                      |
| Auralex Isolation Pads | Auralex ProPAD (Pair)                                                                                                  | PROPAD-FR-001                     | Jul 2025      | $85               | Installed under SVS SB-1000 Pro for vibration isolation                   |
| UPS / Surge Protector  | APC Back-UPS 1000                                                                                                      | TBD                               | Pre-owned     | $80               | Battery backup + surge protection; all Family Room AV connected through   |
| Network Switch         | TP-Link TL-SG105 (v6.6)                                                                                                | Y2340C1016269                     | 2024          | $20               | 5-port Gigabit desktop switch; Made in Vietnam                            |

### Yamaha R-N800A — Verified Rear Panel Layout

**Analog I/O:** Line In 1–3, Phono (MM), Line Out, Subwoofer Out (mono RCA)  
**Digital I/O:** 2× Optical, 1× Coaxial  
**Network/Control:** Ethernet (RJ45), USB-A, 12V Trigger Out, AM/FM Antenna  
**Speaker Outputs:** A/B binding posts, bi-wire capable  

**Current Speaker Configuration:**
- Speaker A: Polk ES60 Towers (L/R) — **ACTIVE** (banana clips)
- Speaker B: **Not configured**
- Subwoofer: Independent of zone selection (works with A or B)
- Impedance: A OR B: 4Ω min / A+B: 8Ω min

**Signal Chain (Current Configuration):**
```
Technics SL-1200MK2 (Ortofon Blue) → Pro-Ject Phono Box S2 Ultra
     │
     ├──► RCA Output 1 → Yamaha R-N800A Line In 1 (local playback)
     │
     └──► RCA Output 2 → Rolls MB15b → SVS SoundPath TX → Lanai RX

Samsung NU6950 (Optical 1) → Yamaha R-N800A
Yamaha R-N800A (Sub Out) → SVS SB-1000 Pro
Yamaha R-N800A (Speaker A) → Polk ES60 Towers
Ethernet → QNAP TS-473A (MusicCast / DLNA / AirPlay 2)
```

**1Mii RT5066R2 System Status:**
- **TX + 2× RX purchased** (Jan 16, 2026) — **NOT YET CONNECTED**
- **Planned integration:** Multi-room wireless audio to Studio + Garage
- **Connection method:** TBD (pending signal routing analysis)

---

## 💼 Home Office / Studio

| Device               | Make / Model                                                                                                                | Serial Number          | Purchase Date | Est. Resale (USD) | Notes                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------- | ----------------- | ------------------------------------------------------------ |
| Turntable            | Audio-Technica AT-LP120XUSB                                                                                                 | 243402497              | Jan 2025      | $200              | Direct drive; stock AT95E cartridge (green); AT-VM95SH Shibata on backorder |
| Audio Interface      | [Focusrite Scarlett Solo 4th Gen](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/Processing_Hardware.md)   | S1XJ7HX57AF107         | Feb 2025      | $110              | USB-C main interface                                         |
| Wireless RX          | 1Mii RT5066R2 Wireless Audio Receiver #1                                                                                    | TBD                    | Jan 16, 2026  | $23               | **NOT YET CONNECTED** — Planned for Family Room vinyl streaming via Schiit SYS Input 2 |
| Audio Hub            | M-Audio Air\|HUB                                                                                                            | TBD                    | Apr 2024      | $80               | Backup USB DAC/monitor hub; stored as spare                  |
| Phono Preamp         | Schiit Mani II                                                                                                              | CI182351284            | Jul 2025      | $213              | Confirmed DIP config default; input available                |
| Passive Preamp       | Schiit SYS                                                                                                                  | SYS1902435             | Oct 2025      | $64               | Line controller; Input 1 = Mani II; Input 2 = **available for 1Mii RX #1** |
| Subwoofer            | JBL LSR310S                                                                                                                 | DYA007-34294           | Oct 2025      | $260              | Operational, balanced TRS in/out verified                    |
| Studio Monitors      | Yamaha HS7 (Pair)                                                                                                           | Z719774TS / Z719774TR  | Mar 2023      | $450              | Operational; on Gator Frameworks stands                      |
| Isolation Pads       | Auralex ProPAD 8"×13"                                                                                                       | H9135000000000         | Oct 2025      | $90               | Under HS7s                                                   |
| Monitor Stands       | Gator Frameworks GFW-SPK-SM50                                                                                               | J1385500000000         | Oct 2025      | $100              | Steel stands                                                 |
| Monitors (Display)   | Sansui ES-27X3A (×2)                                                                                                        | ES-27X3A               | Jul 2024      | $160              | Dual 27" FHD, HDMI + Type-C; primary and secondary screens   |
| Digital Piano        | Casio Privia PX-870WE                                                                                                       | 941BDC31K047200ADD     | Jul 2023      | $600              | 88-key hammer action; DC 24V via AD-E24250LW adapter         |
| Guitar Amp           | [Positive Grid Spark 40](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/instrument_specs_v_2025_10_08.md)  | S040C624565            | Apr 2023      | $220              | Smart modeling amp, ToneCloud, Smart Jam                     |
| Headphones           | Audio-Technica ATH-M50x                                                                                                     | ATHM50X19050271        | Jun 2025      | $90               | Closed-back monitoring headphones                            |
| Earbuds              | Beats Fit Pro                                                                                                               | FH8QF1Y4T9             | Feb 2023      | $130              | Noise-canceling true wireless                                |
| Headset              | Logitech H390                                                                                                               | H390SN117245A          | Jan 2022      | $25               | USB wired headset                                            |
| Laptop               | [Dell Precision 7540](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/Dell_Precision_7540_Specs.md)         | 3N1QK93                | Aug 2021      | $850              | Xeon workstation; Samsung 990 PRO SSD + 112GB ECC RAM; **Excellent condition** — internal keyboard needs repair (external KB workaround in use); IP: 192.168.1.75 / Hostname: GDMARCHE / MAC: 4c:1d:96:3f:95:62 / WiFi 5GHz |

### 🔊 Studio Monitoring Chain (Current Configuration)

```
AT-LP120XUSB (AT95E stock) → Schiit Mani II → Schiit SYS (Input 1)
Schiit SYS Input 2 → **Available for 1Mii RX #1** (not yet connected)
Schiit SYS → JBL LSR310S (TRS balanced in)
JBL LSR310S → Yamaha HS7 L/R (TRS balanced out)
```

**Planned Integration:**
- 1Mii RX #1 → Schiit SYS Input 2 (Family Room wireless vinyl feed)

---

## 🏋️ Garage / Gym

| Device         | Make / Model              | Serial Number | Purchase Date | Est. Resale (USD) | Notes                                          |
| -------------- | ------------------------- | ------------- | ------------- | ----------------- | ---------------------------------------------- |
| TV             | Vizio 22" LED             | TBD           | Pre-owned     | $50               | Basic HD display                               |
| Wireless RX    | 1Mii RT5066R2 Receiver #2 | TBD           | Jan 16, 2026  | $23               | **NOT YET CONNECTED** — Planned for wireless Family Room audio integration |
| Smart Speaker  | Amazon Echo (4th Gen)     | A4205FQ13312  | May 2024      | $60               | Relocated from Lanai; Alexa voice control      |

### 🔊 Garage Signal Chain (Current Configuration)

```
Amazon Echo (4th Gen) → Bluetooth / Wi-Fi Playback
```

**Planned Integration:**
- 1Mii RX #2 → Future wireless Family Room audio feed

---

## 🌴 Lanai / Pool

| Device            | Make / Model                                                      | Serial Number | Purchase Date | Est. Resale (USD) | Notes                                                  |
| ----------------- | ----------------------------------------------------------------- | ------------- | ------------- | ----------------- | ------------------------------------------------------ |
| TV                | Samsung UN65U7900FD Crystal UHD 65"                               | TBD           | Dec 2024      | $400              | 4K outdoor display for pool area entertainment         |
| AV System         | Bose 3·2·1 Series II                                              | TBD           | Pre-owned     | $150              | Relocated from Garage; legacy 2.1 home theater system  |
| Karaoke Machine   | Singing Machine ISM9033                                           | TBD           | Dec 2024      | $150              | Portable karaoke with Bluetooth and mic inputs         |
| HDMI Converter    | J-Tech AE4KA HDMI to RCA (PCM) Converter                          | TBD           | Dec 2024      | $40               | Converts HDMI ARC to RCA for Bose 3·2·1 compatibility  |
| HDMI Splitter     | REI UHD-PRO102 4K HDMI Splitter (1 in 2 out)                      | TBD           | Dec 2024      | $35               | Auto downscaling; mirrors Chromecast to TV + Karaoke   |
| Mini Upscaler     | Mini AV to HDMI Upscaler (1080p)                                  | TBD           | Dec 2024      | $20               | Upscales Bose video output back to Samsung HDMI 3      |
| Media Streamer    | Google Chromecast (4K)                                            | TBD           | Pre-owned     | $30               | Primary streaming device                               |
| Wireless RX       | SVS SoundPath Wireless RX                                         | TBD           | Oct 2025      | $100              | Receives Yamaha pre-out via SVS TX (Family Room)       |
| Smart Speaker     | Bose SoundTouch Genius                                            | TBD           | Pre-owned     | $60               | Portable; occasional use                               |

### 🔊 Lanai Signal Chain (per lanai_signal_config.py)

```
[Google Chromecast 4K]
     │
     ▼
[REI UHD-PRO102 HDMI Splitter]
     ├──► Output 1 → [Samsung UN65U7900FD HDMI 1]
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
[Mini AV→HDMI Upscaler]
     │
     └──► [Samsung HDMI 3]

[SVS SoundPath Wireless RX]
     │
     └──► Connected to SVS TX (Family Room, fed by Rolls MB15b)
          Provides wireless Yamaha pre-out audio to Lanai
```

---

## 🛏️ Bedrooms

| Device    | Make / Model             | Serial Number  | Purchase Date | Est. Resale (USD) | Notes                                            |
| --------- | ------------------------ | -------------- | ------------- | ----------------- | ------------------------------------------------ |
| Turntable | Victrola VTA-71 Brighton | S240700587 D   | 2024          | $80               | Entry-level turntable with built-in 2×2W speakers |

### Victrola VTA-71 — Specifications

| Field | Data |
|-------|------|
| Model | VTA-71 |
| Product Line | Brighton |
| HVIN | VTA71B |
| Power Supply | DC 5V ⎓ 1A |
| Power Output | 2×2W (built-in speakers) |
| FCC ID | 2AFHW-VTA72B |
| IC | 9577A-VTA72B |
| Origin | Made in China |
| Location | Son's Bedroom |

---

## 🎸 Instruments & Studio Gear

| Device           | Make / Model                                                                                                               | Serial Number | Purchase Date | Est. Resale (USD) | Notes                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------- | ----------------- | --------------------------------------------------------------- |
| Acoustic Guitar  | Seagull S Series SC-6W                                                                                                     | 02286309      | 2002          | $400              | Handcrafted, solid cedar top; Godin tuners                      |
| Acoustic Guitar  | Ibanez Performance PF5NT1201                                                                                               | SQ00071493    | 2012          | $180              | Natural finish, full dreadnought                                |
| Electric Guitar  | Epiphone Les Paul Standard Pro                                                                                             | 1205201591    | Jul 2015      | $350              | Sunburst finish, upgraded pickups                               |
| Turntable Cart.  | Audio-Technica AT-VM95SH Shibata                                                                                           | TBD           | Jan 19, 2026  | $150              | **BACKORDERED** — 2.7×0.26 mil Shibata; for AT-LP120XUSB       |
| Strings          | D'Addario EJ16-3D Phosphor Bronze 12-53 (3-Pack)                                                                           | N/A           | Jan 2023      | $15               | Standard acoustic set                                           |
| Capo             | Kyser Quick-Change 6-String Capo                                                                                           | TBD           | 2018          | $15               | Guitar accessory                                                |

---

## 🌐 Network Core

| Device           | Make / Model                                                                                              | Serial Number        | Purchase Date | Est. Resale (USD) | Notes                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------- | -------------------- | ------------- | ----------------- | --------------------------------------------------------------------------------------- |
| Modem            | Spectrum EN2251                                                                                           | TBD                  | Leased        | N/A               | DOCSIS 3.1 cable modem (ISP equipment)                                                  |
| Router           | Spectrum SAX2V1R                                                                                          | 001CFF2C8D10         | Leased        | N/A               | Wi-Fi 6E router; default credentials: admin / (MAC last 8 chars lowercase)             |
| Network Switch   | QNAP QSW-1105-5T                                                                                          | Q3DAN48550           | Oct 2024      | $80               | 5-port unmanaged 2.5GbE switch                                                          |
| Network Switch   | TP-Link TL-SG108E v6.0                                                                                    | 2240C1004524         | 2024          | $30               | 8-port Gigabit Easy Smart Managed switch                                               |
| Mesh Router      | Google Nest WiFi Router + 2 Points                                                                       | 18E3C4R0B0414K59     | 2022          | $150              | **STORED** — Backup mesh system (replaced by Spectrum Wi-Fi 6E)                        |

### 🌐 Network Topology

```
[Spectrum EN2251 Modem (DOCSIS 3.1)]
     │
     ▼
[Spectrum SAX2V1R Wi-Fi 6E Router] (192.168.1.1)
     │
     ├──► [QNAP QSW-1105-5T] (2.5GbE Backbone)
     │       ├──► [QNAP TS-473A NAS] (192.168.1.230)
     │       ├──► [Dell Precision 7540 Workstation] (192.168.1.75 / GDMARCHE / MAC: 4c:1d:96:3f:95:62)
     │       ├──► [Yamaha R-N800A Receiver]
     │       ├──► [NVIDIA Shield Pro]
     │       └──► [TP-Link TL-SG108E Switch]
     │                 ├──► [Focusrite Scarlett Solo / DAW PC]
     │                 └──► [Home Studio Subnet Devices]
     │
     ├──► [Samsung NU6950 TV] (Wi-Fi 6)
     ├──► [Amazon Echo devices]
     ├──► [Smart Home IoT] (Hue, Honeywell, etc.)
     └──► [Mobile devices / tablets / phones]
```

---

## 🌡️ Smart Home & Environmental Control

| Device            | Make / Model                         | Serial Number   | Purchase Date | Est. Resale (USD) | Notes                                      |
| ----------------- | ------------------------------------ | --------------- | ------------- | ----------------- | ------------------------------------------ |
| Smart Hub         | Philips Hue Bridge                   | TBD             | 2020          | $40               | Zigbee hub for Hue lighting ecosystem      |
| Thermostat        | Honeywell Home ProSeries              | TBD             | Nov 2024      | $120              | Wi-Fi programmable thermostat              |
| Garage Opener     | LiftMaster MyQ Smart Garage Hub      | 73LM79415       | Dec 2024      | $50               | Wi-Fi garage door controller               |
| Motion Sensors    | THIRDREALITY Zigbee Motion (2-Pack)  | TBD             | Jan 11, 2026  | $50               | Pet-friendly; SmartThings / Hubitat compatible |

---

## 🚪 Garage & Utility Systems

| Device          | Make / Model                           | Serial Number | Purchase Date | Est. Resale (USD) | Notes                                    |
| --------------- | -------------------------------------- | ------------- | ------------- | ----------------- | ---------------------------------------- |
| Garage Opener   | LiftMaster MyQ Smart Garage Hub        | 73LM79415     | Dec 2024      | $50               | Wi-Fi garage door controller             |
| Security        | lockforall Cable Gun Locks (2-Pack)    | TBD           | Jan 11, 2026  | $30               | CA DOJ approved; keyed alike             |
| Door Hardware   | FATLODA Barrel Bolt Latch (2-Pack)     | TBD           | Jan 11, 2026  | $15               | 3" stainless steel sliding locks         |

---

## 🖥️ Family / Reserve Systems

| Device       | Make / Model                      | Serial Number | Purchase Date | Est. Resale (USD) | Notes                                                    |
| ------------ | --------------------------------- | ------------- | ------------- | ----------------- | -------------------------------------------------------- |
| Laptop       | Dell Latitude 5340                | CXP0W94       | Aug 2023      | $600              | i7-1365U, 16GB RAM, 256GB SSD; Windows 11 Pro            |
| Laptop       | MacBook Pro 13" (Mid-2012)        | C02K3H0QDTY3  | 2012          | $200              | Kids' computer; macOS High Sierra                        |
| Docking Hub  | HyperDrive 11-in-1 USB-C Hub      | TBD           | Dec 2024      | $100              | USB-C dock for Latitude 5340                             |

---

## 📦 Stored / Inactive Devices

| Device                  | Make / Model                       | Serial Number        | Purchase Date | Est. Resale (USD) | Notes                                           |
| ----------------------- | ---------------------------------- | -------------------- | ------------- | ----------------- | ----------------------------------------------- |
| Mesh Router (Backup)    | Google Nest WiFi Router + 2 Points | 18E3C4R0B0414K59     | 2022          | $150              | Replaced by Spectrum Wi-Fi 6E; stored as backup |
| Audio Hub (Spare)       | M-Audio Air\|HUB                   | TBD                  | Apr 2024      | $80               | Backup USB DAC/monitor hub                      |
| Broken Laptop           | Dell Latitude E6430                | 7PK8Y12              | 2013          | $0                | Non-functional; board-level repair required     |

| Device           | Condition | Location | Next Action                              |
| ---------------- | --------- | -------- | ---------------------------------------- |
| Dell Latitude E6430 | Non-functional | Stored   | Board-level inspection or parts salvage |

---

## 🔗 Cross-Reference Index

| Component                | Reference Document                                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Yamaha R-N800A           | [Processing Hardware Overview](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/Processing_Hardware.md)            |
| Bose Lifestyle 650       | [Lifestyle 650 Console Summary](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/Lifestyle_650_Console_Summary.md) |
| Dell Precision 7540      | [Dell Precision 7540 Specs](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/Dell_Precision_7540_Specs.md)         |
| Instrument & Studio Gear | [Instrument Specs v2025.10.08](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/instrument_specs_v_2025_10_08.md)  |
| Signal Map               | [Signal Map v2026.04](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/config/audiopheliac_signal_map_v_2026_04.md)     |
| QNAP NAS                 | [QNAP TS-473A Documentation](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/QNAP_TS473A_Specs.md)                |

---

## 🪾 Version History

| Version      | Date           | Summary                                                                                                                                                                                                          |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **v2026.05** | Mar 15, 2026   | **CHANGES:** Added Dell Precision 7540 network record: IP 192.168.1.75 / Hostname GDMARCHE / MAC 4c:1d:96:3f:95:62 / WiFi 5GHz. Corrected condition status — unit is excellent; internal keyboard needs repair (external KB in use). Updated network topology to reflect assigned IP. |
| **v2026.04** | Jan 19, 2026   | **CHANGES:** Confirmed Technics SL-1200MK2 in Family Room (Ortofon Blue). Moved AT-LP120XUSB to Studio (stock AT95E; AT-VM95SH Shibata on backorder, $219). Moved QNAP TS-473A to Family Room. Added Rolls MB15b, 1Mii RT5066R2 TX (Family Room), 1Mii RX #1 (Studio), 1Mii RX #2 (Garage). Moved Bose 3·2·1 to Lanai. Moved Amazon Echo to Garage. Added SVS SoundPath TX/RX routing (Family Room → Lanai). Added REI UHD-PRO102 HDMI splitter, J-Tech AE4KA, Mini AV upscaler to Lanai signal chain. Updated signal chains for all zones. Removed Blue Yeti mic, Rode boom arm, Zoom pedal (fabrications). **PENDING:** 1Mii connection method, AT-VM95SH delivery. |
| v2026.03     | Jan 16, 2026   | Relocated AT-LP120XUSB to Family Room (Ortofon Blue). Updated Casio PX-870WE serial. Added TP-Link TL-SG105 switch, APC Back-UPS 1000, Spectrum router SAX2V1R. Added Victrola VTA-71 to Bedrooms. Validated Seagull SC-6W and Pro-Ject serials. Updated Yamaha R-N800A speaker config (Zone A only). **PENDING:** Technics SL-1200MK2 location. |
| v2026.02     | Jan 16, 2026   | Added: MacBook Pro (2012 Kids' Unit), M-Audio Air\|HUB, JBL LSR310S, Yamaha HS7 verified SNs, Sansui ES-27X3A dual monitors, Dell Latitude 5340, HyperDrive Dock, LiftMaster MyQ Garage Opener. |
| v2026.01     | Jan 15, 2026   | Initial merge of v2025.12 with verified 2026 signal map.                                                                                                                                                         |
| v2025.12     | Dec 22, 2025   | Unified edition, all verified Amazon & Guitar Center purchases (Jan–Nov 2025) integrated.                                                                                                                       |

---

## ⚠️ Open Items Requiring Verification

| Item | Status | Action Required |
|------|--------|-----------------|
| AT-VM95SH Shibata Cartridge | **BACKORDERED** | Guitar Center fulfillment pending |
| Rolls MB15b Serial | TBD | Capture rear or bottom label when accessible |
| 1Mii RT5066R2 TX Serial | TBD | Capture unit label when accessible |
| 1Mii RT5066R2 RX #1 Serial | TBD | Capture unit label when accessible |
| 1Mii RT5066R2 RX #2 Serial | TBD | Capture unit label when accessible |
| 1Mii Connection Method | TBD | Determine Yamaha Line Out routing (direct vs. Rolls passthrough) |
| APC Back-UPS 1000 Serial | TBD | Capture rear label when accessible |
| M-Audio Air\|HUB Serial | TBD | Capture if unit is accessible |

---

✅ **Revision Complete:**  
All intake data merged and verified.  
New multi-room wireless transmission path documented.  
Routing, serials, and categories updated.  

**System's locked, signal's hot. Go make some noise.** 🎛️

---

*The Audiopheliac – Studio Assistant Mode | "Where every cable, waveform, and decibel earns its keep."*
