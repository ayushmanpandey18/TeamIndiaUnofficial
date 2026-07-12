// ── NAV SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ── API HELPER ──
async function fetchData(endpoint) {
  try {
    const res = await fetch('/api/' + endpoint);
    const data = await res.json();
    return data.success ? data.data : [];
  } catch (e) { console.error('API Error:', e); return []; }
}

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── LOAD SHOWS ──
async function loadShows() {
  const shows = await fetchData('shows');
  const container = document.getElementById('shows-container');
  if (!shows.length) { container.innerHTML = '<p class="shows-empty">No upcoming shows at the moment.</p>'; return; }
  container.innerHTML = shows.map(show => {
    const date = new Date(show.show_date);
    return `<a class="show-card" href="${show.ticket_url || '#'}" target="_blank" style="display:flex">
      <div class="show-date"><div class="day">${date.getDate()}</div><div class="month">${months[date.getMonth()]}</div></div>
      <div class="show-info"><h3>${show.title}</h3><p class="venue">${show.venue}, ${show.city}</p>${show.show_time ? `<p>${show.show_time} · Limited Seats</p>` : ''}</div>
      <span class="btn-gold" style="font-size:10px;padding:12px 22px;white-space:nowrap;align-self:center">Get Tickets →</span>
    </a>`;
  }).join('');
}

// ── LOAD VIDEOS ──
async function loadVideos() {
  const videos = await fetchData('videos');
  const grid = document.getElementById('videos-grid');
  if (!videos.length) { grid.innerHTML = '<div class="loading">No videos found.</div>'; return; }
  function getYTId(url) { const m = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/); return m ? m[1] : null; }
  grid.innerHTML = videos.map(v => {
    const ytId = getYTId(v.youtube_url);
    const thumb = v.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '');
    return `<a class="video-card" href="${v.youtube_url}" target="_blank">
      <div class="video-thumb">${thumb ? `<img src="${thumb}" alt="${v.title}" loading="lazy"/>` : ''}<div class="play-btn"></div></div>
      <div class="video-info"><h4>${v.title}</h4></div>
    </a>`;
  }).join('');
}

// ── LOAD NEWS ──
async function loadNews() {
  const news = await fetchData('news');
  const grid = document.getElementById('news-grid');
  if (!news.length) { grid.innerHTML = '<div class="loading">No news found.</div>'; return; }
  grid.innerHTML = news.map(n => `
    <a class="news-card" href="${n.article_url || '#'}" target="_blank">
      <p class="news-source">${n.source_name}</p><h4>${n.headline}</h4>
      <span class="news-arrow">→</span>
    </a>`).join('');
}

// ── LOAD TESTIMONIALS ──
let testiCurrent = 0, testiTimer;
async function loadTestimonials() {
  const testis = await fetchData('testimonials');
  const slider = document.getElementById('testi-slider');
  const dots = document.getElementById('testi-dots');
  if (!testis.length) { slider.innerHTML = '<div class="loading">No testimonials found.</div>'; return; }
  slider.innerHTML = testis.map((t, i) => `
    <div class="testi-slide ${i === 0 ? 'active' : ''}">
      <p class="testi-text">"${t.quote}"</p>
      <p class="testi-author">${t.author_name}</p>
      ${t.author_role ? `<p class="testi-role">${t.author_role}</p>` : ''}
    </div>`).join('');
  dots.innerHTML = testis.map((_, i) => `<button class="dot ${i === 0 ? 'active' : ''}" onclick="goSlide(${i})"></button>`).join('');
  startSlider(testis.length);
}
function goSlide(n) {
  const slides = document.querySelectorAll('.testi-slide');
  const dots = document.querySelectorAll('.dot');
  if (!slides.length) return;
  slides[testiCurrent]?.classList.remove('active'); dots[testiCurrent]?.classList.remove('active');
  testiCurrent = n;
  slides[testiCurrent]?.classList.add('active'); dots[testiCurrent]?.classList.add('active');
}
function startSlider(total) { clearInterval(testiTimer); testiTimer = setInterval(() => goSlide((testiCurrent + 1) % total), 4500); }

// ── LOAD SETTINGS ──
async function loadSettings() {
  const settings = await fetchData('settings');
  if (!settings) return;
  if (settings.hero_tagline) { const el = document.getElementById('hero-tagline'); if (el) el.textContent = settings.hero_tagline; }
  if (settings.contact_email) {
    const el = document.getElementById('contact-email-display'); if (el) el.textContent = settings.contact_email;
    const fe = document.getElementById('footer-email'); if (fe) { fe.textContent = settings.contact_email; fe.href = 'mailto:' + settings.contact_email; }
  }
  if (settings.youtube_url) {
    const el = document.getElementById('yt-link'); if (el) el.href = settings.youtube_url;
    const fe = document.getElementById('yt-footer'); if (fe) fe.href = settings.youtube_url;
  }
  if (settings.instagram_url) { const fe = document.getElementById('ig-footer'); if (fe) fe.href = settings.instagram_url; }
}

// ── SUBSCRIBE ──
function subscribe() {
  const email = document.getElementById('nl-email').value.trim();
  if (!email || !email.includes('@')) { alert('Please enter a valid email address.'); return; }
  alert('Thank you for subscribing! 🏏');
  document.getElementById('nl-email').value = '';
}

// ── INIT ──
(async () => {
  await Promise.all([loadSettings(), loadShows(), loadVideos(), loadNews(), loadTestimonials()]);
})();

// ── GALLERY ANIMATION ──
const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.gallery-item').forEach(el => galleryObserver.observe(el));

// ── STATS COUNTER ──
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const step = target / (2000 / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { el.textContent = target.toLocaleString(); clearInterval(timer); return; }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num[data-target]').forEach(el => statObserver.observe(el));

// ── PLAYER SEARCH ──
window.searchPlayer = async function() {
  const q = document.getElementById('player-input').value.trim();
  const result = document.getElementById('player-result');
  if (!q) return;

  result.innerHTML = '<p class="not-found">🔍 Searching...</p>';

  try {
    const searchRes = await fetch(`/api/player/search?name=${encodeURIComponent(q)}`);
    const searchData = await searchRes.json();
    const players = searchData.data?.response?.items || [];

    if (!players.length) {
      result.innerHTML = '<p class="not-found">Player not found! Try: Kohli, Rohit, Bumrah...</p>';
      return;
    }

    const player = players.find(p => p.title.toLowerCase().includes(q.toLowerCase())) || players[0];

    const statsRes = await fetch(`/api/player/stats/${player.pid}`);
    const statsData = await statsRes.json();

    // CORRECT PATH: data.response.batting / data.response.bowling
    const r = statsData.data?.response || {};
    const bat = r.batting || {};
    const bowl = r.bowling || {};
    const p = r.player || player;

    result.innerHTML = `
  <div class="player-card">
    <div style="display:flex;align-items:center;gap:24px;margin-bottom:30px">
      ${p.profile_image ? `<img src="${p.profile_image}" style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid var(--gold)"/>` : ''}
      <div style="text-align:left">
        <div class="player-name">${p.title || player.title}</div>
        <div class="player-role">${p.bowling_style || p.batting_style || ''}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:6px">📍 ${p.birthplace || '–'} · 🎂 ${p.birthdate || '–'}</div>
        <div style="font-size:12px;color:var(--muted);margin-top:4px">🏏 ${p.playing_role?.toUpperCase() || '–'} · ⭐ Rating: ${p.fantasy_player_rating || '–'}</div>
      </div>
    </div>

    <div style="margin-bottom:10px;font-size:11px;letter-spacing:3px;color:var(--gold)">BATTING</div>
    <div class="player-stats" style="grid-template-columns:repeat(4,1fr)">
      <div class="p-stat"><div class="p-stat-num">${bat.test?.runs ?? '–'}</div><div class="p-stat-label">Test Runs</div></div>
      <div class="p-stat"><div class="p-stat-num">${bat.odi?.runs ?? '–'}</div><div class="p-stat-label">ODI Runs</div></div>
      <div class="p-stat"><div class="p-stat-num">${bat.t20i?.runs ?? '–'}</div><div class="p-stat-label">T20 Runs</div></div>
      <div class="p-stat"><div class="p-stat-num">${bat.test?.average ?? '–'}</div><div class="p-stat-label">Test Avg</div></div>
      <div class="p-stat"><div class="p-stat-num">${bat.test?.highest ?? '–'}</div><div class="p-stat-label">Test HS</div></div>
      <div class="p-stat"><div class="p-stat-num">${bat.odi?.highest ?? '–'}</div><div class="p-stat-label">ODI HS</div></div>
      <div class="p-stat"><div class="p-stat-num">${bat.test?.run100 ?? '–'}</div><div class="p-stat-label">100s</div></div>
      <div class="p-stat"><div class="p-stat-num">${bat.test?.run50 ?? '–'}</div><div class="p-stat-label">50s</div></div>
    </div>

    <div style="margin-top:24px;margin-bottom:10px;font-size:11px;letter-spacing:3px;color:var(--gold)">BOWLING</div>
    <div class="player-stats" style="grid-template-columns:repeat(4,1fr)">
      <div class="p-stat"><div class="p-stat-num">${bowl.test?.wickets ?? '–'}</div><div class="p-stat-label">Test Wkts</div></div>
      <div class="p-stat"><div class="p-stat-num">${bowl.odi?.wickets ?? '–'}</div><div class="p-stat-label">ODI Wkts</div></div>
      <div class="p-stat"><div class="p-stat-num">${bowl.t20i?.wickets ?? '–'}</div><div class="p-stat-label">T20 Wkts</div></div>
      <div class="p-stat"><div class="p-stat-num">${bowl.test?.average ?? '–'}</div><div class="p-stat-label">Bowl Avg</div></div>
      <div class="p-stat"><div class="p-stat-num">${bowl.test?.econ ?? '–'}</div><div class="p-stat-label">Test Econ</div></div>
      <div class="p-stat"><div class="p-stat-num">${bowl.odi?.econ ?? '–'}</div><div class="p-stat-label">ODI Econ</div></div>
      <div class="p-stat"><div class="p-stat-num">${bowl.test?.bestinning ?? '–'}</div><div class="p-stat-label">Best Inn</div></div>
      <div class="p-stat"><div class="p-stat-num">${bowl.test?.wicket5i ?? '–'}</div><div class="p-stat-label">5 Wkts</div></div>
    </div>

    ${r.iccplayerranking?.length ? `
    <div style="margin-top:24px;margin-bottom:10px;font-size:11px;letter-spacing:3px;color:var(--gold)">ICC RANKINGS</div>
    <div class="player-stats" style="grid-template-columns:repeat(3,1fr)">
      ${r.iccplayerranking.map(rank => `
        <div class="p-stat">
          <div class="p-stat-num">#${rank.rank}</div>
          <div class="p-stat-label">${rank.format} ${rank.type}</div>
        </div>`).join('')}
    </div>` : ''}
  </div>`;
  } catch(e) {
    result.innerHTML = '<p class="not-found">Error! Try again.</p>';
  }
};

document.getElementById('player-input')?.addEventListener('keypress', e => {
  if (e.key === 'Enter') searchPlayer();
});
