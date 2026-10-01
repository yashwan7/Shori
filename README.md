# SHORI (勝利) — Personal Command Center

> A modern personal productivity, career-planning, and telemetry command center designed for ambitious software engineers tracking **DSA**, **Google Summer of Code (GSoC)**, and **Core Technical Projects**.

---

## 🌟 Key Features

### 1. Unified Mission Dashboard
- **Live Day Streak & Telemetry**: Visual momentum tracking with real-time indicators.
- **Goal Cards**: Dedicated overview cards for **DSA Mastery**, **GSoC 2025**, and **Custom Technical Tracks**.
- **Today's Directives**: High-priority task dispatch with one-click completion.
- **Weekly Telemetry**: Visual deep-work bar chart and pace indicator.

### 2. Dedicated DSA Tracker
- **13+ Core Topics**: Arrays, Strings, Linked Lists, Stack, Queue, Hashing, Trees, Graphs, Recursion, Dynamic Programming, Greedy, Binary Search, and Sorting.
- **Difficulty Analytics**: Solved breakdown across Easy, Medium, and Hard.
- **Spaced Repetition Queue**: Track problems needing revision vs revised vs solid.
- **Full Problem CRUD**: Log problem links, complexity notes, time spent, and last practiced dates.

### 3. GSoC 2025 Tracker
- **Step-by-Step Preparation Roadmap**: 9 core milestones from org exploration to final proposal submission.
- **Organization Explorer**: Shortlist target orgs (e.g. Apache Arrow, pgvector, OpenCV) with tech stacks and skill match %.
- **Contribution Telemetry**: Track PRs, issues, merge statuses, and benchmark results.
- **Official GSoC Calendar**: Deadlines countdown with critical action flags.
- **Learning Requirements**: Interactive checklist for system-level proficiencies.

### 4. Custom Goals & Engineering Projects
- Structured tracking for **AI/ML (RAG, Agents)**, **Projects (OrthoTwin, 3D Engine)**, **Skills**, and **College Capstone**.
- Deliverable checklists with automatic progress percentage calculations.

### 5. AI Personal Planner & Strategic Advisor
- **Intelligent Daily Plan Synthesis**: Balances DSA revision, GSoC proposal deadlines, and project milestones.
- **The "WHY" Engine**: Explains the exact technical rationale behind each recommended task.
- **Interactive Strategic Chat**: Instant answers to *"What should I focus on today?"*, *"What am I falling behind on?"*, *"Am I spending enough time on GSoC?"*, and *"Plan my next 7 days"*.
- **Direct Adoption**: One-click add AI-generated items straight to Today's Tasks.
- **Google Gemini API Support** with an automatic built-in heuristic reasoning fallback if offline or no key is present.

### 6. Daily Check-in & AI Review
- 5 targeted questions capturing accomplishment, categories, deep-work hours, pending blockers, and tomorrow's priority.
- Generates instant AI tactical critique on:
  - *What went well*
  - *What remains*
  - *Suggested next action*
  - *Tomorrow's priority*
- Automatically increments consecutive day streaks.

### 7. Telemetry & Analytics
- Weekly deep-work rhythm bar chart.
- Time allocation breakdown by domain (DSA, GSoC, AI/ML, Projects, College).
- Goal velocity and completion indexes.

### 8. Settings & Data Portability
- Secure Gemini API key configuration (stored in client localStorage or `.env`).
- Profile customization (Name, Target Year, Weekly Hour Goal).
- Complete JSON export and import for seamless multi-device backups.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
```bash
cp .env.example .env
# Add your Gemini API key:
# VITE_AI_API_KEY=your_key_here
```
*(Note: Shori will function even without an API key using its smart offline reasoning engine!)*

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## 🛠️ Tech Stack & Architecture
- **Framework**: React 19 + Vite
- **Styling**: Vanilla Modern CSS Design System (Sleek dark theme, subtle glassmorphism, responsive grids, custom typography)
- **Icons**: Lucide React
- **Typography**: Inter & JetBrains Mono (via Google Fonts)
- **State Layer**: Centralized `AppContext` with persistent `localStorage` synchronization
- **AI Service**: Google Gemini API (`gemini-1.5-flash` / `gemini-2.0-flash`) + offline contextual reasoning synthesizer

---

Built with precision for long-term technical growth.
