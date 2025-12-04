import express from "express";
import { googleAuth, resetPassword, sendOtp, signIn, signOut, signUp, verifyOtp } from "../controller/auth.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/signup", upload.single("profilePicture"), signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.post("/googleauth", upload.single("profilePicture"), googleAuth);
router.post("/sendotp",sendOtp);
router.post("/verifyotp",verifyOtp);
router.post("/resetpassword",resetPassword);

export default router;
