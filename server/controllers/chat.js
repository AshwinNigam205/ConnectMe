import Chat from "../models/Chat.js";
import User from "../models/User.js";
import mongoose from "mongoose";


//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
export const accessChat = async (req, res) => {
  const { userId } = req.body;
  // console.log("Logged-in User ID:", req.user.id);

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  //$elemMatch basically matches the element of an array
  //$eq means equal to
  //.populate("users", "-password") means populate with user info except password
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");


  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "firstName lastName picturePath email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (err) {
      res.status(400).json({message: err.message});
    }
  }
}

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
// export const fetchChats = async (req, res) => {
//   try {
//    Chat.find({
//       $or: [
//         { users: { $elemMatch: { $eq: req.user._id } } },
//         { isGroupChat: true, "groupAdmin": req.user._id }
//       ]
//     })
//       .populate("users", "-password")
//       .populate("groupAdmin", "-password")
//       .populate("latestMessage")
//       .sort({ updatedAt: -1 })
//       .then(async (results) => {
//         results = await User.populate(results, {
//           path: "latestMessage.sender",
//           select: "firstName lastName picturePath email",
//         });
//         res.status(200).send(results);
//       });
//   } catch (err) {
//     res.status(400).json({message: err.message});
//   }
// }
export const fetchChats = async (req, res) => {
  try {
    const results = await Chat.find({ 
      $or: [
        { users: { $elemMatch: { $eq: req.user.id } } }, // Individual chats where user is involved
        { isGroupChat: true, users: { $elemMatch: { $eq: req.user.id } } }, // Group chats where user is a member
      ],
      })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

      // console.log(results); 

    // If you want to populate the latestMessage.sender field as well
    await User.populate(results, {
      path: "latestMessage.sender",
      select: "firstName lastName picturePath email",
    });

    res.status(200).json(results);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// //@description     Create New Group Chat
// //@route           POST /api/chat/group
// //@access          Protected
// export const createGroupChat = async (req, res) => {

//   console.log("Hello");
//   console.log(req.body);

//   if (!req.body.users || !req.body.name) {
//     return res.status(400).send({ message: "Please Fill all the feilds" });
//   }

//   var users = JSON.parse(req.body.users);
//   console.log(users);

//   // Convert user IDs from strings to MongoDB ObjectId
//   const userObjectIds = users.map((userId) => new mongoose.Types.ObjectId(userId));

//   // Add the current user's ObjectId to the array
//   userObjectIds.push(new mongoose.Types.ObjectId(req.user._id));

//   // var users = req.body.users;
//   // let users = req.body.users; // Ensure that req.body.users is a JSON string
//   // if (typeof users === "string") {
//   //   users = JSON.parse(users); // Convert JSON string to array
//   // }

//   // if (!Array.isArray(users)) {
//   //   return res
//   //     .status(400)
//   //     .send({ message: "Invalid users data. Expecting an array of user IDs." });
//   // }

//   if (users.length < 2) {
//     return res
//       .status(400)
//       .send("More than 2 users are required to form a group chat");
//   }

//   // users.push(req.user);

//   try {
//     const groupChat = await Chat.create({
//       chatName: req.body.name,
//       users: userObjectIds,
//       isGroupChat: true,
//       groupAdmin: new mongoose.Types.ObjectId(req.user),
//     });

//     const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
//       .populate("users", "-password")
//       .populate("groupAdmin", "-password");

//     res.status(200).json(fullGroupChat);
//   } catch (err) {
//     res.status(400).json({message: err.message});
//   }
// };



export const createGroupChat = async (req, res) => {
  const { users, name } = req.body;
  console.log(req.body);

  if (!users || !name) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }

  const userObjectIds = JSON.parse(users).map((userId) => new mongoose.Types.ObjectId(userId));

  // Add the current user's ObjectId to the array
  // userObjectIds.push(new mongoose.Types.ObjectId(req.user._id));
  // console.log(userObjectIds);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: userObjectIds,
      isGroupChat: true,
      groupAdmin: userObjectIds[0],
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



// // @desc    Rename Group
// // @route   PUT /api/chat/rename
// // @access  Protected
export const renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404).json({message: err.message});
  } else {
    res.json(updatedChat);
  }
}

// // @desc    Remove user from Group
// // @route   PUT /api/chat/groupremove
// // @access  Protected
export const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404).json("Cant Remove");
  } else {
    res.json(removed);
  }
}

// // @desc    Add user to Group / Leave
// // @route   PUT /api/chat/groupadd
// // @access  Protected
export const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404).json("Cant Add!");
  } else {
    res.json(added);
  }
}