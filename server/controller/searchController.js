const controller = {};
import mongoose, { mongo } from "mongoose";
import Post from  "../model/post.js";
import Follow from "../model/follow.js";
import User from "../model/user.js";
import Comment from "../model/comment.js";
import { formatPostDate } from "../utils/postUtils.js"
import jwt from "jsonwebtoken";

const init = async (req, res, next) => {
    next();
};

const getAllFoundUsers = async (userId, keyword) => {
    try {
        const users = await User.find({ username: { $regex: keyword, $options: 'i' } });

        const filteredUsers = users.filter(user => user._id.toString() !== userId.toString());

        for (const user of filteredUsers) {
            const followersCount = await Follow.countDocuments({ following_id: user._id });
            user.followers = followersCount;

            const isFollowing = await Follow.findOne({ follower_id: userId, following_id: user._id });
            user.isFollowed = !!isFollowing;
        }

        return filteredUsers;
    } catch (error) {
        console.error('Error getting found users:', error);
        return null;
    }
};

const getAllFoundPosts = async (userId, keyword) => {
    try {
        const posts = await Post.find({ content: { $regex: keyword, $options: 'i' } })
            .populate('author_id', 'username profile_pic_url full_name')
            .sort({ created_at: -1 });

        for (const post of posts) {
            const { formattedDate, timeAgo } = formatPostDate(post.created_at);
            post.modified_created_at = formattedDate;
            post.timeAgo = timeAgo;

            post.isLiked = post.likes.some(like => like.toString() === userId.toString());

            const commentsLength = await Comment.countDocuments({ post_id: post._id });
            post.comments_length = commentsLength;
        }

        return posts;
    } catch (error) {
        console.error('Error getting found posts:', error);
        return null;
    }
};

export { init, getAllFoundUsers, getAllFoundPosts };