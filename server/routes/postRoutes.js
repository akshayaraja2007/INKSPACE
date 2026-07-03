const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");

const {
    createPost,
    getAllPosts
} = require("../controllers/postController");

// Create Post (Protected)
router.post("/", verifyToken, createPost);

// Get All Posts (Public)
router.get("/", getAllPosts);

module.exports = router;