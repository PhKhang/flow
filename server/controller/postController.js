import mongoose, { mongo } from "mongoose";
import Post from  "../model/post.js";

const getAllPosts = async () => {
    try {
        const posts = await Post.find();
        return posts;
    } catch (error) {
        return null;
    }
}

const getFollowPosts = async () => {
    try {
        const posts = await Post.find();
        return posts;
    } catch (error) {
        return null;
    }
}

const addPost = async (authorId, content, typeOfMedia, urls, likes) => {
    const newPost = new Post({
        author_id: authorId, 
        content,
        media: {
            type: typeOfMedia || 'none',
            urls: urls || []
        },
        likes: likes || []
    });

    try {
        await newPost.save();
        console.log('Post created:', newPost);
        return newPost;
    } catch (error) {
        console.error('Error saving post:', error);
        return null;
    }
};


const getPostsByAuthor = async (authorId) => {
    try {
        const posts = await Post.find({ authorId }).populate('authorId', 'username fullName');
        return posts;
    } catch (error) {
        return null;
    }
}

const deletePostById = async (postId) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        return deletedPost;
    } catch (error) {
        return null;
    }
}

export { getAllPosts, getFollowPosts, addPost, getPostsByAuthor, deletePostById };
