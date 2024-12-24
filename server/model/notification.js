import mongoose from 'mongoose';
const { Schema } = mongoose;

const notificationSchema = new Schema({
    type: {
        type: String,
        enum: ['comment_post', 'like_post', 'like_comment', 'following'],
        required: true,
    },
    sender_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    receiver_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    status: {
        type: String,
        enum: ['unread', 'read'],
        default: 'unread',
    },
    created_at: { type: Date, default: Date.now },
    attachment: { type: Schema.Types.ObjectId, refPath: 'onModel', required: true, },
    onModel: {
        type: String,
        enum: ['posts', 'comments']
      },

}, { collection: 'notifications' });

const Notification = mongoose.model('notifications', notificationSchema);
export default Notification;
