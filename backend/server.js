/**
 * server.js
 *
 * This file is used to setup the backend Express server.
 *
 * Reference:
 * OpenAI, 2025. ChatGPT [Computer program]. Version GPT-5 mini.
 * Available at: https://chat.openai.com
 */

import express from "express";
import https from "node:https";
import dotenv from "dotenv";
import helmet from "helmet";
import fs from "node:fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config();

// Connect to MongoDb
connectDB();

// Sets server port and initialize express app
const PORT = process.env.PORT || 4000;
const app = express();

// Key and certificate for HTTPS server
let options;
if (process.env.CI) {
  options = {
    key: Buffer.from(process.env.PRIVATE_KEY_B64, "base64"),
    cert: Buffer.from(process.env.CERTIFICATE_B64, "base64"),
  };
} else {
  options = {
    key: fs.readFileSync("keys/privatekey.pem"),
    cert: fs.readFileSync("keys/certificate.pem"),
  };
}

// Helmet used for HTTP security headers
app.use(helmet());

// Parsing incoming JSON
app.use(express.json());

// Parsing cookies
app.use(cookieParser());
app.use(cors({ origin: "https://localhost:5173", credentials: true }));

// Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Setup routing on server
app.use("/api/customer", customerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);

// Create HTTPS server with SSL keys
let server = https.createServer(options, app);

// Start server
server.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);

// =============================== END OF FILE ===============================
