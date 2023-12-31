import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {  
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        location: String,
        description: String,
        picturePath: String,
        userPicturePath: String,
        //likes would be a map of the type Boolean
        likes: {
            type: Map,
            of: Boolean,
        },
        comments:  [
            { type: mongoose.Types.ObjectId, ref: 'comment' }]
    },
    {
        timestamps: true
    }
);

const Post = mongoose.model("Post", postSchema);

export default Post;

