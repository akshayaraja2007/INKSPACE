const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");

const {
    createComment,
    getComments,
    updateComment,
    deleteComment
} = require("../controllers/commentController");

// Create Comment
router.post("/:postId", verifyToken, createComment);

// Get Comments
router.get("/:postId", getComments);

// Update Comment
router.put("/:id", verifyToken, updateComment);

// Delete Comment
router.delete("/:id", verifyToken, deleteComment);

module.exports = router;