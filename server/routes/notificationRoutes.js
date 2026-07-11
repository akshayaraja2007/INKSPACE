const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");

const {
    getNotifications,
    markAsRead
} = require("../controllers/notificationController");

// Get My Notifications
router.get(
    "/",
    verifyToken,
    getNotifications
);

// Mark Notification as Read
router.put(
    "/:id",
    verifyToken,
    markAsRead
);

module.exports = router;