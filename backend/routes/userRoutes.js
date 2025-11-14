// backend/routes/userRoutes.js

const express = require('express');
// updateUserProfile ko import karein
const {
  registerUser,
  loginUser,
  followUser,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// PUT /api/users/:id/follow (Follow/Unfollow karna)
router.put('/:id/follow', protect, followUser);

// --- YEH NAYA ROUTE HAI ---
// PUT /api/users/profile (Profile update karna)
// Hum yahan :id nahi le rahe hain, kyunki 'protect' middleware
// token se user ko nikaal kar req.user mein daal dega.
router.put('/profile', protect, updateUserProfile);


module.exports = router;
