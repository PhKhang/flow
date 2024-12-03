import express from "express"
const apiRouter = express.Router();
// import { init, showList, showDetails } from '../controllers/blogController.js';
import {getAllComments, addComment, deleteComment, likeComment, getCommentsByAuthor} from '../controller/commentController.js';
import {addPost, getAllPosts, getFollowPosts, likePost, searchPosts} from '../controller/postController.js';
// apiRouter.use("/", () => { })
apiRouter.get("/", (req, res) => {
    res.send("API Route")
});
// apiRouter.get("/:id", () => { });

apiRouter.get("/abc", (req, res) => { 
    res.send("API Route test")
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

//API
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