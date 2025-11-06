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
import ExpressBrute from "express-brute";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

router.post("/login", bruteforce.prevent, login);
router.post("/loginEmployee", bruteforce.prevent, loginEmployee);

router.get("/", (req, res) => {
  res.send("Auth route working!");
});

export default router;

// =============================== END OF FILE ===============================
