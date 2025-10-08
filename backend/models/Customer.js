const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  idNumber: { type: String, required: true },
  accountNumber: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Customer", CustomerSchema);
