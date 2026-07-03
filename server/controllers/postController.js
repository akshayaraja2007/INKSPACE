const db = require("../config/db");

// Create Post
const createPost = (req, res) => {

    const { content } = req.body;

    const userId = req.user.id;

    const image = req.file ? req.file.filename : null;

    if (!content && !image) {
        return res.status(400).json({
            message: "Post must contain text or image."
        });
    }

    const sql = `
        INSERT INTO posts (user_id, content, image)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [userId, content || null, image], (err, result) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: "Post Created Successfully",
            postId: result.insertId
        });

    });

};

// Get All Posts
const getAllPosts = (req, res) => {

    const sql = `
        SELECT
            posts.id,
            posts.content,
            posts.image,
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

        const posts = results.map(post => ({
            ...post,
            image: post.image
                ? `http://localhost:5000/uploads/${post.image}`
                : null
        }));

        res.status(200).json(posts);

    });

};
// Get Single Post
const getSinglePost = (req, res) => {

    const postId = req.params.id;

    const sql = `
        SELECT
            posts.id,
            posts.content,
            posts.image,
            posts.created_at,
            users.username
        FROM posts
        INNER JOIN users
        ON posts.user_id = users.id
        WHERE posts.id = ?
    `;

    db.query(sql, [postId], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        const post = results[0];

        if (post.image) {
            post.image = `http://localhost:5000/uploads/${post.image}`;
        }

        res.status(200).json(post);

    });

};
module.exports = {
    createPost,
    getAllPosts,
    getSinglePost
};