import mongoose from 'mongoose';
const { Schema } = mongoose;

const followSchema = new Schema({
    follower_id: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    following_id: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
    created_at: { type: Date, default: Date.now } 
}, { collection: 'follows' });

const Follow = mongoose.model('follows', followSchema);
export default Follow;