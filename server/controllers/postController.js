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
// Update Post
const updatePost = (req, res) => {

    const postId = req.params.id;
    const userId = req.user.id;
    const { content } = req.body;

    const image = req.file ? req.file.filename : null;

    // Check if the post exists
    db.query(
        "SELECT * FROM posts WHERE id = ?",
        [postId],
        (err, results) => {

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

            // Allow only the owner
            if (post.user_id !== userId) {
                return res.status(403).json({
                    message: "Unauthorized"
                });
            }

            const updatedContent =
                content || post.content;

            const updatedImage =
                image || post.image;

            db.query(
                `UPDATE posts
                 SET content = ?, image = ?
                 WHERE id = ?`,
                [updatedContent, updatedImage, postId],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.json({
                        message: "Post Updated Successfully"
                    });

                }
            );

        }
    );

};
// Delete Post
const deletePost = (req, res) => {

    const postId = req.params.id;
    const userId = req.user.id;

    // Check whether the post exists
    db.query(
        "SELECT * FROM posts WHERE id = ?",
        [postId],
        (err, results) => {

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

            // Allow only the owner
            if (post.user_id !== userId) {
                return res.status(403).json({
                    message: "Unauthorized"
                });
            }

            db.query(
                "DELETE FROM posts WHERE id = ?",
                [postId],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.status(200).json({
                        message: "Post Deleted Successfully"
                    });

                }
            );

        }
    );

};
// Home Feed
// Home Feed
const getHomeFeed = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            posts.id,
            posts.content,
            posts.image,
            posts.created_at,

            users.id AS user_id,
            users.username,
            users.profile_picture,

            COUNT(DISTINCT l1.id) AS likes,
            COUNT(DISTINCT comments.id) AS comments,

            CASE
                WHEN MAX(l2.id) IS NULL THEN FALSE
                ELSE TRUE
            END AS liked

        FROM follows

        INNER JOIN posts
            ON follows.following_id = posts.user_id

        INNER JOIN users
            ON posts.user_id = users.id

        LEFT JOIN likes l1
            ON posts.id = l1.post_id

        LEFT JOIN comments
            ON posts.id = comments.post_id

        LEFT JOIN likes l2
            ON posts.id = l2.post_id
            AND l2.user_id = ?

        WHERE follows.follower_id = ?

        GROUP BY posts.id

        ORDER BY posts.created_at DESC
    `;

    db.query(sql, [userId, userId], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        const feed = results.map(post => ({
            ...post,

            liked: Boolean(post.liked),

            image: post.image
                ? `http://localhost:5000/uploads/${post.image}`
                : null,

            profile_picture: post.profile_picture
                ? `http://localhost:5000/uploads/${post.profile_picture}`
                : null
        }));

        res.status(200).json(feed);

    });

};
module.exports = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost,
    getHomeFeed
};