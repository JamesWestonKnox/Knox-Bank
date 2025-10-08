const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {

  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({ error: "Access denied, token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied, token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  }
    catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
