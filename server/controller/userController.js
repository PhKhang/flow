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
        // const user = await User.findOne({ username: username });
        const user = await User.aggregate(
            [
                { "$match": { "username": username } },
                {
                    $lookup: {
                        from: "follows",
                        localField: "_id",
                        foreignField: "following_id",
                        as: "followers",
                    },
                }
            ]
        );
        return user;
    } catch (error) {
        console.log("Error fetching user by username: ", error);
        return null;
    }
}
export { addUser, fetchUserByEmail, fetchUserByUsername, getAllUsers };