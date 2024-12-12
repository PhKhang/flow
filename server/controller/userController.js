import User from '../model/user.js';

const getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        return null;
    }
}

const addUser = async (username, email, password_hash) => {
    const newUser = new User({ username: username, email: email, password_hash: password_hash });
    try {
        await newUser.save();
        return newUser;
    } catch (error) {
        return null;
    }
}

const fetchUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        return user;
    } catch (error) {
        return null;
    }
}

const fetchUserByUsername = async (username) => {
    console.log("Fetching user by username: ", username);
    try {
        const user = await User.findOne({ username: username });
        return user;
    } catch (error) {
        return null;
    }
}

const searchUsersByName = async (searchString) => {
    try {
        const users = await User.find({ username: { $regex: searchString, $options: 'i' } });
        return users;
    } catch (error) {
        console.error('Error searching users by name:', error);
        return null;
    }
};

export { addUser, fetchUserByEmail, fetchUserByUsername, getAllUsers, searchUsersByName };