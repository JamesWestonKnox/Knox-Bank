/**
 * Transaction.js
 *
 * Transaction schema for MongoDB
 *
 * Reference:
 * OpenAI, 2025. ChatGPT [Computer program]. Version GPT-5 mini.
 * Available at: https://chat.openai.com
 */

import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    provider: { type: String, required: true },
    payeeAccount: { type: String, required: true },
    swift: { type: String, required: true },
    status: { type: String, default: "PENDING" },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", TransactionSchema);

// =============================== END OF FILE ===============================
