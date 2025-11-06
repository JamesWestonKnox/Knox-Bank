/**
 * Employee.js
 *
 * Employee schema for MongoDB
 *
 * Reference:
 * OpenAI, 2025. ChatGPT [Computer program]. Version GPT-5 mini.
 * Available at: https://chat.openai.com
 */

import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    employeeNumber: { type: String, required: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Employee", EmployeeSchema);

// =============================== END OF FILE ===============================
