import { Router } from "express";
import { generateVerificationToken } from "../controllers/leetcode.controller.js";

export const leetcodeRouter = Router();

// POST /api/leetcode/generate-token
leetcodeRouter.post("/generate-token", generateVerificationToken);

export default leetcodeRouter;
