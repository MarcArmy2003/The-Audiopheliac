---
title: "Device Network & AV Topology"
version: "2025.10.10"
author: "Gillon Marche | The Audiopheliac"
last_updated: "2025-10-10"
description: "Functional layout of The Audiopheliac's interconnected AV, gaming, and network ecosystem, including signal routing and topology maps."
status: "Active"
---

# Device Network & AV Topology

---

## 🏢 Office

### Vinyl Signal Chain
🎵 **Audio-Technica AT-LP120XUSB (Bronze Edition)**  
⬇️ (Phono Out)  
🎚️ **Schiit Mani II** – phono preamp  
➡️ **Bose 3-2-1 Series II (AUX RCA In)**  

🎛️ *Note:* Replaced ART DJPRE II for improved noise floor and RIAA accuracy.  
*Tripp Lite USB 2.0 Type-A to Type-B (15-ft, U022-015)* connects either:  
- 🔌 **AT-LP120XUSB** → **Dell Precision (GDMARCHE)** (for digitization/production)  
- 🔌 **Spark 40 Amp** → **Dell Precision** (for tone editing or recording)  

### Wireless Audio Reception
📡 **SVS SoundPath Pro Receiver**  
⬇️ Connected to **Bose 3-2-1 System (TV Input)**  
⬇️ Receives broadcast audio from **Yamaha R-N800A Pre-Out** in the Family Room.

### Other Equipment
- 🎸 **Positive Grid Spark 40** – guitar amp (USB/BT interface with Dell)  
- 💻 **Dell Precision (GDMARCHE)** – primary workstation  
- 💼 **VA Work Laptop** – connects primarily via **Google Nest Mesh Wi-Fi**

---

## 🎬 Family Room

### Digital Hub (HDMI Paths)
🎮 **PlayStation 5 (CFI-1015A)**  
🎮 **Xbox One**  
🎮 **Nintendo Switch**  
🖥️ **NVIDIA Shield Pro (Primary Streaming Source)**  
🖥️ **QNAP TS-473A (HDMI Out)**  
⬇️ (All HDMI Inputs)  
🎛️ **Bose Lifestyle 650 (HDMI Hub)**  
➡️ (HDMI Out) → 📺 **Samsung 65" UHD TV (NU6950)**

### Hybrid Audio Path
📺 **Samsung TV (Optical Out)**  
➡️ (Digital Optical) → 🎚️ **Yamaha R-N800A Network Receiver**  
├──➡️ 🔊 **Polk ES60 Towers**  
└──➡️ 🔊 **SVS SB-1000 Pro Subwoofer**

### Broadcast & Whole-Home Audio Path
🎚️ **Yamaha R-N800A Pre-Out**  
➡️ 📡 **SVS SoundPath Pro Transmitter**  
📡 **SVS SoundPath Pro Receiver** → **Bose 3-2-1 System (Office)**  
⬇️ Further extended to **Lanai zone** via **Bluetooth / Chromecast**

### Vinyl Chain (Family Room)
🎵 **Technics SL-1200MK2**  
⬇️ (RCA Out)  
🎚️ **Pro-Ject Phono Box S2 Ultra** → **Yamaha R-N800A Line In**  
➡️ **Polk ES60 Towers / SVS SB-1000 Pro Subwoofer**
⬇️ Can be further extended to Bose SoundLink Revolve+ II (Portable Bluetooth) and Shield NVIDIA Shield Pro Bluetooth.

---

## 🌴 Lanai

### Streaming Setup
📡 **Chromecast (Wireless Cast)** → 📺 **Vizio Smart TV**  
📡 **Amazon Echo (Lanai)** – optional streaming via Bluetooth or voice command  

*Receives broadcast audio from Yamaha via Chromecast or Bluetooth depending on mode.*

---

## 🌴 Garage

### Streaming Setup
📡 **Chromecast (Wireless Cast)** → 📺 **Google Nest wifi node**  
📡 **Bose SoundLink Revolve+ II** – optional streaming via Bluetooth

*Bose 321 Series II will be repurposed as the garage-gym system with Victrola Brighton.*

---

## 🌐 Networking Backbone

### ISP & Routing
🌐 **Spectrum Modem** → 📡 **Spectrum Router (DHCP / Reserved IPs)**  
➡️ Primary LAN backbone for QNAP NAS, Yamaha, Shield, and gaming systems.

### Mesh & Extenders
📡 **Google Nest Mesh Router (Office Main Point)**  
└── 🔘 Mesh Nodes → **Garage + Bedroom**  
📡 **Spectrum Wi-Fi Extenders** → **Laundry Room + Kitchen**

*The Nest Mesh handles office, work laptop, and IoT traffic; Spectrum router serves AV and core devices.*

### NAS
🗄️ **QNAP TS-473A NAS**  
➡️ Connected via **Ethernet** to Spectrum Router  
❌ Not accessible through Google Nest Mesh directly (isolated subnet for performance).

---

### Notes
- **DJ PRE LE** remains *unassigned* (likely future garage-gym zone use).  
- **Cable Audit:** All USB connections meet certified spec (USB 2.0 High-Speed).  
- **Next step:** confirm Pro-Ject firmware version upon delivery and update `AV_Network_Master_List` when operational.
