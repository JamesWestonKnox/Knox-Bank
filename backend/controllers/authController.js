const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

//Method allowing the user to login
const login = async (req, res) => {
  await body("accountNumber").isNumeric().isLength({min: 10, max: 12}).run(req); //Validating account number
  //Ensuring password is 8 characters, includes 1 special character, 1 capital letter and 1 number
  await body("password").isLength({ min: 8 }).matches(/\d/).matches(/[A-Z]/).matches(/[!@#$%^&*(),.?":{}|<>]/).run(req); 

  //Checking for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  //Getting the fields from the form
  const { accountNumber, password } = req.body;
  //Trying to find the corrosponding user to the account number
  try {
    const customer = await Customer.findOne({ accountNumber });
    //If account number is not found then error message
    if (!customer) return res.status(401).json({ error: "Account number incorrect or user does not exist" });
    //If there is a user with account number, then checking if passwords match
    const valid = await bcrypt.compare(password, customer.passwordHash);
    //If passwords don't match, error message sent
    if (!valid) return res.status(401).json({ error: "Incorrect password" });

    //Creating a jwt token to keep the user logged in
    const token = jwt.sign(
      { id: customer._id, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } //jwt token only lasts for 15 minutes
    );

    //Success response
    res.json({ token, user: { id: customer._id, fullName: customer.fullName, accountNumber } });
  } catch (err) {
    //Error response if errors occur
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

module.exports = { login };
