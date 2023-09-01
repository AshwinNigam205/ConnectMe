import User from "../models/User.js";

//----------------READ--------------
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message}); 
    }
}

export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        //Promise is basically an object in JS thats completed in a async function 
        // before moving forward in it
        //In this we are grabbing all the friends by their id
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        //Format the information
        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath }) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            } 
        );
        res.status(200).json(formattedFriends);
        
    } catch (err) {
        res.status(404).json({ message: err.message});
    }
}

export const searchUser = async (req, res) => {
    try {
      const { username } = req.query;
      
      if (!username) {
        return res.json({ users: [] });
      }

      // Split the query into first name and last name based on whitespace
      const [firstName, lastName] = username.split(" ");
  
      // Create an array to hold the search conditions
      const searchConditions = [];
  
      // Add search conditions for first name and last name
      if (firstName && lastName) {
        // If both first name and last name are provided, search for exact match
        searchConditions.push({
          $or: [
            { firstName: { $regex: firstName, $options: "i" } },
            { lastName: { $regex: lastName, $options: "i" } },
          ],
        });
      } else {
        // If only one name is provided, search for partial match in both first name and last name
        searchConditions.push({
          $or: [
            { firstName: { $regex: username, $options: "i" } },
            { lastName: { $regex: username, $options: "i" } },
          ],
        });
      }
  
      // Use the User.find method to query the database with the combined search conditions
      const users = await User.find({
        $and: searchConditions,
      })
        .limit(10)
        .select("firstName lastName email picturePath");
  
      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  };
  
  



//------------------UPDATE--------------------------------
export const addRemoveFriend = async (req, res) => {
     try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        //Checking if the friend is part of Users friends list
        if (user.friends.includes(friendId)) {
            //Remove friend Id from Users list
            user.friends = user.friends.filter((id) => id !== friendId);
            //Remove user id from Friends list
            friend.friends = friend.friends.filter((id) => id !== id);
        }
        else
        {
            user.friends.push( friendId );
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath }) => {
                return {_id, firstName, lastName, occupation, location, picturePath};
            } 
        );
        res.status(200).json(formattedFriends);

        
     } catch (err) {
        res.status(404).json({ message: err.message});
     }
};