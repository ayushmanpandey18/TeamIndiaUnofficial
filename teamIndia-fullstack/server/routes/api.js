const express = require('express');
const router = express.Router();
const db = require('../db/db');

router.get('/shows', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM shows WHERE is_active = TRUE ORDER BY show_date ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/videos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM videos WHERE is_active = TRUE ORDER BY display_order ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/news', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM news WHERE is_active = TRUE ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/testimonials', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM testimonials WHERE is_active = TRUE ORDER BY display_order ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/gallery', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM gallery WHERE is_active = TRUE ORDER BY display_order ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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