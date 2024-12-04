import express from "express"
const apiRouter = express.Router();
import {getAllComments, addComment, deleteComment, likeComment, getCommentsByAuthor} from '../controller/commentController.js';
import {addPost, getAllPosts, getFollowPosts, likePost, searchPosts} from '../controller/postController.js';
import authRouter from "./authRouter.js"
import { verifyToken } from '../middleware/verifyToken.js';
import jwt from 'jsonwebtoken';

apiRouter.use("/auth", authRouter);


apiRouter.post("/addComment",verifyToken, async (req, res) => {
    const token = req.cookies.access_token
    if (!token) {
        console.log("No token")
        return res.status(401).json({ error: 'Not logged in' })
    }
    
    const decoded = jwt.verify(token, process.env.SECRET_KEY);  
 
    try {
        const newComment = await addComment(decoded.id, req.body.postId, req.body.content, req.body.typeOfMedia, req.body.urls);
        return res.status(200).send({ success: true, comment: newComment });
    }
    catch (error) {
        console.error('Error getting comments:', error);
        return res.status(500).send({ success: false });
    }
});

//API
apiRouter.post('/uploadPost',verifyToken, async (req, res) => {
    const token = req.cookies.access_token
    if (!token) {
        console.log("No token")
        return res.status(401).json({ error: 'Not logged in' })
    }
    
    const decoded = jwt.verify(token, process.env.SECRET_KEY);  
 
    try {
        if (!req.body.fileId) {
            const {caption} = req.body;
            try {
                await addPost(decoded.id, caption);
            }
            catch (error) {
                console.error('Error saving post:', error);
                return res.status(500).send({ success: false });
            }
            return res.status(200).send({ success: true });
        }
        else {
            const {caption, fileId} = req.body;
            const urls = [fileId];
            await addPost(decoded.id, caption, "image", urls);
            return res.status(200).send({ success: true });
        }
    }
    catch (error) {
        console.error('Error saving post:', error);
        return res.status(500).send({ success: false });
    }
});

//API
apiRouter.get('/followapi', async (req, res) => {
    try {
        const followers = await getFollowing("6744872f1e74c42b292cf196");
        console.log("Followers: ", followers);
    }
    catch (error) {
        console.error('Error following user:', error);
        return res.status(500).send({ success: false });
    }
    return res.status(200).send({ success: true });
});

//API
apiRouter.get('/likePost', async (req, res) => {
    try {
        const post = await likePost("674be85ad25f6193dd96dd27", "6744872f1e74c42b292cf201");
        console.log("Post liked: ", post);
    }
    catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).send({ success: false });
    }
    return res.status(200).send({ success: true });
});

//API
apiRouter.get('/searchPost', async (req, res) => {
    try {
        const posts = await searchPosts("Programmed screen");
        console.log(posts);
    }
    catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).send({ success: false });
    }
    return res.status(200).send({ success: true });
});

export default apiRouter;