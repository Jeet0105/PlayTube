import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./route/auth.route.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Chill for a bit and try again.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Global rate limiter (applies to all routes)
app.use(limiter);

// Core middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Serve static local files (e.g., Multer uploads)
app.use("/public", express.static("public"));

// Test route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// API routes
app.use("/api/v1/auth", authRoutes);

// Server boot
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
