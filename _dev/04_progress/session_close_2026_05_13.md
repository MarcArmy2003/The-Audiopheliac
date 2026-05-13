# Session close, 2026-05-13

**Surface:** Cowork (Sully)
**Trigger:** `audio:close` from Gill at end of session
**Session scope:** Cockpit v0.6 polish, Codex audit application, single-trigger packaged-app launcher, formal system-design docs, plus a UI redesign attempt that was paused mid-port and parked for next session.

---

## What shipped to disk this session

All on disk, **uncommitted** at session end. Rafa is queued to commit + push in the close handoff.

### Cockpit v0.6 polish (the meat of this session)

1. **Bridge detection covers user-mode tray app.** `_roon_bridge_state()` in `console/app.py` and `windows_process_running()` in `console/roon.py` handle both service-mode and user-mode Bridge installs. Gill's setup is user-mode (`RAATServer.exe` tray app); the original v0.6 detection only looked for the Windows service and reported `not_installed`. Fixed.
2. **CLAUDE.md PS5.1 service-management rule struck.** The rule claimed PS7 lacks service permissions; the claim doesn't hold up technically (PS5.1 and PS7 both call the same Windows Service Control Manager via the same Win32 APIs). Five downstream version pins generalized to "PowerShell." HISTORY entry added.
3. **Field-test fix round 1.**
   - `CREATE_NO_WINDOW` flag on every `subprocess.run` in `console/roon.py` (`tasklist`, `sc query`, `sc start`, `ssh`). No more CMD console flashes every 8s during bootstrap polling.
   - Roon search via root &rarr; Library &rarr; Search &rarr; submit-query navigation (was only checking root for a Search entry).
   - Source-flip poll-to-verify before firing play, on both `roon-item` and `spotify-uri` paths in `/api/playback/play-to`. The pre-fix 0.4s flat sleep was racing the receiver.
   - Stale-zone-count resync button surfaces when zone count is less than configured `preferred_zones`.
   - Silent-failure toast when Roon's auto-Play-Now heuristic doesn't fire on an action item.
   - Toast dedup (4s window).
4. **Field-test fix round 2.** Now Playing prefers Roon zone metadata only when the zone is currently playing. Stops the "AIR HUB plays Roon but card shows stale Spotify" mismatch.
5. **Packaged-app launcher (`console/launch.pyw` rewrite).**
   - Singleton check via JSON parse of `/api/config` (initial substring match `'"ok": true'` with a space was whitespace-fragile; Flask's compact JSON emits no space and `JSON_SORT_KEYS` reorders the body). Without this fix every shortcut click silently spawned a second Flask (Windows `SO_REUSEADDR` masks the bind collision).
   - Pre-flight Bridge wake: tries 4 standard install paths.
   - Pre-flight Server wake: SSH-gated (no-op if `config.roon_server.ssh_key_path` is empty).
   - Flask on main thread, post-boot (wait_for_port + warm bootstrap + open Chrome) on a daemon. Removes the daemon-thread join race where Flask could die while the launcher kept a Chrome window pointed at a dead port.
   - SSH injection guard: `container_name` validated against `^[a-zA-Z0-9_.-]{1,64}$` before any SSH command interpolation.
   - `console/launch_error.log` writes for any Flask import/runtime/launcher main exception. Under pythonw this is the only visible diagnostic.

### Codex security audit (independent third-party review)

Applied (all HIGH and one LOW):
- CSRF + Host allowlist `@app.before_request` (loopback Host only; `X-Cockpit-CSRF` header required on POST/PUT/PATCH/DELETE; per-process token via `secrets.token_urlsafe(32)`).
- `/spotify/callback` reflected XSS: `markupsafe.escape` on `error`, exceptions logged not reflected.
- DOM XSS in preset rendering: `createElement` + `textContent`, no innerHTML interpolation.
- Param clamps via `_clamp_int()` on `/api/spotify/search`, `/api/spotify/playlists`, `/api/roon/image`, `/api/roon/browse/page`, `/api/browse`.
- Container-name regex on SSH paths.

Deferred:
- OAuth state nonce explicit check (spotipy validates internally per `docs/software/Spotify.md` &sect;7.7).
- CSP + SortableJS SRI.
- Broader error-disclosure scrub (worst offender at `/spotify/callback` already covered).

### Rafa Phase 1 HALT triage (Option 1)

Rafa's parallel four-file code review surfaced 8 HIGH and 10 MEDIUM findings. Triage:
- 2 real HIGHs in `launch.pyw` (SSH injection, Flask daemon-thread race) &mdash; **fixed**.
- 4 drift-risk HIGHs in `app.py` (Origin advisory comment) and `app.js` (innerHTML on hardcoded literals) &mdash; **waived** as drift-risk only.
- 1 critical LOW that was actually load-bearing (singleton substring fragility) &mdash; **caught at Phase 3 by Rafa's second-click test, fixed in Option A**.
- MEDIUM bundling: `cfg.get()` defaults + `launch_error.log` for silent Flask errors **applied**; rest deferred.

Lesson logged: drift-risk LOW findings on critical-path logic should not be auto-waived. The singleton check was already broken; the LOW flag was correct; we waived it because it looked cosmetic.

### Formal design documentation

- `docs/architecture/cockpit_launcher_system_design.md` &mdash; 10-section formal system design with decision log, applying `/engineering:system-design` + `/systems-software-ops-windows-m365-powershell` methodology.
- `docs/architecture/cockpit_launcher_architecture.html` &mdash; visual architecture artifact, single-file HTML, Full Spectrum styled.
- `_dev/03_decision-log/cockpit_v06_design_memo.md` &mdash; Implemented tail + Codex audit applied subsection.
- `docs/software/Spotify.md` &mdash; new &sect;7.7 (spotipy state-nonce validation note) and &sect;7.8 (CSRF + Host allowlist mechanism).

### v0.7 UI redesign attempt (paused, parked for next session)

Started a faithful port of `_dev/01_brand/cockpit_redesign_mockup.html` per Gill's "Option 1, done correctly first time" instruction. Wrote a new `console/templates/index.html` matching the mockup structure (Yamaha card combines Power + Mute + Source + Master volume + Net Radio presets in a 2x2 tile grid + sources grid + slider + 4-column preset grid; Roon Zones with per-zone volume sliders; Library card with Roon/Spotify tabs; Up Next pulling Roon queue; topbar clock; transport shuffle/repeat pills; vinyl-disc art placeholder; footer).

**Did not write the corresponding CSS or JS, did not add the new backend endpoints.** Disk state was inconsistent (v0.7 template against v0.6 CSS/JS) when `audio:close` triggered. Reverted the production template to v0.6 state. Saved the v0.7 draft to `_dev/01_brand/cockpit_v07_template_draft.html` with a banner comment listing the remaining work for next session.

---

## Where Cockpit stands at session close

- Live process: PID 27020 still serving v0.6 layout on `http://127.0.0.1:5000` per Rafa's Phase 3 surviving instance.
- Disk state: matches what PID 27020 is serving (after the template revert). Safe to restart any time.
- Five uncommitted deltas listed above are ready for one feature commit. Plus the v0.7 draft as a sixth file in the design folder.
- Paperclip THE-5 parent + THE-6 / THE-7 / THE-8 / THE-9 children are filed and `done`-tagged from Rafa's earlier runs. THE-5 needs a closing comment citing this session's commit SHA.

---

## What's parked for next session

- v0.7 UI rebuild per `_dev/01_brand/cockpit_v07_template_draft.html`. Banner inside the file lists the exact work: new CSS (all new classes), new JS (clock, per-zone volume, library tabs, transport toggles, mute toggle, power toggle), new backend endpoints (`/api/roon/zone-volume`, `/api/roon/queue`), new roon.py methods (`set_zone_volume`, `zone_queue`). Then swap the template in atomically.
- SSH key generation for the QNAP Roon Server auto-start (Bucket C one-time setup, still pending).
- `npm audit` resolution on the Astro site (6 vulns, gate before any Cloudflare deploy).
- CLAUDE.md HARDWARE IP conflict (192.168.1.119 vs 192.168.1.75 for GDMARCHE).
- Discogs collection sync integration (deferred since v0.5).

---

## Behavioral corrections to log

1. **Don't half-port a UI rewrite.** Either complete template + CSS + JS + backend in a single batch, or don't start. A half-ported template breaks the running app.
2. **Don't auto-waive drift-risk findings on critical-path logic.** The singleton substring was flagged LOW under Option 1 triage and we waived it; turned out to be load-bearing. Future Option-1 triage should explicitly verify each waived finding against critical-path runtime behavior, not just "is it a live bug today."
3. **Surface mock-up baselines explicitly before changing UI.** Gill's frustration with the v0.6 layout was rooted in the fact that v0.5/v0.6 functional work added cards (Spotify, system pills) without re-anchoring against the original `cockpit_redesign_mockup.html` visual contract. Result: layout drift accumulated until the running app felt nothing like the mockup. Going forward, any UI change should reference the mockup as the visual baseline and consciously deviate or align.

---

*Session ends with a clean handoff: working Cockpit on disk, v0.7 redesign scoped and saved, paperclip ledger clean, five deltas queued for one feature commit via Rafa.*
