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
[![GraphQL](https://img.shields.io/badge/LeetCode-GraphQL_API-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)

<br />

[Explore Features](#-core-features) •
[Verification Pipeline](#-secure-leetcode-verification-pipeline) •
[Architecture](#-system-architecture) •
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
└────────────────┘          └──────────┬───────────┘          └──────────────────────┘
                                       │
                                       ▼
                            ┌──────────────────────┐
                            │    MongoDB Atlas     │
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
```

---

## ✨ Core Features

### 1. 📊 Real-Time Analytics & Solved Problems Donut
- **Accurate Difficulty Breakdown:** Total problems solved across Easy, Medium, and Hard, paired with official LeetCode site-wide completion totals.
- **Percentile Benchmarking:** Live `Beats X%` badges showing where you stand against the global competitive programming community.
- **Weighted LeetBuddy Score:**
  $$\text{Score} = (\text{Easy} \times 1) + (\text{Medium} \times 3) + (\text{Hard} \times 5)$$

### 2. 📅 12-Month Contribution Heatmap & Streaks
- **Activity & Streak Bar:** Real-time **Active Streak**, **Total Active Days**, and **Yearly Submissions** counter.
- **Year Dropdown Filter:** Switch between active years dynamically.
- **Visual Month Blocks:** 12 structured clusters (Jan &rarr; Dec) with interactive tooltips and green-gradient activity intensities.

### 3. 🏅 Badges Showcase
- Displays all earned LeetCode badges (Knight, Guardian, 50/100/200 Days, Annual Challenges) with official SVG/PNG icons.
- Highlights your **Most Recent Badge** directly on the dashboard.

### 4. 🧠 41-Topic Performance Engine
- Comprehensive coverage spanning 41 competitive programming topics across 3 difficulty tiers:
  - **Fundamental:** Array, String, Sorting, Two Pointers, Stack, Queue, Linked List, Matrix, Simulation...
  - **Intermediate:** Hash Table, Tree, Binary Search, Graph Theory, BFS/DFS, Greedy, Sliding Window, Heap...
  - **Advanced:** Dynamic Programming, Backtracking, Trie, Segment Tree, Monotonic Stack, Bitmask, Game Theory...

### 5. 🗂️ Premium Animated Sidebar
- **Collapsed Mode (68px):** Minimalist icon rail with floating tooltips and glowing active indicators.
- **Hover-Expanded Mode (240px):** Smooth cubic-bezier spring expansion with branding, section navigation, and an optional pin (`📌`) lock toggle.
- **Dark & Light Mode:** Seamless semantic tokens with instantaneous theme switching.

---

## 🔌 API Reference

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| `POST` | `/api/auth/register` | Register new user account | ❌ |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | ❌ |
| `GET` | `/api/auth/refresh-token`| Refresh expired access token | ❌ |

### LeetCode Profile Pipeline (`/api/leetcode`)

| Method | Endpoint | Description | Auth Required |
|:---:|:---|:---|:---:|
| `POST` | `/api/leetcode/generate-token` | Mint a 12-char alphanumeric verification token | ✅ Bearer |
| `POST` | `/api/leetcode/verify` | Verify bio handshake, ingest stats & upsert to DB | ✅ Bearer |

#### Verification Request Payload:
```json
// POST /api/leetcode/generate-token
{
  "leetcodeUsername": "your_username"
}
```

#### Verification Response:
```json
{
  "message": "LeetCode profile verified and data synced successfully!",
  "username": "your_username",
  "profile": {
    "stats": {
      "totalSolved": 583,
      "easySolved": 174,
      "mediumSolved": 324,
      "hardSolved": 85,
      "acceptanceRate": 72.1,
      "leetBuddyPoints": 1571
    },
    "activity": {
      "currentStreak": 219,
      "totalActiveDays": 239
    },
    "activeBadge": { "name": "Knight" },
    "badges": [...]
  }
}
```

---

## 📂 Repository Structure

```text
LeetBuddy/
├── Backend/
│   ├── src/
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
│       ├── src/
│       │   ├── components/      # ThemeToggle, Sidebar, Header
│       │   ├── components_dashboard/ # VerifyFlow, StatsView, Sidebar
│       │   ├── context/         # ThemeContext (Dark/Light mode)
│       │   ├── pages/           # Dashboard.jsx
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

---

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd Backend

# Install dependencies
npm install

# Create environment configuration
# Create a .env file with the following variables:
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/leetbuddy
JWT_SECRET=your_super_secret_jwt_key
REFRESH_TOKEN_SECRET=your_refresh_secret_key

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

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built for intentional practice by competitive programmers, for competitive programmers.</sub>
</div>