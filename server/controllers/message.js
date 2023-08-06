import Chat from "../models/Chat.js";
import User from "../models/User.js";
import ChatMessage from "../models/ChatMessage.js";

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
export const allMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ chat: req.params.chatId })
      .populate("sender", "firstName lastName picturePath email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user.id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await ChatMessage.create(newMessage);

    message = await message.populate("sender", "firstName lastName picturePath");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "firstName lastName picturePath email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};
