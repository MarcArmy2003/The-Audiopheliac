### To hear the LP120USBX turntable's USB audio (digitized signal via USB-C into your Dell Precision laptop) through the same playback chain that routes your HDMI output (via J-Tech AE4KA) to the Sansui monitor (for video) and the Bose 3•2•1 (via RCA):

## We need to bridge USB digital audio in → Dell system audio → HDMI audio out → AE4KA → Bose while preserving proper monitoring in Audacity

---

🎛️ **System Map**

[LP120XUSB] → USB-B → Dell Precision (USB-C adapter)
│
│ Audacity (recording/monitoring)
▼
Windows Audio Engine (WASAPI)
│
▼
[HDMI Out] → JTECH-AE4KA (ARC OFF / 2 CH PCM / EDID Auto)
│
├──► HDMI Out → Sansui ES-27X3A (video only)
└──► RCA Out → Bose 3•2•1 Cable/Sat Input (audio)

pgsql
Copy code

---

## ⚙️ Step-by-Step Functional Alignment

### 1️⃣ LP120USBX → Dell Precision (Input Stage)

| Setting | Location | Value / Action | Purpose |
|----------|-----------|----------------|----------|
| **Connection** | LP120USBX rear USB-B → Dell USB-C via adapter | Use a USB 2.0-compliant C-hub or direct C-A adapter | Ensure stable data stream |
| **Windows Device Name** | Sound > Recording | *USB Audio CODEC* | Confirms recognition |
| **Sample Rate** | Control Panel > Sound > Recording > USB Audio CODEC > Advanced | 44,100 Hz, 16-bit | Matches Audacity project rate |
| **Listen to this device** | Optional | Off (we’ll use Audacity for monitoring) | Prevents double-path latency |

---

### 2️⃣ Dell Precision Output → JTECH AE4KA (Playback Stage)

| Setting | Location | Value / Action | Purpose |
|----------|-----------|----------------|----------|
| **Playback Device** | Windows Sound > Playback | NVIDIA High Definition Audio or Intel Display Audio | Sends output over HDMI |
| **Default Format** | Properties > Advanced | 48,000 Hz, 24-bit | Matches J-Tech extractor clock |
| **Enhancements** | Playback Properties | Disable all | Clean PCM passthrough |
| **Volume** | Windows / Bose | ~80% on PC, adjust Bose for gain | Prevents clipping |

---

### 3️⃣ JTECH AE4KA Configuration

| Control | State | Explanation |
|----------|--------|-------------|
| **ARC** | OFF | Prevents HDMI sink from stealing audio return |
| **Audio Mode** | 2 CH PCM | Activates internal DAC for RCA output |
| **EDID Switch** | Auto | Maintains Dell → Sansui handshake |
| **Power Source** | Dell USB 5 V | Avoids ground noise |

✅ **Result:** RCA Out sends analog stereo to Bose 3•2•1 while HDMI continues to Sansui monitor.

---

### 4️⃣ Sansui Monitor Settings

| Setting | Value | Purpose |
|----------|--------|----------|
| **Input Source** | HDMI 1 | Video only; no internal speakers |
| **HDR** | Off | Prevents signal re-mapping |
| **Color Range** | RGB Full (0–255) | Ensures proper PC tone mapping |
| **Auto Standby** | Off | Avoids sleep during sessions |

---

### 5️⃣ Audacity Setup (Monitoring & Recording)

| Setting | Location | Value / Action | Purpose |
|----------|-----------|----------------|----------|
| **Host** | Audacity Preferences | Windows WASAPI | Modern low-latency driver |
| **Recording Device** | Device Toolbar | USB Audio CODEC (Mono/Stereo) | Selects LP120USBX |
| **Playback Device** | Device Toolbar | NVIDIA/Intel HD Audio (HDMI) | Routes monitoring audio through J-Tech |
| **Project Rate** | Bottom-left corner | 44,100 Hz | Matches LP120USBX input |
| **Transport → Software Playthrough** | Menu | ✅ Enabled | Lets you hear what’s being recorded |
| **Levels** | Mixer Toolbar | Adjust input gain | Keep peaks ≈ -6 dBFS to prevent clipping |

🟢 **When you press Record**, Audacity captures from the turntable and simultaneously plays back to your HDMI output → J-Tech → Bose.  
This achieves live monitoring with negligible latency (~60 ms total).

---

### 6️⃣ Verify Signal Flow

| Test | Expected Result |
|-------|-----------------|
| Start playback on LP | VU meters in Audacity move; sound on Bose |
| Mute Audacity playback | Bose audio stops |
| Toggle J-Tech ARC ON | HDMI audio disappears → revert OFF |
| Check Windows Playback | Green activity bar on NVIDIA Audio while recording |

---

🎧 **Final Calibration Overview**

| Component | Key Setting | Verified |
|------------|-------------|-----------|
| LP120USBX | 44.1 kHz / 16-bit USB Audio | ✅ |
| Dell Precision | HDMI Audio @ 48 kHz | ✅ |
| J-Tech AE4KA | 2 CH PCM, ARC OFF | ✅ |
| Sansui ES-27X3A | HDMI 1, HDR Off | ✅ |
| Bose 3•2•1 | RCA Cable/Sat Input | ✅ |
| Audacity | WASAPI, Playthrough On, Rate 44.1 kHz | ✅ |

---

## ✅ Final Result

You can **record and listen simultaneously in Audacity**.

The signal path **digitizes via USB**, **monitors via HDMI → J-Tech**, and **renders analog sound via RCA → Bose**.

Both Sansui and Bose remain fully active with **zero ARC or EDID conflict**.
