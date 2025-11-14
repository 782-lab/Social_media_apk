// backend/controllers/userController.js

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

// Token generate function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// --- 1. User Register ---
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        followers: user.followers,
        following: user.following,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

// --- 2. User Login ---
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
        followers: user.followers,
        following: user.following,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};


// --- 3. Follow/Unfollow User ---
const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userToFollow._id.equals(currentUser._id)) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const isFollowing = currentUser.following.some((id) =>
      id.equals(userToFollow._id)
    );

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter(
        (id) => !id.equals(userToFollow._id)
      );
      userToFollow.followers = userToFollow.followers.filter(
        (id) => !id.equals(currentUser._id)
      );
    } else {
      // Follow
      currentUser.following.push(userToFollow._id);
      userToFollow.followers.push(currentUser._id);
    }

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      _id: currentUser._id,
      name: currentUser.name,
      email: currentUser.email,
      profilePic: currentUser.profilePic,
      followers: currentUser.followers,
      following: currentUser.following,
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- YEH NAYA FUNCTION HAI ---
// --- 4. Update User Profile ---
// (PPT: Profile Management - edit information)
const updateUserProfile = async (req, res) => {
  try {
    // 1. User ko middleware se dhoondhna
    const user = await User.findById(req.user._id);

    if (user) {
      // 2. Data ko update karna
      user.name = req.body.name || user.name;
      user.profilePic = req.body.profilePic || user.profilePic;
      
      // Note: Hum yahan password update nahi kar rahe hain,
      // uske liye alag se "change password" flow banta hai.

      // 3. User ko save karna
      const updatedUser = await user.save();

      // 4. Frontend ko naya data (token ke saath) bhejna
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        followers: updatedUser.followers,
        following: updatedUser.following,
        token: req.headers.authorization.split(' ')[1], // Purana token hi waapas bhej do
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Naye function ko export karna
module.exports = { registerUser, loginUser, followUser, updateUserProfile };