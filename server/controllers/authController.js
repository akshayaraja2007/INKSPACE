const bcrypt = require("bcrypt");
const db = require("../config/db");

const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql =
            "INSERT INTO users(username,email,password) VALUES(?,?,?)";

        db.query(sql, [username, email, hashedPassword], (err) => {

            if (err) {

                return res.status(500).json({
                    error: err.message
                });

            }

            return res.status(201).json({
                message: "User Registered Successfully"
            });

        });

    } catch (error) {

        return res.status(500).json({
            error: error.message
        });

    }
};

module.exports = {
    register
};