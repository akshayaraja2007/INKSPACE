const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");

const {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} = require("../controllers/notificationController");

// ==========================================
// Get Logged-in User Notifications
// GET /api/notifications
// ==========================================
router.get(
    "/",
    verifyToken,
    getNotifications
);

// ==========================================
// Mark All Notifications as Read
// PUT /api/notifications/read-all
// ==========================================
router.put(
    "/read-all",
    verifyToken,
    markAllAsRead
);

// ==========================================
// Mark Single Notification as Read
// PUT /api/notifications/:id
// ==========================================
router.put(
    "/:id",
    verifyToken,
    markAsRead
);

// ==========================================
// Delete Notification
// DELETE /api/notifications/:id
// ==========================================
router.delete(
    "/:id",
    verifyToken,
    deleteNotification
);

module.exports = router;