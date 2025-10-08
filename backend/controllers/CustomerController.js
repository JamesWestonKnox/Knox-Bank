const Customer = require("../models/Customer");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");

const registerCustomer = async (req, res) => {
  await body("fullName").isLength({ min: 3 }).run(req);
  await body("idNumber").isNumeric().isLength({ min: 6 }).run(req);
  await body("accountNumber").isAlphanumeric().isLength({ min: 6 }).run(req);
  await body("password").isLength({ min: 8 }).matches(/\d/).matches(/[A-Z]/).run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { fullName, idNumber, accountNumber, password } = req.body;
  try {
    const existingCustomer = await Customer.findOne({ accountNumber });
    if (existingCustomer) return res.status(400).json({ error: "Account number already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = new Customer({
      fullName,
      idNumber,
      accountNumber,
      passwordHash: hashedPassword
    });

    await newCustomer.save();

    res.status(201).json({ customer: { id: newCustomer._id, fullName, accountNumber } });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

module.exports = { registerCustomer };
