import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import { createVideo } from "../controller/video.controller.js";
import { uploadBoth } from '../middleware/multer.js';
import { createShort } from "../controller/short.controller.js";

const router = express.Router();

//Video Routes
router.post(
    "/create-video",
    verifyUser,
    uploadBoth.fields([
        { name: "video", maxCount: 1 },
        { name: "thumbnail", maxCount: 1 }
    ]),
    createVideo
);

// Short Routes
router.post(
    "/create-short",
    verifyUser,
    uploadBoth.single("shortUrl"),
    createShort
);

export default router;