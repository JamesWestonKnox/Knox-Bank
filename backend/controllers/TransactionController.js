/**
 * transactionController.js
 *
 * This file handles the validation and creation of new transactions
 *
 * Reference:
 * OpenAI, 2025. ChatGPT [Computer program]. Version GPT-5 mini.
 * Available at: https://chat.openai.com
 */

import Transaction from "../models/Transaction.js";
import { body, validationResult } from "express-validator";

const allowedCurrencies = [
  "ZAR",
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CNY",
];
const allowedProviders = [
  "FNB",
  "ABSA",
  "Capitec",
  "Standard Bank",
  "Nedbank",
  "Investec",
  "TymeBank",
  "Discovery Bank",
  "Old Mutual Bank",
];
// Validation for transaction inputs
export const validateTransaction = [
  body("amount")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a number greater than 0"),
  body("currency")
    .isIn(allowedCurrencies)
    .withMessage("Currency must be ZAR, USD, or EUR"),
  body("provider")
    .isIn(allowedProviders)
    .withMessage("Provider must be a valid bank"),
  body("payeeAccount")
    .isNumeric()
    .isLength({ min: 10, max: 12 })
    .withMessage("Payee account must be 10–12 digits"),
  body("swift")
    .isAlphanumeric()
    .isLength({ min: 8, max: 11 })
    .withMessage("SWIFT code must be 8–11 alphanumeric characters"),
];

//Method to create new transaction
export const createTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    //Getting data from the body
    const { amount, currency, provider, payeeAccount, swift } = req.body;

    //Creating a new transaction object with the data
    const transaction = new Transaction({
      customer: req.user.id,
      amount,
      currency,
      provider,
      payeeAccount,
      swift,
    });

    //Saving it to the database
    await transaction.save();

    res.status(201).json({ transaction });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

//Method to get all transactions
export const getTransactions = async (req, res) => {
  try {
    //Retrieving all transactions related to the customer and sorting it newest first
    const transactions = await Transaction.find({ customer: req.user.id }).sort(
      { createdAt: -1 }
    );
    res.json({ transactions });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// =============================== END OF FILE ===============================
