# ⚡ SHORI — Personal Engineering Command Center (React 19 + Supabase Full-Stack)

**Shori** is an advanced personal engineering productivity and career-planning command center engineered for ambitious software engineers, competitive programmers, and open-source contributors targeting **GSoC** and **Tier-1 Tech**.

Built with **React 19**, **Vite**, **Supabase (PostgreSQL + Auth + RLS)**, and **Live LeetCode & GitHub Telemetry**.

---

## 🚀 Key Features

- 🗄️ **Full Cloud Persistence with Supabase PostgreSQL**: Instant, real-time database sync for all your Tasks, Solved DSA algorithms, GSoC Organizations, Open Source Contributions, Custom Goals, and Daily Check-ins.
- 🔒 **Row-Level Security (RLS) & Multi-User Auth**: Isolated workspaces with secure Sign In, Sign Up, and OAuth (GitHub/Google).
- 🔄 **Zero State Loss on Refresh**: Never lose your progress when you reload the page. Data is fetched directly from Supabase with optimistic local caching.
- ⚡ **Live LeetCode Integration**: Fetches real solved counts (Easy/Medium/Hard), ranking, acceptance rate, and recent submissions for your LeetCode handle.
- 🐙 **Live GitHub Integration**: Tracks public repositories, weekly commit velocity, and live Pull Request states (Merged / Under Review / Open).
- 🧠 **AI Personal Planner & Tactical Critique**: Integrated with Google Gemini for automated daily review generation, intelligent schedule planning, and GSoC proposal brainstorming.
- 📊 **DSA & GSoC Command Desks**: Track roadmap milestones, organization tech stacks, PR reviews, algorithm revision queues, and weekly deep-work velocity.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Vanilla Modern CSS Design System (Glassmorphic Cyber Aesthetic)
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security policies)
- **Live APIs**: Public LeetCode Telemetry API, GitHub REST API, Google Gemini AI API
- **Icons**: Lucide Icons & Custom Vector Glyphs

---

## 📋 3-Minute Quick Setup Guide

### Step 1: Clone and Install Dependencies
```bash
git clone https://github.com/yashwan7/Shori.git
cd Shori
npm install
```

### Step 2: Set Up Supabase Cloud Database (Free)
1. Head over to [supabase.com](https://supabase.com) and create a free project.
2. Open your project dashboard, navigate to **SQL Editor** &rarr; **New Query**.
3. Copy the entire contents of [`supabase_schema.sql`](./supabase_schema.sql) and click **RUN**.
4. Go to **Project Settings** &rarr; **API** and copy:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **anon / public key**

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here

# Optional: Google Gemini AI Key
VITE_AI_API_KEY=
```

*(Note: You can also enter or update your Supabase URL & Anon Key directly from the in-app **Database Settings Modal** or **Settings Page** at any time!)*

### Step 4: Launch Shori Locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ Database Tables Schema Overview

| Table | Description |
|---|---|
| `profiles` | User bio, avatar, target goal, day streak, deep-work hours, and LeetCode/GitHub handles. |
| `tasks` | High-priority engineering tasks with category, priority, due date, estimated minutes, and status. |
| `dsa_problems` | Solved and revising algorithms with topic, difficulty, revision status, notes, and platform URLs. |
| `gsoc_organizations` | Target GSoC organizations, tech stack tags, repository links, project proposals, and skill matches. |
| `gsoc_contributions` | Logged Pull Requests, Issues, and Discussions with real-time status (Under Review / Merged / Open). |
| `daily_checkins` | End-of-day reflection telemetry, hours spent, accomplishments, blockers, and AI tactical reviews. |
| `goals` | Long-term technical goals with quarterly milestones and progress tracking. |

All tables have **Row Level Security (RLS)** enabled, ensuring users can only read, insert, and update their own records.

---

## 📦 Build for Production

```bash
npm run build
```
Production assets are generated in `dist/`.

---

## 📄 License
MIT © [Yashwanth](https://github.com/yashwan7)
>>>>>>> backend
