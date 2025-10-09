const Transaction = require("../models/Transaction");
const { body, validationResult } = require("express-validator");

//Method to create a new transaction
const createTransaction = async (req, res) => {
  //Input validation
  //Amount must be greater than 0
  await body("amount").isFloat({ gt: 0 }).withMessage("Has to be greater than 0").run(req);
  //Currency must be from our prepopulated currencies
  await body("currency").isIn(["ZAR","USD","EUR"]).withMessage("Currency must be ZAR, USD, or EUR").run(req);
  //Provide must be from our prepopulated currencies
  await body("provider").isIn(["FNB","ABSA","Capitec", "Standard Bank"]).withMessage("Provider must be one of the allowed banks").run(req);
  //Payye account number must be between 10 and 12 digits long
  await body("payeeAccount").isNumeric().isLength({ min: 10, max: 12 }).withMessage("Account number must be 10 to 12 digits").run(req);
  //Swift code must be alphanumeric and between 8 and 11 characters long
  await body("swift").isAlphanumeric().isLength({ min: 8, max: 11 }).withMessage("SWIFT code must be 8 to 11 digits").run(req);

   //Checking for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  //Getting the data from the from the form
  const { amount, currency, provider, payeeAccount, swift } = req.body;
  const customerId = req.user.id;

  //Trying to create a new transaction
  try {
    const newTransaction = new Transaction({customer: customerId, amount, currency, provider, payeeAccount, swift});
    //Saving the transaction to the database
    await newTransaction.save();
    //Sending success response back to form
    res.status(201).json({ transaction: newTransaction });
  } 
  //Error message if it does not work
  catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

//Method to get all the transactions related to the user
const getTransactions = async (req, res) => {
  //Getting customer ID from the form
  const customerId = req.user.id;
  try {
    //Trying to get the customer transactions
    const transactions = await Transaction.find({ customer: customerId }).sort({ createdAt: -1 });
    //Sending transactions back to form
    res.json({ transactions });
  } catch (err) {
    //Error message 
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

module.exports = { createTransaction, getTransactions };
