import { Router } from "express";
import { generateVerificationToken, verifyLeetCode, getOrGenerateHeroCard, refreshLeetCodeStats, getMyProfile } from "../controllers/leetcode.controller.js";

export const leetcodeRouter = Router();

// GET /api/leetcode/profile or /me
//agar logged in user aa jaye toh dubara verify na karna pade//
leetcodeRouter.get("/profile", getMyProfile);
leetcodeRouter.get("/me", getMyProfile);

// POST /api/leetcode/generate-token
leetcodeRouter.post("/generate-token", generateVerificationToken);

// POST /api/leetcode/verify
leetcodeRouter.post("/verify", verifyLeetCode);

// POST /api/leetcode/hero-card
leetcodeRouter.post("/hero-card", getOrGenerateHeroCard);

// POST /api/leetcode/refresh
leetcodeRouter.post("/refresh", refreshLeetCodeStats);

export default leetcodeRouter;

