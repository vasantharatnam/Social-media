import express from "express";
import { userAuth } from "../middleware/authMiddleware.mjs";
import {
    commentPost,
    getPosts,
    createPost,
    deletePost,
    getComments,
    getPost,
    getUserPost,
    likePost,
    likePostComment,
    replyPostComment
} from "../controllers/postController.mjs";

const Postrouter = express.Router();

// crete post
Postrouter.post("/create-post", userAuth, createPost);
// get posts
Postrouter.post("/", userAuth, getPosts);
Postrouter.post("/:id", userAuth, getPost);

Postrouter.post("/get-user-post/:id", userAuth, getUserPost);

// get comments
Postrouter.get("/comments/:postId", getComments);

//like and comment on posts
Postrouter.post("/like/:id", userAuth, likePost);
Postrouter.post("/like-comment/:id/:rid?", userAuth, likePostComment);
Postrouter.post("/comment/:id", userAuth, commentPost);
Postrouter.post("/reply-comment/:id", userAuth, replyPostComment);

//delete post
Postrouter.delete("/:id", userAuth, deletePost);

export { Postrouter };