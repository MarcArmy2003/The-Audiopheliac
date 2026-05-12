# Yamaha R-N800A — MusicCast Network Reference
**The Audiopheliac | Family Room**
Captured: 2026-05-12 | Source: Yamaha MusicCast app (iOS) + AV Controller app
Filed by: Lena (Studio Assistant, chat) | Saved by: Cowork

---

## Device Identity

| Field | Value |
|---|---|
| Network Name | Yamaha Receiver |
| Model | R-N800A |
| System Version | 1.13 (2404) |
| API Version | 2.17 |
| System UDID | uuid:9ab0c000-f668-11de-9976-54b7bd9fac18 |
| MusicCast Location | Home4 |
| Location ID | 4c40ba316e0a4b6cb785b67b82ce49b8 |
| Room Name | Family Room |

---

## Network Configuration

| Field | Value |
|---|---|
| Connection Type | Wired (Ethernet) |
| DHCP | Enabled |
| IP Address | 192.168.1.191 |
| Subnet Mask | 255.255.255.0 |
| Default Gateway | 192.168.1.1 |
| DNS (Primary) | 192.168.1.1 |
| DNS (Secondary) | 0.0.0.0 |
| MAC Address (Wired) | 54:B7:BD:9F:AC:18 |
| MAC Address (Wireless) | 54:B7:BD:9F:AC:19 |

> **DHCP reservation: complete (2026-05-12).** `192.168.1.191` reserved for MAC `54:B7:BD:9F:AC:18` in the Spectrum SAX2V1R router. No further action required for the receiver IP.

---

## MusicCast Network Status

| Field | Value |
|---|---|
| MusicCast Status | Ready |
| MusicCast Type | Standard |
| MusicCast Child Count | 0 |
| Configured Rooms | 1 (Family Room only) |
| Network Topology | Single-node — no secondary MusicCast devices linked |

---

## Active Sources (as of capture)

| Source | Status |
|---|---|
| AirPlay | Configured, recently used |
| Spotify | Configured |
| Server (DLNA) | Configured, recently used |
| Bluetooth | Recently used |
| Net Radio | Recently used |
| iPhone | Configured |

---

## AV Controller App (iOS)

| Field | Value |
|---|---|
| App | Yamaha AV Controller |
| App Version | 5.60 |
| Build Number | 1897 (b2d96447) |
| iOS Version | 26.4.2 |
| Phone IP at capture | 192.168.1.184 |
| Manual IP entries | None (auto-discovery working) |
| Device discovered | R-N800A at 192.168.1.191 — auto |

---

## Operational Notes

- Auto-discovery is working cleanly on the local subnet. No manual IP fallback entries needed at this time.
- MusicCast network is single-node. The 1Mii RT5066R2 analog wireless path (not yet connected) handles Garage and Lanai extension — those endpoints are not MusicCast-capable and do not appear here.
- If the receiver's DHCP lease drifts and the AV Controller app loses the device, add `192.168.1.191` to the Manual IP List (AV Receiver section) as a fallback.
- Volume at time of capture: -45.5 dB. No active playback.

---

## Cross-reference

- Companion profile: `docs/software/Yamaha-RN800A.md` (YXC API surface, firmware capabilities, verified limitations).
- Cockpit integration: YXC HTTP/JSON API at `http://192.168.1.191/YamahaExtendedControl/v1/` used by `console/yamaha.py`.
- Open action items in CLAUDE.md: DHCP reservation for GDMARCHE at 192.168.1.119 is already complete; the R-N800A reservation is the new item flagged above.
