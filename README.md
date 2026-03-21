# ⚡ HackathonHub — Hackathon Management System

A full-stack web application for managing hackathons — from event creation to team formation, project submission, and judge scoring.

---

## 🗂 Project Structure

```
hackathonhub/
├── schema.sql                    ← MySQL database schema (run this first)
│
├── backend/                      ← Node.js + Express API
│   ├── server.js                 ← Main entry point
│   ├── package.json
│   ├── .env.example              ← Copy to .env and fill in your values
│   ├── config/
│   │   └── db.js                 ← MySQL connection pool
│   ├── middleware/
│   │   ├── authMiddleware.js     ← JWT verification
│   │   └── roleMiddleware.js     ← Role-based access control
│   ├── controllers/
│   │   ├── authController.js     ← Register, login, user management
│   │   ├── eventController.js    ← Hackathon events
│   │   ├── teamController.js     ← Team create/join
│   │   ├── projectController.js  ← Project submissions
│   │   └── scoreController.js    ← Judging, scoring, leaderboard
│   └── routes/
│       ├── authRoutes.js
│       ├── eventRoutes.js
│       ├── teamRoutes.js
│       ├── projectRoutes.js
│       └── scoreRoutes.js
│
└── frontend/                     ← React.js app
    ├── package.json
    └── src/
        ├── index.js              ← React entry point
        ├── index.css             ← Global design system
        ├── App.js                ← Router + route definitions
        ├── context/
        │   └── AuthContext.js    ← Global auth state
        ├── utils/
        │   └── api.js            ← Axios instance
        ├── components/
        │   ├── Sidebar.js        ← Navigation sidebar
        │   ├── Layout.js         ← Page shell
        │   └── ProtectedRoute.js ← Auth/role guard
        └── pages/
            ├── Login.js
            ├── Register.js
            ├── Dashboard.js      ← Role-based dashboard
            ├── Events.js         ← Event management
            ├── Team.js           ← Create / join team
            ├── Submit.js         ← Project submission
            ├── JudgePanel.js     ← Scoring interface
            ├── Leaderboard.js    ← Rankings
            ├── Users.js          ← Admin: all users
            ├── Teams.js          ← Admin: all teams
            ├── Projects.js       ← Admin: all projects
            └── Scores.js         ← Admin/Judge: all scores
```

---

## ✅ Prerequisites

Make sure these are installed on your machine:

| Tool | Version | Check |
|------|---------|-------|
| Node.js | v18+ | `node --version` |
| npm | v9+ | `npm --version` |
| MySQL | v8+ | `mysql --version` |

---

## 🗄️ Step 1 — Set Up the Database

### 1a. Start MySQL and open the client

```bash
# On macOS (Homebrew)
brew services start mysql
mysql -u root -p

# On Ubuntu/Debian
sudo service mysql start
mysql -u root -p

# On Windows
# Open MySQL Workbench or MySQL Command Line Client
```

### 1b. Run the schema file

```sql
-- Inside MySQL client, run:
SOURCE /path/to/hackathonhub/schema.sql;

-- OR using the command line:
-- mysql -u root -p < /path/to/hackathonhub/schema.sql
```

This creates:
- Database: `hackathonhub`
- Tables: `users`, `events`, `teams`, `team_members`, `projects`, `scores`, `judge_assignments`
- Default admin user: `admin@hackathonhub.com` / `password`

### 1c. Verify tables were created

```sql
USE hackathonhub;
SHOW TABLES;
```

Expected output:
```
+-------------------------+
| Tables_in_hackathonhub  |
+-------------------------+
| events                  |
| judge_assignments       |
| projects                |
| scores                  |
| team_members            |
| teams                   |
| users                   |
+-------------------------+
```

---

## ⚙️ Step 2 — Configure & Run the Backend

### 2a. Navigate to the backend folder

```bash
cd hackathonhub/backend
```

### 2b. Install dependencies

```bash
npm install
```

This installs: `express`, `mysql2`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`, `nodemon`

### 2c. Create your environment file

```bash
# Copy the example file
cp .env.example .env
```

Then **edit `.env`** with your MySQL credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password_here
DB_NAME=hackathonhub
JWT_SECRET=hackathonhub_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
```

### 2d. Start the backend server

```bash
# Development mode (auto-restarts on file changes)
npm run dev

# OR production mode
npm start
```

✅ You should see:
```
✅ MySQL Database connected successfully
🚀 HackathonHub API Server running on http://localhost:5000
```

### 2e. Test the API is working

Open your browser or use Thunder Client / Postman:
```
GET http://localhost:5000/api/health
```

Expected response:
```json
{ "success": true, "message": "HackathonHub API is running!" }
```

---

## 🎨 Step 3 — Configure & Run the Frontend

### 3a. Open a NEW terminal and navigate to the frontend

```bash
cd hackathonhub/frontend
```

### 3b. Install dependencies

```bash
npm install
```

This installs: `react`, `react-dom`, `react-router-dom`, `axios`, `react-scripts`

### 3c. Start the React development server

```bash
npm start
```

The app will open automatically at **http://localhost:3000**

> The `"proxy": "http://localhost:5000"` in `package.json` forwards API calls to the backend — so both servers must be running simultaneously.

---

## 🚀 Running Both Servers (Quick Reference)

Open **two terminal windows** side by side:

**Terminal 1 — Backend:**
```bash
cd hackathonhub/backend
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd hackathonhub/frontend
npm start
# Running on http://localhost:3000
```

---

## 👤 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hackathonhub.com | password |

> ⚠️ Change the admin password immediately after your first login in production!

To create other users, use the Register page and select your role.

---

## 🔌 Full API Reference (for Postman / Thunder Client)

### Base URL: `http://localhost:5000/api`

### Authentication
All protected routes require the header:
```
Authorization: Bearer <your_jwt_token>
```

---

### 🔐 Auth Routes

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/register` | ❌ | `{ name, email, password, role }` | Register new user |
| POST | `/auth/login` | ❌ | `{ email, password }` | Login |
| GET | `/auth/me` | ✅ | — | Get current user |
| GET | `/auth/users` | ✅ Admin | — | List all users |

**Register example:**
```json
POST /api/auth/register
{
  "name": "Alice Smith",
  "email": "alice@example.com",
  "password": "mypassword",
  "role": "participant"
}
```

---

### 🗓 Event Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/events` | ✅ All | List all events |
| GET | `/events/:id` | ✅ All | Get single event |
| POST | `/events` | ✅ Admin | Create event |
| POST | `/events/:id/assign-judge` | ✅ Admin | Assign judge to event |
| GET | `/events/:id/judges` | ✅ All | Get judges for event |

**Create event example:**
```json
POST /api/events
{
  "name": "Summer Hackathon 2024",
  "description": "48-hour coding challenge",
  "start_date": "2024-07-01T09:00:00",
  "end_date": "2024-07-03T09:00:00"
}
```

---

### 👥 Team Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/teams` | ✅ All | List all teams |
| GET | `/teams/my` | ✅ All | Get my team |
| GET | `/teams/:id` | ✅ All | Get team by ID |
| POST | `/teams` | ✅ Participant | Create team |
| POST | `/teams/join` | ✅ Participant | Join team via code |

**Create team example:**
```json
POST /api/teams
{
  "team_name": "CodeCrusaders",
  "event_id": 1
}
```

**Join team example:**
```json
POST /api/teams/join
{
  "team_code": "A3F9B2"
}
```

---

### 📁 Project Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/projects` | ✅ All | List projects (role-filtered) |
| GET | `/projects/:id` | ✅ All | Get project with scores |
| POST | `/projects` | ✅ Participant | Submit project |
| PUT | `/projects/:id` | ✅ Participant | Update submission |

**Submit project example:**
```json
POST /api/projects
{
  "title": "AI Study Assistant",
  "description": "A web app that uses GPT to help students study better...",
  "github_link": "https://github.com/alice/ai-study-assistant"
}
```

---

### ⭐ Score Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/scores` | ✅ Judge | Submit/update score |
| GET | `/scores` | ✅ Admin/Judge | View scores |
| GET | `/scores/leaderboard` | ✅ All | Get ranked leaderboard |

**Submit score example:**
```json
POST /api/scores
{
  "project_id": 1,
  "score": 8.5,
  "feedback": "Great concept and execution. UI could use more polish."
}
```

**Leaderboard with event filter:**
```
GET /api/scores/leaderboard?event_id=1
```

---

## 🎯 Role-Based Feature Summary

| Feature | Admin | Participant | Judge |
|---------|-------|-------------|-------|
| View events | ✅ | ✅ | ✅ |
| Create events | ✅ | ❌ | ❌ |
| Assign judges | ✅ | ❌ | ❌ |
| View all users | ✅ | ❌ | ❌ |
| View all teams | ✅ | ❌ | ❌ |
| Create/join team | ❌ | ✅ | ❌ |
| Submit project | ❌ | ✅ | ❌ |
| Score projects | ❌ | ❌ | ✅ |
| View leaderboard | ✅ | ✅ | ✅ |
| View all scores | ✅ | ❌ | Own only |

---

## 🔧 Troubleshooting

### "ER_ACCESS_DENIED_ERROR"
Your MySQL password in `.env` is wrong. Double-check `DB_PASSWORD`.

### "ECONNREFUSED" on backend start
MySQL isn't running. Start it:
```bash
# macOS: brew services start mysql
# Ubuntu: sudo service mysql start
# Windows: Start from Services panel
```

### Frontend can't reach backend
Make sure backend is running on port 5000 AND the `proxy` field in `frontend/package.json` is set to `http://localhost:5000`.

### "Table doesn't exist" errors
You haven't run `schema.sql` yet. See Step 1.

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### npm install fails
Make sure Node.js v18+ is installed:
```bash
node --version   # should be v18.x.x or higher
```

---

## 🏗️ Database Schema Overview

```
users
  id, name, email, password(hashed), role, created_at

events
  id, name, description, start_date, end_date, created_by → users.id

teams
  id, team_name, leader_id → users.id, event_id → events.id, team_code

team_members
  id, team_id → teams.id, user_id → users.id

projects
  id, team_id → teams.id, event_id → events.id, title, description, github_link, submitted_at

scores
  id, project_id → projects.id, judge_id → users.id, score(0-10), feedback, scored_at

judge_assignments
  id, judge_id → users.id, event_id → events.id
```

---

## 📦 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL 8, mysql2 package |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Dev tools | nodemon, dotenv |

---

## 💡 Tips for College Demo

1. **Create an admin account** — The default seed admin is `admin@hackathonhub.com` / `password`
2. **Create an event** — Log in as admin → Events → New Event
3. **Register as participant** — Create a team, submit a project
4. **Register as judge** — Admin assigns you to the event → Judge Panel → score projects
5. **View Leaderboard** — See rankings after scoring

---

*Built with ⚡ by HackathonHub — Full-Stack React + Node.js + MySQL*
