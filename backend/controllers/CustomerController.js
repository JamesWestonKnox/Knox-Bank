import Customer from "../models/Customer.js";
import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";

//Input validation ensuring that the data matches the certain validation rules before registering the user
export const register = async (req, res) => {
  //Full name must be minimum 3 characters long
  await body("fullName").isLength({ min: 3 }).withMessage("Full name must be atleast 3 characters").run(req);
  //ID number must be 13 digits long
  await body("idNumber").isNumeric().isLength({ min: 13, max: 13 }).withMessage("ID number must be 13 digits").run(req);
  //Account number must be numerical and be between 10 and 12 numbers long
  await body("accountNumber").isNumeric().isLength({ min: 10, max: 12 }).withMessage("Account number must be between 10 to 12 digits").run(req);
  //Password must contain 8 characters, including 1 Capital letter, 1 special character and 1 number
  await body("password").isLength({ min: 8 }).withMessage("Password must be atleast 8 characters").matches(/\d/).withMessage("Password must contain 1 number").matches(/[A-Z]/).withMessage("Password must contain 1 Uppercase character").matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain 1 special character").run(req); 

  //Checking for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  //Getting the data from the from the form
  const { fullName, idNumber, accountNumber, password } = req.body;

  //Checking if the user already exists or the account numebr is already in use
    try {
      const existingCustomer = await Customer.findOne({ accountNumber });

      if (existingCustomer) {
        return res.status(400).json({ error: "Account number already in use" });
      }
    //Hashing the password 
    const hashedPassword = await bcrypt.hash(password, 10);
    //Creating a new customer
    const newCustomer = new Customer({fullName,idNumber,accountNumber, passwordHash: hashedPassword});
    //Saving the customer to the database
    await newCustomer.save();
    
    //Sending a success message to form
    res.status(201).json({ customer: { id: newCustomer._id, fullName, accountNumber } });
  } catch (err) {
    //Error message
    res.status(500).json({ error: "Server error: " + err.message });
  }
};
