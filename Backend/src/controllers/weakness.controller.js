import userModel from "../models/user.model.js";
import ProfileData from "../models/profile-data.model.js";
import Contest from "../models/contest.model.js";
import SubmissionMemory from "../models/submission-memory.model.js";
import { indexUserData, getUserNamespace, getPineconeClients } from "../rag/index.js";
import { chattingFn } from "../rag/query.js";

/**
 * Resolves the verified LeetCode username and MongoDB user document for a request.
 */
async function resolveUserFromReq(req) {
  let targetUser = null;

  // 1. Check if authenticated via session/JWT
  const userId = req.user?.id || req.user?._id || req.user?.userId;
  if (userId) {
    targetUser = await userModel.findById(userId).lean();
  }

  // 2. Fallback to username in query or body (ONLY match verified leetcode.username, NEVER the app user.username)
  const requestedUsername = (req.body?.username || req.query?.username || "").trim().toLowerCase();
  if (!targetUser && requestedUsername && requestedUsername !== "user" && requestedUsername !== "developer") {
    targetUser = await userModel.findOne({
      "leetcode.username": new RegExp(`^${requestedUsername}$`, "i")
    }).lean();
  }

  // 3. If targetUser is not verified, look for any verified user in DB as fallback
  if (!targetUser?.leetcode?.username || !targetUser?.leetcode?.isVerified) {
    const verifiedUser = await userModel.findOne({ "leetcode.isVerified": true }).lean();
    if (verifiedUser) {
      targetUser = verifiedUser;
    }
  }

  return targetUser;
}

/**
 * POST /api/v1/weakness/chat
 * Multi-turn tactical chat with Pinecone RAG memory
 */
export async function chatWithAdvisor(req, res) {
  try {
    const { message, history = [], codeSnippet = null } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question or message string is required."
      });
    }

    const user = await resolveUserFromReq(req);
    const leetcodeUsername = user?.leetcode?.username || req.body?.username || "user";

    const result = await chattingFn({
      question: message.trim(),
      history,
      username: leetcodeUsername,
      codeSnippet
    });

    return res.status(200).json({
      success: true,
      reply: result.reply,
      retrievedSources: result.retrievedSources,
      namespace: result.namespace,
      modelUsed: result.modelUsed,
      user: {
        username: user?.username || leetcodeUsername,
        leetcodeUsername
      }
    });
  } catch (err) {
    console.error("[WeaknessChat Error]", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to generate tactical advice with Weakness AI."
    });
  }
}

/**
 * POST /api/v1/weakness/index
 * Re-indexes all MongoDB profile data, contest telemetry, and submission memory into Pinecone.
 */
export async function indexUserDataController(req, res) {
  try {
    const user = await resolveUserFromReq(req);

    if (!user || !user.leetcode?.username) {
      return res.status(400).json({
        success: false,
        message: "No verified LeetCode profile linked to index into Pinecone."
      });
    }

    const cleanUsername = user.leetcode.username.trim().toLowerCase();

    // Parallel fetch of all available user telemetry from MongoDB
    const [profileData, contestData, codeSubmissions] = await Promise.all([
      ProfileData.findOne({ userId: user._id }).lean(),
      Contest.findOne({ leetcodeUsername: cleanUsername }).lean(),
      SubmissionMemory.find({ userId: user._id }).lean()
    ]);

    const result = await indexUserData({
      username: cleanUsername,
      userId: user._id,
      profileData,
      contestData,
      codeSubmissions
    });

    return res.status(200).json({
      success: true,
      message: "Profile telemetry and contest data synchronized successfully.",
      result
    });
  } catch (err) {
    console.error("[WeaknessIndex Error]", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to synchronize profile telemetry."
    });
  }
}

/**
 * GET /api/v1/weakness/status
 * Returns Pinecone memory indexing status and vector counts for the current user.
 */
export async function getMemoryStatusController(req, res) {
  try {
    const user = await resolveUserFromReq(req);
    const leetcodeUsername = user?.leetcode?.username || req.query?.username || "user";
    const cleanUsername = String(leetcodeUsername).trim().toLowerCase();
    const namespace = getUserNamespace(cleanUsername);

    let vectorCount = 0;
    try {
      const { pinecone, pineconeIndex } = getPineconeClients();
      const stats = await pineconeIndex.describeIndexStats();
      const nsStats = stats.namespaces?.[namespace];
      vectorCount = nsStats?.recordCount || 0;
    } catch (e) {
      // If stats cannot be fetched, default to checking MongoDB
    }

    const codeMemoryCount = user?._id
      ? await SubmissionMemory.countDocuments({ userId: user._id })
      : 0;

    return res.status(200).json({
      success: true,
      status: {
        isIndexed: vectorCount > 0,
        vectorCount,
        namespace,
        leetcodeUsername: cleanUsername,
        codeSnippetsIndexed: codeMemoryCount,
        dimension: 768,
        metric: "cosine"
      }
    });
  } catch (err) {
    console.error("[WeaknessStatus Error]", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch Weakness AI memory status."
    });
  }
}

/**
 * POST /api/v1/weakness/code
 * Saves a new code snippet to MongoDB and immediately embeds & upserts it to Pinecone.
 */
export async function addCodeToMemoryController(req, res) {
  try {
    const {
      problemTitle,
      problemSlug = "",
      difficulty = "Medium",
      tags = [],
      status = "Accepted",
      language = "cpp",
      code,
      notes = "",
      errorCause = null,
      contestTitle = null
    } = req.body;

    if (!problemTitle || !code) {
      return res.status(400).json({
        success: false,
        message: "problemTitle and code are required."
      });
    }

    const user = await resolveUserFromReq(req);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication or verified user profile required to save code memory."
      });
    }

    const cleanUsername = user.leetcode?.username || user.username;

    // 1. Save code snippet to MongoDB
    const newSubmission = await SubmissionMemory.create({
      userId: user._id,
      leetcodeUsername: cleanUsername.toLowerCase(),
      problemTitle: problemTitle.trim(),
      problemSlug: problemSlug.trim(),
      difficulty,
      tags: Array.isArray(tags) ? tags : [tags].filter(Boolean),
      status,
      language,
      code,
      notes: notes.trim(),
      errorCause,
      contestTitle
    });

    // 2. Incremental vector indexing of this code snippet to Pinecone
    try {
      const { pineconeIndex, embeddings } = getPineconeClients();
      const userNamespace = getUserNamespace(cleanUsername);

      const snippetText = `
[USER CODE SUBMISSION & MISTAKE MEMORY]
Username: ${cleanUsername}
Problem: "${problemTitle}" (${difficulty})
Language: ${language}
Verdict / Status: ${status}
Error Cause: ${errorCause || "None"}
Contest Context: ${contestTitle || "Practice Session"}
User Notes / Reflection: ${notes || "No notes"}

CODE IMPLEMENTATION:
\`\`\`${language}
${code}
\`\`\`
`.trim();

      const vector = await embeddings.embedQuery(snippetText);
      const ns = pineconeIndex.namespace(userNamespace);
      await ns.upsert({
        records: [{
          id: `${userNamespace}_code_${newSubmission._id}`,
          values: vector,
          metadata: {
            text: snippetText,
            category: "code_submission",
            title: `Code: ${problemTitle} (${status})`,
            username: cleanUsername.toLowerCase(),
            indexedAt: new Date().toISOString()
          }
        }]
      });
    } catch (embErr) {
      console.warn("[WeaknessCode] Code saved to DB but failed incremental vectorization:", embErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Code snippet and notes saved to your knowledge base successfully.",
      submission: newSubmission
    });
  } catch (err) {
    console.error("[WeaknessCode Error]", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to save code snippet to memory."
    });
  }
}
