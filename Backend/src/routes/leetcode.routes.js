import { Router } from "express";
import { generateVerificationToken, verifyLeetCode, getOrGenerateHeroCard } from "../controllers/leetcode.controller.js";

export const leetcodeRouter = Router();

// POST /api/leetcode/generate-token
leetcodeRouter.post("/generate-token", generateVerificationToken);

// POST /api/leetcode/verify
leetcodeRouter.post("/verify", verifyLeetCode);

// POST /api/leetcode/hero-card
leetcodeRouter.post("/hero-card", getOrGenerateHeroCard);

export default leetcodeRouter;
