// ══════════════════════════════════════════════════════════
// TEAM INDIA OFFICIAL TRIBUTE – GSAP & LENIS MASTER ENGINE
// ══════════════════════════════════════════════════════════

// Register GSAP Plugins
if (typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// ── LENIS SMOOTH SCROLL INITIALIZATION ──
let lenis = null;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.25,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.8,
    infinite: false,
  });

  // Synchronize Lenis with GSAP ScrollTrigger
  lenis.on('scroll', () => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.update();
    }
  });

  // Drive Lenis RAF with GSAP Ticker for unified 60/120fps sync
  if (typeof gsap !== 'undefined') {
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

// ── CUSTOM CURSOR WITH GSAP QUICKTO ──
const cursorDot = document.getElementById('cursor-dot');
const cursorGlow = document.getElementById('cursor-glow');

if (cursorDot && cursorGlow && window.matchMedia('(pointer: fine)').matches) {
  const setDotX = gsap.quickTo(cursorDot, 'x', { duration: 0.05, ease: 'power3' });
  const setDotY = gsap.quickTo(cursorDot, 'y', { duration: 0.05, ease: 'power3' });
  const setGlowX = gsap.quickTo(cursorGlow, 'x', { duration: 0.25, ease: 'power2.out' });
  const setGlowY = gsap.quickTo(cursorGlow, 'y', { duration: 0.25, ease: 'power2.out' });

  window.addEventListener('mousemove', (e) => {
    setDotX(e.clientX);
    setDotY(e.clientY);
    setGlowX(e.clientX);
    setGlowY(e.clientY);
  });

  const interactiveElements = 'a, button, input, .gallery-item, .show-card, .achievement-card, .video-card, .tag-btn, .persona-item, .news-card, .title-word span';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveElements)) {
      cursorGlow.classList.add('active');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveElements)) {
      cursorGlow.classList.remove('active');
    }
  });
}

// ── BUILD & ANIMATE 3D HERO IMAGE FRAGMENTS (SHATTER & ASSEMBLE) ──
function buildHero3DFragments() {
  const container = document.getElementById('hero-shatter-container');
  if (!container) return [];

  const isMobile = window.innerWidth < 768;
  const cols = isMobile ? 4 : 6;
  const rows = 4;
  container.innerHTML = '';

  const tileW = 100 / cols;
  const tileH = 100 / rows;
  const tiles = [];
  const customBg = window.__heroBgImage || '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tile = document.createElement('div');
      tile.className = 'shatter-tile';
      tile.style.left = `${c * tileW}%`;
      tile.style.top = `${r * tileH}%`;
      tile.style.width = `${tileW}%`;
      tile.style.height = `${tileH}%`;

      const inner = document.createElement('div');
      inner.className = 'shatter-tile-inner';
      inner.style.left = `-${c * 100}%`;
      inner.style.top = `-${r * 100}%`;
      inner.style.width = `${cols * 100}%`;
      inner.style.height = `${rows * 100}%`;
      if (customBg) {
        inner.style.backgroundImage = `url("${customBg}")`;
      }

      tile.appendChild(inner);
      container.appendChild(tile);

      // Smooth 3D depth scatter
      const zDist = gsap.utils.random(300, 800);
      const xSpread = (c - (cols - 1) / 2) * 80 + gsap.utils.random(-80, 80);
      const ySpread = (r - (rows - 1) / 2) * 80 + gsap.utils.random(-80, 80);
      const rotX = gsap.utils.random(-45, 45);
      const rotY = gsap.utils.random(-45, 45);
      const rotZ = gsap.utils.random(-25, 25);

      gsap.set(tile, {
        x: xSpread,
        y: ySpread,
        z: zDist,
        rotationX: rotX,
        rotationY: rotY,
        rotationZ: rotZ,
        scale: 0.85,
        opacity: 0,
        transformOrigin: '50% 50% -30px'
      });

      tiles.push(tile);
    }
  }

  return tiles;
}

// ── HERO CINEMATIC GSAP TIMELINE ──
function initHeroAnimation() {
  if (typeof gsap === 'undefined') return;
  const heroContent = document.getElementById('hero-content');
  if (!heroContent) return;

  const heroBg = document.getElementById('hero-bg');
  if (heroBg) gsap.set(heroBg, { opacity: 0 });

  // 1. Build and position 3D fragments
  const tiles = buildHero3DFragments();

  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // 2. Animate scattered pieces converging smoothly into the picture
  if (tiles.length) {
    heroTl.to(tiles, {
      x: 0,
      y: 0,
      z: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 1,
      opacity: 1,
      duration: 1.5,
      stagger: {
        amount: 0.5,
        from: 'center'
      },
      ease: 'expo.out'
    }, 0);

    // Subtle golden seam glow when joining
    heroTl.to(tiles, {
      borderColor: 'rgba(201, 168, 76, 0.6)',
      boxShadow: '0 0 20px rgba(201, 168, 76, 0.4)',
      duration: 0.35,
      ease: 'power2.out'
    }, '-=0.4');

    // Fuse pieces into seamless background
    heroTl.to(tiles, {
      borderColor: 'transparent',
      boxShadow: 'none',
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        tiles.forEach(t => t.classList.add('fused'));
        if (heroBg) gsap.to(heroBg, { opacity: 1, duration: 0.4 });
      }
    }, '+=0.1');
  }

  // 3. Navigation Reveal
  heroTl.fromTo('#nav',
    { y: -60, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out' },
    0.3
  );

  // 4. Stately Eyebrow Reveal
  heroTl.fromTo('.hero-eyebrow',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    0.8
  );

  // 5. Majestic Title Letters Reveal
  const letters = document.querySelectorAll('.hero-title span span');
  if (letters.length) {
    heroTl.fromTo(letters,
      {
        opacity: 0,
        y: 40,
        rotationX: 30
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        stagger: 0.025,
        duration: 0.8,
        ease: 'power3.out'
      },
      0.95
    );
  }

  // 6. Subtitle Reveal
  heroTl.fromTo('#hero-tagline',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    1.25
  );

  // 7. Buttons Reveal
  heroTl.fromTo('.hero-btns a',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out' },
    1.45
  );

  // 8. Stats Bar Reveal
  heroTl.fromTo('.hero-quick-stats',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    1.65
  );

  heroTl.fromTo('.hero-scroll',
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
    1.85
  );

  initHeroLetterInteractions();

  // Subtle Mouse Parallax on Hero Content
  const heroSection = document.querySelector('.hero');

  if (heroSection && heroContent && window.matchMedia('(pointer: fine)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const xNorm = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const yNorm = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      gsap.to(heroContent, {
        rotationY: xNorm * 4,
        rotationX: -yNorm * 4,
        ease: 'power1.out',
        duration: 0.6
      });

      if (heroBg) {
        gsap.to(heroBg, {
          x: -xNorm * 12,
          y: -yNorm * 12,
          ease: 'power1.out',
          duration: 0.8
        });
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      gsap.to(heroContent, { rotationY: 0, rotationX: 0, ease: 'power2.out', duration: 0.8 });
      if (heroBg) gsap.to(heroBg, { x: 0, y: 0, ease: 'power2.out', duration: 0.8 });
    });
  }

  // Hero ScrollTrigger: background zoom + content fade on scroll
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.to('#hero-shatter-container, #hero-bg', {
      scale: 1.15,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });

    gsap.to(heroContent, {
      y: -70,
      opacity: 0,
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '65% top',
        scrub: 1
      }
    });
  }
}

// ── REFINED INTERACTIVE HOVER ON TITLE ──
let letterInteractionsInitialized = false;
function initHeroLetterInteractions() {
  if (letterInteractionsInitialized) return;
  letterInteractionsInitialized = true;

  const letterSpans = document.querySelectorAll('.hero-title span span');
  letterSpans.forEach(span => {
    span.addEventListener('mouseenter', () => {
      gsap.to(span, {
        y: -6,
        color: '#F5DF97',
        duration: 0.25,
        ease: 'power2.out'
      });
    });

    span.addEventListener('mouseleave', () => {
      gsap.to(span, {
        y: 0,
        color: '',
        duration: 0.4,
        ease: 'power2.out'
      });
    });
  });
}

// ── NAVBAR SCROLL REVEAL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

// ── SMOOTH SCROLL FOR ANCHOR LINKS (LENIS & GSAP) ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#' || !targetId) return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(targetEl, {
          offset: -75,
          duration: 1.3,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else if (typeof gsap !== 'undefined' && gsap.plugins.scrollTo) {
        gsap.to(window, {
          duration: 1.1,
          scrollTo: { y: targetEl, offsetY: 75 },
          ease: 'power3.inOut'
        });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ── SCROLLTRIGGER SECTION ANIMATIONS (CENTRALIZED & POST-LOAD) ──
function initAllScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // 1. SECTION HEADERS
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.fromTo(header.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // 2. UPCOMING MATCHES / FIXTURES (.show-card)
  const showCards = document.querySelectorAll('#shows-container .show-card');
  if (showCards.length) {
    showCards.forEach((card) => {
      const dayEl = card.querySelector('.day');
      const sheenEl = card.querySelector('.show-sheen');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });

      tl.fromTo(card,
        { opacity: 0, y: 65, scale: 0.94, rotationX: 12 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.9,
          ease: 'power3.out'
        }
      );

      if (dayEl) {
        tl.fromTo(dayEl,
          { scale: 0.5, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' },
          '-=0.6'
        );
      }

      if (sheenEl) {
        tl.to(sheenEl, {
          x: '250%',
          duration: 1.0,
          ease: 'power2.inOut'
        }, '-=0.5');
      }
    });
  }

  // 3. ABOUT SECTION TEXT
  const aboutText = document.querySelector('.about-text');
  if (aboutText) {
    gsap.fromTo(aboutText.children,
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: aboutText,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // 4. STAT COUNTERS
  initStatCounters();

  // 5. GALLERY GRID ITEMS
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    gsap.fromTo(galleryItems,
      { opacity: 0, y: 50, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.1,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.gallery-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // 6. ACHIEVEMENTS GRID (.achievement-card)
  const achieveCards = document.querySelectorAll('.achievement-card');
  if (achieveCards.length) {
    gsap.fromTo(achieveCards,
      { opacity: 0, y: 65, scale: 0.92, rotationX: 15 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        stagger: 0.12,
        duration: 0.95,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: '.achievements-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // 7. PLAYER SEARCH CARD
  const searchCard = document.querySelector('.player-search-card');
  if (searchCard) {
    gsap.fromTo(searchCard,
      { opacity: 0, y: 40, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: searchCard,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // 8. SPIRIT / PERSONA PILLARS (.persona-item)
  const personaCards = document.querySelectorAll('.persona-item');
  if (personaCards.length) {
    gsap.fromTo(personaCards,
      { opacity: 0, y: 60, scale: 0.93, rotationX: 15 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        stagger: 0.15,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.persona-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // 9. VIDEO HIGHLIGHTS (.video-card)
  animateVideos();

  // 10. NEWS GRID (.news-card)
  const newsCards = document.querySelectorAll('.news-card');
  if (newsCards.length) {
    gsap.fromTo(newsCards,
      { opacity: 0, y: 55, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.news-grid',
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  }

  // 11. 3D TILT ON ALL INTERACTIVE CARDS
  enable3DTilt('.achievement-card, .persona-item, .show-card, .video-card');

  // 12. Finalize coordinates with ScrollTrigger
  ScrollTrigger.refresh();
}

// 3D Card Hover Tilt Helper
function enable3DTilt(selector) {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xPct = (x / rect.width - 0.5) * 16;
      const yPct = (y / rect.height - 0.5) * -16;

      gsap.to(card, {
        rotationY: xPct,
        rotationX: yPct,
        transformPerspective: 1000,
        ease: 'power1.out',
        duration: 0.3
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        ease: 'power2.out',
        duration: 0.6
      });
    });
  });
}

// ── GSAP COUNTER ANIMATION ──
function initStatCounters() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  document.querySelectorAll('.stat-num[data-target]').forEach(counter => {
    const target = +counter.dataset.target;
    const dummy = { val: 0 };

    gsap.to(dummy, {
      val: target,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: counter,
        start: 'top 88%',
        once: true
      },
      onUpdate: () => {
        counter.textContent = Math.floor(dummy.val).toLocaleString();
      },
      onComplete: () => {
        counter.textContent = target.toLocaleString();
      }
    });
  });
}

// ── API HELPER ──
async function fetchData(endpoint) {
  try {
    const res = await fetch('/api/' + endpoint);
    if (!res.ok) return [];
    const data = await res.json();
    return data.success && Array.isArray(data.data) ? data.data : (data.data ? [data.data] : []);
  } catch (e) {
    console.warn(`API ${endpoint} not available, using premium defaults.`, e);
    return [];
  }
}

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// ── LOAD FIXTURES (SHOWS) ──
async function loadShows() {
  const container = document.getElementById('shows-container');
  if (!container) return;
  let shows = await fetchData('shows');

  if (!shows || !shows.length) {
    shows = [
      {
        title: 'India vs England – 1st T20 International',
        venue: 'Eden Gardens',
        city: 'Kolkata, India',
        show_date: '2026-11-28',
        show_time: '7:00 PM IST',
        ticket_url: 'https://www.bcci.tv',
        badge: 'T20 Series'
      },
      {
        title: 'India vs England – 2nd T20 International',
        venue: 'Narendra Modi Stadium',
        city: 'Ahmedabad, India',
        show_date: '2026-12-02',
        show_time: '7:00 PM IST',
        ticket_url: 'https://www.bcci.tv',
        badge: 'T20 Series'
      },
      {
        title: 'India vs Australia – ICC Champions Trophy Opener',
        venue: 'Wankhede Stadium',
        city: 'Mumbai, India',
        show_date: '2026-12-18',
        show_time: '2:00 PM IST',
        ticket_url: 'https://www.bcci.tv',
        badge: 'ICC Champions Trophy'
      }
    ];
  }

  container.innerHTML = shows.map(show => {
    const date = new Date(show.show_date);
    const day = isNaN(date.getDate()) ? '28' : date.getDate();
    const month = isNaN(date.getMonth()) ? 'NOV' : months[date.getMonth()];
    const badgeText = show.badge || (show.show_time ? 'BCCI International' : 'Match Day');

    return `
      <a class="show-card" href="${show.ticket_url || 'https://www.bcci.tv'}" target="_blank" rel="noopener noreferrer">
        <div class="show-sheen"></div>
        <div class="show-date">
          <div class="day">${day}</div>
          <div class="month">${month}</div>
        </div>
        <div class="show-info">
          <span class="show-badge">${badgeText}</span>
          <h3>${show.title}</h3>
          <p class="venue">📍 ${show.venue}, ${show.city}</p>
          ${show.show_time ? `<p style="margin-top:4px">⏰ ${show.show_time} · Official BCCI Fixture</p>` : ''}
        </div>
        <div class="show-cta">
          <span class="btn-gold" style="font-size:11px;padding:12px 24px;">Get Tickets →</span>
        </div>
      </a>`;
  }).join('');
}

// ── LOAD VIDEOS (HIGHLIGHTS) ──
async function loadVideos() {
  const grid = document.getElementById('videos-grid');
  if (!grid) return;
  let videos = await fetchData('videos');

  if (!videos || !videos.length) {
    videos = [
      {
        title: 'ICC Men\'s T20 World Cup 2024 Final: India vs South Africa Triumph',
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
      },
      {
        title: 'Cricket World Cup 2011 Final: MS Dhoni 91* & The Winning Six | Match Highlights',
        youtube_url: 'https://www.youtube.com/watch?v=XhBw0y6pY1A',
        thumbnail_url: 'https://img.youtube.com/vi/XhBw0y6pY1A/maxresdefault.jpg'
      },
      {
        title: "ICC Men's T20 World Cup 2007 Final: India vs Pakistan Historic Highlights",
        youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
      },
      {
        title: "Cricket World Cup 1983 Final: Kapil Dev's Historic Trophy Triumph at Lord's",
        youtube_url: 'https://www.youtube.com/watch?v=kYQ8Q1dE31I',
        thumbnail_url: 'https://img.youtube.com/vi/kYQ8Q1dE31I/maxresdefault.jpg'
      },
      {
        title: "India's Historic Triumph at Fortress Gabba | Border-Gavaskar Trophy Highlights",
        youtube_url: 'https://www.youtube.com/watch?v=XhBw0y6pY1A',
        thumbnail_url: 'https://img.youtube.com/vi/XhBw0y6pY1A/maxresdefault.jpg'
      },
      {
        title: "2013 Champions Trophy Final: India vs England Edge of the Seat Thriller",
        youtube_url: 'https://www.youtube.com/watch?v=kYQ8Q1dE31I',
        thumbnail_url: 'https://img.youtube.com/vi/kYQ8Q1dE31I/maxresdefault.jpg'
      }
    ];
  }

  function getYTId(url) {
    if (!url) return null;
    const m = url.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/);
    return m ? m[1] : null;
  }

  grid.innerHTML = videos.map(v => {
    const ytId = getYTId(v.youtube_url);
    const thumb = v.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '/images/uploads/Design1.png');
    return `
      <div class="video-card" data-yt="${ytId || ''}" data-url="${v.youtube_url}" data-title="${v.title}">
        <div class="video-sheen"></div>
        <div class="video-thumb">
          <img src="${thumb}" alt="${v.title}" loading="lazy"/>
          <div class="video-badge"><span>YOUTUBE</span></div>
          <div class="play-btn-wrap">
            <div class="play-btn"></div>
          </div>
        </div>
        <div class="video-info">
          <h4>${v.title}</h4>
        </div>
      </div>`;
  }).join('');
}

// ── CINEMATIC 3D VIDEO ENTRANCE & SHEEN ANIMATION ──
function animateVideos() {
  const cards = document.querySelectorAll('#videos-grid .video-card');
  if (!cards.length) return;

  if (typeof gsap === 'undefined') {
    cards.forEach(c => c.style.opacity = '1');
    return;
  }

  // Initial 3D transform & opacity setup
  gsap.set(cards, {
    opacity: 0,
    y: 75,
    scale: 0.88,
    rotationX: 22,
    transformOrigin: '50% 100% -40px',
    transformPerspective: 1200
  });

  const thumbs = document.querySelectorAll('#videos-grid .video-thumb img');
  gsap.set(thumbs, { scale: 1.2, filter: 'brightness(0.6)' });

  const playBtns = document.querySelectorAll('#videos-grid .play-btn');
  gsap.set(playBtns, { scale: 0, rotation: -45 });

  const badges = document.querySelectorAll('#videos-grid .video-badge');
  gsap.set(badges, { opacity: 0, y: -10 });

  const infoTitles = document.querySelectorAll('#videos-grid .video-info h4');
  gsap.set(infoTitles, { opacity: 0, y: 15 });

  // ScrollTrigger Timeline
  const videoTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#videos-grid',
      start: 'top 85%',
      once: true,
      onEnter: () => {
        document.querySelectorAll('.video-sheen').forEach((sheen, idx) => {
          gsap.to(sheen, {
            x: '250%',
            duration: 1.1,
            delay: idx * 0.12 + 0.35,
            ease: 'power2.inOut'
          });
        });
      }
    }
  });

  // 1. Stagger 3D Cards entry
  videoTl.to(cards, {
    opacity: 1,
    y: 0,
    scale: 1,
    rotationX: 0,
    duration: 1.0,
    stagger: {
      each: 0.12,
      from: 'start'
    },
    ease: 'power4.out'
  });

  // 2. Thumbnails zoom in smoothly to 1.0
  videoTl.to(thumbs, {
    scale: 1.0,
    filter: 'brightness(0.85)',
    duration: 1.2,
    stagger: 0.12,
    ease: 'power3.out'
  }, '-=0.9');

  // 3. Play buttons pop in with golden elastic bounce
  videoTl.to(playBtns, {
    scale: 1,
    rotation: 0,
    duration: 0.75,
    stagger: 0.1,
    ease: 'back.out(2.2)'
  }, '-=0.85');

  // 4. Badges slide down into view
  videoTl.to(badges, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out'
  }, '-=0.8');

  // 5. Video titles reveal with slide up
  videoTl.to(infoTitles, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  }, '-=0.7');

  // 6. Enable interactive 3D mouse parallax tilt
  enable3DTilt('#videos-grid .video-card');

  // 7. Setup video modal cinema click
  setupVideoModal();
}

// ── CINEMA VIDEO MODAL PLAYER ──
function setupVideoModal() {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('video-iframe');
  const modalTitle = document.getElementById('video-modal-title');
  const ytBtn = document.getElementById('video-modal-yt-btn');
  const closeBtn = document.getElementById('video-modal-close');
  const backdrop = document.getElementById('video-backdrop');

  if (!modal) return;

  document.querySelectorAll('#videos-grid .video-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const ytId = card.dataset.yt;
      const rawUrl = card.dataset.url;
      const title = card.dataset.title || 'Team India Highlight';

      if (modalTitle) modalTitle.textContent = title;
      if (ytBtn) ytBtn.href = rawUrl || (ytId ? `https://www.youtube.com/watch?v=${ytId}` : 'https://www.youtube.com/@BCCI');

      if (iframe) {
        if (ytId) {
          iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`;
        } else {
          iframe.src = rawUrl;
        }
      }

      if (lenis) lenis.stop();
      modal.classList.add('open');

      if (typeof gsap !== 'undefined') {
        gsap.fromTo('#video-modal-content',
          { scale: 0.85, opacity: 0, y: 30 },
          { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: 'back.out(1.4)' }
        );
      }
    });
  });

  const closeVideoModal = () => {
    if (modal.classList.contains('open')) {
      if (iframe) iframe.src = '';
      if (lenis) lenis.start();

      if (typeof gsap !== 'undefined') {
        gsap.to('#video-modal-content', {
          scale: 0.88,
          opacity: 0,
          duration: 0.3,
          onComplete: () => modal.classList.remove('open')
        });
      } else {
        modal.classList.remove('open');
      }
    }
  };

  closeBtn?.addEventListener('click', closeVideoModal);
  backdrop?.addEventListener('click', closeVideoModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeVideoModal();
    }
  });
}

// ── LOAD NEWS ──
async function loadNews() {
  const grid = document.getElementById('news-grid');
  if (!grid) return;
  let news = await fetchData('news');

  if (!news || !news.length) {
    news = [
      {
        source_name: 'BCCI Official',
        headline: 'Team India Squad Announced for Upcoming Home Series & Champions Trophy Camp',
        article_url: 'https://www.bcci.tv'
      },
      {
        source_name: 'ICC Dispatches',
        headline: 'India Retains Top Position Across All ICC World Rankings Following Dominant Run',
        article_url: 'https://www.icc-cricket.com'
      },
      {
        source_name: 'Cricket Chronicle',
        headline: 'The Masterclass of Indian Pace Bowling: How Bumrah & Co. Redefined Fast Bowling Worldwide',
        article_url: 'https://www.espncricinfo.com'
      }
    ];
  }

  grid.innerHTML = news.map(n => `
    <a class="news-card" href="${n.article_url || 'https://www.bcci.tv'}" target="_blank" rel="noopener noreferrer">
      <div>
        <p class="news-source">🏏 ${n.source_name}</p>
        <h4>${n.headline}</h4>
      </div>
      <span class="news-arrow">Read Official Release →</span>
    </a>`).join('');
}

// ── LOAD TESTIMONIALS (VOICES OF CRICKET) ──
let testiCurrent = 0;
let testiTimer = null;
let testiList = [];

async function loadTestimonials() {
  const slider = document.getElementById('testi-slider');
  if (!slider) return;
  const dots = document.getElementById('testi-dots');
  let testis = await fetchData('testimonials');

  if (!testis || !testis.length) {
    testis = [
      {
        quote: "When you step out onto the pitch in that blue jersey with INDIA on your chest, you carry the hopes, dreams, and pulse of 1.4 billion people. There is no greater honour in sport.",
        author_name: "Virat Kohli",
        author_role: "Modern Legend & Former India Captain"
      },
      {
        quote: "India's cricket is not just a game; it is an emotion that unites our diverse country like nothing else. In 2011, when we held that cup, tears flowed for a dream fulfilled.",
        author_name: "Sachin Tendulkar",
        author_role: "The Master Blaster · 100 International Centuries"
      },
      {
        quote: "We don't play to prove anything to anyone; we play to uphold the legacy of every legend who paved the way before us. Winning for India is in our blood.",
        author_name: "Rohit Sharma",
        author_role: "ICC T20 World Cup Winning Captain 2024"
      },
      {
        quote: "Till the last ball is bowled, Team India never gives up. That calm belief under extreme pressure is what makes champions.",
        author_name: "MS Dhoni",
        author_role: "Legendary Captain · 2007 T20 & 2011 ODI World Cup Winner"
      }
    ];
  }

  testiList = testis;

  slider.innerHTML = testis.map((t, i) => `
    <div class="testi-slide ${i === 0 ? 'active' : ''}" id="testi-slide-${i}">
      <p class="testi-text">"${t.quote}"</p>
      <p class="testi-author">${t.author_name}</p>
      ${t.author_role ? `<p class="testi-role">${t.author_role}</p>` : ''}
    </div>`).join('');

  dots.innerHTML = testis.map((_, i) => `
    <button class="dot ${i === 0 ? 'active' : ''}" onclick="goSlide(${i})" aria-label="Quote ${i+1}"></button>`).join('');

  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');
  if (prevBtn) prevBtn.onclick = () => goSlide((testiCurrent - 1 + testiList.length) % testiList.length);
  if (nextBtn) nextBtn.onclick = () => goSlide((testiCurrent + 1) % testiList.length);

  startTestiSlider();
}

function goSlide(n) {
  if (testiCurrent === n || !testiList.length) return;

  const slides = document.querySelectorAll('.testi-slide');
  const dots = document.querySelectorAll('.dot');

  const oldSlide = slides[testiCurrent];
  const newSlide = slides[n];

  if (typeof gsap !== 'undefined') {
    gsap.to(oldSlide, {
      opacity: 0,
      y: -15,
      duration: 0.4,
      onComplete: () => {
        oldSlide.classList.remove('active');
        newSlide.classList.add('active');
        gsap.fromTo(newSlide,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
      }
    });
  } else {
    oldSlide?.classList.remove('active');
    newSlide?.classList.add('active');
  }

  dots[testiCurrent]?.classList.remove('active');
  dots[n]?.classList.add('active');

  testiCurrent = n;
  resetProgressBar();
}

function resetProgressBar() {
  const progressBar = document.getElementById('testi-progress');
  if (progressBar && typeof gsap !== 'undefined') {
    gsap.killTweensOf(progressBar);
    gsap.fromTo(progressBar, { width: '0%' }, { width: '100%', duration: 6, ease: 'none' });
  }
}

function startTestiSlider() {
  clearInterval(testiTimer);
  resetProgressBar();
  testiTimer = setInterval(() => {
    goSlide((testiCurrent + 1) % testiList.length);
  }, 6000);
}

// ── LOAD SETTINGS (HERO, ABOUT, SOCIALS, CONTACT) ──
async function loadSettings() {
  try {
    const res = await fetch('/api/settings');
    const json = await res.json();
    if (!json.success || !json.data) return;
    const s = json.data;

    // Site Title
    if (s.site_title && !document.title.includes('–')) {
      document.title = s.site_title;
    }

    // Hero Eyebrow
    if (s.hero_eyebrow) {
      const eyebrow = document.querySelector('.hero-eyebrow-text');
      if (eyebrow) eyebrow.textContent = s.hero_eyebrow;
    }

    // Hero Title Words (INDIAN CRICKET TEAM)
    if (s.hero_word1 || s.hero_word2 || s.hero_word3) {
      const wordEls = document.querySelectorAll('.hero-title .title-word');
      const words = [s.hero_word1, s.hero_word2, s.hero_word3];
      words.forEach((w, idx) => {
        if (w && wordEls[idx]) {
          wordEls[idx].setAttribute('data-word', w);
          wordEls[idx].innerHTML = w.split('').map(char => `<span>${char}</span>`).join('');
        }
      });
    }

    // Hero Tagline
    if (s.hero_tagline) {
      const el = document.getElementById('hero-tagline');
      if (el) el.textContent = s.hero_tagline;
    }

    // Hero Background Image (apply to both full background and 3D shatter tiles)
    if (s.hero_bg_image) {
      window.__heroBgImage = s.hero_bg_image;
      const heroBg = document.getElementById('hero-bg');
      if (heroBg) {
        heroBg.style.backgroundImage = `url("${s.hero_bg_image}")`;
      }
      document.querySelectorAll('.shatter-tile-inner').forEach(inner => {
        inner.style.backgroundImage = `url("${s.hero_bg_image}")`;
      });
    }

    // Hero Buttons
    const heroBtns = document.querySelectorAll('.hero-btns a');
    if (heroBtns.length >= 2) {
      if (s.hero_btn1_text) {
        const span = heroBtns[0].querySelector('span');
        if (span) span.textContent = s.hero_btn1_text;
      }
      if (s.hero_btn1_url) heroBtns[0].href = s.hero_btn1_url;

      if (s.hero_btn2_text) {
        const span = heroBtns[1].querySelector('span');
        if (span) span.textContent = s.hero_btn2_text;
      }
      if (s.hero_btn2_url) heroBtns[1].href = s.hero_btn2_url;
    }

    // Hero Quick Stats Badges
    const statItems = document.querySelectorAll('.hero-quick-stats .quick-stat-item');
    if (statItems.length >= 4) {
      const statMap = [
        { val: s.hero_stat1_num, lbl: s.hero_stat1_label, yrs: s.hero_stat1_years },
        { val: s.hero_stat2_num, lbl: s.hero_stat2_label, yrs: s.hero_stat2_years },
        { val: s.hero_stat3_num, lbl: s.hero_stat3_label, yrs: s.hero_stat3_years },
        { val: s.hero_stat4_num, lbl: s.hero_stat4_label, yrs: s.hero_stat4_years }
      ];

      statItems.forEach((item, idx) => {
        const d = statMap[idx];
        if (!d) return;
        const valEl = item.querySelector('.qs-val');
        const lblEl = item.querySelector('.qs-label');
        const yrsEl = item.querySelector('.qs-years');
        if (valEl && d.val) valEl.textContent = d.val;
        if (lblEl && d.lbl) lblEl.textContent = d.lbl;
        if (yrsEl && d.yrs) yrsEl.textContent = d.yrs;
      });
    }

    // About Narrative Text
    if (s.about_intro) {
      const el = document.getElementById('about-intro');
      if (el) el.textContent = s.about_intro;
    }
    if (s.about_story_p1) {
      const el = document.getElementById('about-story-p1');
      if (el) el.textContent = s.about_story_p1;
    }
    if (s.about_story_p2) {
      const el = document.getElementById('about-story-p2');
      if (el) el.textContent = s.about_story_p2;
    }

    // Contact & Headquarters Info
    if (s.contact_hq) {
      const el = document.getElementById('contact-hq-address');
      if (el) el.textContent = s.contact_hq;
    }
    if (s.contact_phone) {
      const el = document.getElementById('contact-phone');
      if (el) el.textContent = s.contact_phone;
    }
    if (s.contact_email) {
      const el = document.getElementById('contact-email-display');
      if (el) el.textContent = s.contact_email;
      const fe = document.getElementById('footer-email');
      if (fe) { fe.textContent = s.contact_email; fe.href = 'mailto:' + s.contact_email; }
    }

    // Social Links
    if (s.youtube_url) {
      const el = document.getElementById('yt-link');
      if (el) el.href = s.youtube_url;
      const fe = document.getElementById('yt-footer');
      if (fe) fe.href = s.youtube_url;
    }
    if (s.instagram_url) {
      const fe = document.getElementById('ig-footer');
      if (fe) fe.href = s.instagram_url;
    }
    if (s.twitter_url) {
      const fe = document.getElementById('tw-footer');
      if (fe) fe.href = s.twitter_url;
    }
    if (s.facebook_url) {
      const fe = document.getElementById('fb-footer');
      if (fe) fe.href = s.facebook_url;
    }
  } catch (e) {
    console.warn('Settings load fallback:', e);
  }
}

// ── LOAD ACHIEVEMENTS / HALL OF GLORY ──
async function loadAchievements() {
  const container = document.getElementById('achievements-container');
  if (!container) return;

  const list = await fetchData('achievements');
  if (!list || !list.length) return; // Keep existing static markup if database has no records yet

  container.innerHTML = list.map(a => `
    <div class="achievement-card ${a.highlight ? 'highlight-card' : ''}">
      <div class="achieve-glow"></div>
      <div class="achieve-badge">${a.badge_text || a.years}</div>
      <div class="achieve-icon">${a.icon || '🏆'}</div>
      <h3 class="achieve-title">${a.title}</h3>
      <p class="achieve-desc">${a.description}</p>
      <div class="achieve-foot">${a.footer_text || (a.years + ' Champions')}</div>
    </div>
  `).join('');

  if (typeof initCardsTilt === 'function') initCardsTilt();
}

// ── LOAD SQUAD PLAYERS (VAULT) ──
async function loadSquadPlayers() {
  const container = document.getElementById('squad-container');
  if (!container) return;

  let players = await fetchData('players');
  if (!players || !players.length) {
    players = [
      {
        name: 'Rohit Sharma',
        jersey_number: '45',
        role: 'Top-Order Batter / Captain',
        image_url: '/images/rohit.jpg',
        matches: 485,
        runs: 19245,
        wickets: 43,
        is_captain: true
      },
      {
        name: 'Virat Kohli',
        jersey_number: '18',
        role: 'Top-Order Batter',
        image_url: '/images/kohli.jpg',
        matches: 535,
        runs: 26947,
        wickets: 8,
        is_captain: false
      },
      {
        name: 'Jasprit Bumrah',
        jersey_number: '93',
        role: 'Fast Bowler / Vice-Captain',
        image_url: '/images/bumrah.jpg',
        matches: 198,
        runs: 540,
        wickets: 397,
        is_vice_captain: true
      },
      {
        name: 'Hardik Pandya',
        jersey_number: '33',
        role: 'All-Rounder',
        image_url: '/images/hardik.jpg',
        matches: 195,
        runs: 3650,
        wickets: 178
      }
    ];
  }

  container.innerHTML = players.map(p => `
    <div class="squad-card">
      <div class="squad-card-img-wrap">
        <img class="squad-card-img" src="${p.image_url || '/images/hero.jpg'}" alt="${p.name}" loading="lazy" onerror="this.src='/images/hero.jpg'"/>
        <div class="squad-card-overlay"></div>
        ${p.jersey_number ? `<span class="squad-jersey-badge">#${p.jersey_number}</span>` : ''}
        ${p.is_captain ? `<span class="squad-captain-badge">CAPTAIN</span>` : (p.is_vice_captain ? `<span class="squad-captain-badge" style="background:#1e6091;color:#fff;">VICE-CAPTAIN</span>` : '')}
      </div>
      <div class="squad-card-body">
        <h3 class="squad-player-name">${p.name}</h3>
        <p class="squad-player-role">${p.role}</p>
        <div class="squad-metrics-row">
          <div>
            <div class="squad-metric-val">${p.matches || 0}</div>
            <div class="squad-metric-lbl">Matches</div>
          </div>
          <div>
            <div class="squad-metric-val">${p.runs || 0}</div>
            <div class="squad-metric-lbl">Runs</div>
          </div>
          <div>
            <div class="squad-metric-val">${p.wickets || 0}</div>
            <div class="squad-metric-lbl">Wickets</div>
          </div>
        </div>
        <button class="squad-card-btn" onclick="quickSearch('${p.name.replace(/'/g, "\\'")}')">
          View Detailed Career Stats →
        </button>
      </div>
    </div>
  `).join('');
}

// ── PLAYER SEARCH WITH GSAP REVEAL ──
window.quickSearch = function(name) {
  const input = document.getElementById('player-input');
  if (input) {
    input.value = name;
    searchPlayer();
  }
};

window.searchPlayer = async function() {
  const q = document.getElementById('player-input')?.value.trim();
  const result = document.getElementById('player-result');
  if (!q || !result) return;

  result.innerHTML = '<div class="loading"><div class="spinner"></div>Searching Official Player Vault...</div>';

  try {
    const searchRes = await fetch(`/api/player/search?name=${encodeURIComponent(q)}`);
    const searchData = await searchRes.json();
    const players = searchData.data?.response?.items || [];

    if (!players.length) {
      renderFallbackPlayer(q, result);
      return;
    }

    const player = players.find(p => p.title.toLowerCase().includes(q.toLowerCase())) || players[0];

    const statsRes = await fetch(`/api/player/stats/${player.pid}`);
    const statsData = await statsRes.json();

    const r = statsData.data?.response || {};
    const bat = r.batting || {};
    const bowl = r.bowling || {};
    const p = r.player || player;

    renderPlayerCard(p, bat, bowl, r.iccplayerranking || [], result);
  } catch(e) {
    renderFallbackPlayer(q, result);
  }
};

function renderFallbackPlayer(q, result) {
  const lower = q.toLowerCase();
  let p = {
    title: 'Virat Kohli',
    role: 'Top-order Batter · Right-hand Bat',
    birthplace: 'Delhi, India',
    birthdate: '05 Nov 1988',
    playing_role: 'BATTER',
    rating: '942 (Peak)',
    image: '/images/IMG_20230513_235232_289.png',
    bat: { test_runs: '9,040', odi_runs: '13,906', t20_runs: '4,188', test_avg: '48.9', test_hs: '254*', odi_hs: '183', centuries: '80', fifties: '141' },
    bowl: { test_wkts: '0', odi_wkts: '5', t20_wkts: '4', test_avg: '–', econ: '5.2', best: '1/15' },
    rankings: [
      { rank: '3', format: 'ODI', type: 'Batting' },
      { rank: '12', format: 'Test', type: 'Batting' }
    ]
  };

  if (lower.includes('rohit')) {
    p = {
      title: 'Rohit Sharma',
      role: 'Opening Batter · Right-hand Bat / Captain',
      birthplace: 'Nagpur, Maharashtra',
      birthdate: '30 Apr 1987',
      playing_role: 'CAPTAIN / OPENER',
      rating: '890 (Peak)',
      image: '/images/uploads/Design1.png',
      bat: { test_runs: '4,289', odi_runs: '10,866', t20_runs: '4,231', test_avg: '44.2', test_hs: '212', odi_hs: '264', centuries: '48', fifties: '106' },
      bowl: { test_wkts: '2', odi_wkts: '9', t20_wkts: '1', test_avg: '–', econ: '5.1', best: '2/27' },
      rankings: [
        { rank: '2', format: 'ODI', type: 'Batting' },
        { rank: '8', format: 'Test', type: 'Batting' }
      ]
    };
  } else if (lower.includes('bumrah')) {
    p = {
      title: 'Jasprit Bumrah',
      role: 'Right-arm Fast · Yorker Specialist',
      birthplace: 'Ahmedabad, Gujarat',
      birthdate: '06 Dec 1993',
      playing_role: 'FAST BOWLER',
      rating: '915',
      image: '/images/IMG_20220809_222930_0567.jpg',
      bat: { test_runs: '259', odi_runs: '45', t20_runs: '12', test_avg: '7.8', test_hs: '34*', odi_hs: '16', centuries: '0', fifties: '0' },
      bowl: { test_wkts: '173', odi_wkts: '149', t20_wkts: '89', test_avg: '20.6', econ: '2.7', best: '6/27' },
      rankings: [
        { rank: '1', format: 'Test', type: 'Bowling' },
        { rank: '2', format: 'T20I', type: 'Bowling' }
      ]
    };
  } else if (lower.includes('dhoni')) {
    p = {
      title: 'MS Dhoni',
      role: 'Wicketkeeper Batter · Finisher Legend',
      birthplace: 'Ranchi, Jharkhand',
      birthdate: '07 Jul 1981',
      playing_role: 'WICKETKEEPER / CAPTAIN',
      rating: 'Legend',
      image: '/images/2011.jpeg',
      bat: { test_runs: '4,876', odi_runs: '10,773', t20_runs: '1,617', test_avg: '38.1', test_hs: '224', odi_hs: '183*', centuries: '16', fifties: '108' },
      bowl: { test_wkts: '0', odi_wkts: '1', t20_wkts: '0', test_avg: '31.0', econ: '5.1', best: '1/14' },
      rankings: [
        { rank: 'Legend', format: 'ICC Hall of Fame', type: 'Inductee' }
      ]
    };
  }

  result.innerHTML = `
    <div class="player-card" id="active-player-card">
      <div class="player-header">
        <img src="${p.image}" class="player-avatar" alt="${p.title}"/>
        <div>
          <h3 class="player-name">${p.title}</h3>
          <div class="player-role">${p.role}</div>
          <div class="player-meta">📍 ${p.birthplace} · 🎂 ${p.birthdate}</div>
          <div class="player-meta" style="color:var(--gold-light);margin-top:4px">🏏 ${p.playing_role} · ⭐ Rating: ${p.rating}</div>
        </div>
      </div>

      <div class="stats-heading">INTERNATIONAL BATTING METRICS</div>
      <div class="player-stats-grid">
        <div class="p-stat"><div class="p-stat-num">${p.bat.test_runs}</div><div class="p-stat-label">Test Runs</div></div>
        <div class="p-stat"><div class="p-stat-num">${p.bat.odi_runs}</div><div class="p-stat-label">ODI Runs</div></div>
        <div class="p-stat"><div class="p-stat-num">${p.bat.t20_runs}</div><div class="p-stat-label">T20 Runs</div></div>
        <div class="p-stat"><div class="p-stat-num">${p.bat.test_avg}</div><div class="p-stat-label">Test Avg</div></div>
        <div class="p-stat"><div class="p-stat-num">${p.bat.test_hs}</div><div class="p-stat-label">Test HS</div></div>
        <div class="p-stat"><div class="p-stat-num">${p.bat.odi_hs}</div><div class="p-stat-label">ODI HS</div></div>
        <div class="p-stat"><div class="p-stat-num">${p.bat.centuries}</div><div class="p-stat-label">Centuries (100s)</div></div>
        <div class="p-stat"><div class="p-stat-num">${p.bat.fifties}</div><div class="p-stat-label">Fifties (50s)</div></div>
      </div>

      <div class="stats-heading">INTERNATIONAL BOWLING &amp; FIELDING</div>
      <div class="player-stats-grid">
        <div class="p-stat"><div class="p-stat-num">${p.bowl.test_wkts}</div><div class="p-stat-label">Test Wkts</div></div>
        <div class="p-stat"><div class="p-stat-num">${p.bowl.odi_wkts}</div><div class="p-stat-label">ODI Wkts</div></div>
        <div class="p-stat"><div class="p-stat-num">${p.bowl.t20_wkts}</div><div class="p-stat-label">T20 Wkts</div></div>
        <div class="p-stat"><div class="p-stat-num">${p.bowl.best}</div><div class="p-stat-label">Best Spell</div></div>
      </div>

      <div class="stats-heading">ICC RANKINGS &amp; ACCOLADES</div>
      <div class="player-stats-grid" style="grid-template-columns:repeat(2,1fr)">
        ${p.rankings.map(r => `
          <div class="p-stat">
            <div class="p-stat-num" style="color:var(--gold-light)">#${r.rank}</div>
            <div class="p-stat-label">${r.format} · ${r.type}</div>
          </div>
        `).join('')}
      </div>
    </div>`;

  animatePlayerCard();
}

function renderPlayerCard(p, bat, bowl, rankings, result) {
  result.innerHTML = `
    <div class="player-card" id="active-player-card">
      <div class="player-header">
        ${p.profile_image ? `<img src="${p.profile_image}" class="player-avatar" alt="${p.title || ''}"/>` : ''}
        <div>
          <h3 class="player-name">${p.title}</h3>
          <div class="player-role">${p.bowling_style || p.batting_style || 'National Player'}</div>
          <div class="player-meta">📍 ${p.birthplace || 'India'} · 🎂 ${p.birthdate || '–'}</div>
          <div class="player-meta" style="color:var(--gold-light);margin-top:4px">🏏 ${p.playing_role?.toUpperCase() || 'PLAYER'} · ⭐ Rating: ${p.fantasy_player_rating || '–'}</div>
        </div>
      </div>

      <div class="stats-heading">BATTING RECORD</div>
      <div class="player-stats-grid">
        <div class="p-stat"><div class="p-stat-num">${bat.test?.runs ?? '–'}</div><div class="p-stat-label">Test Runs</div></div>
        <div class="p-stat"><div class="p-stat-num">${bat.odi?.runs ?? '–'}</div><div class="p-stat-label">ODI Runs</div></div>
        <div class="p-stat"><div class="p-stat-num">${bat.t20i?.runs ?? '–'}</div><div class="p-stat-label">T20 Runs</div></div>
        <div class="p-stat"><div class="p-stat-num">${bat.test?.average ?? '–'}</div><div class="p-stat-label">Test Avg</div></div>
        <div class="p-stat"><div class="p-stat-num">${bat.test?.highest ?? '–'}</div><div class="p-stat-label">Test HS</div></div>
        <div class="p-stat"><div class="p-stat-num">${bat.odi?.highest ?? '–'}</div><div class="p-stat-label">ODI HS</div></div>
        <div class="p-stat"><div class="p-stat-num">${bat.test?.run100 ?? '–'}</div><div class="p-stat-label">100s</div></div>
        <div class="p-stat"><div class="p-stat-num">${bat.test?.run50 ?? '–'}</div><div class="p-stat-label">50s</div></div>
      </div>

      <div class="stats-heading">BOWLING RECORD</div>
      <div class="player-stats-grid">
        <div class="p-stat"><div class="p-stat-num">${bowl.test?.wickets ?? '–'}</div><div class="p-stat-label">Test Wkts</div></div>
        <div class="p-stat"><div class="p-stat-num">${bowl.odi?.wickets ?? '–'}</div><div class="p-stat-label">ODI Wkts</div></div>
        <div class="p-stat"><div class="p-stat-num">${bowl.t20i?.wickets ?? '–'}</div><div class="p-stat-label">T20 Wkts</div></div>
        <div class="p-stat"><div class="p-stat-num">${bowl.test?.bestinning ?? '–'}</div><div class="p-stat-label">Best Inn</div></div>
      </div>

      ${rankings.length ? `
      <div class="stats-heading">ICC RANKINGS</div>
      <div class="player-stats-grid" style="grid-template-columns:repeat(3,1fr)">
        ${rankings.map(r => `
          <div class="p-stat">
            <div class="p-stat-num">#${r.rank}</div>
            <div class="p-stat-label">${r.format} ${r.type}</div>
          </div>`).join('')}
      </div>` : ''}
    </div>`;

  animatePlayerCard();
}

function animatePlayerCard() {
  const card = document.getElementById('active-player-card');
  if (card && typeof gsap !== 'undefined') {
    gsap.fromTo(card,
      { opacity: 0, y: 30, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' }
    );
    gsap.from(card.querySelectorAll('.p-stat'), {
      opacity: 0,
      y: 15,
      stagger: 0.04,
      duration: 0.5,
      ease: 'power2.out',
      delay: 0.15
    });
  }
}

document.getElementById('player-input')?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchPlayer();
});

// ── GALLERY LIGHTBOX MODAL ──
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');

function setupLightbox() {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.dataset.caption || img.alt || 'Team India Glory';
      if (img && lightboxModal && lightboxImg) {
        if (lenis) lenis.stop();
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightboxModal.classList.add('open');

        if (typeof gsap !== 'undefined') {
          gsap.fromTo('.lightbox-content',
            { scale: 0.85, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.5)' }
          );
        }
      }
    });
  });

  const closeLightbox = () => {
    if (lightboxModal) {
      if (lenis) lenis.start();
      if (typeof gsap !== 'undefined') {
        gsap.to('.lightbox-content', {
          scale: 0.85,
          opacity: 0,
          duration: 0.3,
          onComplete: () => lightboxModal.classList.remove('open')
        });
      } else {
        lightboxModal.classList.remove('open');
      }
    }
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxModal?.classList.contains('open')) {
      closeLightbox();
    }
  });
}

// ── BACK TO TOP (LENIS & GSAP) ──
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    backToTop?.classList.add('visible');
  } else {
    backToTop?.classList.remove('visible');
  }
});

backToTop?.addEventListener('click', () => {
  if (lenis) {
    lenis.scrollTo(0, {
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
  } else if (typeof gsap !== 'undefined' && gsap.plugins.scrollTo) {
    gsap.to(window, { duration: 1.2, scrollTo: 0, ease: 'power3.inOut' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// ── NEWSLETTER SUBSCRIPTION ──
window.subscribe = function() {
  const input = document.getElementById('nl-email');
  const feedback = document.getElementById('form-feedback');
  const email = input?.value.trim();

  if (!email || !email.includes('@')) {
    if (feedback) feedback.textContent = 'Please provide a valid email address.';
    return;
  }

  if (feedback) {
    feedback.innerHTML = '✨ <strong>Welcome to the 1.4 Billion Strong!</strong> Check your inbox for exclusive match alerts. 🏏';
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(feedback, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 });
    }
  }
  if (input) input.value = '';
};

// ── MASTER INITIALIZATION ──
document.addEventListener('DOMContentLoaded', async () => {
  // 1. Fetch settings first so hero background image and title text are applied before animation begins
  try {
    await loadSettings();
  } catch (err) {
    console.warn('Settings load warning:', err);
  }

  // 2. Initialize hero animation with the live background image
  initHeroAnimation();
  setupLightbox();

  // 3. Fetch & render remaining dynamic data
  await Promise.all([
    loadShows(),
    loadVideos(),
    loadNews(),
    loadTestimonials(),
    loadAchievements(),
    loadSquadPlayers()
  ]);

  // 2. Initialize all ScrollTriggers after DOM is completely populated
  initAllScrollAnimations();

  // 3. Refresh ScrollTrigger and Lenis once layout has settled
  setTimeout(() => {
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
    if (lenis) {
      lenis.resize();
    }
  }, 250);
});

// Double check layout after all remote images finish loading
window.addEventListener('load', () => {
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
  if (lenis) {
    lenis.resize();
  }
});
