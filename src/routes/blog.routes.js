const express = require("express");
const { createPost, getPosts, updatePost, deletePost, getPublishPosts, getPost, getPostByID } = require("../controllers/blog.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();
router.post("/post/create", authMiddleware, createPost);
router.get("/post/list", authMiddleware, getPosts);
router.get("/post/all", getPublishPosts);
router.get("/post/:slug", getPost);

router.get("/post/user/:id", authMiddleware, getPostByID);
router.put("/post/:id", authMiddleware, updatePost);
router.delete("/post/:id", authMiddleware, deletePost);

module.exports = router;
