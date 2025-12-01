import express from "express";
import { signIn, signOut, signUp } from "../controller/auth.controller.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/signup", upload.single("photo"), signUp);
router.post("/signin", signIn);
router.get("/signout", signOut);

export default router;
