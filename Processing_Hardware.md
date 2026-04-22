## Workstation GPU

**Component:** NVIDIA Quadro T2000  
**Installed In:** Dell Precision 7540 (internal PCI Express x16 Gen 3 slot)  
**Driver Version:** 581.80 (DCH) | File Build: 32.0.15.8180  
**DirectX Runtime:** 12.0  | Feature Level: 12_1  
**CUDA Cores:** 1024  | CUDA Version: 13.0.97  
**Graphics Boost Clock:** 1785 MHz  
**Memory:** 4 GB GDDR5 (128-bit bus @ 8 Gbps ≈ 128 GB/s bandwidth)  
**Shared System Memory:** ≈ 57 GB  
**Video BIOS:** 90.17.1A.00.A3  
**Bus Interface:** PCI Express x16 Gen 3  
**PhysX Version:** 09.23.1019  
**Driver Components:** NVIDIA Display Server, 3D Settings Server, CUDA, PhysX, Licensing, Video Server  
**Total Available Graphics Memory:** ≈ 61 GB  
**Dedicated Video Memory:** 4 GB GDDR5  
**IRQ:** Not used  | **Device ID:** 10DE 1FB8 09261028  | **Part Number:** 4905 0010  

**Primary Roles:**
- Hardware-accelerated rendering for Ableton Live UI, OBS composition, and MusicCast visuals  
- NVENC/NVDEC encoding for streaming and video processing  
- CUDA compute support for GPU-accelerated plugins (Ozone 11, GPU Audio, Resolve AI tools)  
- Offload of machine-learning and visualization tasks from CPU  
- UI and graphics acceleration for TIDAL and Windows 11 Desktop Environment  

**Integration Notes:**
- NVIDIA Studio Driver recommended for production stability  
- Hardware-accelerated GPU scheduling enabled (Windows Settings → System → Display → Graphics → Default)  
- Power Management Mode set to *Prefer Maximum Performance* (NVIDIA Control Panel)  
- HDMI/DisplayPort audio outputs disabled to avoid driver conflicts with Focusrite ASIO  
- GPU actively handles video decode/encode tasks to free CPU for real-time audio processing
