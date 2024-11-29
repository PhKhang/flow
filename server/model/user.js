import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
    username: String,// String is shorthand for {type: String}
    fullName: String,
    email: String,
    passwordHash: String,
    profilePicURL: String,
    bio: String,
    createdAt: { type: Date, default: Date.now },
    likes: [String],
}, { collection: 'users' });

const User = mongoose.model('users', userSchema);
export default User;
