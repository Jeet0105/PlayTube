import express from "express";
import rateLimit from "express-rate-limit";
import { googleAuth, resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from "../controller/auth.controller.js";
import { imageUpload } from "../middleware/multer.js";

const router = express.Router();

// Strict limiter for sensitive auth operations
const strictAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Lenient limiter for signout
const signoutLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply strict limiter to sensitive endpoints
router.post("/signup", strictAuthLimiter, imageUpload.single("profilePicture"), signUp);
router.post("/signin", strictAuthLimiter, signIn);
router.post("/googleauth", strictAuthLimiter, imageUpload.single("profilePicture"), googleAuth);
router.post("/sendotp", strictAuthLimiter, sendOtp);
router.post("/verifyotp", strictAuthLimiter, verifyOtp);
router.post("/resetpassword", strictAuthLimiter, resetPassword);

// Apply lenient limiter to signout
router.get("/signout", signoutLimiter, signOut);

export default router;
