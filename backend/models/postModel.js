// backend/models/postModel.js

const mongoose = require('mongoose');

// Yeh humara "Post" ka structure hai (PPT ke Content Sharing ke hisaab se)
const postSchema = mongoose.Schema(
  {
    // Har post ek user se juda hoga
    user: {
      type: mongoose.Schema.Types.ObjectId, // User ki ID
      required: true,
      ref: 'User', // 'User' model se refer kar rahe hain
    },
    text: {
      type: String,
      required: true,
    },
    // PPT: Post updates with... images
    image: {
      type: String,
      required: false, // Image zaroori nahi hai
    },
    // PPT: ...like posts
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId, // Jo users like karenge, unki ID
        ref: 'User',
      },
    ],
    // PPT: ...engage through comments
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Yeh 'createdAt' aur 'updatedAt' add karega
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;