const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
    createPost,
    getAllPosts,
    getHomeFeed,
    getSinglePost,
    updatePost,
    deletePost
} = require("../controllers/postController");

// ======================================
// Create Post (Protected)
// ======================================
router.post(
    "/",
    verifyToken,
    upload.single("image"),
    createPost
);

// ======================================
// Home Feed (Protected)
// Shows posts only from followed users
// ======================================
router.get(
    "/feed",
    verifyToken,
    getHomeFeed
);
// ======================================
// Explore (Public)
// Shows all posts
// ======================================
router.get(
    "/",
    getAllPosts
);

// ======================================
// Get Single Post (Public)
// ======================================
router.get(
    "/:id",
    getSinglePost
);

// ======================================
// Update Post (Protected)
// ======================================
router.put(
    "/:id",
    verifyToken,
    upload.single("image"),
    updatePost
);

// ======================================
// Delete Post (Protected)
// ======================================
router.delete(
    "/:id",
    verifyToken,
    deletePost
);

module.exports = router;