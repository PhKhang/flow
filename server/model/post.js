import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
    author_id: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    content: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    media: {
        type: {
            type: String,
            enum: ['image', 'none'],
            required: true
        },
        urls: [{ type: String }]
    },
}, { collection: 'posts', id: true });

const Post = mongoose.model('posts', postSchema);
export default Post;
