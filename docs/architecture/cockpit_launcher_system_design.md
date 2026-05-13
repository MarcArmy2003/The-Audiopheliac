# Cockpit Launcher — System Design

**Project:** The Audiopheliac Cockpit
**Component:** Single-trigger packaged-app launcher (`console/launch.pyw`)
**Owner:** Gillon "Gill" Marchetti
**Status:** v0.6 shipped to disk 2026-05-12; field test pending
**Document version:** 1.0 (2026-05-12)

> Treat this as the canonical contract for what clicking the desktop shortcut does. Every future iteration of the launcher reads this doc first.

---

## 1. Executive Summary

The Cockpit is a single-user local control surface for The Audiopheliac's AV stack: Yamaha R-N800A receiver, Roon Server on the QNAP NAS, Roon Bridge on the GDMARCHE workstation, and Spotify Web API. Before v0.6, the desktop shortcut started Flask and opened Chrome but assumed every dependency was already healthy. Field testing exposed three classes of silent failure: Roon Bridge stopped without surfacing, the user clicking the icon twice spawned competing Flask processes, and the Cockpit reported components as unreachable rather than recovering them.

The v0.6 launcher rewrite converts the shortcut into a true app entry point: one click brings every dependency to a known-good state and paints a live UI within ~8 seconds, no manual recovery, no console flashes. This document captures the design so future iteration preserves the single-trigger contract.

---

## 2. Requirements

### 2.1 Functional

| ID | Requirement |
|---|---|
| F-1 | A single click on the desktop shortcut produces a working Cockpit UI within 8 seconds when all dependencies are healthy, and within 30 seconds when one or more dependencies need to be started. |
| F-2 | If a Cockpit instance is already running on the configured port, the launcher reuses it: opens a fresh Chrome `--app` window pointed at the existing process and exits. No duplicate Flask, no port conflict. |
| F-3 | If Roon Bridge's `RAATServer.exe` is not running on GDMARCHE, the launcher attempts to start it from the standard Roon install paths before starting Flask. |
| F-4 | If a Roon Server SSH key is configured in `config.roon_server.ssh_key_path`, the launcher attempts to start the QNAP container before starting Flask. |
| F-5 | The launcher hits `/api/system/bootstrap` before opening the browser window so the topbar pills paint with live state on the first frame. |
| F-6 | All subprocesses created by the launcher (`tasklist`, `sc`, `ssh`, `pythonw`, browser) run with `CREATE_NO_WINDOW`. No console windows flash. |
| F-7 | If no dependency-recovery path is available (Bridge install path unknown, SSH key absent), the launcher continues silently. The Cockpit's in-UI Start buttons handle recovery from the running app. |

### 2.2 Non-functional

| Category | Target | Notes |
|---|---|---|
| Time-to-first-paint (warm) | ≤ 4 seconds | Cockpit already running; singleton path opens browser only |
| Time-to-first-paint (cold) | ≤ 8 seconds | Bridge already up, Server already up, Flask starts fresh |
| Time-to-first-paint (recovery) | ≤ 30 seconds | Bridge stopped (~10s wake) or Server stopped (~15s container start) |
| Availability | Single-user; SLA N/A | If the launcher fails, Gill clicks the icon again. No HA design. |
| Observability | All errors fail open | Pre-flight failures are silent; Cockpit's bootstrap endpoint surfaces them in-UI. |
| Cost | Zero | All components are owned. No cloud spend. |

### 2.3 Constraints

| ID | Constraint |
|---|---|
| C-1 | Windows 11 on GDMARCHE. PowerShell version is not pinned (see CLAUDE.md HISTORY 2026-05-12). |
| C-2 | Python 3.x via `pythonw.exe` (silent, no console). Project venv at `console\.venv\Scripts\pythonw.exe` preferred when present. |
| C-3 | No paramiko or other heavy SSH library. Use Windows-built-in `ssh.exe`. |
| C-4 | No registry edits, no security service modifications, no admin elevation required for normal operation (per `systems-software-ops-windows-m365-powershell` principles). |
| C-5 | Single source of truth for the Spotify client secret: `config\spotify.env` (gitignored). Cockpit reads it via `console/app.py:load_spotify_secret()` with a fall-back to `console/spotify_secret.json`. |
| C-6 | Single user, single machine, loopback-only HTTP. CSRF + Host allowlist enforce that (Codex audit 2026-05-12, HIGH-1). |
| C-7 | Brand voice v3.0 governs every user-facing string. Direct register, no em dashes in JS toasts or empty states. |

---

## 3. High-Level Design

### 3.1 Component diagram

```
                   ┌──────────────────────────────────────────────┐
                   │      Desktop shortcut (.lnk on Desktop)      │
                   │  Target: pythonw.exe console\launch.pyw      │
                   └────────────────────┬─────────────────────────┘
                                        │ user clicks
                                        ▼
            ┌───────────────────────────────────────────────────────┐
            │                  launch.pyw (this doc)                │
            │                                                       │
            │  1. Singleton check ─── HTTP probe /api/config        │
            │  2. Pre-flight Bridge ── tasklist, then Bridge.exe    │
            │  3. Pre-flight Server ── ssh, then docker start       │
            │  4. Flask daemon thread                               │
            │  5. Warm bootstrap   ─── HTTP probe /api/system/...   │
            │  6. Chrome --app window                               │
            └────────┬────────────┬──────────┬───────────┬──────────┘
                     │            │          │           │
            ┌────────▼─────┐ ┌────▼─────┐ ┌──▼──────┐ ┌──▼────────┐
            │ Roon Bridge  │ │ QNAP NAS │ │  Flask  │ │  Chrome   │
            │ (local app)  │ │ (Docker) │ │ (Werkz) │ │  --app    │
            │ RAATServer   │ │ roonsvr  │ │ :5000   │ │  window   │
            └──────────────┘ └──────────┘ └────┬────┘ └───────────┘
                                               │
                              ┌────────────────┼────────────────┐
                              ▼                ▼                ▼
                       ┌──────────┐    ┌──────────┐    ┌──────────┐
                       │  Yamaha  │    │   Roon   │    │ Spotify  │
                       │  R-N800A │    │   Core   │    │ Web API  │
                       │  (YXC)   │    │ (WS ext) │    │ (spotipy)│
                       └──────────┘    └──────────┘    └──────────┘
```

### 3.2 Sequence — cold start, happy path

```
Click icon
   │
   ├─► launch.pyw starts (pythonw, no console)
   │
   ├─► is_existing_cockpit(127.0.0.1, 5000)
   │       socket connect — no listener → False
   │
   ├─► ensure_roon_bridge_running()
   │       _process_running("RAATServer") → True (already up)
   │       returns "running" immediately
   │
   ├─► ensure_roon_server_running(cfg)
   │       ssh_key_path not configured → returns "no_key" silently
   │
   ├─► Thread(start_flask).start()
   │       Flask binds 127.0.0.1:5000, registers blueprints
   │
   ├─► wait_for_port(host, port, timeout=15)
   │       socket connects within ~2s → True
   │
   ├─► warm_bootstrap()
   │       GET /api/system/bootstrap → 200, populates server state
   │
   ├─► open_app_window(url)
   │       Chrome --app window opens at http://127.0.0.1:5000/
   │
   └─► main thread joins Flask daemon → process stays alive
```

### 3.3 Sequence — singleton reuse

```
Click icon (Cockpit already running from earlier click)
   │
   ├─► launch.pyw starts
   │
   ├─► is_existing_cockpit(127.0.0.1, 5000)
   │       socket connect → True
   │       GET /api/config → 200 with "preferred_zones" signature → True
   │
   ├─► open_app_window(url) — opens a fresh Chrome window
   │
   └─► sys.exit (no Flask, no thread, no race)
```

### 3.4 Sequence — Bridge stopped recovery

```
Click icon (RAATServer not running)
   │
   ├─► ensure_roon_bridge_running()
   │       _process_running("RAATServer") → False
   │       walk candidate install paths:
   │         %ProgramFiles%\Roon\Bridge\Bridge.exe       ← found
   │         (others skipped)
   │       subprocess.Popen(Bridge.exe, CREATE_NO_WINDOW)
   │       poll _process_running("RAATServer") every 500ms
   │       confirmed within ~3 seconds → returns "started"
   │
   ├─► (Flask, bootstrap, Chrome — same as cold-start happy path)
```

---

## 4. Deep Dive

### 4.1 Singleton check (`is_existing_cockpit`)

**Why two-step.** A bare socket connect tells us only that *something* is listening on the port. Confirming the response shape from `/api/config` prevents the launcher from mistaking a generic process bound to 5000 for the Cockpit. The signature checked is the literal substring `preferred_zones` in the JSON body — that field is only present in our endpoint and has no chance of natural collision.

**Failure mode: stale Flask, zombie process.** If a Flask process is bound to 5000 but its event loop is wedged, `/api/config` won't respond inside the 2-second timeout. The launcher then proceeds to start its own Flask, which fails to bind (`OSError: address in use`), `wait_for_port` returns False, the launcher exits with code 1. Gill sees nothing visible. Recovery is manual: kill the zombie via Task Manager, click the icon again.

**Future iteration.** Could auto-kill a pythonw process holding 5000 that doesn't respond to `/api/config` within 2s. Deferred because manual recovery has been zero-incident so far.

### 4.2 Pre-flight Bridge (`ensure_roon_bridge_running`)

**Detection.** `tasklist /FI "IMAGENAME eq RAATServer.exe" /FO CSV /NH` is the cheapest read-only probe. Returns text starting with `INFO: No tasks are running...` on empty, or a CSV row on match. The helper parses both shapes.

**Recovery.** Candidate install paths in order:

1. `%ProgramFiles%\Roon\Bridge\Bridge.exe` (per-machine x64 install)
2. `%ProgramFiles(x86)%\Roon\Bridge\Bridge.exe` (per-machine x86)
3. `%LOCALAPPDATA%\Roon\Bridge\Bridge.exe` (per-user)
4. `%LOCALAPPDATA%\Programs\Roon Bridge\Bridge.exe` (alt per-user, newer installers)

`Bridge.exe` is the tray-launcher; spawning it brings up both the tray icon and `RAATServer.exe`. The launcher polls `_process_running` every 500ms for up to 10 seconds. Returning `"started"` does not guarantee Roon Core has rediscovered the AIR HUB output; that's a separate Roon-side concern.

**Failure modes.** If Bridge is not installed (none of the four paths exist), returns `"not_installed"`. Cockpit's in-UI Bridge pill surfaces the same conclusion after Flask boots.

### 4.3 Pre-flight Server (`ensure_roon_server_running`)

**Gated by SSH key presence.** If `config.roon_server.ssh_key_path` is empty or the file doesn't exist, the function returns `"no_key"` and the launcher continues. This is the deliberate "no manual setup required" default state: Gill hasn't generated an SSH key yet, so the launcher passively trusts Roon Server to be alive (and the Cockpit's reachability fallback detection picks that up).

**Detection + recovery via Windows-built-in `ssh.exe`.** Two SSH calls:

1. `docker inspect <container> --format '{{.State.Running}}'` — read-only probe. If stdout contains `true`, return `"running"`.
2. `docker start <container>` — only invoked if step 1 didn't return running. Returns `"started"` on success, `"unknown"` on any failure.

`BatchMode=yes` and `StrictHostKeyChecking=accept-new` ensure no interactive prompts. `ConnectTimeout=4` caps the wait so a dead NAS doesn't block the launcher for minutes.

**Out of scope for v0.6.** The launcher does not attempt to install Docker, the Roon container, or any QNAP-side dependency. SSH key generation and `authorized_keys` placement remain a one-time manual step documented in `docs/software/Roon.md` (pending).

### 4.4 Flask boot (`start_flask`)

Unchanged from v0.5. Runs in a daemon thread so the main launcher process can `join()` and stay alive without owning the Flask event loop. Daemon flag ensures the Flask thread terminates cleanly if the user closes the Chrome window and kills `pythonw`.

### 4.5 Warm bootstrap (`warm_bootstrap`)

A blocking GET against `/api/system/bootstrap` with a 4-second cap. The point is not to handle the response (the launcher discards it). The point is to force every backend probe (`tasklist` for Bridge, `ssh` for Server, YXC ping for Yamaha, Spotify token check) to complete *before* the browser opens. The result is that the topbar pills paint with their final state instead of flashing "checking" for ~8s.

### 4.6 Chrome `--app` window (`open_app_window`)

Walks five candidate browser binaries (Chrome x64, x86, LOCALAPPDATA, Edge x64, x86). First one found wins. Spawns with `--app=<url>`, `--window-size=1280,820`, `--disable-features=TranslateUI` to suppress the translation prompt. Falls back to `webbrowser.open(url)` (default browser, no chromeless window) if all candidates miss.

---

## 5. Failure Modes and Recovery

| Failure | Detection | Recovery |
|---|---|---|
| Port 5000 held by zombie pythonw | `wait_for_port` returns False after 15s | Manual: Task Manager → kill pythonw → re-click icon |
| RAATServer install path drift (new Roon installer changes location) | All four candidate paths miss | Cockpit's in-UI "Start Bridge" pill surfaces; user starts Bridge manually from tray |
| SSH key permission denied on QNAP | `_ssh` returns non-zero | `ensure_roon_server_running` returns `"unknown"`; Cockpit's reachability fallback continues to work because the Roon Core WebSocket is independent of the SSH path |
| Chrome and Edge both absent | `open_app_window` returns False | Falls back to default browser via `webbrowser.open`; no chromeless window but Cockpit is reachable |
| Bridge tray app exits silently after Cockpit starts | Cockpit polls `/api/system/bootstrap` every 8s; Bridge pill switches to "Start Roon Bridge" | One-click recovery in-UI; same code path as cold-start recovery |
| Roon Server container exits after Cockpit starts | Same 8s poll; Server pill surfaces | If SSH key configured, one-click in-UI start; otherwise user starts on QNAP UI |

---

## 6. Operational Considerations (Windows-specific)

Per `systems-software-ops-windows-m365-powershell` principles applied here:

| Principle | How the launcher honors it |
|---|---|
| Diagnostics before changes | Singleton probe runs before any process spawn. Bridge `tasklist` probe runs before any `Bridge.exe` launch. SSH inspect runs before SSH start. |
| Reversible before irreversible | Every operation is reversible: starting Bridge can be closed from its tray; starting the container can be reversed with `docker stop`; opening Chrome is window-level. |
| Read-only before write | `tasklist`, `sc query`, `docker inspect`, `Get-NetTCPConnection` (in Rafa's restart prompt) are read-only. Writes (Bridge launch, container start, Flask spawn) only fire after the read says they're needed. |
| Minimal scope first | Launcher never edits the registry, never modifies services beyond reading their state, never elevates. The Bridge service-start path (`sc start`) is a separate concern in `console/app.py`, surfaced only when a service-mode Bridge install is detected. |
| Avoid execution policy changes | Launcher does not invoke PowerShell directly. Subprocesses are `tasklist.exe`, `sc.exe`, `ssh.exe`, `pythonw.exe`, `chrome.exe` — all binaries, no scripts. |
| Avoid PII / credential leakage in logs | No logs are written by the launcher. Flask logs sit in its working directory (no PII in current code paths). |
| Don't assume admin | Launcher works as a standard user. Bridge tray app launch is per-user. Service start (when applicable) is in the Cockpit's API surface, not the launcher. |

---

## 7. Trade-off Analysis

| Decision | Alternative considered | Why we chose this | Revisit when |
|---|---|---|---|
| Singleton via HTTP probe to `/api/config` | Named mutex via `win32event` | HTTP probe needs no extra dependency, double-confirms the running process is *our* Cockpit. Mutex is faster but adds pywin32 to requirements. | If launcher latency under singleton path becomes user-visible (currently ~0.5s) |
| `tasklist` for process detection | `Get-Process` via PowerShell, or pywin32's `EnumProcesses` | `tasklist` is a binary; no PowerShell startup cost, no Python dep. PowerShell has ~300ms cold-start tax. | Never expected; `tasklist` is well-supported |
| Windows built-in `ssh.exe` | paramiko (Python SSH library) | Zero new Python dependency; matches what Gill would type in PowerShell. | If multiplexed connections or key passphrase prompts become needed |
| Daemon thread for Flask | Subprocess (`subprocess.Popen(pythonw launch.pyw …)`) | Daemon thread shares memory with the launcher, simpler shutdown semantics, no orphaned processes. | If Flask blocks the launcher main thread for > 2s during boot |
| Synchronous pre-flight probes | Parallel asyncio probes | Pre-flight runs in series because the dependencies are independent — total cost is ~3-5s in worst case. Parallel would shave maybe 1s. | If pre-flight grows to 5+ dependencies |
| Silent failure for missing recovery paths | Splash with progress + error toasts | The Cockpit's topbar pills already surface state once the UI is up. Doubling the surface in a splash is duplication. | If Gill ever wants a launcher-stage error UI before Flask boots |

---

## 8. Future Iteration Vectors

In rough priority order:

1. **Zombie-Flask auto-cleanup.** If port 5000 is held but `/api/config` doesn't respond, taskkill the holder (verify image name is pythonw first) and retry. Removes the single manual-recovery case left in the design.
2. **Splash window during cold start.** A 200ms Tk window or a tiny HTML served from a separate port could paint "Audiopheliac Cockpit starting" with the canonical mark while pre-flight runs. Currently the user sees nothing for ~3-8 seconds.
3. **Per-user install path discovery via Roon's own config.** Roon writes its install path to `%LOCALAPPDATA%\Roon\Bridge\config.dat`. Parsing that would beat candidate-path enumeration when Roon moves installs in future versions.
4. **PowerShell-only fallback.** If `pythonw.exe` is not on PATH (rare), the launcher could fail. A `.cmd` wrapper that activates the venv first would harden against this.
5. **Auto-start on user login.** Optional Startup folder shortcut so the Cockpit is alive before Gill clicks anything. Trades RAM for instant access. Defer until Gill asks.
6. **Health endpoint for external monitoring.** A `/api/system/health` returning HTTP 200 only when every dependency is green. Useful if Gill ever runs a status panel on a phone.

---

## 9. Decision Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-12 | Launcher rewrite from v0.5 thin wrapper to v0.6 packaged-app entry point | Field testing showed every silent failure mode degraded the "click and listen" UX |
| 2026-05-12 | Bridge detection covers both service-mode and user-mode installs (`RAATServer.exe` process check) | Gill's actual install is user-mode; v0.6 first cut only looked for the Windows service |
| 2026-05-12 | Singleton via HTTP probe with response-shape verification | Mutex-based singleton is faster but requires pywin32; HTTP probe stays dependency-free |
| 2026-05-12 | `CREATE_NO_WINDOW` flag on every subprocess in launcher and `roon.py` | Console flashing every 8s during bootstrap polling was a daily UX irritation |
| 2026-05-12 | SSH via Windows built-in `ssh.exe`, no paramiko | Zero new Python dependency, matches user mental model |
| 2026-05-12 | PS5.1 service-management rule struck from CLAUDE.md | Original "PS7 lacks service permissions" claim did not hold up technically |
| 2026-05-12 | Codex audit fixes (CSRF, XSS, container regex, param clamps) applied | Independent third-party audit surfaced the attack surface that loopback-binding alone does not cover |

---

## 10. References

- `console/launch.pyw` — implementation
- `console/app.py` — Flask + `/api/system/*` endpoints
- `console/roon.py` — `windows_service_status`, `windows_service_start`, `windows_process_running`, `nas_ssh_exec`
- `console/config.json` — `roon_server.ssh_key_path` knob
- `_dev/03_decision-log/cockpit_v06_design_memo.md` — v0.6 scope memo with Implemented tail
- `docs/software/Spotify.md` — Spotify Developer App + CSRF + OAuth state nonce note
- `docs/software/Roon.md` — Roon Core + Bridge profile (Bridge install one-time setup pending)
- Codex audit report (chat-only, 2026-05-12)

---

*Where every cable, waveform, and decibel earns its keep.*
