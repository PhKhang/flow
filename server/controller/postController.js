import mongoose, { mongo } from "mongoose";
import Post from  "../model/post.js";
import Follow from "../model/follow.js";

const getAllPosts = async () => {
    try {
        const posts = await Post.find();
        return posts;
    } catch (error) {
        return null;
    }
}

const getFollowPosts = async (userId) => {
    try {
        // Get all users that userId follows
        const following = await Follow.find({ follower_id: userId });
        console.log('Following:', following);
        const followingIds = following.map(follow => follow.following_id);
        console.log('Following IDs:', followingIds);
        // Get posts from followed users
        const posts = await Post.find({ 
            author_id: { $in: followingIds } 
        })
        .populate('author_id', 'username profile_pic_url fullName')
        .sort({ created_at: -1 });
        console.log('Follow posts:', posts);
        return posts;
    } catch (error) {
        console.error('Error getting follow posts:', error);
        return null;
    }
};

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
