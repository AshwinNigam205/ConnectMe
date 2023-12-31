//Allows to encrypt password
import bcrypt from "bcrypt";
//Allows to send user a web token for using it for authorization
import jwt from "jsonwebtoken";
import User from "../models/User.js";


//-------------------------Register User---------------------------------------
//the call will be async as it takes time to fetch data from database
export const register = async (req, res) => {
    try {
        //This object has all the registeration details sent from frontend form
        const{
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body;

        // Bcrypt generates a random encryption
        const salt = await bcrypt.genSalt();
        //Will apply the encryption to our password to get new encrypted password
        const passwordHash = await bcrypt.hash(password, salt);

        //Creating a new user using the data given above
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            //We are giving a random value for viewed profile and impressions.
            //Currently there is no logic for viewed profile and impressions
            // in this project.
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });

        //Save the details of new user
        const savedUser = await newUser.save();
        //Send status code 201 i.e req was successful and a resource is created
        res.status(201).json(savedUser);
        
    } catch (err) {
        res.status(500).json({ error: err.message});
        
    }
};

//-------------Logging In---------------
export const login = async (req, res) => {
    try {
        //Grab email and password when User sends login info via frontend
        const { email, password} = req.body;

        //Uses Mongoose to find the field from User Schema 
        //having this particular email and fetch all details in "user" variable
        const user = await User.findOne({email: email});
        //If user doesn't exist
        if(!user)
        {
            return res.status(400).json({msg: "User does not exist."});
        }

        //If user exists, then match the password
        //What Bcrypt does is that it uses the same salt as before when 
        //it had created the user and it applies to the current entered password.
        //If the encryption is same as before then it means password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        //If wrong password,
        if(!isMatch)
        {
            return res.status(400).json({msg: "Invalid credentials."});
        }
        
        //Create a unique JWT token for the user
        //Created using the Unique Id generated by mongodb for each schema entry
        // and a unique string mentioned in the .ENV file as "JWT_SECRET".
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        //Now delete the password info from the fetched user info so that we dont
        // send it back to the front end
        delete user.password;
        //Sending back the unique Token and user info(w/o password info)
        res.status(200).json({ token, user});  

    } catch (err) {
        res.status(500).json({ error: err.message});
    }
}
