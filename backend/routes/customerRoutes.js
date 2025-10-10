/**
 * customerRoutes.js
 * 
 * Defined routes for customer registration
 * 
 * Reference:
 * OpenAI, 2025. ChatGPT [Computer program]. Version GPT-5 mini. 
 * Available at: https://chat.openai.com
 */

import express from "express";
import { register } from "../controllers/customerController.js";
const router = express.Router();

router.post("/register", register);

router.get("/", (req, res) => {
  res.send("Customer route working!");
});

export default router;

// =============================== END OF FILE ===============================