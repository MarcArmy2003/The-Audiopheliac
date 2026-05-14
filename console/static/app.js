// Audiopheliac Cockpit v0.7 — Full Spectrum, intent-driven
//
// Core principle: source is a consequence of a Play action, not an input.
// The user picks WHAT to play (Library item, Spotify track, Net Radio
// preset) and WHERE (Roon zone). The Cockpit infers and applies the
// Yamaha source, the Spotify Connect target, the transport, and the
// metadata binding.
//
// v0.7 changes from v0.6:
//   - Two-column fixed layout; drag/restore and card-hide removed.
//   - Master volume back in Yamaha card (not Now Playing).
//   - Library card unifies Roon browse and Spotify behind tabs.
//   - Per-zone volume sliders in Roon Zones card.
//   - Topbar live clock.
//   - Shuffle / Repeat t-toggle pills (Spotify state).
//   - Mute and Power as single t-toggle / cycling button.
//   - Up Next reads from /api/roon/queue endpoint.

const POLL_STATUS_MS  = 2500;
const POLL_ROON_MS    = 2500;
const POLL_SPOTIFY_MS = 4000;
const POLL_ACTIVE_MS  = 3000;
const POLL_UPNEXT_MS  = 5000;

const YAMAHA_IP = document.body.dataset.yamahaIp || '192.168.1.191';

// v0.7: no hidden-cards or card-order keys (fixed layout).
const ACTIVE_ZONE_KEY    = 'audiopheliac.cockpit.activeZoneId.v1';
const SPOTIFY_TARGET_KEY = 'audiopheliac.cockpit.spotifyTargetDeviceId.v1';

// Zone preference order. Cockpit picks the first available match.
const ZONE_PREFERENCE = ['Family Room — Yamaha', 'Studio · AIR HUB', 'Family Room — Bose'];

const LIBRARY_HOME_HIDE = new Set([
  'my live radio',
]);

const state = {
  config: {
    enabled_sources: [],
    preferred_zones: [],
    net_radio_suggestions: [],
    spotify_configured: false,
    spotify_authorized: false,
  },
  volumeMin: 0, volumeMax: 161, volumeStep: 1,
  inputList: [], currentInput: null,
  power: null, mute: false, volume: 0,
  roonState: 'disconnected', roonError: null, roonCoreName: null,
  zones: [],
  activeZoneId: localStorage.getItem(ACTIVE_ZONE_KEY) || null,
  spotify: {
    authorized: false,
    nowPlaying: null,
    devices: [],
    playlists: [],
    selectedDeviceId: localStorage.getItem(SPOTIFY_TARGET_KEY) || null,
    shuffleState: false,
    repeatState: 'off',      // 'off' | 'context' | 'track'
  },
  system: {
    bridge: 'unknown',
    server: 'unknown',
    yamaha: 'unknown',
  },
  active: {
    engine: 'yamaha', yamaha_source: null, yamaha_power: null,
    spotify_device: null, roon_zone: null, roon_zone_id: null,
  },
};

let sliderDirty = false;
let sliderDirtyTimer = null;

// Active tab in the Library card: 'roon' or 'spotify'
let activeLibTab = 'roon';
// Last Spotify search query rendered in the library tab
let lastSpotifyResults = null;

// Per-zone volume slider dirty tracking: zone_id -> timer
const zoneVolDirtyTimers = new Map();

// ----- HTTP -----
const CSRF_TOKEN =
  (document.querySelector('meta[name="cockpit-csrf"]') || {}).content || '';

let _csrfStaleNoticed = false;
function _noticeCsrfStale() {
  if (_csrfStaleNoticed) return;
  _csrfStaleNoticed = true;
  flashToast('Cockpit session expired (Flask restarted). Reload the page.');
}

async function api(path, opts = {}) {
  const r = await fetch(path, {
    method: opts.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Cockpit-CSRF': CSRF_TOKEN,
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (r.status === 403) {
    _noticeCsrfStale();
    return { ok: false, error: 'csrf token stale (Flask was restarted)' };
  }
  try {
    return await r.json();
  } catch (e) {
    return { ok: false, error: 'non-JSON response (status ' + r.status + ')' };
  }
}

const _recentToasts = new Map();
function flashToast(msg) {
  const now = Date.now();
  for (const [k, t] of _recentToasts) {
    if (now - t > 4000) _recentToasts.delete(k);
  }
  if (_recentToasts.has(msg)) return;
  _recentToasts.set(msg, now);

  let host = document.getElementById('toast-host');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toast-host';
    host.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:50;display:flex;flex-direction:column;gap:0.4rem;pointer-events:none;max-width:380px;';
    document.body.appendChild(host);
  }
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = 'background:var(--ink-2);color:var(--paper);border:1px solid var(--hairline-2);border-radius:var(--r-md);padding:0.55rem 0.85rem;font-size:0.85rem;box-shadow:0 8px 24px rgba(0,0,0,0.45);pointer-events:auto;';
  host.appendChild(t);
  t.addEventListener('click', () => { t.remove(); });
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 240ms'; }, 4500);
  setTimeout(() => { t.remove(); }, 5000);
}

// ----- Topbar clock -----
function startClock() {
  function tick() {
    const el = document.getElementById('topbar-clock');
    if (!el) return;
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    el.textContent = h + ':' + m;
  }
  tick();
  const now = new Date();
  const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(() => { tick(); setInterval(tick, 60000); }, msToNextMinute);
}

// ----- Topbar pills -----
function markYamahaStatus(ok) {
  const dot = document.getElementById('status-dot');
  if (!dot) return;
  dot.classList.toggle('ok', ok);
  dot.classList.toggle('err', !ok);
  const pill = document.getElementById('topbar-yamaha');
  if (pill) pill.classList.toggle('err', !ok);
}

function renderRoonBanner() {
  const el = document.getElementById('topbar-roon');
  if (!el) return;
  el.className = 'topbar-pill';
  switch (state.roonState) {
    case 'connected':
      el.textContent = 'Roon · ' + (state.roonCoreName || 'connected');
      el.classList.add('ok');
      break;
    case 'waiting_for_auth':
      el.textContent = 'Roon · enable extension';
      el.classList.add('warn');
      break;
    case 'discovering':
      el.textContent = 'Roon · discovering';
      el.classList.add('warn');
      break;
    case 'error':
      el.textContent = 'Roon · ' + (state.roonError || 'error');
      el.classList.add('err');
      break;
    default:
      el.textContent = 'Roon · ' + state.roonState;
  }
}

function renderSpotifyPill() {
  const el = document.getElementById('topbar-spotify');
  if (!el) return;
  el.className = 'topbar-pill';
  if (!state.config.spotify_configured) {
    el.textContent = 'Spotify · unconfigured';
    return;
  }
  if (!state.spotify.authorized) {
    el.innerHTML = 'Spotify · <a href="/spotify/auth" style="color:inherit;text-decoration:underline;">Connect</a>';
    el.classList.add('warn');
    return;
  }
  const np = state.spotify.nowPlaying;
  if (np && np.is_playing) {
    el.textContent = 'Spotify · playing';
    el.classList.add('spotify-ok');
  } else {
    el.textContent = 'Spotify · idle';
    el.classList.add('ok');
  }
}

function pctFromVolume(v) {
  const span = state.volumeMax - state.volumeMin || 1;
  return Math.round(((v - state.volumeMin) / span) * 100);
}

// ----- System pills -----
function renderSystemPill(elId, label, st, clickAction) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.className = 'topbar-pill';
  if (st === 'not_installed' || st === 'missing') {
    el.classList.add('system-missing');
    el.textContent = label + ' · missing';
    el.style.display = '';
    return;
  }
  if (st === 'stopped') {
    el.classList.add('system-stopped');
    el.textContent = 'Start ' + label;
    el.style.display = '';
    if (clickAction) el.onclick = clickAction;
    return;
  }
  if (st === 'starting') {
    el.classList.add('system-starting');
    el.textContent = label + ' · starting';
    el.style.display = '';
    return;
  }
  if (st === 'running') {
    el.style.display = 'none';
    return;
  }
  el.style.display = 'none';
}

async function startRoonBridge() {
  try {
    flashToast('Starting Roon Bridge.');
    const r = await api('/api/system/roon-bridge/start', { method: 'POST' });
    if (!r.ok) throw new Error(r.error || 'start failed');
    setTimeout(refreshSystemBootstrap, 1500);
    setTimeout(refreshRoonStatus, 3000);
    setTimeout(refreshZones, 5000);
  } catch (e) {
    flashToast('Roon Bridge start failed: ' + (e.message || e));
  }
}

async function startRoonServer() {
  try {
    flashToast('Starting Roon Server on the NAS.');
    const r = await api('/api/system/roon-server/start', { method: 'POST' });
    if (!r.ok) throw new Error(r.error || 'start failed');
    setTimeout(refreshSystemBootstrap, 3000);
    setTimeout(refreshRoonStatus, 8000);
    setTimeout(refreshZones, 12000);
  } catch (e) {
    flashToast('Roon Server start failed: ' + (e.message || e));
  }
}

async function refreshSystemBootstrap() {
  try {
    const r = await api('/api/system/bootstrap');
    if (!r.ok) return;
    state.system.bridge = (r.roon_bridge || {}).state || 'unknown';
    state.system.server = (r.roon_server || {}).state || 'unknown';
    state.system.yamaha = (r.yamaha || {}).state || 'unknown';
    renderSystemPill('topbar-bridge', 'Bridge', state.system.bridge, startRoonBridge);
    renderSystemPill('topbar-server', 'Server', state.system.server, startRoonServer);
  } catch (e) { /* ignore */ }
}

// ----- Yamaha: source list -----
function renderInputList() {
  const host = document.getElementById('input-list');
  if (!host) return;
  host.innerHTML = '';
  if (!state.inputList.length) {
    host.innerHTML = '<span class="muted">No sources reported.</span>';
    return;
  }
  const enabled = state.config.enabled_sources || [];
  const filterOn = enabled.length > 0;
  const list = filterOn
    ? state.inputList.filter(name => enabled.includes(name))
    : state.inputList;

  for (const name of list) {
    const b = document.createElement('button');
    b.className = 'src-btn' + (name === state.currentInput ? ' active' : '');
    b.textContent = name.replace(/_/g, ' ');
    b.addEventListener('click', async () => {
      const r = await api('/api/input', { method: 'POST', body: { name } });
      if (r && !r.ok) flashToast('Input switch failed: ' + (r.error || 'unknown'));
      await refreshStatus();
    });
    host.appendChild(b);
  }
  if (filterOn && state.currentInput && !enabled.includes(state.currentInput)) {
    const b = document.createElement('button');
    b.className = 'source-btn active';
    b.textContent = state.currentInput.replace(/_/g, ' ') + ' *';
    b.title = 'Currently active but not in your enabled-sources filter';
    host.appendChild(b);
  }
}

// ----- Yamaha: power toggle -----
function renderPowerToggle() {
  const btn = document.getElementById('btn-power-toggle');
  const label = document.getElementById('power-state-label');
  const sub = document.getElementById('power-sub');
  if (!btn) return;
  const p = (state.power || '').toLowerCase();
  const isOn = p === 'on';
  btn.dataset.state = isOn ? 'on' : 'off';
  if (label) label.textContent = isOn ? 'On' : 'Standby';
  if (sub) sub.textContent = p || 'unknown';
  const dot = btn.querySelector('.power-dot');
  if (dot) {
    dot.classList.toggle('on', isOn);
    dot.classList.toggle('off', !isOn);
  }
}

// ----- Yamaha: mute toggle -----
function renderMuteToggle() {
  const btn = document.getElementById('btn-mute');
  const label = document.getElementById('mute-state-label');
  if (btn) btn.dataset.state = state.mute ? 'on' : 'off';
  if (label) label.textContent = state.mute ? 'Muted' : 'Off';
}

async function refreshStatus() {
  try {
    const s = await api('/api/status');
    if (!s.ok) throw new Error(s.error || 'status failed');
    markYamahaStatus(true);
    state.volumeMin  = s.volume_min;
    state.volumeMax  = s.volume_max;
    state.volumeStep = s.volume_step;
    state.inputList  = s.input_list || [];
    state.currentInput = s.input;
    state.power = s.power;
    state.mute  = s.mute;
    state.volume = s.volume;

    renderPowerToggle();
    renderMuteToggle();

    const slider = document.getElementById('vol-slider');
    if (slider) {
      slider.min  = state.volumeMin;
      slider.max  = state.volumeMax;
      slider.step = state.volumeStep;
      if (!sliderDirty) slider.value = state.volume;
    }
    const pctEl = document.getElementById('vol-pct');
    if (pctEl) {
      pctEl.textContent = pctFromVolume(state.volume) + '%' + (state.mute ? ' (muted)' : '');
    }
    renderInputList();
  } catch (e) {
    markYamahaStatus(false);
  }
}

// ----- Yamaha: presets -----
async function refreshPresets() {
  try {
    const r = await api('/api/presets');
    const host = document.getElementById('preset-list');
    if (!host) return;
    if (!r.ok) {
      host.innerHTML = '<span class="muted">Presets unavailable right now.</span>';
      return;
    }
    host.innerHTML = '';
    let any = false;
    let i = 1;
    for (const p of r.presets || []) {
      if (p && p.input && p.input !== 'unknown' && p.text) {
        const b = document.createElement('button');
        b.className = 'preset';
        const num = document.createElement('span');
        num.className = 'preset-num';
        num.textContent = 'P' + i;
        b.append(num, document.createTextNode(p.text));
        const n = i;
        b.addEventListener('click', () => playFromNetRadioPreset(n));
        host.appendChild(b);
        any = true;
      }
      i++;
    }
    if (!any) {
      host.innerHTML = '<span class="muted">No presets saved on the receiver yet. See suggestions below.</span>';
    }
  } catch (e) { /* ignore */ }
}

// ----- Net Radio suggestions -----
function renderSuggestions() {
  const host = document.getElementById('suggest-list');
  if (!host) return;
  const list = state.config.net_radio_suggestions || [];
  if (!list.length) {
    host.innerHTML = '<span class="muted">No suggestions configured.</span>';
    return;
  }
  host.innerHTML = '';
  for (const s of list) {
    const card = document.createElement('div');
    card.className = 'suggest-card';
    const name = document.createElement('div');
    name.className = 'suggest-name'; name.textContent = s.name;
    const kind = document.createElement('div');
    kind.className = 'suggest-kind'; kind.textContent = s.kind || '';
    const meta = document.createElement('div');
    meta.className = 'suggest-meta'; meta.textContent = s.city || '';
    const actions = document.createElement('div');
    actions.className = 'suggest-actions';
    const copyName = document.createElement('button');
    copyName.textContent = 'Copy name';
    copyName.addEventListener('click', () => copyToClipboard(s.vtuner_search || s.name, copyName));
    const copyUrl = document.createElement('button');
    copyUrl.textContent = 'Copy URL';
    copyUrl.addEventListener('click', () => copyToClipboard(s.stream_url || '', copyUrl));
    actions.appendChild(copyName);
    if (s.stream_url) actions.appendChild(copyUrl);
    card.append(name, kind, meta, actions);
    host.appendChild(card);
  }
}

async function copyToClipboard(text, btnEl) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (_) {}
    document.body.removeChild(ta);
  }
  if (btnEl) {
    const orig = btnEl.textContent;
    btnEl.textContent = 'Copied';
    btnEl.classList.add('copied');
    setTimeout(() => { btnEl.textContent = orig; btnEl.classList.remove('copied'); }, 1200);
  }
}

// ----- Roon: status -----
async function refreshRoonStatus() {
  try {
    const r = await api('/api/roon/status');
    if (!r.ok) return;
    const prev = state.roonState;
    state.roonState  = r.state;
    state.roonError  = r.error;
    state.roonCoreName = r.core_name;
    renderRoonBanner();
    if (prev !== 'connected' && state.roonState === 'connected') {
      await refreshZones();
      if (activeLibTab === 'roon') await libraryHome();
    } else if (prev === 'connected' && state.roonState !== 'connected') {
      renderZones();
      if (activeLibTab === 'roon') setLibraryStatus(roonHintForState());
    }
  } catch (e) { /* ignore */ }
}

function roonHintForState() {
  switch (state.roonState) {
    case 'waiting_for_auth':
      return 'Open Roon, Settings, Extensions, and enable The Audiopheliac Cockpit.';
    case 'discovering': return 'Looking for the Roon Core on the LAN.';
    case 'error':       return 'Roon error: ' + (state.roonError || 'unknown');
    default:            return 'Roon: ' + state.roonState;
  }
}

function setLibraryStatus(msg) {
  const list = document.getElementById('lib-list');
  if (list) list.innerHTML = '<span class="muted">' + msg + '</span>';
  const crumb = document.getElementById('library-crumb');
  if (crumb) crumb.textContent = '—';
}

// ----- Roon: zones with per-zone volume sliders -----
function renderZones() {
  const host = document.getElementById('zone-list');
  const meta = document.getElementById('zone-meta');
  if (!host) return;
  host.innerHTML = '';

  if (state.roonState !== 'connected') {
    host.innerHTML = '<span class="muted">' + roonHintForState() + '</span>';
    // Show reconnect and clear-auth buttons when not connected
    const btnRow = document.createElement('div');
    btnRow.style.cssText = 'margin-top:0.5rem;display:flex;gap:0.4rem;flex-wrap:wrap;';

    const reconnBtn = document.createElement('button');
    reconnBtn.className = 'primary-btn';
    reconnBtn.textContent = 'Reconnect';
    reconnBtn.addEventListener('click', async () => {
      reconnBtn.disabled = true; reconnBtn.textContent = 'Connecting...';
      try {
        const r = await api('/api/roon/reconnect', { method: 'POST' });
        if (!r.ok) throw new Error(r.error || 'reconnect failed');
        flashToast('Roon reconnect requested.');
        setTimeout(refreshRoonStatus, 2000);
        setTimeout(refreshZones, 4000);
      } catch (e) {
        flashToast('Reconnect failed: ' + (e.message || e));
      } finally {
        reconnBtn.disabled = false; reconnBtn.textContent = 'Reconnect';
      }
    });

    const clearBtn = document.createElement('button');
    clearBtn.className = 'ghost-btn';
    clearBtn.textContent = 'Clear auth & reconnect';
    clearBtn.title = 'Deletes the saved Roon token and starts a fresh authorization. Use when stuck in "discovering" or "error" after a Roon Server reinstall.';
    clearBtn.addEventListener('click', async () => {
      clearBtn.disabled = true; clearBtn.textContent = 'Clearing...';
      try {
        const r = await api('/api/roon/clear-auth', { method: 'POST' });
        if (!r.ok) throw new Error(r.error || 'clear failed');
        flashToast('Token cleared. Open Roon Remote → Settings → Extensions and enable The Audiopheliac Cockpit.');
        setTimeout(refreshRoonStatus, 2000);
      } catch (e) {
        flashToast('Clear auth failed: ' + (e.message || e));
      } finally {
        clearBtn.disabled = false; clearBtn.textContent = 'Clear auth & reconnect';
      }
    });

    btnRow.append(reconnBtn, clearBtn);
    host.appendChild(btnRow);
    if (meta) meta.textContent = 'offline';
    return;
  }

  const preferredCount = (state.config.preferred_zones || []).length;
  const showStaleResync = preferredCount > 0 && state.zones.length > 0 &&
                          state.zones.length < preferredCount;

  if (!state.zones.length) {
    host.innerHTML = `
      <span class="muted">Roon Core is connected but reporting zero outputs. Either an output got disabled in Roon Remote (Settings &rsaquo; Audio), or the Cockpit&rsquo;s WebSocket to the Core is wedged. Reconnect tries the second case without leaving the Cockpit.</span>
      <div style="margin-top:0.5rem;display:flex;gap:0.4rem;">
        <button class="primary-btn" id="btn-roon-reconnect">Reconnect Roon</button>
      </div>
    `;
    const btn = document.getElementById('btn-roon-reconnect');
    if (btn) {
      btn.addEventListener('click', async () => {
        btn.disabled = true; btn.textContent = 'Reconnecting...';
        try {
          const r = await api('/api/roon/reconnect', { method: 'POST' });
          if (!r.ok) throw new Error(r.error || 'reconnect failed');
          flashToast('Roon reconnect requested. Zones should repopulate in a few seconds.');
          setTimeout(refreshRoonStatus, 2000);
          setTimeout(refreshZones, 4000);
        } catch (e) {
          flashToast('Reconnect failed: ' + (e.message || e));
        } finally {
          btn.disabled = false; btn.textContent = 'Reconnect Roon';
        }
      });
    }
    if (meta) meta.textContent = '0 zones';
    return;
  }

  const preferred = state.config.preferred_zones || [];
  const filterOn  = preferred.length > 0;
  const matchesPreferred = (z) =>
    preferred.some(p => (z.display_name || '').toLowerCase().includes(p.toLowerCase()));
  const sortedZones = [...state.zones].sort((a, b) => {
    if (filterOn) {
      const am = matchesPreferred(a), bm = matchesPreferred(b);
      if (am !== bm) return am ? -1 : 1;
    }
    if (a.zone_id === state.activeZoneId) return -1;
    if (b.zone_id === state.activeZoneId) return 1;
    return (a.display_name || '').localeCompare(b.display_name || '');
  });
  const shown = filterOn ? sortedZones.filter(matchesPreferred) : sortedZones;
  if (meta) meta.textContent = filterOn
    ? `${shown.length} of ${state.zones.length} zones`
    : `${state.zones.length} zones`;

  for (const z of shown) {
    const isActive   = z.zone_id === state.activeZoneId;
    const isPlaying  = z.state && z.state === 'playing';
    const vol        = z.volume || {};
    const hasVolume  = typeof vol.value === 'number' && typeof vol.max === 'number' && vol.max > 0;

    // Zone row wrapper
    const row = document.createElement('div');
    row.className = 'zone-row' + (isActive ? ' active' : '') + (isPlaying ? ' playing' : '');

    // Left: clickable zone selector
    const selector = document.createElement('button');
    selector.className = 'zone-selector';
    selector.type = 'button';

    const led = document.createElement('span');
    led.className = 'zone-led';

    const info = document.createElement('div');
    info.className = 'zone-info';
    const zName = document.createElement('span');
    zName.className = 'zone-name';
    zName.textContent = z.display_name || '(unnamed)';
    const zOut = document.createElement('span');
    zOut.className = 'zone-out';
    zOut.textContent = (z.outputs || []).join(', ') || '—';
    info.append(zName, zOut);

    const zState = document.createElement('span');
    zState.className = 'zone-state';
    zState.textContent = z.state || 'idle';

    selector.append(led, info, zState);
    selector.addEventListener('click', () => {
      state.activeZoneId = z.zone_id;
      localStorage.setItem(ACTIVE_ZONE_KEY, z.zone_id);
      renderZones();
      refreshNowPlaying();
      if (activeLibTab === 'roon') libraryHome();
    });

    row.appendChild(selector);

    // Right: volume slider (only if the zone reports volume data)
    if (hasVolume) {
      const volWrap = document.createElement('div');
      volWrap.className = 'zone-vol';

      const slider = document.createElement('input');
      slider.type  = 'range';
      slider.className = 'zone-vol-slider';
      slider.min   = vol.min || 0;
      slider.max   = vol.max;
      slider.value = vol.value;
      slider.title = 'Zone volume: ' + vol.value;

      slider.addEventListener('input', (e) => {
        slider.title = 'Zone volume: ' + e.target.value;
      });
      slider.addEventListener('change', async (e) => {
        const level = Number(e.target.value);
        const zoneId = z.zone_id;
        // Debounce: cancel prior timer for this zone
        if (zoneVolDirtyTimers.has(zoneId)) {
          clearTimeout(zoneVolDirtyTimers.get(zoneId));
        }
        const timer = setTimeout(async () => {
          zoneVolDirtyTimers.delete(zoneId);
          try {
            const r = await api('/api/roon/zone-volume', {
              method: 'POST',
              body: { zone_id: zoneId, level },
            });
            if (!r.ok) throw new Error(r.error || 'volume failed');
          } catch (err) {
            flashToast('Zone volume failed: ' + (err.message || err));
          }
        }, 300);
        zoneVolDirtyTimers.set(zoneId, timer);
      });

      // Muted indicator
      if (vol.is_muted) {
        const mutedBadge = document.createElement('span');
        mutedBadge.className = 'zone-muted-badge';
        mutedBadge.textContent = 'muted';
        volWrap.appendChild(mutedBadge);
      }
      volWrap.appendChild(slider);
      row.appendChild(volWrap);
    }

    host.appendChild(row);
  }

  if (showStaleResync) {
    const resync = document.createElement('button');
    resync.className = 'ghost-btn';
    resync.style.cssText = 'margin-top:0.55rem;align-self:flex-start;font-size:0.8rem;';
    resync.textContent = '+ Resync (expected ' + preferredCount + ', seeing ' + state.zones.length + ')';
    resync.addEventListener('click', async () => {
      resync.disabled = true; resync.textContent = 'Resyncing...';
      try {
        const r = await api('/api/roon/reconnect', { method: 'POST' });
        if (!r.ok) throw new Error(r.error || 'reconnect failed');
        flashToast('Roon reconnect requested. Zones should fully repopulate.');
        setTimeout(refreshRoonStatus, 2000);
        setTimeout(refreshZones, 5000);
      } catch (e) {
        flashToast('Resync failed: ' + (e.message || e));
      }
    });
    host.appendChild(resync);
  }
}

function pickPreferredZone(zones) {
  for (const wanted of ZONE_PREFERENCE) {
    const w = wanted.toLowerCase();
    const hit = zones.find(z => (z.display_name || '').toLowerCase().includes(w));
    if (hit) return hit.zone_id;
  }
  return zones.length ? zones[0].zone_id : null;
}

async function refreshZones() {
  try {
    const r = await api('/api/roon/zones');
    if (!r.ok) return;
    state.zones = r.zones || [];
    if (!state.activeZoneId && state.zones.length) {
      state.activeZoneId = pickPreferredZone(state.zones);
      if (state.activeZoneId) localStorage.setItem(ACTIVE_ZONE_KEY, state.activeZoneId);
    }
    if (state.activeZoneId && !state.zones.find(z => z.zone_id === state.activeZoneId)) {
      state.activeZoneId = pickPreferredZone(state.zones);
      if (state.activeZoneId) localStorage.setItem(ACTIVE_ZONE_KEY, state.activeZoneId);
    }
    renderZones();
    refreshNowPlayingZoneLabel();
  } catch (e) { /* ignore */ }
}

function refreshNowPlayingZoneLabel() {
  const label = document.getElementById('now-zone-label');
  if (!label) return;
  const z = state.zones.find(z => z.zone_id === state.activeZoneId);
  label.textContent = z ? `Zone: ${z.display_name}` : 'pick a zone to start';
}

// ----- Active engine detection -----
async function refreshActiveEngine() {
  try {
    const r = await api('/api/playback/active');
    if (!r.ok) return;
    state.active = {
      engine:          r.engine || 'yamaha',
      yamaha_source:   r.yamaha_source,
      yamaha_power:    r.yamaha_power,
      spotify_device:  r.spotify_device || null,
      roon_zone:       r.roon_zone || null,
      roon_zone_id:    r.roon_zone_id || null,
    };
    renderEngineTag();
  } catch (e) { /* ignore */ }
}

function renderEngineTag() {
  const tag = document.getElementById('now-engine-tag');
  const src = document.getElementById('now-source');
  if (!tag) return;
  const e = state.active.engine || 'yamaha';
  tag.className = 'nmv-engine engine-' + e;
  let label = 'engine · idle';
  if (e === 'spotify') label = 'engine · spotify';
  else if (e === 'roon') label = 'engine · roon';
  else if (e === 'yamaha' && state.active.yamaha_source) {
    label = 'engine · yamaha (' + (state.active.yamaha_source || '').replace(/_/g, ' ') + ')';
  } else if (e === 'yamaha') label = 'engine · yamaha';
  tag.textContent = label;
  if (src) {
    if (e === 'spotify' && state.active.spotify_device) {
      src.textContent = 'connect target · ' + state.active.spotify_device;
    } else if (e === 'roon' && state.active.roon_zone) {
      src.textContent = 'zone · ' + state.active.roon_zone;
    } else {
      src.textContent = '';
    }
  }
}

// ----- Now Playing hub -----
async function refreshNowPlaying() {
  refreshNowPlayingZoneLabel();
  let np = null;
  const engine = state.active.engine;

  // Prefer Roon zone metadata only when the zone is currently PLAYING.
  const activeZone = state.zones.find(z => z.zone_id === state.activeZoneId);
  const zoneIsPlaying = !!(activeZone && (activeZone.state || '').toLowerCase() === 'playing');
  if (state.roonState === 'connected' && state.activeZoneId && zoneIsPlaying) {
    try {
      const r = await api('/api/roon/now-playing?zone_id=' + encodeURIComponent(state.activeZoneId));
      if (r.ok && r.now_playing && r.now_playing.title) {
        np = { source: 'roon', ...r.now_playing };
      }
    } catch (e) {}
  }

  // Spotify is the next preference when actively playing.
  const spotifyIsPlaying = !!(state.spotify.nowPlaying && state.spotify.nowPlaying.is_playing);
  if (!np && spotifyIsPlaying) {
    const sp = state.spotify.nowPlaying;
    np = {
      source: 'spotify',
      title:  sp.track_name,
      artist: sp.track_artists,
      album:  sp.track_album,
      art_url: sp.art_url,
      seek_position: sp.progress_ms ? sp.progress_ms / 1000 : null,
      length: sp.track_duration_ms ? sp.track_duration_ms / 1000 : null,
      state:  sp.is_playing ? 'playing' : 'paused',
    };
  }

  if (!np || !np.title) {
    try {
      const r = await api('/api/play-info');
      if (r.ok && r.play) {
        const p = r.play;
        if (p.track || p.artist || p.album) {
          np = {
            source: 'yamaha',
            title: p.track, artist: p.artist, album: p.album,
            albumart_url: p.albumart_url,
            play_time: p.play_time, total_time: p.total_time,
          };
        }
      }
    } catch (e) {}
  }

  document.getElementById('now-track').textContent  = (np && np.title)  || 'Nothing playing yet.';
  document.getElementById('now-artist').textContent = (np && np.artist) || '';
  document.getElementById('now-album').textContent  = (np && np.album)  || '';

  const metaEl = document.getElementById('now-meta');
  if (metaEl) {
    if (np && np.format) {
      metaEl.textContent = [np.format, np.sample_rate, np.bitrate].filter(Boolean).join(' · ');
    } else if (np && np.signal_path_quality) {
      metaEl.textContent = np.signal_path_quality;
    } else {
      metaEl.textContent = '';
    }
  }

  const elapsed = np && (np.seek_position ?? np.play_time);
  const total   = np && (np.length ?? np.total_time);
  document.getElementById('now-elapsed').textContent = fmtTime(elapsed);
  document.getElementById('now-total').textContent   = fmtTime(total);
  const fill = document.getElementById('now-scrub-fill');
  if (fill) {
    if (elapsed && total && total > 0) {
      const pct = Math.max(0, Math.min(100, (elapsed / total) * 100));
      fill.style.inset = `0 ${100 - pct}% 0 0`;
    } else {
      fill.style.inset = '0 100% 0 0';
    }
  }

  const pp = document.getElementById('btn-playpause');
  if (pp) {
    let playing = false;
    if (engine === 'spotify' && state.spotify.nowPlaying) {
      playing = !!state.spotify.nowPlaying.is_playing;
    } else if (engine === 'roon') {
      const zone = state.zones.find(z => z.zone_id === state.activeZoneId);
      playing = !!(zone && zone.state === 'playing') || (np && np.state === 'playing');
    } else {
      playing = np && np.state === 'playing';
    }
    pp.textContent = playing ? '⏸' : '▶';
  }

  const art = document.getElementById('now-art');
  if (art) {
    let artUrl = null;
    if (np && np.source === 'spotify' && np.art_url) {
      artUrl = np.art_url;
    } else if (np && np.source === 'roon' && np.image_key) {
      try {
        const r = await api('/api/roon/image?key=' + encodeURIComponent(np.image_key) + '&size=512');
        if (r.ok && r.url) artUrl = r.url;
      } catch (e) {}
    } else if (np && np.albumart_url) {
      artUrl = np.albumart_url.startsWith('http')
        ? np.albumart_url
        : 'http://' + YAMAHA_IP + np.albumart_url;
    }
    if (artUrl) { art.src = artUrl; art.classList.add('shown'); }
    else { art.classList.remove('shown'); art.removeAttribute('src'); }
  }
}

function fmtTime(secs) {
  if (!secs || secs < 0) return '--:--';
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  const m = Math.floor(secs / 60);
  return `${m}:${s}`;
}

// ----- Shuffle / Repeat toggles -----
function renderShuffleRepeat() {
  const shuffleBtn = document.getElementById('btn-shuffle');
  const repeatBtn  = document.getElementById('btn-repeat');
  if (shuffleBtn) {
    const on = state.spotify.shuffleState;
    shuffleBtn.dataset.state = on ? 'on' : 'off';
    shuffleBtn.textContent = on ? 'Shuffle on' : 'Shuffle off';
  }
  if (repeatBtn) {
    const rs = state.spotify.repeatState;
    const isOn = rs !== 'off';
    repeatBtn.dataset.state = isOn ? 'on' : 'off';
    const label = rs === 'track' ? 'Repeat 1' : rs === 'context' ? 'Repeat all' : 'Repeat off';
    repeatBtn.textContent = label;
  }
}

function wireShuffleRepeat() {
  const shuffleBtn = document.getElementById('btn-shuffle');
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', async () => {
      if (!state.spotify.authorized) { flashToast('Connect Spotify first.'); return; }
      const newState = !state.spotify.shuffleState;
      try {
        const r = await api('/api/spotify/playback/shuffle', {
          method: 'POST', body: { state: newState },
        });
        if (!r.ok) throw new Error(r.error || 'shuffle failed');
        state.spotify.shuffleState = newState;
        renderShuffleRepeat();
      } catch (e) {
        flashToast('Shuffle failed: ' + (e.message || e));
      }
    });
  }

  const repeatBtn = document.getElementById('btn-repeat');
  if (repeatBtn) {
    repeatBtn.addEventListener('click', async () => {
      if (!state.spotify.authorized) { flashToast('Connect Spotify first.'); return; }
      // Cycle: off → context → track → off
      const cycle = { 'off': 'context', 'context': 'track', 'track': 'off' };
      const newState = cycle[state.spotify.repeatState] || 'off';
      try {
        const r = await api('/api/spotify/playback/repeat', {
          method: 'POST', body: { state: newState },
        });
        if (!r.ok) throw new Error(r.error || 'repeat failed');
        state.spotify.repeatState = newState;
        renderShuffleRepeat();
      } catch (e) {
        flashToast('Repeat failed: ' + (e.message || e));
      }
    });
  }
}

// ----- Library: tabs -----
function wireTabs() {
  document.querySelectorAll('.tab[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab === activeLibTab) return;
      activeLibTab = tab;
      document.querySelectorAll('.tab[data-tab]').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === activeLibTab);
      });
      if (activeLibTab === 'roon') {
        document.getElementById('lib-back').style.display = '';
        document.getElementById('lib-home').style.display = '';
        libraryHome();
      } else {
        // Spotify tab: hide Roon nav, show Spotify content
        document.getElementById('lib-back').style.display = 'none';
        document.getElementById('lib-home').style.display = 'none';
        renderSpotifyLibrary();
      }
    });
  });
}

// ----- Library: Roon browse -----
const libState = { list: null };

async function libraryHome() {
  if (state.roonState !== 'connected') { setLibraryStatus(roonHintForState()); return; }
  if (!state.activeZoneId) { setLibraryStatus('Pick a Roon zone to start.'); return; }
  try {
    const r = await api('/api/roon/browse/root', { method: 'POST', body: { zone_id: state.activeZoneId } });
    if (!r.ok) throw new Error(r.error || 'browse failed');
    renderLibraryList(r.list, { home: true });
  } catch (e) { setLibraryStatus('Couldn’t load Roon home: ' + (e.message || e)); }
}

async function libraryDescend(itemKey, hint) {
  if (!state.activeZoneId) return;
  const h = (hint || '').toLowerCase();
  if (h === 'action' || h === 'action_list') {
    return playFromLibrary(itemKey);
  }
  try {
    const r = await api('/api/roon/browse/descend', {
      method: 'POST', body: { zone_id: state.activeZoneId, item_key: itemKey },
    });
    if (!r.ok) throw new Error(r.error || 'descend failed');
    renderLibraryList(r.list);
  } catch (e) { setLibraryStatus('Couldn’t open that item: ' + (e.message || e)); }
}

async function libraryBack() {
  if (!state.activeZoneId) return;
  try {
    const r = await api('/api/roon/browse/back', { method: 'POST', body: { zone_id: state.activeZoneId } });
    if (!r.ok) throw new Error(r.error || 'back failed');
    renderLibraryList(r.list);
  } catch (e) { setLibraryStatus('Couldn’t back out: ' + (e.message || e)); }
}

async function librarySearch(query) {
  if (activeLibTab === 'spotify') {
    await spotifySearchInTab(query);
    return;
  }
  // Roon tab
  if (!state.activeZoneId) { setLibraryStatus('Pick a Roon zone to start.'); return; }
  if (!query) { libraryHome(); return; }
  try {
    const r = await api('/api/roon/search', {
      method: 'POST', body: { zone_id: state.activeZoneId, query },
    });
    if (!r.ok) throw new Error(r.error || 'search failed');
    renderLibraryList(r.list);
  } catch (e) { setLibraryStatus('Search failed: ' + (e.message || e)); }
}

function renderLibraryList(list, opts = {}) {
  if (activeLibTab !== 'roon') return; // Don't clobber Spotify tab
  libState.list = list || {};
  let items = (list && list.items) || [];
  if (opts.home) {
    items = items.filter(it => !LIBRARY_HOME_HIDE.has((it.title || '').toLowerCase()));
  }

  const host   = document.getElementById('lib-list');
  const crumb  = document.getElementById('library-crumb');
  if (!host) return;
  if (crumb) crumb.textContent = (list && list.list && list.list.title)
    || (list && list.title)
    || (opts.home ? 'Roon home' : '');
  host.innerHTML = '';

  if (!items.length) {
    host.innerHTML = '<span class="muted">Nothing at this level.</span>';
    return;
  }
  for (const item of items) {
    const hint = item.hint || '';
    if (hint === 'header') {
      const h = document.createElement('div');
      h.className = 'lib-section';
      h.textContent = item.title || '';
      host.appendChild(h);
      continue;
    }
    const row       = document.createElement('button');
    const hintLower = (hint || '').toLowerCase();
    const isAction  = hintLower === 'action' || hintLower === 'action_list';
    row.className   = 'lib-item' + (isAction ? ' action' : '');

    const thumb = document.createElement('div');
    thumb.className = 'lib-thumb';
    if (item.image_url) {
      const img = document.createElement('img');
      img.alt = ''; img.src = item.image_url;
      thumb.appendChild(img);
    }
    row.appendChild(thumb);

    const txt  = document.createElement('div');
    txt.className = 'lib-text';
    const main = document.createElement('div');
    main.className = 'lib-main';
    main.textContent = item.title || '(untitled)';
    txt.appendChild(main);
    if (item.subtitle) {
      const sub = document.createElement('div');
      sub.className = 'lib-sub';
      sub.textContent = item.subtitle;
      txt.appendChild(sub);
    }
    if (isAction) {
      const kind = document.createElement('span');
      kind.className = 'lib-kind';
      kind.textContent = 'play';
      txt.appendChild(kind);
    }
    row.appendChild(txt);
    row.addEventListener('click', () => libraryDescend(item.item_key, hint));
    host.appendChild(row);
  }
}

function wireLibrary() {
  const searchBtn = document.getElementById('lib-search-btn');
  const searchQ   = document.getElementById('lib-q');
  if (searchBtn && searchQ) {
    searchBtn.addEventListener('click', () => librarySearch(searchQ.value.trim()));
    searchQ.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') librarySearch(e.target.value.trim());
    });
  }
  const backBtn = document.getElementById('lib-back');
  if (backBtn) backBtn.addEventListener('click', libraryBack);
  const homeBtn = document.getElementById('lib-home');
  if (homeBtn) homeBtn.addEventListener('click', () => {
    const q = document.getElementById('lib-q');
    if (q) q.value = '';
    libraryHome();
  });
}

// ----- Library: Spotify tab content -----
function renderSpotifyLibrary() {
  const host  = document.getElementById('lib-list');
  const crumb = document.getElementById('library-crumb');
  if (!host) return;

  if (!state.config.spotify_configured) {
    host.innerHTML = '<span class="muted">Spotify is not configured. Add the client secret to console/spotify_secret.json and restart.</span>';
    if (crumb) crumb.textContent = 'Spotify';
    setSpotifyAuthPrompt(false);
    return;
  }
  if (!state.spotify.authorized) {
    host.innerHTML = '';
    if (crumb) crumb.textContent = 'Spotify';
    setSpotifyAuthPrompt(true);
    return;
  }

  setSpotifyAuthPrompt(false);
  if (crumb) crumb.textContent = 'Spotify library';

  if (lastSpotifyResults) {
    renderSpotifyResultsInTab(lastSpotifyResults);
    return;
  }

  renderSpotifyPlaylistsInTab();
}

function renderSpotifyPlaylistsInTab() {
  const host = document.getElementById('lib-list');
  if (!host) return;
  host.innerHTML = '';
  const list = state.spotify.playlists || [];
  if (!list.length) {
    host.innerHTML = '<span class="muted">No playlists yet. Build one in Spotify and it shows up here.</span>';
    return;
  }
  for (const pl of list) {
    const row = document.createElement('button');
    row.className = 'lib-item';

    const thumb = document.createElement('div');
    thumb.className = 'lib-thumb';
    if (pl.art_url) {
      const img = document.createElement('img');
      img.alt = ''; img.src = pl.art_url;
      thumb.appendChild(img);
    }
    const txt = document.createElement('div');
    txt.className = 'lib-text';
    const main = document.createElement('div');
    main.className = 'lib-main';
    main.textContent = pl.name || '(untitled)';
    txt.appendChild(main);
    const sub = document.createElement('div');
    sub.className = 'lib-sub';
    sub.textContent = (pl.tracks ? pl.tracks + ' tracks' : '')
      + (pl.owner ? ' · ' + pl.owner : '');
    txt.appendChild(sub);
    const kind = document.createElement('span');
    kind.className = 'lib-kind';
    kind.textContent = 'playlist';
    txt.appendChild(kind);

    row.append(thumb, txt);
    row.addEventListener('click', () => {
      if (!pl.uri) return;
      playFromSpotify({ context_uri: pl.uri });
    });
    host.appendChild(row);
  }
}

async function spotifySearchInTab(query) {
  if (!state.spotify.authorized) {
    flashToast('Connect Spotify first.');
    return;
  }
  const host = document.getElementById('lib-list');
  if (!host) return;
  if (!query) {
    lastSpotifyResults = null;
    renderSpotifyLibrary();
    return;
  }
  host.innerHTML = '<span class="muted" style="padding:0.5rem;">Searching.</span>';
  try {
    const r = await api('/api/spotify/search?q=' + encodeURIComponent(query) + '&limit=8');
    if (!r.ok) throw new Error(r.error || 'search failed');
    lastSpotifyResults = r.results || {};
    renderSpotifyResultsInTab(lastSpotifyResults);
  } catch (e) {
    host.innerHTML = '<span class="muted" style="padding:0.5rem;">Spotify search failed: ' + (e.message || e) + '</span>';
  }
}

function renderSpotifyResultsInTab(results) {
  const host = document.getElementById('lib-list');
  if (!host) return;
  host.innerHTML = '';
  const sections = [
    ['track',    'Tracks'],
    ['album',    'Albums'],
    ['artist',   'Artists'],
    ['playlist', 'Playlists'],
  ];
  let any = false;
  for (const [kind, label] of sections) {
    const items = (results[kind] || []).filter(Boolean);
    if (!items.length) continue;
    any = true;
    const h = document.createElement('div');
    h.className = 'lib-section';
    h.textContent = label;
    host.appendChild(h);
    for (const it of items) {
      const row = document.createElement('button');
      row.className = 'lib-item action';

      const thumb = document.createElement('div');
      thumb.className = 'lib-thumb';
      if (it.art_url) {
        const img = document.createElement('img');
        img.alt = ''; img.src = it.art_url;
        thumb.appendChild(img);
      }

      const txt = document.createElement('div');
      txt.className = 'lib-text';
      const main = document.createElement('div');
      main.className = 'lib-main';
      main.textContent = it.name || '(untitled)';
      txt.appendChild(main);
      if (it.subtitle) {
        const sub = document.createElement('div');
        sub.className = 'lib-sub';
        sub.textContent = it.subtitle;
        txt.appendChild(sub);
      }
      const kindEl = document.createElement('span');
      kindEl.className = 'lib-kind';
      kindEl.textContent = 'play';
      txt.appendChild(kindEl);

      row.append(thumb, txt);
      row.addEventListener('click', () => {
        if (!it.uri) return;
        if (kind === 'track') {
          playFromSpotify({ uris: [it.uri] });
        } else {
          playFromSpotify({ context_uri: it.uri });
        }
      });
      host.appendChild(row);
    }
  }
  if (!any) {
    host.innerHTML = '<span class="muted" style="padding:0.5rem;">No matches.</span>';
  }
}

// ----- Spotify device picker modal -----
function pickSpotifyDeviceModal() {
  return new Promise(async (resolve) => {
    let devices = state.spotify.devices || [];
    try {
      const d = await api('/api/spotify/devices');
      if (d.ok && d.devices) devices = d.devices;
    } catch (e) {}
    const modal = document.getElementById('sp-device-modal');
    const list  = document.getElementById('sp-device-modal-list');
    if (!modal || !list) { resolve(null); return; }
    list.innerHTML = '';
    if (!devices.length) {
      const empty = document.createElement('div');
      empty.className = 'muted';
      empty.style.cssText = 'padding:0.85rem;text-align:center;';
      empty.textContent = 'Spotify reports no available devices right now. Power up the Yamaha, switch its input to Spotify, then retry.';
      list.appendChild(empty);
    } else {
      for (const d of devices) {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'modal-device';
        const left = document.createElement('div');
        const nm = document.createElement('div');
        nm.textContent = d.name || '(unnamed)';
        const meta = document.createElement('div');
        meta.className = 'modal-device-meta';
        meta.textContent = [d.type, d.is_active ? 'active' : ''].filter(Boolean).join(' · ');
        left.append(nm, meta);
        const hint = document.createElement('span');
        hint.className = 'lib-kind';
        hint.textContent = 'pick';
        hint.style.opacity = '1';
        row.append(left, hint);
        row.addEventListener('click', () => {
          modal.style.display = 'none';
          resolve(d.id);
        });
        list.appendChild(row);
      }
    }
    const close = () => { modal.style.display = 'none'; resolve(null); };
    document.getElementById('sp-device-modal-close').onclick = close;
    document.getElementById('sp-device-modal-cancel').onclick = close;
    modal.style.display = 'flex';
  });
}

// ----- Smart play routing -----
async function playFromLibrary(itemKey) {
  if (!state.activeZoneId) {
    flashToast('Pick a Roon zone first.');
    return;
  }
  try {
    const r = await api('/api/playback/play-to', {
      method: 'POST',
      body: { intent: { kind: 'roon-item', item_key: itemKey }, zone_id: state.activeZoneId },
    });
    if (!r.ok) throw new Error(r.error || 'play failed');
    if (r.source_switched) flashToast('Yamaha switched to ' + r.source_switched + '.');
    if (r.auto_played === false) {
      flashToast('Roon didn’t auto-fire a Play action for that item. Try descending into it and clicking the Play option explicitly.');
    }
    setTimeout(() => { refreshNowPlaying(); refreshActiveEngine(); }, 600);
  } catch (e) {
    flashToast('Couldn’t play that: ' + (e.message || e));
  }
}

async function playFromSpotify({ context_uri, uris, offset, _retry } = {}) {
  if (!state.spotify.authorized) {
    flashToast('Connect Spotify first.');
    return;
  }
  const body = { intent: { kind: 'spotify-uri' } };
  if (context_uri) body.intent.context_uri = context_uri;
  if (uris)        body.intent.uris = uris;
  if (offset)      body.intent.offset = offset;
  if (state.spotify.selectedDeviceId) body.device_id = state.spotify.selectedDeviceId;
  let r;
  try {
    r = await api('/api/playback/play-to', { method: 'POST', body });
  } catch (e) {
    flashToast('Spotify play failed: ' + (e.message || e));
    return;
  }
  if (r.ok) {
    flashToast('Sent to Yamaha via Spotify Connect.');
    setTimeout(() => { refreshSpotifyStatus(); refreshActiveEngine(); refreshNowPlaying(); }, 800);
    return;
  }
  if (!_retry && /can't see the Yamaha|doesn't see the Yamaha/i.test(r.error || '')) {
    const picked = await pickSpotifyDeviceModal();
    if (picked) {
      state.spotify.selectedDeviceId = picked;
      localStorage.setItem(SPOTIFY_TARGET_KEY, picked);
      return playFromSpotify({ context_uri, uris, offset, _retry: true });
    }
    return;
  }
  flashToast('Spotify play failed: ' + (r.error || 'unknown'));
}

async function playFromNetRadioPreset(num) {
  try {
    const r = await api('/api/playback/play-to', {
      method: 'POST',
      body: { intent: { kind: 'net-radio-preset', preset_num: num } },
    });
    if (!r.ok) throw new Error(r.error || 'preset failed');
    flashToast('Yamaha switched to Net Radio and recalled preset ' + num + '.');
    setTimeout(() => { refreshStatus(); refreshNowPlaying(); refreshActiveEngine(); }, 600);
  } catch (e) {
    flashToast('Preset failed: ' + (e.message || e));
  }
}

// ----- Spotify status -----
async function refreshSpotifyStatus() {
  if (!state.config.spotify_configured) {
    state.spotify.authorized = false;
    renderSpotifyPill();
    setSpotifyAuthPrompt(true, 'Spotify is not configured. Add the client secret to console/spotify_secret.json and restart.');
    if (activeLibTab === 'spotify') renderSpotifyLibrary();
    return;
  }
  try {
    const r = await api('/api/spotify/status');
    if (!r.ok) {
      state.spotify.authorized = false;
      setSpotifyAuthPrompt(true);
      renderSpotifyPill();
      return;
    }
    state.spotify.authorized = !!r.authorized;
    state.config.spotify_authorized = state.spotify.authorized;
    state.spotify.nowPlaying = r.now_playing || null;
    state.spotify.devices    = r.devices || [];

    // Extract shuffle/repeat state from now_playing
    const np = state.spotify.nowPlaying;
    if (np) {
      if (typeof np.shuffle_state === 'boolean') {
        state.spotify.shuffleState = np.shuffle_state;
      }
      if (np.repeat_state) {
        state.spotify.repeatState = np.repeat_state;
      }
    }

    setSpotifyAuthPrompt(!state.spotify.authorized);
    renderSpotifyPill();
    renderShuffleRepeat();

    if (activeLibTab === 'spotify') renderSpotifyLibrary();
  } catch (e) { /* ignore */ }
}

async function refreshSpotifyPlaylists() {
  if (!state.spotify.authorized) return;
  try {
    const r = await api('/api/spotify/playlists?limit=50');
    if (!r.ok) return;
    state.spotify.playlists = r.playlists || [];
    if (activeLibTab === 'spotify' && !lastSpotifyResults) {
      renderSpotifyPlaylistsInTab();
    }
  } catch (e) { /* ignore */ }
}

function setSpotifyAuthPrompt(show, customMsg) {
  const el = document.getElementById('sp-auth-prompt');
  if (!el) return;
  el.style.display = show ? 'flex' : 'none';
  if (customMsg) {
    const p = el.querySelector('p');
    if (p) p.textContent = customMsg;
  }
}

// ----- Up Next: reads from /api/roon/queue -----
async function refreshUpNext() {
  const host = document.getElementById('upnext-list');
  const meta = document.getElementById('upnext-meta');
  if (!host) return;

  const engine = state.active.engine;

  // Spotify engine: show current track as "now" and a note
  if (engine === 'spotify' && state.spotify.nowPlaying) {
    const sp = state.spotify.nowPlaying;
    if (sp.track_name) {
      host.innerHTML = '';
      const row = document.createElement('div');
      row.className = 'queue-item now';

      const num = document.createElement('span');
      num.className = 'q-num';
      num.textContent = '▶';

      const txt = document.createElement('div');
      txt.className = 'q-text';
      const main = document.createElement('div');
      main.className = 'q-main';
      main.textContent = sp.track_name;
      const sub = document.createElement('div');
      sub.className = 'q-sub';
      sub.textContent = sp.track_artists || '';
      txt.append(main, sub);

      const len = document.createElement('span');
      len.className = 'q-len';
      len.textContent = sp.track_duration_ms
        ? fmtTime(sp.track_duration_ms / 1000)
        : '';

      row.append(num, txt, len);
      host.appendChild(row);

      const tail = document.createElement('span');
      tail.className = 'muted';
      tail.style.cssText = 'padding:0.5rem 0.55rem;font-size:0.78rem;';
      tail.textContent = 'Spotify decides what plays next from the album or playlist context.';
      host.appendChild(tail);
      if (meta) meta.textContent = 'spotify';
      return;
    }
  }

  // Roon engine: pull from /api/roon/queue
  if (state.roonState === 'connected' && state.activeZoneId) {
    try {
      const r = await api('/api/roon/queue?zone_id=' + encodeURIComponent(state.activeZoneId));
      if (r.ok && r.queue && r.queue.length) {
        host.innerHTML = '';
        let i = 1;
        for (const item of r.queue) {
          const row = document.createElement('div');
          row.className = 'queue-item' + (i === 1 ? ' now' : '');

          const num = document.createElement('span');
          num.className = 'q-num';
          num.textContent = i === 1 ? '▶' : i;

          const txt = document.createElement('div');
          txt.className = 'q-text';
          const main = document.createElement('div');
          main.className = 'q-main';
          main.textContent = item.title || '(untitled)';
          txt.appendChild(main);
          if (item.subtitle) {
            const sub = document.createElement('div');
            sub.className = 'q-sub';
            sub.textContent = item.subtitle;
            txt.appendChild(sub);
          }

          const len = document.createElement('span');
          len.className = 'q-len';
          len.textContent = item.duration ? fmtTime(item.duration) : '';

          row.append(num, txt, len);
          host.appendChild(row);
          i++;
          if (i > 12) break; // cap display at 12 items
        }
        if (meta) meta.textContent = 'roon queue (' + r.queue.length + ')';
        return;
      }
    } catch (e) { /* fall through to idle state */ }
  }

  host.innerHTML = '<span class="muted">Queue lives here once Roon or Spotify is playing.</span>';
  if (meta) meta.textContent = 'idle';
}

// ----- Wiring -----
function wireReceiver() {
  // v0.7: single power toggle cycles On / Standby
  const powerToggle = document.getElementById('btn-power-toggle');
  if (powerToggle) {
    powerToggle.addEventListener('click', async () => {
      const p = (state.power || '').toLowerCase();
      const isOn = p === 'on';
      const endpoint = isOn ? '/api/power/off' : '/api/power/on';
      state.power = isOn ? 'standby' : 'on';
      renderPowerToggle();
      const r = await api(endpoint, { method: 'POST' });
      if (r && !r.ok) flashToast('Power toggle failed: ' + (r.error || 'unknown'));
      refreshStatus();
    });
  }
}

function wireMasterVolume() {
  const volUp   = document.getElementById('btn-vol-up');
  const volDown = document.getElementById('btn-vol-down');
  const muteBtn = document.getElementById('btn-mute');

  if (volUp)   volUp.addEventListener('click',   () => api('/api/volume/up',   { method: 'POST' }).then(r => { if (r && !r.ok) flashToast('Volume up failed: ' + (r.error || 'unknown')); return refreshStatus(); }));
  if (volDown) volDown.addEventListener('click', () => api('/api/volume/down', { method: 'POST' }).then(r => { if (r && !r.ok) flashToast('Volume down failed: ' + (r.error || 'unknown')); return refreshStatus(); }));
  if (muteBtn) muteBtn.addEventListener('click', () => api('/api/mute/toggle', { method: 'POST' }).then(r => { if (r && !r.ok) flashToast('Mute failed: ' + (r.error || 'unknown')); return refreshStatus(); }));

  const slider = document.getElementById('vol-slider');
  if (!slider) return;
  slider.addEventListener('input', () => {
    sliderDirty = true;
    const pctEl = document.getElementById('vol-pct');
    if (pctEl) pctEl.textContent = pctFromVolume(Number(slider.value)) + '%';
  });
  slider.addEventListener('change', async () => {
    await api('/api/volume/set', { method: 'POST', body: { value: Number(slider.value) } });
    clearTimeout(sliderDirtyTimer);
    sliderDirtyTimer = setTimeout(() => { sliderDirty = false; refreshStatus(); }, 400);
  });
}

function wireTransport() {
  for (const b of document.querySelectorAll('[data-tx]')) {
    b.addEventListener('click', async () => {
      const action = b.dataset.tx;
      const engine = state.active.engine;
      try {
        if (engine === 'spotify' && state.spotify.authorized) {
          let sp = action;
          if (action === 'playpause') {
            const playing = state.spotify.nowPlaying && state.spotify.nowPlaying.is_playing;
            sp = playing ? 'pause' : 'play';
          }
          await api('/api/spotify/playback/' + sp, { method: 'POST', body: {} });
        } else if (engine === 'roon' && state.roonState === 'connected' && state.activeZoneId) {
          await api('/api/roon/transport/' + action, {
            method: 'POST', body: { zone_id: state.activeZoneId },
          });
        } else if (state.roonState === 'connected' && state.activeZoneId) {
          await api('/api/roon/transport/' + action, {
            method: 'POST', body: { zone_id: state.activeZoneId },
          });
        } else {
          const yxc = action === 'playpause' ? 'play_pause' : action;
          await api('/api/transport/' + yxc, { method: 'POST' });
        }
      } catch (e) {
        flashToast('Transport failed: ' + (e.message || e));
      }
      setTimeout(() => { refreshNowPlaying(); refreshActiveEngine(); refreshSpotifyStatus(); }, 400);
    });
  }
}

function wireResetLayout() {
  const btn = document.getElementById('btn-reset-layout');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!confirm('Reload the Cockpit?')) return;
    location.reload();
  });
}

// ----- Boot -----
async function loadConfig() {
  try {
    const r = await api('/api/config');
    if (r.ok) {
      state.config.enabled_sources       = r.enabled_sources || [];
      state.config.preferred_zones       = r.preferred_zones || [];
      state.config.net_radio_suggestions = r.net_radio_suggestions || [];
      state.config.spotify_configured    = !!r.spotify_configured;
      state.config.spotify_authorized    = !!r.spotify_authorized;
    }
  } catch (e) { /* ignore */ }
}

async function start() {
  startClock();
  wireTabs();
  wireLibrary();
  wireReceiver();
  wireMasterVolume();
  wireTransport();
  wireShuffleRepeat();
  wireResetLayout();

  renderRoonBanner();
  renderZones();
  if (activeLibTab === 'roon') setLibraryStatus(roonHintForState());

  await loadConfig();
  renderSuggestions();
  renderSpotifyPill();
  renderShuffleRepeat();

  await refreshStatus();
  await refreshPresets();
  await refreshRoonStatus();
  await refreshActiveEngine();
  await refreshSpotifyStatus();
  await refreshSpotifyPlaylists();
  await refreshNowPlaying();
  await refreshUpNext();
  await refreshSystemBootstrap();

  setInterval(refreshStatus,           POLL_STATUS_MS);
  setInterval(refreshRoonStatus,       POLL_ROON_MS);
  setInterval(refreshZones,            POLL_ROON_MS * 3);
  setInterval(refreshActiveEngine,     POLL_ACTIVE_MS);
  setInterval(refreshSpotifyStatus,    POLL_SPOTIFY_MS);
  setInterval(refreshNowPlaying,       POLL_STATUS_MS);
  setInterval(refreshUpNext,           POLL_UPNEXT_MS);
  setInterval(refreshSystemBootstrap,  POLL_SPOTIFY_MS * 2);  // 8s
}

start();
