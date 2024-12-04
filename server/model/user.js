import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,
    full_name: String,
    email: String,
    password_hash: String,
    profile_pic_url: String,
    bio: String,
    createdAt: { type: Date, default: Date.now },
    likes: [String],
}, { collection: 'users' });

const User = mongoose.model('users', userSchema);
export default User;
