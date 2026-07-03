const db = require("../config/db");

// Create a new post
const createPost = (req, res) => {

    const { content } = req.body;

    if (!content) {
        return res.status(400).json({
            message: "Content is required"
        });
    }

    const userId = req.user.id;

    const sql = "INSERT INTO posts(user_id, content) VALUES(?, ?)";

    db.query(sql, [userId, content], (err) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: "Post Created Successfully"
        });

    });

};

// Get all posts
const getAllPosts = (req, res) => {

    const sql = `
        SELECT
            posts.id,
            posts.content,
            posts.created_at,
            users.username
        FROM posts
        INNER JOIN users
        ON posts.user_id = users.id
        ORDER BY posts.created_at DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(200).json(results);

    });

};

module.exports = {
    createPost,
    getAllPosts
};