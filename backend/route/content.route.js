import express from "express";
import { verifyUser } from "../middleware/verifyUser.js";
import { addComment, addReply, createVideo, getAllVideos, incrementView, toggleDislike, toggleLike, toggleSave } from "../controller/video.controller.js";
import { uploadBoth } from '../middleware/multer.js';
import { addCommentShort, addReplyShort, createShort, getAllShorts, getShortComments, incrementViewShort, toggleDislikeShort, toggleLikeShort, toggleSaveShort } from "../controller/short.controller.js";

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
router.get("/getallvideos", verifyUser, getAllVideos);
router.patch("/videos/:videoId/like", verifyUser, toggleLike);
router.patch("/videos/:videoId/dislike", verifyUser, toggleDislike);
router.patch("/videos/:videoId/save", verifyUser, toggleSave);
router.patch("/videos/:videoId/views", incrementView);
router.post("/videos/:videoId/comments", verifyUser, addComment);
router.post("/videos/:videoId/comments/:commentId/replies", verifyUser, addReply);

// Short Routes
router.post(
    "/create-short",
    verifyUser,
    uploadBoth.single("shortUrl"),
    createShort
);
router.get("/getallshorts", verifyUser, getAllShorts);
router.patch("/shorts/:shortId/like", verifyUser, toggleLikeShort);
router.patch("/shorts/:shortId/dislike", verifyUser, toggleDislikeShort);
router.patch("/shorts/:shortId/save", verifyUser, toggleSaveShort);
router.patch("/shorts/:shortId/views", incrementViewShort);
router.post("/shorts/:shortId/comments", verifyUser, addCommentShort);
router.post("/shorts/:shortId/comments/:commentId/replies", verifyUser, addReplyShort);
router.get("/shorts/:shortId/get-comments",  verifyUser, getShortComments);


export default router;