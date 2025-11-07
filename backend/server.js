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

const USE_HTTPS = process.env.CI !== "true";

if (USE_HTTPS) {
  const options = {
    key: fs.readFileSync("keys/privatekey.pem"),
    cert: fs.readFileSync("keys/certificate.pem"),
  };
  const server = https.createServer(options, app);
  server.listen(PORT, () =>
    console.log(`HTTPS server running on port ${PORT}`)
  );
} else {
  app.listen(PORT, () =>
    console.log(`HTTP server running on port ${PORT} (CI)`)
  );
}

// Helmet used for HTTP security headers
app.use(helmet());

// Parsing incoming JSON
app.use(express.json());

// Parsing cookies
app.use(cookieParser());

if (process.env.CI === "true") {
  app.use(cors({ origin: true, credentials: true }));
} else {
  app.use(cors({ origin: "https://localhost:5173", credentials: true }));
}

// Rate limiting
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Setup routing on server
app.use("/api/customer", customerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);

// =============================== END OF FILE ===============================
