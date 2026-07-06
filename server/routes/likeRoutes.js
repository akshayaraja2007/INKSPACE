const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");

const {
    likePost,
    unlikePost,
    getLikeCount,
    getLikeStatus
} = require("../controllers/likeController");

// Like a post
router.post("/:postId", verifyToken, likePost);

// Unlike a post
router.delete("/:postId", verifyToken, unlikePost);

// Get like count
router.get("/:postId", getLikeCount);

// Check if current user liked the post
router.get("/status/:postId", verifyToken, getLikeStatus);

module.exports = router;