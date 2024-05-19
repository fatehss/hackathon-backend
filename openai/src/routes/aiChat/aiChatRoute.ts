import express from "express";
import { aiChatEngine } from "../../aiengine/aiChatwithVectorSearchEngine";

const router = express.Router();

router.post("/", aiChatEngine);

export default router;
