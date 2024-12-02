import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,// String is shorthand for {type: String}
    full_name: String,
    email: String,
    password_hash: String,
    profile_pic_url: String,
    bio: String,
    created_at: { type: Date, default: Date.now },
    likes: [String],
}, { collection: 'users' });

const User = mongoose.model('users', userSchema);
export default User;
