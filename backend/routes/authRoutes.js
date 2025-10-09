import express from "express";
import { login } from "../controllers/authController.js";
import ExpressBrute from "express-brute";

const router = express.Router();

var store = new ExpressBrute.MemoryStore();
var bruteforce = new ExpressBrute(store);

router.post("/login",bruteforce.prevent, login);

router.get("/", (req, res) => {
  res.send("Auth route working!");
});

export default router;
