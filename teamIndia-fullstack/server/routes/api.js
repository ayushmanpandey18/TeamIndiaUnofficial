const express = require('express');
const router = express.Router();
const db = require('../db/db');

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
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
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
