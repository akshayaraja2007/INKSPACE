const db = require("../config/db");

// Get Logged-in User Profile
const getMyProfile = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            id,
            username,
            email,
            bio,
            profile_picture,
            created_at
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = results[0];

        if (user.profile_picture) {
            user.profile_picture =
                `http://localhost:5000/uploads/${user.profile_picture}`;
        }

        res.json(user);

    });

};
// Update Logged-in User Profile
const updateMyProfile = (req, res) => {

    const userId = req.user.id;

    const { username, bio } = req.body;

    const profilePicture =
        req.file ? req.file.filename : null;

    db.query(
        "SELECT * FROM users WHERE id = ?",
        [userId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const user = results[0];

            const updatedUsername =
                username || user.username;

            const updatedBio =
                bio || user.bio;

            const updatedProfilePicture =
                profilePicture || user.profile_picture;

            const sql = `
                UPDATE users
                SET
                    username = ?,
                    bio = ?,
                    profile_picture = ?
                WHERE id = ?
            `;

            db.query(
                sql,
                [
                    updatedUsername,
                    updatedBio,
                    updatedProfilePicture,
                    userId
                ],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.json({
                        message: "Profile Updated Successfully"
                    });

                }
            );

        }
    );

};
// Get Another User Profile
const getUserProfile = (req, res) => {

    const userId = req.params.id;

    const sql = `
        SELECT
            id,
            username,
            bio,
            profile_picture,
            created_at
        FROM users
        WHERE id = ?
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = results[0];

        if (user.profile_picture) {
            user.profile_picture =
                `http://localhost:5000/uploads/${user.profile_picture}`;
        }

        res.json(user);

    });

};
// Get All Posts of a User
const getUserPosts = (req, res) => {

    const userId = req.params.id;

    const sql = `
        SELECT
            id,
            content,
            image,
            created_at
        FROM posts
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        const posts = results.map(post => ({
            ...post,
            image: post.image
                ? `http://localhost:5000/uploads/${post.image}`
                : null
        }));

        res.json(posts);

    });

};

module.exports = {
    getMyProfile,
    updateMyProfile,
    getUserProfile,
    getUserPosts
};