const controller = {};
import mongoose, { mongo } from "mongoose";
import Post from  "../model/post.js";
import Follow from "../model/follow.js";
import Comment from "../model/comment.js";
import { formatPostDate } from "../utils/postUtils.js"
import jwt from "jsonwebtoken";

const init = async (req, res, next) => {
    next();
};

const getAllPosts = async () => {
    try {
        const posts = await Post.find()
            .populate('author_id', 'username profile_pic_url full_name')
            .sort({ created_at: -1 });
        posts.forEach(post => {
            const { formattedDate, timeAgo } = formatPostDate(post.created_at);
            post.modified_created_at = formattedDate;
            post.timeAgo = timeAgo;
        });
        return posts;
    } catch (error) {
        console.error('Error getting all posts:', error);
        return null;
    }
}

const getFollowPosts = async (userId) => {
    try {
        const following = await Follow.find({ follower_id: userId });
        const followingIds = following.map(follow => follow.following_id);
        const posts = await Post.find({ 
            author_id: { $in: followingIds } 
        })
        .populate('author_id', 'username profile_pic_url full_name')
        .sort({ created_at: -1 });

        posts.forEach(post => {
            const { formattedDate, timeAgo } = formatPostDate(post.created_at);
            post.modified_created_at = formattedDate;
            post.timeAgo = timeAgo;
        });
        
        return posts;
    } catch (error) {
        console.error('Error getting follow posts:', error);
        return null;
    }
};

const getPostById = async (req, res) => {
    const postId = req.params.id;
    const token = req.cookies.access_token;

    if (!token) {
        return res.redirect('/signin');
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const post = await Post.findById(postId).populate('author_id', 'username profile_pic_url full_name');
        const { formattedDate, timeAgo } = formatPostDate(post.created_at);
        post.modified_created_at = formattedDate;
        post.timeAgo = timeAgo;
        if (!post) {
            return res.status(404).send('Post not found');
        }

        const comments = await Comment.find({ post_id: postId })
            .populate('author_id', '_id username profile_pic_url full_name')
            .sort({ created_at: -1 });

        res.locals.title = `${post.content} • flow`;
        console.log('User:', decoded);
        console.log('Post:', comments);
        res.render('post', {
            post,
            comments,
            user: decoded,
        });
    } catch (error) {
        console.error('Error fetching post or comments:', error);
        res.status(500).send('Internal Server Error');
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

const likePost = async (postId, userId) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $addToSet: { likes: userId } }, 
            { new: true }  
        );
        return updatedPost;
    } catch (error) {
        console.error('Error liking post:', error);
        return null;
    }
};

const unlikePost = async (postId, userId) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $pull: { likes: userId } },
            { new: true }
        );
        return updatedPost;
    } catch (error) {
        console.error('Error unliking post:', error);
        return null;
    }
}

const searchPosts = async (searchString) => {
    try {
        const posts = await Post.find({ $text: { $search: searchString } })
            .populate('author_id', 'username profile_pic_url full_name')
            .sort({ created_at: -1 });

        posts.forEach(post => {
            const { formattedDate, timeAgo } = formatPostDate(post.created_at);
            post.modified_created_at = formattedDate;
            post.timeAgo = timeAgo;
        });
        return posts;
    } catch (error) {
        console.error('Error searching posts:', error);
        return null;
    }
};

export { init, getAllPosts, getFollowPosts, getPostById, addPost, getPostsByAuthor, deletePostById, likePost, searchPosts, unlikePost };
