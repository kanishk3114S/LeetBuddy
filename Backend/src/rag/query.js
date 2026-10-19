import * as dotenv from 'dotenv';
dotenv.config();

import readlineSync from 'readline-sync';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { Pinecone } from '@pinecone-database/pinecone';
import { GoogleGenAI } from '@google/genai';
import mongoose from 'mongoose';
import userModel from '../models/user.model.js';
import { getUserNamespace } from './index.js';

// Lazy-initialized clients
let aiInstance = null;
let embeddingsInstance = null;
let pineconeInstance = null;
let pineconeIndexInstance = null;

function getQueryClients() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }
  if (!process.env.PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not defined in environment variables");
  }
  if (!process.env.PINECONE_INDEX_NAME) {
    throw new Error("PINECONE_INDEX_NAME is not defined in environment variables");
  }

  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  if (!embeddingsInstance) {
    embeddingsInstance = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-embedding-001',
      outputDimensionality: 768, // Crucial for 768-dim Pinecone index
    });
  }

  if (!pineconeInstance) {
    pineconeInstance = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }

  if (!pineconeIndexInstance) {
    pineconeIndexInstance = pineconeInstance.index(process.env.PINECONE_INDEX_NAME);
  }

  return {
    ai: aiInstance,
    embeddings: embeddingsInstance,
    pinecone: pineconeInstance,
    pineconeIndex: pineconeIndexInstance,
  };
}

/**
 * Builds the personalized coding mentor system instruction with native user stats context.
 */
function buildAdvisorSystemInstruction(context, username) {
  return `You are a friendly, encouraging senior developer and coding mentor for 'LeetBuddy'.
You have direct knowledge of this user's recent contest scores, solved questions, topic history, and code submissions.

[USER TELEMETRY & KNOWLEDGE CONTEXT]
"""
${context || 'No specific history matched this query. Provide standard helpful coding guidance.'}
"""

CRITICAL TONE & STYLE RULES:
1. Plain English Only:
   - Talk like an approachable senior developer explaining concepts clearly over coffee.
   - Keep sentences short and easy to understand (under 20 words where possible).
   - BANNED WORDS LIST: NEVER use words like "bottleneck", "choke point", "choke", "telemetry", "asymptotic", "lethality", "paradigm", "circadian", "bleed", "autopsy", "heuristic", "manifest", "delve", or "testament".
   - Instead of "asymptotic complexity bottleneck", say: "Your code works on small inputs, but runs too slowly when the input grows large."
   - Instead of "edge-case panic", say: "You rushed your submission and missed boundary cases like empty arrays or zero."
   - Instead of "circadian split", say: "Your morning contest scores compared to evening contests."
   - Never use medical, war, or overly academic jargon.
2. Zero Repetition Rule:
   - State an insight once. Never repeat the same point in different paragraphs or bullet points.
3. Natural Persona:
   - NEVER mention 'chunks', 'context provided', 'retrieved documents', 'database', 'Pinecone', 'vectors', or 'embeddings'.
   - Treat all provided facts and stats as your own natural memory.
4. Specific & Grounded:
   - Mention the user's actual numbers, contest names (e.g. Weekly Contest 410), rating changes (+32, -18), solve times, and problem titles when relevant.
5. Why Rating Was Lost or Gained:
   - Extra Penalty Time: Mention if 5-minute wrong answer penalties dropped their ranking.
   - Tough Problems: Explain whether they got stuck on Question 3 or 4.
   - Speed vs Logic: Explain whether the solution was too slow (Time Limit Exceeded) or missed edge cases (Wrong Answer).
6. Clean Solutions:
   - When code is needed, give clean, readable code (C++, Python, or Java) with a 1-sentence explanation of the key idea and simple time/space complexity.
7. Next Steps:
   - Give 2-3 clear, practical practice actions suited to their current rating.`;
}

/**
 * Core RAG Chatting Function:
 * 1. Converts question into 768-dim embedding vector.
 * 2. Queries Pinecone topK matching chunks in the user's namespace.
 * 3. Extracts context metadata text.
 * 4. Calls Gemini with rich conversation history and the DSA Advisor prompt.
 */
export async function chattingFn({ question, history = [], username = 'user', codeSnippet = null }) {
  if (!question || typeof question !== 'string') {
    throw new Error("Valid question string is required");
  }

  const { ai, embeddings, pineconeIndex } = getQueryClients();
  const cleanUsername = String(username).trim().toLowerCase();
  const userNamespace = getUserNamespace(cleanUsername);

  // 1. Embed user query into 768-dim vector
  console.log(`[RAG Query] Embedding question for user "${cleanUsername}" (Namespace: "${userNamespace}")...`);
  const queryVector = await embeddings.embedQuery(question);

  // 2. Search Pinecone for top matching chunks in user's isolated namespace
  let searchResults = { matches: [] };
  try {
    const ns = pineconeIndex.namespace(userNamespace);
    searchResults = await ns.query({
      topK: 6,
      vector: queryVector,
      includeMetadata: true,
    });
  } catch (err) {
    console.warn(`[RAG Query] Pinecone query note: ${err.message}`);
  }

  const matches = searchResults.matches || [];
  console.log(`[RAG Query] Retrieved ${matches.length} matching chunks from Pinecone.`);

  // 3. Extract metadata text
  const context = matches
    .map(match => {
      const cat = match.metadata?.category ? `[Category: ${match.metadata.category}] ` : '';
      return `${cat}${match.metadata?.text || ""}`;
    })
    .filter(Boolean)
    .join("\n\n---\n\n");

  // 4. Format multi-turn conversation history for Gemini
  // Normalize incoming history: array of { role: 'user' | 'model', text: '...' }
  const formattedHistory = [];
  for (const h of history) {
    if (h.role && (h.text || h.parts)) {
      const textContent = h.text || (Array.isArray(h.parts) ? h.parts.map(p => p.text).join('') : String(h.parts));
      formattedHistory.push({
        role: h.role === 'assistant' ? 'model' : h.role,
        parts: [{ text: textContent }]
      });
    }
  }

  // Append optional attached code snippet to the user's question
  let fullUserQuestion = question;
  if (codeSnippet && typeof codeSnippet === 'string' && codeSnippet.trim().length > 0) {
    fullUserQuestion += `\n\n[Attached Code Snippet for Analysis]:\n\`\`\`\n${codeSnippet.trim()}\n\`\`\``;
  }

  // Add the current question to history
  formattedHistory.push({
    role: 'user',
    parts: [{ text: fullUserQuestion }]
  });

  // 5. Generate tactical response with Gemini (with resilience across flash models)
  const systemInstruction = buildAdvisorSystemInstruction(context, cleanUsername);

  let responseText = "";
  const candidateModels = ['gemini-3.5-flash-lite', 'gemini-3.8-flash'];

  let lastError = null;
  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: formattedHistory,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      responseText = response.text || "";
      if (responseText) break;
    } catch (err) {
      console.warn(`[RAG Query] Model ${modelName} error: ${err.message}. Trying next model...`);
      lastError = err;
    }
  }

  if (!responseText) {
    throw lastError || new Error("Failed to generate response from Gemini");
  }

  // Format retrieved sources for UI inspection
  const retrievedSources = matches.map(m => ({
    id: m.id,
    score: m.score ? Number(m.score.toFixed(3)) : null,
    category: m.metadata?.category || 'general',
    title: m.metadata?.title || 'Telemetry',
    snippet: (m.metadata?.text || "").slice(0, 180) + '...'
  }));

  return {
    reply: responseText,
    retrievedSources,
    namespace: userNamespace,
    modelUsed: 'gemini-3.5-flash-lite'
  };
}

/**
 * Terminal Interactive Loop CLI when executed via "node query.js"
 */
async function main() {
  console.log("=== LeetBuddy Weakness AI RAG Chatbot CLI ===");
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);
  const user = await userModel.findOne({ "leetcode.isVerified": true }).lean();
  const username = user?.leetcode?.username || 'user';
  console.log(`Loaded verified user: ${username}`);
  console.log("Memory grounded via Pinecone (768-dim embeddings).");
  console.log("Type your question below (or type 'exit' to quit).\n");

  const localHistory = [];

  while (true) {
    const userProblem = readlineSync.question("\nAsk LeetBuddy Advisor --> ");
    if (userProblem.trim().toLowerCase() === 'exit') break;
    if (!userProblem.trim()) continue;

    try {
      const result = await chattingFn({
        question: userProblem,
        history: localHistory,
        username
      });

      console.log("\n--- Tactical Advisor Response ---");
      console.log(result.reply);
      console.log("\n[Retrieved Memory Sources]:", result.retrievedSources.map(s => `(${s.category}: ${s.score})`).join(' '));

      // Append to local CLI history
      localHistory.push({ role: 'user', text: userProblem });
      localHistory.push({ role: 'model', text: result.reply });
    } catch (err) {
      console.error("\n[Error]", err.message);
    }
  }

  await mongoose.disconnect();
  console.log("Disconnected. Goodbye!");
}

// Check if run directly from CLI
if (process.argv[1] && (process.argv[1].replace(/\\/g, '/').endsWith('rag/query.js') || process.argv[1].replace(/\\/g, '/').endsWith('Backend/query.js') || process.argv[1].replace(/\\/g, '/').endsWith('/query.js'))) {
  main().catch(err => {
    console.error("Query CLI failed:", err);
    process.exit(1);
  });
}
