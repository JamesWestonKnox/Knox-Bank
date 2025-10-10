/**
 * authController.js
 * 
 * This file provides a function for validation user registration using regex patterns
 * 
 * Reference:
 * OpenAI, 2025. ChatGPT [Computer program]. Version GPT-5 mini. 
 * Available at: https://chat.openai.com
 */

export const validateRegistration = (req, res, next) => {
  const { fullName, idNumber, accountNumber, email, password } = req.body;

  const nameRegex = /^[a-zA-Z ]{3,50}$/;
  const idRegex = /^[0-9]{13}$/;
  const accRegex = /^[0-9]{10,12}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex = /^.{6,}$/;

  if (!nameRegex.test(fullName)) return res.status(400).json({ error: "Invalid full name" });
  if (!idRegex.test(idNumber)) return res.status(400).json({ error: "Invalid ID number" });
  if (!accRegex.test(accountNumber)) return res.status(400).json({ error: "Invalid account number" });
  if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email" });
  if (!passRegex.test(password)) return res.status(400).json({ error: "Password too short" });

  next();
};

// =============================== END OF FILE ===============================