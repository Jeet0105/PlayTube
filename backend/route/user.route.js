import express from "express";
import { createChannel, getAllChannelData, getChannelData, getCurrentUser, getSubscribedData, toggleSubscribe, updateChannel } from "../controller/user.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";
import { uploadBoth } from "../middleware/multer.js";

const router = express.Router();

router.get("/get-user", verifyUser, getCurrentUser);
router.post("/createchannel", verifyUser, uploadBoth.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 }
]), createChannel);
router.get("/get-channel", verifyUser, getChannelData);
router.put("/updatechannel", verifyUser, uploadBoth.fields([
    { name: "avatar", maxCount: 1 },
    { name: "banner", maxCount: 1 }
]), updateChannel);
router.post("/togglesubscribe",verifyUser,toggleSubscribe);
router.get("/allchannel",verifyUser,getAllChannelData);
router.get("/subscribed-data",verifyUser,getSubscribedData)

export default router;