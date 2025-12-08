import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import upload from "../middleware/multer.js";
import { createVideo } from "../controller/video.controller.js";

const router = express.Router();

//Video Routes
router.post("/create-video",verifyUser,upload.fields([
    {name:"video",maxCount:1},
    {name:"thumbnail",maxCount:1},
]),createVideo)

export default router;