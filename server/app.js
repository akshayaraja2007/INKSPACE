const db = require("./config/db");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const verifyToken = require("./middleware/auth");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
    res.send("🚀 InkSpace API is running");
});
app.get("/api/profile", verifyToken, (req, res) => {

    res.json({
        message: "Protected Route",
        user: req.user
    });

});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});