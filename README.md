# 🚀 LeetBuddy

> **Turn raw competitive programming data into actionable, data-driven mastery.**

---

## 💡 What is LeetBuddy?

Most competitive programmers suffer from the same loop: solve random problems, feel stuck, and wonder why their rating isn't moving. **LeetBuddy** cuts through the noise. It bridges the gap between raw submission stats and actual growth by answering the ultimate questions:

> *"What am I good at, where am I weak, why am I struggling, and what should I practice next?"*

LeetBuddy isn't just another platform or AI wrapper—it follows a strict architectural philosophy: **Backend calculates facts. AI interprets facts.**

---

## 🏗️ Core Product Structure

LeetBuddy V1 is organized around a tight, high-impact three-section architecture:

```text
       [ Profile Analysis ]
                 │
                 ▼
       [ Contest Analysis ]
                 │
                 ▼
       [ Weakness Center ] ──► [ AI Insights & Targeted Practice ]

```

### 1️⃣ Profile Analysis

*Answers: "What kind of programmer am I?"*

* **Metrics & Scoring:** Tracks total problems solved (Easy, Medium, Hard), acceptance rates, and weighted **LeetBuddy Points** (Easy: 1pt, Medium: 3pts, Hard: 5pts).
* **Topic Performance:** Granular breakdown across Arrays, Dynamic Programming, Graphs, Trees, and more.
* **Activity Heatmaps:** Pinpoint your best and worst performing days.

### 2️⃣ Contest Analysis

*Answers: "What happens when I compete?"*

* **Recent Contest Breakdown:** Analyzes rank, rating changes, and problem-by-problem failure points.
* **Last 5 Contests Trend:** Identifies recurring failure patterns, conceptual blocks vs. speed issues, and consistency over time.

### 3️⃣ Weakness Center (The Core Engine)

*Answers: "Why am I weak, and what should I do about it?"*

* **General vs. Contest Weaknesses:** Separates overall historical struggles from high-pressure contest performance gaps.
* **"Why You're Struggling" Breakdown:** AI-powered diagnostic explanations that isolate exact conceptual bottlenecks (e.g., state definition vs. transitions in Dynamic Programming).
* **Focused Learning & Similar Problems:** Curated theory explanations paired with a progressive problem-solving ladder (Warm-up ➔ Concept Reinforcement ➔ Application ➔ Challenge).

---

## 🔄 The LeetBuddy Growth Loop

```text
ANALYZE ──► IDENTIFY WEAKNESS ──► EXPLAIN ──► LEARN ──► PRACTICE ──► RE-ANALYZE

```

---

## 🧰 Tech Stack

### Frontend

* **React** with **Vite**
* **Tailwind CSS** for modern styling
* **React Router** & **Recharts** for data visualization

### Backend & Database

* **Node.js** & **Express.js** REST API
* **MongoDB** & **Mongoose** (Hosted on MongoDB Atlas)
* **JWT** with HTTP-only cookies & **bcrypt** for secure auth

### Intelligence Layer

* Integrated **LLM Provider API** (Google Gemini / OpenAI) securely handled on the backend to explain diagnostic facts.

---

## 🔌 API Route Overview

| Domain | Base Route | Key Endpoints |
| --- | --- | --- |
| **Auth** | `/api/v1/auth/` | `POST /register`, `POST /login`, `GET /me` |
| **Profile** | `/api/v1/profile/` | `GET /`, `GET /stats`, `GET /topics`, `GET /insights` |
| **Contests** | `/api/v1/contests/` | `GET /`, `GET /recent`, `GET /analysis/recent` |
| **Weakness** | `/api/v1/weakness/` | `GET /`, `GET /general`, `GET /contest`, `GET /:topic/learning` |
| **AI Engine** | `/api/v1/ai/` | `POST /profile-insight`, `POST /weakness-analysis` |

---

## 🛠️ Local Setup & Getting Started

Want to spin up the backend and test it locally? Follow these quick steps:

1. **Clone the repository:**
```bash
git clone https://github.com/kanishk3114S/LeetBuddy.git
cd LeetBuddy

```


2. **Set up your Environment Variables:**
Create a `.env` file inside the `backend` directory with:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_llm_api_key

```


3. **Install Dependencies & Run Backend:**
```bash
cd backend
npm install
npm run dev

```



---

## 🎯 V1 Success Criteria

LeetBuddy V1 is designed to transform frustration into a clear roadmap:

* *Before:* "I am bad at Dynamic Programming."
* *After:* "Here is specifically what I am bad at, here is why, here is what I should learn, and here are the next 4 problems to solve."