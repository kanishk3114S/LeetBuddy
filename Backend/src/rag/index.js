import * as dotenv from 'dotenv';
dotenv.config();

import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import mongoose from 'mongoose';
import userModel from '../models/user.model.js';
import ProfileData from '../models/profile-data.model.js';
import Contest from '../models/contest.model.js';
import SubmissionMemory from '../models/submission-memory.model.js';

// Global Pinecone and Embeddings Clients
let pineconeInstance = null;
let pineconeIndexInstance = null;
let embeddingsInstance = null;

export function getPineconeClients() {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not defined in environment variables");
  }
  if (!process.env.PINECONE_INDEX_NAME) {
    throw new Error("PINECONE_INDEX_NAME is not defined in environment variables");
  }
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }

  if (!pineconeInstance) {
    pineconeInstance = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }

  if (!pineconeIndexInstance) {
    pineconeIndexInstance = pineconeInstance.index(process.env.PINECONE_INDEX_NAME);
  }

  if (!embeddingsInstance) {
    embeddingsInstance = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-embedding-001',
      outputDimensionality: 768, // Exactly matches 768-dim Pinecone index
    });
  }

  return {
    pinecone: pineconeInstance,
    pineconeIndex: pineconeIndexInstance,
    embeddings: embeddingsInstance,
  };
}

/**
 * Normalizes user namespace for secure isolation in Pinecone.
 */
export function getUserNamespace(username) {
  if (!username) return 'user_default';
  const clean = String(username).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '_');
  return `user_${clean}`;
}

/**
 * Builds high-density semantic text documents from all user profile, contest, and code data.
 */
export function buildUserKnowledgeDocuments({ username, profileData, contestData, codeSubmissions = [] }) {
  const documents = [];
  const cleanUsername = username.trim();

  // 1. Core Profile & Efficiency Telemetry
  if (profileData) {
    const stats = profileData.stats || {};
    const beats = profileData.beatsStats || {};
    const activity = profileData.activity || {};
    const hero = profileData.heroCard || {};

    const profileContent = `
[LEETCODE CORE PROFILE & PROBLEM SOLVING METRICS]
Username: ${cleanUsername}
Real Name: ${profileData.profile?.realName || cleanUsername}
Global Ranking: #${profileData.profile?.ranking?.toLocaleString() || 'N/A'}
Total Problems Solved: ${stats.totalSolved || 0}
- Easy Solved: ${stats.easySolved || 0} (LeetCode beats: ${beats.easy || 0}%)
- Medium Solved: ${stats.mediumSolved || 0} (LeetCode beats: ${beats.medium || 0}%)
- Hard Solved: ${stats.hardSolved || 0} (LeetCode beats: ${beats.hard || 0}%)
Total Submissions: ${stats.totalSubmissions || 0}
Accepted Submissions: ${stats.acceptedSubmissions || 0}
Global Acceptance Rate: ${stats.acceptanceRate || 0}%
LeetBuddy Points: ${stats.leetBuddyPoints || 0}

[CONSISTENCY & TEMPORAL PATTERNS]
Current Streak: ${activity.currentStreak || 0} days
Max Streak: ${activity.maxStreak || 0} days
Total Active Days: ${activity.totalActiveDays || 0} days
Active Years: ${(activity.activeYears || []).join(', ') || 'N/A'}

[AI HERO CARD PROFILE DIAGNOSTIC]
Archetype: ${hero.archetype || 'Competitive Problem Solver'}
Headline: ${hero.headline || 'Active LeetCode Competitor'}
Summary: ${hero.summary || 'Consistent problem solver with broad coverage across standard DSA topics.'}
Identified Strengths: ${(hero.strengths || []).join('; ') || 'Fundamental data structures, consistent daily submissions.'}
Primary Bottlenecks: ${(hero.bottlenecks || []).join('; ') || 'Time pressure execution on hard algorithmic transitions.'}
Actionable Recommendation: ${hero.actionableTip || 'Focus on targeted medium/hard Dynamic Programming and Graph transitions.'}
`.trim();

    documents.push({
      pageContent: profileContent,
      metadata: {
        category: 'profile_telemetry',
        username: cleanUsername,
        title: 'Core Profile & Efficiency Metrics'
      }
    });

    // 2. 41 Topic Mastery Breakdown
    const topics = profileData.topics || [];
    if (topics.length > 0) {
      const advanced = topics.filter(t => (t.category || '').toLowerCase() === 'advanced');
      const intermediate = topics.filter(t => (t.category || '').toLowerCase() === 'intermediate');
      const fundamental = topics.filter(t => (t.category || '').toLowerCase() === 'fundamental' || !t.category);

      const topicContent = `
[ALGORITHMIC TOPIC MASTERY AUDIT: 41 COMPETITIVE PROGRAMMING PATTERNS]
Username: ${cleanUsername}
Total Tracked Topics: ${topics.length}

ADVANCED TOPICS FLUENCY:
${advanced.map(t => `- ${t.tagName}: ${t.problemsSolved} solved`).join('\n') || '- None recorded'}

INTERMEDIATE TOPICS FLUENCY:
${intermediate.map(t => `- ${t.tagName}: ${t.problemsSolved} solved`).join('\n') || '- None recorded'}

FUNDAMENTAL TOPICS FLUENCY:
${fundamental.map(t => `- ${t.tagName}: ${t.problemsSolved} solved`).join('\n') || '- None recorded'}

TOPIC WEAKNESS DIAGNOSIS:
Topics with low solve volume relative to high contest frequency (such as Dynamic Programming, Segment Trees, Bit Manipulation, and Graph BFS/DFS) represent critical friction points that lead to contest rating drops.
`.trim();

      documents.push({
        pageContent: topicContent,
        metadata: {
          category: 'topic_mastery',
          username: cleanUsername,
          title: 'Algorithmic Topic Fluency & Deficit Audit'
        }
      });
    }
  }

  // 3. Contest Executive Telemetry & Circadian Split
  if (contestData) {
    const summary = contestData.summary || {};
    const history = contestData.contestHistory || [];
    const deepDive = contestData.recentFiveContestsDeepDive || [];

    // Separate Weekly vs Biweekly contests for Circadian Analysis
    const weeklyContests = history.filter(c => (c.contestTitle || '').toLowerCase().includes('weekly') && !(c.contestTitle || '').toLowerCase().includes('biweekly'));
    const biweeklyContests = history.filter(c => (c.contestTitle || '').toLowerCase().includes('biweekly'));

    const calcStats = (contests) => {
      if (!contests.length) return { count: 0, winRate: 0, avgDelta: 0, avgRank: 0, avgSolves: 0 };
      const wins = contests.filter(c => (c.trendDirection === 'UP' || (c.ratingDelta || 0) > 0)).length;
      const totalDelta = contests.reduce((sum, c) => sum + (c.ratingDelta || 0), 0);
      const totalRank = contests.reduce((sum, c) => sum + (c.ranking || 0), 0);
      const totalSolves = contests.reduce((sum, c) => sum + (c.problemsSolved || 0), 0);
      return {
        count: contests.length,
        winRate: Math.round((wins / contests.length) * 100),
        avgDelta: Math.round(totalDelta / contests.length),
        avgRank: Math.round(totalRank / contests.length),
        avgSolves: Number((totalSolves / contests.length).toFixed(1))
      };
    };

    const weeklyStats = calcStats(weeklyContests);
    const biweeklyStats = calcStats(biweeklyContests);
    const circadianVariance = biweeklyStats.avgDelta - weeklyStats.avgDelta;

const contestSummaryContent = `
[CONTEST CAREER TELEMETRY & RATINGS]
Username: ${cleanUsername}
Current Rating: ${summary.rating || 1500}
Peak Rating: ${summary.PeakRating || summary.peakRating || 1500}
Lowest Rating: ${summary.lowestRating || 1500}
Attended Contests Count: ${summary.attendedContestsCount || history.length}
Global Contest Ranking: #${summary.globalRanking?.toLocaleString() || 'N/A'} out of ${summary.totalParticipants?.toLocaleString() || '880,000+'}
Top Percentile: Top ${summary.topPercentage || 0}%
Official Badge Status: ${summary.badge || 'Unbadged'} (Knight threshold: 1850, Guardian threshold: 2150)

[CIRCADIAN "BIOLOGICAL CLOCK" TELEMETRY SPLIT]
Context: Weekly Contests take place at 8:00 AM IST on Sunday mornings (circadian trough / morning lag). Biweekly Contests take place at 8:00 PM IST on Saturday evenings (peak alertness).
- Sunday Morning Weekly Contests (${weeklyStats.count} contests): Win Rate: ${weeklyStats.winRate}%, Avg Rating Delta: ${weeklyStats.avgDelta >= 0 ? '+' : ''}${weeklyStats.avgDelta}, Avg Rank: #${weeklyStats.avgRank}, Avg Solves: ${weeklyStats.avgSolves}/4
- Saturday Night Biweekly Contests (${biweeklyStats.count} contests): Win Rate: ${biweeklyStats.winRate}%, Avg Rating Delta: ${biweeklyStats.avgDelta >= 0 ? '+' : ''}${biweeklyStats.avgDelta}, Avg Rank: #${biweeklyStats.avgRank}, Avg Solves: ${biweeklyStats.avgSolves}/4
- Circadian Delta Variance: ${circadianVariance > 0 ? `+${circadianVariance} points better on Saturday nights` : `${Math.abs(circadianVariance)} points gap`}.
`.trim();

    documents.push({
      pageContent: contestSummaryContent,
      metadata: {
        category: 'contest_career',
        username: cleanUsername,
        title: 'Contest Career Telemetry & Circadian Split'
      }
    });

    // 4. Chronological Contest Ledger (Recent 20 Contests for dense memory)
    if (history.length > 0) {
      const recentContests = history.slice(-20).reverse();
      const ledgerContent = `
[CAREER CONTEST CHRONOLOGICAL LEDGER (RECENT ${recentContests.length} CONTESTS)]
Username: ${cleanUsername}
${recentContests.map((c, idx) => {
  const delta = c.ratingDelta !== undefined ? c.ratingDelta : 'N/A';
  const finishTime = c.finishTimeInSeconds ? `${Math.floor(c.finishTimeInSeconds / 60)}m ${c.finishTimeInSeconds % 60}s` : 'N/A';
  return `${idx + 1}. ${c.contestTitle} | Post-Rating: ${c.rating} (Delta: ${delta >= 0 ? '+' : ''}${delta}) | Rank: #${c.ranking} | Solved: ${c.problemsSolved}/${c.totalProblems || 4} | Finish: ${finishTime} | Trend: ${c.trendDirection || 'NONE'}`;
}).join('\n')}
`.trim();

      documents.push({
        pageContent: ledgerContent,
        metadata: {
          category: 'contest_ledger',
          username: cleanUsername,
          title: 'Career Contest Chronology & Deltas'
        }
      });
    }

    // 5. Deep Autopsies of Recent 5 Contests (Errors, TLEs, WAs, Choke Slots, Panic Tax)
    if (deepDive.length > 0) {
      const deepDiveContent = `
[FORENSIC CONTEST AUTOPSIES: QUESTION FAILURES, TLEs, WAs & CHOKE SLOTS]
Username: ${cleanUsername}
Forensic audit of questions attempted across the user's last ${deepDive.length} contests:

${deepDive.map((d, cIdx) => {
  const finishMins = d.finishTimeInSeconds ? Math.floor(d.finishTimeInSeconds / 60) : 0;
  const questionsReport = (d.questions || []).map((q, qIdx) => {
    return `  - Q${qIdx + 1} (${q.difficulty || 'Medium'}): "${q.title}" -> Status: ${q.status || 'Not Attempted'}, Fails Before AC: ${q.failCount || 0}, Primary Error: ${q.errorCause || 'None'}, Language: ${q.language || 'cpp'}`;
  }).join('\n');

  return `Contest ${cIdx + 1}: ${d.contestTitle}
Rank: #${d.ranking} | Rating After: ${d.ratingAfter} (Delta: ${d.ratingDelta >= 0 ? '+' : ''}${d.ratingDelta}) | Solved: ${d.problemsSolved}/${d.totalProblems || 4} | Total Contest Time: ${finishMins}m
Questions Telemetry:
${questionsReport || '  No question events recorded.'}`;
}).join('\n\n')}

PANIC TAX & CHOKE SLOT MECHANICS:
Each wrong answer or speculative submission incurs +5 minutes of contest penalty time ("Panic Tax").
Submissions resulting in Time Limit Exceeded (TLE) demonstrate an unoptimized asymptotic time complexity (e.g. O(N^2) instead of O(N log N) or missing memoization).
Wrong Answer (WA) on Q2/Q3 indicates failure to test edge cases (overflow, 0 values, single-element bounds) before submission.
`.trim();

      documents.push({
        pageContent: deepDiveContent,
        metadata: {
          category: 'contest_autopsy',
          username: cleanUsername,
          title: 'Contest Question Autopsies & Error Diagnostics'
        }
      });
    }

    // 6. AI Contest Remediation Blueprints (if present)
    const remediation = contestData.remediationBlueprint;
    if (remediation && remediation.questions?.length > 0) {
      const remediationContent = `
[AI BLEEDING-QUESTION REMEDIATION BLUEPRINTS]
Username: ${cleanUsername}
Focus: Algorithmic gaps identified in recent contest choke questions:

${remediation.questions.map(q => `
Problem: "${q.title}" (${q.difficulty})
- Root-Cause Architecture: ${q.blueprint?.architecture || 'Optimize state transitions and asymptotic bounds.'}
- Conceptual Blind Spot: ${q.blueprint?.blindSpot || 'Rushing to brute force before proving time complexity.'}
- Key Invariant: ${q.blueprint?.keyInvariant || 'Ensure subproblem independence.'}
- Recommended Practice Ladder: ${(q.blueprint?.practiceLadder || []).map(p => `${p.title} (${p.difficulty})`).join(', ')}
`).join('\n')}
`.trim();

      documents.push({
        pageContent: remediationContent,
        metadata: {
          category: 'remediation_blueprints',
          username: cleanUsername,
          title: 'AI Contest Remediation Blueprints & Ladders'
        }
      });
    }
  }

  // 7. User Code Submissions Memory (Real Code Snippets)
  if (codeSubmissions && codeSubmissions.length > 0) {
    for (const sub of codeSubmissions) {
      const codeContent = `
[USER CODE SUBMISSION & MISTAKE MEMORY]
Username: ${cleanUsername}
Problem: "${sub.problemTitle}" (${sub.difficulty || 'Medium'})
Language: ${sub.language || 'cpp'}
Verdict / Status: ${sub.status || 'Accepted'}
Error Cause: ${sub.errorCause || 'N/A'}
Contest Context: ${sub.contestTitle || 'Practice Session'}
User Notes / Reflection: ${sub.notes || 'No notes provided.'}

CODE IMPLEMENTATION:
\`\`\`${sub.language || 'cpp'}
${sub.code}
\`\`\`
`.trim();

      documents.push({
        pageContent: codeContent,
        metadata: {
          category: 'code_submission',
          username: cleanUsername,
          title: `Code: ${sub.problemTitle} (${sub.status})`,
          problemTitle: sub.problemTitle,
          status: sub.status,
          language: sub.language
        }
      });
    }
  }

  return documents;
}

/**
 * Main Indexing Pipeline:
 * Chunks documents, computes 768-dim embeddings, and upserts to Pinecone.
 */
export async function indexUserData({ username, userId = null, profileData = null, contestData = null, codeSubmissions = [] }) {
  if (!username) {
    throw new Error("Valid username is required for indexing");
  }

  const cleanUsername = username.trim().toLowerCase();
  const userNamespace = getUserNamespace(cleanUsername);
  const { pineconeIndex, embeddings } = getPineconeClients();

  console.log(`[Pinecone Indexer] Starting indexing pipeline for user "${cleanUsername}" (Namespace: "${userNamespace}")...`);

  // 1. Synthesize documents
  const rawDocuments = buildUserKnowledgeDocuments({
    username: cleanUsername,
    profileData,
    contestData,
    codeSubmissions
  });

  if (rawDocuments.length === 0) {
    console.warn(`[Pinecone Indexer] No documents generated for ${cleanUsername}. Skipping vector upload.`);
    return { success: false, message: "No data available to index", chunksCount: 0 };
  }

  // 2. Chunk documents with RecursiveCharacterTextSplitter
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunkedDocs = [];
  for (const doc of rawDocuments) {
    const chunks = await textSplitter.splitText(doc.pageContent);
    chunks.forEach((chunkText, idx) => {
      chunkedDocs.push({
        pageContent: chunkText,
        metadata: {
          ...doc.metadata,
          chunkIndex: idx,
          totalChunksInDoc: chunks.length,
          indexedAt: new Date().toISOString()
        }
      });
    });
  }

  console.log(`[Pinecone Indexer] Created ${chunkedDocs.length} vector chunks from ${rawDocuments.length} knowledge documents.`);

  // 3. Clear old records in user namespace to prevent stale duplicate context
  try {
    const ns = pineconeIndex.namespace(userNamespace);
    await ns.deleteAll();
    console.log(`[Pinecone Indexer] Cleared previous records in namespace "${userNamespace}".`);
  } catch (err) {
    // Pinecone throws if namespace doesn't exist yet, which is expected for new users
    console.log(`[Pinecone Indexer] Note on namespace clear: ${err.message}`);
  }

  // 4. Generate Embeddings & Format Pinecone Records
  console.log(`[Pinecone Indexer] Generating embeddings with model "gemini-embedding-001" (768-dim)...`);
  const textsToEmbed = chunkedDocs.map(c => c.pageContent);
  const vectors = await embeddings.embedDocuments(textsToEmbed);

  const records = chunkedDocs.map((chunk, idx) => {
    return {
      id: `${userNamespace}_chunk_${idx}_${Date.now()}`,
      values: vectors[idx],
      metadata: {
        text: chunk.pageContent,
        category: chunk.metadata.category || 'general',
        title: chunk.metadata.title || 'Telemetry',
        username: cleanUsername,
        indexedAt: chunk.metadata.indexedAt
      }
    };
  });

  // 5. Batch Upsert to Pinecone
  const BATCH_SIZE = 50;
  const ns = pineconeIndex.namespace(userNamespace);

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    await ns.upsert({ records: batch });
    console.log(`[Pinecone Indexer] Upserted batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} vectors) to Pinecone.`);
  }

  console.log(`[Pinecone Indexer] Successfully indexed ${records.length} vectors into Pinecone under namespace "${userNamespace}"!`);

  return {
    success: true,
    namespace: userNamespace,
    vectorCount: records.length,
    rawDocCount: rawDocuments.length,
    indexedAt: new Date().toISOString()
  };
}

/**
 * Standalone CLI runner when executed directly via "node index.js"
 */
async function main() {
  console.log("=== LeetBuddy Pinecone Knowledge Indexer CLI ===");
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB.");

  // Find first verified LeetCode user
  const user = await userModel.findOne({ "leetcode.isVerified": true }).lean();
  if (!user || !user.leetcode?.username) {
    console.error("No verified LeetCode user found in MongoDB. Please verify a profile first.");
    await mongoose.disconnect();
    return;
  }

  const cleanUsername = user.leetcode.username.trim().toLowerCase();
  console.log(`Target verified user: ${user.username} (LeetCode: ${cleanUsername})`);

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

  console.log("\n=== Indexing Summary ===");
  console.log(result);

  await mongoose.disconnect();
  console.log("Database disconnected. Done.");
}

// Check if run directly from CLI
if (process.argv[1] && (process.argv[1].replace(/\\/g, '/').endsWith('rag/index.js') || process.argv[1].replace(/\\/g, '/').endsWith('Backend/index.js') || process.argv[1].replace(/\\/g, '/').endsWith('/index.js'))) {
  main().catch(err => {
    console.error("Indexing CLI failed:", err);
    process.exit(1);
  });
}
