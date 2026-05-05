---
title: "Ableton Live 12 - DAW Specifications & Reference"
version: "2026.05.05"
author: "Gillon Marchetti | The Audiopheliac"
last_updated: "2026-05-05"
repo_link: "https://github.com/MarcArmy2003/The-Audiopheliac"
description: "Reference sheet for Ableton Live 12 in The Audiopheliac studio environment: editions owned, install paths, default session settings, and the Ableton Live Knowledge connector for in-session production assistance."
status: "Active"
---

# Ableton Live 12 - DAW Specifications & Reference

## Overview

Ableton Live 12 is the primary DAW for The Audiopheliac studio (per `CLAUDE.md` Software and DAW Environment). This document records edition info, install paths, default session settings, and external knowledge resources. License activation keys are stored separately and are not part of this repo (see Section 6).

---

## 1. Editions Owned

| Edition | Use | Notes |
|---------|-----|-------|
| Live 12 Suite (Upgrade) | Primary DAW for studio production | Full Suite via paid upgrade path |
| Live 12 Lite | Secondary / Lite-tier features | Entry-level edition (typically bundled) |

Both editions are tied to Gill's Ableton account at ableton.com.

---

## 2. Install / Runtime Paths

Ableton runtime data lives on D: (the original factory drive on GDMARCHE, retained when C: was upgraded to Samsung 990 PRO NVMe). C: holds the project repo, code, and documentation. D: holds DAW / audio data only, per `CLAUDE.md` Workspace Bindings.

| Resource | Path |
|----------|------|
| DAW data root | `D:\The Audiopheliac\` |
| Cache | `D:\The Audiopheliac\Ableton Cache\` |
| User Library | `D:\The Audiopheliac\Ableton User Library\` |
| QSync replication target on NAS | `\\NAS87828E\The Audiopheliac\The-Audiopheliac\` |

The repo `.gitignore` blocks `Ableton Cache/` and `Ableton Temp/` at any depth, plus `*.asd`, freeze artifacts, and the sample-library extensions. Project code, scripts, and docs are not stored on D:; they live on C: at `C:\Users\gillo\The-Audiopheliac\` per `CLAUDE.md`.

---

## 3. Default Session Settings

- Sample rate: 48 kHz (per `CLAUDE.md` Software and DAW Environment)
- Bit depth: 24-bit
- Audio interface: Focusrite Scarlett Solo Gen 4 (ASIO; simultaneous WDM + ASIO supported)
- Monitoring: Yamaha HS7 (pair) + JBL LSR310S subwoofer
- Headphone monitoring: Scarlett Solo headphone output (preferred for streaming/DAW listening); Rolls MX28 headphone output reserved for multi-source blended monitoring

---

## 4. Studio Signal Path Into Live

```
AT-LP120XUSB
  > Focusrite Scarlett Solo (USB to GDMARCHE)
  > Ableton Live 12
  > Rolls MX28 Mini-Mix VI
  > Yamaha HS7 + JBL LSR310S
```

Direct Monitor on the Scarlett stays off for all playback (on only for live zero-latency tracking). Full chain reference: `CLAUDE.md` Signal Chain Map - Studio.

---

## 5. Ableton Live Knowledge Connector (claude.ai)

An Ableton-specific knowledge connector is available at the claude.ai account level for in-session production assistance.

| Field | Value |
|-------|-------|
| Connector name | Ableton Live Knowledge |
| Directory URL | https://claude.ai/directory/connectors/ant.dir.gh.ableton.ableton-knowledge |
| Source coverage | Ableton Live manual + Learn Live tutorial library |
| Reference site | https://www.ableton.com/en/live/learn-live/ |
| Status | Connected (claude.ai account level, 2026-05-05) |
| Authentication | Ableton account (used at connect time) |

### When to use it

Engage the connector during creative sessions when authoritative Ableton documentation would clarify or accelerate the work. Typical fits:

- DAW workflow (routing, automation, racks, MIDI tools, Max for Live)
- Effect / instrument device behavior (parameters, defaults, edge cases)
- Performance and CPU optimization (buffer, ASIO guard, freeze/flatten)
- Mixing and mastering chains where stock device specifics matter
- Music production technique that maps to Live 12 stock devices
- Audio engineering questions where Ableton's official docs are the source of truth

For non-Ableton engineering or production questions (signal chain hardware, gain staging across analog gear, room acoustics), the connector is not required. Default to the studio's own docs in `docs/` and the canonical signal map.

### When not to use it

The connector is scoped to Ableton-published material. It is not a general music-production reference, not a hardware reference, and not a substitute for `docs/av_master_inventory_2026.md`, `docs/Processing_Hardware.md`, or the signal map. Do not pull it in for questions those sources answer authoritatively.

---

## 6. Activation Keys (Reference Only)

License keys are sensitive and are not stored in this repo. The `.gitignore` blocks `keys/`, `Software_and_Keys.md`, `Software_Licenses.md`, `*.lic`, `*.license`, and similar patterns at any depth.

Storage locations (local, never committed):

| Copy | Path |
|------|------|
| Master | `C:\Users\gillo\Keys\Audiopheliac_Software_Licenses.md` |
| Project copy | `D:\Audiopheliac\docs\Software_and_Keys.md` |

Both copies hold the same content; keep them in sync if a key rotates.

---

## 7. Cross-References

- `CLAUDE.md` (Software and DAW Environment, Signal Chain Map - Studio, Reasoning Protocol, Mode Contracts)
- `docs/av_master_inventory_2026.md` (Studio gear: Focusrite Scarlett Solo, Yamaha HS7, JBL LSR310S, Casio Privia PX-870)
- `docs/Processing_Hardware.md` (Yamaha R-N800A and processing gear specs)
- `docs/Dell_Precision_7540_Specs.md` (Workstation hosting Live 12)
- `docs/instrument_specs_v_2025_10_08.md` (References Live 12 in DAW chain examples)

---

## 8. Maintenance Notes

- If editions change (upgrade path, new license, edition swap), update both this sheet and the master/project license registries.
- If install paths move (off D: or to a different subfolder under `D:\The Audiopheliac\`), update Section 2 and the gitignore rules for `Ableton Cache/` and `Ableton Temp/`.
- Any change to default session settings (sample rate, bit depth, interface) belongs both here and in `CLAUDE.md` Software and DAW Environment.
