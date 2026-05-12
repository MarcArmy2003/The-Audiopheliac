# Software Package Configuration Profile - TEMPLATE

**Package:** {NAME}
**Owner:** Gillon "Gill" Marchetti (MarcArmy2003)
**Profile version:** {YYYY.MM[.N]}
**Last reviewed:** {YYYY-MM-DD}
**Status:** {Active | Deprecated | Reserve | Trial}

> Per-package configuration, settings, and troubleshooting profile for The Audiopheliac. One file per package under `docs/software/`. Build a new profile only when the package becomes the subject of active work, not all at once.

---

## 1. Overview

One paragraph: what this package does in The Audiopheliac ecosystem, why it is installed, and which signal-chain or automation roles it serves. Cite related entries in `docs/av_master_inventory_2026.md` and `config/audiopheliac_signal_map_v_2026_05.md` by filename.

---

## 2. Installation

| Field | Value |
|---|---|
| Install source | {Microsoft Store / Vendor MSI / GitHub release / etc.} |
| Install path | {Full Windows path or `N/A`} |
| Vendor version (last verified) | {x.y.z on YYYY-MM-DD} |
| Auto-update | {On / Off / Manual} |
| License / subscription | {Tier, billing cycle, next renewal} |
| Auth email | {address} |

---

## 3. Account / Credentials

| Field | Value |
|---|---|
| Username / handle | {value} |
| Display name | {value} |
| Account email | {address} |
| Public profile URL | {URL or N/A} |
| MFA enabled | {Yes / No} |
| Support contact | {email or URL} |

Secrets, tokens, and API keys do not live in this file. Reference `config/` paths (gitignored) or password manager entries by name only.

---

## 4. Configuration

In-app settings that matter for The Audiopheliac. Group by section as they appear in the app UI. Use a settings table for fast scan, then prose only where a setting needs rationale.

| Setting path (App > Menu) | Value | Why this value |
|---|---|---|
| Settings > ... | ... | ... |

Include any companion utilities (vendor control panels, system tray apps) and their settings.

---

## 5. Signal Chain / Integration Points

Where this package sits in the signal chain or data pipeline. ASCII chain notation:

```
{Source} > {Package} > {Destination}
```

For software-only packages (no audio chain involvement), document data flows instead (API calls, file IO, NAS paths).

Cross-reference: hardware entries in `docs/av_master_inventory_2026.md`, topology in `config/audiopheliac_signal_map_v_2026_05.md`, project scripts under `automation/`.

---

## 6. Related Automation

Scripts, scheduled tasks, shortcuts, or wrappers that depend on or drive this package. Include full path and purpose. If the script lives in this repo, link by relative path. If it lives outside the repo (e.g., `C:\Scripts\...`), include full Windows path.

| Artifact | Path | Purpose |
|---|---|---|
| ... | ... | ... |

---

## 7. Troubleshooting Runbook

Standard issues in order of frequency. Each item: symptom, root cause, fix steps.

### Issue: {short description}
- **Symptom:** what the user sees
- **Cause:** the underlying mechanism (cite a system layer: physical, driver, OS, app, network)
- **Fix:**
  1. step
  2. step
- **Verification:** what success looks like

---

## 8. Known Limitations

Hard constraints that cannot be fixed in configuration. Examples: no native ASIO support, no public API, region locks, plan tier caps.

---

## 9. Change Log

| Date | Profile version | Change |
|---|---|---|
| YYYY-MM-DD | YYYY.MM | Initial profile. |

---

*Template version 2026.05.1. Update this template, then ripple changes into existing per-package profiles only when the change is structural (new section, renamed field). Settings updates stay scoped to the affected package's profile.*
