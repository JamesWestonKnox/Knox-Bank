import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authMiddleware = (req, res, next) => {
  try {

    const token = req.cookies?.token || (req.headers["authorization"]?.startsWith("Bearer ")
    ? req.headers["authorization"].split(" ")[1] : null);

    if (!token)
      return res.status(401).json({ error: "Access denied, token missing"});

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired, please log in again" });
    }
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
