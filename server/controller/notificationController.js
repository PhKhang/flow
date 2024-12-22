const controller = {};
import Notification from '../model/notification.js';
import Post from '../model/post.js';
import Comment from '../model/comment.js';
import User from '../model/user.js';

const init = async (req, res, next) => {
    next();
};

const getNotificationDetails = async (notificationId) => {
    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            throw new Error('Notification not found');
        }

        let attachmentDetails;
        switch (notification.type) {
            case 'like_post':
            case 'comment_post':
                attachmentDetails = await Post.findById(notification.attachment);
                break;
            case 'like_comment':
                attachmentDetails = await Comment.findById(notification.attachment);
                break;
            case 'following':
                attachmentDetails = await User.findById(notification.attachment);
                break;
            default:
                throw new Error('Unknown notification type');
        }

        return {
            ...notification.toObject(),
            attachmentDetails,
        };
    } catch (error) {
        console.error('Error getting notification details:', error);
        return null;
    }
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

const getAllNotifications = async () => {
    try {
        const notifications = await Notification.find()
            .populate('sender_id', 'username profile_pic_url')
            .sort({ created_at: -1 });
        console.log('Notifications:', notifications);
        return notifications;
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


export { init, getNotificationDetails, getNotificationsById, getAllNotifications, getUnreadNotifications, getUnreadNotificationsByUserId};
