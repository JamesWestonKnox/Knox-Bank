/**
 * authRoutes.js
 *
 * Defines routes for authentication
 *
 * Reference:
 * OpenAI, 2025. ChatGPT [Computer program]. Version GPT-5 mini.
 * Available at: https://chat.openai.com
 */

import express from "express";
import { login, loginEmployee } from "../controllers/authController.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts from this IP, please try again later",
});

router.post("/login", loginLimiter, login);
router.post("/loginEmployee", loginLimiter, loginEmployee);

router.get("/", (req, res) => {
  res.send("Auth route working!");
});

export default router;

// =============================== END OF FILE ===============================
