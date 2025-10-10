/**
 * authController.js
 * 
 * This file handles the authentication of users for logging in to the banking portal
 * 
 * Reference:
 * OpenAI, 2025. ChatGPT [Computer program]. Version GPT-5 mini. 
 * Available at: https://chat.openai.com
 */

import Customer from "../models/Customer.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import dotenv from "dotenv";
dotenv.config();

//Method allowing the user to login
export const login = async (req, res) => {
  await body("accountNumber").isNumeric().isLength({min: 10, max: 12}).withMessage("Account number must be 10 to 12 digits").run(req); //Validating account number
  
  //Ensuring password is 8 characters, includes 1 special character, 1 capital letter and 1 number
  await body("password").isLength({ min: 8 }).withMessage("Password must be atleast 8 characters").matches(/\d/).withMessage("Password must contain 1 number").matches(/[A-Z]/).withMessage("Password must contain 1 Uppercase character").matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain 1 special character").run(req); 

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
      { id: customer._id, fullName: customer.fullName, accountNumber : customer.accountNumber},
      process.env.JWT_SECRET,
      { expiresIn: "15m" } //jwt token only lasts for 15 minutes
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, 
    });

    //Success response
    res.json({ user: { id: customer._id, fullName: customer.fullName, accountNumber } });
  } catch (err) {
    
    //Error response if errors occur
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// =============================== END OF FILE ===============================