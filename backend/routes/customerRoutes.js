import express from "express";
import { register } from "../controllers/customerController.js";
const router = express.Router();


router.post("/register", register);

router.get("/", (req, res) => {
  res.send("Customer route working!");
});

export default router;