// Audiopheliac Cockpit v0.9 — Spotify + YXC only (Roon removed)
'use strict';

// ── CSRF ────────────────────────────────────────────────────────────────────
const CSRF = document.querySelector('meta[name="cockpit-csrf"]')?.content ?? '';

// ── State ───────────────────────────────────────────────────────────────────
let _spPlaying   = false;
let _spDeviceId  = null;
let _spProgress  = 0;     // ms
let _spDuration  = 0;     // ms
let _spPollAt    = 0;     // performance.now() at last poll
let _yamVolMax   = 161;
let _activeTab   = 'playlists';
let _toastDedup  = {};
let _scrubRaf    = null;

// ── Utilities ────────────────────────────────────────────────────────────────
function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
function escAttr(s) { return escHtml(s); }

function fmtMs(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// ── Toast ────────────────────────────────────────────────────────────────────
function toast(msg, kind = 'info', ms = 3500) {
  const now = Date.now();
  if (_toastDedup[msg] && now - _toastDedup[msg] < 4000) return;
  _toastDedup[msg] = now;

  const c = document.getElementById('toast-container');
  if (!c) return;
  const el = document.createElement('div');
  el.className = `toast${kind !== 'info' ? ' ' + kind : ''}`;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), ms + 400);
}

// ── API helpers ──────────────────────────────────────────────────────────────
async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'X-Cockpit-CSRF': CSRF, 'Content-Type': 'application/json' },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const r = await fetch(path, opts);
  const ct = r.headers.get('content-type') ?? '';
  const data = ct.includes('json') ? await r.json() : await r.text();
  if (!r.ok) throw new Error(typeof data === 'object' ? (data.error ?? r.statusText) : data);
  return data;
}
const apiGet  = path       => api('GET',  path);
const apiPost = (path, b)  => api('POST', path, b);

// ── Clock ────────────────────────────────────────────────────────────────────
function startClock() {
  function tick() {
    const el = document.getElementById('clock');
    if (!el) return;
    const d = new Date();
    let h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    el.textContent = `${h}:${String(m).padStart(2, '0')} ${ampm}`;
  }
  tick();
  setInterval(tick, 10000);
}

// ── Scrub bar ────────────────────────────────────────────────────────────────
function setScrubFill(progress, duration) {
  const fill = document.getElementById('now-scrub-fill');
  if (!fill) return;
  const pct = duration > 0 ? Math.min(100, (progress / duration) * 100) : 0;
  fill.style.width = pct + '%';
  document.getElementById('now-elapsed').textContent = fmtMs(progress);
  document.getElementById('now-total').textContent   = fmtMs(duration);
}

function startScrub() {
  if (_scrubRaf) cancelAnimationFrame(_scrubRaf);
  function frame() {
    if (_spPlaying && _spDuration > 0) {
      const delta = performance.now() - _spPollAt;
      const interp = Math.min(_spProgress + delta, _spDuration);
      setScrubFill(interp, _spDuration);
    }
    _scrubRaf = requestAnimationFrame(frame);
  }
  _scrubRaf = requestAnimationFrame(frame);
}

// ── Status dots ──────────────────────────────────────────────────────────────
function setSpotifyDot(ok) {
  const dot = document.getElementById('dot-spotify');
  if (!dot) return;
  if (ok) {
    dot.style.background  = 'var(--signal)';
    dot.style.boxShadow   = '0 0 6px var(--signal)';
  } else {
    dot.style.background  = 'var(--paper-muted)';
    dot.style.boxShadow   = 'none';
  }
}
function setYamahaDot(ok) {
  const dot = document.getElementById('dot-yamaha');
  if (!dot) return;
  if (ok) {
    dot.style.background  = 'var(--signal)';
    dot.style.boxShadow   = '0 0 6px var(--signal)';
  } else {
    dot.style.background  = 'var(--paper-muted)';
    dot.style.boxShadow   = 'none';
  }
}

// ── Now Playing ──────────────────────────────────────────────────────────────
function renderNowPlaying(np) {
  const isPlaying = np.is_playing ?? false;
  _spPlaying  = isPlaying;
  _spProgress = (np.progress_ms     ?? 0);
  _spDuration = (np.track_duration_ms ?? 0);
  _spPollAt   = performance.now();

  // Art
  const wrap    = document.getElementById('now-art-wrap');
  const img     = document.getElementById('now-art-img');
  const artLbl  = document.getElementById('now-art-label');
  const artUrl  = np.art_url ?? '';
  if (artUrl && img) {
    img.src = artUrl;
    img.style.display = 'block';
    wrap?.classList.remove('placeholder');
    if (artLbl) artLbl.style.display = 'none';
  } else {
    if (img) img.style.display = 'none';
    wrap?.classList.add('placeholder');
    if (artLbl) { artLbl.style.display = ''; artLbl.textContent = 'Idle'; }
  }

  // Text
  const track  = np.track_name    ?? 'Nothing playing yet.';
  const artist = np.track_artists ?? '';
  const album  = np.track_album   ?? '';
  document.getElementById('now-track').textContent  = track;
  document.getElementById('now-artist').textContent = artist;
  document.getElementById('now-album').textContent  = album;

  // Meta row (explicit badge)
  const metaRow = document.getElementById('now-meta-row');
  if (metaRow) {
    const parts = [];
    if (np.track_explicit) parts.push('<span class="badge">E</span>');
    metaRow.innerHTML = parts.join(' ');
  }

  // Scrub state
  setScrubFill(_spProgress, _spDuration);

  // Play/pause button icon
  const btn = document.getElementById('btn-playpause');
  if (btn) btn.querySelector('.t-icon-lg').textContent = isPlaying ? '⏸' : '▶';

  // Zone label
  const zoneLbl = document.getElementById('now-zone-label');
  if (zoneLbl) zoneLbl.textContent = np.device?.name ?? 'Idle';
}

function renderShuffleRepeat(np) {
  const shuffleBtn = document.getElementById('btn-shuffle');
  const repeatBtn  = document.getElementById('btn-repeat');
  const shuffleLbl = document.getElementById('label-shuffle');
  const repeatLbl  = document.getElementById('label-repeat');

  const shuffle = np.shuffle_state ?? false;
  const repeat  = np.repeat_state ?? 'off'; // 'off' | 'context' | 'track'

  shuffleBtn?.classList.toggle('active', shuffle);
  if (shuffleLbl) shuffleLbl.textContent = shuffle ? 'Shuffle on' : 'Shuffle off';

  const repeatOn = repeat !== 'off';
  repeatBtn?.classList.toggle('active', repeatOn);
  if (repeatLbl) {
    const labels = { off: 'Repeat off', context: 'Repeat all', track: 'Repeat one' };
    repeatLbl.textContent = labels[repeat] ?? 'Repeat off';
  }
}

// ── Spotify devices (replaces Roon zones) ───────────────────────────────────
function renderDevices(devices, activeId) {
  const list = document.getElementById('device-list');
  if (!list) return;

  const meta = document.getElementById('devices-meta');
  if (devices.length === 0) {
    list.innerHTML = '<span class="muted">No Spotify devices active.</span>';
    if (meta) meta.textContent = 'none';
    return;
  }

  if (meta) meta.textContent = `${devices.length} device${devices.length !== 1 ? 's' : ''}`;

  list.innerHTML = devices.map(d => {
    const active = d.id === activeId || d.is_active;
    return `<div class="zone${active ? ' active' : ''}" data-id="${escAttr(d.id)}">
      <span class="zone-icon">&#x1F4FB;</span>
      <div class="zone-info">
        <span class="zone-name">${escHtml(d.name)}</span>
        <span class="zone-sub">${escHtml(d.type ?? '')}</span>
      </div>
      <div class="zone-actions">
        <button class="zone-vol-btn" title="Transfer playback">&#x25BA;</button>
      </div>
    </div>`;
  }).join('');

  list.querySelectorAll('.zone').forEach(el => {
    el.addEventListener('click', async () => {
      const id = el.dataset.id;
      if (!id) return;
      try {
        await apiPost('/api/spotify/transfer', { device_id: id });
        _spDeviceId = id;
        list.querySelectorAll('.zone').forEach(z => z.classList.toggle('active', z.dataset.id === id));
      } catch (e) {
        toast('Transfer failed: ' + e.message, 'error');
      }
    });
  });
}

// ── Spotify poll ─────────────────────────────────────────────────────────────
async function pollSpotify() {
  try {
    const data = await apiGet('/api/spotify/status');
    setSpotifyDot(true);

    const authPrompt = document.getElementById('sp-auth-prompt');
    if (authPrompt) authPrompt.style.display = 'none';

    const np = data.now_playing ?? {};
    renderNowPlaying(np);
    renderShuffleRepeat(np);

    if (np.device?.id) _spDeviceId = np.device.id;
  } catch (e) {
    setSpotifyDot(false);
    const msg = String(e.message ?? '');
    if (msg.includes('401') || msg.includes('auth') || msg.includes('unauthorized')) {
      const authPrompt = document.getElementById('sp-auth-prompt');
      if (authPrompt) authPrompt.style.display = '';
    }
  }
}

async function pollDevices() {
  try {
    const data = await apiGet('/api/spotify/devices');
    renderDevices(data.devices ?? [], _spDeviceId);
  } catch (_) {
    // silent — device list is secondary
  }
}

// ── Yamaha ───────────────────────────────────────────────────────────────────
// inputList from YXC is a plain list of strings (source IDs like "airplay", "spotify", etc.)
const SOURCE_LABELS = {
  airplay:     'AirPlay', spotify:    'Spotify',  net_radio: 'Net Radio',
  tuner:       'Tuner',   cd:         'CD',        aux:       'AUX',
  line1:       'Line 1',  line2:      'Line 2',    optical1:  'Optical 1',
  optical2:    'Optical 2', coaxial1: 'Coaxial 1', hdmi1:    'HDMI 1',
  hdmi2:       'HDMI 2',  server:     'Server',    bluetooth: 'Bluetooth',
};
function srcLabel(id) {
  return SOURCE_LABELS[id] ?? id.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function renderSources(inputList, activeInput) {
  const list = document.getElementById('source-list');
  if (!list) return;
  if (!inputList || inputList.length === 0) {
    list.innerHTML = '<span class="muted">No sources</span>';
    return;
  }
  list.innerHTML = inputList.map(src => {
    const id     = typeof src === 'string' ? src : (src.id ?? src);
    const label  = typeof src === 'string' ? srcLabel(src) : (src.name ?? srcLabel(src.id ?? src));
    const active = id === activeInput;
    return `<button class="source-btn${active ? ' active' : ''}" data-src="${escAttr(id)}">${escHtml(label)}</button>`;
  }).join('');
  list.querySelectorAll('.source-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const src = btn.dataset.src;
      try {
        await apiPost('/api/input', { name: src });
        list.querySelectorAll('.source-btn').forEach(b => b.classList.toggle('active', b.dataset.src === src));
      } catch (e) {
        toast('Source change failed: ' + e.message, 'error');
      }
    });
  });
}

function renderPresets(presets) {
  const list = document.getElementById('preset-list');
  if (!list) return;
  if (!presets || presets.length === 0) {
    list.innerHTML = '<span class="muted">No presets</span>';
    return;
  }
  list.innerHTML = presets.map(p => {
    const num   = p.num  ?? p.id  ?? '';
    const label = p.text ?? p.name ?? (num ? 'Preset ' + num : '—');
    if (!num) return '';
    return `<button class="preset-btn" data-preset="${escAttr(num)}">${escHtml(label)}</button>`;
  }).join('');
  list.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const num = btn.dataset.preset;
      try {
        await apiPost(`/api/preset/${parseInt(num, 10)}`, {});
        toast('Preset loaded', 'success', 2000);
      } catch (e) {
        toast('Preset failed: ' + e.message, 'error');
      }
    });
  });
}

function renderYamaha(s) {
  if (!s) return;
  setYamahaDot(true);

  // Power
  const power    = document.getElementById('btn-power');
  const powerLbl = document.getElementById('power-label');
  const powerSub = document.getElementById('power-sub');
  const isOn     = s.power === 'on';
  if (power) power.classList.toggle('off', !isOn);
  if (powerLbl) powerLbl.textContent = isOn ? 'On' : 'Standby';
  if (powerSub) powerSub.textContent = 'live';

  // Mute
  const muteLbl = document.getElementById('mute-label');
  const muteBtn = document.getElementById('btn-mute');
  const muted   = !!s.mute;
  if (muteLbl) muteLbl.textContent = muted ? 'On' : 'Off';
  if (muteBtn) muteBtn.classList.toggle('muted', muted);

  // Volume
  const slider = document.getElementById('vol-slider');
  const volNum  = document.getElementById('vol-num');
  const vol     = s.volume ?? 0;
  if (s.volume_max != null) _yamVolMax = s.volume_max;
  if (slider) { slider.max = _yamVolMax; slider.value = vol; }
  if (volNum) volNum.textContent = vol;

  // Sources
  renderSources(s.input_list ?? [], s.input ?? '');
}

async function pollYamaha() {
  try {
    const [status] = await Promise.all([
      apiGet('/api/status'),
    ]);
    renderYamaha(status);
  } catch (e) {
    setYamahaDot(false);
  }
}

async function loadPresets() {
  try {
    const data = await apiGet('/api/presets');
    renderPresets(data.presets ?? data);
  } catch (_) { /* silent */ }
}

// ── Queue ────────────────────────────────────────────────────────────────────
async function pollQueue() {
  const list = document.getElementById('queue-list');
  const meta = document.getElementById('queue-meta');
  if (!list) return;
  try {
    const data  = await apiGet('/api/spotify/queue');
    const items = data.queue ?? [];
    if (meta) meta.textContent = items.length ? `${items.length} tracks` : 'empty';
    if (items.length === 0) {
      list.innerHTML = '<span class="muted">Queue is empty.</span>';
      return;
    }
    list.innerHTML = items.slice(0, 25).map((t, i) =>
      `<div class="queue-item">
        <span class="queue-num">${i + 1}</span>
        <div class="queue-info">
          <span class="queue-track">${escHtml(t.name ?? t.title ?? '')}</span>
          <span class="queue-artist">${escHtml((t.artists ?? []).map(a => a.name ?? a).join(', ') || t.artist || '')}</span>
        </div>
        <span class="queue-dur">${fmtMs(t.duration_ms ?? 0)}</span>
      </div>`
    ).join('');
  } catch (_) {
    if (list.innerHTML === '' || list.innerHTML.includes('muted')) {
      list.innerHTML = '<span class="muted">Queue appears once Spotify is playing.</span>';
    }
  }
}

// ── Library ──────────────────────────────────────────────────────────────────
function setTab(name) {
  _activeTab = name;
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === name);
  });
  const list = document.getElementById('lib-list');
  if (!list) return;
  const stored = list.dataset['stored_' + name];
  if (stored) list.innerHTML = stored;
}

function storeTabContent(name, html) {
  const list = document.getElementById('lib-list');
  if (list) list.dataset['stored_' + name] = html;
}

async function loadPlaylists() {
  const list = document.getElementById('lib-list');
  if (!list) return;
  if (_activeTab === 'playlists') list.innerHTML = '<span class="muted">Loading playlists…</span>';
  try {
    const data  = await apiGet('/api/spotify/playlists?limit=50');
    const items = data.playlists ?? data.items ?? [];
    const html  = items.length === 0
      ? '<span class="muted">No playlists found.</span>'
      : items.map(pl =>
          `<div class="lib-item" data-uri="${escAttr(pl.uri ?? '')}" data-type="playlist">
            ${pl.art_url ? `<img class="lib-art" src="${escAttr(pl.art_url)}" alt="">` : '<div class="lib-art-placeholder"></div>'}
            <div class="lib-info">
              <span class="lib-title">${escHtml(pl.name ?? '')}</span>
              <span class="lib-sub">${escHtml(pl.tracks != null ? pl.tracks + ' tracks' : (pl.owner ?? ''))}</span>
            </div>
          </div>`
        ).join('');
    storeTabContent('playlists', html);
    if (_activeTab === 'playlists') list.innerHTML = html;
    wireLibItems(list);
  } catch (e) {
    if (_activeTab === 'playlists') list.innerHTML = '<span class="muted">Could not load playlists.</span>';
  }
}

async function doSearch(q) {
  if (!q) return;
  setTab('search');
  const list = document.getElementById('lib-list');
  if (list) list.innerHTML = '<span class="muted">Searching…</span>';
  try {
    const data = await apiGet(`/api/spotify/search?q=${encodeURIComponent(q)}&type=track,album,playlist&limit=20`);
    // spotify.py search() returns normalized items: {track:[...], album:[...], playlist:[...]}
    // wrapped by the endpoint as data.results
    const r = data.results ?? {};
    const all = [
      ...(r.playlist ?? []),
      ...(r.album    ?? []),
      ...(r.track    ?? []),
    ];
    const html = all.length === 0
      ? '<span class="muted">No results.</span>'
      : all.map(item => {
          const img   = item.art_url ?? '';
          const sub   = item.subtitle ?? '';
          const kind  = item.kind ?? '';
          const badge = kind !== 'track' ? `<span class="lib-badge">${escHtml(kind)}</span>` : '';
          return `<div class="lib-item" data-uri="${escAttr(item.uri ?? '')}" data-type="${escAttr(kind)}">
            ${img ? `<img class="lib-art" src="${escAttr(img)}" alt="">` : '<div class="lib-art-placeholder"></div>'}
            <div class="lib-info">
              <span class="lib-title">${escHtml(item.name ?? '')}${badge}</span>
              <span class="lib-sub">${escHtml(sub)}</span>
            </div>
          </div>`;
        }).join('');
    storeTabContent('search', html);
    if (list) list.innerHTML = html;
    wireLibItems(list);
  } catch (e) {
    if (list) list.innerHTML = `<span class="muted">Search failed: ${escHtml(e.message)}</span>`;
  }
}

function wireLibItems(container) {
  container?.querySelectorAll('.lib-item').forEach(el => {
    el.addEventListener('click', async () => {
      const uri  = el.dataset.uri;
      const type = el.dataset.type;
      if (!uri) return;
      try {
        if (type === 'track') {
          await apiPost('/api/spotify/playback/play', { uris: [uri] });
        } else {
          await apiPost('/api/spotify/playback/play', { context_uri: uri });
        }
        toast('Playing…', 'success', 2000);
        setTimeout(pollSpotify, 800);
      } catch (e) {
        toast('Play failed: ' + e.message, 'error');
      }
    });
  });
}

// ── Wire buttons ─────────────────────────────────────────────────────────────
function wireButtons() {
  // Transport — play/pause
  document.getElementById('btn-playpause')?.addEventListener('click', async () => {
    try {
      const action = _spPlaying ? 'pause' : 'play';
      await apiPost(`/api/spotify/playback/${action}`, {});
      setTimeout(pollSpotify, 400);
    } catch (e) { toast('Playback failed: ' + e.message, 'error'); }
  });

  // Transport — prev/next
  document.getElementById('btn-prev')?.addEventListener('click', async () => {
    try { await apiPost('/api/spotify/playback/previous', {}); setTimeout(pollSpotify, 600); }
    catch (e) { toast('Previous failed: ' + e.message, 'error'); }
  });
  document.getElementById('btn-next')?.addEventListener('click', async () => {
    try { await apiPost('/api/spotify/playback/next', {}); setTimeout(pollSpotify, 600); }
    catch (e) { toast('Next failed: ' + e.message, 'error'); }
  });

  // Transport — shuffle
  document.getElementById('btn-shuffle')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-shuffle');
    const cur = btn?.classList.contains('active') ?? false;
    try {
      await apiPost('/api/spotify/playback/shuffle', { state: !cur });
      btn?.classList.toggle('active', !cur);
      const lbl = document.getElementById('label-shuffle');
      if (lbl) lbl.textContent = !cur ? 'Shuffle on' : 'Shuffle off';
    } catch (e) { toast('Shuffle failed: ' + e.message, 'error'); }
  });

  // Transport — repeat
  document.getElementById('btn-repeat')?.addEventListener('click', async () => {
    const lbl = document.getElementById('label-repeat');
    const cur = lbl?.textContent ?? 'Repeat off';
    const next = cur === 'Repeat off' ? 'context' : cur === 'Repeat all' ? 'track' : 'off';
    try {
      await apiPost('/api/spotify/playback/repeat', { state: next });
      const labels = { off: 'Repeat off', context: 'Repeat all', track: 'Repeat one' };
      if (lbl) lbl.textContent = labels[next];
      const btn = document.getElementById('btn-repeat');
      btn?.classList.toggle('active', next !== 'off');
    } catch (e) { toast('Repeat failed: ' + e.message, 'error'); }
  });

  // Yamaha — power
  document.getElementById('btn-power')?.addEventListener('click', async () => {
    const isOn = !document.getElementById('btn-power')?.classList.contains('off');
    try {
      await apiPost(isOn ? '/api/power/off' : '/api/power/on', {});
      setTimeout(pollYamaha, 600);
    } catch (e) { toast('Power failed: ' + e.message, 'error'); }
  });

  // Yamaha — mute
  document.getElementById('btn-mute')?.addEventListener('click', async () => {
    try {
      await apiPost('/api/mute/toggle', {});
      setTimeout(pollYamaha, 400);
    } catch (e) { toast('Mute failed: ' + e.message, 'error'); }
  });

  // Yamaha — volume slider
  let _volDebounce = null;
  document.getElementById('vol-slider')?.addEventListener('input', e => {
    clearTimeout(_volDebounce);
    const v = parseInt(e.target.value, 10);
    const vn = document.getElementById('vol-num');
    if (vn) vn.textContent = v;
    _volDebounce = setTimeout(async () => {
      try { await apiPost('/api/volume/set', { value: v }); }
      catch (err) { toast('Volume failed: ' + err.message, 'error'); }
    }, 120);
  });

  // Yamaha — volume buttons
  document.getElementById('btn-vol-down')?.addEventListener('click', async () => {
    const slider = document.getElementById('vol-slider');
    const cur    = parseInt(slider?.value ?? '40', 10);
    const next   = Math.max(0, cur - 5);
    try {
      await apiPost('/api/volume/set', { value: next });
      if (slider) slider.value = next;
      const vn = document.getElementById('vol-num');
      if (vn) vn.textContent = next;
    } catch (e) { toast('Volume failed: ' + e.message, 'error'); }
  });
  document.getElementById('btn-vol-up')?.addEventListener('click', async () => {
    const slider = document.getElementById('vol-slider');
    const cur    = parseInt(slider?.value ?? '40', 10);
    const next   = Math.min(_yamVolMax, cur + 5);
    try {
      await apiPost('/api/volume/set', { value: next });
      if (slider) slider.value = next;
      const vn = document.getElementById('vol-num');
      if (vn) vn.textContent = next;
    } catch (e) { toast('Volume failed: ' + e.message, 'error'); }
  });

  // Library — search
  document.getElementById('lib-search-btn')?.addEventListener('click', () => {
    const q = document.getElementById('lib-q')?.value?.trim();
    if (q) doSearch(q);
  });
  document.getElementById('lib-q')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = e.target.value?.trim();
      if (q) doSearch(q);
    }
  });

  // Library — tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => setTab(tab.dataset.tab));
  });
}

// ── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  startClock();
  startScrub();
  wireButtons();

  // Initial parallel polls
  await Promise.allSettled([pollSpotify(), pollYamaha(), pollDevices()]);
  await Promise.allSettled([loadPlaylists(), loadPresets(), pollQueue()]);

  // Polling intervals
  setInterval(pollSpotify,  3000);
  setInterval(pollDevices,  5000);
  setInterval(pollYamaha,   5000);
  setInterval(pollQueue,   15000);
}

document.addEventListener('DOMContentLoaded', init);
