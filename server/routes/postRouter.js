import express from 'express';
import { init, getAllPosts, getPostById } from '../controller/postController.js';

const postRouter = express.Router();

postRouter.use("/", init);
postRouter.get("/", getAllPosts);
postRouter.get("/:id", getPostById);

export default postRouter;