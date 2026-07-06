const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
    getMyProfile,
    updateMyProfile,
    getUserProfile,
    getUserPosts
} = require("../controllers/userController");

// My Profile
router.get("/profile", verifyToken, getMyProfile);

// Update My Profile
router.put(
    "/profile",
    verifyToken,
    upload.single("profile_picture"),
    updateMyProfile
);

// Another User Profile
router.get("/:id", getUserProfile);

// Another User Posts
router.get("/:id/posts", getUserPosts);

module.exports = router;