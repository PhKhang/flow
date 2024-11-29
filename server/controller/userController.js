import User from '../model/user.js';

const getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        return null;
    }
}

const addUser = async (name, fullName) => {
    const newUser = new User({ username: name, fullName: fullName });
    try {
        await newUser.save();
        return newUser;
    } catch (error) {
        return null;
    }
}

const getUser = async (name) => {
    try {
        const user = await User.findOne({ username: name });
        return user;
    } catch (error) {
        return null;
    }
}

export { addUser, getUser, getAllUsers };