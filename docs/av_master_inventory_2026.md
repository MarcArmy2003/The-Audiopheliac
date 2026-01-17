<p align="center">
  <img src="https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/media/The_Audiopheliac_Primary_Logo_GPT.jpg" 
       alt="The Audiopheliac Primary Logo" width="300" />
</p>

# AV_Master_Inventory_v2026.03

**The Audiopheliac – Comprehensive AV, Studio & Network Inventory**  
Author & Maintainer: *Gillon "Gill" Marchetti (MarcArmy2003)*  
Version: v2026.03  
Date: January 16, 2026  
Merged from: AV_Master_Inventory_v2026.02.md + verified intake (Jan 16, 2026)

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
| Turntable              | Audio-Technica AT-LP120XUSB                                                                                            | 243402497                         | Jan 2025      | $200              | Direct drive; Ortofon Blue cartridge installed                            |
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

### ⚠️ Pending Verification

| Device                | Status                                                                 |
| --------------------- | ---------------------------------------------------------------------- |
| Technics SL-1200MK2   | **LOCATION TBD** — Previously in Family Room; confirm current location |

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

**Signal Chain:**
```
AT-LP120XUSB (Ortofon Blue) → Pro-Ject Phono Box S2 Ultra → Yamaha R-N800A (Line In 1)
Samsung NU6950 (Optical 1) → Yamaha R-N800A
Yamaha R-N800A (Sub Out) → SVS SB-1000 Pro
Yamaha R-N800A (Speaker A) → Polk ES60 Towers
Ethernet → QNAP TS-473A (MusicCast / DLNA / AirPlay 2)
```

---

## 💼 Home Office / Studio

| Device               | Make / Model                                                                                                                | Serial Number          | Purchase Date | Est. Resale (USD) | Notes                                                        |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------------- | ----------------- | ------------------------------------------------------------ |
| Audio Interface      | [Focusrite Scarlett Solo 4th Gen](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/Processing_Hardware.md)   | S1XJ7HX57AF107         | Feb 2025      | $110              | USB-C main interface                                         |
| Audio Hub            | M-Audio Air\|HUB                                                                                                            | TBD                    | Apr 2024      | $80               | Backup USB DAC/monitor hub; stored as spare                  |
| Phono Preamp         | Schiit Mani II                                                                                                              | CI182351284            | Jul 2025      | $213              | Confirmed DIP config default; input available                |
| Passive Preamp       | Schiit SYS                                                                                                                  | SYS1902435             | Oct 2025      | $64               | Line controller                                              |
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
| Laptop               | [Dell Precision 7540](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/Dell_Precision_7540_Specs.md)         | 3N1QK93                | Aug 2021      | $850              | Xeon workstation; Samsung 990 PRO SSD + 112GB ECC RAM        |
| Dock                 | J5 Docking Station                                                                                                          | J5D092414              | Sep 2023      | $70               | USB-C, Ethernet, HDMI (Monitor 1)                            |
| Laptop               | Dell Latitude 5340 (VA-issued)                                                                                              | TBD                    | Dec 2025      | N/A               | Secondary loaner; HDMI via dock                              |
| Dock                 | HyperDrive 5-Port Dock (Backup)                                                                                             | CV2509-1500135         | Nov 2025      | $55               | Not in use                                                   |
| Accessories          | MusicNomad F-ONE Oil + GrooveWasher G2                                                                                      | N/A                    | Oct 2025      | $63               | Maintenance accessories                                      |

### 💻 Display Configuration

```
Dell Precision 7540 → J5 Dock HDMI → Sansui 27" Monitor #1
Dell Precision 7540 → Rear HDMI → Sansui 27" Monitor #2
```

### 🔊 Studio Signal Chain

```
[Turntable Input Available] → Schiit Mani II → Schiit SYS
Schiit SYS → JBL LSR310S (TRS L/R)
JBL LSR310S → Yamaha HS7 Monitors (TRS L/R)
```

**Note:** AT-LP120XUSB relocated to Family Room. Schiit Mani II phono input currently available for future turntable assignment.

---

## 🏋️ Garage / Gym

| Device        | Make / Model          | Serial Number | Purchase Date      | Est. Resale (USD) | Notes                                    |
| ------------- | --------------------- | ------------- | ------------------ | ----------------- | ---------------------------------------- |
| TV            | Vizio 32" LED         | TBD           | Pending Relocation | N/A               | Small TV moving from storage             |
| Smart Speaker | Amazon Echo (4th Gen) | A4205FQ13312  | May 2024           | $60               | Alexa smart speaker for background audio |

### 🔊 Garage Signal Chain

```
Bose 3·2·1 Series II Console
     ├──► Built-in DVD Source
     ├──► AUX Input (3.5 mm Stereo)
     ▼
Bose 2.1 Speaker Array (Acoustimass Module)
```

**Notes:**  
- Legacy setup, self-contained.  
- No Wi-Fi or Ethernet integration.  
- AUX occasionally fed from phone or portable Bluetooth transmitter.

---

## 🌴 Lanai / Pool

| Device            | Make / Model                        | Serial Number | Purchase Date | Est. Resale (USD) | Notes                                                  |
| ----------------- | ----------------------------------- | ------------- | ------------- | ----------------- | ------------------------------------------------------ |
| TV                | Samsung UN65U7900FD Crystal UHD 65" | TBD           | Dec 2024      | $400              | 4K outdoor display for pool area entertainment         |
| Karaoke Machine   | Singing Machine ISM9033             | TBD           | Dec 2024      | $150              | Portable karaoke with Bluetooth and mic inputs         |
| Smart Speaker     | Amazon Echo (4th Gen)               | TBD           | May 2024      | $60               | Alexa voice control for outdoor audio                  |
| Wireless Receiver | SVS SoundPath Wireless RX           | TBD           | Oct 2025      | $100              | Optional input: Schiit SYS Input 2 for vinyl streaming |

### 🔊 Lanai Signal Chain

```
[Amazon Echo] ← (Wi-Fi / Alexa / Spotify Connect)
     │
     ├──► [Samsung UN65U7900FD TV] (HDMI ARC / Wi-Fi)
     └──► [Singing Machine ISM9033] (Bluetooth, occasional use)

[SVS SoundPath Wireless TX (Family Room)] ───► [SVS SoundPath Wireless RX (Lanai)]
     └──► Optional Input: Schiit SYS Input 2 – Studio Vinyl Streaming
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
| Digital Piano    | [Casio Privia PX-870WE](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/instrument_specs_v_2025_10_08.md)  | 941BDC31K047200ADD | Jul 2023 | $600              | 88-key, hammer action, white finish; USB/MIDI to DAW            |
| Guitar Amp       | [Positive Grid Spark 40](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/instrument_specs_v_2025_10_08.md) | S040C624565   | Apr 2023      | $220              | Modeling amp, Smart Jam                                         |
| Wireless System  | New Bee 2.4G TX/RX                                                                                                         | N/A           | Jun 2025      | $37               | Used exclusively with Spark 40 + Les Paul, purchased via Amazon |
| Guitar Stand     | Hercules GS414B Plus                                                                                                       | N/A           | Jan 2026      | $45               | Single guitar stand; replaced 4-tier multi-stand                |

---

## 🌐 Network Core

| Device           | Model / Description                                                                                  | Serial Number    | Purchase Date | Est. Resale (USD) | Notes                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------- | ---------------- | ------------- | ----------------- | --------------------------------------------------- |
| Modem / Router   | Spectrum Wi-Fi 6E Router (SAX2V1R)                                                                   | S6E239105184     | Jul 2023      | $90               | Core network node (ISP-provided)                    |
| Mesh Extender    | Spectrum Wi-Fi 6E Mesh Node (MAPV1S)                                                                 | SA9E6001FCCHTRP  | Jun 2024      | N/A               | Dual-band repeater                                  |
| Switch           | QNAP QSW-1105-5T                                                                                     | QSW5T23900145    | Jan 2024      | $100              | 2.5GbE backbone                                     |
| Switch           | TP-Link TL-SG105 (v6.6)                                                                              | Y2340C1016269    | 2024          | $20               | 5-port Gigabit; Family Room network stack           |
| NAS              | [QNAP TS-473A](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/Processing_Hardware.md) | Q21AD010872    | Jan 2023      | $750              | 4-bay NAS w/ Plex, DLNA; 32GB RAM                   |
| Workstation      | Dell Precision 7540                                                                                  | 3N1QK93          | Aug 2021      | $850              | Connected via J5 Dock to NAS via switch             |

### Spectrum Wi-Fi 6E Router — Details

| Field | Data |
|-------|------|
| Model | SAX2V1R |
| Serial | S6E239105184 |
| Default SSID | SpectrumSetup-0EAE |
| Default Password | whatmovie661 |
| Setup URL | spectrum.net/getapp |
| Ports | Internet + 3× LAN (Ethernet 1–3) |

**⚠️ Security Note:** Default credentials documented for reference. Recommend changing if still using defaults.

### 🔗 Network Topology

```
[Internet / Spectrum EN2251 Modem]
     │ (Coax)
     ▼
[Spectrum Wi-Fi 6E Router (SAX2V1R)]
     ├──► [QNAP QSW-1105-5T Switch] (2.5GbE backbone)
     │       ├──► [QNAP TS-473A NAS] (IP: 192.168.1.230)
     │       ├──► [Dell Precision 7540 Workstation]
     │       ├──► [Yamaha R-N800A Receiver]
     │       └──► [NVIDIA Shield Pro]
     │
     ├──► [TP-Link TL-SG105] (Family Room 1GbE expansion)
     │       └──► [Local AV devices]
     │
     ├──► [Spectrum MAPV1S Mesh Node]
     ├──► [Samsung NU6950 TV] (Wi-Fi 6)
     ├──► [Amazon Echo Devices]
     ├──► [Bose Lifestyle 650 Console]
     └──► [Smart Home Devices]
```

**NAS UNC Path:** `\\NAS87828E\VALOR_Folder\VALOR_Repository`  
**NAS IP:** `192.168.1.230`

---

## 🌡️ Smart Home & Environmental Control

| Device         | Make / Model                  | Serial Number | Purchase Date | Status  | Notes                                         |
| -------------- | ----------------------------- | ------------- | ------------- | ------- | --------------------------------------------- |
| Thermostat     | Honeywell Home T6 Pro Z-Wave  | T6PROZW-001   | Mar 2024      | Active  | Z-Wave hub integration; programmable schedule |
| Smart Bridge   | Philips Hue Bridge            | PHB-2024-001  | Feb 2024      | Active  | Ethernet connection; controls Hue lighting    |
| Voice Control  | Amazon Echo (4th Gen)         | Various       | May 2024      | Active  | Multiple units: Family Room, Lanai            |

---

## 🚪 Garage & Utility Systems

| Device              | Model / Description                       | Serial Number    | MAC Address    | Install Date  | Status            | Notes                                                                               |
| ------------------- | ----------------------------------------- | ---------------- | -------------- | ------------- | ----------------- | ----------------------------------------------------------------------------------- |
| Garage Door Opener  | LiftMaster myQ Smart Opener (050DCTWF MC) | 0F00 339 FA7     | CC6A104B9686   | Mar 30, 2022  | ⚠️ Pending Reset  | Still linked to prior homeowner account; requires Wi-Fi re-pairing via MyQ app      |
| Specs               | 26W (motor logic), 100W (lamp)            | FCC: HBW1D8169-1 | IC: 2666A-1D8169 |             |                   |                                                                                     |

**Reset Instructions:** Visit [WiFiHelp.LiftMaster.com](https://WiFiHelp.LiftMaster.com) for account transfer procedure.

---

## 🖥️ Family / Reserve Systems

| Device                          | Make / Model              | Serial Number  | Purchase Date | Status             | Notes                                                              |
| ------------------------------- | ------------------------- | -------------- | ------------- | ------------------ | ------------------------------------------------------------------ |
| Kids' Laptop                    | Apple MacBook Pro (A1278) | C17J10PDDTY3   | 2012          | ⚠️ Non-functional  | Liquid damage suspected; Samsung 870 EVO 500GB SSD installed       |

**MacBook Pro (Kids' Workstation) Details:**

| Spec             | Detail                                |
| ---------------- | ------------------------------------- |
| Model            | MacBook Pro (13-inch, Mid-2012)       |
| Model No.        | A1278                                 |
| Serial           | C17J10PDDTY3                          |
| CPU              | Intel Core i5 (2.5 GHz dual-core)     |
| RAM              | 8 GB DDR3                             |
| Storage          | 500 GB Samsung 870 EVO SSD            |
| OS               | macOS Mojave 10.14.6 (last running)   |
| Power            | 16.5 V ⎓ 3.65 A (MagSafe 1)           |
| Condition        | Does not power on                     |
| Next Action      | Board-level inspection or parts salvage |

---

## 🔗 Cross-Reference Index

| Component                | Reference Document                                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Yamaha R-N800A           | [Processing Hardware Overview](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/Processing_Hardware.md)            |
| Bose Lifestyle 650       | [Lifestyle 650 Console Summary](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/Lifestyle_650_Console_Summary.md) |
| Dell Precision 7540      | [Dell Precision 7540 Specs](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/Dell_Precision_7540_Specs.md)         |
| Instrument & Studio Gear | [Instrument Specs v2025.10.08](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/instrument_specs_v_2025_10_08.md)  |
| Signal Map               | [Signal Map v2026.01](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/config/audiopheliac_signal_map_v_2026_01.md)     |
| QNAP NAS                 | [QNAP TS-473A Documentation](https://github.com/MarcArmy2003/The-Audiopheliac/blob/main/docs/QNAP_TS473A_Specs.md)                |

---

## 🪾 Version History

| Version      | Date           | Summary                                                                                                                                                                                                          |
| ------------ | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **v2026.03** | Jan 16, 2026   | **CHANGES:** Relocated AT-LP120XUSB to Family Room (Ortofon Blue cartridge). Updated Casio PX-870WE serial (941BDC31K047200ADD). Added TP-Link TL-SG105 switch (SN: Y2340C1016269). Added APC Back-UPS 1000 to Family Room. Added Spectrum router model (SAX2V1R) and default credentials. Added Victrola VTA-71 Brighton to new Bedrooms section (Son's Room). Validated Seagull SC-6W and Pro-Ject Phono Box S2 Ultra serials. Updated Yamaha R-N800A speaker config (Zone A only, banana clips). **PENDING:** Technics SL-1200MK2 location unconfirmed. |
| v2026.02     | Jan 16, 2026   | Added: MacBook Pro (2012 Kids' Unit), M-Audio Air\|HUB, JBL LSR310S, Yamaha HS7 verified SNs, Sansui ES-27X3A dual monitors, Dell Latitude 5340, HyperDrive Dock, LiftMaster MyQ Garage Opener. |
| v2026.01     | Jan 15, 2026   | Initial merge of v2025.12 with verified 2026 signal map.                                                                                                                                                         |
| v2025.12     | Dec 22, 2025   | Unified edition, all verified Amazon & Guitar Center purchases (Jan–Nov 2025) integrated.                                                                                                                       |

---

## ⚠️ Open Items Requiring Verification

| Item | Status | Action Required |
|------|--------|-----------------|
| Technics SL-1200MK2 (SN: GE4CQ71315) | **Location Unknown** | Confirm if in storage, sold, or relocated |
| APC Back-UPS 1000 Serial | TBD | Capture rear label when accessible |
| M-Audio Air\|HUB Serial | TBD | Capture if unit is accessible |

---

✅ **Revision Complete:**  
All intake data merged and verified.  
Routing, serials, and categories updated.  

**System's locked, signal's hot. Go make some noise.** 🎛️

---

*The Audiopheliac – Studio Assistant Mode | "Where every cable, waveform, and decibel earns its keep."*
