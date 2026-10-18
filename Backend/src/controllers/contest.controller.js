import userModel from "../models/user.model.js";
import { getContestData, syncContestData } from "../services/leetcodeContest.service.js";
import { generateContestRemediation } from "../services/aiContestRemediation.service.js";

/**
 * Controller to fetch contest telemetry by LeetCode username.
 * GET /api/v1/contests/:username
 */
export async function getContestByUsername(req, res) {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: "Username parameter is required" });
    }

    const userId = req.user?.id || null;
    const contestDoc = await getContestData(username, userId);

    if (!contestDoc) {
      return res.status(404).json({ error: `No contest telemetry found for user "${username}"` });
    }

    return res.status(200).json({
      message: "Contest telemetry retrieved successfully",
      contest: contestDoc
    });
  } catch (error) {
    console.error("[ContestController] Error fetching contest by username:", error);
    return res.status(500).json({ error: error.message || "Failed to retrieve contest telemetry" });
  }
}

/**
 * Controller to fetch authenticated user's contest telemetry.
 * GET /api/v1/contests/me
 */
export async function getMyContest(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const user = await userModel.findById(userId);
    const username = user?.leetcode?.username;

    if (!username) {
      return res.status(400).json({
        error: "No LeetCode profile connected to this account. Please connect and verify your LeetCode handle first."
      });
    }

    const contestDoc = await getContestData(username, userId);

    return res.status(200).json({
      message: "Personal contest telemetry retrieved successfully",
      contest: contestDoc
    });
  } catch (error) {
    console.error("[ContestController] Error in getMyContest:", error);
    return res.status(500).json({ error: error.message || "Failed to retrieve personal contest telemetry" });
  }
}

/**
 * Controller to trigger a forced contest telemetry sync from LeetCode.
 * POST /api/v1/contests/sync
 */
export async function syncContest(req, res) {
  try {
    const userId = req.user?.id || null;
    let username = req.body?.username;

    if (!username && userId) {
      const user = await userModel.findById(userId);
      username = user?.leetcode?.username;
    }

    if (!username) {
      return res.status(400).json({ error: "LeetCode username is required to sync contest telemetry" });
    }

    const contestDoc = await syncContestData(username, userId);

    return res.status(200).json({
      message: "Contest telemetry synced successfully",
      contest: contestDoc,
      lastSyncedAt: contestDoc?.lastSyncedAt || new Date()
    });
  } catch (error) {
    console.error("[ContestController] Error syncing contest telemetry:", error);
    return res.status(500).json({ error: error.message || "Failed to sync contest telemetry" });
  }
}

/**
 * Controller to fetch AI contest remediation blueprint.
 * GET/POST /api/v1/contests/:username/remediation
 */
export async function getContestRemediationController(req, res) {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ error: "Username parameter is required" });
    }

    const forceRefresh = req.query.refresh === "true" || req.body?.refresh === true;
    const remediation = await generateContestRemediation(username, { forceRefresh });

    return res.status(200).json({
      message: "AI contest remediation retrieved successfully",
      remediation
    });
  } catch (error) {
    console.error("[ContestController] Error fetching AI remediation:", error);
    return res.status(500).json({ error: error.message || "Failed to generate contest remediation" });
  }
}
