const db = require("../config/db");

// Follow User
const followUser = (req, res) => {

    const followerId = req.user.id;
    const followingId = req.params.userId;

    // Prevent following yourself
    if (followerId == followingId) {
        return res.status(400).json({
            message: "You cannot follow yourself"
        });
    }

    // Check if already following
    db.query(
        "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
        [followerId, followingId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    message: "Already following this user"
                });
            }

            db.query(
                "INSERT INTO follows(follower_id, following_id) VALUES(?, ?)",
                [followerId, followingId],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.status(201).json({
                        message: "User Followed Successfully"
                    });

                }
            );

        }
    );

};
// Unfollow User
const unfollowUser = (req, res) => {

    const followerId = req.user.id;
    const followingId = req.params.userId;

    db.query(
        "DELETE FROM follows WHERE follower_id = ? AND following_id = ?",
        [followerId, followingId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "You are not following this user"
                });
            }

            res.json({
                message: "User Unfollowed Successfully"
            });

        }
    );

};
// Get Followers
const getFollowers = (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT
            users.id,
            users.username,
            users.bio,
            users.profile_picture
        FROM follows
        INNER JOIN users
        ON follows.follower_id = users.id
        WHERE follows.following_id = ?
        ORDER BY users.username
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        const followers = results.map(user => ({
            ...user,
            profile_picture: user.profile_picture
                ? `http://localhost:5000/uploads/${user.profile_picture}`
                : null
        }));

        res.json(followers);

    });

};
// Get Following
const getFollowing = (req, res) => {

    const userId = req.params.userId;

    const sql = `
        SELECT
            users.id,
            users.username,
            users.bio,
            users.profile_picture
        FROM follows
        INNER JOIN users
        ON follows.following_id = users.id
        WHERE follows.follower_id = ?
        ORDER BY users.username
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        const following = results.map(user => ({
            ...user,
            profile_picture: user.profile_picture
                ? `http://localhost:5000/uploads/${user.profile_picture}`
                : null
        }));

        res.json(following);

    });

};
// Check Follow Status
const getFollowStatus = (req, res) => {

    const followerId = req.user.id;
    const followingId = req.params.userId;

    db.query(
        "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?",
        [followerId, followingId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                following: results.length > 0
            });

        }
    );

};
module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowStatus
};