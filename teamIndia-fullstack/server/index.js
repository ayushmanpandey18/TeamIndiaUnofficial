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
  secret: process.env.SESSION_SECRET || 'suhani_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// ── Routes ──
app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));

// ── Main frontend ──
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ── Redirect /admin to /admin/login ──
app.get('/admin', (req, res) => {
  res.redirect('/admin/login');
});

// ── 404 handler ──
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '../public/index.html'));
});

// ── Start server ──
app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════╗
  ║   🎩 Team India Website Running   ║
  ║   Frontend: http://localhost:${PORT}  ║
  ║   Admin:    http://localhost:${PORT}/admin ║
  ╚════════════════════════════════════╝
  `);
});
