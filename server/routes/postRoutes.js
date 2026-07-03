const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
    createPost,
    getAllPosts,
    getSinglePost
} = require("../controllers/postController");

// Create Post
router.post("/", verifyToken, upload.single("image"), createPost);

// Get All Posts
router.get("/", getAllPosts);

// Get Single Post
router.get("/:id", getSinglePost);

module.exports = router;