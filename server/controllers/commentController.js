const db = require("../config/db");

// Create Comment
const createComment = (req, res) => {

    const userId = req.user.id;
    const postId = req.params.postId;
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({
            message: "Comment is required"
        });
    }

    const sql = `
        INSERT INTO comments(user_id, post_id, comment)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [userId, postId, comment], (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: "Comment Added Successfully",
            commentId: result.insertId
        });

    });

};
// Get Comments of a Post
const getComments = (req, res) => {

    const postId = req.params.postId;

    const sql = `
        SELECT
            comments.id,
            comments.comment,
            comments.created_at,
            users.username
        FROM comments
        INNER JOIN users
        ON comments.user_id = users.id
        WHERE comments.post_id = ?
        ORDER BY comments.created_at ASC
    `;

    db.query(sql, [postId], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(200).json(results);

    });

};
// Update Comment
const updateComment = (req, res) => {

    const commentId = req.params.id;
    const userId = req.user.id;
    const { comment } = req.body;

    if (!comment) {
        return res.status(400).json({
            message: "Comment is required"
        });
    }

    db.query(
        "SELECT * FROM comments WHERE id = ?",
        [commentId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Comment not found"
                });
            }

            const existingComment = results[0];

            if (existingComment.user_id !== userId) {
                return res.status(403).json({
                    message: "Unauthorized"
                });
            }

            db.query(
                "UPDATE comments SET comment = ? WHERE id = ?",
                [comment, commentId],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.json({
                        message: "Comment Updated Successfully"
                    });

                }
            );

        }
    );

};
// Delete Comment
const deleteComment = (req, res) => {

    const commentId = req.params.id;
    const userId = req.user.id;

    db.query(
        "SELECT * FROM comments WHERE id = ?",
        [commentId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Comment not found"
                });
            }

            const existingComment = results[0];

            if (existingComment.user_id !== userId) {
                return res.status(403).json({
                    message: "Unauthorized"
                });
            }

            db.query(
                "DELETE FROM comments WHERE id = ?",
                [commentId],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.json({
                        message: "Comment Deleted Successfully"
                    });

                }
            );

        }
    );

};

module.exports = {
    createComment,
    getComments,
    updateComment,
    deleteComment
};