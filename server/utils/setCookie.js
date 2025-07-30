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
    maxAge: 1000 * 60 * 60 * 72,
    secure: true,
    sameSite: "None",
  });
};
