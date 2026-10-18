<div align="center">

# ⚡ LeetBuddy

### *Production-Grade Competitive Programming Analytics, Contest Autopsy & AI Copilot Platform*

**Stop solving randomly. Start solving what you’re actually weak at.**

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-Mongoose_9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash_Lite-8E75C4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-000000?style=for-the-badge&logo=pinecone&logoColor=white)](https://www.pinecone.io/)
[![LangChain](https://img.shields.io/badge/LangChain-RAG_Pipeline-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)](https://www.langchain.com/)
[![GraphQL](https://img.shields.io/badge/LeetCode-GraphQL_API-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)

<br />

[Explore Features](#-core-features) •
[Contest Analysis & Deep Dive](#1-contest-analysis--6-engine-deep-dive-autopsy) •
[Weakness AI (RAG Architecture)](#2--weakness-ai-submission-memory-rag-engine) •
[Verification Pipeline](#-secure-leetcode-verification-pipeline) •
[Architecture](#%EF%B8%8F-system-architecture) •
[Topic Mastery](#4--topic-mastery--41-algorithmic-patterns) •
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
              │                                      │                        │  (Remediation & Hero Card)│
              │                                      │                        └───────────────────────────┘
              │                                      │
              │                                      ├──────────────────────► ┌───────────────────────────┐
              │                                      │                        │   LangChain + Pinecone    │
              │                                      │                        │ (Submission Code Memory)  │
              │                                      ▼                        └───────────────────────────┘
              │                         ┌───────────────────────────┐
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

### 1. ⌁ Contest Analysis & 6-Engine Deep Dive Autopsy

High-density, precision telemetry dashboard engineered specifically for competitive programmers who compete in LeetCode Weekly and Biweekly contests. Divided into **Executive Telemetry** and the **6-Engine Deep Dive Autopsy**.

#### Part A: Executive Contest Dashboard
- **Executive KPI Telemetry Ribbon:**
  - **Current Contest Rating:** Precise rating with color-coded latest contest delta badge (`+24` emerald / `-12` rose).
  - **Peak & Floor Rating:** All-time rating ceiling vs historical floor.
  - **Contests Attended:** Total rated events with attendance cadence.
  - **Global Rank & Top Percentile:** Real-time leaderboard placement (e.g., `#1,420 • Top 1.8%`).
  - **Official LeetCode Badge Tier:** Knight, Guardian, or Unbadged status with semantic badges.
  - **Direct Autopsy Navigation:** Instant high-contrast CTA to launch the 6-Engine Deep Dive.

- **Dual Performance Matrices (2-Column Desktop Grid):**
  - **Leaderboard Placement Matrix:** Strict 4-bracket distribution tracking:
    - **Elite (`< 1,000`):** Sub-1k leaderboard finishes.
    - **Contender (`1,000 – 5,000`):** High-tier competitive placements.
    - **Competitor (`5,001 – 10,000`):** Solid mid-pack finishes.
    - **Participant (`> 10,000`):** Field placements.
  - **Problem Solving Lethality Matrix:** Evaluates performance on standard 4-problem contest formats:
    - **4/4 All Kills:** Full clears highlighted with an emerald accent border and 4 filled micro-blocks.
    - **3/4 Strong Finish:** 3 micro-blocks filled.
    - **2/4 Standard Solve:** 2 micro-blocks filled.
    - **1/4 Single Solve:** 1 micro-block filled.
    - **0/4 Zero Solves:** Secondary footnote ensuring percentages total 100%.

- **LeetCode-Style Rating Trajectory Mountain Chart:**
  - Built with **Recharts** (`AreaChart`, `ResponsiveContainer`, `ReferenceLine`).
  - Emerald mountain line with subtle vertical linear-gradient fill.
  - Auto-scaled dynamic Y-axis with horizontal reference lines for **Knight (1850)** and **Guardian (2150)** milestones.
  - **Interactive Custom Telemetry Tooltip:** Hovering any contest reveals the contest name, full date, post-contest rating, rating delta badge, placement rank, problems solved (`3/4`), and formatted finish time (`42m 15s`).

---

#### Part B: The 6-Engine Contest Deep Dive Autopsy (`/dashboard/contest/deep-dive`)

A dedicated forensic autopsy suite analyzing the mechanics of how and why you gain or bleed contest rating:

```text
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           CONTEST DEEP DIVE AUTOPSY SUITE                                │
├─────────────────────────┬─────────────────────────┬─────────────────────────────────────┤
│ 01. Panic Tax           │ 02. Split-Time Autopsy  │ 03. Root-Cause Mistake Categorizer  │
│ Pure Solve vs +5m Bleed │ 90m Lap Pacing vs Elite │ TLE, WA, RTE & Choke Slot Detection │
├─────────────────────────┼─────────────────────────┼─────────────────────────────────────┤
│ 04. Bleeding Remediation│ 05. "Biological Clock"  │ 06. Career Contest Ledger           │
│ Gemini Pattern Blueprint│ Weekly vs Biweekly Split│ Volatility (σ), Streaks & Table     │
└─────────────────────────┴─────────────────────────┴─────────────────────────────────────┘
```

1. **Section 01: Pure Solve Time vs. Penalty Bleed ("Panic Tax")**
   - Isolates pure algorithmic thinking time from cumulative contest penalty (`+5m` per rejected submission).
   - Computes exact **Panic Tax** and Efficiency Ratio:
     $$\text{Panic Tax} = \sum (\text{penaltySubmissions} \times 5\text{m})$$
     $$\text{Pure Efficiency Ratio} = \left(\frac{\text{Pure Solve Time}}{\text{Pure Solve Time} + \text{Panic Tax}}\right) \times 100$$
   - Quantifies estimated ranks and rating points leaked due to premature, speculative submissions.

2. **Section 02: 90-Minute Split-Time Autopsy & Slow Solve Matrix**
   - Chronologically reconstructs contest progression lap-by-lap ($\Delta t$).
   - Benchmarks individual question solve speeds against elite competitive thresholds:
     - **Q1:** $\le 8\text{m}$
     - **Q2:** $\le 18\text{m}$
     - **Q3:** $\le 30\text{m}$
     - **Q4:** $\le 40\text{m}$
   - **Slow Solve Matrix:** Categorizes solves into **Clean & Fast**, **Standard Solve**, or **Slow Solve** (exceeded pacing benchmark or incurred $> 2$ penalties).

3. **Section 03: Root-Cause Mistake Categorizer & Choke Slot**
   - Forensic analysis of all failed submissions across recent contests:
     - **TLE (Time Limit Exceeded):** Missing memoization, suboptimal asymptotic complexity, infinite loops.
     - **WA (Wrong Answer):** Edge cases, off-by-one errors, 32-bit overflow, logical flaws.
     - **RTE (Runtime Error):** Null pointer dereference, vector out-of-bounds, recursion stack overflow.
     - **Slow AC:** Solutions accepted after prolonged pacing bottlenecks.
   - **Choke Slot Diagnostic:** Pinpoints the exact contest position where momentum halts (e.g., *Q3 Glass Ceiling* vs *Q4 Bottleneck*).

4. **Section 04: AI Bleeding-Question Remediation Pipeline**
   - Powered by **Google Gemini API** (`aiContestRemediation.service.js`).
   - Automatically harvests unaccepted problems and high-penalty slow solves from recent contests.
   - Synthesizes:
     - **Root-Cause Architectural Blueprint:** Core intuition and time/space complexity target.
     - **Conceptual Blind Spot:** Why traditional approaches failed under time pressure.
     - **Curated 3-Problem Practice Ladder:** Target problems specifically calibrated to patch the identified algorithmic gap.
   - **Deterministic Caching:** Stored directly inside the MongoDB `Contest` collection with an on-demand re-analysis trigger (`POST /api/v1/contests/:username/remediation?refresh=true`).

5. **Section 05: The "Biological Clock" Split (Weekly vs. Biweekly Telemetry)**
   - Unveils the circadian performance disparity common in competitive programming:
     - **Weekly Contests:** Sunday 8:00 AM IST (circadian trough, morning grogginess).
     - **Biweekly Contests:** Saturday 8:00 PM IST (peak evening alertness).
   - Side-by-side comparison displaying:
     - Win Rate (% of contests with positive rating $\Delta$).
     - Average Rating $\Delta$ & Average Leaderboard Placement.
     - Average Solves & Pure Finish Time.
   - **Automated Circadian Diagnostic:** Automatically flags circadian bleed (e.g., *"Circadian Bleed Detected: You average 36 fewer rating points on Sunday mornings compared to Saturday evenings"*).

6. **Section 06: Rating Volatility, Tilt Tracker, Next-Badge Horizon & Career Ledger**
   - **Next-Badge Horizon Bar:** Real-time distance and estimated contests required to hit **Knight (1850)** or **Guardian (2150)** milestones at current average gain, alongside global standing.
   - **Momentum & Volatility Strip:**
     - **Upward Velocity:** Percentage of career contests resulting in rating gain.
     - **Streak Telemetry:** Current positive streak vs all-time peak streak.
     - **Peak Surge vs Tilt Crash:** Highest single-contest gain vs worst drop.
     - **Standard Deviation ($\sigma$):** Classifies the user as a **Steady Climber** ($\sigma \le 30$) or **High-Variance Swinger** ($\sigma > 30$).
   - **Filterable Career Contest Ledger:** Comprehensive, high-density table of every attended contest (All, Weekly, Biweekly, Rating Gained, Rating Lost) with direct LeetCode contest links, solve counts, ranks, and rating deltas.

---

### 2. 🧠 Weakness AI: Submission-Memory RAG Engine *(Upcoming)*

A personal competitive programming AI copilot powered by **LangChain**, **Pinecone Vector Database**, and **Google Gemini**:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        WEAKNESS AI RAG ARCHITECTURAL PIPELINE                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [User Submitted Code]                                                                │
│   • Recent AC Code Submissions (C++, Java, Python, TS)                                 │
│   • Contest Failed Code (TLE, WA, RTE snapshots)                                      │
│   • Topic Failure Patterns & Submission Timestamps                                     │
│                            │                                                           │
│                            ▼                                                           │
│   [Document Preprocessor & Chunking]                                                   │
│   • Metadata Enrichment: {slug, difficulty, tags, verdict, errorCause, contestSlug}   │
│   • Syntax & Complexity Chunking                                                       │
│                            │                                                           │
│                            ▼                                                           │
│   [Embedding Generation & Pinecone Vector Store]                                       │
│   • High-Dimensional Embeddings indexed into Pinecone namespace: leetbuddy-user-<id>   │
│                            │                                                           │
│                            ▼                                                           │
│   [LangChain Retriever + Context Construction]                                         │
│   • User Prompt: "Why do I keep failing DP in contests?"                              │
│   • Semantic Vector Retrieval: Extracts user's ACTUAL past DP code & TLE submissions   │
│                            │                                                           │
│                            ▼                                                           │
│   [Gemini AI Synthesis with Grounded Memory]                                           │
│   • Diagnoses your real recurring bugs (e.g. state transition off-by-one, memory bloat)│
│   • No generic cheat sheets: 100% grounded in your own code history.                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

- **Grounded in Personal Reality:** Weakness AI does not rely on generic LeetCode tutorials. It operates directly on **your historical submitted code, error outputs, and contest attempts**.
- **Vector Search via Pinecone:** Submissions are embedded with contextual metadata (runtime, memory, language, error type, contest lap).
- **Personal Recurring-Bug Diagnosis:** Pinpoints individual coding vices (e.g., improper recursion base cases, integer overflow habits, forgetting edge cases on empty arrays).

---

### 3. 🤖 AI Diagnostic Copilot (Hero Card)
- **Persona Synthesis:** Generates a competitive programming archetype (e.g., *"Volume-Driven Problem Solver"*, *"Analytical Architect"*) based on verified stats.
- **Root-Cause Bottleneck Discovery:** Pinpoints specific problem types (e.g., *Dynamic Programming represents 42% of unaccepted submissions*) revealing concept-recognition gaps rather than simple fatigue.
- **Actionable Ladder Recommendations:** Synthesizes custom tactical guidance for next steps in practice.
- **Symmetric Minimalist Modal:** Interactive dialog with glassmorphism blur backdrop, on-demand re-analysis trigger, and high-priority overlay layer (`z-[9999]`).

---

### 4. ◈ Topic Mastery & 41 Algorithmic Patterns
- **41 Standard LeetCode Topic Classifications:** Organized across **Fundamental**, **Intermediate**, and **Advanced** categories.
- **Mastery Scoring Engine:** Combines problem volume, difficulty weights, and accuracy heuristics to compute a 0–100 mastery score per topic.
- **Tri-Tier Diagnostic Grouping:**
  - 🟢 **Mastered / Strong:** Proven fluency and high accuracy.
  - 🟡 **Developing / Intermediate:** Good exposure, needs edge-case reinforcement.
  - 🔴 **Critical Weakness:** High attempt volume with low acceptance rates under pressure.
- **Algorithmic Diagnostics:** Curated diagnostic briefs for each topic (e.g., *Dynamic Programming: Weakness in state definition and transition recognition*).

---

### 5. 🏔️ Progress Mountain & 11-Tier Gamification
- **11 Competitive Tiers:** Progression spanning Rookie (T1) &rarr; Challenger &rarr; Warrior &rarr; Grinder &rarr; Veteran &rarr; Conqueror &rarr; Grindmaster &rarr; UltimateGrindmaster &rarr; Champion &rarr; LeetKing &rarr; LeetGOAT (T11).
- **Badges Embedded in Bars:** Custom rank badges embedded directly inside vertical step bars, forming an ascending staircase.
- **Points Range & Tier Labels:** Every step clearly indicates its lower and upper points threshold beneath the mountain axis (`0 - 500`, `501 - 1k`, ..., `10k+`).
- **Climber Avatar & Hover Tooltips:** Active climber avatar perches directly on your current tier bar, with smooth non-clipping hover tooltips for previewing target milestones.

$$\text{LeetBuddy Points} = (\text{Easy Solved} \times 1) + (\text{Medium Solved} \times 3) + (\text{Hard Solved} \times 5)$$

---

### 6. 🎯 Deep Engine Analytics & Diagnostic Matrices
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

### 7. 📅 12-Month Contribution Heatmap & Streaks
- **Yearly Contribution Matrix:** 12 structured clusters (Jan &rarr; Dec) with interactive tooltips and green-gradient activity intensities.
- **Real-Time Streak Tracker:** Active Streak, Total Active Days, and Yearly Submissions counter with dynamic year switching.

---

### 8. ☀️ High-Contrast Light & Dark Theme System
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

### Contest Analysis & Deep Dive (`/api/v1/contests`)

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| `GET` | `/api/v1/contests/me` | Fetch authenticated user's contest telemetry | ✅ Bearer |
| `GET` | `/api/v1/contests/:username` | Fetch contest telemetry by LeetCode handle | ❌ |
| `POST` | `/api/v1/contests/sync` | Force fetch live contest rankings, history & deep telemetry | Optional |
| `GET` | `/api/v1/contests/:username/remediation` | Fetch cached or live Gemini AI contest remediation blueprint | ❌ |
| `POST` | `/api/v1/contests/:username/remediation` | Trigger on-demand Gemini re-analysis (`?refresh=true`) | ❌ |

---

## 📂 Repository Structure

```text
LeetBuddy/
├── Backend/
│   ├── src/
│   │   ├── Ai/                             # Gemini AI diagnostic services
│   │   │   └── heroCard.service.js         # Persona & profile weakness analysis
│   │   ├── config/                         # MongoDB & JWT configuration
│   │   │   ├── config.js
│   │   │   └── connectToDB.js
│   │   ├── controllers/                    # Business logic controllers
│   │   │   ├── auth.controller.js          # Authentication & session lifecycle
│   │   │   ├── contest.controller.js       # Contest telemetry & remediation endpoints
│   │   │   └── leetcode.controller.js      # Verification & profile sync
│   │   ├── middlewares/                    # Request middlewares
│   │   │   └── auth.middleware.js          # JWT & session verification
│   │   ├── models/                         # Mongoose schemas & indices
│   │   │   ├── contest.model.js            # Contest summary, history, deep dive & AI cache
│   │   │   ├── profile-data.model.js       # Profile stats, topics & heatmap
│   │   │   ├── session.model.js            # Device & refresh token tracking
│   │   │   └── user.model.js               # User accounts & LeetCode handshake
│   │   ├── routes/                         # Express REST API routes
│   │   │   ├── auth.routes.js              # /api/auth endpoints
│   │   │   ├── contest.routes.js           # /api/v1/contests endpoints
│   │   │   └── leetcode.routes.js          # /api/leetcode endpoints
│   │   ├── services/                       # Extraction & AI processing pipelines
│   │   │   ├── aiContestRemediation.service.js # Gemini AI contest autopsy & practice ladders
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
│       │   ├── components_contest/         # Contest Deep Dive Autopsy Components
│       │   │   ├── BleedingRemediationSection.jsx # Section 04: Gemini AI Remediation
│       │   │   ├── CareerContestLedgerSection.jsx # Section 06: Volatility, Horizon & Ledger
│       │   │   ├── CircadianSplitSection.jsx      # Section 05: Sunday AM vs Saturday PM
│       │   │   ├── DeepDiveStepperHeader.jsx      # Stepper navigation bar
│       │   │   ├── PanicTaxSection.jsx            # Section 01: Pure Solve vs Penalty Bleed
│       │   │   ├── RootCauseMistakeSection.jsx    # Section 03: TLE, WA, RTE & Choke Slot
│       │   │   ├── SplitTimeAutopsySection.jsx    # Section 02: 90m Lap Pacing & Slow Solve Matrix
│       │   │   └── UpcomingSectionsBlueprint.jsx  # Blueprint overview container
│       │   ├── components_dashboard/       # Dashboard shell components
│       │   │   ├── DashHeader.jsx          # Header with user avatar & greeting
│       │   │   ├── Sidebar.jsx             # Collapsible/pinnable navigation with Deep Dive
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
│       │   │   ├── ContestDeepDive.jsx     # Forensic 6-Engine Contest Autopsy suite
│       │   │   ├── Dashboard.jsx           # Main user overview
│       │   │   ├── ProfileAnalysis.jsx     # Profile insights & engine
│       │   │   └── TopicMastery.jsx        # Topic directory & breakdown
│       │   ├── utils/                      # Pure data formatting & algorithms
│       │   │   ├── contestDeepDiveUtils.js # Panic tax, laps, root causes, circadian & ledger
│       │   │   ├── contestUtils.js         # Contest executive telemetry & mountain data
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
- [Google Gemini API Key](https://aistudio.google.com/) (for AI Hero Card analysis & Contest Remediation)
- *(Optional for RAG Module)* [Pinecone API Key](https://www.pinecone.io/)

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
- **Clean Terminology & Ergonomics:** All analytics adhere strictly to standard competitive programming taxonomy (e.g. *Slow Solve* rather than misleading terms).
- **High-Density Aesthetic:** Zero generic AI slop. Built with clean 1px borders, tabular monospace numerals (`font-mono tabular-nums`), and a precision financial/telemetry design language.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built for intentional practice by competitive programmers, for competitive programmers.</sub>
</div>