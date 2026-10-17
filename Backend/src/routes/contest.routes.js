import { Router } from "express";
import {
  getContestByUsername,
  getMyContest,
  syncContest
} from "../controllers/contest.controller.js";

export const contestRouter = Router();

// GET /api/v1/contests/me (authenticated user's contest telemetry)
contestRouter.get("/me", getMyContest);

// POST /api/v1/contests/sync (trigger sync for authenticated or specified user)
contestRouter.post("/sync", syncContest);

// GET /api/v1/contests/:username (fetch by LeetCode handle)
contestRouter.get("/:username", getContestByUsername);

export default contestRouter;
