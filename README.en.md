**Kidzania (Kidzademy) — Interactive Learning Platform for Kids**

A modern web platform that combines **courses + quizzes + educational games** into a fun learning experience for kids, with a dedicated **Admin dashboard** for content management.  
Built with **Vue 3 + Vite + Pinia**, and uses **JSON Server** for persistent local data in development.

---

## Quick contents
- **Overview**
- **Key Features**
- **Tech Stack**
- **Run Locally**
- **Demo Accounts**
- **API (JSON Server)**
- **AI Assistant (Optional)**
- **Project Structure**

---

## Overview
**Kidzania / Kidzademy** is designed to make learning feel like play:
- Students enroll in courses, watch lessons, and see **dynamic progress**.
- Students take quizzes and get a **review** after finishing (without showing the correct answer during the attempt).
- Interactive games (Drag & Drop / Matching / Memory) with **Arabic + English** support and a kid-friendly theme.
- Admin manages everything: courses, lessons, exams, users, subscriptions, etc.

---

## Key Features
### For Students
- **Courses**
  - Learn through the Course Player
  - **Real progress** based on completed lessons
  - `My Courses` shows no cards before enrollment + motivational message
- **Tests**
  - Change answers anytime before Finish
  - Correct answers shown only in Review
  - Motivational message based on the score
- **Games**
  - Professional kid-friendly UI (animations + consistent theme)
  - Automatic **Arabic/English** switching based on app language

### For Admin
- **Admin Dashboard** with stats and quick actions
- **Exam Builder**
  - Strong validation (exactly 4 options + correct answer required + clear toasts)
  - Smooth publish flow (including new exams)
  - **Draft vs Published** (drafts stay in Admin only)
  - **Allow Retry** setting controlling “Try Again”
- **Course Builder**
  - Create/edit courses + chapters + lessons with JSON Server persistence
  - Prevent adding a new lesson before filling the current lesson details
- **Users**
  - Manage users + Suspended/Active
  - Suspended users cannot sign in

---

## Tech Stack
- **Frontend**: Vue 3 (Composition API) + Vite
- **State**: Pinia
- **Routing**: Vue Router
- **UI**: Bootstrap + custom CSS theme
- **Notifications**: Vue Toastification
- **Mock Backend / Persistence**: JSON Server (`db.json`)

---

## Run Locally
### Requirements
- Node.js **18+** (recommended)
- npm

### Quick start
```bash
npm install
npm run api
npm run dev
```

### One-click start (Windows)
Use:
- `build-and-run.bat`  
It starts **JSON Server on 3001** then runs the **Vite dev server**.

---

## Demo Accounts
> These are stored in `db.json` for development/demo only.

### Admin Panel
- **username**: `admin@gmail.com`
- **password**: `admin123`

### User (example)
- **email**: `mahmoud@gmail.com`
- **password**: `12345678`
- This user is **suspended** (sign in should be blocked)

---

## API (JSON Server)
### Start
```bash
npm run api
```
- **Base URL**: `http://localhost:3001`

### Important note (Proxy)
The app uses a proxy in `vite.config.js`:
- Any call to `fetch('/api-data/...')` is forwarded to `http://localhost:3001/...`

### Collections in `db.json`
- `exams`
- `results`
- `courses`
- `subscriptions`
- `users`
- `admins`

---

## AI Assistant (Optional) — Kidzademy AI Assistant
The AI chat uses a **Vite server middleware** to avoid exposing your API key in the browser.

### `.env` setup
Create a `.env` file in the project root:
```bash
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

### Quick health check
Open:
- `http://localhost:5173/api/ai-health`  
to verify the server can read your env variables.

---

## Project Structure (High-level)
- `src/pages/` user-facing pages (Home/Courses/Tests/Play/Games…)
- `src/pages/admin/` admin pages
- `src/stores/` Pinia stores
- `src/api/` API clients (via `/api-data`)
- `db.json` JSON Server DB
- `build-and-run.bat` Windows runner



