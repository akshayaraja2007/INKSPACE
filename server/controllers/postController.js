const db = require("../config/db");

const createPost = (req, res) => {

    const { content } = req.body;

    if (!content) {
        return res.status(400).json({
            message: "Content is required"
        });
    }

    const userId = req.user.id;

    const sql =
        "INSERT INTO posts(user_id,content) VALUES(?,?)";

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

module.exports = {
    createPost
};