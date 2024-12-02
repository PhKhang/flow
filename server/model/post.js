import mongoose from 'mongoose';
const { Schema } = mongoose;

const postSchema = new Schema({
    author_id: { type: Schema.Types.ObjectId, ref: 'users',},
    content: { type: String, required: true }, 
    likes: [{ type: Schema.Types.ObjectId}],
    media: {
        type: { type: String},
        urls: [ { type: String } ] 
    },
    created_at: { type: Date, default: Date.now } 
}, { collection: 'posts' });

postSchema.index({ content: 'text' });
const Post = mongoose.model('posts', postSchema);
export default Post;
