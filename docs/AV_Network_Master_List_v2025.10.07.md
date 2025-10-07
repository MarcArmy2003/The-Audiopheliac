---
title: "Master AV & Network Devices Inventory"
version: "2025.10.07"
author: "Gillon Marche | The Audiopheliac"
last_updated: "2025-10-07"
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
  * Connected to: Schiit Mani II → Yamaha R-N800A → Polk ES60 towers + SVS SB-1000 Pro sub  
  * Cartridge: **Ortofon Concorde Blue**  
  * *Optimization Note:* Vintage DJ deck, pristine condition, extremely stable and musical. Main reference rig.

* **Audio-Technica AT-LP120XUSB (Bronze Edition)**
  * Location: Home Office  
  * Cartridge: Audio-Technica Gold/Red (Gold currently mounted)  
  * Connected to: ART DJPRE II → Bose 3-2-1 System  
  * Accessories: Pro-Ject Cork-It High-Quality Platter Mat

* **Victrola ATV-57 Integrated Turntable**
  * Location: Cameron’s Room  
  * Integrated stereo speakers with Bluetooth input (receive only)  
  * *Optimization Note:* Standalone playback unit, independent from main system signal flow.

---

### Phono Preamps

* **Schiit Mani II** (Family Room)  
* **ART DJPRE II** (Home Office)  

---

### Amplifiers & Monitoring

* **Yamaha R-N800A Network Receiver**  
  * Reserved IP: `192.168.1.192`  
  * MAC: `54:b7:bd:9f:ac:19`  
  * Pre-Out connected to SVS SoundPath Wireless Pro Transmitter  
  * Hardwired to SVS SB-1000 Pro sub  
  * *Connection Note:* Acts as a wireless broadcast source to the Bose 3-2-1 System and Lanai zones via SVS SoundPath Pro Transmitter.
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

* **Seagull S Series SC-6W Acoustic Guitar**  
* **Ibanez Performance PF5NT1201 Acoustic Guitar** – Serial: `SQ00071493`  
* **Casio Privia PX-870WE Digital Piano (White)** – Built-in Speakers, USB/MIDI Output  
* **Gibson Epiphone Les Paul Standard Pro – Sunburst** – Serial: `1205201591`

---

### Accessories

* **SVS SoundPath Wireless Audio Adapter (Pro)**  
  * **Transmitter SN:** SPWT12240016 — connected to Yamaha R-N800A Pre-Out  
  * **Receiver SN:** SPWR12240016 — connected to Bose 3-2-1 TV Input (Home Office)  
  * *Optimization Note:* Enables whole-home analog audio streaming from any Yamaha source (Shield, PS5, PC, etc.) to remote zones.

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
* **TP-Link Switches:** TL-SG105 / TL-SG108 / TL-SG116

---

### Routers & Modems

* **Spectrum Router (WiFi 6E – Arcadyan)**  
  * Reserved IP: `192.168.1.192`  
  * Extender Pods: Bedroom + Laundry Room  
* **Google Nest Mesh WiFi System**  
  * Main Point: Office  
  * Secondary Point: Garage  
  * Linked via QNAP QSW-1105-5T Unmanaged Switch  
  * *Optimization Note:* Provides seamless roaming and low-latency handoff for streaming devices.
* **Cisco Valet Plus** (Unused)  
* **Spectrum Modem**  

---

### Core Devices

* **PC – GDMARCHE (Primary Workstation)** – IP: `192.168.1.75`  
* **Work Laptop – VA (373-LT-42683)** – IP: `192.168.1.153`

---

## 💻 WORKSTATION

* **Dell Precision 7540 (GDMARCHE)**  
  * CPU: Intel Xeon E-2286M @ 2.40GHz  
  * RAM: 112 GB DDR4 ECC  
  * GPU: NVIDIA Quadro RTX + Intel UHD P630  
  * Storage: 1TB Samsung NVMe SSD  
  * BIOS Rev: 1.13.1  
  * Service Tag: `14XB9Y2`  
  * *Optimization Note:* 112 GB ECC RAM confirmed. Future GPU upgrade candidate.

---

## 🌐 SMART DEVICES & IOT

* **ADT Qolsys IQ Panel** – IP: `192.168.1.78`  
* **Google Nest Cameras** (Lanai, Pool Entry, Hallway) – IPs: `192.168.1.82`, `192.168.1.185`  
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

* **Whole-Home Audio:** Yamaha R-N800A broadcasts pre-out signal via SVS SoundPath Pro → Bose 3-2-1 → Lanai zone.  
* **Office Vinyl Chain:** Now direct from AT-LP120XUSB → ART DJPRE II → Bose 3-2-1 for local playback.  
* **SoundTouch I & II:** Reserve IPs for tracking and control consistency.  
* **Nest Cameras:** Reconcile static IPs vs Spectrum dynamic list.  
* **NAS:** Stable 32 GB ECC config, expandable to 64 GB.  
* **Precision 7540:** Confirmed 112 GB ECC RAM.

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
