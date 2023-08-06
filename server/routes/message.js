import express from "express";
import { sendMessage, allMessages} from "../controllers/message.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();


//--------------CREATE-----------------------
router.route("/").post(verifyToken, sendMessage);

//---------------------READ-------------------------
router.route("/:chatId").get(verifyToken, allMessages);

export default router;