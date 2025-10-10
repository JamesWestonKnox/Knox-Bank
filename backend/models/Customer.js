/**
 * Customer.js
 * 
 * Customer schema for MongoDB
 * 
 * Reference:
 * OpenAI, 2025. ChatGPT [Computer program]. Version GPT-5 mini. 
 * Available at: https://chat.openai.com
 */

import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Customer", CustomerSchema);

// =============================== END OF FILE ===============================