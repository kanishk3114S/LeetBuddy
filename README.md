<div align="center">

# ⚡ LeetBuddy

### *Stop solving randomly. Start solving what you’re actually weak at.*

**A competitive programming analytics platform and AI coaching copilot that diagnoses your contest bottlenecks, calculates your penalty overhead, and prescribes targeted practice ladders.**

[![Live Demo](https://img.shields.io/badge/Live_App-leet--buddy--six.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://leet-buddy-six.vercel.app/)
[![API Status](https://img.shields.io/badge/API_Status-Online-emerald?style=for-the-badge&logo=render&logoColor=white)](https://leetbuddy-fr3s.onrender.com/api/health)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br />

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75C4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Pinecone](https://img.shields.io/badge/Pinecone-Vector_DB-000000?style=flat-square&logo=pinecone&logoColor=white)](https://www.pinecone.io/)
[![LangChain](https://img.shields.io/badge/LangChain-RAG-1C3C3C?style=flat-square&logo=langchain&logoColor=white)](https://www.langchain.com/)

</div>

---

## 🎯 The Problem

Most competitive programmers practice in an inefficient loop:
> *Pick random problem ➔ Get stuck ➔ Read solution ➔ Forget the pattern ➔ Contest rating stays flat.*

Standard platforms show your contest rating number, but never answer the questions that actually matter:
- **Why did my rating drop in the last contest?**
- **How many ranks did I lose because of rushed, penalty submissions?**
- **Which specific topic (e.g. 2D DP state transitions, Graph cycle detection) is my real choke point?**
- **What exact sequence of 3–4 problems should I practice today to fix it?**

**LeetBuddy** connects to your verified LeetCode profile, parses your contest submission telemetry, and provides actionable diagnostics paired with an AI coach that knows your real performance history.

---

## ✨ Core Features

### 1. ⏱️ Contest Diagnostics & Panic Tax
- **90-Minute Split-Time Autopsy:** Breaks down the exact minutes spent on Question 1 through Question 4 in your recent contests.
- **Penalty Analysis (*Panic Tax*):** In rated contests, every wrong answer adds a strict +5m penalty. LeetBuddy computes your cumulative penalty time across contests to show exactly how many leaderboard ranks you lose to unverified submissions.
- **Circadian Performance Split:** Compares your solve rate and rating delta between Saturday evening Biweekly Contests and Sunday morning Weekly Contests to reveal fatigue and timing trends.
- **Historical Career Ledger:** Interactive filterable ledger tracking rank shifts, finish times, and difficulty distribution over time.

### 2. 🧠 Weakness AI (Context-Aware Coaching)
- **Personalized Copilot:** Unlike generic chatbots that give textbook answers, LeetBuddy uses Retrieval-Augmented Generation (RAG) powered by LangChain, Gemini API, and Pinecone vector database.
- **Zero Hallucinated Stats:** The assistant references your verified contest failures, solved counts, and topic accuracy to prescribe customized problem ladders.
- **Tactical Quick Probes:** One-click diagnostics for rating autopsies, choke-point remediation, and 3-week milestone roadmaps.

### 3. ◈ Topic Mastery Matrix
- **41-Topic Competency Radar:** Evaluates your profile across 41 competitive programming categories using difficulty distribution and timed contest performance.
- **Triage Classification:** Automatically groups topics into **Proficient Strengths** ($\ge 70\%$), **Developing Areas** ($40\% - 69\%$), and **Weak Gaps** ($< 40\%$).
- **Direct Practice Filtering:** Click any topic to see your accuracy, volume, and recommended problems.

### 4. 🔒 Zero-Password Verification
- Connect your LeetCode account without ever sharing your password or session cookie.
- Generates a unique, temporary 12-character verification token pasted into your public LeetCode *About Me* bio for a cryptographically safe handshake.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, Recharts, Framer Motion |
| **Backend** | Node.js, Express 5, Morgan, Cookie-Parser, CORS |
| **AI & Vector DB** | Google Gemini 2.5 Flash, LangChain, Pinecone Vector Database (768-dim embeddings) |
| **Database** | MongoDB Atlas with Mongoose ODM (Compound indexed for sub-50ms queries) |
| **Authentication** | Dual JWT access tokens + HTTP-only refresh cookies with SHA-256 session rotation |
| **Deployment** | Vercel Edge CDN (Frontend + API Proxy) + Render Web Service (Backend) + Uptime Heartbeat |

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas URI)
- **Gemini API Key** ([Google AI Studio](https://aistudio.google.com/))
- **Pinecone API Key** ([Pinecone Console](https://www.pinecone.io/))

---

### 1. Clone the Repository
```bash
git clone https://github.com/kanishk3114S/LeetBuddy.git
cd LeetBuddy
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=leetbuddy-memory
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```
Backend will run at `http://localhost:3000`. Test the health route at `http://localhost:3000/api/health`.

---

### 3. Frontend Setup
In a new terminal window:
```bash
cd Frontend/frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🌐 Production Architecture

```
[User Browser]
      │
      ▼
[Vercel Edge CDN] (React 19 + Vite Frontend — 0ms Cold Start)
      │
      │  /api/* (Reverse Proxy via vercel.json)
      ▼
[Render Web Service] (Node.js / Express API)
      ├── 14-min Keep-Alive Heartbeat (cron-job.org)
      ├── LeetCode GraphQL Ingestion Pipeline
      ├── MongoDB Atlas (User profiles & contest cache)
      └── Pinecone + Gemini 2.5 (RAG submission memory)
```

- **Zero Cold-Starts:** An external 14-minute cron ping to `/api/health` keeps the Render free-tier container active 24/7.
- **First-Party Cookies:** Vercel reverse-proxies `/api` routes directly to Render, preventing cross-origin cookie blocking across Safari, Brave, and iOS WebKit.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <sub>Built with intention for competitive programmers who want to stop grinding randomly.</sub>
</div>