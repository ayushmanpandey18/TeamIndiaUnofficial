const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Fallback seed data for cloud serverless environments
const defaultVideos = [
  {
    id: 1,
    title: 'ICC Men\'s T20 World Cup 2024 Final: India vs South Africa Triumph',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    display_order: 1
  },
  {
    id: 2,
    title: 'Cricket World Cup 2011 Final: MS Dhoni 91* & The Winning Six | Match Highlights',
    youtube_url: 'https://www.youtube.com/watch?v=XhBw0y6pY1A',
    thumbnail_url: 'https://img.youtube.com/vi/XhBw0y6pY1A/maxresdefault.jpg',
    display_order: 2
  },
  {
    id: 3,
    title: 'ICC Men\'s T20 World Cup 2007 Final: India vs Pakistan Historic Highlights',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    display_order: 3
  },
  {
    id: 4,
    title: 'Cricket World Cup 1983 Final: Kapil Dev\'s Historic Trophy Triumph at Lord\'s',
    youtube_url: 'https://www.youtube.com/watch?v=kYQ8Q1dE31I',
    thumbnail_url: 'https://img.youtube.com/vi/kYQ8Q1dE31I/maxresdefault.jpg',
    display_order: 4
  },
  {
    id: 5,
    title: 'India\'s Historic Triumph at Fortress Gabba | Border-Gavaskar Trophy Highlights',
    youtube_url: 'https://www.youtube.com/watch?v=XhBw0y6pY1A',
    thumbnail_url: 'https://img.youtube.com/vi/XhBw0y6pY1A/maxresdefault.jpg',
    display_order: 5
  },
  {
    id: 6,
    title: '2013 Champions Trophy Final: India vs England Edge of the Seat Thriller',
    youtube_url: 'https://www.youtube.com/watch?v=kYQ8Q1dE31I',
    thumbnail_url: 'https://img.youtube.com/vi/kYQ8Q1dE31I/maxresdefault.jpg',
    display_order: 6
  }
];

// ── FIXTURES (SHOWS) ──
router.get('/shows', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM shows WHERE is_active = TRUE ORDER BY show_date ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PLAYERS VAULT ──
router.get('/players', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM players WHERE is_active = TRUE ORDER BY display_order ASC, id ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/players/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM players WHERE id = $1', [req.params.id]);
    if (!result.rows.length) return res.status(404).json({ success: false, message: 'Player not found' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ACHIEVEMENTS / HALL OF GLORY ──
router.get('/achievements', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM achievements WHERE is_active = TRUE ORDER BY display_order ASC, id ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── HIGHLIGHTS (VIDEOS) ──
router.get('/videos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM videos WHERE is_active = TRUE ORDER BY display_order ASC');
    if (result.rows && result.rows.length) {
      return res.json({ success: true, data: result.rows });
    }
  } catch (err) {}
  res.json({ success: true, data: defaultVideos });
});

// ── OFFICIAL DISPATCHES (NEWS) ──
router.get('/news', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM news WHERE is_active = TRUE ORDER BY published_date DESC, created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── VOICES OF CRICKET (TESTIMONIALS) ──
router.get('/testimonials', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM testimonials WHERE is_active = TRUE ORDER BY display_order ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GALLERY ──
router.get('/gallery', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM gallery WHERE is_active = TRUE ORDER BY display_order ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── SETTINGS & HERO ──
router.get('/settings', async (req, res) => {
  try {
    const result = await db.query('SELECT key, value FROM settings');
    const settings = {};
    result.rows.forEach(row => { settings[row.key] = row.value; });
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── LIVE RAPID API PLAYER SEARCH ──
router.get('/player/search', async (req, res) => {
  try {
    const response = await fetch(`https://cricket-live-line-advance.p.rapidapi.com/players?search=${req.query.name}`, {
      headers: {
        'x-rapidapi-key': '4500205a76msh90b8c0ac5f1258bp1069dfjsnf4694d28d0f9',
        'x-rapidapi-host': 'cricket-live-line-advance.p.rapidapi.com'
      }
    });
    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/player/stats/:id', async (req, res) => {
  try {
    const response = await fetch(`https://cricket-live-line-advance.p.rapidapi.com/players/${req.params.id}/stats`, {
      headers: {
        'x-rapidapi-key': '4500205a76msh90b8c0ac5f1258bp1069dfjsnf4694d28d0f9',
        'x-rapidapi-host': 'cricket-live-line-advance.p.rapidapi.com'
      }
    });
    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
