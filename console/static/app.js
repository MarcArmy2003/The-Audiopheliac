// Audiopheliac Cockpit v0.4 — Full Spectrum
//
// Changes vs v0.2/v0.3:
//   • Source filter via config.enabled_sources
//   • Structured zone rows + optional whitelist via config.preferred_zones
//   • Net Radio: prepopulated suggestion list with copy-to-MusicCast helper
//   • Combined Power + Volume + Mute into "Receiver" card; power-button
//     active-class bound to live /api/status power state
//   • Drag-to-reposition via SortableJS, order persisted to localStorage
//   • Hidden-cards restore bar (already existed; restyled), plus a
//     topbar "Reset layout" button that restores order and unhides all
//   • Library home filters out "My Live Radio" per Gill's spec.

const POLL_STATUS_MS = 2500;
const POLL_ROON_MS   = 2500;
const YAMAHA_IP = document.body.dataset.yamahaIp || '192.168.1.191';

const HIDDEN_CARDS_KEY = 'audiopheliac.cockpit.hiddenCards.v3';
const CARD_ORDER_KEY   = 'audiopheliac.cockpit.cardOrder.v1';
const ACTIVE_ZONE_KEY  = 'audiopheliac.cockpit.activeZoneId.v1';

const CARD_NAMES = {
  now:      'Now playing',
  receiver: 'Receiver',
  input:    'Yamaha source',
  zone:     'Roon zones',
  library:  'Library',
  preset:   'Net Radio',
};

const LIBRARY_HOME_HIDE = new Set([
  'my live radio',          // Gill's spec: drop from home
]);

const state = {
  config: {
    enabled_sources: [],
    preferred_zones: [],
    net_radio_suggestions: [],
  },
  volumeMin: 0, volumeMax: 161, volumeStep: 1,
  inputList: [], currentInput: null,
  power: null, mute: false, volume: 0,
  roonState: 'disconnected', roonError: null, roonCoreName: null,
  zones: [],
  activeZoneId: localStorage.getItem(ACTIVE_ZONE_KEY) || null,
};

let sliderDirty = false;
let sliderDirtyTimer = null;

// ----- HTTP -----
async function api(path, opts = {}) {
  const r = await fetch(path, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  return r.json();
}

// ----- Topbar status -----
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
      el.textContent = 'Roon · discovering...';
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

function pctFromVolume(v) {
  const span = state.volumeMax - state.volumeMin || 1;
  return Math.round(((v - state.volumeMin) / span) * 100);
}

// ----- Yamaha source list -----
function renderInputList() {
  const host = document.getElementById('input-list');
  const meta = document.getElementById('input-meta');
  host.innerHTML = '';
  if (!state.inputList.length) {
    host.innerHTML = '<span class="muted">no sources reported</span>';
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
    // current input not in the filtered list — add a temporary chip so user can see it
    const b = document.createElement('button');
    b.className = 'input-btn active';
    b.textContent = state.currentInput.replace(/_/g, ' ') + ' *';
    b.title = 'Currently active but not in your enabled-sources filter';
    host.appendChild(b);
  }
}

// ----- Power button binding -----
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
    document.getElementById('vol-pct').textContent =
      pctFromVolume(state.volume) + '%' + (state.mute ? ' (muted)' : '');
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
    if (!r.ok) {
      host.innerHTML = '<span class="muted">presets unavailable</span>';
      return;
    }
    host.innerHTML = '';
    let any = false; let i = 1;
    for (const p of r.presets || []) {
      if (p && p.input && p.input !== 'unknown' && p.text) {
        const b = document.createElement('button');
        b.className = 'preset-btn';
        b.innerHTML = `<span style="color:var(--paper-muted);font-family:var(--font-mono);font-size:0.7rem;margin-right:6px;">P${i}</span>${p.text}`;
        const num = i;
        b.addEventListener('click', () =>
          api('/api/preset/' + num, { method: 'POST' }).then(refreshStatus)
        );
        host.appendChild(b);
        any = true;
      }
      i++;
    }
    if (!any) host.innerHTML = '<span class="muted">no presets saved on receiver. See suggestions below.</span>';
  } catch (e) { /* ignore */ }
}

// ----- Net Radio suggestions -----
function renderSuggestions() {
  const host = document.getElementById('suggest-list');
  const list = state.config.net_radio_suggestions || [];
  if (!list.length) {
    host.innerHTML = '<span class="muted">no suggestions configured</span>';
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
    // older Chrome --app may need a fallback
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

// ----- Roon: zones (structured rows) -----
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
      return 'Open Roon → Settings → Extensions and enable The Audiopheliac Cockpit.';
    case 'discovering': return 'Looking for Roon Core on the LAN...';
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
  host.innerHTML = '';
  if (state.roonState !== 'connected') {
    host.innerHTML = '<span class="muted">' + roonHintForState() + '</span>';
    if (meta) meta.textContent = 'offline';
    return;
  }
  if (!state.zones.length) {
    host.innerHTML = '<span class="muted">no Roon zones. Enable a zone in Roon (AirPlay 2 to R-N800A or Roon Bridge on GDMARCHE).</span>';
    if (meta) meta.textContent = '0 zones';
    return;
  }
  const preferred = state.config.preferred_zones || [];
  const filterOn = preferred.length > 0;
  const matchesPreferred = (z) => preferred.some(p => z.display_name.toLowerCase().includes(p.toLowerCase()));
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

async function refreshZones() {
  try {
    const r = await api('/api/roon/zones');
    if (!r.ok) return;
    state.zones = r.zones || [];
    if (!state.activeZoneId && state.zones.length) {
      state.activeZoneId = state.zones[0].zone_id;
      localStorage.setItem(ACTIVE_ZONE_KEY, state.activeZoneId);
    }
    if (state.activeZoneId && !state.zones.find(z => z.zone_id === state.activeZoneId)) {
      state.activeZoneId = state.zones.length ? state.zones[0].zone_id : null;
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
  label.textContent = z ? `Zone: ${z.display_name}` : 'no zone selected';
}

// ----- Now Playing -----
async function refreshNowPlaying() {
  refreshNowPlayingZoneLabel();
  let np = null;
  if (state.roonState === 'connected' && state.activeZoneId) {
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

  document.getElementById('now-track').textContent = (np && np.title) || '—';
  document.getElementById('now-artist').textContent = (np && np.artist) || '';
  document.getElementById('now-album').textContent  = (np && np.album)  || '';
  document.getElementById('now-source').textContent = np ? 'source · ' + np.source : '';

  // Metadata: bitrate / sample rate if Roon
  const metaEl = document.getElementById('now-meta');
  if (np && np.format) {
    metaEl.textContent = [np.format, np.sample_rate, np.bitrate].filter(Boolean).join(' · ');
  } else if (np && np.signal_path_quality) {
    metaEl.textContent = np.signal_path_quality;
  } else {
    metaEl.textContent = '';
  }

  // Scrub
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

  // Play/pause icon
  const pp = document.getElementById('btn-playpause');
  if (pp) {
    const zone = state.zones.find(z => z.zone_id === state.activeZoneId);
    const playing = (zone && zone.state === 'playing') || (np && np.state === 'playing');
    pp.textContent = playing ? '⏸' : '▶';
  }

  // Art
  const art = document.getElementById('now-art');
  let artUrl = null;
  if (np && np.source === 'roon' && np.image_key) {
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

// ----- Library -----
const libState = { list: null };

async function libraryHome() {
  if (state.roonState !== 'connected') { setLibraryStatus(roonHintForState()); return; }
  if (!state.activeZoneId) { setLibraryStatus('pick a Roon zone first'); return; }
  try {
    const r = await api('/api/roon/browse/root', { method: 'POST', body: { zone_id: state.activeZoneId } });
    if (!r.ok) throw new Error(r.error || 'browse failed');
    renderLibraryList(r.list, { home: true });
  } catch (e) { setLibraryStatus('home failed: ' + (e.message || e)); }
}

async function libraryDescend(itemKey) {
  if (!state.activeZoneId) return;
  try {
    const r = await api('/api/roon/browse/descend', {
      method: 'POST', body: { zone_id: state.activeZoneId, item_key: itemKey },
    });
    if (!r.ok) throw new Error(r.error || 'descend failed');
    renderLibraryList(r.list);
  } catch (e) { setLibraryStatus('descend failed: ' + (e.message || e)); }
}

async function libraryBack() {
  if (!state.activeZoneId) return;
  try {
    const r = await api('/api/roon/browse/back', { method: 'POST', body: { zone_id: state.activeZoneId } });
    if (!r.ok) throw new Error(r.error || 'back failed');
    renderLibraryList(r.list);
  } catch (e) { setLibraryStatus('back failed: ' + (e.message || e)); }
}

async function librarySearch(query) {
  if (!state.activeZoneId) { setLibraryStatus('pick a Roon zone first'); return; }
  if (!query) { libraryHome(); return; }
  try {
    const r = await api('/api/roon/search', {
      method: 'POST', body: { zone_id: state.activeZoneId, query: query },
    });
    if (!r.ok) throw new Error(r.error || 'search failed');
    renderLibraryList(r.list);
  } catch (e) { setLibraryStatus('search failed: ' + (e.message || e)); }
}

function renderLibraryList(list, opts = {}) {
  libState.list = list || {};
  let items = (list && list.items) || [];

  // Client-side filter: drop "My Live Radio" at the home level
  if (opts.home) {
    items = items.filter(it => !LIBRARY_HOME_HIDE.has((it.title || '').toLowerCase()));
  }

  const host = document.getElementById('library-list');
  const crumb = document.getElementById('library-crumb');
  crumb.textContent = (list && list.list && list.list.title) || (list && list.title) || (opts.home ? 'Roon home' : '');
  host.innerHTML = '';

  if (!items.length) {
    host.innerHTML = '<span class="muted">no items at this level</span>';
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
    row.className = 'library-item' + (hint === 'action' ? ' action' : '');
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
    if (hint === 'action') {
      const tag = document.createElement('span');
      tag.className = 'library-hint'; tag.textContent = 'play';
      row.appendChild(tag);
    }
    row.addEventListener('click', () => libraryDescend(item.item_key));
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

// ----- Card visibility + drag + reset -----
function getHidden() {
  try { return new Set(JSON.parse(localStorage.getItem(HIDDEN_CARDS_KEY) || '[]')); }
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
  // Any cards not in stored order get appended at end (newly added cards)
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

// ----- Receiver controls -----
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
  document.getElementById('btn-vol-up').addEventListener('click', () =>
    api('/api/volume/up', { method: 'POST' }).then(refreshStatus));
  document.getElementById('btn-vol-down').addEventListener('click', () =>
    api('/api/volume/down', { method: 'POST' }).then(refreshStatus));
  document.getElementById('btn-mute').addEventListener('click', () =>
    api('/api/mute/toggle', { method: 'POST' }).then(refreshStatus));

  const slider = document.getElementById('vol-slider');
  slider.addEventListener('input', () => {
    sliderDirty = true;
    document.getElementById('vol-pct').textContent = pctFromVolume(Number(slider.value)) + '%';
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
      if (state.roonState === 'connected' && state.activeZoneId) {
        await api('/api/roon/transport/' + action, {
          method: 'POST', body: { zone_id: state.activeZoneId },
        });
      } else {
        const yxc = action === 'playpause' ? 'play_pause' : action;
        await api('/api/transport/' + yxc, { method: 'POST' });
      }
      setTimeout(refreshNowPlaying, 400);
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
    }
  } catch (e) { /* ignore */ }
}

async function start() {
  applyCardOrder();
  wireCardVisibility();
  applyHidden();
  wireResetLayout();
  wireReceiver();
  wireTransport();
  wireLibrary();
  renderRoonBanner();
  renderZones();
  setLibraryStatus(roonHintForState());

  await loadConfig();
  renderSuggestions();
  await refreshStatus();
  await refreshPresets();
  await refreshRoonStatus();
  await refreshNowPlaying();

  setInterval(refreshStatus, POLL_STATUS_MS);
  setInterval(refreshRoonStatus, POLL_ROON_MS);
  setInterval(refreshZones, POLL_ROON_MS * 3);
  setInterval(refreshNowPlaying, POLL_STATUS_MS);

  wireDrag();
}

start();
