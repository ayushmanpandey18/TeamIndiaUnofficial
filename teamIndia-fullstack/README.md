# 🎩 Suhani Shah Website – Fullstack

**Stack:** Node.js + Express + PostgreSQL

---

## 📁 Project Structure

```
suhani-fullstack/
├── server/
│   ├── index.js              ← Main Express server
│   ├── db/
│   │   ├── db.js             ← PostgreSQL connection
│   │   └── schema.sql        ← Database setup (run once)
│   ├── middleware/
│   │   └── auth.js           ← Admin auth middleware
│   └── routes/
│       ├── api.js            ← Public API routes
│       └── admin.js          ← Admin CRUD routes
├── public/
│   ├── index.html            ← Main website
│   ├── css/style.css         ← Styles
│   ├── js/main.js            ← Frontend JS
│   └── images/uploads/       ← Uploaded images
├── views/
│   └── admin/
│       ├── login.html        ← Admin login page
│       └── dashboard.html    ← Admin dashboard
├── .env                      ← Environment variables
└── package.json
```

---

## ⚙️ Setup Instructions

### Step 1 – Install Node.js
Download from: https://nodejs.org (v18 or higher)

### Step 2 – Install PostgreSQL
Download from: https://postgresql.org/download
During install, remember your **postgres password**

### Step 3 – Create Database
Open pgAdmin or psql and run:
```sql
CREATE DATABASE suhani_website;
```

### Step 4 – Setup .env file
Edit `.env` and update:
```
DB_PASSWORD=your_postgres_password
SESSION_SECRET=any_random_long_string
```

### Step 5 – Setup Database Tables
```bash
psql -U postgres -d suhani_website -f server/db/schema.sql
```

### Step 6 – Install Dependencies
Open terminal in project folder:
```bash
npm install
```

### Step 7 – Run the Project
```bash
npm run dev
```

---

## 🌐 URLs

| Page | URL |
|------|-----|
| Website | http://localhost:3000 |
| Admin Login | http://localhost:3000/admin/login |
| Admin Dashboard | http://localhost:3000/admin/dashboard |

---

## 🔐 Default Admin Login

| Field | Value |
|-------|-------|
| Email | admin@teamindia.com|
| Password | Admin@123 |

> ⚠️ Change the password in production!

---

## 🎛️ Admin Panel Features

- **Shows** – Add/Edit/Delete upcoming shows with dates, venues, ticket links
- **Videos** – Manage YouTube videos with auto-thumbnails
- **News** – Add news articles from media sources
- **Testimonials** – Manage celebrity quotes
- **Settings** – Update site title, tagline, social links, contact email

---

## 📡 API Endpoints (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/shows | Get active shows |
| GET | /api/videos | Get active videos |
| GET | /api/news | Get news articles |
| GET | /api/testimonials | Get testimonials |
| GET | /api/settings | Get site settings |

---

## 🔒 Admin API Endpoints (Protected)

All require login session.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /admin/login | Login |
| POST | /admin/logout | Logout |
| GET/POST | /admin/shows | List & Create shows |
| PUT/DELETE | /admin/shows/:id | Update & Delete show |
| GET/POST | /admin/videos | List & Create videos |
| DELETE | /admin/videos/:id | Delete video |
| GET/POST | /admin/news | List & Create news |
| DELETE | /admin/news/:id | Delete news |
| GET/POST | /admin/testimonials | List & Create |
| DELETE | /admin/testimonials/:id | Delete |
| GET/PUT | /admin/settings | Get & Update settings |
