import express from "express"
import cors from "cors"
import morgan from "morgan" //morgan is a logger which tells which api is hit by whic user on which time like basically tells us the comepltely logging system//
import { authRouter } from "./routes/auth.routes.js"
import { leetcodeRouter } from "./routes/leetcode.routes.js"
import cookieParser from "cookie-parser"
import { verifyAccessToken } from "./middlewares/auth.middleware.js"

import { contestRouter } from "./routes/contest.routes.js"
import { weaknessRouter } from "./routes/weakness.routes.js"

export const app = express()

// CORS configuration (supports Vercel proxy and direct cross-origin calls)
app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : true,
  credentials: true
}))

app.use(cookieParser())

//middlewares//

app.use(express.json()) //converts the json file to req.body so that the backend system also get access//
app.use(morgan('dev'))

// ── Zero-Overhead Keep-Alive & Health Check Routes (Render / cron-job.org / Keep-Alive) ──
// Matches root '/', '/health', and '/api/health' for GET, HEAD, POST, OPTIONS
// Bypasses all auth/database middleware, responds in <1ms with 2 bytes plain text
app.all(["/", "/health", "/api/health"], (req, res) => {
  res.status(200).type("text/plain").send("OK");
});

// General verification middleware: runs before any request reaches the backend route handlers
app.use(verifyAccessToken)

app.use("/api/auth", authRouter)
app.use("/api/leetcode", leetcodeRouter)
app.use("/api/v1/leetcode", leetcodeRouter)
app.use("/api/v1/contests", contestRouter)
app.use("/api/contests", contestRouter)
app.use("/api/v1/weakness", weaknessRouter)
app.use("/api/weakness", weaknessRouter)

