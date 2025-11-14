// backend/routes/postRoutes.js

const express = require('express');
// addComment ko import karein
const { createPost, getAllPosts, likePost, addComment } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware'); // Hamara 'gatekeeper'

const router = express.Router();

// POST /api/posts (Naya post banana)
router.post('/', protect, createPost);

// GET /api/posts (Saare posts get karna)
router.get('/', protect, getAllPosts);

// PUT /api/posts/:id/like (Post ko like/unlike karna)
router.put('/:id/like', protect, likePost);

// --- YEH NAYA ROUTE HAI ---
// POST /api/posts/:id/comment (Naya comment add karna)
router.post('/:id/comment', protect, addComment);


module.exports = router;