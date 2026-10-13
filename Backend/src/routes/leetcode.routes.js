import { Router } from "express";
import { generateVerificationToken, verifyLeetCode } from "../controllers/leetcode.controller.js";

export const leetcodeRouter = Router();

// POST /api/leetcode/generate-token
leetcodeRouter.post("/generate-token", generateVerificationToken);

// POST /api/leetcode/verify
leetcodeRouter.post("/verify", verifyLeetCode);

export default leetcodeRouter;
