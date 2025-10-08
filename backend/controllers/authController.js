const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const loginUser = async (req, res) => {
  await body("accountNumber").isAlphanumeric().run(req);
  await body("password").isLength({ min: 8 }).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { accountNumber, password } = req.body;
  try {
    const customer = await Customer.findOne({ accountNumber });
    if (!customer) return res.status(401).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, customer.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: customer._id, role: "customer" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, user: { id: customer._id, fullName: customer.fullName, accountNumber } });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

module.exports = { loginUser };
