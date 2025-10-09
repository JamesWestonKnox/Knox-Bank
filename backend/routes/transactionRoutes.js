import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createTransaction, getTransactions } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, getTransactions);
router.get("/", (req, res) => {
  res.send("Transaction route working!");
});

export default router;