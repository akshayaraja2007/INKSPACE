const db = require("../config/db");

// ==========================================
// Get Logged-in User Notifications
// ==========================================
const getNotifications = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            notifications.id,
            notifications.sender_id,
            notifications.receiver_id,
            notifications.post_id,
            notifications.type,
            notifications.message,
            notifications.is_read,
            notifications.created_at,

            users.username,
            users.profile_picture

        FROM notifications

        INNER JOIN users
            ON notifications.sender_id = users.id

        WHERE notifications.receiver_id = ?

        ORDER BY notifications.created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        const notifications = results.map(notification => ({

            ...notification,

            profile_picture: notification.profile_picture
                ? `http://localhost:5000/uploads/${notification.profile_picture}`
                : null

        }));

        res.status(200).json(notifications);

    });

};

// ==========================================
// Mark One Notification as Read
// ==========================================
const markAsRead = (req, res) => {

    const notificationId = req.params.id;
    const userId = req.user.id;

    db.query(
        `
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ?
        AND receiver_id = ?
        `,
        [notificationId, userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Notification not found"
                });
            }

            res.json({
                message: "Notification marked as read"
            });

        }
    );

};

// ==========================================
// Mark All Notifications as Read
// ==========================================
const markAllAsRead = (req, res) => {

    const userId = req.user.id;

    db.query(
        `
        UPDATE notifications
        SET is_read = TRUE
        WHERE receiver_id = ?
        `,
        [userId],
        (err) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "All notifications marked as read"
            });

        }
    );

};

// ==========================================
// Delete Notification
// ==========================================
const deleteNotification = (req, res) => {

    const notificationId = req.params.id;
    const userId = req.user.id;

    db.query(
        `
        DELETE FROM notifications
        WHERE id = ?
        AND receiver_id = ?
        `,
        [notificationId, userId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Notification not found"
                });
            }

            res.json({
                message: "Notification deleted successfully"
            });

        }
    );

};

// ==========================================
// Create Notification
// (Used by Like / Comment / Follow)
// ==========================================
const createNotification = (
    senderId,
    receiverId,
    postId,
    type,
    message
) => {

    // Don't notify yourself
    if (senderId === receiverId) return;

    const sql = `
        INSERT INTO notifications
        (
            sender_id,
            receiver_id,
            post_id,
            type,
            message
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            senderId,
            receiverId,
            postId,
            type,
            message
        ],
        (err) => {

            if (err) {
                console.error(
                    "Notification Error:",
                    err.message
                );
            }

        }
    );

};

module.exports = {

    getNotifications,

    markAsRead,

    markAllAsRead,

    deleteNotification,

    createNotification

};