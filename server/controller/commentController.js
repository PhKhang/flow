import mongoose from "mongoose";
import Comment from "../model/comment.js";
import { formatPostDate } from "../utils/postUtils.js";

const getAllComments = async (postId) => {
    try {
        const comments = await Comment.find({ post_id: postId })
            .populate('author_id', 'username profile_pic_url full_name')
            .sort({ created_at: -1 });
            
        comments.forEach(comment => {
            const { formattedDate, timeAgo } = formatPostDate(comment.created_at);
            comment.modified_created_at = formattedDate;
            comment.timeAgo = timeAgo;
        });
        
        return comments;
    } catch (error) {
        console.error('Error getting comments:', error);
        return null;
    }
};

const addComment = async (authorId, postId, content, typeOfMedia, urls) => {
    const newComment = new Comment({
        author_id: authorId,
        post_id: postId,
        content,
        media: {
            type: typeOfMedia || 'none',
            urls: urls || []
        },
        likes: []
    });

    try {
        await newComment.save();
        console.log('Comment created:', newComment);
        return newComment;
    } catch (error) {
        console.error('Error saving comment:', error);
        return null;
    }
};

const deleteComment = async (commentId) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(commentId);
        return deletedComment;
    } catch (error) {
        console.error('Error deleting comment:', error);
        return null;
    }
};

const likeComment = async (commentId, userId) => {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $addToSet: { likes: userId } },
            { new: true }
        );
        return updatedComment;
    } catch (error) {
        console.error('Error liking comment:', error);
        return null;
    }
};

const unlikeComment = async (commentId, userId) => {
    try {
        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { $pull: { likes: userId } },
            { new: true }
        );
        return updatedComment;
    }
    catch (error) {
        console.error('Error unliking comment:', error);
        return null;
    }
};

const getCommentId = async (postId, authorId) => {
    try {
        const comment = await Comment.findOne({ post_id: postId, author_id: authorId });
        return comment;
    } catch (error) {
        console.error('Error getting comment:', error);
        return null;
    }
};

const getCommentsByAuthor = async (authorId) => {
    try {
        const comments = await Comment.find({ author_id: authorId })
            .populate('author_id', 'username profile_pic_url full_name')
            .populate('post_id')
            .sort({ created_at: -1 });
        return comments;
    } catch (error) {
        console.error('Error getting author comments:', error);
        return null;
    }
};

export { 
    getAllComments, 
    addComment, 
    deleteComment, 
    likeComment, 
    getCommentsByAuthor 
};
