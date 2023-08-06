import express from "express";
import {getUser, getUserFriends, searchUser, addRemoveFriend} from "../controllers/users.js";
import {verifyToken} from "../middleware/auth.js";

// Express Routers are a way to organize your Express application such that your primary app.js file does not become bloated and difficult to reason about. As you’re building an Express application or API, you’ll soon notice that the routes continue to pile up in app.js. This makes the file quite long and hard to read. As we add functionality to an application, this file would get long and cumbersome. The solution to this in Express is Routers. Routers are like mini versions of Express applications. They provide functionality for handling route matching, requests, and sending responses, but they do not start a separate server or listen on their own ports. Routers use all the .get(), .put(), .post(), and .delete() routes that you are now familiar with.
const router = express.Router();

//--------------READ---------------
router.get("/search", verifyToken, searchUser);
//This is basically making a get call to the browser for a specific user id
//We verify the user's JWT token to see if they are logged in
//Then we call getUser that will display info of the user they are trying to access
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);


//-----------------UPDATE------------
//.patch allows you to update database
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
// router.patch('/:id', verifyToken, updateUser);

export default router;