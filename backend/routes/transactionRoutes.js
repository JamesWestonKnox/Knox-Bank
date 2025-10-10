/**
 * transactionRoutes.js
 * 
 * Defines routes for transactions
 * 
 * Reference:
 * OpenAI, 2025. ChatGPT [Computer program]. Version GPT-5 mini. 
 * Available at: https://chat.openai.com
 */

import express from "express";
import { createTransaction, getTransactions, validateTransaction } from "../controllers/transactionController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, validateTransaction, createTransaction);
router.get("/", authMiddleware, getTransactions);

export default router;

// =============================== END OF FILE ===============================