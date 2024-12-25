import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,// String is shorthand for {type: String}
    full_name: String,
    email: String,
    password_hash: String,
    profile_pic_url: { type: String, default: "https://pub-b0a9bdcea1cd4f6ca28d98f878366466.r2.dev/default%20avatar.png" },
    bio: String,
    verified: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now },
}, { collection: 'users', id: true });

const User = mongoose.model('users', userSchema);
export default User;
