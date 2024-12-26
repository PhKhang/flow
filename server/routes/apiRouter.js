import express from "express"
const apiRouter = express.Router();
// import { init, showList, showDetails } from '../controllers/blogController.js';
import {addComment, likeComment, unlikeComment, getCommentsByPost} from '../controller/commentController.js';
import { getCommentLength, addPost, likePost, searchPosts, unlikePost, getPostsByAuthor, getAllPostsPagination, getFollowPostsPagination} from '../controller/postController.js';
import UserController from '../controller/userController.js';
import {followUser, unfollowUser} from '../controller/followController.js';
import {createNotification, deleteNotification, updateReadStatus, updateUnreadStatus} from '../controller/notificationController.js';
import authRouter from "./authRouter.js"
import { formatPostDate } from "../utils/postUtils.js"
import Follow from "../model/follow.js";

apiRouter.use("/auth", authRouter);

apiRouter.get("/getCommentsByPost", async(req, res) => {
    try {
        const comments = await getCommentsByPost(req.query.postId);
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
            const { authorId, caption } = req.body;
            try {
                const newPost = await addPost(authorId, caption);
                return res.status(200).send({ success: true, post: newPost });
            } catch (error) {
                console.error('Error saving post:', error);
                return res.status(500).send({ success: false });
            }
        } else {
            const { authorId, caption, fileId } = req.body;
            const urls = [fileId];
            try {
                const newPost = await addPost(authorId, caption, "image", urls);
                return res.status(200).send({ success: true, post: newPost });
            } catch (error) {
                console.error('Error saving post:', error);
                return res.status(500).send({ success: false });
            }
        }
    } catch (error) {
        console.error('Error saving post:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.post('/follow', async (req, res) => {
    try {
        const followers = await followUser(req.body.followerId, req.body.followingId);
        const followersCount = await Follow.countDocuments({ following_id: req.body.followingId });

        return res.status(200).send({
            success: true,
            followers: followers,
            followersCount: followersCount  
        });
    }
    catch (error) {
        console.error('Error following user:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.post('/unfollow', async (req, res) => {
    try {
        const followers = await unfollowUser(req.body.followerId, req.body.followingId);
        const followersCount = await Follow.countDocuments({ following_id: req.body.followingId });

        return res.status(200).send({
            success: true,
            followers: followers,
            followersCount: followersCount  
        });
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
        const posts = await searchPosts(req.query.search_string);
        return res.status(200).send({ success: true, posts: posts });
    }
    catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.get('/searchUser', async (req, res) => {
    try {
        const users = await UserController.searchUsersByName(req.query.search_string);
        return res.status(200).send({ success: true, users: users });
    }
    catch (error) {
        console.error('Error searching users:', error);
        return res.status(500).send({ success: false });
    }
});

apiRouter.get('/getPostsByAuthor', async (req, res) => {
    try {
        const posts = await getPostsByAuthor(req.query.authorId);
        const plainPosts = posts.map(post => post.toObject());
        
        // Add the timeAgo property to each plain object
        plainPosts.forEach(post => {
            const { formattedDate, timeAgo } = formatPostDate(post.created_at);
            post.timeAgo = timeAgo;
            post.modified_created_at = formattedDate;
        });

        res.json(plainPosts);
    }
    catch (error) {
        console.error('Error getting posts:', error);
        res.status(500).send({ success: false });
    }
});

apiRouter.get("/posts", async (req, res) => {
    try {
        const { offset = 0, limit = 10, userId } = req.query;
        const posts = await getAllPostsPagination(userId, parseInt(limit), parseInt(offset));
        const plainPosts = posts.map(post => post.toObject());

        // Use Promise.all to wait for all async operations
        await Promise.all(plainPosts.map(async post => {
            const { formattedDate, timeAgo } = formatPostDate(post.created_at);
            post.timeAgo = timeAgo;
            post.modified_created_at = formattedDate;
            post.isLiked = post.likes.some(like => like.toString() === userId.toString());
            post.comments_length = await getCommentLength(post._id);
        }));
        res.json(plainPosts);
    } catch (error) {
        res.status(500).json({ error: 'Error loading posts' });
    }
});

apiRouter.get("/followPosts", async (req, res) => {
    try {
        const { offset = 0, limit = 10, userId } = req.query;
        const posts = await getFollowPostsPagination(userId, parseInt(limit), parseInt(offset));
        const plainPosts = posts.map(post => post.toObject());

        // Use Promise.all to wait for all async operations
        await Promise.all(plainPosts.map(async post => {
            const { formattedDate, timeAgo } = formatPostDate(post.created_at);
            post.timeAgo = timeAgo;
            post.modified_created_at = formattedDate;
            post.isLiked = post.likes.some(like => like.toString() === userId.toString());
            post.comments_length = await getCommentLength(post._id);
        }));
        res.json(plainPosts);
    } catch (error) {
        res.status(500).json({ error: 'Error loading posts' });
    }
});

apiRouter.post('/createNotification', createNotification);

apiRouter.post('/deleteNotification', deleteNotification);

apiRouter.post('/updateReadStatus', updateReadStatus);

apiRouter.post('/updateUnreadStatus', updateUnreadStatus);


export default apiRouter;