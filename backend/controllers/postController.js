// backend/controllers/postController.js

const Post = require('../models/postModel');
const User = require('../models/userModel');

// --- 1. Naya Post Banana ---
const createPost = async (req, res) => {
  try {
    const { text, image } = req.body;
    if (!text) {
      res.status(400);
      throw new Error('Post text is required');
    }
    const newPost = new Post({
      user: req.user._id,
      text,
      image,
    });
    const savedPost = await newPost.save();
    
    // Naye post ko user info ke saath populate karke bhejna
    const populatedPost = await savedPost.populate('user', 'name profilePic');
    res.status(201).json(populatedPost); // Updated response

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- 2. Saare Posts Dikhana (Feed ke liye) ---
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      // Hum yahan comments ke user ko bhi populate kar rahe hain
      .populate('user', 'name profilePic')
      .populate('comments.user', 'name profilePic'); // <-- YEH NAYI LINE HAI

    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- 3. Post ko Like/Unlike karna ---
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userIndex = post.likes.findIndex((id) => id.equals(req.user._id));

    if (userIndex > -1) {
      post.likes.splice(userIndex, 1);
    } else {
      post.likes.push(req.user._id);
    }
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// --- YEH NAYA FUNCTION HAI ---
// --- 4. Naya Comment Add karna ---
// (PPT: ...engage through comments)
const addComment = async (req, res) => {
  try {
    // 1. URL se post ID aur body se comment text lena
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // 2. Naya comment object banana
    const newComment = {
      text: text,
      user: req.user._id, // 'protect' middleware se
    };

    // 3. Comment ko post ke 'comments' array mein add karna
    post.comments.push(newComment);

    // 4. Post ko save karna
    await post.save();

    // 5. Frontend ko poora updated post (populated comments ke saath) bhej dena
    // Taa ki naye comment mein user ka naam aur pic dikhe
    await post.populate('comments.user', 'name profilePic');

    res.status(201).json(post.comments); // Sirf comments ka array bhej sakte hain
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


module.exports = { createPost, getAllPosts, likePost, addComment }; // Yahan addComment add karein