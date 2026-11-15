-- =============================================
-- Team India Website - PostgreSQL Database Schema
-- Run this file once to setup your database
-- Command: psql -U postgres -d <DB_NAME> -f server/db/schema.sql
-- =============================================

-- Create Database (run separately if needed)
-- CREATE DATABASE team_india;

-- ── ADMIN USERS ──
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── SHOWS / EVENTS ──
CREATE TABLE IF NOT EXISTS shows (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  venue VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  show_date DATE NOT NULL,
  show_time VARCHAR(50),
  ticket_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── VIDEOS ──
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  youtube_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── NEWS ARTICLES ──
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  source_name VARCHAR(255) NOT NULL,
  headline TEXT NOT NULL,
  article_url VARCHAR(500),
  image_url VARCHAR(500),
  published_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── TESTIMONIALS ──
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  quote TEXT NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  author_role VARCHAR(255),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── GALLERY IMAGES ──
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  image_url VARCHAR(500) NOT NULL,
  alt_text VARCHAR(255),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ── SITE SETTINGS ──
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ── SEED DATA ──

-- Remove legacy entertainment-site seed data without affecting cricket content.
DELETE FROM shows WHERE title IN (
  'Spellbound – A Mentalism Special',
  'Mindwaves Tour',
  'Illusions Live'
);
DELETE FROM videos WHERE title IN (
  'Kareena Kapoor SPOOKED!',
  'Absolutely speechless!',
  'Mentalist goes off script!',
  'Hacking into phones?',
  'Shared psychic connection?',
  'Don''t hum the song!'
);
DELETE FROM news
WHERE headline ILIKE '%Suhani%'
   OR headline ILIKE '%mentalist%'
   OR headline ILIKE '%magician%';
DELETE FROM testimonials
WHERE quote ILIKE '%spooky%'
   OR quote ILIKE '%goosebumps%'
   OR quote ILIKE '%Suhani%'
   OR quote ILIKE '%touch your feet%'
   OR quote ILIKE '%you inspire me%';

-- Default admin (password: Admin@123)
INSERT INTO admins (email, password_hash, name)
VALUES ('admin@teamindia.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- Site Settings
INSERT INTO settings (key, value) VALUES
('site_title', 'Team India – Indian Cricket'),
('hero_tagline', 'One Nation. One Team. One Dream.'),
('about_text', 'Celebrating the history, players, and unforgettable moments of Indian cricket.'),
('contact_email', ''),
('youtube_url', 'https://www.youtube.com/@BCCI'),
('instagram_url', 'https://www.instagram.com/indiancricketteam/')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
WHERE settings.value ILIKE '%Suhani%'
  OR settings.value ILIKE '%mentalist%'
  OR settings.value ILIKE '%magician%';
