import Post from "../models/Post.js";
import User from "../models/User.js";

//-------------CREATE------------
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath} = req.body;
        const user = await User.findById(userId);

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            //This is the User profile Image
            userPicturePath: user.picturePath,
            //This is the image they want to post
            picturePath,
            likes: {},
            comments: []
        });

        await newPost.save();

        //Now we grab all posts along with new post
        const post = await Post.find();
        res.status(201).json(post);

    } catch (err) {
        res.status(409).json({ message: err.message});
    }
}

//------------------READ------------------
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
        
    } catch (err) {
        res.status(404).json({ message: err.message});
    }
}

export const getUserPosts = async (req, res) => {
    try {

        const { userId } = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
        
    } catch (err) {
        res.status(404).json({ message: err.message});
    }
}

export const getSavedPosts = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const posts = await Post.find({ _id: { $in: id } });
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const {userId} = req.params;
    const posts = await Post.find({'likes.userId': userId});
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({message: err.message});
  }
};

//-------------UPDATE------------------
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        //Grab Post Info
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        //Checking if User has liked the Post or not
        const isLiked = post.likes.get(userId);
        
        
        //If its liked, then unlike it or else, like it
        if(isLiked){
            post.likes.delete(userId);
        }
        else
        {
            post.likes.set(userId, true);
        }

        //Update the post by finding it again and passing new likes
        const updatedPost = await Post.findByIdAndUpdate(
            id, 
            { likes: post.likes},
            { new: true}
        );

        //Update the frontend
        res.status(200).json(updatedPost);
        
    } catch (err) {
        res.status(404).json({ message: err.message});
    }

};

/* CREATE COMMENT */
export const addComment = async (req, res) => {
  try {
    const {id} = req.params;
    const {userId, firstName, lastName, comment} = req.body;
    const post = await Post.findById(id);
    const newComment = {
      userId,
      firstName,
      lastName,
      comment,
    };
    post.comments.push(newComment);
    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({message: err.message});
  }
};
  
  export const getComments = async (req, res) => {
    try {
      const {id} = req.params;
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({error: 'Post not found'});
      }
      const comments = post.comments;
      return res.status(200).json({comments});
    } catch (err) {
      console.error(err);
      return res.status(500).json({error: 'Server error'});
    }
  };