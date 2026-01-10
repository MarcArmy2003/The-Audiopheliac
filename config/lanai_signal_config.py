# Fix encoding issue by replacing unsupported unicode characters and regenerating the PDF

from fpdf import FPDF

pdf = FPDF()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.add_page()
pdf.set_font("Arial", size=12)

title = "LANAI ENTERTAINMENT SYSTEM - MASTER CONNECTION GUIDE"
pdf.cell(200, 10, txt=title, ln=True, align="C")
pdf.ln(10)

content_fixed = """
Version: 2026.01.10
Designed for: Gill Marchetti (MarcArmy2003)
Prepared by: The Audiopheliac - Expert Signal Engineer

------------------------------------------------------------
EQUIPMENT LIST
------------------------------------------------------------
Primary Devices
- Samsung 65in UHD TV (Model UN65U7900FD)
- Bose 3.2.1 Series II System
- Singing Machine Karaoke System
- Google Chromecast
- J-Tech AE4KA HDMI to RCA (PCM) Converter
- REI UHD-PRO102 HDMI Splitter/Downscaler
- Mini AV to HDMI Upscaler (1080p)
- SVS Bluetooth Receiver (already integrated; leave untouched)

------------------------------------------------------------
PHYSICAL CONNECTIONS
------------------------------------------------------------
STEP 1 - Chromecast Video Path
1. Chromecast -> UHD-PRO102 HDMI Input
2. UHD-PRO Output 1 -> Samsung HDMI 1 (ARC)
3. UHD-PRO Output 2 -> Singing Machine HDMI Input
4. UHD-PRO switch set to STD mode

STEP 2 - Samsung -> Bose (Audio Return)
1. Samsung HDMI 2 (ARC) -> J-Tech HDMI IN
2. J-Tech output mode = PCM 2-Channel
3. J-Tech RCA L/R OUT -> Bose TV AUDIO IN
4. Confirm J-Tech powered ON

STEP 3 - Singing Machine -> Bose
1. 3.5mm OUT -> RCA L/R -> Bose AUX IN
2. Select AUX input on Bose

STEP 4 - Bose -> Samsung (Video Return)
1. Bose VIDEO OUT (Yellow) + Audio OUT (R/W) -> Mini AV-to-HDMI Upscaler
2. Upscaler OUTPUT -> Samsung HDMI 3
3. Power the upscaler

------------------------------------------------------------
DEVICE SETTINGS
------------------------------------------------------------
Samsung TV:
- Sound Output: HDMI ARC (J-Tech)
- Digital Audio Format: PCM
- Disable Dolby 5.1
- HDMI1=Chromecast, HDMI2=ARC, HDMI3=Bose

Bose 3.2.1:
- TV Audio = RCA from J-Tech
- AUX = RCA from Singing Machine
- Cable/SAT = Bluetooth Receiver
- Audio Setup: Analog Input = Variable

Singing Machine:
- HDMI = video only
- Audio Out = Line Out
- Adjust Mic Mix / Music Vol
- Display Mode = 1080p 60Hz

J-Tech AE4KA:
- Mode: PCM (2 ch)
- RCA L/R active

UHD-PRO102:
- Input: Chromecast
- Output 1: TV, Output 2: Singing Machine
- Switch: STD

Mini AV-to-HDMI Upscaler:
- Input = Bose yellow/red/white
- Output = HDMI3
- Switch = 1080p

------------------------------------------------------------
FUNCTION TEST SEQUENCE
------------------------------------------------------------
1. Chromecast: HDMI1 / Bose TV = Audio OK
2. Karaoke: HDMI1 / Bose AUX = Audio OK
3. Bose DVD: HDMI3 / Bose DVD = Video OK
4. Bluetooth: Cable/SAT = Multiroom Audio OK

------------------------------------------------------------
FINAL VERIFICATION CHECKLIST
------------------------------------------------------------
- [ ] J-Tech set to PCM
- [ ] Samsung PCM Audio Out
- [ ] Karaoke visible + audible
- [ ] Chromecast and DVD OK
- [ ] Upscaler and Splitter powered
- [ ] All converters grounded
"""

pdf.multi_cell(0, 8, content_fixed)

# Save the PDF file
output_path_fixed = "/mnt/data/Lanai_Entertainment_System_Master_Guide.pdf"
pdf.output(output_path_fixed)

output_path_fixed