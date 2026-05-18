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
let _activeLibSource = 'spotify';  // 'spotify' | 'minimserver' | 'netradio'
let _libHistory      = [];          // breadcrumb stack
let _currentAlbumId  = null;
let _minimStatus     = false;

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

  if (name === 'albums' && _activeLibSource === 'spotify') {
    loadSpotifyAlbums();
  } else if (name === 'artists') {
    list.innerHTML = '<span class="muted">Artist browsing coming in v1.1. Use Search to find by artist.</span>';
  } else if (name === 'tracks') {
    list.innerHTML = '<span class="muted">Use Search to find specific tracks.</span>';
  } else {
    const stored = list.dataset['stored_' + name];
    if (stored) list.innerHTML = stored;
  }
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
    const SPECIAL_ICONS = { liked: '♥', episodes: '🎙', local: '💻' };
    const html  = items.length === 0
      ? '<span class="muted">No playlists found.</span>'
      : items.map(pl => {
          const sp      = pl.special;
          const icon    = sp ? SPECIAL_ICONS[sp] : null;
          const dimmed  = sp === 'local' ? ' lib-item--dimmed' : '';
          return `<div class="lib-item${dimmed}" data-uri="${escAttr(pl.uri ?? '')}" data-type="playlist"${sp ? ` data-special="${escAttr(sp)}"` : ''}>
            ${pl.art_url
              ? `<img class="lib-art" src="${escAttr(pl.art_url)}" alt="">`
              : `<div class="lib-art-placeholder lib-art-icon">${icon ?? ''}</div>`}
            <div class="lib-info">
              <span class="lib-title">${escHtml(pl.name ?? '')}</span>
              <span class="lib-sub">${escHtml(pl.tracks != null ? pl.tracks + ' tracks' : (pl.owner ?? ''))}</span>
            </div>
          </div>`;
        }).join('');
    storeTabContent('playlists', html);
    if (_activeTab === 'playlists') list.innerHTML = html;
    wireLibItems(list);
  } catch (e) {
    if (_activeTab === 'playlists') list.innerHTML = '<span class="muted">Could not load playlists.</span>';
  }
}

async function doSearch(q) {
  if (!q) return;
  // Dispatch by active library source. Search-row is source-uniform from
  // the user's POV (same input box, same Search button) but the backend
  // differs per source.
  if (_activeLibSource === 'minimserver') {
    return searchMinimServer(q, 'all');
  }
  // Default: Spotify (existing behavior).
  setTab('search');
  const list = document.getElementById('lib-list');
  if (list) list.innerHTML = '<span class="muted">Searching…</span>';
  try {
    const data = await apiGet(`/api/spotify/search?q=${encodeURIComponent(q)}&type=track,album,artist,playlist&limit=20`);
    // spotify.py search() returns normalized items: {track:[...], album:[...], artist:[...], playlist:[...]}
    // wrapped by the endpoint as data.results
    const r = data.results ?? {};
    renderSearchResults(r);
  } catch (e) {
    if (list) list.innerHTML = `<span class="muted">Search failed: ${escHtml(e.message)}</span>`;
  }
}

function wireLibItems(container) {
  container?.querySelectorAll('.lib-item').forEach(el => {
    el.addEventListener('click', async () => {
      const uri     = el.dataset.uri;
      const type    = el.dataset.type;
      const special = el.dataset.special;

      // Special library collections (not regular playlists)
      if (special === 'liked') {
        try {
          await apiPost('/api/spotify/liked/play', { device_id: _spDeviceId || undefined });
          toast('Playing Liked Songs…', 'success', 2000);
          setTimeout(pollSpotify, 800);
        } catch (e) { toast('Play failed: ' + e.message, 'error'); }
        return;
      }
      if (special === 'episodes') {
        try {
          await apiPost('/api/spotify/episodes/play', { device_id: _spDeviceId || undefined });
          toast('Playing Your Episodes…', 'success', 2000);
          setTimeout(pollSpotify, 800);
        } catch (e) { toast('Play failed: ' + e.message, 'error'); }
        return;
      }
      if (special === 'local') {
        toast('Local Files are stored on your device and can\'t be played via the Cockpit.', 'info', 4500);
        return;
      }

      if (!uri) return;
      try {
        if (type === 'track') {
          await apiPost('/api/spotify/play-track', { uris: [uri], device_id: _spDeviceId || undefined });
          toast('Playing…', 'success', 2000);
          setTimeout(pollSpotify, 800);
        } else if (type === 'album') {
          navigateAlbum(el.dataset.albumId || uri.split(':').pop());
        } else {
          await apiPost('/api/spotify/playback/play', { context_uri: uri });
          toast('Playing…', 'success', 2000);
          setTimeout(pollSpotify, 800);
        }
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

// ── MinimServer status ────────────────────────────────────────────────────────────────────
// Status shape from /api/miniserver/status (new in v0.9.x DLNA refactor):
//   { state: "ready"|"server_only"|"renderer_only"|"unavailable",
//     media_server: {friendly_name, ...} | null,
//     media_renderer: {friendly_name, ...} | null }
// "ready" = MinimServer AND Yamaha both discovered and reachable as UPnP.
async function checkMinimServer() {
  try {
    const data = await apiGet('/api/miniserver/status');
    _minimStatus = data.state === 'ready';
  } catch (_) {
    _minimStatus = false;
  }
  const dot = document.getElementById('dot-miniserver');
  if (dot) {
    dot.style.background = _minimStatus ? 'var(--signal)' : 'var(--paper-muted)';
    dot.style.boxShadow  = _minimStatus ? '0 0 6px var(--signal)' : 'none';
  }
}

// ── Library source switcher ───────────────────────────────────────────────────
function wireLibSourceTabs() {
  document.querySelectorAll('.lib-source-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.source;
      document.querySelectorAll('.lib-source-tab').forEach(b =>
        b.classList.toggle('active', b.dataset.source === src)
      );
      setLibSource(src);
    });
  });
}

function setLibSource(src) {
  _activeLibSource = src;
  _libHistory = [];
  _currentAlbumId = null;

  const libList    = document.getElementById('lib-list');
  const detail     = document.getElementById('lib-album-detail');
  const breadcrumb = document.getElementById('lib-breadcrumb');
  const tabsRow    = document.querySelector('.tabs');
  const searchRow  = document.querySelector('.search-row');
  const libMeta    = document.getElementById('library-meta');

  // Hide album detail, clear breadcrumb
  if (detail) detail.style.display = 'none';
  if (breadcrumb) { breadcrumb.style.display = 'none'; breadcrumb.innerHTML = ''; }

  if (src === 'spotify') {
    if (libMeta) libMeta.textContent = 'Spotify';
    if (tabsRow) tabsRow.style.display = '';
    if (searchRow) searchRow.style.display = '';
    setTab('playlists');
    loadPlaylists();
  } else if (src === 'minimserver') {
    if (libMeta) libMeta.textContent = 'MinimServer';
    // Search row stays visible — MinimServer search is source-uniform with Spotify.
    if (searchRow) searchRow.style.display = '';
    // Keep the kind tabs visible so the user can filter results by track/album/artist.
    if (tabsRow) tabsRow.style.display = '';
    if (libList) libList.innerHTML = '<span class="muted">Loading library…</span>';
    browseMinimServer('0', []);  // root container, empty breadcrumb
  } else if (src === 'netradio') {
    if (libMeta) libMeta.textContent = 'Net Radio';
    if (tabsRow) tabsRow.style.display = 'none';
    if (searchRow) searchRow.style.display = 'none';
    if (libList) {
      libList.innerHTML = '<div id="preset-list"><span class="muted">Loading presets…</span></div>';
      loadPresets();
    }
  }
}

// ── Spotify albums ────────────────────────────────────────────────────────────
async function loadSpotifyAlbums() {
  const list = document.getElementById('lib-list');
  if (!list) return;
  list.innerHTML = '<span class="muted">Loading albums…</span>';
  try {
    const data = await apiGet('/api/spotify/albums');
    const albums = data.albums ?? [];
    if (albums.length === 0) {
      list.innerHTML = '<span class="muted">No saved albums.</span>';
      return;
    }
    renderAlbumGrid(albums, list);
  } catch (e) {
    list.innerHTML = `<span class="muted">Could not load albums: ${escHtml(e.message)}</span>`;
  }
}

function renderAlbumGrid(albums, container) {
  const grid = document.createElement('div');
  grid.className = 'album-grid';
  grid.innerHTML = albums.map(alb =>
    `<div class="album-card" data-album-id="${escAttr(alb.id ?? '')}" data-uri="${escAttr(alb.uri ?? '')}">
      <div class="album-card-art">
        ${alb.art_url ? `<img src="${escAttr(alb.art_url)}" alt="" loading="lazy">` : ''}
      </div>
      <div class="album-card-name">${escHtml(alb.name ?? '')}</div>
      <div class="album-card-sub">${escHtml(alb.artist ?? '')}${alb.release_date ? ' · ' + escHtml(alb.release_date) : ''}</div>
    </div>`
  ).join('');
  container.innerHTML = '';
  container.appendChild(grid);
  grid.querySelectorAll('.album-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.albumId;
      if (id) navigateAlbum(id);
    });
  });
}

async function navigateAlbum(albumId) {
  _currentAlbumId = albumId;
  _libHistory.push({ type: 'albumgrid', label: 'Albums' });

  const list   = document.getElementById('lib-list');
  const detail = document.getElementById('lib-album-detail');
  const bc     = document.getElementById('lib-breadcrumb');

  if (list)   list.style.display = 'none';
  if (detail) detail.style.display = '';
  if (detail) detail.innerHTML = '<span class="muted">Loading…</span>';
  if (bc) { bc.style.display = ''; renderBreadcrumb(['Albums', '…'], bc); }

  try {
    const data = await apiGet(`/api/spotify/album/${encodeURIComponent(albumId)}`);
    renderAlbumDetail(data.album, data.tracks ?? [], detail);
    if (bc) renderBreadcrumb(['Albums', data.album?.name ?? ''], bc);
  } catch (e) {
    if (detail) detail.innerHTML = `<span class="muted">Failed: ${escHtml(e.message)}</span>`;
  }
}

function renderAlbumDetail(album, tracks, container) {
  const artHtml = album.art_url
    ? `<img src="${escAttr(album.art_url)}" alt="" style="width:80px;height:80px;border-radius:4px;object-fit:cover;">`
    : `<div style="width:80px;height:80px;border-radius:4px;background:linear-gradient(135deg,var(--indigo),var(--magenta));"></div>`;

  const header = `
    <div style="display:flex;gap:1rem;align-items:flex-start;margin-bottom:1rem;">
      ${artHtml}
      <div>
        <div style="font-size:1.1rem;font-weight:600;color:var(--paper);">${escHtml(album.name ?? '')}</div>
        <div style="font-size:0.85rem;color:var(--paper-muted);">${escHtml(album.artist ?? '')}${album.release_date ? ' · ' + escHtml(album.release_date) : ''}${album.total_tracks ? ' · ' + album.total_tracks + ' tracks' : ''}</div>
        <button class="primary-btn" style="margin-top:0.6rem;padding:0.4rem 0.9rem;font-size:0.82rem;" data-play-all="${escAttr(album.uri ?? '')}">&#9654; Play All</button>
      </div>
    </div>`;

  const trackRows = tracks.map((t, i) => `
    <div class="track-item" data-uri="${escAttr(t.uri ?? '')}" data-index="${i}">
      <span class="track-num">${t.track_number ?? (i + 1)}</span>
      <div class="track-info">
        <div class="track-name">${escHtml(t.name ?? '')}</div>
      </div>
      <span class="track-dur">${fmtMs(t.duration_ms ?? 0)}</span>
      <div style="display:flex;gap:0.3rem;">
        <button class="track-play-btn" data-uri="${escAttr(t.uri ?? '')}" title="Play">&#9654;</button>
        <button class="track-queue-btn" data-uri="${escAttr(t.uri ?? '')}" title="Add to queue">+</button>
      </div>
    </div>`
  ).join('');

  container.innerHTML = header + `<div>${trackRows}</div>`;

  // Wire play-all
  container.querySelector('[data-play-all]')?.addEventListener('click', async (e) => {
    const uri = e.currentTarget.dataset.playAll;
    try {
      await apiPost('/api/spotify/playback/play', { context_uri: uri });
      toast('Playing album…', 'success', 2000);
      setTimeout(pollSpotify, 800);
    } catch (err) { toast('Play failed: ' + err.message, 'error'); }
  });

  // Wire per-track play
  container.querySelectorAll('.track-play-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const uri = btn.dataset.uri;
      try {
        await apiPost('/api/spotify/play-track', { uris: [uri], device_id: _spDeviceId || undefined });
        toast('Playing…', 'success', 2000);
        setTimeout(pollSpotify, 800);
      } catch (err) { toast('Play failed: ' + err.message, 'error'); }
    });
  });

  // Wire per-track queue
  container.querySelectorAll('.track-queue-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const uri = btn.dataset.uri;
      try {
        await apiPost('/api/spotify/queue-track', { uri, device_id: _spDeviceId || undefined });
        toast('Added to queue', 'success', 2000);
      } catch (err) { toast('Queue failed: ' + err.message, 'error'); }
    });
  });
}

function renderBreadcrumb(crumbs, container) {
  if (!container) return;
  container.innerHTML = crumbs.map((c, i) => {
    const isCurrent = i === crumbs.length - 1;
    if (isCurrent) return `<span class="breadcrumb-item current">${escHtml(c)}</span>`;
    return `<span class="breadcrumb-item" data-index="${i}">${escHtml(c)}</span><span class="breadcrumb-sep">›</span>`;
  }).join('');
  container.querySelectorAll('.breadcrumb-item:not(.current)').forEach(el => {
    el.addEventListener('click', () => navigateBack());
  });
}

function navigateBack() {
  const list   = document.getElementById('lib-list');
  const detail = document.getElementById('lib-album-detail');
  const bc     = document.getElementById('lib-breadcrumb');
  _libHistory.pop();
  _currentAlbumId = null;
  if (detail) { detail.style.display = 'none'; detail.innerHTML = ''; }
  if (list) list.style.display = '';
  if (bc) { bc.style.display = 'none'; bc.innerHTML = ''; }
}

// ── Search results (4-section) ────────────────────────────────────────────────
function renderSearchResults(r) {
  const list = document.getElementById('lib-list');
  if (!list) return;

  const tracks    = r.track    ?? [];
  const albums    = r.album    ?? [];
  const artists   = r.artist   ?? [];
  const playlists = r.playlist ?? [];

  if (!tracks.length && !albums.length && !artists.length && !playlists.length) {
    list.innerHTML = '<span class="muted">No results.</span>';
    return;
  }

  let html = '';

  if (albums.length) {
    html += `<div class="lib-results-section">Albums</div>`;
    html += `<div class="album-grid search-albums">`;
    html += albums.map(alb =>
      `<div class="album-card" data-album-id="${escAttr(alb.id ?? alb.uri?.split(':').pop() ?? '')}" data-uri="${escAttr(alb.uri ?? '')}">
        <div class="album-card-art">
          ${alb.art_url ? `<img src="${escAttr(alb.art_url)}" alt="" loading="lazy">` : ''}
        </div>
        <div class="album-card-name">${escHtml(alb.name ?? '')}</div>
        <div class="album-card-sub">${escHtml(alb.subtitle ?? alb.artist ?? '')}</div>
      </div>`
    ).join('') + `</div>`;
  }

  if (tracks.length) {
    html += `<div class="lib-results-section">Tracks</div>`;
    html += tracks.map(t =>
      `<div class="lib-item" data-uri="${escAttr(t.uri ?? '')}" data-type="track">
        ${t.art_url ? `<img class="lib-art" src="${escAttr(t.art_url)}" alt="">` : '<div class="lib-art-placeholder"></div>'}
        <div class="lib-info">
          <span class="lib-title">${escHtml(t.name ?? '')}</span>
          <span class="lib-sub">${escHtml(t.subtitle ?? t.artist ?? '')}</span>
        </div>
      </div>`
    ).join('');
  }

  if (artists.length) {
    html += `<div class="lib-results-section">Artists</div>`;
    html += artists.map(a =>
      `<div class="lib-item" data-uri="${escAttr(a.uri ?? '')}" data-type="artist">
        ${a.art_url ? `<img class="lib-art" src="${escAttr(a.art_url)}" alt="">` : '<div class="lib-art-placeholder"></div>'}
        <div class="lib-info">
          <span class="lib-title">${escHtml(a.name ?? '')}</span>
          <span class="lib-sub">Artist</span>
        </div>
      </div>`
    ).join('');
  }

  if (playlists.length) {
    html += `<div class="lib-results-section">Playlists</div>`;
    html += playlists.map(pl =>
      `<div class="lib-item" data-uri="${escAttr(pl.uri ?? '')}" data-type="playlist">
        ${pl.art_url ? `<img class="lib-art" src="${escAttr(pl.art_url)}" alt="">` : '<div class="lib-art-placeholder"></div>'}
        <div class="lib-info">
          <span class="lib-title">${escHtml(pl.name ?? '')}</span>
          <span class="lib-sub">${escHtml(pl.subtitle ?? '')}</span>
        </div>
      </div>`
    ).join('');
  }

  list.innerHTML = html;

  // Wire album grid clicks
  list.querySelectorAll('.album-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.albumId;
      if (id) navigateAlbum(id);
    });
  });

  // Wire lib-item clicks
  wireLibItems(list);
}

// ── MinimServer browser (direct DLNA) ─────────────────────────────────────────
// Browses MinimServer via SOAP ContentDirectory through the backend at
// /api/miniserver/browse. Item shape from the backend:
//   { kind: "container"|"item", id: "<dlna-object-id>", title, artist,
//     album, art_url, track_uri, duration_ms, upnp_class, child_count }
// Navigation uses opaque DLNA object IDs (strings, often slash-separated
// paths like "0/Music/Albums/..."), not numeric indices. Breadcrumb is
// tracked client-side as a stack of {id, title} for back-navigation.

async function browseMinimServer(objectId, breadcrumb) {
  const list = document.getElementById('lib-list');
  const crumbEl = document.getElementById('lib-breadcrumb');
  if (!list) return;
  list.innerHTML = '<span class="muted">Loading…</span>';

  // Update breadcrumb UI
  if (crumbEl) {
    if (breadcrumb && breadcrumb.length > 0) {
      crumbEl.style.display = '';
      crumbEl.innerHTML = breadcrumb.map((c, i) => {
        const isLast = i === breadcrumb.length - 1;
        return isLast
          ? `<span class="crumb crumb-current">${escHtml(c.title)}</span>`
          : `<span class="crumb crumb-link" data-depth="${i}">${escHtml(c.title)}</span>`;
      }).join(' / ');
      // Wire breadcrumb links
      crumbEl.querySelectorAll('.crumb-link').forEach(el => {
        el.addEventListener('click', () => {
          const depth = parseInt(el.dataset.depth, 10);
          const trimmed = breadcrumb.slice(0, depth + 1);
          const target = trimmed[trimmed.length - 1];
          browseMinimServer(target.id, trimmed);
        });
      });
    } else {
      crumbEl.style.display = 'none';
      crumbEl.innerHTML = '';
    }
  }

  try {
    const data = await apiGet(
      `/api/miniserver/browse?id=${encodeURIComponent(objectId)}&count=200`
    );
    const items = data.items ?? [];
    if (items.length === 0) {
      list.innerHTML = '<span class="muted">Empty container.</span>';
      return;
    }
    list.innerHTML = renderMinimItems(items);
    wireMinimItems(list, breadcrumb || []);
  } catch (e) {
    list.innerHTML = `<span class="muted">Browse failed: ${escHtml(e.message)}</span>`;
  }
}

function renderMinimItems(items) {
  return items.map((it) => {
    const isContainer = it.kind === 'container';
    const id = it.id ?? '';
    const title = it.title ?? '';
    const sub = isContainer
      ? `Folder${it.child_count != null ? ' · ' + it.child_count + ' items' : ''}`
      : [it.artist, it.album, it.duration_ms ? fmtMs(it.duration_ms) : null]
          .filter(Boolean).join(' · ');
    const art = it.art_url
      ? `<img class="lib-art" src="${escAttr(it.art_url)}" alt="">`
      : `<div class="lib-art-placeholder">${isContainer ? '📁' : '🎵'}</div>`;
    const playableAttrs = isContainer
      ? ''
      : ` data-track-uri="${escAttr(it.track_uri ?? '')}" data-duration-ms="${it.duration_ms ?? ''}"`;
    return `<div class="lib-item minim-item"
                 data-id="${escAttr(id)}"
                 data-title="${escAttr(title)}"
                 data-container="${isContainer ? '1' : '0'}"${playableAttrs}>
      ${art}
      <div class="lib-info">
        <span class="lib-title">${escHtml(title)}</span>
        <span class="lib-sub">${escHtml(sub)}</span>
      </div>
    </div>`;
  }).join('');
}

function wireMinimItems(listEl, breadcrumb) {
  listEl.querySelectorAll('.minim-item').forEach(el => {
    el.addEventListener('click', async () => {
      const isContainer = el.dataset.container === '1';
      const id = el.dataset.id;
      const title = el.dataset.title;
      if (isContainer) {
        const nextCrumb = breadcrumb.concat([{ id, title }]);
        browseMinimServer(id, nextCrumb);
      } else {
        const trackUri = el.dataset.trackUri;
        if (!trackUri) {
          toast('Track has no playable URI', 'error');
          return;
        }
        try {
          await apiPost('/api/miniserver/play', { track_uri: trackUri });
          toast(`Playing ${title}`, 'success', 2000);
          setTimeout(pollYamaha, 800);
        } catch (e) {
          toast('Play failed: ' + e.message, 'error');
        }
      }
    });
  });
}

// ── MinimServer search ────────────────────────────────────────────────────────
// Hits /api/miniserver/search?q=...&kind=all. Backend builds the UPnP
// search expression. Result shape is the same flat item list as browse.
async function searchMinimServer(q, kind = 'all') {
  const list = document.getElementById('lib-list');
  const crumbEl = document.getElementById('lib-breadcrumb');
  if (!list) return;
  list.innerHTML = '<span class="muted">Searching…</span>';
  if (crumbEl) {
    crumbEl.style.display = '';
    crumbEl.innerHTML = `<span class="crumb crumb-current">Search: ${escHtml(q)}</span>`;
  }
  try {
    const url = `/api/miniserver/search?q=${encodeURIComponent(q)}&kind=${encodeURIComponent(kind)}&count=100`;
    const data = await apiGet(url);
    const items = data.items ?? [];
    if (items.length === 0) {
      list.innerHTML = '<span class="muted">No matches.</span>';
      return;
    }
    list.innerHTML = renderMinimItems(items);
    wireMinimItems(list, []);  // search results have no breadcrumb context
  } catch (e) {
    list.innerHTML = `<span class="muted">Search failed: ${escHtml(e.message)}</span>`;
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────
async function init() {
  startClock();
  startScrub();
  wireButtons();
  wireLibSourceTabs();
  checkMinimServer();

  // Initial parallel polls
  await Promise.allSettled([pollSpotify(), pollYamaha(), pollDevices()]);
  await Promise.allSettled([loadPlaylists(), pollQueue()]);

  // Polling intervals
  setInterval(pollSpotify,  3000);
  setInterval(pollDevices,  5000);
  setInterval(pollYamaha,   5000);
  setInterval(pollQueue,   15000);
}

document.addEventListener('DOMContentLoaded', init);
