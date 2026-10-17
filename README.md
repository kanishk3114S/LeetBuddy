<div align="center">

# ⚡ LeetBuddy

### *Production-Grade Competitive Programming Analytics & AI Copilot Platform*

**Stop solving randomly. Start solving what you’re actually weak at.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Mongoose_9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash_Lite-8E75C4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![GraphQL](https://img.shields.io/badge/LeetCode-GraphQL_API-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)

<br />

[Explore Features](#-core-features) •
[Contest Analysis Module](#-contest-analysis-module-phase-1) •
[Verification Pipeline](#-secure-leetcode-verification-pipeline) •
[Architecture](#-system-architecture) •
[Topic Mastery](#-topic-mastery--41-algorithmic-patterns) •
[API Reference](#-api-reference) •
[Local Setup](#-getting-started)

</div>

---

## 💡 Why LeetBuddy?

Most competitive programmers are trapped in the same unproductive loop:
> *Pick random problem ➔ Get stuck ➔ Check the solution ➔ Forget the pattern ➔ Contest rating stays flat.*

**LeetBuddy transforms raw activity into intentional, data-driven mastery.** It bridges the gap between passive problem solving and competitive breakthrough:

- **What am I actually good at?**
- **Where are my exact conceptual bottlenecks?**
- **Why am I failing under contest pressure?**
- **What specific ladder of 3–4 problems should I practice next?**

> **Core Philosophy:** *The backend calculates objective facts. The AI interprets those facts.*

---

## 🏗️ System Architecture

```text
┌───────────────────────────┐          ┌───────────────────────────┐          ┌───────────────────────────┐
│     React 19 + Vite 8     │ ◄──────► │    Express 5 Backend API  │ ◄──────► │     LeetCode GraphQL      │
│  Tailwind v4 • Recharts   │          │  (Node.js / JWT Session)  │          │    (Stats & Contests)     │
└─────────────┬─────────────┘          └─────────────┬─────────────┘          └───────────────────────────┘
              │                                      │
              │                                      ├──────────────────────► ┌───────────────────────────┐
              │                                      │                        │     Google Gemini AI      │
              │                                      ▼                        │   (Profile & Weakness)    │
              │                         ┌───────────────────────────┐         └───────────────────────────┘
              └───────────────────────► │       MongoDB Atlas       │
                                        │  users • profileData      │
                                        │  sessions • Contest       │
                                        └───────────────────────────┘
```

---

## 🔐 Secure LeetCode Verification Pipeline

LeetBuddy connects to your real LeetCode profile **without ever requesting your password, session cookie, or sensitive credentials**:

```text
[Step 1: Mint]       Backend generates unguessable 12-char alphanumeric token
                            │  e.g., "HqmDIfWqHAwq"
                            ▼
[Step 2: Bio Gate]   User pastes token into their LeetCode "About Me" section
                            │
                            ▼
[Step 3: Handshake]  Backend queries LeetCode GraphQL (aboutMe) to verify ownership
                            │
                            ▼
[Step 4: Parallel Ingestion (Promise.allSettled)]
                     ├── Profile Stats Pipeline:
                     │   • submitStatsGlobal (Problems & Submissions)
                     │   • userCalendar (Streaks & 52-Week Submissions)
                     │   • badges & activeBadge (Knight, Guardian, etc.)
                     │   • 41 Competitive Programming Topics
                     │   • beatsStats & Site-wide Rankings
                     │
                     └── Contest Telemetry Pipeline:
                         • userContestRanking (Rating, Global Rank, Percentile)
                         • userContestRankingHistory (Attended Contests, Deltas, Finish Times)
                         • recentSubmissionList (Last 5 Contests Question Error Diagnostics)
                            │
                            ▼
[Step 5: AI Trigger] Gemini AI synthesizes an executive Hero Card diagnostic report
```

---

## ✨ Core Features

### 1. ⌁ Contest Analysis Module (Phase 1)
High-density, precision telemetry dashboard engineered specifically for competitive programmers who compete in LeetCode Weekly and Biweekly contests.

- **Executive KPI Telemetry Ribbon:**
  - **Current Contest Rating:** Precise rating with color-coded latest contest delta badge (`+24` in emerald or `-12` in rose).
  - **Peak & Floor Rating:** All-time rating ceiling vs historical floor.
  - **Contests Attended:** Total rated events with attendance cadence.
  - **Global Rank & Top Percentile:** Real-time leaderboard placement (e.g., `#1,420 • Top 1.8%`).
  - **Official LeetCode Badge Tier:** Knight, Guardian, or Unbadged status with semantic badges.
  - **Live Sync Action:** Manual on-demand contest telemetry refresh trigger.

- **Dual Performance Matrices (2-Column Desktop Grid):**
  - **Leaderboard Placement Matrix:** Strict 4-bracket distribution tracking performance across:
    - **Elite (`< 1,000`):** Sub-1k leaderboard finishes.
    - **Contender (`1,000 – 5,000`):** High-tier competitive placements.
    - **Competitor (`5,001 – 10,000`):** Solid mid-pack finishes.
    - **Participant (`> 10,000`):** Field placements.
    - *Includes exact contest counts, percentage share, and precision proportion bars.*
  - **Problem Solving Lethality Matrix:** Evaluates performance on standard 4-problem contest formats:
    - **4/4 All Kills:** Full clears highlighted with an emerald accent border and 4 filled micro-blocks.
    - **3/4 Strong Finish:** 3 micro-blocks filled.
    - **2/4 Standard Solve:** 2 micro-blocks filled.
    - **1/4 Single Solve:** 1 micro-block filled.
    - **0/4 Zero Solves:** Clean secondary footnote ensuring percentages total 100%.

- **LeetCode-Style Rating Trajectory Mountain Chart:**
  - Built with **Recharts** (`AreaChart`, `ResponsiveContainer`, `ReferenceLine`).
  - Signature green mountain line with subtle vertical linear-gradient fill.
  - Auto-scaled dynamic Y-axis with horizontal reference lines for **Knight (1850)** and **Guardian (2150)** milestones.
  - **Interactive Custom Telemetry Tooltip:** Hovering any contest reveals the contest name, full date, post-contest rating, rating delta badge, placement rank, problems solved (`3/4`), and formatted finish time (`42m 15s`).

- **Zero-Contest Technical Empty State:**
  - Non-broken, graceful empty state for verified users who have not yet participated in rated contests, complete with instructions and a manual sync trigger.

---

### 2. 🤖 AI Diagnostic Copilot (Hero Card)
- **Persona Synthesis:** Generates a competitive programming archetype (e.g., *"Volume-Driven Problem Solver"*, *"Analytical Architect"*) based on verified stats.
- **Root-Cause Bottleneck Discovery:** Pinpoints specific problem types (e.g., *Dynamic Programming represents 42% of unaccepted submissions*) revealing concept-recognition gaps rather than simple fatigue.
- **Actionable Ladder Recommendations:** Synthesizes custom tactical guidance for next steps in practice.
- **Symmetric Minimalist Modal:** Interactive dialog with glassmorphism blur backdrop, on-demand re-analysis trigger, and high-priority overlay layer (`z-[9999]`).

---

### 3. ◈ Topic Mastery & 41 Algorithmic Patterns
- **41 Standard LeetCode Topic Classifications:** Organized across **Fundamental**, **Intermediate**, and **Advanced** categories.
- **Mastery Scoring Engine:** Combines problem volume, difficulty weights, and accuracy heuristics to compute a 0–100 mastery score per topic.
- **Tri-Tier Diagnostic Grouping:**
  - 🟢 **Mastered / Strong:** Proven fluency and high accuracy.
  - 🟡 **Developing / Intermediate:** Good exposure, needs edge-case reinforcement.
  - 🔴 **Critical Weakness:** High attempt volume with low acceptance rates under pressure.
- **Algorithmic Diagnostics:** Curated diagnostic briefs for each topic (e.g., *Dynamic Programming: Weakness in state definition and transition recognition*).

---

### 4. 🏔️ Progress Mountain & 11-Tier Gamification
- **11 Competitive Tiers:** Progression spanning Rookie (T1) &rarr; Challenger &rarr; Warrior &rarr; Grinder &rarr; Veteran &rarr; Conqueror &rarr; Grindmaster &rarr; UltimateGrindmaster &rarr; Champion &rarr; LeetKing &rarr; LeetGOAT (T11).
- **Badges Embedded in Bars:** Custom rank badges embedded directly inside vertical step bars, forming an ascending staircase.
- **Points Range & Tier Labels:** Every step clearly indicates its lower and upper points threshold beneath the mountain axis (`0 - 500`, `501 - 1k`, ..., `10k+`).
- **Climber Avatar & Hover Tooltips:** Active climber avatar perches directly on your current tier bar, with smooth non-clipping hover tooltips for previewing target milestones.

$$\text{LeetBuddy Points} = (\text{Easy Solved} \times 1) + (\text{Medium Solved} \times 3) + (\text{Hard Solved} \times 5)$$

---

### 5. 🎯 Deep Engine Analytics & Diagnostic Matrices
- **Difficulty & Points Matrix (The "Engine" View):**
  - Donut & Pie charts (Recharts) detailing Easy vs. Medium vs. Hard distribution.
  - Efficiency Score calculation:
    $$\text{Efficiency} = \left(\frac{\text{Accepted Submissions}}{\text{Total Submissions}}\right) \times 100$$
  - Real-time LeetBuddy Points progression towards the next rank milestone.
- **Behavioral & Consistency Analysis (Temporal Patterns):**
  - Submission velocity metrics (attempts needed per accepted problem by difficulty).
  - Peak activity days versus high failure rate days.
  - Consistency Index tracking active streaks and monthly resilience.

---

### 6. 📅 12-Month Contribution Heatmap & Streaks
- **Yearly Contribution Matrix:** 12 structured clusters (Jan &rarr; Dec) with interactive tooltips and green-gradient activity intensities.
- **Real-Time Streak Tracker:** Active Streak, Total Active Days, and Yearly Submissions counter with dynamic year switching.

---

### 7. ☀️ High-Contrast Light & Dark Theme System
- **Pure Luminous Light Mode:** Clean neutral borders, rich typography, and crisp contrast.
- **High-Density Dark Mode:** Precision financial/telemetry aesthetic with `#131815` canvas, dark border tokens (`border-neutral-800`), and tabular monospace typography.

---

## 🏆 The 11-Tier Ranking Ladder

| Tier | Rank Title | Points Range | Accent Color | Description |
|:---:|:---|:---:|:---:|:---|
| **T1** | Rookie | 0 – 500 pts | `#6C757D` | Taking the first steps in competitive problem solving |
| **T2** | Challenger | 501 – 1,000 pts | `#4CC9F0` | Building foundational syntax and problem logic |
| **T3** | Warrior | 1,001 – 1,500 pts | `#48CAE4` | Confident with basic arrays, strings, and hash maps |
| **T4** | Grinder | 1,501 – 2,000 pts | `#00F5D4` | Mastering two-pointers, stacks, and binary search |
| **T5** | Veteran | 2,001 – 2,500 pts | `#2EC4B6` | Tackling intermediate trees, graphs, and recursion |
| **T6** | Conqueror | 2,501 – 3,000 pts | `#2A9D8F` | High-accuracy problem solving under contest conditions |
| **T7** | Grindmaster | 3,001 – 4,000 pts | `#FB8500` | Elite consistency across heaps, backtracking, and greedy |
| **T8** | UltimateGrindmaster | 4,001 – 5,000 pts | `#FFB703` | Advanced dynamic programming and graph algorithms |
| **T9** | Champion | 5,001 – 7,000 pts | `#9D4EDD` | Mastering segment trees, tries, and complex bitmasks |
| **T10** | LeetKing | 7,001 – 10,000 pts | `#E63946` | Top-percentile algorithmic fluency across all domains |
| **T11** | LeetGOAT | 10,001+ pts | `#FFD700` | Grandmaster-tier speed, elegance, and accuracy |

---

## 🔌 API Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| `POST` | `/api/auth/register` | Register new user account & issue JWT session | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT tokens | ❌ |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | ✅ Bearer |
| `GET` | `/api/auth/refresh-token` | Rotate refresh token & issue new access token | ❌ Cookie |
| `GET` | `/api/auth/logout` | Revoke active session & clear cookies | ❌ Cookie |
| `GET` | `/api/auth/logoutAll` | Revoke all active user sessions across devices | ❌ Cookie |

### LeetCode Profile & AI Engine (`/api/leetcode`)

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| `POST` | `/api/leetcode/generate-token` | Mint a 12-char alphanumeric verification token | ✅ Bearer |
| `POST` | `/api/leetcode/verify` | Verify bio handshake, parallel-sync profile & contest telemetry | ✅ Bearer |
| `POST` | `/api/leetcode/refresh` | Force sync live stats & contest data in parallel | Optional |
| `POST` | `/api/leetcode/hero-card` | Get existing AI hero card or trigger fresh Gemini re-analysis | Optional |

### Contest Analysis Module (`/api/v1/contests`)

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| `GET` | `/api/v1/contests/me` | Fetch authenticated user's contest telemetry | ✅ Bearer |
| `GET` | `/api/v1/contests/:username` | Fetch contest telemetry by LeetCode handle | ❌ |
| `POST` | `/api/v1/contests/sync` | Force fetch live contest rankings, history & deep telemetry | Optional |

#### Sample Contest Response (`GET /api/v1/contests/:username`):
```json
{
  "message": "Contest telemetry retrieved successfully",
  "contest": {
    "leetcodeUsername": "neal_wu",
    "summary": {
      "attendedContestsCount": 51,
      "rating": 3686,
      "PeakRating": 3686,
      "lowestRating": 1880,
      "globalRanking": 2,
      "totalParticipants": 888637,
      "topPercentage": 0.01,
      "badge": "Guardian"
    },
    "contestHistory": [
      {
        "contestTitle": "Weekly Contest 180",
        "startTime": 1584239400,
        "rating": 3686,
        "ranking": 1,
        "problemsSolved": 4,
        "totalProblems": 4,
        "finishTimeInSeconds": 596,
        "trendDirection": "UP"
      }
    ],
    "recentFiveContestsDeepDive": [
      {
        "contestTitle": "Weekly Contest 180",
        "startTime": 1584239400,
        "ranking": 1,
        "ratingAfter": 3686,
        "ratingDelta": 61,
        "problemsSolved": 4,
        "totalProblems": 4,
        "questions": [
          {
            "title": "Design Underground System",
            "titleSlug": "design-underground-system",
            "difficulty": "Medium",
            "status": "Accepted",
            "failCount": 0,
            "language": "cpp",
            "errorCause": null,
            "submittedAt": 1584239700
          }
        ]
      }
    ],
    "lastSyncedAt": "2026-10-17T05:00:00.000Z"
  }
}
```

---

## 📂 Repository Structure

```text
LeetBuddy/
├── Backend/
│   ├── src/
│   │   ├── Ai/                             # Gemini AI diagnostic service
│   │   │   └── heroCard.service.js         # Persona & weakness analysis
│   │   ├── config/                         # MongoDB & JWT configuration
│   │   │   ├── config.js
│   │   │   └── connectToDB.js
│   │   ├── controllers/                    # Business logic controllers
│   │   │   ├── auth.controller.js          # Authentication & session lifecycle
│   │   │   ├── contest.controller.js       # Contest telemetry endpoints
│   │   │   └── leetcode.controller.js      # Verification & profile sync
│   │   ├── middlewares/                    # Request middlewares
│   │   │   └── auth.middleware.js          # JWT & session verification
│   │   ├── models/                         # Mongoose schemas & indices
│   │   │   ├── contest.model.js            # Contest summary, history & deep dive
│   │   │   ├── profile-data.model.js       # Profile stats, topics & heatmap
│   │   │   ├── session.model.js            # Device & refresh token tracking
│   │   │   └── user.model.js               # User accounts & LeetCode handshake
│   │   ├── routes/                         # Express REST API routes
│   │   │   ├── auth.routes.js              # /api/auth endpoints
│   │   │   ├── contest.routes.js           # /api/v1/contests endpoints
│   │   │   └── leetcode.routes.js          # /api/leetcode endpoints
│   │   ├── services/                       # External extraction pipelines
│   │   │   └── leetcodeContest.service.js  # GraphQL contest extraction & correlation
│   │   ├── utils/                          # Backend error utilities
│   │   │   └── api-error.js
│   │   └── app.js                          # Express app configuration
│   ├── server.js                           # Server entry point (Port 3000)
│   ├── package.json
│   └── .env
│
├── Frontend/
│   └── frontend/
│       ├── public/                         # Static assets & badge SVGs
│       ├── src/
│       │   ├── components_dashboard/       # Dashboard shell components
│       │   │   ├── DashHeader.jsx          # Header with user avatar & greeting
│       │   │   ├── Sidebar.jsx             # Collapsible/pinnable navigation
│       │   │   ├── StatsView.jsx           # Activity overview & heatmap
│       │   │   ├── ThemeToggle.jsx         # Dark/Light mode toggle
│       │   │   └── VerifyFlow.jsx          # Interactive verification wizard
│       │   ├── components_profileAnalyses/ # Profile Insights components
│       │   │   ├── BadgeImage.jsx          # SVG badge renderer
│       │   │   ├── BehavioralConsistencyAnalysis.jsx # Temporal velocity charts
│       │   │   ├── DifficultyPointsMatrix.jsx # Donut distribution & efficiency
│       │   │   ├── HeroCard.jsx            # Gemini AI diagnostic modal
│       │   │   ├── ProgressMountain.jsx    # 11-Tier gamified mountain
│       │   │   └── TopicMasteryMatrix.jsx  # Topic radar chart
│       │   ├── components_topicMastery/    # Topic drilldown directory
│       │   │   └── TopicDirectory.jsx      # 41-topic categorized drilldown
│       │   ├── context/                    # Theme Context Provider
│       │   │   ├── ThemeContext.jsx
│       │   │   └── theme.js
│       │   ├── hooks/                      # Custom hooks
│       │   │   └── useTheme.js
│       │   ├── pages/                      # Page views
│       │   │   ├── ContestAnalysis.jsx     # Contest executive telemetry & chart
│       │   │   ├── Dashboard.jsx           # Main user overview
│       │   │   ├── ProfileAnalysis.jsx     # Profile insights & engine
│       │   │   └── TopicMastery.jsx        # Topic directory & breakdown
│       │   ├── utils/                      # Pure data formatting & algorithms
│       │   │   ├── contestUtils.js         # Contest telemetry, brackets & mountain data
│       │   │   ├── profileData.js          # Profile GraphQL normalizer
│       │   │   ├── rankings.js             # 11-Tier formulas & color tokens
│       │   │   └── topicData.js            # 41 topic definitions & diagnostics
│       │   ├── App.jsx                     # Landing page
│       │   ├── Auth.jsx                    # Auth view (Login / Register)
│       │   ├── index.css                   # Tailwind v4 import & custom variants
│       │   └── main.jsx                    # React Router configuration
│       ├── vite.config.js                  # Vite configuration & proxy routes
│       └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20.x or later recommended)
- [MongoDB Atlas](https://www.mongodb.com/) cluster or local MongoDB instance
- [Google Gemini API Key](https://aistudio.google.com/) (for AI Hero Card analysis)

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd Backend

# Install dependencies
npm install

# Create environment configuration (.env)
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/leetbuddy
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key

# Start development server
npm run dev
```

The backend server will start on **`http://localhost:3000`**.

---

### 2. Frontend Setup

```bash
# In a separate terminal, navigate to the frontend directory
cd Frontend/frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open **`http://localhost:5173`** in your browser.

> [!TIP]
> **Vite Proxy Configuration:** The frontend development server automatically proxies:
> - `/api` &rarr; `http://localhost:3000`
> - `/leetcode-proxy` &rarr; `https://leetcode.com/graphql` (with appropriate `Referer` and `Origin` headers to prevent CORS issues during local development).

---

## 🛡️ Security & Reliability

- **Zero-Credential Verification:** No LeetCode passwords, cookies, or session tokens are ever handled or stored.
- **Strict Token Encoding:** Verification tokens use unguessable 12-character alphanumeric tokens (`[A-Za-z0-9]`) to avoid triggering LeetCode profile markdown filters.
- **Parallel Pipeline Resilience:** Profile stats and contest telemetry sync using `Promise.allSettled`, guaranteeing that accounts with 0 attended contests never disrupt profile verification or stats refresh.
- **High-Density Aesthetic:** Zero generic AI slop. Built with clean 1px borders, tabular monospace numerals (`font-mono tabular-nums`), and a precision financial/telemetry design language.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built for intentional practice by competitive programmers, for competitive programmers.</sub>
</div>