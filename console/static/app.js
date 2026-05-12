// Audiopheliac Cockpit v0.2 - Roon library + Yamaha control.
//
// YXC handles: power, volume, mute, Yamaha source select, Net Radio presets.
// Roon handles: zone selection, library browse + search, transport,
//               Now Playing metadata.

const POLL_STATUS_MS = 2000;
const POLL_ROON_MS   = 2000;
const YAMAHA_IP = document.body.dataset.yamahaIp || '192.168.1.191';

const HIDDEN_CARDS_KEY = 'audiopheliac.cockpit.hiddenCards.v2';
const ACTIVE_ZONE_KEY  = 'audiopheliac.cockpit.activeZoneId.v1';
const CARD_NAMES = {
  power: 'Power',
  volume: 'Volume',
  input: 'Yamaha Source',
  zone: 'Roon Zone',
  now: 'Now Playing',
  preset: 'Net Radio Presets',
  library: 'Library',
};

const state = {
  // Yamaha
  volumeMin: 0,
  volumeMax: 161,
  volumeStep: 1,
  inputList: [],
  currentInput: null,
  power: null,
  mute: false,
  volume: 0,
  // Roon
  roonState: 'disconnected',
  roonError: null,
  roonCoreName: null,
  zones: [],
  activeZoneId: localStorage.getItem(ACTIVE_ZONE_KEY) || null,
};

let sliderDirty = false;
let sliderDirtyTimer = null;

// ----- HTTP helpers -----

async function api(path, opts = {}) {
  const r = await fetch(path, {
    method: opts.method || 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  return r.json();
}

function markStatus(ok) {
  const el = document.getElementById('status-dot');
  el.classList.remove('ok', 'err');
  el.classList.add(ok ? 'ok' : 'err');
}

function pctFromVolume(v) {
  const span = state.volumeMax - state.volumeMin || 1;
  return Math.round(((v - state.volumeMin) / span) * 100);
}

// ----- Yamaha source list -----

function renderInputList() {
  const host = document.getElementById('input-list');
  host.innerHTML = '';
  if (!state.inputList.length) {
    host.innerHTML = '<span class="muted">no sources reported</span>';
    return;
  }
  for (const name of state.inputList) {
    const b = document.createElement('button');
    b.className = 'input-btn' + (name === state.currentInput ? ' active' : '');
    b.textContent = name.replace(/_/g, ' ');
    b.addEventListener('click', async () => {
      await api('/api/input', { method: 'POST', body: { name } });
      await refreshStatus();
    });
    host.appendChild(b);
  }
}

async function refreshStatus() {
  try {
    const s = await api('/api/status');
    if (!s.ok) throw new Error(s.error || 'status failed');
    markStatus(true);
    state.volumeMin = s.volume_min;
    state.volumeMax = s.volume_max;
    state.volumeStep = s.volume_step;
    state.inputList = s.input_list || [];
    state.currentInput = s.input;
    state.power = s.power;
    state.mute = s.mute;
    state.volume = s.volume;

    document.getElementById('power-state').textContent = 'Power: ' + (s.power || 'unknown');
    const slider = document.getElementById('vol-slider');
    slider.min = state.volumeMin;
    slider.max = state.volumeMax;
    slider.step = state.volumeStep;
    if (!sliderDirty) slider.value = state.volume;
    document.getElementById('vol-pct').textContent =
      pctFromVolume(state.volume) + '%' + (state.mute ? ' (muted)' : '');
    renderInputList();
  } catch (e) {
    markStatus(false);
  }
}

async function refreshPresets() {
  try {
    const r = await api('/api/presets');
    if (!r.ok) return;
    const host = document.getElementById('preset-list');
    host.innerHTML = '';
    let any = false;
    let i = 1;
    for (const p of r.presets || []) {
      if (p && p.input && p.input !== 'unknown' && p.text) {
        const b = document.createElement('button');
        b.className = 'preset-btn';
        b.textContent = i + '. ' + p.text;
        const num = i;
        b.addEventListener('click', () =>
          api('/api/preset/' + num, { method: 'POST' }).then(refreshStatus)
        );
        host.appendChild(b);
        any = true;
      }
      i++;
    }
    if (!any) host.innerHTML = '<span class="muted">no presets saved on receiver</span>';
  } catch (e) {}
}

// ----- Roon: connection + zones -----

function renderRoonBanner() {
  const el = document.getElementById('topbar-roon');
  switch (state.roonState) {
    case 'connected':
      el.textContent = 'Roon: ' + (state.roonCoreName || 'connected');
      el.className = 'topbar-roon ok';
      break;
    case 'waiting_for_auth':
      el.textContent = 'Roon: enable extension in Roon settings';
      el.className = 'topbar-roon warn';
      break;
    case 'discovering':
      el.textContent = 'Roon: discovering...';
      el.className = 'topbar-roon warn';
      break;
    case 'error':
      el.textContent = 'Roon: ' + (state.roonError || 'error');
      el.className = 'topbar-roon err';
      break;
    default:
      el.textContent = 'Roon: ' + state.roonState;
      el.className = 'topbar-roon';
  }
}

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
      // First time we reach connected — populate zones and library root.
      await refreshZones();
      await libraryHome();
    }
  } catch (e) {}
}

function renderZones() {
  const host = document.getElementById('zone-list');
  host.innerHTML = '';
  if (state.roonState !== 'connected') {
    host.innerHTML = '<span class="muted">' + roonHintForState() + '</span>';
    return;
  }
  if (!state.zones.length) {
    host.innerHTML = '<span class="muted">no Roon zones found. Enable a zone in Roon (e.g. AirPlay to the Yamaha or Roon Bridge on GDMARCHE).</span>';
    return;
  }
  for (const z of state.zones) {
    const b = document.createElement('button');
    b.className = 'zone-btn' + (z.zone_id === state.activeZoneId ? ' active' : '');
    const label = z.display_name + (z.state && z.state !== 'stopped' ? ' · ' + z.state : '');
    b.textContent = label;
    b.title = (z.outputs || []).join(', ');
    b.addEventListener('click', () => {
      state.activeZoneId = z.zone_id;
      localStorage.setItem(ACTIVE_ZONE_KEY, z.zone_id);
      renderZones();
      refreshNowPlaying();
      libraryHome();
    });
    host.appendChild(b);
  }
}

function roonHintForState() {
  switch (state.roonState) {
    case 'waiting_for_auth':
      return 'Open Roon → Settings → Extensions and enable Audiopheliac Cockpit.';
    case 'discovering':
      return 'Looking for Roon Core on the LAN...';
    case 'error':
      return 'Roon error: ' + (state.roonError || 'unknown');
    default:
      return 'Roon: ' + state.roonState;
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
    // If the persisted zone is no longer in the list, drop it
    if (state.activeZoneId && !state.zones.find(z => z.zone_id === state.activeZoneId)) {
      state.activeZoneId = state.zones.length ? state.zones[0].zone_id : null;
      if (state.activeZoneId) localStorage.setItem(ACTIVE_ZONE_KEY, state.activeZoneId);
    }
    renderZones();
  } catch (e) {}
}

// ----- Now Playing (Roon-first with YXC fallback) -----

async function refreshNowPlaying() {
  // Try Roon first
  let np = null;
  if (state.roonState === 'connected' && state.activeZoneId) {
    try {
      const r = await api('/api/roon/now-playing?zone_id=' + encodeURIComponent(state.activeZoneId));
      if (r.ok && r.now_playing) np = { source: 'roon', ...r.now_playing };
    } catch (e) {}
  }
  // Fallback: YXC play_info (Spotify Connect, Net Radio, etc.)
  if (!np || !np.title) {
    try {
      const r = await api('/api/play-info');
      if (r.ok && r.play) {
        const p = r.play;
        if (p.track || p.artist || p.album) {
          np = {
            source: 'yamaha',
            title: p.track,
            artist: p.artist,
            album: p.album,
            albumart_url: p.albumart_url,
          };
        }
      }
    } catch (e) {}
  }

  document.getElementById('now-track').textContent = (np && np.title) || '—';
  document.getElementById('now-artist').textContent = (np && np.artist) || '';
  document.getElementById('now-album').textContent  = (np && np.album)  || '';
  const src = document.getElementById('now-source');
  src.textContent = np ? 'source: ' + np.source : '';

  const art = document.getElementById('now-art');
  let artUrl = null;
  if (np && np.source === 'roon' && np.image_key) {
    // Resolve Roon image URL through the server
    try {
      const r = await api('/api/roon/image?key=' + encodeURIComponent(np.image_key) + '&size=512');
      if (r.ok && r.url) artUrl = r.url;
    } catch (e) {}
  } else if (np && np.albumart_url) {
    artUrl = np.albumart_url.startsWith('http')
      ? np.albumart_url
      : 'http://' + YAMAHA_IP + np.albumart_url;
  }
  if (artUrl) {
    art.src = artUrl;
    art.classList.add('shown');
  } else {
    art.classList.remove('shown');
    art.removeAttribute('src');
  }
}

// ----- Library (Roon browse + search) -----

const libState = {
  list: null,    // last browse_load response
  pageOffset: 0,
};

function setLibraryStatus(msg) {
  document.getElementById('library-list').innerHTML = '<span class="muted">' + msg + '</span>';
  document.getElementById('library-crumb').textContent = '—';
}

async function libraryHome() {
  if (state.roonState !== 'connected') {
    setLibraryStatus(roonHintForState());
    return;
  }
  if (!state.activeZoneId) {
    setLibraryStatus('pick a Roon zone first');
    return;
  }
  try {
    const r = await api('/api/roon/browse/root', { method: 'POST', body: { zone_id: state.activeZoneId } });
    if (!r.ok) throw new Error(r.error || 'browse failed');
    renderLibraryList(r.list);
  } catch (e) {
    setLibraryStatus('home failed: ' + (e.message || e));
  }
}

async function libraryDescend(itemKey) {
  if (!state.activeZoneId) return;
  try {
    const r = await api('/api/roon/browse/descend', {
      method: 'POST',
      body: { zone_id: state.activeZoneId, item_key: itemKey },
    });
    if (!r.ok) throw new Error(r.error || 'descend failed');
    renderLibraryList(r.list);
  } catch (e) {
    setLibraryStatus('descend failed: ' + (e.message || e));
  }
}

async function libraryBack() {
  if (!state.activeZoneId) return;
  try {
    const r = await api('/api/roon/browse/back', { method: 'POST', body: { zone_id: state.activeZoneId } });
    if (!r.ok) throw new Error(r.error || 'back failed');
    renderLibraryList(r.list);
  } catch (e) {
    setLibraryStatus('back failed: ' + (e.message || e));
  }
}

async function librarySearch(query) {
  if (!state.activeZoneId) {
    setLibraryStatus('pick a Roon zone first');
    return;
  }
  if (!query) {
    libraryHome();
    return;
  }
  try {
    const r = await api('/api/roon/search', {
      method: 'POST',
      body: { zone_id: state.activeZoneId, query: query },
    });
    if (!r.ok) throw new Error(r.error || 'search failed');
    renderLibraryList(r.list);
  } catch (e) {
    setLibraryStatus('search failed: ' + (e.message || e));
  }
}

function renderLibraryList(list) {
  libState.list = list || {};
  const items = (list && list.items) || [];
  const host = document.getElementById('library-list');
  const crumb = document.getElementById('library-crumb');
  crumb.textContent = (list && list.list && list.list.title) || (list && list.title) || '';
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
    const img = document.createElement('img');
    img.className = 'library-thumb';
    img.alt = '';
    if (item.image_url) img.src = item.image_url;
    row.appendChild(img);
    const txt = document.createElement('div');
    txt.className = 'library-text';
    const main = document.createElement('div');
    main.className = 'library-text-main';
    main.textContent = item.title || '(untitled)';
    txt.appendChild(main);
    if (item.subtitle) {
      const sub = document.createElement('div');
      sub.className = 'library-text-sub';
      sub.textContent = item.subtitle;
      txt.appendChild(sub);
    }
    row.appendChild(txt);
    if (hint === 'action') {
      const tag = document.createElement('span');
      tag.className = 'library-hint';
      tag.textContent = 'play';
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

// ----- Card visibility -----

function getHiddenCards() {
  try { return new Set(JSON.parse(localStorage.getItem(HIDDEN_CARDS_KEY) || '[]')); }
  catch (e) { return new Set(); }
}
function setHiddenCards(s) {
  localStorage.setItem(HIDDEN_CARDS_KEY, JSON.stringify([...s]));
}
function applyHiddenCards() {
  const hidden = getHiddenCards();
  document.querySelectorAll('[data-card]').forEach((el) => {
    el.classList.toggle('hidden', hidden.has(el.dataset.card));
  });
  const bar = document.getElementById('hidden-cards-bar');
  bar.innerHTML = '';
  [...hidden].forEach((key) => {
    const b = document.createElement('button');
    b.className = 'restore-btn';
    b.textContent = '+ ' + (CARD_NAMES[key] || key);
    b.title = 'Show this card';
    b.addEventListener('click', () => {
      const s = getHiddenCards();
      s.delete(key);
      setHiddenCards(s);
      applyHiddenCards();
    });
    bar.appendChild(b);
  });
}
function wireCardVisibility() {
  document.querySelectorAll('.card-hide').forEach((btn) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('[data-card]');
      if (!card) return;
      const s = getHiddenCards();
      s.add(card.dataset.card);
      setHiddenCards(s);
      applyHiddenCards();
    });
  });
}

// ----- Primary controls -----

function wireControls() {
  document.getElementById('btn-power-on').addEventListener('click', () =>
    api('/api/power/on', { method: 'POST' }).then(refreshStatus));
  document.getElementById('btn-power-off').addEventListener('click', () =>
    api('/api/power/off', { method: 'POST' }).then(refreshStatus));
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

  // Transport buttons: prefer Roon when a zone is selected, fall back to YXC.
  for (const b of document.querySelectorAll('[data-tx]')) {
    b.addEventListener('click', async () => {
      const action = b.dataset.tx;
      if (state.roonState === 'connected' && state.activeZoneId) {
        await api('/api/roon/transport/' + action, {
          method: 'POST',
          body: { zone_id: state.activeZoneId },
        });
      } else {
        // YXC fallback: maps playpause -> play_pause
        const yxc = action === 'playpause' ? 'play_pause' : action;
        await api('/api/transport/' + yxc, { method: 'POST' });
      }
      setTimeout(refreshNowPlaying, 400);
    });
  }
}

// ----- Bootstrap -----

async function start() {
  wireCardVisibility();
  applyHiddenCards();
  wireControls();
  wireLibrary();
  renderRoonBanner();
  renderZones();
  setLibraryStatus(roonHintForState());

  await refreshStatus();
  await refreshPresets();
  await refreshRoonStatus();
  await refreshNowPlaying();

  setInterval(refreshStatus, POLL_STATUS_MS);
  setInterval(refreshRoonStatus, POLL_ROON_MS);
  setInterval(refreshZones, POLL_ROON_MS * 3);  // zones change rarely
  setInterval(refreshNowPlaying, POLL_STATUS_MS);
}

start();
