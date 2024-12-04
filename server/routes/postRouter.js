import express from "express"
import { getPostById } from '../controller/postController.js';
import {getCommentByPostId} from '../controller/commentController.js';
import { verifyToken } from '../middleware/verifyToken.js';

const postRouter = express.Router();

// Get detail post
postRouter.get("/:postId", async (req, res) => {
    const post = await getPostById(req.params.postId);
    const comments = await getCommentByPostId(req.params.postId);
    if (post) {
        res.locals.post = post;
        res.locals.title = "Post • flow";
        res.locals.comments = comments;
        res.render("post", { currentPath: `/post/${req.params.postId}` });
    } else {
        res.status(404).send("Post not found");
    }
});

export default postRouter;