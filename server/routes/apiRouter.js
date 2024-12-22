import express from "express"
const apiRouter = express.Router();
// import { init, showList, showDetails } from '../controllers/blogController.js';
import {addComment, likeComment, unlikeComment, getCommentsByPost} from '../controller/commentController.js';
import {addPost, likePost, searchPosts, unlikePost} from '../controller/postController.js';
import {searchUsersByName} from '../controller/userController.js';
import {followUser, unfollowUser} from '../controller/followController.js';
import authRouter from "./authRouter.js"

apiRouter.use("/auth", authRouter);

apiRouter.get("/getCommentsByPost", async(req, res) => {
    try {
        const comments = await getCommentsByPost(req.body.postId);
        return res.status(200).send({ success: true, comment: comments });
    }
    catch (error) {
        console.error('Error getting comments:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.post("/addComment", async (req, res) => {
    try {
        const newComment = await addComment(req.body.authorId, req.body.postId, req.body.content, req.body.typeOfMedia, req.body.urls);
        return res.status(200).send({ success: true, comment: newComment });
    }
    catch (error) {
        console.error('Error getting comments:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.post('/uploadPost', async (req, res) => {
    try {
        if (!req.body.fileId) {
            const {authorId, caption} = req.body;
            try {
                await addPost(authorId, caption);
            }
            catch (error) {
                console.error('Error saving post:', error);
                return res.status(500).send({ success: false });
            }
            return res.status(200).send({ success: true });
        }
        else {
            const {authorId, caption, fileId} = req.body;
            const urls = [fileId];
            await addPost(authorId, caption, "image", urls);
            return res.status(200).send({ success: true });
        }
    }
    catch (error) {
        console.error('Error saving post:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.post('/follow', async (req, res) => {
    try {
        const followers = await followUser(req.body.followerId, req.body.followingId);
        return res.status(200).send({ success: true, followers: followers });
    }
    catch (error) {
        console.error('Error following user:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.post('/unfollow', async (req, res) => {
    try {
        const followers = await unfollowUser(req.body.followerId, req.body.followingId);
        return res.status(200).send({ success: true, followers: followers });
    }
    catch (error) {
        console.error('Error following user:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.post('/likePost', async (req, res) => {
    try {
        const post = await likePost(req.body.postId, req.body.userId);
        return res.status(200).send({ success: true, post: post });
    }
    catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.post('/unlikePost', async (req, res) => {
    try {
        const post = await unlikePost(req.body.postId, req.body.userId);
        return res.status(200).send({ success: true, post: post });
    }
    catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.post('/likeComment', async (req, res) => {
    try {
        const comment = await likeComment(req.body.commentId, req.body.userId);
        return res.status(200).send({ success: true, comment: comment });
    }
    catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.post('/unlikeComment', async (req, res) => {
    try {
        const comment = await unlikeComment(req.body.commentId, req.body.userId);
        return res.status(200).send({ success: true, comment: comment });
    }
    catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.get('/searchPost', async (req, res) => {
    try {
        const posts = await searchPosts(req.body.search_string);
        return res.status(200).send({ success: true, posts: posts });
    }
    catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.get('/searchUser', async (req, res) => {
    try {
        const users = await searchUsersByName(req.body.search_string);
        return res.status(200).send({ success: true, users: users });
    }
    catch (error) {
        console.error('Error searching users:', error);
        return res.status(500).send({ success: false });
    }
});

export default apiRouter;