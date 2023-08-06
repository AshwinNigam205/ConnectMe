import mongoose from "mongoose";

//To create a mongoose model first we define its schema and then pass 
//it as a parameter in mongoose.model

//User Schema/Table for our database
const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true, //This will be a required field
            min: 2, //min length
            max: 50, //max length
        },
        lastName : {
            type: String,
            required: true, //This will be a required field
            min: 2, //min length
            max: 50, //max length
        },
        email: {
            type: String,
            required: true, //This will be a required field
            max: 50, //max length
            unique: true, //Adding Unique Constraint
        },
        password: {
            type: String,
            required: true, //This will be a required field
            min: 5, //min length
        },
        picturePath: {
            type: String,
            default: "",
        },
        friends: {
            type: Array,
            default: [],
        },
        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number,
    },
    {
        //Gives Dates and Time
        timestamps: true
    }
);
//Creating the User schema in mongoose
const User = mongoose.model("User", UserSchema);
export default User;