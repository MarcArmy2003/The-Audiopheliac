// Audiopheliac Cockpit v0.5 — Full Spectrum, intent-driven
//
// Core principle: source is a consequence of a Play action, not an input.
// The user picks WHAT to play (Library item, Spotify track, Net Radio
// preset) and WHERE (Roon zone). The Cockpit infers and applies the
// Yamaha source, the Spotify Connect target, the transport, and the
// metadata binding.
//
// Now Playing is the hub: master volume, transport, and metadata bind
// to whichever engine is actually producing sound. Yamaha Source card
// is demoted to default-hidden override.

const POLL_STATUS_MS  = 2500;
const POLL_ROON_MS    = 2500;
const POLL_SPOTIFY_MS = 4000;
const POLL_ACTIVE_MS  = 3000;
const POLL_UPNEXT_MS  = 5000;

const YAMAHA_IP = document.body.dataset.yamahaIp || '192.168.1.191';

// Bumped to v5 in v0.6: Yamaha Source card is visible by default again
// because hiding it was a debugging dead-end whenever smart play-routing
// failed. Reset preferences are needed so old default-hidden state clears.
const HIDDEN_CARDS_KEY = 'audiopheliac.cockpit.hiddenCards.v5';
const CARD_ORDER_KEY   = 'audiopheliac.cockpit.cardOrder.v3';
const ACTIVE_ZONE_KEY  = 'audiopheliac.cockpit.activeZoneId.v1';
const SPOTIFY_TARGET_KEY = 'audiopheliac.cockpit.spotifyTargetDeviceId.v1';

// Zone preference order. Cockpit picks the first available match.
const ZONE_PREFERENCE = ['Family Room — Yamaha', 'Studio · AIR HUB', 'Family Room — Bose'];

const CARD_NAMES = {
  now:      'Now playing',
  receiver: 'Receiver',
  zone:     'Roon zones',
  library:  'Library',
  spotify:  'Spotify',
  preset:   'Net Radio',
  upnext:   'Up next',
  input:    'Yamaha source (override)',
};

// v0.6: Yamaha Source card visible by default. Empty default-hidden set.
const DEFAULT_HIDDEN = new Set([]);

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
    selectedDeviceId: localStorage.getItem(SPOTIFY_TARGET_KEY) || null,
    playlists: [],
  },
  system: {
    bridge: 'unknown',
    server: 'unknown',
    yamaha: 'unknown',
  },
  active: { engine: 'yamaha', yamaha_source: null, yamaha_power: null,
            spotify_device: null, roon_zone: null, roon_zone_id: null },
};

let sliderDirty = false;
let sliderDirtyTimer = null;
let spVolDirty = false;
let spVolDirtyTimer = null;

// ----- HTTP -----
const CSRF_TOKEN =
  (document.querySelector('meta[name="cockpit-csrf"]') || {}).content || '';

let _csrfStaleNoticed = false;
function _noticeCsrfStale() {
  if (_csrfStaleNoticed) return;
  _csrfStaleNoticed = true;
  // Per Codex audit 2026-05-12 HIGH-1: CSRF token is per-process. After a
  // Flask restart, existing tabs hit 403 until they reload.
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

const _recentToasts = new Map(); // msg -> timestamp; dedupe inside 4s window
function flashToast(msg) {
  // Dedupe: same message within 4s collapses to a single toast.
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
  // Click to dismiss.
  t.addEventListener('click', () => { t.remove(); });
  setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity 240ms'; }, 4500);
  setTimeout(() => { t.remove(); }, 5000);
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

// ----- System pills (Bucket B + C + E) -----
function renderSystemPill(elId, label, state, clickAction) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.className = 'topbar-pill';
  if (state === 'not_installed' || state === 'missing') {
    el.classList.add('system-missing');
    el.textContent = label + ' · missing';
    el.style.display = '';
    return;
  }
  if (state === 'stopped') {
    el.classList.add('system-stopped');
    el.textContent = 'Start ' + label;
    el.style.display = '';
    if (clickAction) el.onclick = clickAction;
    return;
  }
  if (state === 'starting') {
    el.classList.add('system-starting');
    el.textContent = label + ' · starting';
    el.style.display = '';
    return;
  }
  if (state === 'running') {
    // Healthy: hide the pill to reduce noise.
    el.style.display = 'none';
    return;
  }
  // unknown or unconfigured: hide.
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

// ----- Yamaha source list (default-hidden override card) -----
function renderInputList() {
  const host = document.getElementById('input-list');
  const meta = document.getElementById('input-meta');
  if (!host) return;
  host.innerHTML = '';
  if (!state.inputList.length) {
    host.innerHTML = '<span class="muted">No sources reported.</span>';
    if (meta) meta.textContent = '0 sources';
    return;
  }
  const enabled = state.config.enabled_sources || [];
  const filterOn = enabled.length > 0;
  const list = filterOn
    ? state.inputList.filter(name => enabled.includes(name))
    : state.inputList;
  if (meta) meta.textContent = filterOn
    ? `${list.length} of ${state.inputList.length} sources`
    : `${state.inputList.length} sources`;

  for (const name of list) {
    const b = document.createElement('button');
    b.className = 'input-btn' + (name === state.currentInput ? ' active' : '');
    b.textContent = name.replace(/_/g, ' ');
    b.addEventListener('click', async () => {
      await api('/api/input', { method: 'POST', body: { name } });
      await refreshStatus();
    });
    host.appendChild(b);
  }
  if (filterOn && state.currentInput && !enabled.includes(state.currentInput)) {
    const b = document.createElement('button');
    b.className = 'input-btn active';
    b.textContent = state.currentInput.replace(/_/g, ' ') + ' *';
    b.title = 'Currently active but not in your enabled-sources filter';
    host.appendChild(b);
  }
}

function renderPowerButtons() {
  const onBtn = document.getElementById('btn-power-on');
  const offBtn = document.getElementById('btn-power-off');
  const head = document.getElementById('power-state');
  if (!onBtn || !offBtn) return;
  const p = (state.power || '').toLowerCase();
  onBtn.classList.toggle('active', p === 'on');
  offBtn.classList.toggle('active', p === 'standby');
  if (head) head.textContent = p || 'unknown';
}

async function refreshStatus() {
  try {
    const s = await api('/api/status');
    if (!s.ok) throw new Error(s.error || 'status failed');
    markYamahaStatus(true);
    state.volumeMin = s.volume_min;
    state.volumeMax = s.volume_max;
    state.volumeStep = s.volume_step;
    state.inputList = s.input_list || [];
    state.currentInput = s.input;
    state.power = s.power;
    state.mute = s.mute;
    state.volume = s.volume;

    renderPowerButtons();

    const slider = document.getElementById('vol-slider');
    if (slider) {
      slider.min = state.volumeMin;
      slider.max = state.volumeMax;
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

// ----- Yamaha-side presets -----
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
    let any = false; let i = 1;
    for (const p of r.presets || []) {
      if (p && p.input && p.input !== 'unknown' && p.text) {
        // Codex audit 2026-05-12 HIGH-3: build the button with createElement +
        // textContent rather than innerHTML; preset text comes from the YXC API
        // and is functionally untrusted markup.
        const b = document.createElement('button');
        b.className = 'preset-btn';
        const prefix = document.createElement('span');
        prefix.style.cssText =
          'color:var(--paper-muted);font-family:var(--font-mono);font-size:0.7rem;margin-right:6px;';
        prefix.textContent = 'P' + i;
        b.append(prefix, document.createTextNode(p.text));
        const num = i;
        b.addEventListener('click', () => playFromNetRadioPreset(num));
        host.appendChild(b);
        any = true;
      }
      i++;
    }
    if (!any) host.innerHTML = '<span class="muted">No presets saved on the receiver yet. See suggestions below.</span>';
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

// ----- Roon: zones -----
async function refreshRoonStatus() {
  try {
    const r = await api('/api/roon/status');
    if (!r.ok) return;
    const prev = state.roonState;
    state.roonState = r.state;
    state.roonError = r.error;
    state.roonCoreName = r.core_name;
    renderRoonBanner();
    if (prev !== 'connected' && state.roonState === 'connected') {
      await refreshZones();
      await libraryHome();
    } else if (prev === 'connected' && state.roonState !== 'connected') {
      renderZones();
      setLibraryStatus(roonHintForState());
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
  const list = document.getElementById('library-list');
  if (list) list.innerHTML = '<span class="muted">' + msg + '</span>';
  const crumb = document.getElementById('library-crumb');
  if (crumb) crumb.textContent = '—';
}

function renderZones() {
  const host = document.getElementById('zone-list');
  const meta = document.getElementById('zone-meta');
  if (!host) return;
  host.innerHTML = '';
  if (state.roonState !== 'connected') {
    host.innerHTML = '<span class="muted">' + roonHintForState() + '</span>';
    if (meta) meta.textContent = 'offline';
    return;
  }
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
        btn.disabled = true;
        btn.textContent = 'Reconnecting...';
        try {
          const r = await api('/api/roon/reconnect', { method: 'POST' });
          if (!r.ok) throw new Error(r.error || 'reconnect failed');
          flashToast('Roon reconnect requested. Zones should repopulate in a few seconds.');
          setTimeout(refreshRoonStatus, 2000);
          setTimeout(refreshZones, 4000);
        } catch (e) {
          flashToast('Reconnect failed: ' + (e.message || e));
        } finally {
          btn.disabled = false;
          btn.textContent = 'Reconnect Roon';
        }
      });
    }
    if (meta) meta.textContent = '0 zones';
    return;
  }
  const preferred = state.config.preferred_zones || [];
  const filterOn = preferred.length > 0;
  const matchesPreferred = (z) => preferred.some(p => (z.display_name || '').toLowerCase().includes(p.toLowerCase()));
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
    const isActive = z.zone_id === state.activeZoneId;
    const isPlaying = z.state && z.state === 'playing';
    const row = document.createElement('button');
    row.className = 'zone-row' + (isActive ? ' active' : '') + (isPlaying ? ' playing' : '');
    row.innerHTML = `
      <span class="zone-led"></span>
      <div class="zone-title">
        <span class="zone-name"></span>
        <span class="zone-out"></span>
      </div>
      <span class="zone-state"></span>
    `;
    row.querySelector('.zone-name').textContent = z.display_name || '(unnamed)';
    row.querySelector('.zone-out').textContent = (z.outputs || []).join(', ') || '—';
    row.querySelector('.zone-state').textContent = z.state || 'idle';
    row.addEventListener('click', () => {
      state.activeZoneId = z.zone_id;
      localStorage.setItem(ACTIVE_ZONE_KEY, z.zone_id);
      renderZones();
      refreshNowPlaying();
      libraryHome();
    });
    host.appendChild(row);
  }
}

function pickPreferredZone(zones) {
  // Match preferred zone names against display_name (case-insensitive
  // substring) in priority order.
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
      engine: r.engine || 'yamaha',
      yamaha_source: r.yamaha_source,
      yamaha_power: r.yamaha_power,
      spotify_device: r.spotify_device || null,
      roon_zone: r.roon_zone || null,
      roon_zone_id: r.roon_zone_id || null,
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

  // Pull metadata from authoritative engine
  if (engine === 'spotify' && state.spotify.nowPlaying) {
    const sp = state.spotify.nowPlaying;
    np = {
      source: 'spotify',
      title: sp.track_name,
      artist: sp.track_artists,
      album: sp.track_album,
      art_url: sp.art_url,
      seek_position: sp.progress_ms ? sp.progress_ms / 1000 : null,
      length: sp.track_duration_ms ? sp.track_duration_ms / 1000 : null,
      state: sp.is_playing ? 'playing' : 'paused',
    };
  } else if (state.roonState === 'connected' && state.activeZoneId) {
    try {
      const r = await api('/api/roon/now-playing?zone_id=' + encodeURIComponent(state.activeZoneId));
      if (r.ok && r.now_playing) np = { source: 'roon', ...r.now_playing };
    } catch (e) {}
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

  document.getElementById('now-track').textContent = (np && np.title) || 'Nothing playing yet.';
  document.getElementById('now-artist').textContent = (np && np.artist) || '';
  document.getElementById('now-album').textContent  = (np && np.album)  || '';

  const metaEl = document.getElementById('now-meta');
  if (np && np.format) {
    metaEl.textContent = [np.format, np.sample_rate, np.bitrate].filter(Boolean).join(' · ');
  } else if (np && np.signal_path_quality) {
    metaEl.textContent = np.signal_path_quality;
  } else {
    metaEl.textContent = '';
  }

  const elapsed = np && (np.seek_position ?? np.play_time);
  const total = np && (np.length ?? np.total_time);
  document.getElementById('now-elapsed').textContent = fmtTime(elapsed);
  document.getElementById('now-total').textContent = fmtTime(total);
  const fill = document.getElementById('now-scrub-fill');
  if (elapsed && total && total > 0) {
    const pct = Math.max(0, Math.min(100, (elapsed / total) * 100));
    fill.style.inset = `0 ${100 - pct}% 0 0`;
  } else {
    fill.style.inset = '0 100% 0 0';
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

function fmtTime(secs) {
  if (!secs || secs < 0) return '--:--';
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  const m = Math.floor(secs / 60);
  return `${m}:${s}`;
}

// ----- Library (Roon-backed) -----
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
  // Action and action_list items go through smart play-to: the Yamaha
  // source flips first, then roon.select_action auto-resolves the action
  // sub-list ("Play Album" -> auto-fires "Play Now").
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
  if (!state.activeZoneId) { setLibraryStatus('Pick a Roon zone to start.'); return; }
  if (!query) { libraryHome(); return; }
  try {
    const r = await api('/api/roon/search', {
      method: 'POST', body: { zone_id: state.activeZoneId, query: query },
    });
    if (!r.ok) throw new Error(r.error || 'search failed');
    renderLibraryList(r.list);
  } catch (e) { setLibraryStatus('Search failed: ' + (e.message || e)); }
}

function renderLibraryList(list, opts = {}) {
  libState.list = list || {};
  let items = (list && list.items) || [];
  if (opts.home) {
    items = items.filter(it => !LIBRARY_HOME_HIDE.has((it.title || '').toLowerCase()));
  }

  const host = document.getElementById('library-list');
  const crumb = document.getElementById('library-crumb');
  crumb.textContent = (list && list.list && list.list.title) || (list && list.title) || (opts.home ? 'Roon home' : '');
  host.innerHTML = '';

  if (!items.length) {
    host.innerHTML = '<span class="muted">Nothing at this level.</span>';
    return;
  }
  for (const item of items) {
    const hint = item.hint || '';
    if (hint === 'header') {
      const h = document.createElement('div');
      h.className = 'library-section';
      h.textContent = item.title || '';
      host.appendChild(h);
      continue;
    }
    const row = document.createElement('button');
    const hintLower = (hint || '').toLowerCase();
    const isAction = hintLower === 'action' || hintLower === 'action_list';
    row.className = 'library-item' + (isAction ? ' action' : '');
    if (item.image_url) {
      const img = document.createElement('img');
      img.className = 'library-thumb'; img.alt = ''; img.src = item.image_url;
      row.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'library-thumb';
      row.appendChild(ph);
    }
    const txt = document.createElement('div');
    txt.className = 'library-text';
    const main = document.createElement('div');
    main.className = 'library-text-main'; main.textContent = item.title || '(untitled)';
    txt.appendChild(main);
    if (item.subtitle) {
      const sub = document.createElement('div');
      sub.className = 'library-text-sub'; sub.textContent = item.subtitle;
      txt.appendChild(sub);
    }
    row.appendChild(txt);
    if (isAction) {
      const tag = document.createElement('span');
      tag.className = 'library-hint'; tag.textContent = 'play';
      row.appendChild(tag);
    }
    row.addEventListener('click', () => libraryDescend(item.item_key, hint));
    host.appendChild(row);
  }
}

function wireLibrary() {
  document.getElementById('library-search-btn').addEventListener('click', () => {
    librarySearch(document.getElementById('library-q').value.trim());
  });
  document.getElementById('library-q').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') librarySearch(e.target.value.trim());
  });
  document.getElementById('library-back').addEventListener('click', libraryBack);
  document.getElementById('library-home').addEventListener('click', () => {
    document.getElementById('library-q').value = '';
    libraryHome();
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
  if (uris) body.intent.uris = uris;
  if (offset) body.intent.offset = offset;
  if (state.spotify.selectedDeviceId) {
    body.device_id = state.spotify.selectedDeviceId;
  }
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
  // Device not visible. Surface the picker modal so the user picks
  // the correct Spotify Connect target. Choice persists for next plays.
  if (!_retry && /can't see the Yamaha|doesn't see the Yamaha/i.test(r.error || '')) {
    const picked = await pickSpotifyDeviceModal();
    if (picked) {
      state.spotify.selectedDeviceId = picked;
      localStorage.setItem(SPOTIFY_TARGET_KEY, picked);
      return playFromSpotify({ context_uri, uris, offset, _retry: true });
    }
    return; // user cancelled
  }
  flashToast('Spotify play failed: ' + (r.error || 'unknown'));
}

function pickSpotifyDeviceModal() {
  return new Promise(async (resolve) => {
    let devices = state.spotify.devices || [];
    try {
      const d = await api('/api/spotify/devices');
      if (d.ok && d.devices) devices = d.devices;
    } catch (e) {}
    const modal = document.getElementById('sp-device-modal');
    const list = document.getElementById('sp-device-modal-list');
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
        hint.className = 'library-track-hint';
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

// ----- Spotify card -----
async function refreshSpotifyStatus() {
  if (!state.config.spotify_configured) {
    state.spotify.authorized = false;
    renderSpotifyPill();
    setSpotifyAuthPrompt(true, 'Spotify is not configured yet. Add the client secret to console/spotify_secret.json and restart the Cockpit.');
    setSpotifyMeta('unconfigured');
    return;
  }
  try {
    const r = await api('/api/spotify/status');
    if (!r.ok) {
      state.spotify.authorized = false;
      setSpotifyAuthPrompt(true);
      setSpotifyMeta('error');
      renderSpotifyPill();
      return;
    }
    state.spotify.authorized = !!r.authorized;
    state.config.spotify_authorized = state.spotify.authorized;
    state.spotify.nowPlaying = r.now_playing || null;
    state.spotify.devices = r.devices || [];
    setSpotifyAuthPrompt(!state.spotify.authorized);
    if (!state.spotify.authorized) {
      setSpotifyMeta('connect');
    } else {
      const np = state.spotify.nowPlaying;
      setSpotifyMeta(np && np.is_playing ? 'playing' : 'idle');
    }
    renderSpotifyDevices();
    renderSpotifyVolume();
    renderSpotifyPill();
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
function setSpotifyMeta(text) {
  const m = document.getElementById('spotify-meta');
  if (m) m.textContent = text;
}

function renderSpotifyDevices() {
  const sel = document.getElementById('sp-device-select');
  if (!sel) return;
  const devices = state.spotify.devices || [];
  const prev = state.spotify.selectedDeviceId;
  sel.innerHTML = '';
  if (!devices.length) {
    const opt = document.createElement('option');
    opt.value = ''; opt.textContent = 'No Spotify devices visible.';
    sel.appendChild(opt);
    return;
  }
  for (const d of devices) {
    const opt = document.createElement('option');
    opt.value = d.id;
    opt.textContent = d.name + (d.is_active ? ' (active)' : '');
    sel.appendChild(opt);
  }
  const activeDevice = devices.find(d => d.is_active);
  if (prev && devices.find(d => d.id === prev)) {
    sel.value = prev;
  } else if (activeDevice) {
    sel.value = activeDevice.id;
    state.spotify.selectedDeviceId = activeDevice.id;
  }
}

function renderSpotifyVolume() {
  const slider = document.getElementById('sp-vol');
  const pct = document.getElementById('sp-vol-pct');
  if (!slider) return;
  const devices = state.spotify.devices || [];
  const active = devices.find(d => d.is_active);
  const lvl = active && typeof active.volume_percent === 'number' ? active.volume_percent : null;
  if (lvl !== null && !spVolDirty) {
    slider.value = lvl;
    if (pct) pct.textContent = lvl + '%';
  } else if (lvl === null && !spVolDirty) {
    if (pct) pct.textContent = '--%';
  }
}

async function refreshSpotifyPlaylists() {
  if (!state.spotify.authorized) {
    const host = document.getElementById('sp-playlist-grid');
    if (host) host.innerHTML = '<span class="muted">Connect Spotify to load your playlists.</span>';
    return;
  }
  try {
    const r = await api('/api/spotify/playlists?limit=50');
    if (!r.ok) return;
    state.spotify.playlists = r.playlists || [];
    renderSpotifyPlaylists();
  } catch (e) { /* ignore */ }
}

function renderSpotifyPlaylists() {
  const host = document.getElementById('sp-playlist-grid');
  if (!host) return;
  const list = state.spotify.playlists || [];
  host.innerHTML = '';
  if (!list.length) {
    host.innerHTML = '<span class="muted">No playlists yet. Build one in Spotify and it shows up here.</span>';
    return;
  }
  for (const pl of list) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'sp-playlist-card';
    if (pl.art_url) {
      const img = document.createElement('img');
      img.className = 'sp-playlist-art'; img.alt = ''; img.src = pl.art_url;
      card.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'sp-playlist-art';
      card.appendChild(ph);
    }
    const name = document.createElement('div');
    name.className = 'sp-playlist-name'; name.textContent = pl.name || '(untitled)';
    const meta = document.createElement('div');
    meta.className = 'sp-playlist-meta';
    meta.textContent = (pl.tracks ? pl.tracks + ' tracks' : '') + (pl.owner ? ' · ' + pl.owner : '');
    card.append(name, meta);
    card.addEventListener('click', () => {
      if (!pl.uri) return;
      playFromSpotify({ context_uri: pl.uri });
    });
    host.appendChild(card);
  }
}

async function spotifySearch(query) {
  if (!state.spotify.authorized) {
    flashToast('Connect Spotify first.');
    return;
  }
  const host = document.getElementById('sp-results');
  if (!query) { host.innerHTML = ''; return; }
  host.innerHTML = '<span class="muted" style="padding:0.5rem;">Searching.</span>';
  try {
    const r = await api('/api/spotify/search?q=' + encodeURIComponent(query) + '&limit=8');
    if (!r.ok) throw new Error(r.error || 'search failed');
    renderSpotifyResults(r.results || {});
  } catch (e) {
    host.innerHTML = '<span class="muted" style="padding:0.5rem;">Spotify search failed: ' + (e.message || e) + '</span>';
  }
}

function renderSpotifyResults(results) {
  const host = document.getElementById('sp-results');
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
    h.className = 'sp-results-section'; h.textContent = label;
    host.appendChild(h);
    for (const it of items) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'sp-result-item';
      if (it.art_url) {
        const img = document.createElement('img');
        img.className = 'sp-result-thumb'; img.alt = ''; img.src = it.art_url;
        row.appendChild(img);
      } else {
        const ph = document.createElement('div');
        ph.className = 'sp-result-thumb';
        row.appendChild(ph);
      }
      const txt = document.createElement('div');
      txt.className = 'sp-result-text';
      const name = document.createElement('div');
      name.className = 'sp-result-name'; name.textContent = it.name || '(untitled)';
      txt.appendChild(name);
      if (it.subtitle) {
        const sub = document.createElement('div');
        sub.className = 'sp-result-sub'; sub.textContent = it.subtitle;
        txt.appendChild(sub);
      }
      row.appendChild(txt);
      const hint = document.createElement('span');
      hint.className = 'sp-result-hint'; hint.textContent = 'play';
      row.appendChild(hint);
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

function wireSpotify() {
  const btn = document.getElementById('sp-search-btn');
  const q = document.getElementById('sp-q');
  if (btn && q) {
    btn.addEventListener('click', () => spotifySearch(q.value.trim()));
    q.addEventListener('keydown', (e) => { if (e.key === 'Enter') spotifySearch(q.value.trim()); });
  }

  const sel = document.getElementById('sp-device-select');
  if (sel) {
    sel.addEventListener('change', () => {
      state.spotify.selectedDeviceId = sel.value || null;
      if (state.spotify.selectedDeviceId) {
        localStorage.setItem(SPOTIFY_TARGET_KEY, state.spotify.selectedDeviceId);
      } else {
        localStorage.removeItem(SPOTIFY_TARGET_KEY);
      }
    });
  }
  const transfer = document.getElementById('sp-transfer-btn');
  if (transfer) {
    transfer.addEventListener('click', async () => {
      const id = state.spotify.selectedDeviceId;
      if (!id) { flashToast('Pick a Spotify device first.'); return; }
      try {
        const r = await api('/api/spotify/transfer', { method: 'POST', body: { device_id: id, play: true } });
        if (!r.ok) throw new Error(r.error || 'transfer failed');
        flashToast('Spotify playback transferred.');
        setTimeout(refreshSpotifyStatus, 800);
      } catch (e) { flashToast('Transfer failed: ' + (e.message || e)); }
    });
  }

  const vol = document.getElementById('sp-vol');
  if (vol) {
    vol.addEventListener('input', () => {
      spVolDirty = true;
      const pct = document.getElementById('sp-vol-pct');
      if (pct) pct.textContent = vol.value + '%';
    });
    vol.addEventListener('change', async () => {
      try {
        const id = state.spotify.selectedDeviceId || null;
        await api('/api/spotify/volume', { method: 'POST', body: { level: Number(vol.value), device_id: id } });
        clearTimeout(spVolDirtyTimer);
        spVolDirtyTimer = setTimeout(() => { spVolDirty = false; refreshSpotifyStatus(); }, 500);
      } catch (e) { flashToast('Spotify volume failed: ' + (e.message || e)); }
    });
  }
}

// ----- Up Next -----
async function refreshUpNext() {
  const host = document.getElementById('upnext-list');
  const meta = document.getElementById('upnext-meta');
  if (!host) return;
  const engine = state.active.engine;
  if (engine === 'spotify' && state.spotify.nowPlaying) {
    const sp = state.spotify.nowPlaying;
    if (sp.track_name) {
      host.innerHTML = '';
      const row = document.createElement('div');
      row.className = 'upnext-item now';
      const thumb = document.createElement('div');
      thumb.className = 'upnext-thumb';
      if (sp.art_url) {
        const img = document.createElement('img');
        img.style.cssText = 'width:100%;height:100%;border-radius:4px;object-fit:cover;';
        img.src = sp.art_url;
        thumb.appendChild(img);
      }
      const txt = document.createElement('div');
      txt.className = 'upnext-text';
      const name = document.createElement('div');
      name.className = 'upnext-name'; name.textContent = sp.track_name;
      const sub = document.createElement('div');
      sub.className = 'upnext-sub'; sub.textContent = sp.track_artists || '';
      txt.append(name, sub);
      const pos = document.createElement('span');
      pos.className = 'upnext-pos'; pos.textContent = 'now';
      row.append(thumb, txt, pos);
      host.appendChild(row);
      const tail = document.createElement('span');
      tail.className = 'muted';
      tail.style.cssText = 'padding:0.5rem 0.55rem;font-size:0.78rem;';
      tail.textContent = 'Spotify decides what plays next from the album or playlist context.';
      host.appendChild(tail);
      if (meta) meta.textContent = 'spotify queue';
      return;
    }
  }

  if (engine === 'roon' && state.activeZoneId) {
    try {
      const r = await api('/api/roon/now-playing?zone_id=' + encodeURIComponent(state.activeZoneId));
      if (r.ok && r.now_playing && r.now_playing.title) {
        const np = r.now_playing;
        host.innerHTML = '';
        const row = document.createElement('div');
        row.className = 'upnext-item now';
        const thumb = document.createElement('div');
        thumb.className = 'upnext-thumb';
        const txt = document.createElement('div');
        txt.className = 'upnext-text';
        const name = document.createElement('div');
        name.className = 'upnext-name'; name.textContent = np.title;
        const sub = document.createElement('div');
        sub.className = 'upnext-sub'; sub.textContent = [np.artist, np.album].filter(Boolean).join(' · ');
        txt.append(name, sub);
        const pos = document.createElement('span');
        pos.className = 'upnext-pos'; pos.textContent = 'now';
        row.append(thumb, txt, pos);
        host.appendChild(row);
        const tail = document.createElement('span');
        tail.className = 'muted';
        tail.style.cssText = 'padding:0.5rem 0.55rem;font-size:0.78rem;';
        tail.textContent = 'Up next list reads from the Roon zone queue. Full queue surface coming.';
        host.appendChild(tail);
        if (meta) meta.textContent = 'roon zone';
        return;
      }
    } catch (e) {}
  }

  host.innerHTML = '<span class="muted">Queue lives here once Roon or Spotify is playing.</span>';
  if (meta) meta.textContent = 'idle';
}

// ----- Card visibility + drag + reset -----
function getHidden() {
  const raw = localStorage.getItem(HIDDEN_CARDS_KEY);
  if (raw === null) {
    // First visit with v4 key: seed with DEFAULT_HIDDEN.
    setHidden(DEFAULT_HIDDEN);
    return new Set(DEFAULT_HIDDEN);
  }
  try { return new Set(JSON.parse(raw)); }
  catch (e) { return new Set(); }
}
function setHidden(s) { localStorage.setItem(HIDDEN_CARDS_KEY, JSON.stringify([...s])); }

function applyHidden() {
  const hidden = getHidden();
  document.querySelectorAll('[data-card]').forEach((el) => {
    el.classList.toggle('hidden', hidden.has(el.dataset.card));
  });
  const bar = document.getElementById('hidden-cards-bar');
  bar.innerHTML = '';
  [...hidden].forEach((key) => {
    const b = document.createElement('button');
    b.className = 'restore-btn';
    b.textContent = '+ ' + (CARD_NAMES[key] || key);
    b.addEventListener('click', () => {
      const s = getHidden(); s.delete(key); setHidden(s); applyHidden();
    });
    bar.appendChild(b);
  });
}

function wireCardVisibility() {
  document.querySelectorAll('.card-hide').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-card]');
      if (!card) return;
      const s = getHidden();
      s.add(card.dataset.card); setHidden(s); applyHidden();
    });
  });
}

function applyCardOrder() {
  let order = [];
  try { order = JSON.parse(localStorage.getItem(CARD_ORDER_KEY) || '[]'); } catch (e) {}
  if (!order.length) return;
  const grid = document.getElementById('grid');
  const known = new Map();
  grid.querySelectorAll('[data-card]').forEach(el => known.set(el.dataset.card, el));
  for (const key of order) {
    const el = known.get(key);
    if (el) grid.appendChild(el);
  }
  for (const [key, el] of known) {
    if (!order.includes(key)) grid.appendChild(el);
  }
}

function persistCardOrder() {
  const grid = document.getElementById('grid');
  const order = [...grid.querySelectorAll('[data-card]')].map(el => el.dataset.card);
  localStorage.setItem(CARD_ORDER_KEY, JSON.stringify(order));
}

function wireDrag() {
  if (typeof Sortable === 'undefined') return;
  const grid = document.getElementById('grid');
  Sortable.create(grid, {
    handle: '.drag-handle',
    animation: 180,
    ghostClass: 'drop-target',
    dragClass: 'dragging',
    onEnd: persistCardOrder,
  });
}

function wireResetLayout() {
  const btn = document.getElementById('btn-reset-layout');
  if (!btn) return;
  btn.addEventListener('click', () => {
    if (!confirm('Restore all hidden cards and reset card order to default?')) return;
    localStorage.removeItem(HIDDEN_CARDS_KEY);
    localStorage.removeItem(CARD_ORDER_KEY);
    location.reload();
  });
}

// ----- Receiver controls (power only; volume lives in Now Playing) -----
function wireReceiver() {
  document.getElementById('btn-power-on').addEventListener('click', async () => {
    await api('/api/power/on', { method: 'POST' });
    state.power = 'on'; renderPowerButtons();
    refreshStatus();
  });
  document.getElementById('btn-power-off').addEventListener('click', async () => {
    await api('/api/power/off', { method: 'POST' });
    state.power = 'standby'; renderPowerButtons();
    refreshStatus();
  });
}

function wireMasterVolume() {
  document.getElementById('btn-vol-up').addEventListener('click', () =>
    api('/api/volume/up', { method: 'POST' }).then(refreshStatus));
  document.getElementById('btn-vol-down').addEventListener('click', () =>
    api('/api/volume/down', { method: 'POST' }).then(refreshStatus));
  document.getElementById('btn-mute').addEventListener('click', () =>
    api('/api/mute/toggle', { method: 'POST' }).then(refreshStatus));

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
  applyCardOrder();
  wireCardVisibility();
  applyHidden();
  wireResetLayout();
  wireReceiver();
  wireMasterVolume();
  wireTransport();
  wireLibrary();
  wireSpotify();
  renderRoonBanner();
  renderZones();
  setLibraryStatus(roonHintForState());

  await loadConfig();
  renderSuggestions();
  renderSpotifyPill();
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

  wireDrag();
}

start();
