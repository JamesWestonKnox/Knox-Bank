const Transaction = require("../models/Transaction");
const { body, validationResult } = require("express-validator");

const createTransaction = async (req, res) => {
  await body("amount").isFloat({ gt: 0 }).run(req);
  await body("currency").isAlpha().isLength({ min: 3, max: 3 }).run(req);
  await body("provider").isAlpha().run(req);
  await body("payeeAccount").isAlphanumeric().run(req);
  await body("swift").isAlphanumeric().isLength({ min: 8, max: 11 }).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { amount, currency, provider, payeeAccount, swift } = req.body;
  const customerId = req.user.id;

  try {
    const newTransaction = new Transaction({
      customer: customerId,
      amount,
      currency,
      provider,
      payeeAccount,
      swift
    });

    await newTransaction.save();

    res.status(201).json({ transaction: newTransaction });
  } 
  catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

const getMyTransactions = async (req, res) => {
  const customerId = req.user.id;
  try {
    const transactions = await Transaction.find({ customer: customerId }).sort({ createdAt: -1 });
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

module.exports = { createTransaction, getMyTransactions };
