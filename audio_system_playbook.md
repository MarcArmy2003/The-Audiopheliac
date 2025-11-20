## 🎛 The Audiophile Home Studio Playbook: Integrated Setup & Operations Guide

### 🧭 Mission Parameters
Your system is designed for **maximum fidelity, zero cable swapping, and full integration** of both professional and personal computing environments — all while reusing existing hardware and minimizing costs.

#### Objectives:
1. **One Unified Chain:** All devices permanently connected and active.
2. **Dual-Laptop Switching:** Dell Precision & Latitude share a monitor via Anker/OREI/Hyper chain.
3. **Audio Fidelity:** Schiit Mani II + Focusrite Scarlett Solo at the core; M-Audio AirHUB as USB bridge.
4. **Unified Monitoring:** SYS → HS7 → JBL chain for all sources.
5. **Zero Latency:** Direct monitoring via Solo.
6. **Vinyl Chain Purity:** LP120 internal preamp disabled; Mani II used exclusively.
7. **Practical Spending:** Use all owned gear; new items <$50 unless functionally required.
8. **Safe & Grounded:** All powered by single surge strip.

---

## ⚙️ 1. System Overview
### Core Devices
- Dell Precision 7540 (personal)
- Dell Latitude 5340 (work)
- J5Create JCD543 Dock
- Anker HDMI Switch + OREI Splitter + JTech AE4KA
- Focusrite Scarlett Solo (4th Gen)
- M-Audio AirHUB
- Schiit Mani II + SYS
- Audio-Technica AT-LP120XUSB
- Positive Grid Spark 40
- Casio Privia
- Yamaha HS7 + JBL Subwoofer
- Sansui Monitors × 2 + Dell P2419H

---

## 🔌 2. Wiring Order

### 2.1 Core Audio Chain
```
Turntable (LP120X, preamp OFF)
   ↓ RCA
Schiit Mani II (PHONO → LINE)
   ↓ RCA→¼” TRS
Scarlett Solo (rear right LINE input)
   ↓ ¼” TRS balanced
Schiit SYS → Yamaha HS7 → JBL Sub
```

### 2.2 USB & Data Chain
```
Spark 40 (USB-B) → AirHUB USB-A 1
Casio Privia (USB-B) → AirHUB USB-A 2
LP120X (USB-B) → AirHUB USB-A 3
AirHUB (USB-C out) → J5 Dock (USB-C data port)
Scarlett Solo (USB-C) → J5 Dock (USB-A 3.1 port)
J5 Dock (USB-C host) → Dell Precision USB-C port
```

### 2.3 Display Chain
| Monitor | Source | Connection | Purpose |
|----------|---------|-------------|----------|
| Left Sansui | J5 HDMI | HDMI | Main workspace |
| Right Sansui | Dell Precision HDMI (rear) | HDMI | Secondary workspace |
| Dell P2419H | Anker/OREI/Hyper chain | HDMI | Shared utility display (Latitude/iPhone/Precision) |

### 2.4 iPhone Integration
```
iPhone → Apple Multiport → HDMI → OREI UHD-PRO102 Splitter
   ├─ OUT 1 → JTech AE4KA → RCA → Spark AUX IN
   └─ OUT 2 → Anker Switch (IN 2)
```

---

## ⚡ 3. Power & Grounding
1. All devices on one grounded surge protector.
2. Power-on order:
   1. HS7 + JBL
   2. SYS (passive)
   3. Mani II
   4. Scarlett Solo (auto via USB)
   5. AirHUB + peripherals
   6. Dell Precision
   7. Dell Latitude / iPhone

---

## 🖥 4. Software Setup (Dell Precision)
1. Install:
   - Focusrite Control (Solo)
   - Spark ASIO Driver (optional)
   - ASIO4ALL (for multi-device DAW use)
2. Windows Sound Settings:
   - Playback: Focusrite USB Audio (Solo) → Default
   - Recording: Focusrite USB Audio (Solo) → Default
   - Disable exclusive mode & enhancements
   - Sample rate: 24-bit / 48kHz

---

## 🎚 5. Focusrite Control Configuration
| Input | Source | Gain | Mode |
|--------|---------|------|------|
| 1 (front left) | Guitar/Mic | Variable | INST or MIC |
| 2 (rear right) | Mani II / Casio | Line | LINE |

Outputs: Monitor Out → SYS → HS7 → JBL

Enable **Direct Monitoring ON**.  
Mix Inputs 1, 2, and DAW playback.

---

## 🎸 6. Typical Workflows
### Vinyl Listening
LP120 → Mani II → Solo Input 2 → SYS → HS7/JBL

### Vinyl Recording
Arm Input 2 in DAW → Record @ 24-bit/48kHz.

### Guitar Practice
iPhone HDMI → OREI → JTech → Spark AUX → plays JustinGuitar audio.

### Studio Monitoring
SYS = master volume.  
Solo HP Out for silent mode.

### Dual-Laptop Displaying
- Precision drives Sansuis.
- Latitude / iPhone share Dell monitor via Anker/OREI chain.

---

## 🧠 7. Troubleshooting
| Issue | Cause | Fix |
|--------|--------|-----|
| No sound from vinyl | LP120 preamp ON | Switch to PHONO |
| Hum or buzz | Ground loop | All on same surge strip |
| Green screen startup (Shield) | HDMI handshake | Replace HDMI or disable Deep Color |
| Spark AUX silent | OREI not powered | Ensure OREI adapter connected |

---

## 🔊 8. Daily Operation Order
1. Power on (Section 3 order)
2. Open Focusrite Control → verify meters active
3. Confirm Windows default audio = Focusrite Solo
4. Confirm desired input (Vinyl, Spark, Casio)
5. Play / Record / Stream as desired
6. Power down reverse order.

---

## 🖼 System Signal Diagram
![System Diagram](attachment://audio_system_diagram.png)

---

**The Audiophile Home Studio — Final Configuration**  
- **Scarlett Solo** = Master interface  
- **Mani II** = Phono stage  
- **SYS** = Master analog volume  
- **AirHUB** = USB bridge for multiple devices  
- **Spark 40** = Guitar amp + interface  
- **Sansuis + Dell** = Extended displays  
- **All powered & grounded via single surge strip**  

Zero swaps. Zero noise. Maximum fidelity.

