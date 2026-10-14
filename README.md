<div align="center">

# ⚡ LeetBuddy

### *Your Competitive Programming Copilot*

**Stop solving randomly. Start solving what you’re actually weak at.**

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash_Lite-8E75C4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![GraphQL](https://img.shields.io/badge/LeetCode-GraphQL_API-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)

<br />

[Explore Features](#-core-features) •
[Verification Pipeline](#-secure-leetcode-verification-pipeline) •
[Architecture](#-system-architecture) •
[AI Engine](#-ai-diagnostic-copilot-hero-card) •
[Gamification & Mountain](#-progress-mountain--11-tier-gamification) •
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
┌────────────────┐          ┌──────────────────────┐          ┌──────────────────────┐
│  React 18 + UI │ ◄──────► │  Express Backend API │ ◄──────► │   LeetCode GraphQL   │
│  Tailwind CSS  │          │    (Node.js / JWT)   │          │ (Public Handshake)   │
└───────┬────────┘          └──────────┬───────────┘          └──────────────────────┘
        │                              │
        │                              ├──────────────────────► ┌──────────────────────┐
        │                              │                        │  Google Gemini AI    │
        │                              ▼                        │ (Profile Diagnosis)  │
        │                   ┌──────────────────────┐            └──────────────────────┘
        └─────────────────► │    MongoDB Atlas     │
                            │ (Profile & Streaks)  │
                            └──────────────────────┘
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
[Step 4: Ingestion]  Zero-waste query pulls:
                     • submitStatsGlobal (Problems & Submissions)
                     • userCalendar (Streaks & 52-Week Submissions)
                     • badges & activeBadge (Knight, Guardian, etc.)
                     • 41 Competitive Programming Topics
                     • beatsStats & Site-wide Rankings
                            │
                            ▼
[Step 5: AI Trigger] Gemini AI automatically synthesizes a Hero Card diagnostic report
```

---

## ✨ Core Features

### 1. 🤖 AI Diagnostic Copilot (Hero Card)
- **Persona Synthesis:** Generates a high-level competitive programming persona (e.g., *"Volume-Driven Problem Solver"*, *"Analytical Architect"*) based on aggregated stats.
- **Root-Cause Bottleneck Discovery:** Pinpoints specific problem types (e.g., *Dynamic Programming represents 42% of unaccepted submissions*) revealing concept-recognition gaps rather than simple fatigue.
- **Actionable Ladder Recommendations:** Synthesizes custom tactical guidance for next steps in practice.
- **Symmetric Minimalist Modal:** Interactive dialog with glassmorphism blur backdrop, on-demand re-analysis trigger, and dedicated high-priority overlay layer (`z-[9999]`).

### 2. 🏔️ Progress Mountain & 11-Tier Gamification
- **11 Competitive Tiers:** Progression spanning Newbie (T1) &rarr; Apprentice &rarr; Problem Solver &rarr; Code Crusader &rarr; Algorithm Ace &rarr; Byte Battler &rarr; Grindmaster &rarr; Logic Warlord &rarr; Binary Overlord &rarr; DSA Demigod &rarr; LeetKing (T11).
- **Badges Displayed Inside the Bars:** Custom high-res rank badges are embedded directly inside each vertical step bar, forming an ascending staircase of achievements.
- **1.5x Taller Staircase Architecture:** Expanded bar height with mathematically uniform gaps rendered via strict CSS Grid (`grid-cols-11`).
- **Points Range & Tier Labels:** Every step clearly indicates its lower and upper points threshold beneath the mountain axis (`0 - 500`, `501 - 1k`, ..., `10k+`).
- **Climber Avatar & Hover Tooltips:** Active climber avatar perches directly on your current tier bar, with smooth non-clipping hover tooltips for previewing target milestones.

### 3. 🎯 Deep Engine Analytics & Diagnostic Matrices
- **Difficulty & Points Matrix (The "Engine" View):**
  - Interactive Donut & Pie charts (Recharts) detailing Easy vs. Medium vs. Hard distribution.
  - Efficiency Score calculation:
    $$\text{Efficiency} = \left(\frac{\text{Accepted Submissions}}{\text{Total Submissions}}\right) \times 100$$
  - Real-time LeetBuddy Points progression towards the next rank milestone.
- **Topic Mastery Breakdown (The Radar Matrix):**
  - Multi-dimensional Radar / Spider Chart mapping performance across core topic clusters (Arrays, Strings, Trees, Graphs, DP, Greedy, Math, Heap).
  - Categorical mastery indicators:
    - 🟢 **Dominant Topic:** High volume + high accuracy (e.g., Trees - 88%).
    - 🟡 **Developing Topic:** Medium volume + average accuracy (e.g., Binary Search - 60%).
    - 🔴 **Critical Weakness:** High attempt volume + low acceptance rate (e.g., DP - 28%).
- **Behavioral & Consistency Analysis (Temporal Patterns):**
  - Submission velocity metrics (attempts needed per accepted problem by difficulty).
  - Peak activity days versus high failure rate days.
  - Consistency Index tracking active streaks and monthly resilience.

### 4. 👤 Verified Profile Header & Badging
- **Verified Avatar Display:** User LeetCode avatar integrated with live verification badge.
- **Standalone Grindmaster Tier Badge:** Profile badge positioned side-by-side with the profile photo using flexbox geometry to prevent text or badge overlap.
- **Rank Credentials:** Instant overview of current tier, verification state, and LeetBuddy Points.

### 5. ☀️ High-Contrast Light & Dark Theme System
- **Pure Luminous Light Mode:** Vibrant `#ffffff` canvas with clean neutral borders, rich typography, and crisp contrast.
- **100% Dark Mode Preservation:** Strict theme isolation ensuring dark mode aesthetics remain unaffected.

### 6. 📅 12-Month Contribution Heatmap & Streaks
- **Yearly Contribution Matrix:** 12 structured clusters (Jan &rarr; Dec) with interactive tooltips and green-gradient activity intensities.
- **Real-Time Streak Tracker:** Active Streak, Total Active Days, and Yearly Submissions counter with dynamic year switching.

---

## 🏆 The 11-Tier Ranking Ladder

| Tier | Rank Title | Points Range | Accent Color | Description |
|:---:|:---|:---:|:---:|:---|
| **T1** | Newbie | 0 – 500 pts | `#94A3B8` | Taking the first steps in competitive problem solving |
| **T2** | Apprentice | 501 – 1,000 pts | `#64748B` | Building foundational syntax and loop logic |
| **T3** | Problem Solver | 1,001 – 1,800 pts | `#38BDF8` | Confident with basic arrays, strings, and hash maps |
| **T4** | Code Crusader | 1,801 – 2,800 pts | `#0EA5E9` | Mastering two-pointers, stacks, and binary search |
| **T5** | Algorithm Ace | 2,801 – 4,000 pts | `#10B981` | Tackling intermediate trees, graphs, and recursion |
| **T6** | Byte Battler | 4,001 – 5,500 pts | `#059669` | High-accuracy problem solving under contest conditions |
| **T7** | Grindmaster | 5,501 – 7,200 pts | `#F59E0B` | Elite consistency across heaps, backtracking, and greedy |
| **T8** | Logic Warlord | 7,201 – 9,000 pts | `#D97706` | Advanced dynamic programming and graph algorithms |
| **T9** | Binary Overlord | 9,001 – 11,000 pts | `#EC4899` | Mastering segment trees, tries, and complex bitmasks |
| **T10** | DSA Demigod | 11,001 – 13,500 pts | `#8B5CF6` | Top-percentile algorithmic fluency across all domains |
| **T11** | LeetKing | 13,501+ pts | `#F43F5E` | Grandmaster-tier speed, elegance, and accuracy |

$$\text{LeetBuddy Points} = (\text{Easy Solved} \times 1) + (\text{Medium Solved} \times 3) + (\text{Hard Solved} \times 5)$$

---

## 🔌 API Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| `POST` | `/api/auth/register` | Register new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | ❌ |
| `GET` | `/api/auth/refresh-token` | Refresh expired access token | ❌ |

### LeetCode Profile & AI Pipeline (`/api/leetcode`)

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| `POST` | `/api/leetcode/generate-token` | Mint a 12-char alphanumeric verification token | ✅ Bearer |
| `POST` | `/api/leetcode/verify` | Verify bio handshake, ingest stats & generate AI analysis | ✅ Bearer |
| `POST` | `/api/leetcode/hero-card` | Get existing AI hero card or trigger fresh Gemini re-analysis | ✅ Bearer |

#### Verification Request Payload:
```json
// POST /api/leetcode/generate-token
{
  "leetcodeUsername": "your_username"
}
```

#### Hero Card AI Response:
```json
{
  "success": true,
  "heroCard": {
    "persona": "Volume-Driven Problem Solver",
    "summary": "Your primary strength lies in Graph Traversal and Trees, maintaining an 82% success rate on Mediums. However, Dynamic Programming represents 42% of your total unaccepted submissions, indicating a concept-recognition bottleneck.",
    "strengths": ["Graph Traversal", "Binary Trees", "High Medium Acceptance"],
    "bottlenecks": ["Dynamic Programming (0/1 Knapsack, State Compression)"],
    "recommendation": "Focus on 3–4 classic 1D & 2D transition problems before attempting contest Hard DP.",
    "generatedAt": "2026-10-15T04:20:00.000Z"
  }
}
```

---

## 📂 Repository Structure

```text
LeetBuddy/
├── Backend/
│   ├── src/
│   │   ├── ai/                  # Gemini 2.5 Flash Lite diagnostic service
│   │   │   └── heroCard.service.js
│   │   ├── config/              # MongoDB & JWT configuration
│   │   ├── controllers/         # leetcode.controller.js & auth controllers
│   │   ├── middlewares/         # auth.middleware.js (JWT validation)
│   │   ├── models/              # user.model.js, profile-data.model.js
│   │   ├── routes/              # leetcode.routes.js, auth.routes.js
│   │   └── app.js               # Express application initialization
│   └── server.js                # Server entry point (Port 3000)
│
├── Frontend/
│   └── frontend/
│       ├── public/
│       │   └── badges/          # Tier 1 to Tier 11 badge assets
│       ├── src/
│       │   ├── components/      # ThemeToggle, Sidebar, Header
│       │   ├── components_dashboard/ # VerifyFlow, StatsView, DashHeader
│       │   ├── components_profileAnalyses/
│       │   │   ├── BadgeImage.jsx                # Responsive tier badge renderer
│       │   │   ├── ProgressMountain.jsx          # 11-Tier Mountain with inside-bar badges
│       │   │   ├── HeroCard.jsx                  # AI Gemini diagnostic hero modal
│       │   │   ├── DifficultyPointsMatrix.jsx    # Engine View: Donut & efficiency
│       │   │   ├── TopicMasteryMatrix.jsx        # Radar Matrix: 8-cluster spider chart
│       │   │   └── BehavioralConsistencyAnalysis.jsx # Temporal patterns & velocity
│       │   ├── context/         # ThemeContext (Dark/Light mode)
│       │   ├── pages/           # Dashboard.jsx
│       │   ├── utils/           # rankings.js (11 Tiers & formulas)
│       │   ├── App.jsx          # Landing page
│       │   ├── Auth.jsx         # Authentication view
│       │   └── main.jsx         # Router setup
│       ├── vite.config.js       # Vite configuration with proxy rules
│       └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later)
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
REFRESH_TOKEN_SECRET=your_refresh_secret_key
GEMINI_API_KEY=your_gemini_api_key

# Start the development server
npm run dev
```

The backend API will start on **`http://localhost:3000`**.

---

### 2. Frontend Setup

```bash
# In a new terminal, navigate to the frontend directory
cd Frontend/frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open **`http://localhost:5173`** in your browser.

> [!TIP]
> **Vite Proxy:** The frontend development server automatically proxies `/api` calls to `http://localhost:3000` and `/leetcode-proxy` to `https://leetcode.com/graphql` to avoid browser CORS restrictions.

---

## 🛡️ Security & Reliability

- **Stateless Handshake:** No LeetCode account password or cookies required.
- **Alphanumeric Sanitization:** Verification tokens use strict `[A-Za-z0-9]` encoding to prevent triggering LeetCode profile markdown/XSS sanitizers.
- **Zero-Waste Ingestion:** Profiling queries pull aggregated stats and tag problem counts in a single unified GraphQL roundtrip without fetching individual submission logs.
- **Resilient AI Pipeline:** Gemini AI summaries are gracefully cached and decoupled from primary stat rendering to ensure immediate dashboard availability.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built for intentional practice by competitive programmers, for competitive programmers.</sub>
</div>