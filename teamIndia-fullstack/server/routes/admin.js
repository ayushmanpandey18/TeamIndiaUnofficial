const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db/db');
const { isAuthenticated } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── AUTH ──

// GET Login page
router.get('/login', (req, res) => {
  if (req.session.adminId) return res.redirect('/admin/dashboard');
  res.sendFile(path.join(__dirname, '../../views/admin/login.html'));
});

// POST Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }
    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }
    req.session.adminId = admin.id;
    req.session.adminName = admin.name;
    res.json({ success: true, redirect: '/admin/dashboard' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
});

// ── DASHBOARD ──
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/admin/dashboard.html'));
});

// GET admin info for dashboard
router.get('/me', isAuthenticated, (req, res) => {
  res.json({ success: true, name: req.session.adminName });
});

// ── SHOWS CRUD ──

router.get('/shows', isAuthenticated, async (req, res) => {
  const result = await db.query('SELECT * FROM shows ORDER BY show_date DESC');
  res.json({ success: true, data: result.rows });
});

router.post('/shows', isAuthenticated, async (req, res) => {
  const { title, venue, city, show_date, show_time, ticket_url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO shows (title, venue, city, show_date, show_time, ticket_url) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [title, venue, city, show_date, show_time, ticket_url]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/shows/:id', isAuthenticated, async (req, res) => {
  const { title, venue, city, show_date, show_time, ticket_url, is_active } = req.body;
  try {
    const result = await db.query(
      'UPDATE shows SET title=$1, venue=$2, city=$3, show_date=$4, show_time=$5, ticket_url=$6, is_active=$7 WHERE id=$8 RETURNING *',
      [title, venue, city, show_date, show_time, ticket_url, is_active, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/shows/:id', isAuthenticated, async (req, res) => {
  await db.query('DELETE FROM shows WHERE id=$1', [req.params.id]);
  res.json({ success: true });
});

// ── VIDEOS CRUD ──

router.get('/videos', isAuthenticated, async (req, res) => {
  const result = await db.query('SELECT * FROM videos ORDER BY display_order ASC');
  res.json({ success: true, data: result.rows });
});

router.post('/videos', isAuthenticated, async (req, res) => {
  const { title, youtube_url, thumbnail_url, display_order } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO videos (title, youtube_url, thumbnail_url, display_order) VALUES ($1,$2,$3,$4) RETURNING *',
      [title, youtube_url, thumbnail_url, display_order || 0]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/videos/:id', isAuthenticated, async (req, res) => {
  const { title, youtube_url, thumbnail_url, display_order, is_active } = req.body;
  try {
    const result = await db.query(
      'UPDATE videos SET title=$1, youtube_url=$2, thumbnail_url=$3, display_order=$4, is_active=$5 WHERE id=$6 RETURNING *',
      [title, youtube_url, thumbnail_url, display_order, is_active, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/videos/:id', isAuthenticated, async (req, res) => {
  await db.query('DELETE FROM videos WHERE id=$1', [req.params.id]);
  res.json({ success: true });
});

// ── NEWS CRUD ──

router.get('/news', isAuthenticated, async (req, res) => {
  const result = await db.query('SELECT * FROM news ORDER BY created_at DESC');
  res.json({ success: true, data: result.rows });
});

router.post('/news', isAuthenticated, async (req, res) => {
  const { source_name, headline, article_url, published_date } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO news (source_name, headline, article_url, published_date) VALUES ($1,$2,$3,$4) RETURNING *',
      [source_name, headline, article_url, published_date || null]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/news/:id', isAuthenticated, async (req, res) => {
  await db.query('DELETE FROM news WHERE id=$1', [req.params.id]);
  res.json({ success: true });
});

// ── TESTIMONIALS CRUD ──

router.get('/testimonials', isAuthenticated, async (req, res) => {
  const result = await db.query('SELECT * FROM testimonials ORDER BY display_order ASC');
  res.json({ success: true, data: result.rows });
});

router.post('/testimonials', isAuthenticated, async (req, res) => {
  const { quote, author_name, author_role, display_order } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO testimonials (quote, author_name, author_role, display_order) VALUES ($1,$2,$3,$4) RETURNING *',
      [quote, author_name, author_role, display_order || 0]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/testimonials/:id', isAuthenticated, async (req, res) => {
  await db.query('DELETE FROM testimonials WHERE id=$1', [req.params.id]);
  res.json({ success: true });
});

// ── SETTINGS ──

router.get('/settings', isAuthenticated, async (req, res) => {
  const result = await db.query('SELECT key, value FROM settings');
  const settings = {};
  result.rows.forEach(row => { settings[row.key] = row.value; });
  res.json({ success: true, data: settings });
});

router.put('/settings', isAuthenticated, async (req, res) => {
  const { key, value } = req.body;
  try {
    await db.query(
      'INSERT INTO settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()',
      [key, value]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GALLERY ──

router.get('/gallery', isAuthenticated, async (req, res) => {
  const result = await db.query('SELECT * FROM gallery ORDER BY display_order ASC');
  res.json({ success: true, data: result.rows });
});

router.post('/gallery', isAuthenticated, upload.single('image'), async (req, res) => {
  const { alt_text, display_order } = req.body;
  const image_url = req.file ? `/images/uploads/${req.file.filename}` : req.body.image_url;
  try {
    const result = await db.query(
      'INSERT INTO gallery (image_url, alt_text, display_order) VALUES ($1,$2,$3) RETURNING *',
      [image_url, alt_text, display_order || 0]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/gallery/:id', isAuthenticated, async (req, res) => {
  await db.query('DELETE FROM gallery WHERE id=$1', [req.params.id]);
  res.json({ success: true });
});

module.exports = router;
