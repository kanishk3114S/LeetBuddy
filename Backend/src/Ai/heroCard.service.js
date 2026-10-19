import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";

/**
 * Generates an AI-driven high-level developer persona and executive summary (Hero Card)
 * based on verified LeetCode profile metrics.
 * 
 * @param {Object} profileData - Normalized user profile data and statistics
 * @returns {Promise<Object>} Hero card content
 */
export async function generateHeroCard(profileData = {}) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not defined in backend environment variables.");
    }

    // Resolve nested or flat structures defensively
    const stats = profileData.stats || profileData.profile?.stats || profileData || {};
    const topics = (Array.isArray(profileData.topics) && profileData.topics.length > 0)
        ? profileData.topics
        : (Array.isArray(profileData.profile?.topics) ? profileData.profile.topics : []);
    const beatsStats = profileData.beatsStats || profileData.profile?.beatsStats || {};
    const activity = profileData.activity || profileData.profile?.activity || {};
    const username = profileData.username || profileData.profile?.realName || "Developer";

    // Filter and sort top topics
    const activeTopics = (topics || [])
        .filter(t => t.problemsSolved > 0)
        .sort((a, b) => b.problemsSolved - a.problemsSolved);

    const top3Topics = activeTopics.slice(0, 3).map(t => `${t.tagName} (${t.problemsSolved} solved)`).join(", ");
    
    // Check advanced topics with 0 or low solves
    const criticalAdvanced = ["Dynamic Programming", "Graph Theory", "Backtracking", "Trie", "Binary Search"];
    const weakTopics = criticalAdvanced.filter(crit => {
        const found = (topics || []).find(t => t.tagName?.toLowerCase() === crit.toLowerCase());
        return !found || found.problemsSolved <= 2;
    }).slice(0, 2);

    const inputMetrics = {
        username,
        totalSolved: stats.totalSolved || 0,
        easySolved: stats.easySolved || 0,
        mediumSolved: stats.mediumSolved || 0,
        hardSolved: stats.hardSolved || 0,
        totalSubmissions: stats.totalSubmissions || 0,
        acceptedSubmissions: stats.acceptedSubmissions || 0,
        acceptanceRate: `${stats.acceptanceRate || 0}%`,
        leetBuddyScore: stats.leetBuddyPoints || 0,
        beatsPercentages: {
            easy: `${beatsStats.easy || 0}%`,
            medium: `${beatsStats.medium || 0}%`,
            hard: `${beatsStats.hard || 0}%`
        },
        currentStreak: `${activity.currentStreak || 0} days`,
        totalActiveDays: `${activity.totalActiveDays || 0} days`,
        topDominantTopics: top3Topics || "General Arrays & Strings",
        laggingOrUnderrepresentedTopics: weakTopics.join(", ") || "Advanced Hard Categories"
    };

    const systemPrompt = `
You are a friendly, encouraging senior developer and coding mentor for 'LeetBuddy'.
Analyze the following aggregated LeetCode performance statistics and synthesize a clear, helpful profile summary.

CRITICAL TONE & STYLE RULES:
- Speak in simple, everyday English—like a friendly senior engineer explaining things clearly over coffee.
- Keep sentences short and direct (under 20 words where possible).
- BANNED WORDS LIST: Do NOT use words like "bottleneck", "choke point", "choke", "telemetry", "asymptotic", "lethality", "paradigm", "circadian", "bleed", "autopsy", "heuristic", "manifest", "delve", or "testament".
- Pick an approachable developer Archetype (e.g. "Practical Problem Solver", "Clean Code Builder", "Fast Implementation Specialist", "Core Algorithms Focused").
- State the user's main strength in plain terms (e.g. strong in Arrays or Graphs).
- State 1-2 areas to improve simply (e.g., "Your code runs too slowly when inputs get large" or "You often miss boundary cases like empty lists").
- Zero Repetition: Do not repeat points between summary, strengths, and areas to improve.
- Respond ONLY with valid, parseable raw JSON without markdown code fences (\`\`\`json).
`;

    const userPrompt = `
Generate the Hero Card JSON for this user:
${JSON.stringify(inputMetrics, null, 2)}

Required JSON Schema:
{
  "archetype": "string (2-3 simple words)",
  "headline": "string (clear 1-sentence tagline in plain English)",
  "summary": "string (2 concise sentences in plain English)",
  "strengths": ["string", "string"],
  "bottlenecks": ["string", "string"],
  "actionableTip": "string (1 simple, practical tip)"
}
`;

    // Try models in order of capability and speed
    const candidateModels = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.8-flash"];
    let lastError = null;

    for (const modelName of candidateModels) {
        try {
            console.log(`\n======================================================`);
            console.log(`[Gemini AI Pipeline] 🚀 Calling Google Gemini API...`);
            console.log(`[Gemini AI Pipeline] Target Model : ${modelName}`);
            console.log(`[Gemini AI Pipeline] User Target  : ${username} (${stats.totalSolved || 0} solved, ${stats.mediumSolved || 0} mediums)`);
            console.log(`======================================================`);
            
            const startTime = Date.now();
            const ai = new GoogleGenAI({ apiKey });
            const response = await ai.models.generateContent({
                model: modelName,
                contents: `${systemPrompt}\n\n${userPrompt}`,
                config: {
                    responseMimeType: "application/json"
                }
            });
            const duration = Date.now() - startTime;

            const text = response?.text?.trim() || "";
            // Clean up any stray markdown ticks if present
            const cleaned = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
            const parsed = JSON.parse(cleaned);

            if (parsed?.summary && parsed?.archetype) {
                console.log(`[Gemini AI Pipeline] ✅ SUCCESS! Received response in ${duration}ms from ${modelName}`);
                console.log(`[Gemini AI Pipeline] Archetype: "${parsed.archetype}"`);
                console.log(`[Gemini AI Pipeline] Takeaway : "${parsed.summary.slice(0, 100)}..."\n`);

                return {
                    ...parsed,
                    source: "gemini",
                    model: modelName,
                    latencyMs: duration,
                    generatedAt: new Date().toISOString()
                };
            }
        } catch (err) {
            lastError = err;
            console.warn(`[Gemini AI Pipeline] ⚠️ Model ${modelName} call failed (${err?.message || err}). Trying next candidate...`);
        }
    }

    throw new Error(`Google Gemini API generation failed: ${lastError?.message || "All models failed"}`);
}


