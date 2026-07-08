const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");

const {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowStatus
} = require("../controllers/followController");

// Follow User
router.post("/:userId", verifyToken, followUser);

// Unfollow User
router.delete("/:userId", verifyToken, unfollowUser);

// Get Followers
router.get("/followers/:userId", getFollowers);

// Get Following
router.get("/following/:userId", getFollowing);

// Check Follow Status
router.get("/status/:userId", verifyToken, getFollowStatus);

module.exports = router;