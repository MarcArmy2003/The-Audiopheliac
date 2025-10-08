---
title: "Master AV & Network Devices Inventory"
version: "2025.10.08"
author: "Gillon Marche | The Audiopheliac"
last_updated: "2025-10-08"
repo_link: "https://github.com/MarcArmy2003/The-Audiopheliac"
description: "Full documentation of The Audiopheliac’s AV, Gaming, and Network ecosystem with optimization notes and signal flow schematics."
status: "Active"
---

# 🎧 Master AV & Network Devices Inventory
**The Audiopheliac – Complete AV, Gaming, and Network Inventory**  
**Owner Device ID:** GDMARCHE  
**Last Updated:** October 2025  

---

## 🎛️ AUDIO COMPONENTS

### Turntables

* **Technics SL-1200MK2**
  * Location: Family Room  
  * Serial: `GE4CQ71315`  
  * Power: 120V, 60Hz, 14W  
  * Connected to: **Pro-Ject Phono Box S2 Ultra → Yamaha R-N800A → Polk ES60 towers + SVS SB-1000 Pro sub**  
  * Cartridge: **Ortofon Concorde Blue**  
  * *Optimization Note:* Vintage DJ deck, pristine condition, extremely stable and musical. Main reference rig.

* **Audio-Technica AT-LP120XUSB (Bronze Edition)**
  * Location: Home Office  
  * Cartridge: Audio-Technica Gold/Red (Red currently mounted)  
  * Connected to: **Schiit Mani II → Bose 3-2-1 System**  
  * Accessories: Pro-Ject Cork-It High-Quality Platter Mat

* **Victrola ATV-57 Integrated Turntable**
  * Location: Cameron’s Room  
  * Integrated stereo speakers with Bluetooth input (receive only)  
  * *Optimization Note:* Standalone playback unit, independent from main system signal flow.

---

### Phono Preamps

* **Pro-Ject Phono Box S2 Ultra (Silver)** (Family Room)  
  * *Status:* En route (expected Friday)  
  * *Connection:* Technics SL-1200MK2 → Pro-Ject → Yamaha R-N800A  

* **Schiit Mani II** (Home Office)  
  * *Connection:* AT-LP120XUSB → Schiit → Bose 3-2-1  

---

### Amplifiers & Monitoring

* **Yamaha R-N800A Network Receiver**  
  * Reserved IP: `192.168.1.192`  
  * MAC: `54:b7:bd:9f:ac:19`  
  * Pre-Out → SVS SoundPath Wireless Pro Transmitter  
  * Hardwired to SVS SB-1000 Pro sub  
  * *Connection Note:* Acts as wireless broadcast source to Bose 3-2-1 System and Lanai zones.

* **Positive Grid Spark 40** (Guitar Amp)  
* **Audio-Technica ATH-M50x Headphones**  
* **Beats Fit Pro**  
* **Logitech H390 Wired Headset**  

---

### Speakers

* **Polk Signature Elite ES60** (Towers – Family Room)  
* **Bose Lifestyle 650 Console** – Reserved IP: `192.168.1.102`  
* **Bose 3-2-1 Series II** (Home Office) – Connected via SVS SoundPath Wireless Pro Receiver  
* **Bose SoundLink Revolve+ II** (Portable Bluetooth)

---

### Subwoofers

* **SVS SB-1000 Pro** (Family Room – Hardwired)  
* **Bose Bass Module 700** (Bluetooth – Paired with Lifestyle 650)

---

### Instruments

* **Seagull S Series SC-6W Acoustic Guitar (2002 La Patrie QC)** - Serial: `02286309`
* **Ibanez Performance PF5NT1201 Acoustic Guitar** – Serial: `SQ00071493`  
* **Casio Privia PX-870WE Digital Piano (White)** – Built-in Speakers, USB/MIDI Output; Serial: 
* **Gibson Epiphone Les Paul Standard Pro – Sunburst** – Serial: `1205201591`  

---

### Accessories

* **SVS SoundPath Wireless Audio Adapter (Pro)**  
  * **Transmitter SN:** SPWT12240016 — connected to Yamaha R-N800A Pre-Out  
  * **Receiver SN:** SPWR12240016 — connected to Bose 3-2-1 TV Input (Home Office)  
  * *Optimization Note:* Enables whole-home analog audio streaming from Yamaha to remote zones.

* **New Bee 2.4G Wireless Guitar System**  

---

## 📺 VISUAL / DISPLAY SETUP

* **Samsung NU6950 65" UHD Smart TV** – IP: `192.168.1.121`  
* **Vizio Smart TV** (Bedroom) – IP: `192.168.1.154`  
* **Sansui HD Monitors ×2**  
* **Office HD Monitors ×2**  

---

## 🎮 GAMING SYSTEMS

* **Sony PlayStation 5 (CFI-1015A)** – IP: `192.168.1.103`  
* **Xbox (variant TBD)**  
* **Nintendo Switch (Standard)**  
* **Nintendo Switch Lite**  

---

## 📡 NETWORKING & STORAGE

### NAS & Switches

* **QNAP TS-473A NAS**  
  * Reserved IP: `192.168.1.230`  
  * MAC: `24:5e:be:87:82:8e`  
  * Drives: 2× WD Red Plus 10TB NAS HDD  
  * Memory: 32 GB DDR4 ECC (Expandable to 64 GB)  
  * *Optimization Note:* Excellent for Plex, backups, and LAN caching.

* **QNAP QSW-1105-5T** (2.5GbE Unmanaged Switch)  
* **TP-Link 5Gb Switch** – LAN aggregation hub for Google Nest  

---

### Routers & Modems

* **Spectrum Router (SAX2V1R – WiFi 6E)**  
  * IP: `192.168.1.1`  
  * Extenders: Bedroom + Laundry  
  * *SSID:* “FBI Surveillance”  

* **Spectrum Modem (EN2251 – DOCSIS 3.1)**  
  * Serial: `B522251F0152`  
  * Status: Active – Bridge disabled  

* **Google Nest Mesh WiFi System**  
  * Main Point (Office) – IP: `192.168.1.239` / MAC: `1c:53:f9:26:e2:fd`  
  * Secondary Point (Garage) – IP: `192.168.1.174` / MAC: `b0:e4:d5:3a:78:fd`  
  * Extension Point – IP: `192.168.1.90` / MAC: `b8:7b:d4:cf:ee:7b`  
  * *LAN Output → TP-Link 5Gb Switch*  
  * *DNS:* Cloudflare (1.1.1.1 / 1.0.0.1)  

* **Network Flow**  
```
[Spectrum Modem EN2251]  
   ↓  
[Spectrum Router SAX2V1R]  
   │
   ├─→ Google Nest Mesh (WAN Port)
   │        │
   │        └─→ LAN → TP-Link 5Gb Switch → Wired Clients
   │
   └─→ Spectrum Extenders (Bedroom + Laundry)
```

---

### Reserved IP Assignments
(Imported from Reserved_IPs.txt)

| Device | Reserved IP | Notes |
|--------|--------------|-------|
| Yamaha R-N800A | 192.168.1.192 | Primary receiver |
| QNAP NAS | 192.168.1.230 | Static storage server |
| Dell Precision 7540 | 192.168.1.75 | Workstation (GDMARCHE) |
| PlayStation 5 | 192.168.1.103 | Gaming console |
| Bose Lifestyle 650 | 192.168.1.102 | Main theater system |
| Samsung TV | 192.168.1.121 | Family Room display |
| Vizio TV | 192.168.1.154 | Bedroom |
| Google Nest Router | 192.168.1.239 | Primary mesh point |
| Nest Node (Garage) | 192.168.1.174 | Secondary node |
| Nest Node (Ext.) | 192.168.1.90 | Extended coverage |
| Amazon Echo (Lanai) | 192.168.1.240 | Smart speaker |
| ADT Qolsys Panel | 192.168.1.78 | Security hub |
| Philips Hue Bridge | 192.168.1.165 | Lighting control |
| Shield Pro | 192.168.1.250 | Streaming hub |
| MyQ Garage Door | Dynamic | Unconfigured |
| Honeywell Thermostat | Dynamic | Unconfigured |

---

## 💻 WORKSTATION

* **Dell Precision 7540 (GDMARCHE)**  
  * CPU: Intel Xeon E-2286M @ 2.40GHz  
  * RAM: 112 GB DDR4 ECC  
  * GPU: NVIDIA Quadro RTX + Intel UHD P630  
  * Storage: 1TB Samsung NVMe SSD + **Samsung 990 PRO 2TB NVMe (Incoming)**  
  * BIOS Rev: 1.13.1  
  * Service Tag: `14XB9Y2`  
  * *Optimization Note:* New SSD upgrade pending.  

---

## 🌐 SMART DEVICES & IOT

* **ADT Qolsys IQ Panel** – IP: `192.168.1.78`  
* **Google Nest Cameras** – Lanai: `192.168.1.82`, Pool Entry: `192.168.1.185`, Hallway: dynamic  
* **Google Nest Doorbell (Battery)** – IP: `192.168.1.69`  
* **Amazon Ring Spotlight Cam Pro (Lanai)** – IP: `192.168.1.108`  
* **Philips Hue Bridge** – IP: `192.168.1.165`  
* **WiZ Light** – IP: `192.168.1.139`  
* **MyQ Liftmaster Garage Door Opener** – S/N: `GW0F00339FA7`, Status: Unconfigured  
* **Honeywell Home Proseries Thermostat** – Status: Unconfigured  

---

### Smart Speakers & Streaming

* **Amazon Echo (Lanai)** – IP: `192.168.1.240`  
* **Google Chromecast** – IP: `192.168.1.82`  

---

## ⚡ OPTIMIZATION SUMMARY

* **Whole-Home Audio:** Yamaha → SVS SoundPath → Bose 3-2-1 → Lanai zone.  
* **Office Vinyl Chain:** AT-LP120XUSB → Schiit Mani II → Bose 3-2-1.  
* **Google Mesh:** LAN backhaul added to switch for Google Home stability.  
* **Cloudflare DNS:** Verified active on Nest Mesh.  
* **Spectrum Router:** Maintains SSID “FBI Surveillance” with extenders active.  
* **Dell Precision:** Upgraded storage pending Samsung 990 PRO installation.  

---

## 🎼 SIGNAL FLOW DIAGRAMS

### Whole-Home Audio Flow (Family Room → Office → Lanai)
```mermaid
flowchart LR
    A[NVIDIA Shield Pro] --> B[Yamaha R-N800A]
    B --> C[Polk ES60 Towers]
    B --> D[SVS SB-1000 Pro]
    B --> E[SVS SoundPath Pro Transmitter]
    E --> F[SVS SoundPath Pro Receiver]
    F --> G[Bose 3-2-1 System]
    G --> H[Lanai / Chromecast / Bluetooth Zone]
```
