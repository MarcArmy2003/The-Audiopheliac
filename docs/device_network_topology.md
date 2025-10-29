---
title: "Device Network & AV Topology"
version: "2025.10.28"
author: "Gillon Marche | The Audiopheliac"
last_updated: "2025-10-28"
description: "Comprehensive topology mapping of The Audiopheliac's AV and network ecosystem with synchronized serials and IPs."
status: "Active"
---

# Device Network & AV Topology (2025.10.28)

## 🏢 Office

### Vinyl & Monitoring Chain
🎵 **Audio-Technica AT-LP120XUSB (Bronze Edition)** – Serial: `243402497`  
⬇️ (Phono Out)  
🎚️ **Schiit Mani II** – Serial: `CI182351284`  
⬇️  
🎚️ **Schiit SYS Passive Preamp** – Serial: `SYS1902435`  
⬇️  
🎧 **Focusrite Scarlett Solo (4th Gen)** – Serial: `S1XJ7HX57AF107`  
⬇️  
🎛️ **JBL LSR310S Subwoofer** – Serial: `LSR310S-2037-18572`  
⬇️  
🔊 **Yamaha HS7 Monitors (Pair)** – Serials: `HS7L-YN24011982`, `HS7R-YN24011983`  

🎸 **Positive Grid Spark 40** – Serial: `S040C624565`  
🎹 **Casio Privia PX-870WE** – Serial: `123A9876P870`  
🎧 **Audio-Technica ATH-M50x** – Serial: `ATHM50X19050271`  
🎧 **Beats Fit Pro** – Serial: `FH8QF1Y4T9`  
🎧 **Logitech H390** – Serial: `H390SN117245A`

🖥️ **Dell Precision 7540 Workstation** – Serial: `3N1QK93`  
💼 **VA Dell Laptop** – Serial: `TBD`  
🧩 **J5 Docking Station** – Serial: `J5D092414`  

---

## 🎬 Family Room

🎚️ **Yamaha R-N800A Network Receiver** – Serial: `YN8A23090154` (192.168.1.192 | MAC: 54:b7:bd:9f:ac:19)  
🎵 **Technics SL-1200MK2** – Serial: `GE4CQ71315`  
🎛️ **Pro-Ject Phono Box S2 Ultra** – Serial: `25A001611`  
🔊 **Polk ES60 Towers** – Serials: `ES60L-PO2020004`, `ES60R-PO2020005`  
🔊 **SVS SB-1000 Pro Subwoofer** – Serial: `SVS-PRO-002151`  
📡 **SVS SoundPath TX (Transmitter)** – Serial: `SVS-TX-000311`  
📡 **SVS SoundPath RX (Receiver)** – Serial: `SVS-BTRX-000312`  

🎮 HDMI Chain:
```
QNAP TS-473A (Q22I3C02153)
NVIDIA Shield Pro (47A2H5P00012)
Xbox One (096373751904)
PlayStation 5 (CFI1015A45207)
Nintendo Switch (XAW10042371238)
  ↓
Bose Lifestyle 650 (078932HLF650A1)
  ↓
Samsung 65" UHD TV (07ML3CEN700934K)
```

🌐 Network Backbone:
```
Spectrum Wi-Fi 6E Router (S6E239105184)
  ↓
Google Nest Mesh (GNM1031845)
  ↓
5 Gb Ethernet Switch (SNET5G0821912)
  ↓
Yamaha R-N800A / QNAP NAS / Dell Precision / Scarlett Solo (via USB)
```

---

## 🏋️ Garage-Gym
🎧 **Bose 3·2·1 Series II** – Serial: `321SII200974A`  
🎵 **Input:** iPhone 16 → USB-C Dongle → 3.5mm TRS → RCA AUX → Bose 3·2·1  
*Source:* Spotify / Plex FLAC  
*Performance:* Balanced stereo with modest bass rolloff.

---

## 🌴 Lanai / Pool
🔊 **Bose SoundTouch Genius** – Serial: `BSTG210785`  
📡 **SVS SoundPath Bluetooth Receiver** – Serial: `SVS-BTRX-000312`  
🎙️ **Amazon Echo** – Serial: `ALEXA-LP2084719`  
🎚️ **Signal Path:** Yamaha R-N800A Pre-Out → SVS TX (`SVS-TX-000311`) → SVS RX (`SVS-BTRX-000312`) → Bose SoundTouch Genius

---

## 🧠 Network Overview
| Device | Serial | IP / MAC | Location |
|--------|---------|-----------|-----------|
| QNAP TS-473A | Q22I3C02153 | 192.168.1.230 | Family Room |
| Yamaha R-N800A | YN8A23090154 | 192.168.1.192 / 54:b7:bd:9f:ac:19 | Family Room |
| Spectrum Wi-Fi 6E | S6E239105184 | 192.168.1.1 | Family Room |
| Google Nest Mesh | GNM1031845 | DHCP | Family Room |
| 5 Gb Switch | SNET5G0821912 | N/A | Family Room |
| Dell Precision 7540 | 3N1QK93 | 192.168.1.122 | Office |
| Focusrite Scarlett Solo | S1XJ7HX57AF107 | USB Direct | Office |
| SVS TX | SVS-TX-000311 | Analog TX | Family Room |
| SVS RX | SVS-BTRX-000312 | Analog RX | Office / Lanai |
| Bose Lifestyle 650 | 078932HLF650A1 | HDMI Hub | Family Room |

---

### 🧾 Version History
| Version | Date | Notes |
|----------|------|-------|
| 2025.10.26 | Baseline | Initial AV topology mapping |
| 2025.10.28 | Synced Revision | Full serial/IP synchronization with Master Inventory |

---

**Repository:** [The Audiopheliac – GitHub Main](https://github.com/MarcArmy2003/The-Audiopheliac)  
**Maintainer:** Gillon Marche | *The Audiopheliac*

