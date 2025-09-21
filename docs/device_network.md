```mermaid

flowchart LR

&nbsp; %% --- Office ---

&nbsp; subgraph Office \[Office]

&nbsp;   direction TB

&nbsp;   Technics\["Technics SL-1200MK2"]

&nbsp;   MiniSchiit\["Mini Schiit (phono pre)"]

&nbsp;   Split1\["Splitter → Bose 3•2•1 AUX"]

&nbsp;   Split2\["Splitter → SVS Bluetooth TX"]

&nbsp;   Spark\["Spark Amp (guitar)"]

&nbsp;   Dell\["Dell Precision (GDMARCHE)"]

&nbsp;   WorkLaptop\["Work Laptop (VA-issued)"]

&nbsp; end



&nbsp; Technics --> MiniSchiit

&nbsp; MiniSchiit --> Split1

&nbsp; MiniSchiit --> Split2

&nbsp; Split1 --> Bose321\["Bose 3•2•1 Series II"]

&nbsp; Split2 -.->|Bluetooth (wireless)| SVSBT\["SVS BT Transmitter"]

&nbsp; Spark -->|practice only| (nothing)



&nbsp; %% --- Family Room ---

&nbsp; subgraph Family\["Family Room"]

&nbsp;   direction TB

&nbsp;   PS5\["PS5"]

&nbsp;   Xbox\["Xbox One"]

&nbsp;   Switch\["Nintendo Switch"]

&nbsp;   QNAP\_HDMI\["QNAP TS-473A (HDMI)"]

&nbsp;   Bose650\["Bose Lifestyle 650 (HDMI hub)"]

&nbsp;   SamsungTV\["Samsung 65\\" UHD TV"]

&nbsp;   SamsungOptOut\["Samsung Optical Out"]

&nbsp;   Yamaha\["Yamaha R-N800A"]

&nbsp;   Polk\["Polk ES60 Towers"]

&nbsp;   SVSsub\["SVS SB-1000 Pro"]

&nbsp;   ATLP\["AT-LP120XUSB (phono)"]

&nbsp;   ART\["ART DJPREII (idle)"]

&nbsp; end



&nbsp; PS5 --> Bose650

&nbsp; Xbox --> Bose650

&nbsp; Switch --> Bose650

&nbsp; QNAP\_HDMI --> Bose650

&nbsp; Bose650 --> SamsungTV

&nbsp; SamsungTV -. Optical .-> Yamaha

&nbsp; Yamaha --> Polk

&nbsp; Yamaha --> SVSsub

&nbsp; ATLP --> Yamaha



&nbsp; %% --- Lanai ---

&nbsp; subgraph Lanai\["Lanai"]

&nbsp;   Chromecast\["Chromecast"]

&nbsp;   Vizio\["Vizio Smart TV"]

&nbsp; end

&nbsp; Chromecast -. WiFi Cast .-> Vizio



&nbsp; %% --- Networking Backbone ---

&nbsp; subgraph Network\["Networking Backbone"]

&nbsp;   SpectrumModem\["Spectrum Modem"]

&nbsp;   SpectrumRouter\["Spectrum Router (DHCP / Reserved IPs)"]

&nbsp;   Nest\["Google Nest Mesh Router (work laptop)"]

&nbsp;   MeshPucks\["Mesh Pucks: Garage, Bedroom"]

&nbsp;   Extenders\["Spectrum Extenders: Laundry, Kitchen"]

&nbsp;   NAS\_Network\["QNAP TS-473A (Network)"]

&nbsp;   WorkLaptopNet\["Work Laptop (on Nest Wi-Fi)"]

&nbsp; end



&nbsp; SpectrumModem --> SpectrumRouter

&nbsp; SpectrumRouter --> Nest

&nbsp; SpectrumRouter --> Extenders

&nbsp; SpectrumRouter --> NAS\_Network

&nbsp; Nest -. WiFi .-> WorkLaptopNet

&nbsp; Nest --> MeshPucks



&nbsp; %% Styling keys (GitHub Mermaid supports classDef)

&nbsp; classDef wired stroke:#1f77b4,stroke-width:2px;

&nbsp; classDef audio stroke:#d62728,stroke-width:2px;

&nbsp; classDef wireless stroke:#ff7f0e,stroke-dasharray:5 5;

&nbsp; class Technics,MiniSchiit,Split1,Split2,Bose321,PS5,Xbox,Switch,QNAP\_HDMI,Bose650,SamsungTV,Yamaha,ATLP wired;

&nbsp; class SVSBT,Chromecast wireless;


---



\## 2) Separate diagrams (one per area) — easier to read on GitHub



\### Office diagram

```markdown

```mermaid

flowchart TB

&nbsp; Technics\["Technics SL-1200MK2"] --> MiniSchiit\["Mini Schiit (phono pre)"]

&nbsp; MiniSchiit --> Split1\["Splitter → Bose 3•2•1 AUX"]

&nbsp; MiniSchiit --> Split2\["Splitter → SVS Bluetooth TX"]

&nbsp; Split1 --> Bose321\["Bose 3•2•1 Series II"]

&nbsp; Split2 -.->|Bluetooth| SVSBT\["SVS BT Transmitter"]

&nbsp; Spark\["Spark Amp (guitar)"] -->|practice only| Spark

&nbsp; Dell\["Dell Precision (GDMARCHE)"]

&nbsp; WorkLaptop\["Work Laptop (VA-issued)"]



\### Family Room diagram

```markdown

```mermaid

flowchart TB

&nbsp; PS5 --> Bose650\["Bose Lifestyle 650 (HDMI hub)"]

&nbsp; Xbox --> Bose650

&nbsp; Switch --> Bose650

&nbsp; QNAP\_HDMI\["QNAP TS-473A (HDMI)"] --> Bose650

&nbsp; Bose650 --> SamsungTV\["Samsung 65\\" UHD TV"]

&nbsp; SamsungTV -. Optical .-> Yamaha\["Yamaha R-N800A Receiver"]

&nbsp; Yamaha --> Polk\["Polk ES60 Towers"]

&nbsp; Yamaha --> SVSsub\["SVS SB-1000 Pro Sub"]

&nbsp; ATLP\["AT-LP120XUSB (phono)"] --> Yamaha

&nbsp; ART\["ART DJPREII (idle)"]



\### Lanai diagram

```markdown

```mermaid

flowchart TB

&nbsp; Chromecast\["Chromecast"] -. WiFi Cast .-> Vizio\["Vizio Smart TV"]



\### Network backbone diagram

```markdown

```mermaid

flowchart LR

&nbsp; SpectrumModem\["Spectrum Modem"] --> SpectrumRouter\["Spectrum Router (DHCP / Reserved IPs)"]

&nbsp; SpectrumRouter --> Nest\["Google Nest Mesh Router (work laptop)"]

&nbsp; Nest --> MeshPucks\["Mesh pucks: Garage, Bedroom"]

&nbsp; SpectrumRouter --> Extenders\["Spectrum Extenders: Laundry, Kitchen"]

&nbsp; SpectrumRouter --> NAS\["QNAP TS-473A (Network)"]

&nbsp; Nest -. WiFi .-> WorkLaptop\["Work Laptop (VA network)"]



---



\## How to add to GitHub README.md

1\. Edit `README.md` (or a docs `.md`) and paste one of the blocks above.  

2\. Save \& push.  

3\. GitHub will render the Mermaid diagram automatically in the file preview (or on the repo page).  

&nbsp;  - If your GitHub instance or viewer doesn’t render Mermaid, use a Mermaid preview extension locally or generate PNG/SVG via the Mermaid CLI and commit the image.



---



If you want, I’ll now:

\- Export the \*\*single master diagram\*\* and the \*\*four separate diagrams\*\* into a single `AV\_Network\_Diagrams.md` file formatted for your repo, or

\- Generate PNG/SVG exports (ready to commit) if your GitHub doesn’t render Mermaid.



Which do you prefer?





