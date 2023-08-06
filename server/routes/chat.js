import express from "express";
import { 
    accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup} from "../controllers/chat.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();


//--------------CREATE-----------------------
router.route("/").post(verifyToken, accessChat);
router.route("/group").post(verifyToken, createGroupChat);

//----------------READ --------------------
router.route("/").get(verifyToken, fetchChats);

//------------------UPDATE--------------------
router.route("/rename").put(verifyToken, renameGroup);
router.route("/groupremove").put(verifyToken, removeFromGroup);
router.route("/groupadd").put(verifyToken, addToGroup);

export default router;