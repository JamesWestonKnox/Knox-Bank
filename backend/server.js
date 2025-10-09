import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/api/customer", customerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
