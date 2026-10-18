import { Router } from "express";
import {
  getContestByUsername,
  getMyContest,
  syncContest,
  getContestRemediationController
} from "../controllers/contest.controller.js";

export const contestRouter = Router();

// GET /api/v1/contests/me (authenticated user's contest telemetry)
//agar logged in user aa jaye toh dubara verify na karna pade
contestRouter.get("/me", getMyContest);

// POST /api/v1/contests/sync (trigger sync for authenticated or specified user)
contestRouter.post("/sync", syncContest);

// GET & POST /api/v1/contests/:username/remediation (fetch or force refresh AI deep dive remediation)
contestRouter.get("/:username/remediation", getContestRemediationController);
contestRouter.post("/:username/remediation", getContestRemediationController);

// GET /api/v1/contests/:username (fetch by LeetCode handle)
contestRouter.get("/:username", getContestByUsername);

export default contestRouter;

