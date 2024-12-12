import Notification from '../model/notification.js';
import Post from '../model/post.js';
import Comment from '../model/comment.js';
import User from '../model/user.js';

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

export { getNotificationDetails };
