import Post from '../models/Post.js';
import Saved from '../models/Saved.js';

/* CREATE */

export const getSavedPosts = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("User Id is: ", id);
    const savedPosts = await Saved.find({ userId: id } );
    res.status(200).json(savedPosts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


/* CREATE */
export const savePost = async (req, res) => {
  try {
    const {userId, postId, category } = req.body;
    console.log(req.body);
    const newSavedPost = new Saved({
      userId,
      postId,
      category,
    });

    await newSavedPost.save();
    res.status(201).json(newSavedPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};
