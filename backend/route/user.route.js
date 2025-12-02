import express from "express";
import { getCurrentUser } from "../controller/user.controller.js";
import { verifyUser } from "../middleware/verifyUser.js";

const router = express.Router();

router.get("/get-user", verifyUser, getCurrentUser);

export default router;