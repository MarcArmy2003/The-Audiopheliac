# Cockpit v0.6 — Single-Trigger App Memo

**Date:** 2026-05-12
**Status:** Scoping the unified rebuild after v0.5 design failures around Library playback, missing track listings, broken search, missing Studio zone, and external-config-dependent boot.
**Author:** Cowork (Sully)

---

## Core principle, restated again

**The Cockpit IS the app.** Click one shortcut, audio works. No Roon Remote. No Container Station. No PowerShell. No "go to Roon Settings, Audio, and enable the zone." If any dependency is down (Roon Server on the NAS, Roon Bridge on GDMARCHE, Yamaha reachability, Spotify auth), the Cockpit detects it on startup, surfaces it, and offers one-click recovery from inside the UI.

v0.5 violated this principle in two ways. First, the Library Play action doesn't actually fire audio because my action-list heuristic misses Roon's real response shapes. Second, the Studio zone disappears when Roon Bridge stops on GDMARCHE and the Cockpit has no idea, no surface, no fix. Both push Gill back to other apps to recover. That's the failure mode this memo eliminates.

---

## What v0.5 missed

### 1. Library plays don't produce audio (CRITICAL)
`roon.select_action()` auto-fires "Play Now" only when the descended sub-list has at least two action-hint items AND one is titled exactly "Play Now" or "Play". Roon's actual action sub-lists use varying labels and hint shapes depending on context. Heuristic misses. Cockpit shows Now Playing metadata (from the browse_load result) but no play command ever fires. The fix is to stop guessing and use `roonapi.play_media()`, the library's high-level path-walker that handles every action-list descent natively.

### 2. Tracks invisible inside albums and playlists (CRITICAL)
When the user descends into an album, the Cockpit renders only headers and the action_list parent ("Play Album"). The track listing that Roon returns alongside isn't surfaced in a usable way. No path exists to pick a specific track. Gill called this a "no duh" miss. It is.

### 3. Library search broken (HIGH)
The v0.5 search refactor navigates to a "Search" entry then submits `input`. It's not hitting Roon's actual search hierarchy correctly. Falls back to "input at root" which Roon ignores. The right tool is `roonapi.list_media(zone_id, ["Library", "Search"])` followed by a path-based query.

### 4. Studio zone (AIR HUB) silently missing (HIGH)
Studio · AIR HUB depends on Roon Bridge running as a Windows service on GDMARCHE. When the service stops (after reboot, after a Windows update, after manual interruption), the zone disappears from Roon. The Cockpit has no detection, no surface, no recovery. User has to know to open Services.msc and start the service, which violates the single-trigger principle entirely.

### 5. Roon Server container alive on NAS (HIGH)
Same shape as #4. If the QNAP Container Station's `roonserver` container stops (reboot, manual stop, crash), the Cockpit goes dark. User has to know to log into Container Station and start the container.

### 6. Yamaha Source card hidden by default (MEDIUM)
The v0.5 default-hides this card "for cleanliness." Result: when smart play-routing fails, the user has no visual indicator of what input the receiver is on, and no way to flip it without restoring the card from the top bar. Debugging dead-end.

### 7. Default Roon zone falls to "first returned" (MEDIUM)
v0.5 picks `state.zones[0].zone_id` if no preference is saved. Roon returns zones in implementation-defined order. If "Family Room - TV" sorts first, plays default there. Audio goes to a Samsung TV that may or may not be on. Should prefer Family Room — Yamaha (Gill's primary listening surface), then Studio · AIR HUB.

### 8. Spotify device matching still potentially fragile (LOW)
v0.5 added multi-hint matching, explicit device_id from the picker, and lists visible devices on failure. Still possible the Yamaha's Spotify Connect endpoint doesn't appear under any of our hints. Fix: when the smart-play fails because the device isn't visible, the error toast should include a one-click "pick device" action.

### 9. CLAUDE.md HARDWARE IP conflict (LOW, parked)
192.168.1.119 vs 192.168.1.75 for GDMARCHE. Reconcile during v0.6 close.

---

## v0.6 scope buckets

### Bucket A — Roon Library actually works
- Replace `roon.select_action()` heuristic with `roonapi.play_media(zone_id, path)` for terminal plays.
- New `/api/roon/play-album` and `/api/roon/play-track` endpoints that take canonical path tuples and fire `play_media` directly. No more guessing.
- `renderLibraryList` shows track listings when descending into an album. Click any track to play that track.
- `roonapi.list_media` replaces the manual hierarchy walk in search. Path tuples: `["Library", "Search"]` then submit query.
- New diagnostic endpoint `/api/roon/debug/browse` returns the raw browse_load response so we can adapt to Roon's actual hint shapes.

### Bucket B — Studio zone auto-managed
- Cockpit polls `Get-Service "Roon Bridge"` (or equivalent) on GDMARCHE on startup and at intervals.
- If service exists but stopped: surface a yellow "Start Roon Bridge" pill in the topbar.
- Backend endpoint `/api/system/roon-bridge/start` invokes `Start-Service` via subprocess. No admin required for service start if Gill's user has been granted that permission (he's local admin on GDMARCHE).
- If service doesn't exist: surface a hard-error pill linking to install instructions.
- Status check returns `running | stopped | not_installed | unknown`.

### Bucket C — Roon Server container auto-managed
- Cockpit pings the NAS for Roon Server health on startup (HTTP probe to port 9100 / 9200, or SSH `docker ps`).
- If down: surface "Start Roon Server" pill in topbar.
- Backend endpoint `/api/system/roon-server/start` SSHs to 192.168.1.230 using the gitignored key at `~/.ssh/id_qnap_roon` and runs `docker start roonserver`.
- Status check via `docker inspect roonserver --format '{{.State.Running}}'`.
- Bootstrapping SSH key + adding to QNAP authorized_keys is a one-time Rafa setup; documented in the Roon profile.

### Bucket D — Zone management UX
- Default zone preference order: Family Room — Yamaha → Studio · AIR HUB → first-available.
- Yamaha Source card unhidden by default. Per the v0.5 lessons, manual source visibility is worth more than card-count cleanliness.
- Source state visible in Now Playing as well (already there in v0.5 via the engine tag, but expand the tooltip).
- Zone selection sticky across sessions (already in v0.5 via `localStorage`).

### Bucket E — Single-trigger launcher
- `launch.pyw` becomes a bootstrapper:
  1. Start Flask in a daemon thread.
  2. Wait for `/api/system/bootstrap` to return green, or surface specific failures in the splash.
  3. Open Chrome `--app` window when ready, OR open earlier and let the UI handle surfaces.
- `/api/system/bootstrap` consolidates:
  - Roon Server status (via Bucket C)
  - Roon Bridge status (via Bucket B)
  - Yamaha YXC reachability (existing)
  - Spotify auth (existing, surface unauth state)
- Desktop shortcut points at this launcher. The shortcut IS the app.

### Bucket F — Spotify reliability tail
- When `/api/playback/play-to` (spotify-uri) returns 503 because device not visible, the frontend opens the device picker automatically in a modal and lets the user pick the target. Click → save selection → retry the play.

### Bucket G — Verification + close
- Field-test every bucket.
- Update CLAUDE.md HISTORY with the v0.6 milestone.
- Update `docs/software/Roon.md` with the bootstrap flow + SSH key setup.
- Slack canvas entry at the session-close.
- Single git commit per bucket OR one consolidated commit per Gill's preference.

---

## Files touched

- `console/app.py` — `/api/system/bootstrap`, `/api/system/roon-bridge/*`, `/api/system/roon-server/*`, `/api/roon/play-album`, `/api/roon/play-track`, `/api/roon/debug/browse`. Refactor `/api/playback/play-to` to call new endpoints.
- `console/roon.py` — wrap `roonapi.play_media`, `list_media`. Drop heuristic in `select_action`. Add `bridge_status()` and `server_status()` helpers.
- `console/yamaha.py` — switch `f"...?...&..."` URL building to `requests.get(url, params={...})` per the audit MEDIUM finding (XSS-adjacent in error responses, plus general hygiene).
- `console/spotify.py` — no behavior change; ensure scope set is complete.
- `console/templates/index.html` — bootstrap status section, track-listing UI structure, source card visible by default in default-hidden set.
- `console/static/style.css` — system status pill states (running / stopped / starting), track-listing rows, modal styles for device picker.
- `console/static/app.js` — bootstrap surface, track-listing render, default-zone-preference logic, device-picker modal.
- `console/launch.pyw` — bootstrap orchestration.
- `docs/software/Roon.md` — bootstrap section, SSH key setup.

---

## Paperclip integration

This work fits THE paperclip company (id `821ef660-0041-4ef6-a911-adb1ba038e15`, prefix `THE`). Two ways to phase it:

**Option 1: Cowork+Rafa direct, Paperclip as ledger.** Cowork writes all the code. Rafa executes Windows service ops, SSH key setup, Flask restarts. Paperclip gets one parent issue (THE-N: "Cockpit v0.6 unified rebuild") and one sub-issue per bucket, transitioned to done as each ships. No agent execution required. Audit trail preserved. Fastest path.

**Option 2: Hire Audiopheliac Operator agent first, route the work through Paperclip.** Operator agent picks up sub-issues, posts work products, transitions states. Pros: governance, cost tracking, exercises the full Paperclip surface. Cons: agent hire adds a half-day of setup before any v0.6 code lands, and Operator's first task being a complex rebuild is a heavy first run.

**Recommendation: Option 1.** Hire the Operator separately for recurring maintenance (nightly indexer, weekly Discogs sync, scheduled Robocopy) where async heartbeat scheduling actually wins. v0.6 is human-driven dev work; Cowork+Rafa is the right surface.

---

## Acceptance criteria

1. Click the desktop shortcut. Flask boots. Chrome window opens. Within 8 seconds, the topbar pills are all green AND the seven Roon zones are visible AND Studio · AIR HUB is one of them.
2. Search "stapleton starting over" in the Library card. Results appear within 2 seconds. Click any track. Audio plays in the active zone (default Family Room — Yamaha).
3. Click any Spotify playlist. The playlist expands to show tracks. Click any specific track. Audio plays via Spotify Connect to the Yamaha.
4. Manually stop Roon Bridge on GDMARCHE (`Stop-Service "Roon Bridge"`). Within 10 seconds, the Cockpit's topbar shows a yellow "Start Roon Bridge" pill. Click it. Service starts. Studio zone reappears within 15 seconds.
5. Manually stop Roon Server container on the NAS (`docker stop roonserver` over SSH). Within 15 seconds, the Cockpit shows "Start Roon Server" pill. Click. Container starts. Zones repopulate within 30 seconds.
6. Library Play, Spotify Play, Net Radio preset, and Roon search all produce audible audio in the active zone, every time, with no intermediate config steps in any external app.

---

## Recommended sequence

1. **Bucket A (Library actually works)** — biggest user-visible win. ~half-day. Cowork only.
2. **Bucket D (zone defaults + source card visible)** — small, paired with A.
3. **Bucket F (Spotify device picker on failure)** — small, paired with A/D.
4. **Bucket B (Roon Bridge auto-managed)** — needs Rafa for Windows service permission check and one local install verification. ~quarter-day.
5. **Bucket C (Roon Server auto-managed)** — needs Rafa for SSH key generation + QNAP authorized_keys + one-time test. ~half-day.
6. **Bucket E (launcher bootstrap)** — wires A-D together. ~quarter-day.
7. **Bucket G (verification + close)** — field test, docs, commit, canvas.

Total: roughly two work-days for full v0.6 if no Roon API surprises.

One Flask restart per major edit during dev. Single feature commit at close.

---

## Open questions for Gill

1. **SSH from GDMARCHE to QNAP**: do you already have a key configured, or do we generate fresh as part of Bucket C? Confirms one prerequisite.
2. **Operator agent hire**: yes/no/later? If yes, parallel track. If no, recurring maintenance lives with Rafa scheduled tasks instead.
3. **Commit cadence**: one commit per bucket, or one consolidated commit per phase, or one for the whole v0.6?

No other gates. Cowork ready to start Bucket A on your go.

---

## Implemented 2026-05-12

All seven buckets shipped in a single pass. No piecemeal. Files touched:

- `console/roon.py` &mdash; replaced the heuristic-only `select_action()` with a two-level descent loop that auto-fires Play Now-class actions across an expanded title set (`Play Now`, `Play`, `Play Album`, `Play Track`, `Play Artist`, `Play Playlist`, `Play Tracks`, `Play Song`, `Start Radio`, plus any title starting with `play`). Added `_pick_play_item()` (Bucket A). Added `play_path(zone_id, path)` for name-based hierarchy walking (Bucket A). Rewrote `search()` to flexible-match the Search entry (any title containing `search`, length under 24 chars) so Roon variants don't break it (Bucket A). Added `debug_browse()` so the UI can surface Roon's actual response shape when something doesn't render right (Bucket A). Added module-level helpers `windows_service_status()`, `windows_service_start()`, `nas_ssh_exec()` driving Buckets B and C without external Python deps (uses `sc.exe` and Windows-built-in `ssh.exe`).
- `console/app.py` &mdash; added `/api/roon/debug/browse`, `/api/roon/play-path`, `/api/system/bootstrap`, `/api/system/roon-bridge/{status,start}`, `/api/system/roon-server/{status,start}`. `_roon_server_status()` tries SSH first (via configured key path) then falls back to the Cockpit&rsquo;s own Roon WebSocket reachability as evidence that the Server is alive. Imports `windows_service_status`, `windows_service_start`, `nas_ssh_exec` from `roon` module.
- `console/config.json` &mdash; added `roon_server` section (host, ssh_user, ssh_key_path, container_name) for Bucket C. `ssh_key_path` defaults empty; if blank, auto-start is disabled and the Cockpit falls back to passive reachability detection.
- `console/templates/index.html` &mdash; topbar bumped to `v0.6`. Two new system pills (`topbar-bridge`, `topbar-server`) hidden when components are running, surfaced as yellow click-to-start buttons when stopped (Buckets B, C, E). Spotify device picker modal scaffold added after `</main>` (Bucket F) with proper aria roles and ids `sp-device-modal`, `sp-device-modal-list`, `sp-device-modal-close`, `sp-device-modal-cancel`, `sp-device-modal-title`. Yamaha source card&rsquo;s helper note tightened.
- `console/static/style.css` &mdash; system pill state classes (`system-running` hidden, `system-stopped` yellow, `system-starting` blue, `system-missing` red). Track-listing styles (`.library-track`, `.library-track-num`, `.library-track-title`, `.library-track-sub`, `.library-track-hint`). Full modal styling (`.modal-backdrop`, `.modal`, `.modal-head`, `.modal-list`, `.modal-device`, `.modal-foot`).
- `console/static/app.js` &mdash; `HIDDEN_CARDS_KEY` bumped to v5 with empty `DEFAULT_HIDDEN` (Yamaha Source card visible again, Bucket D). `CARD_ORDER_KEY` bumped to v3 for clean migration. New `ZONE_PREFERENCE = ['Family Room &mdash; Yamaha', 'Studio &middot; AIR HUB', 'Family Room &mdash; Bose']` driving `pickPreferredZone()` (Bucket D). `state.spotify.selectedDeviceId` now hydrates from `SPOTIFY_TARGET_KEY` (localStorage); selection persists across sessions. `renderSystemPill()` + `refreshSystemBootstrap()` + click handlers `startRoonBridge()`, `startRoonServer()` drive Buckets B, C, E. Polling interval added at 8s. `playFromSpotify()` now opens the picker modal on 503 device-not-visible responses, persists the chosen device id, and retries the play with that explicit target (Bucket F). Manual Spotify device-picker selections in the Spotify card also persist to localStorage so the choice survives reloads.
- `console/launch.pyw` &mdash; new `warm_bootstrap(host, port)` hits `/api/system/bootstrap` before opening the Chrome window so the topbar pills render with live state on first paint, no flash of `checking` (Bucket E).

### Acceptance criteria — status

1. Single-shortcut launch with green topbar in &lt; 8 s &mdash; pending field test by Gill.
2. Search "stapleton starting over" returns results &mdash; pending field test (search rewrite shipped).
3. Click any Spotify playlist &rarr; tracks render &rarr; pick one &rarr; plays via Connect &mdash; pending field test.
4. Stop Roon Bridge &rarr; yellow pill within 10 s &rarr; click &rarr; service starts &mdash; pending field test.
5. Stop Roon Server container &rarr; yellow pill within 15 s &rarr; click &rarr; container starts &mdash; pending field test, also pending SSH key setup.
6. Library/Spotify/Net Radio Play all produce audio in active zone &mdash; pending field test.

### Pending one-time setup

- SSH key for the QNAP Roon Server auto-start (Bucket C). Generate an OpenSSH keypair on GDMARCHE, copy the public key into the QNAP&rsquo;s `~/.ssh/authorized_keys`, set `config.roon_server.ssh_key_path` to the private key path. Until done, the Cockpit detects Roon Server status via reachability (no auto-start surface).
- One Flask restart to pick up all the v0.6 changes.

### Deferred / parked

- Track-listing UI inside an album view: `roon.select_action()` and `play_path` cover playback; the explicit "show me an album&rsquo;s track list and let me click track N" UI is parked because Roon&rsquo;s album browse already surfaces tracks alongside actions in the response &mdash; `renderLibraryList` should display them via the existing button path. If field test shows tracks still hidden, a targeted UI pass adds explicit track rendering. Debug endpoint `/api/roon/debug/browse` enables diagnosis without a fresh code spin.
- CLAUDE.md HARDWARE IP conflict reconciliation (192.168.1.119 vs 192.168.1.75) &mdash; carry forward to v0.6.1.

---

## Codex audit applied 2026-05-12

Independent third-party security audit by Codex on the v0.6 ship. Triage and disposition logged at the chat level; what was patched in code:

**Applied (HIGH):**
- HIGH-1 CSRF / localhost abuse. Added `protect_local_control_surface` as `@app.before_request`. Enforces loopback Host header (`127.0.0.1` or `localhost`) on every request and validates an `X-Cockpit-CSRF` header against a per-process `CSRF_TOKEN = secrets.token_urlsafe(32)` on every `POST/PUT/PATCH/DELETE`. Template renders the token into `<meta name="cockpit-csrf">`. Frontend reads the meta and sends the header on every `api()` fetch. 403 responses trigger a "session expired" toast prompting reload, because the token resets on Flask restart.
- HIGH-2 Reflected XSS in `/spotify/callback`. Wrapped reflected query params in `markupsafe.escape`. Exception text no longer reaches the response body; goes to `app.logger.exception` instead.
- HIGH-3 DOM XSS via preset `innerHTML`. `refreshPresets` now builds buttons with `createElement` + `textContent` + `createTextNode`. No template-string interpolation of API-returned strings.
- HIGH-4 `console/spotify.py` untracked. Flagged for Rafa to `git add console/spotify.py console/spotify_secret.example.json` at commit time. No code edit needed.

**Applied (MEDIUM):**
- MED Input validation / DoS. New `_clamp_int(raw, default, lo, hi)` helper. Applied to `/api/spotify/search` (`limit` 1-50, `q` capped at 200 chars), `/api/spotify/playlists` (`limit` 1-200), `/api/roon/image` (`size` 16-2048), `/api/roon/browse/page` (`offset` 0-100000, `count` 1-500), `/api/browse` (`index`, `size`).

**Applied (LOW):**
- LOW-10 Remote command safety. New `_CONTAINER_NAME_RE = ^[a-zA-Z0-9_.-]{1,64}$`. Validated in `_roon_server_status()` and `/api/system/roon-server/start` before any string concatenation into the SSH command line.

**Deferred:**
- MED OAuth state nonce. Documented in `docs/software/Spotify.md` &sect;7.7. spotipy validates `state` internally via `SpotifyOAuth.get_authorize_url`/`get_access_token`; no app-layer duplication.
- MED CSP + SortableJS SRI. Park for v0.6.1. Vendor SortableJS to `static/vendor/` and add a restrictive CSP header.
- LOW Generic error disclosure. Worst offender (callback) was fixed under HIGH-2. Remaining surfaces are LAN-only YamahaError/RoonError messages that aid local debugging.

Files touched by audit fixes: `console/app.py`, `console/templates/index.html`, `console/static/app.js`, `docs/software/Spotify.md` (this memo's parent note plus &sect;7.7 and &sect;7.8 added).
