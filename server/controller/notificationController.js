const controller = {};
import Notification from '../model/notification.js';
import Post from '../model/post.js';
import Comment from '../model/comment.js';
import User from '../model/user.js';

const init = async (req, res, next) => {
    next();
};

const getNotificationsById = async (userId) => {
    try {
        const notifications = await Notification.find({ receiver_id: userId })
            .populate('sender_id', 'username profile_pic_url')
            .sort({ created_at: -1 });
        return notifications;
    } catch (error) {
        console.error('Error getting notifications:', error);
        return [];
    }
};

const getAllNotificationsOfUser = async (userId) => {
    try {
        const notifications = await Notification.find({ receiver_id: userId })
            .populate('sender_id', 'username profile_pic_url')
            .sort({ created_at: -1 });

        const commentAttachmentIds = notifications
            .filter(({ type }) => type === 'like_comment')
            .map(({ attachment }) => attachment)
            .filter(Boolean);

        const postAttachmentIds = notifications
            .filter(({ type }) => ['like_post', 'comment_post'].includes(type))
            .map(({ attachment }) => attachment)
            .filter(Boolean);

        const [comments, posts] = await Promise.all([
            Comment.find({ _id: { $in: commentAttachmentIds } }, 'content media _id post_id'),
            Post.find({ _id: { $in: postAttachmentIds } }, 'content media _id')  
        ]);

        console.log(notifications);
        return notifications.map(notification => ({
            ...notification.toObject(),
            attachment:
                notification.type === 'like_comment'
                    ? comments.find(({ _id }) => _id.equals(notification.attachment)) || null
                    : ['like_post', 'comment_post'].includes(notification.type)
                    ? posts.find(({ _id }) => _id.equals(notification.attachment)) || null
                    : null
        }));
    } catch (error) {
        console.error('Error getting all notifications:', error);
        return null;
    }
};

const getUnreadNotifications = async (userId) => {
    try {
        const unreadNotifications = await Notification.find({
            status: 'unread',
        })
            .populate('sender_id', 'username profile_pic_url')
            .sort({ created_at: -1 });

        console.log(unreadNotifications);
        return unreadNotifications;
    } catch (error) {
        console.error('Error getting unread notifications:', error);
        return [];
    }
};

const getUnreadNotificationsByUserId = async (userId) => {
    try {
        const unreadNotifications = await Notification.find({
            receiver_id: userId,
            status: 'unread',
        })
            .populate('sender_id', 'username profile_pic_url')
            .sort({ created_at: -1 });

        return unreadNotifications;
    } catch (error) {
        console.error('Error getting unread notifications:', error);
        return [];
    }
};

export { init, getNotificationsById, getUnreadNotifications, getAllNotificationsOfUser};
