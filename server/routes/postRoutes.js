const express = require("express");

const router = express.Router();

const verifyToken = require("../middleware/auth");

const {
    createPost
} = require("../controllers/postController");

router.post("/", verifyToken, createPost);

module.exports = router;