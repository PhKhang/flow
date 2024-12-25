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

const createNotification = async (req, res) => {
    try {
        const { type, sender_id, receiver_id, attachment, onModel } = req.body;

        const newNotification = new Notification({
            type,
            sender_id,
            receiver_id,
            attachment,
            onModel
        });

        await newNotification.save();
        res.status(201).json({success: true, newNotification});
    } catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const id = req.body.notificationId;
        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) {
            res.status(404).json({success: true, message: 'Notification not found' });
        } else {
            res.status(200).json({success: false, notification});
        }
    }
    catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
}

const updateReadStatus = async (req, res) => {
    try {
        const  id  = req.body.notificationId;
        const notification = await Notification
            .findByIdAndUpdate(id, { status: 'read' }, { new: true });
        if (!notification) {
            res.status(404).json({success: true, message: 'Notification not found' });
        }
        else {
            res.status(200).json({success: false,notification});
        }
    }
    catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
}

const updateUnreadStatus = async (req, res) => {
    try {
        const  id  = req.body.notificationId;
        const notification = await Notification
            .findByIdAndUpdate(id, { status: 'unread' }, { new: true });
        if (!notification) {
            res.status(404).json({success: true, message: 'Notification not found' });
        }
        else {
            res.status(200).json({success: false, notification});
        }
    }
    catch (error) {
        res.status(500).json({success: false, message: error.message });
    }
}

export { init, getNotificationsById, getUnreadNotifications, getAllNotificationsOfUser, createNotification, getUnreadNotificationsByUserId, deleteNotification, updateReadStatus, updateUnreadStatus };
