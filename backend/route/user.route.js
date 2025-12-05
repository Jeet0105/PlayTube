import express from "express";
import { createChannel, getCurrentUser } from "../controller/user.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.get("/get-user", verifyUser, getCurrentUser);
router.post("/createchannel", verifyUser, upload.fields([
    { name: "avatar", maxCount:1 },
    { name: "banner", maxCount:1 }
]), createChannel);

export default router;