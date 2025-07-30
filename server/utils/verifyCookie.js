import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const verifyCookie = (req, res, next) => {
  const token = req.cookies?.auth;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
