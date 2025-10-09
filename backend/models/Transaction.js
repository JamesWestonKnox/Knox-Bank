import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  provider: { type: String, required: true },
  payeeAccount: { type: String, required: true },
  swift: { type: String, required: true },
  status: { type: String, default: "PENDING" },
}, { timestamps: true });

export default mongoose.model("Transaction", TransactionSchema);
