-- =============================================
-- Suhani Shah Website - PostgreSQL Database Schema
-- Run this file once to setup your database
-- Command: psql -U postgres -d suhani_website -f server/db/schema.sql
-- =============================================

-- Create Database (run separately if needed)
-- CREATE DATABASE suhani_website;

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

-- Default admin (password: Admin@123)
INSERT INTO admins (email, password_hash, name)
VALUES ('admin@teamindia.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin')
ON CONFLICT (email) DO NOTHING;

-- Sample Shows
INSERT INTO shows (title, venue, city, show_date, show_time, ticket_url) VALUES
('Spellbound – A Mentalism Special', 'The Habitat', 'Mumbai', '2026-04-22', '7:00 PM', 'https://in.bookmyshow.com'),
('Mindwaves Tour', 'Kamani Auditorium', 'Delhi', '2026-05-10', '6:30 PM', 'https://in.bookmyshow.com'),
('Illusions Live', 'Alliance Française', 'Bangalore', '2026-05-25', '7:30 PM', 'https://in.bookmyshow.com');

-- Sample Videos
INSERT INTO videos (title, youtube_url, display_order) VALUES
('Kareena Kapoor SPOOKED!', 'https://youtube.com/watch?v=example1', 1),
('Absolutely speechless!', 'https://youtube.com/watch?v=example2', 2),
('Mentalist goes off script!', 'https://youtube.com/watch?v=example3', 3),
('Hacking into phones?', 'https://youtube.com/watch?v=example4', 4),
('Shared psychic connection?', 'https://youtube.com/watch?v=example5', 5),
('Don''t hum the song!', 'https://youtube.com/watch?v=example6', 6);

-- Sample News
INSERT INTO news (source_name, headline, article_url) VALUES
('The Guardian', 'Edinburgh''s superstar magicians on secrets and surprises', 'https://theguardian.com'),
('DNA India', 'Meet Suhani Shah, the Jadu Pari stealing limelight', 'https://dnaindia.com'),
('News 18', 'Suhani Shah announces Silver Jubilee India Tour', 'https://news18.com'),
('Economic Times', 'What is a mentalist? Suhani Shah has the answers', 'https://economictimes.com'),
('World Magic Review', 'Suhani Shah: Spellbound review', 'https://worldmagicreview.com');

-- Sample Testimonials
INSERT INTO testimonials (quote, author_name, author_role, display_order) VALUES
('It was absolutely delightful and spooky!', 'Kareena Kapoor Khan', 'Bollywood Actress · 6× Filmfare Award Winner', 1),
('I''ve got goosebumps. I''ve no idea how you did that. You''re amazing.', 'Martin Garrix', 'Dutch DJ and Record Producer', 2),
('Suhani''s personality shines throughout her thought provoking and entertaining show!', 'Marvin Berglas', 'Award-Winning Magician · Founder, Marvin''s Magic', 3),
('I want to touch your feet and give salute to your art.', 'Anu Malik', 'National Award-Winning Musician', 4),
('You have something very different in you, you inspire me.', 'Saina Nehwal', 'Former World No.1 Badminton Player · Olympic Medalist', 5);

-- Site Settings
INSERT INTO settings (key, value) VALUES
('site_title', 'Suhani Shah – Mentalist & Magician'),
('hero_tagline', 'Mind Reading · Illusion · Wonder'),
('about_text', 'Suhani Shah is one of the biggest names in the magic industry with an experience of over 2 decades of performing over 5000 shows.'),
('contact_email', 'contact@suhanishah.com'),
('youtube_url', 'https://youtube.com/@SuhaniShah'),
('instagram_url', 'https://instagram.com/thesuhanishah')
ON CONFLICT (key) DO NOTHING;
