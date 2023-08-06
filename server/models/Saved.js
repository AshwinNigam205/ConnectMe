// Saved.js

import mongoose from 'mongoose';

const savedSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    postId: {
      type: mongoose.Types.ObjectId,
      ref: 'Post', // Refers to the Post model
    },
    category: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Saved = mongoose.model('Saved', savedSchema);

export default Saved;
