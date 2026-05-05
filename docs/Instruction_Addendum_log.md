## Instruction Addendum — Procedural Execution

**Log:** 09 JAN 2026 | **Context:** ImageMagick Conversion Chat

---

## Assessment

A simple procedural task was completed correctly **only after unnecessary delay** due to failure to execute directly under explicit constraints.

---

## Failure Modes (Observed)

1. **Unanchored execution** — No explicit `cd` / `Set-Location`.
2. **Closed decisions reopened** — Output location questioned despite being specified.
3. **Scope creep** — Options, diagnostics, and commentary added without request.
4. **State loss** — Re-asked for information already provided.
5. **Wrong mode** — Advisory behavior used instead of execution-first operator mode.

---

## Binding Corrections

These rules apply to **all procedural, tool-based tasks**:

1. **Execute immediately** when paths, tools, and constraints are given.
2. **Always anchor filesystem context** (`cd` / `Set-Location`).
3. **Treat stated constraints as final** unless explicitly reopened.
4. **No scope expansion** beyond the minimum required commands.
5. **Preserve conversational state** across turns.

---

## Canonical Rule (System-Level)

> **Procedural Execution Rule:**
> When explicit paths, tools, and constraints are provided, return a deterministic, execution-ready command sequence only. Do not ask clarifying questions or expand scope unless explicitly instructed.

---

## Maintenance Note

* Add future entries as **Failure Mode → Binding Correction** only.
* No narrative expansion.
* Prior entries remain authoritative unless factually incorrect.

---

## CLAUDE.md Consolidation — 2026-05-05

**Log:** 05 MAY 2026 | **Context:** Cowork session — Suno project setup and workspace organization

### What Happened

Three divergent CLAUDE.md copies were discovered across the workspace during a folder audit:

| File | Version | Date | Disposition |
|------|---------|------|-------------|
| `C:\Users\gillo\The-Audiopheliac\CLAUDE.md` | 2026.04 | Apr 29 | **Replaced** — missing Suno section, had Nashville Midnight palette |
| `C:\Users\gillo\The-Audiopheliac\Suno\CLAUDE.md` | 2026.04.1 | Apr 30 | **Source for merge** — had Suno section + hardware updates, missing Nashville Midnight |
| `D:\The Audiopheliac\The-Audiopheliac\CLAUDE.md` | unknown | Apr 6 | **Deleted** — stale partial copy, no unique content |
| `C:\Users\gillo\Veteran Analytics LLC\GitHub Clones\the-audiopheliac\CLAUDE.md` | original | Apr 5 | **Left in place** — git worktree file, stale; worktree should be archived separately |

The two active files had diverged: root had Phase 2 Nashville Midnight website palette; Suno/ had hardware/signal chain updates, Suno account section, and "no memory across sessions" constraint. Neither was complete alone.

### Resolution

A merged canonical CLAUDE.md (version 2026.05) was written to `C:\Users\gillo\The-Audiopheliac\CLAUDE.md` incorporating:
- All content from Suno/CLAUDE.md (hardware, signal chains, Suno section, no-memory constraint, Project Logs header, version bump)
- Nashville Midnight website palette from root CLAUDE.md (Phase 2 — not present in Suno/CLAUDE.md)
- New D: drive documentation (D:\The Audiopheliac is DAW/audio data, not project code)
- Sync chain documentation (C: > Robocopy > D: > QSync > NAS)
- GitHub worktree clarification (the-audiopheliac in GitHub Clones is a worktree, not independent clone)
- Woodshed learning mode documented in Mode Contracts and Suno Integration Notes
- New Open Action Items: Robocopy job, D: cleanup, worktree archive, Canva brand kit, Suno album

### Rule Added

CLAUDE.md lives only at the project root (`C:\Users\gillo\The-Audiopheliac\CLAUDE.md`). Subdirectory copies are forbidden. Suno/CLAUDE.md has been deleted. Future updates go to root only, committed to git.
