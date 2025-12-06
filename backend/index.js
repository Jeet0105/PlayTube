import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./route/auth.route.js";
import userRoutes from "./route/user.route.js";
import { errorHandler, asyncHandler } from "./middleware/errorHandler.js";
import { validateEnv } from "./middleware/validateEnv.js";
import { securityMiddleware, additionalSecurityHeaders } from "./middleware/security.js";

dotenv.config();

// Validate environment variables
validateEnv();

const app = express();
const port = process.env.PORT || 8000;
const nodeEnv = process.env.NODE_ENV || "development";

// Security middleware
app.use(securityMiddleware);
app.use(additionalSecurityHeaders);

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Global rate limiter (applies to all routes except auth which has its own)
app.use(generalLimiter);

// Core middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: nodeEnv === "production" 
    ? process.env.CLIENT_URL?.split(",") || []
    : process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Serve static local files (e.g., Multer uploads)
app.use("/public", express.static("public"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    environment: nodeEnv,
  });
});

// API info endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PlayTube API",
    version: "1.0.0",
    environment: nodeEnv,
    endpoints: {
      auth: "/api/v1/auth",
      user: "/api/v1/user",
    },
  });
});

// API routes
// Auth routes have their own rate limiting applied in the route file
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Server boot
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`📦 Environment: ${nodeEnv}`);
      console.log(`🌐 Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
