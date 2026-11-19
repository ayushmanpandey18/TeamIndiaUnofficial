require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// ── Ensure uploads directory exists ──
const uploadsDir = path.join(__dirname, '../public/images/uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// ── Sessions ──
app.use(session({
  secret: process.env.SESSION_SECRET || 'team_india_dev_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

const pool = require('./db/db');

// ── Cloud Database Auto-Initializer ──
let cloudSchemaChecked = false;
app.use(async (req, res, next) => {
  if (!cloudSchemaChecked && (process.env.DATABASE_URL || process.env.POSTGRES_URL)) {
    try {
      const check = await pool.query("SELECT to_regclass('public.admins') AS exists;");
      if (!check.rows[0]?.exists) {
        const schemaSql = fs.readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf8');
        await pool.query(schemaSql);
        console.log('✅ Cloud DB Schema Initialized on Vercel');
      }
      cloudSchemaChecked = true;
    } catch (e) {
      console.warn('Cloud DB init check:', e.message);
    }
  }
  next();
});

// ── Routes ──
app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));

// ── Main frontend ──
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ── Dedicated Pages ──
const dedicatedPages = ['about', 'glory', 'fixtures', 'players', 'videos', 'voices', 'news', 'contact'];
dedicatedPages.forEach(p => {
  app.get(`/${p}`, (req, res) => {
    res.sendFile(path.join(__dirname, `../public/${p}.html`));
  });
});

// ── Redirect /admin to /admin/login ──
app.get('/admin', (req, res) => {
  res.redirect('/admin/login');
});

// ── Global Error Handler (e.g. Multer file size errors, etc.) ──
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  if (req.path.startsWith('/admin') || req.path.startsWith('/api')) {
    return res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Server error occurred during request'
    });
  }
  res.status(500).send('Internal Server Error');
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/index.html'));
});

// ── Start server (locally or in traditional hosting) ──
if (process.env.VERCEL !== '1' && !process.env.NOW_REGION) {
  app.listen(PORT, async () => {
    try {
      const schemaSql = fs.readFileSync(path.join(__dirname, 'db/schema.sql'), 'utf8');
      await pool.query(schemaSql);
      console.log('✅ Database schema and seed data initialized successfully');
    } catch (err) {
      console.error('⚠️ Schema init warning:', err.message);
    }

    console.log(`
    ╔════════════════════════════════════╗
    ║   🎩 Team India Website Running   ║
    ║   Frontend: http://localhost:${PORT}  ║
    ║   Admin:    http://localhost:${PORT}/admin ║
    ╚════════════════════════════════════╝
    `);
  });
}

// Export for serverless platforms (e.g. Vercel)
module.exports = app;
