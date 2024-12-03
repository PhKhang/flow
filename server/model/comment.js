import mongoose from 'mongoose';
const { Schema } = mongoose;

const commentSchema = new Schema({
    author_id: { type: Schema.Types.ObjectId, ref: 'users'},
    post_id: { type: Schema.Types.ObjectId, ref: 'posts'},
    content: { type: String}, 
    likes: [{ type: Schema.Types.ObjectId, ref: 'users'}],
    media: {
        type: { type: String},
        urls: [ { type: String } ] 
    },
    created_at: { type: Date, default: Date.now } 
}, { collection: 'comments' });

const Comment = mongoose.model('comments', commentSchema);
export default Comment;