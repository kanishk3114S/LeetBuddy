import "dotenv/config";
import { generateHeroCard } from "./src/Ai/heroCard.service.js";

async function runTest() {
    console.log("\n🧪 ==================================================");
    console.log("   LEETBUDDY GEMINI AI PIPELINE TESTER");
    console.log("====================================================\n");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ ERROR: GEMINI_API_KEY is not defined in Backend/.env");
        console.error("   Please ensure Backend/.env has: GEMINI_API_KEY=your_key_here\n");
        process.exit(1);
    }

    const maskedKey = apiKey.slice(0, 8) + "..." + apiKey.slice(-4);
    console.log(`🔑 GEMINI_API_KEY detected: ${maskedKey}`);
    console.log(`📡 Testing live connection to Google Gemini API...\n`);

    const mockProfileData = {
        username: "TestGrinder",
        stats: {
            totalSolved: 345,
            easySolved: 120,
            mediumSolved: 195,
            hardSolved: 30,
            totalSubmissions: 780,
            acceptedSubmissions: 540,
            acceptanceRate: 69.2,
            leetBuddyPoints: 3400
        },
        beatsStats: {
            easy: 85,
            medium: 91,
            hard: 76
        },
        topics: [
            { tagName: "Tree", category: "intermediate", problemsSolved: 58 },
            { tagName: "Graph", category: "intermediate", problemsSolved: 42 },
            { tagName: "Array", category: "fundamental", problemsSolved: 95 },
            { tagName: "Dynamic Programming", category: "advanced", problemsSolved: 6 }
        ],
        activity: {
            currentStreak: 18,
            totalActiveDays: 140
        }
    };

    const startTime = Date.now();
    try {
        const result = await generateHeroCard(mockProfileData);
        const totalDuration = Date.now() - startTime;

        console.log("\n🎉 ================= RESULT RECEIVED ================");
        console.log(`⏱️  Total Test Time : ${totalDuration}ms`);
        console.log(`🧠 AI Engine Source : ${result.source}`);
        console.log(`🤖 Model Employed   : ${result.model}`);
        console.log(`🎭 Archetype Title  : ${result.archetype}`);
        console.log(`🎯 Headline Tagline : ${result.headline}`);
        console.log("\n📝 Executive Summary Takeaway:");
        console.log(`"${result.summary}"`);
        console.log("\n💪 Strengths Identified:");
        result.strengths?.forEach((s, i) => console.log(`   ${i + 1}. ${s}`));
        console.log("\n⚠️ Bottlenecks Flagged:");
        result.bottlenecks?.forEach((b, i) => console.log(`   ${i + 1}. ${b}`));
        console.log("\n💡 Actionable Coaching Directive:");
        console.log(`   ${result.actionableTip}`);
        console.log("====================================================\n");

        if (result.source === "gemini") {
            console.log("✅ LIVE GEMINI AI PIPELINE IS WORKING 100% PERFECTLY!\n");
        } else {
            console.log("⚠️ Fallback engine was used. Check model quota or internet connection.\n");
        }
    } catch (err) {
        console.error("\n❌ Test execution failed with error:", err);
    }
}

runTest();
