# Product Requirements Document (PRD)

## LeetBuddy

### Version 1.1.0

### Product Type

Personalized Competitive Programming Analytics & Learning Platform

---

# 1. Product Overview

**Product Name:** LeetBuddy

**Version:** 1.1.0

**Product Type:** Web application for competitive programming analysis, contest performance analysis, targeted weak-topic practice, and personalized RAG-powered weakness diagnostics.

LeetBuddy is a web application that analyzes a user's competitive programming activity and converts raw problem-solving data into actionable, data-driven mastery.

The product page and architectural flow follows:

1. **Dashboard & Verification** `[COMPLETED]` — Secure LeetCode handshake, 12-month heatmap, streak metrics, badges, and live sync.
2. **Profile Analysis** `[COMPLETED]` — AI Hero Card, 11-Tier Progress Mountain, Difficulty Matrix, Radar Matrix, and Temporal Behavioral Analysis.
3. **Practice Weak Topics** `[UPCOMING]` — Topic-targeted problem ladders based directly on detected weaknesses.
4. **Contest Analysis** `[PHASE 1 IMPLEMENTED / PHASE 2 IN PROGRESS]` — Executive telemetry, career distribution & lethality matrices, rating mountain, and 5-contest failure diagnostic engine.
5. **Weakness AI [RAG-Based System]** `[UPCOMING]` — Retrieval-Augmented Generation system diagnosing root-cause bottlenecks and providing grounded theory & conceptual remediation.

LeetBuddy does not aim to be another competitive programming platform. Its purpose is to answer:

> **"What am I good at, where am I weak, why am I struggling, and what should I practice next?"**

The core design philosophy is:
> **The backend calculates objective facts. The RAG AI interprets those facts with canonical DSA theory.**

---

# 2. Product Goals

### 2.1 Primary Goals

* Give users an immediate, deep understanding of their competitive programming profile and gamified ranking.
* Direct users from diagnosed weaknesses straight into structured, targeted problem practice.
* Analyze recent contest performance and identify recurring mistakes under contest pressure.
* Identify general and contest-specific weak topics with mathematical accuracy.
* Explain **why** a user is struggling with a topic using a **RAG-based AI system** that retrieves grounded theory.
* Provide focused conceptual remediation without LLM hallucinations.
* Recommend laddered practice problems to bridge the gap from Medium to Hard.
* Create a continuous feedback loop where future performance can be compared against previous weaknesses.

### 2.2 Secondary Goals

* Make competitive programming progress rewarding, visual, and gamified.
* Eliminate random, unfocused problem solving.
* Help users focus their preparation on measurable, high-impact bottlenecks.
* Demonstrate production-grade application of RAG (Retrieval-Augmented Generation) in an ed-tech tool.

### 2.3 Non-Goals for V1

The first version will **not** attempt to:

* Build a complete LeetCode replacement.
* Host or execute code submissions in-browser.
* Train a custom LLM foundation model from scratch.
* Build a general-purpose conversational chatbot.
* Implement complex social networks or multiplayer contests.
* Automatically write full problem solutions for users.

---

# 3. Target Users

### Competitive Programmers
Users who regularly solve problems on platforms like LeetCode and want objective insights into their accuracy, topic strengths, and submission velocity.

### Contest Participants
Users who compete in weekly/biweekly contests and want to diagnose why their contest rating stagnates or drops under time pressure.

### Interview Preparation Candidates
Engineers preparing for top-tier technical interviews who need data-driven topic recommendations rather than blindly grinding random lists.

---

# 4. Core Product Structure & Page Flow

LeetBuddy is structured into a streamlined, high-impact progression:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LEETBUDDY FLOW                                 │
├──────────────────────┬──────────────────────┬───────────────────────────────┤
│ 1. Dashboard         │ 2. Profile Analysis  │ 3. Practice Weak Topics       │
│    (Verified Sync)   │    (Gamified Engine) │    (Targeted Problem Ladders) │
│    [COMPLETED ✅]    │    [COMPLETED ✅]    │    [NEXT IN FLOW ⏳]          │
├──────────────────────┴──────────────────────┼───────────────────────────────┤
│ 4. Contest Analysis                         │ 5. Weakness AI (RAG System)   │
│    (5-Contest Pressure Breakdown)           │    (Grounded Concept Diagnosis)│
│    [UPCOMING ⏳]                            │    [UPCOMING ⏳]              │
└─────────────────────────────────────────────┴───────────────────────────────┘
```

---

## 4.1 Dashboard `[COMPLETED ✅]`

Answers:
> **"Where do I stand right now, and is my data synced?"**

### Implemented Features
* **Zero-Waste Bio Handshake:** Secure verification via unguessable 12-char alphanumeric token placed in LeetCode "About Me".
* **Optimized Live Refresh Button:** Real-time sync calling LeetCode GraphQL with a 12s anti-spam cooldown, spinning feedback, relative timestamp (`Just now`, `2m ago`), and dual backend/proxy fallback.
* **Top Header Profile & Standalone Rank Badge:** Flexbox profile layout displaying user avatar, verification badge, and standalone Grindmaster / Tier rank badge with zero overlapping.
* **LeetBuddy Points Badge:** Formulaic weighted score:
  $$\text{Points} = (\text{Easy} \times 1) + (\text{Medium} \times 3) + (\text{Hard} \times 5)$$
* **12-Month Contribution Heatmap:** 12 structured month clusters (Jan &rarr; Dec) with green activity intensities, active streak counter, and multi-year selector.
* **Badges Showcase:** Visual display of official LeetCode badges (Knight, Guardian, Annual Challenges).

---

## 4.2 Profile Analysis `[COMPLETED ✅]`

Answers:
> **"What kind of programmer am I, and where are my structural bottlenecks?"**

### Implemented Features
* **AI Hero Card (Gemini 2.5 Flash Lite):**
  - Generates executive developer persona (e.g., *"Volume-Driven Problem Solver"*).
  - Identifies root-cause bottlenecks (e.g., *"Dynamic Programming represents 42% of unaccepted submissions"*).
  - High z-index modal (`z-[9999]`) with backdrop blur, symmetric minimalist actions, on-demand re-analysis, and heuristic fallback.
* **Progress Mountain & 11-Tier Gamification:**
  - 11 Competitive Tiers: Newbie (T1) &rarr; Apprentice &rarr; Problem Solver &rarr; Code Crusader &rarr; Algorithm Ace &rarr; Byte Battler &rarr; Grindmaster &rarr; Logic Warlord &rarr; Binary Overlord &rarr; DSA Demigod &rarr; LeetKing (T11).
  - **Badges Inside the Bars:** Custom high-res rank badges embedded inside each vertical stair bar.
  - **1.5x Taller Staircase Architecture:** Uniform bar widths with mathematically equal gaps via CSS Grid (`grid-cols-11`).
  - **Points Range Labels:** Explicit ranges rendered under the mountain axis (`0 - 500`, `501 - 1k`, ..., `10k+`).
  - **Climber Avatar:** Active rank indicator standing directly on top of the user's current tier bar.
* **Difficulty & Points Matrix (The "Engine" View):**
  - Recharts Donut & Pie charts showing Easy vs. Medium vs. Hard distribution.
  - Live Efficiency Score:
    $$\text{Efficiency} = \left(\frac{\text{Accepted Submissions}}{\text{Total Submissions}}\right) \times 100$$
  - Real-time point progression towards the next rank milestone.
* **Topic Mastery Breakdown (The "Radar Matrix"):**
  - Recharts 8-cluster Radar / Spider Chart mapping performance across *Arrays, Strings, Trees, Graphs, DP, Greedy, Math, Heap*.
  - Categorical mastery indicators:
    - 🟢 **Dominant Topic:** High volume + high accuracy (e.g., Trees – 88%).
    - 🟡 **Developing Topic:** Moderate volume + average accuracy (e.g., Binary Search – 60%).
    - 🔴 **Critical Weakness:** High volume + low acceptance rate (e.g., DP – 28%).
* **Behavioral & Consistency Analysis (Temporal Patterns):**
  - Recharts Day-of-the-Week Bar Chart identifying peak productivity days vs. high-failure-rate days.
  - Submission Velocity metrics (average attempts required per accepted solve by difficulty).
  - Consistency Index tracking active streaks against monthly resilience.
* **High-Contrast Theme System:** Pure luminous `#ffffff` light mode with complete isolation from sleek dark mode.

---

## 4.3 Practice Weak Topics `[NEXT IN FLOW ⏳]`

Answers:
> **"What specific ladder of problems should I solve right now to overcome my detected weaknesses?"**

Directly connects the diagnostic findings from Profile Analysis (the 🔴 Critical Weakness tags from the Radar Matrix) into structured, progressive problem ladders.

### Features
* **Weakness-to-Practice Routing:** Automatically populates practice queues with topics identified as critical weaknesses (e.g., Dynamic Programming, Graph Traversal).
* **4-Stage Problem Ladder Progression:**
  1. **Warm-up:** Foundational pattern recognition problem (Easy / low Medium).
  2. **Concept Reinforcement:** Core template application problem (Standard Medium).
  3. **Medium Application:** Edge-case heavy problem requiring state optimization.
  4. **Advanced Challenge:** Hard-tier problem testing full problem decomposition.
* **Problem Metadata Cards:** Title, difficulty pill, estimated completion time, relevant concept tag, and direct LeetCode link.
* **Mastery Progress Tracker:** Live progress meter tracking solved problems in the active practice queue, feeding directly back into the user's Topic Mastery score.

---

## 4.4 Contest Analysis & Time-Pressure Telemetry

**Core Diagnostic Question:**
*"What happens to my algorithmic fluency when competing under strict 90-minute time pressure, and where exactly am I bleeding rating points?"*

Focuses on competitive programming contests where speed, penalty minutes, and first-attempt accuracy determine rating.

### 4.4.1 Recent Contest Analysis
* **Metrics:** Contest title, rank, rating delta ($\Delta$), problems attempted, problems solved, and total penalty submissions.
* **Problem-by-Problem Breakdown:** Performance timeline across Q1, Q2, Q3, Q4.
* **Failure Classification:** Categorizes unaccepted submissions into:
  - *Time Limit Exceeded (TLE)* &rarr; Sub-optimal algorithmic complexity.
  - *Wrong Answer (WA)* &rarr; Overlooked edge cases or integer overflow.
  - *Runtime Error (RTE)* &rarr; Out-of-bounds indexing or null pointer exceptions.

### 4.4.5 AI Contest Copilot: Pressure Bottlenecks & Remediation (Lower Deck — Phase 2)
Real-time diagnostic engine powered by Google Gemini (`@google/genai`, `gemini-3.5-flash-lite` / `gemini-3.8-flash`) with strict JSON schema output and zero dummy fallbacks:
- **5-Contest Rolling Velocity & Recurring Failure Patterns:** Detects systemic choke points across the last 5 contests (e.g., *"Stalled on Q3 in 4 of last 5 contests due to TLE"* or *"Averaging 2.4 WA penalties on Q2 greedy/array problems"*).
- **Contest Panic vs. Practice Weakness Triage:** Cross-references the user's untimed `Topic Mastery` stats against `recentFiveContestsDeepDive` to separate:
  - **True Algorithmic Knowledge Gaps:** Topics where both untimed practice accuracy is `< 40%` and contest attempts fail.
  - **Time-Pressure / Execution Panic:** Topics where the user is `Proficient` (`>= 70%` accuracy) in untimed practice but suffers `WA`/`TLE` or fails to convert within the 90-minute contest window.
- **Tactical Post-Contest Action Plan:** Generates 3 concrete, data-backed directives for the next contest (pacing targets per question slot, penalty-stop rules before submitting unverified edge cases, and specific Q3/Q4 archetype drills).

---

### 4.4.6 Technical Architecture & Data Pipeline Spec
- **Database Model (`backend/models/contest.model.js`):** Dedicated Mongoose schema indexed by `userId` and `leetcodeUsername`, storing `summary`, full chronological `contestHistory`, `recentFiveContestsDeepDive` (with embedded `questions` and `errorCause` telemetry), and cached `aiContestAnalysis`.
- **Parallel GraphQL Extraction (`backend/services/leetcodeContest.service.js`):** Executes `userContestRanking`, `userContestRankingHistory` (filtered strictly for `attended === true`), and timestamp-correlated `recentSubmissionList` queries concurrently alongside profile verification/sync via `Promise.allSettled`.
- **Frontend State & Normalization (`frontend/src/utils/contestUtils.js`):** Pure transformation layer computing rank matrices, solve lethality ratios, mountain chart series, and 5-contest penalty aggregations, synchronized across views via the `lb_contest_updated` browser event.

---

## 4.5 Weakness AI [RAG-Based System] `[UPCOMING ⏳]`

Answers:
> **"Why am I failing these specific concepts, and what is the grounded theory I must master?"**

Unlike standard LLM prompts that guess or hallucinate generic advice, the **Weakness AI is powered by a Retrieval-Augmented Generation (RAG) architecture**.

### 4.5.1 The RAG Architecture
```text
┌───────────────────────────┐      ┌───────────────────────────┐
│ User Performance Evidence │      │  Canonical DSA Knowledge  │
│ • Failed contest topics   │      │  • State transition rules │
│ • 42% DP unaccepted rate  │      │  • Graph cycle templates  │
│ • Specific problem tags   │      │  • Monotonic stack invariants│
└─────────────┬─────────────┘      └─────────────┬─────────────┘
              │                                  │
              └───────────────┬──────────────────┘
                              ▼
               ┌───────────────────────────────┐
               │ RAG Retrieval Engine          │
               │ (Embeddings & Semantic Search)│
               └──────────────┬────────────────┘
                              │
                              ▼ Relevant Theory Chunks
               ┌───────────────────────────────┐
               │ Google Gemini AI Synthesizer  │
               │ (Grounded In-Context Prompt)  │
               └──────────────┬────────────────┘
                              ▼
               ┌───────────────────────────────┐
               │ Structured "Why Struggling"   │
               │ + Concept Remediation Cards   │
               └───────────────────────────────┘
```

### 4.5.2 "Why You're Struggling" Diagnostic Engine
For each detected weakness, the RAG system retrieves targeted concept chunks and synthesizes an evidence-based diagnosis:
* **State Definition Breakdown:** Pinpoints whether the user fails to define $dp[i]$ or $dp[i][j]$ state semantics.
* **Transition Logic Diagnosis:** Explains why greedy or brute-force approaches fail on the identified problem class.
* **Recognition Bottlenecks:** Clarifies how to spot problem triggers in problem statements.

### 4.5.3 Focused Theory & Missed Concept Learning
* Concise, grounded theoretical explanations retrieved directly from canonical DSA knowledge bases.
* Code templates, invariant checklists, and common trap patterns.
* Distinguishes between broad topic weakness (e.g., *Dynamic Programming*) versus specific sub-concept weakness (e.g., *0/1 Knapsack State Compression*).

---

# 5. AI Responsibilities & Architecture

LeetBuddy strictly adheres to:
> **Backend calculates facts. RAG retrieves grounded theory. AI interprets and teaches.**

### Profile Analysis (Gemini 2.5 Flash Lite)
* Synthesizes high-level persona and executive summary.
* Highlights primary strengths and primary conceptual bottlenecks.
* Multi-model fallback waterfall with heuristic rule engine guarantee.

### Weakness AI [RAG-Based System]
* Ingests user failure signals (submission velocity, unaccepted tags, contest drops).
* Queries vector/document store for canonical DSA theory chunks.
* Synthesizes structured "Why You're Struggling" breakdowns.
* Generates concept-specific remediation without generic advice.

### What AI NEVER Does
* AI never counts total submissions, acceptance rate, or beats percentiles.
* AI never invents user performance metrics.
* Core statistics always originate from application logic and MongoDB.

---

# 6. Technical Specifications

### Frontend
* **Core:** React 18, Vite, React Router 7.
* **Styling:** Tailwind CSS v4, pure `#ffffff` light mode and dark mode theme tokens.
* **Data Visualization:** Recharts (Donut/Pie charts, 8-cluster RadarChart, Day-of-Week BarChart), CSS Grid/Flex for 52-week heatmaps and 11-Tier Mountain stairs.
* **Icons:** `lucide-react`.

### Backend
* **Runtime:** Node.js (v20+), Express.js (v5.x), ES Modules.
* **Database:** MongoDB Atlas, Mongoose ODM.
* **Authentication:** JWT (JSON Web Tokens), HTTP-only cookies, password hashing with bcrypt.
* **External Integration:** LeetCode GraphQL public endpoint (zero-waste query architecture).

### AI & RAG Infrastructure
* **LLM:** Google Gemini 2.5 Flash Lite (`@google/genai` SDK) with structured JSON schema output mode (`responseMimeType: "application/json"`).
* **RAG Knowledge Store:** Curated markdown knowledge base of canonical DSA concepts, patterns, invariants, and templates.
* **Embedding & Retrieval Pipeline:** Semantic document chunking and vector similarity matching for concept retrieval.

---

# 7. Updated V1 Development Phases

```text
PHASE 1: Foundation & Verified Dashboard       [COMPLETED ✅]
PHASE 2: Profile Analysis & AI Hero Card       [COMPLETED ✅]
PHASE 3: Practice Weak Topics                  [IN QUEUE ⏳]
PHASE 4: Contest Analysis                      [UPPER DECK COMPLETE ✅ / LOWER DECK IN PROGRESS 🚀]
PHASE 5: Weakness AI [RAG-Based System]        [IN QUEUE ⏳]
PHASE 6: Similar Problems & Recommendation     [PLANNED]
PHASE 7: Polish, Integration & Deployment      [PLANNED]
```

### Phase 1: Foundation & Verified Dashboard `[COMPLETED ✅]`
* Express backend with JWT auth, MongoDB Atlas connection, and session handling.
* Zero-waste LeetCode verification handshake via `aboutMe` token match.
* Full Dashboard with 12-Month Contribution Heatmap (Jan &rarr; Dec), active streaks, active days, badge showcase.
* **Live Sync / Refresh Button:** Embedded to the left of LeetBuddy points with 12s anti-spam cooldown, spinning feedback, and dual backend/proxy fallback.
* Luminous `#ffffff` light mode and dark mode separation.

### Phase 2: Profile Analysis & AI Hero Card `[COMPLETED ✅]`
* **AI Hero Card:** Gemini 2.5 Flash Lite persona synthesis, strengths, bottleneck diagnosis, and modal with z-[9999] overlay.
* **Progress Mountain:** 11-Tier gamified staircase (Newbie to LeetKing), badges embedded inside bars, 1.5x taller bars, uniform CSS Grid spacing, points range labels (`0 - 500` to `10k+`), climber avatar.
* **Difficulty & Points Matrix:** Recharts Donut charts, live Efficiency Score, distance to next tier milestone.
* **Topic Mastery Radar Matrix:** 8-cluster RadarChart with 🟢 Dominant, 🟡 Developing, 🔴 Critical Weakness categorization tags.
* **Behavioral & Consistency Analysis:** Weekday velocity vs failure bar chart, 52-week heatmap, consistency index.

### Phase 3: Practice Weak Topics `[IN QUEUE ⏳]`
* **Weakness-to-Practice Pipeline:** Automatically routes detected weak topics from Profile Analysis into practice queues.
* **4-Stage Practice Ladders:** Warm-up &rarr; Concept Reinforcement &rarr; Medium Application &rarr; Advanced Challenge.
* **Problem Cards & Metadata:** Difficulty, estimated solve time, relevant concept tag, direct problem link.
* **Practice Queue Progress Tracker:** Real-time completion tracker updating Topic Mastery scores.

### Phase 4: Contest Analysis `[UPPER DECK COMPLETE ✅ / LOWER DECK IN PROGRESS 🚀]`
* **Upper Deck (Completed):**
  - High-density Executive Contest Telemetry Ribbon (Rating, Peak, Low, Contests, Rank, Top %, Badge).
  - Career Distribution Matrix (Elite, Contender, Competitor, Participant) & Solve Lethality Matrix (All Kills 4/4 to 1/4).
  - Interactive Rating Mountain Trajectory Chart with Recharts area curves, gradient fills, and custom tooltips.
* **Lower Deck (Phase 2 - Current Focus):**
  - Last 5 Contests Deep Dive card & row telemetry (Rank, Finish Time, Penalty additions).
  - Q1–Q4 Problem-by-Problem timeline with status (`Accepted`, `Failed Attempt`, `Not Attempted`), fail count, and submission metadata.
  - Failure Root-Cause Classification Engine (`TLE`, `WA`, `RTE`, `MLE`/`CE`).
  - AI Contest Copilot powered by Google Gemini (5-contest velocity, pressure vs practice triage, tactical action plan).

### Phase 5: Weakness AI [RAG-Based System] `[UPCOMING ⏳]`
* **RAG Knowledge Base:** Curation of structured DSA concepts, state transition formulas, and algorithmic invariant templates.
* **Retrieval Pipeline:** Semantic retrieval matching user failure logs with exact theoretical concepts without hallucination.
* **"Why You're Struggling" Engine:** Grounded breakdown of state definition, transition, and problem recognition errors.
* **Focused Concept Remediation:** Tailored mini-lessons and action directives grounded in retrieved theory.

### Phase 6: Similar Problems & Intelligent Recommendation `[PLANNED]`
* Difficulty-adaptive problem recommendations matching user's diagnosed RAG weakness.
* Problem cross-referencing across LeetCode, Codeforces, and GeeksforGeeks.
* Progression ladders validating conceptual improvement.

### Phase 7: Polish, Integration & Deployment `[PLANNED]`
* Full cross-page data flow testing (Dashboard &rarr; Profile &rarr; Practice &rarr; Contest &rarr; Weakness RAG).
* API rate-limiting, error boundaries, and performance optimization.
* Production deployment on cloud infrastructure (Vercel / Render / Atlas).
* Comprehensive documentation and interview showcase guide.

---

# 8. User Flow

```text
First-Time User:
Register ──► Bio Token Handshake ──► Data Ingestion ──► Dashboard ──► Profile Analysis

Returning User Core Loop:
Dashboard (Live Sync)
      │
      ▼
Profile Analysis (Diagnose Strengths & 🔴 Critical Weaknesses)
      │
      ▼
Practice Weak Topics (4-Stage Targeted Problem Ladders)
      │
      ▼
Contest Analysis (Evaluate Performance Under Time Pressure)
      │
      ▼
Weakness AI [RAG-Based System] (Grounded "Why You're Struggling" & Concept Remediation)
      │
      ▼
Re-analyze & Track Tier Progression on Progress Mountain
```

---

# 9. Success Criteria

LeetBuddy will be considered successful when a competitive programmer can:

1. Connect their LeetCode profile securely in under 30 seconds.
2. View an objective, gamified profile analysis with AI persona and 11-tier mountain progression.
3. Refresh their live LeetCode stats on-demand with a single click.
4. Immediately transition from identified weaknesses into a **4-stage practice problem ladder**.
5. Analyze recent contest performance to detect time-pressure failure patterns.
6. Receive an evidence-based, **RAG-grounded explanation** of *why* they struggle on specific concepts (e.g. 2D DP state transitions).
7. Complete targeted practice and visually observe their tier climb up the Progress Mountain.

> **Ultimate Product Success Test:**
> Can LeetBuddy transform a vague complaint like *"I suck at Dynamic Programming"* into a precise diagnostic action:
> *"Here is your exact bottleneck: State Transition in Multi-Dimensional DP (42% failure rate). Here is the retrieved concept theory, and here is your 4-problem practice ladder to solve it."*
