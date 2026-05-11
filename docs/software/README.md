# Software Package Configuration Profiles

Per-package settings, configuration, and troubleshooting profiles for The Audiopheliac.

## Purpose

When a software package becomes the subject of active work (configuration change, troubleshooting, integration), capture its current state in a profile here. The profile is the source of truth for that package across the project. It supersedes scattered notes in CLAUDE.md, the AV inventory, or the signal map for that package's own configuration details. CLAUDE.md, the inventory, and the signal map remain canonical for everything else (workspace bindings, hardware, topology, project rules).

## When to create a profile

Create or update a profile only when actively working on the package, not all at once up front. This keeps profiles current. A profile created speculatively will go stale before it is useful.

Triggers:
- New install or major version upgrade
- Configuration change worth documenting (audio routing, account, plan tier, integration)
- Active troubleshooting session that uncovered a non-obvious fix
- New automation script that depends on the package
- Cross-platform hand-off (the package is now a load-bearing piece in the signal chain or data pipeline)

## File convention

- One file per package: `docs/software/<Package>.md`
- Use the canonical package name in PascalCase (e.g., `Spotify.md`, `AbletonLive12.md`, `Suno.md`)
- Template lives at `docs/software/_TEMPLATE.md`
- Profile follows the template structure: Overview, Installation, Account, Configuration, Signal Chain / Integration Points, Related Automation, Troubleshooting Runbook, Known Limitations, Change Log

## Active profiles

| Package | Path | Status | Last reviewed |
|---|---|---|---|
| Spotify (Windows desktop) | [Spotify.md](Spotify.md) | Active | 2026-05-11 |

Add a row when a new profile lands. Update Last reviewed when you touch the profile.

## What does NOT go here

- Hardware specs (those live in `docs/av_master_inventory_2026.md` and per-device docs like `docs/Processing_Hardware.md`)
- Signal-chain topology (lives in `config/audiopheliac_signal_map_v_2026_01.md`)
- Project rules and operating constraints (live in CLAUDE.md)
- Secrets, tokens, API keys (live in `config/*.env`, gitignored)
- One-off troubleshooting notes not worth durable capture (drop those in Slack canvas or a daily log)

## Companion skills

When opening a new profile, invoke `/engineering:documentation` to load the technical-doc structure, and optionally `/operations:process-doc` if the package's profile is heavy on procedures (RACI, SOPs, runbook flows). Most software profiles will lean on `engineering:documentation` alone.
