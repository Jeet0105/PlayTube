import express from "express";
import { googleAuth, signIn, signOut, signUp } from "../controller/auth.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/signup", upload.single("profilePicture"), signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);
router.post("/googleauth", upload.single("profilePicture"), googleAuth);

export default router;
