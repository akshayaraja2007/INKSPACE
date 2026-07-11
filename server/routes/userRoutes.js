const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
    getMyProfile,
    updateMyProfile,
    getUserProfile,
    getUserPosts,
    searchUsers
} = require("../controllers/userController");

// ================================
// Get Logged-in User Profile
// ================================
router.get(
    "/profile",
    verifyToken,
    getMyProfile
);

// ================================
// Update Logged-in User Profile
// ================================
router.put(
    "/profile",
    verifyToken,
    upload.single("profile_picture"),
    updateMyProfile
);

// ================================
// Search Users
// Example:
// /api/users/search?username=ak
// ================================
router.get(
    "/search",
    searchUsers
);

// ================================
// Get Another User's Posts
// ================================
router.get(
    "/:id/posts",
    getUserPosts
);

// ================================
// Get Another User's Profile
// ================================
router.get(
    "/:id",
    getUserProfile
);

module.exports = router;