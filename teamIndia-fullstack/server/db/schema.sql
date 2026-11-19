-- =============================================
-- Team India Website - PostgreSQL Database Schema
-- Complete 100% Dynamic CMS Schema for BCCI Official Tribute
-- =============================================

-- ── ADMIN USERS ──
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
-- ── SHOWS / MATCH FIXTURES ──
CREATE TABLE IF NOT EXISTS shows (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  venue VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  show_date DATE NOT NULL,
  show_time VARCHAR(50),
  ticket_url VARCHAR(500),
  badge VARCHAR(100) DEFAULT 'BCCI International',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE shows ADD COLUMN IF NOT EXISTS badge VARCHAR(100) DEFAULT 'BCCI International';
ALTER TABLE shows ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE achievements ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);
-- ── VIDEOS / CINEMA HIGHLIGHTS ──
CREATE TABLE IF NOT EXISTS videos (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  youtube_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
-- ── NEWS ARTICLES & DISPATCHES ──
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
-- ── TESTIMONIALS / VOICES OF CRICKET ──
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
-- ── SQUAD PLAYERS (PLAYER VAULT) ──
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  jersey_number VARCHAR(20),
  role VARCHAR(100) NOT NULL,
  batting_style VARCHAR(100),
  bowling_style VARCHAR(100),
  image_url VARCHAR(500),
  matches INT DEFAULT 0,
  runs INT DEFAULT 0,
  wickets INT DEFAULT 0,
  batting_avg VARCHAR(50),
  bowling_avg VARCHAR(50),
  category VARCHAR(50) DEFAULT 'Men',
  is_captain BOOLEAN DEFAULT FALSE,
  is_vice_captain BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
-- ── ACHIEVEMENTS / HALL OF GLORY ──
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  years VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT '🏆',
  badge_text VARCHAR(100),
  description TEXT NOT NULL,
  footer_text VARCHAR(255),
  highlight BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
-- ── SITE SETTINGS & HERO MANAGER ──
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ── SEED DATA ──

-- Default admin (email: admin@teamindia.com, password: Admin@123)
INSERT INTO admins (email, password_hash, name)
VALUES ('admin@teamindia.com', '$2a$10$lIwYTIv9WfjgZYdUokAJde3zDd81TNadQlA0PNwMVvDc7Emw4a0pO', 'BCCI Admin')
ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name;

-- Site Settings (Hero, About, Contact, Socials)
INSERT INTO settings (key, value) VALUES
('site_title', 'Team India – The Official Indian Cricket Portal'),
('hero_eyebrow', 'BOARD OF CONTROL FOR CRICKET IN INDIA • OFFICIAL TRIBUTE'),
('hero_word1', 'INDIAN'),
('hero_word2', 'CRICKET'),
('hero_word3', 'TEAM'),
('hero_tagline', 'Born To Conquer, Built To Rule'),
('hero_btn1_text', 'Book Match Tickets'),
('hero_btn1_url', '/fixtures.html'),
('hero_btn2_text', 'Watch Highlights'),
('hero_btn2_url', '/videos.html'),
('hero_stat1_num', '2×'),
('hero_stat1_label', 'ODI World Cups'),
('hero_stat1_years', '1983 • 2011'),
('hero_stat2_num', '2×'),
('hero_stat2_label', 'T20 World Cups'),
('hero_stat2_years', '2007 • 2024'),
('hero_stat3_num', '3×'),
('hero_stat3_label', 'Champions Trophy'),
('hero_stat3_years', '2002 • 2013 • 2025'),
('hero_stat4_num', '#1'),
('hero_stat4_label', 'ICC World Ranking'),
('hero_stat4_years', 'All Formats Dominance'),
('about_intro', 'A legacy forged through relentless passion, historic grit, and the roar of a billion souls.'),
('about_story_p1', 'Cricket in India is not merely a sport; it is an emotion, a religion, and an unbreakable bond that unites over 1.4 billion people across the globe.'),
('about_story_p2', 'From the historic 1932 Test debut at Lord’s to Kapil Dev’s unforgettable 1983 miracle, MS Dhoni’s winning six in 2011, and Rohit Sharma’s invincible 2024 Barbados triumph.'),
('contact_hq', 'Cricket Centre, Wankhede Stadium, D-Road, Churchgate, Mumbai 400020, Maharashtra'),
('contact_email', 'office@bcci.tv'),
('contact_phone', '+91 22 2289 8800'),
('youtube_url', 'https://www.youtube.com/@BCCI'),
('instagram_url', 'https://www.instagram.com/indiancricketteam/'),
('twitter_url', 'https://twitter.com/BCCI'),
('facebook_url', 'https://www.facebook.com/IndianCricketTeam/')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Seed Achievements if empty
INSERT INTO achievements (title, years, icon, badge_text, description, footer_text, highlight, display_order)
SELECT * FROM (VALUES
  ('ODI World Cup', '1983 · 2011', '🏆', '1983 · 2011', 'Kapil Dev''s iconic 1983 miracle at Lord''s against Clive Lloyd''s West Indies, and MS Dhoni''s legendary winning six at Wankhede in 2011 that fulfilled a billion dreams.', '2× Champions · 1983, 2011', false, 1),
  ('T20 World Cup', '2007 · 2024', '🥇', '2007 · 2024', 'MS Dhoni''s fearless young squad conquering Johannesburg in 2007, and Rohit Sharma''s invincible 2024 campaign in Barbados cementing timeless T20 royalty.', '2× Champions · 2007, 2024', true, 2),
  ('ICC Champions Trophy', '2002 · 2013 · 2025', '🏅', '2002 · 2013 · 2025', 'Joint-winners in Colombo 2002 under Sourav Ganguly, Dhoni''s rain-curtailed defensive masterclass at Edgbaston in 2013, and continued dominance in the mini-World Cup.', '3× Champions', false, 3),
  ('World Test Championship', 'TEST MACE', '👑', 'TEST MACE', 'Consecutive finals appearances and unprecedented back-to-back away Test series wins in Australia (Border-Gavaskar Trophy) and resilient masterclasses in England.', 'Multi-Year Test Dominance', false, 4),
  ('8× Asia Cup Titles', 'CONTINENTAL KINGS', '🌏', 'CONTINENTAL KINGS', 'The most decorated nation in Asia Cup history with eight titles (1984, 1988, 1990, 1995, 2010, 2016, 2018, 2023) spanning both ODI and T20 tournament editions.', '8× Continental Champions', false, 5),
  ('ICC No. 1 Rankings', 'ALL FORMATS', '⭐', 'ALL FORMATS', 'A historic pinnacle achieved by only the greatest squads: simultaneously holding the World No.1 ranking across Tests, One Day Internationals, and T20 Internationals.', 'Ranked #1 Across All Formats', false, 6)
) AS v(title, years, icon, badge_text, description, footer_text, highlight, display_order)
WHERE NOT EXISTS (SELECT 1 FROM achievements);

-- Seed Players if empty
INSERT INTO players (name, jersey_number, role, batting_style, bowling_style, image_url, matches, runs, wickets, batting_avg, bowling_avg, category, is_captain, is_vice_captain, display_order)
SELECT * FROM (VALUES
  ('Rohit Sharma', '45', 'Top-Order Batter / Captain', 'Right Handed', 'Right-arm Offbreak', '/images/rohit.jpg', 485, 19245, 43, '49.12', '31.2', 'Men', true, false, 1),
  ('Virat Kohli', '18', 'Top-Order Batter', 'Right Handed', 'Right-arm Medium', '/images/kohli.jpg', 535, 26947, 8, '53.45', '45.1', 'Men', false, false, 2),
  ('Jasprit Bumrah', '93', 'Fast Bowler / Vice-Captain', 'Right Handed', 'Right-arm Fast', '/images/bumrah.jpg', 198, 540, 397, '11.20', '21.05', 'Men', false, true, 3),
  ('Hardik Pandya', '33', 'All-Rounder', 'Right Handed', 'Right-arm Fast-Medium', '/images/hardik.jpg', 195, 3650, 178, '34.80', '28.40', 'Men', false, false, 4),
  ('Ravindra Jadeja', '8', 'All-Rounder', 'Left Handed', 'Slow Left-arm Orthodox', '/images/jadeja.jpg', 342, 6200, 568, '36.50', '29.10', 'Men', false, false, 5),
  ('Rishabh Pant', '17', 'Wicketkeeper-Batter', 'Left Handed', 'Wicketkeeper', '/images/pant.jpg', 142, 4520, 0, '43.60', '–', 'Men', false, false, 6),
  ('Shubman Gill', '77', 'Top-Order Batter', 'Right Handed', 'Right-arm Offbreak', '/images/gill.jpg', 96, 3890, 0, '54.20', '–', 'Men', false, false, 7),
  ('Mohammed Shami', '11', 'Fast Bowler', 'Right Handed', 'Right-arm Fast', '/images/shami.jpg', 188, 410, 448, '10.50', '24.12', 'Men', false, false, 8)
) AS v(name, jersey_number, role, batting_style, bowling_style, image_url, matches, runs, wickets, batting_avg, bowling_avg, category, is_captain, is_vice_captain, display_order)
WHERE NOT EXISTS (SELECT 1 FROM players);

-- Seed Fixtures / Shows if empty
INSERT INTO shows (title, venue, city, show_date, show_time, ticket_url, badge)
SELECT * FROM (VALUES
  ('India vs England – 1st T20 International', 'Eden Gardens', 'Kolkata, India', DATE '2026-11-28', '7:00 PM IST', 'https://www.bcci.tv', 'T20 Series'),
  ('India vs England – 2nd T20 International', 'Narendra Modi Stadium', 'Ahmedabad, India', DATE '2026-12-02', '7:00 PM IST', 'https://www.bcci.tv', 'T20 Series'),
  ('India vs Australia – ICC Champions Trophy Opener', 'Wankhede Stadium', 'Mumbai, India', DATE '2026-12-18', '2:00 PM IST', 'https://www.bcci.tv', 'ICC Champions Trophy'),
  ('India vs South Africa – 1st Test Match', 'SuperSport Park', 'Centurion, South Africa', DATE '2027-01-05', '1:30 PM IST', 'https://www.bcci.tv', 'Test Series')
) AS v(title, venue, city, show_date, show_time, ticket_url, badge)
WHERE NOT EXISTS (SELECT 1 FROM shows);

-- Seed Videos if empty
INSERT INTO videos (title, youtube_url, thumbnail_url, display_order)
SELECT * FROM (VALUES
  ('Cricket World Cup 1983 Final: India v West Indies | Match Highlights', 'https://www.youtube.com/watch?v=kYQ8Q1dE31I', 'https://img.youtube.com/vi/kYQ8Q1dE31I/maxresdefault.jpg', 1),
  ('Cricket World Cup 2011 Final: India v Sri Lanka | Match Highlights', 'https://www.youtube.com/watch?v=XhBw0y6pY1A', 'https://img.youtube.com/vi/XhBw0y6pY1A/maxresdefault.jpg', 2),
  ('ICC Men''s T20 World Cup 2024 Final: India vs South Africa Triumph', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 3),
  ('2013 Champions Trophy Final: India vs England Edge of the Seat Thriller', 'https://www.youtube.com/watch?v=kYQ8Q1dE31I', 'https://img.youtube.com/vi/kYQ8Q1dE31I/maxresdefault.jpg', 4),
  ('India''s Historic Triumph at Fortress Gabba | Border-Gavaskar Trophy', 'https://www.youtube.com/watch?v=XhBw0y6pY1A', 'https://img.youtube.com/vi/XhBw0y6pY1A/maxresdefault.jpg', 5),
  ('60 Overs of HELL ft ICT | Lord''s 2021 Iconic Test Victory', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg', 6)
) AS v(title, youtube_url, thumbnail_url, display_order)
WHERE NOT EXISTS (SELECT 1 FROM videos);

-- Seed News if empty
INSERT INTO news (source_name, headline, article_url, published_date)
SELECT * FROM (VALUES
  ('BCCI Official', 'Squad Announced for Upcoming International Home Calendar 2026-27', 'https://www.bcci.tv', DATE '2026-11-15'),
  ('ICC Rankings', 'Team India Retains Undisputed No. 1 Ranking Across All Three Formats', 'https://www.icc-cricket.com', DATE '2026-11-12'),
  ('Centre of Excellence', 'State-of-the-Art High Performance Facility Inaugurated in Bengaluru', 'https://www.bcci.tv', DATE '2026-11-08'),
  ('Honours & Records', 'Rohit Sharma and Virat Kohli Celebrated for Transformative Era in Indian Cricket', 'https://www.bcci.tv', DATE '2026-11-01')
) AS v(source_name, headline, article_url, published_date)
WHERE NOT EXISTS (SELECT 1 FROM news);

-- Seed Testimonials if empty
INSERT INTO testimonials (quote, author_name, author_role, display_order)
SELECT * FROM (VALUES
  ('India is not just playing cricket; they are carrying the hopes of a nation, redefining boldness in world sports.', 'Sunil Gavaskar', 'Legendary Indian Captain & Batsman', 1),
  ('When the Indian team steps onto the field with the tricolor on their chest, the energy echoes beyond boundaries.', 'Sachin Tendulkar', 'Bharat Ratna & World Cup Champion', 2),
  ('No hesitation, no fear. This team takes the fight right to the opposition''s den and conquers it.', 'Ravi Shastri', 'Former Indian Head Coach & Champion', 3),
  ('The sheer intensity and technical elegance of modern Indian cricket is what keeps the global game alive.', 'Brian Lara', 'West Indies Cricket Legend', 4)
) AS v(quote, author_name, author_role, display_order)
WHERE NOT EXISTS (SELECT 1 FROM testimonials);
