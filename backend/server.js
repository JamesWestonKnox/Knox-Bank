import express from "express";
import https from "https";
import dotenv from "dotenv";
import helmet from "helmet";
import fs from "fs";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config();
connectDB();

const PORT = process.env.PORT || 4000;
const app = express();
const options = {
    key: fs.readFileSync('keys/privatekey.pem'),
    cert: fs.readFileSync('keys/certificate.pem')
}

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers','*');
    res.setHeader('Access-Control-Allow-Methods','*');
    next();
})
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/api/customer", customerRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/transaction", transactionRoutes);

let server = https.createServer(options,app);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
