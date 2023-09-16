import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import chatRoutes from "./routes/chat.js";
import savedRoutes from './routes/saved.js';
import messageRoutes from "./routes/message.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from './middleware/auth.js';
import { Server } from "socket.io";
// import User from "./models/User.js";
// import Post from "./models/Post.js";
// import {users, posts} from "./data/index.js";

// ------------CONFIGURATIONS (Includes all middleware and diff pckg config)-------
//Allows you to grab file urls from type modules
const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);         
//To use dotenv files
dotenv.config();
// Invoke Express App
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
//This is basically setting the directory of where we'll keep our assets
app.use("/assets", express.static(path.join(__dirname, "public/assets")));


//-----------------------File Storage----------------------------
//Using multer to save files uploaded onto our website locally
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/assets');
    },
    filename: function (req, file, cb){
        cb(null, file.originalname); 
    }
})

const upload = multer({ storage});


//-------------------Routes With Files-------------------------------------
//The "upload.single("picture")" is a middleware function that will upload a picture onto the public/assets folder
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);



//----------------------------Routes----------------------------
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);
app.use('/saved', savedRoutes);



//----------------------Mongoose Setup---------------------------------
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');

    //ONLY ONE TIME
    //Loading up fake Users and Posts from data file 
    // User.insertMany(users);
    //Post.insertMany(posts);

}).catch((error) => console.log(`${error} did not connect`));


//Server Startup
const server = app.listen(PORT, () => console.log(`Server Port : ${PORT}`));

///----------------------SOCKET.IO--------------
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});


io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  //Creating a new socket, where frontend sends some data and will join a room
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  //Will take room id from frontend
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  //New socket for typing
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    
// In this we check which chat does the message belong to so that we can 
//send it to the appropriate rooms that we created above
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    //If the chat doesnt have any users
    if (!chat.users) return console.log("chat.users not defined");

    //For a grp chat msg should only be sent to others and not self
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});