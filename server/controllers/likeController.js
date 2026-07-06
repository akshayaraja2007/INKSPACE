const db = require("../config/db");

// Like a Post
const likePost = (req, res) => {

    const userId = req.user.id;
    const postId = req.params.postId;

    // Check whether user already liked this post
    db.query(
        "SELECT * FROM likes WHERE user_id = ? AND post_id = ?",
        [userId, postId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (results.length > 0) {
                return res.status(400).json({
                    message: "You already liked this post"
                });
            }

            db.query(
                "INSERT INTO likes(user_id, post_id) VALUES(?, ?)",
                [userId, postId],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.status(201).json({
                        message: "Post Liked Successfully"
                    });

                }
            );

        }
    );

};

// Unlike a Post
const unlikePost = (req, res) => {

    const userId = req.user.id;
    const postId = req.params.postId;

    db.query(
        "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
        [userId, postId],
        (err) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                message: "Post Unliked Successfully"
            });

        }
    );

};

// Get Like Count
const getLikeCount = (req, res) => {

    const postId = req.params.postId;

    db.query(
        "SELECT COUNT(*) AS likes FROM likes WHERE post_id = ?",
        [postId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json(results[0]);

        }
    );

};

// Check Like Status
const getLikeStatus = (req, res) => {

    const userId = req.user.id;
    const postId = req.params.postId;

    db.query(
        "SELECT * FROM likes WHERE user_id = ? AND post_id = ?",
        [userId, postId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                liked: results.length > 0
            });

        }
    );

};

module.exports = {
    likePost,
    unlikePost,
    getLikeCount,
    getLikeStatus
};