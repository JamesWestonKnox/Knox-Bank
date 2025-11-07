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
import { getAllTransactions, verifyTransaction, submitToSwift } from "../controllers/employeeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, validateTransaction, createTransaction);
router.get("/", authMiddleware, getTransactions);
router.get("/employee/transactions", authMiddleware, getAllTransactions);
router.patch("/employee/verify/:id", authMiddleware, verifyTransaction);
router.post("/employee/submit", authMiddleware, submitToSwift);
export default router;

// =============================== END OF FILE ===============================