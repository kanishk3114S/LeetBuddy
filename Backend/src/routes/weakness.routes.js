import { Router } from "express";
import {
  chatWithAdvisor,
  indexUserDataController,
  getMemoryStatusController,
  addCodeToMemoryController
} from "../controllers/weakness.controller.js";

export const weaknessRouter = Router();

// POST /api/v1/weakness/chat - Query the personal Pinecone RAG chat memory
weaknessRouter.post("/chat", chatWithAdvisor);

// POST /api/v1/weakness/index - Re-index all verified profile, contest, and code memory into Pinecone
weaknessRouter.post("/index", indexUserDataController);

// GET /api/v1/weakness/status - Get Pinecone index status & vector counts
weaknessRouter.get("/status", getMemoryStatusController);

// POST /api/v1/weakness/code - Add a custom solution or failure code snippet to memory
weaknessRouter.post("/code", addCodeToMemoryController);

export default weaknessRouter;
