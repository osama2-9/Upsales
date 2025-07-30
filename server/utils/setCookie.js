import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const setCookie = (res, userId) => {
  if (!userId) {
    throw new Error("User ID is required to set cookie");
  }
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.cookie("auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
};
