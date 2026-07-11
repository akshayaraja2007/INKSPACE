const db = require("../config/db");

// Get Notifications of Logged-in User
const getNotifications = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            notifications.id,
            notifications.type,
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

// Mark Notification as Read
const markAsRead = (req, res) => {

    const notificationId = req.params.id;

    db.query(
        "UPDATE notifications SET is_read = TRUE WHERE id = ?",
        [notificationId],
        (err) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Notification marked as read"
            });

        }
    );

};

module.exports = {
    getNotifications,
    markAsRead
};