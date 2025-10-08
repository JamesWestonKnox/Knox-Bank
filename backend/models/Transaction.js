const Transaction = {
  id: Number,
  customerId: Number,
  amount: Number,
  currency: String,
  provider: String,
  payeeAccount: String,
  swift: String,
  status: "PENDING",
  createdAt: Date,
};

module.exports = Transaction;

