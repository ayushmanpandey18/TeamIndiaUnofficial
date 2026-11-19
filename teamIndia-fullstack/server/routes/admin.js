const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db/db');
const { isAuthenticated } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../public/images/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'ict-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

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

// ── UNIVERSAL IMAGE UPLOAD ENDPOINT ──
router.post('/upload', isAuthenticated, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const publicUrl = `/images/uploads/${req.file.filename}`;
  res.json({ success: true, url: publicUrl, filename: req.file.filename });
});

// ── HERO & SETTINGS MANAGER ──
router.get('/settings', isAuthenticated, async (req, res) => {
  try {
    const result = await db.query('SELECT key, value FROM settings');
    const settings = {};
    result.rows.forEach(row => { settings[row.key] = row.value; });
    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/settings', isAuthenticated, async (req, res) => {
  try {
    // Supports single { key, value } or bulk object { settings: { ... } }
    if (req.body.settings && typeof req.body.settings === 'object') {
      const keys = Object.keys(req.body.settings);
      for (const k of keys) {
        await db.query(
          'INSERT INTO settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()',
          [k, req.body.settings[k]]
        );
      }
      return res.json({ success: true, message: 'Settings updated' });
    }

    const { key, value } = req.body;
    await db.query(
      'INSERT INTO settings (key, value) VALUES ($1,$2) ON CONFLICT (key) DO UPDATE SET value=$2, updated_at=NOW()',
      [key, value]
    );
    res.json({ success: true, message: `${key} updated` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PLAYERS VAULT CRUD ──
router.get('/players', isAuthenticated, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM players ORDER BY display_order ASC, id ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/players', isAuthenticated, async (req, res) => {
  const {
    name, jersey_number, role, batting_style, bowling_style,
    image_url, matches, runs, wickets, batting_avg, bowling_avg,
    category, is_captain, is_vice_captain, display_order
  } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO players 
      (name, jersey_number, role, batting_style, bowling_style, image_url, matches, runs, wickets, batting_avg, bowling_avg, category, is_captain, is_vice_captain, display_order) 
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [
        name, jersey_number, role, batting_style, bowling_style,
        image_url, parseInt(matches) || 0, parseInt(runs) || 0, parseInt(wickets) || 0,
        batting_avg, bowling_avg, category || 'Men',
        Boolean(is_captain), Boolean(is_vice_captain), parseInt(display_order) || 0
      ]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/players/:id', isAuthenticated, async (req, res) => {
  const {
    name, jersey_number, role, batting_style, bowling_style,
    image_url, matches, runs, wickets, batting_avg, bowling_avg,
    category, is_captain, is_vice_captain, display_order, is_active
  } = req.body;
  try {
    const result = await db.query(
      `UPDATE players SET 
      name=$1, jersey_number=$2, role=$3, batting_style=$4, bowling_style=$5, 
      image_url=$6, matches=$7, runs=$8, wickets=$9, batting_avg=$10, bowling_avg=$11, 
      category=$12, is_captain=$13, is_vice_captain=$14, display_order=$15, is_active=$16 
      WHERE id=$17 RETURNING *`,
      [
        name, jersey_number, role, batting_style, bowling_style,
        image_url, parseInt(matches) || 0, parseInt(runs) || 0, parseInt(wickets) || 0,
        batting_avg, bowling_avg, category || 'Men',
        Boolean(is_captain), Boolean(is_vice_captain), parseInt(display_order) || 0,
        is_active !== undefined ? Boolean(is_active) : true,
        req.params.id
      ]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/players/:id', isAuthenticated, async (req, res) => {
  try {
    await db.query('DELETE FROM players WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── ACHIEVEMENTS / HALL OF GLORY CRUD ──
router.get('/achievements', isAuthenticated, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM achievements ORDER BY display_order ASC, id ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/achievements', isAuthenticated, async (req, res) => {
  const { title, years, icon, badge_text, description, footer_text, highlight, display_order, image_url } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO achievements (title, years, icon, badge_text, description, footer_text, highlight, display_order, image_url)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [title, years, icon || '🏆', badge_text, description, footer_text, Boolean(highlight), parseInt(display_order) || 0, image_url || null]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/achievements/:id', isAuthenticated, async (req, res) => {
  const { title, years, icon, badge_text, description, footer_text, highlight, display_order, is_active, image_url } = req.body;
  try {
    const result = await db.query(
      `UPDATE achievements SET 
      title=$1, years=$2, icon=$3, badge_text=$4, description=$5, footer_text=$6, 
      highlight=$7, display_order=$8, is_active=$9, image_url=$10
      WHERE id=$11 RETURNING *`,
      [title, years, icon || '🏆', badge_text, description, footer_text, Boolean(highlight), parseInt(display_order) || 0, is_active !== undefined ? Boolean(is_active) : true, image_url || null, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/achievements/:id', isAuthenticated, async (req, res) => {
  try {
    await db.query('DELETE FROM achievements WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── FIXTURES / SHOWS CRUD ──
router.get('/shows', isAuthenticated, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM shows ORDER BY show_date DESC, id DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/shows', isAuthenticated, async (req, res) => {
  const { title, venue, city, show_date, show_time, ticket_url, badge, image_url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO shows (title, venue, city, show_date, show_time, ticket_url, badge, image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
      [title, venue, city, show_date, show_time, ticket_url, badge || 'BCCI International', image_url || null]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/shows/:id', isAuthenticated, async (req, res) => {
  const { title, venue, city, show_date, show_time, ticket_url, badge, is_active, image_url } = req.body;
  try {
    const result = await db.query(
      'UPDATE shows SET title=$1, venue=$2, city=$3, show_date=$4, show_time=$5, ticket_url=$6, badge=$7, is_active=$8, image_url=$9 WHERE id=$10 RETURNING *',
      [title, venue, city, show_date, show_time, ticket_url, badge || 'BCCI International', is_active, image_url || null, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/shows/:id', isAuthenticated, async (req, res) => {
  try {
    await db.query('DELETE FROM shows WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── VIDEOS CRUD ──
router.get('/videos', isAuthenticated, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM videos ORDER BY display_order ASC, id ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/videos', isAuthenticated, async (req, res) => {
  const { title, youtube_url, thumbnail_url, display_order } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO videos (title, youtube_url, thumbnail_url, display_order) VALUES ($1,$2,$3,$4) RETURNING *',
      [title, youtube_url, thumbnail_url, parseInt(display_order) || 0]
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
      [title, youtube_url, thumbnail_url, parseInt(display_order) || 0, is_active, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/videos/:id', isAuthenticated, async (req, res) => {
  try {
    await db.query('DELETE FROM videos WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── NEWS CRUD ──
router.get('/news', isAuthenticated, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM news ORDER BY published_date DESC, created_at DESC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/news', isAuthenticated, async (req, res) => {
  const { source_name, headline, article_url, image_url, published_date } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO news (source_name, headline, article_url, image_url, published_date) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [source_name, headline, article_url, image_url, published_date || null]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/news/:id', isAuthenticated, async (req, res) => {
  const { source_name, headline, article_url, image_url, published_date, is_active } = req.body;
  try {
    const result = await db.query(
      'UPDATE news SET source_name=$1, headline=$2, article_url=$3, image_url=$4, published_date=$5, is_active=$6 WHERE id=$7 RETURNING *',
      [source_name, headline, article_url, image_url, published_date, is_active, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/news/:id', isAuthenticated, async (req, res) => {
  try {
    await db.query('DELETE FROM news WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── TESTIMONIALS CRUD ──
router.get('/testimonials', isAuthenticated, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM testimonials ORDER BY display_order ASC, id ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/testimonials', isAuthenticated, async (req, res) => {
  const { quote, author_name, author_role, display_order, image_url } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO testimonials (quote, author_name, author_role, display_order, image_url) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [quote, author_name, author_role, parseInt(display_order) || 0, image_url || null]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/testimonials/:id', isAuthenticated, async (req, res) => {
  const { quote, author_name, author_role, display_order, is_active, image_url } = req.body;
  try {
    const result = await db.query(
      'UPDATE testimonials SET quote=$1, author_name=$2, author_role=$3, display_order=$4, is_active=$5, image_url=$6 WHERE id=$7 RETURNING *',
      [quote, author_name, author_role, parseInt(display_order) || 0, is_active, image_url || null, req.params.id]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/testimonials/:id', isAuthenticated, async (req, res) => {
  try {
    await db.query('DELETE FROM testimonials WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GALLERY ──
router.get('/gallery', isAuthenticated, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM gallery ORDER BY display_order ASC, id ASC');
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/gallery', isAuthenticated, upload.single('image'), async (req, res) => {
  const { alt_text, display_order } = req.body;
  const image_url = req.file ? `/images/uploads/${req.file.filename}` : req.body.image_url;
  try {
    const result = await db.query(
      'INSERT INTO gallery (image_url, alt_text, display_order) VALUES ($1,$2,$3) RETURNING *',
      [image_url, alt_text, parseInt(display_order) || 0]
    );
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/gallery/:id', isAuthenticated, async (req, res) => {
  try {
    await db.query('DELETE FROM gallery WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
