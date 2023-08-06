import mongoose from "mongoose";

const chatmessageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const ChatMessage = mongoose.model("Message", chatmessageSchema);
export default ChatMessage;