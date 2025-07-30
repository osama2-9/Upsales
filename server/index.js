import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { testConnection } from "./prisma/prismaClient.js";
import { authRouter } from "./routes/authRoute.js";
import { mediaRouter } from "./routes/mediaRoute.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://upsales.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/media", mediaRouter);

testConnection();
app.listen(process.env.SERVER_PORT, () => {
  console.log("Server is running " + process.env.SERVER_PORT);
});
