import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

router.get("/", (req, res) => {
  res.send("Auth route working!");
});

export default router;
