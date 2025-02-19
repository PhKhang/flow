import bcrypt from "bcrypt";
import User from '../model/user.js';
import Follow from '../model/follow.js';
import jwt from 'jsonwebtoken';

const UserController = {};

UserController.getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        return null;
    }
}

UserController.addUser = async (username, email, password) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const newUser = new User({ username: username, email: email, password_hash: hash });
    try {
        await newUser.save();
        return newUser;
    } catch (error) {
        return null;
    }
}

UserController.fetchUserByEmailAndVerify = async (email) => {
    try {
        console.log("Verifying user with email: ", email);
        const user = await User.findOneAndUpdate({ email: email }, {verified: true}, {new: true});
        return user;
    } catch (error) {
        return null;
    }
}

UserController.fetchBasicUserByUsername = async (username) => {
    try {
        const user = await User.findOne({ username: username });
        return user;
    } catch (error) {
        return null;
    } 
};

UserController.fetchUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        return user;
    } catch (error) {
        return null;
    }
}

UserController.fetchUserByUsername = async (username, currentUserId) => {
    console.log("Fetching user by username: ", username);
    try {
        const user = await User.aggregate([
            { $match: { username: username } },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "following_id",
                    as: "followers",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "follower_id",
                    as: "followings",
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "author_id",
                    as: "posts",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followings.following_id",
                    foreignField: "_id",
                    as: "followings",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followers.follower_id",
                    foreignField: "_id",
                    as: "followers",
                },
            },
        ]);

        if (!user.length) return null;

        const fetchedUser = user[0];

        for (const follower of fetchedUser.followers) {
            const isFollowed = await Follow.findOne({
                follower_id: currentUserId,
                following_id: follower._id,
            });
            follower.isFollowed = !!isFollowed; 
        }

        fetchedUser.followings.forEach(following => {
            following.isFollowed = true;
        });

        return fetchedUser;
    } catch (error) {
        console.error("Error fetching user by username: ", error);
        return null;
    }
};

UserController.searchUsersByName = async (searchString) => {
    try {
        const users = await User.find({ username: { $regex: searchString, $options: 'i' } });
        return users;
    } catch (error) {
        console.error('Error searching users by name:', error);
        return null;
    }
};

UserController.editUser = async (id, data, needPassword = true) => {
    console.log("Editing user: ", id, " ", data);

    try {
        const user = await User.findById(id);
        if (!user) {
            console.log("User not found");
            return null;
        }
        
        if (data["username"]) {
            const result = await User.findOne({ username: data["username"] })
            if (result == null) {
                user.username = data["username"];
            }
            else {
                console.log("Username already exists");
                return "Username already exists";
            }
        }
        
        if (data["full-name"]) {
            user.full_name = data["full-name"];
        }


        if (data["new-password"]) {
            const salt = bcrypt.genSaltSync(10);
            if (needPassword && !bcrypt.compareSync(data["old-password"], user.password_hash)) {
                console.log("Bad password");
                return null;
            }
            user.password_hash = bcrypt.hashSync(data["new-password"], salt);
        }

        // if (data["bio"]) {
        user.bio = data["bio"];
        // }

        if (data["profile_pic_url"]) {
            user.profile_pic_url = data["profile_pic_url"];
        }

        await user.save();

        return user;
    }
    catch (error) {
        console.log("Error editing user: ", error);
        return null;
    }
}

export default UserController;


// [
//     { $match: { username: "humanbeing" } },
//     {
//       $lookup: {
//         from: "follows",
//         localField: "_id",
//         foreignField: "following_id",
//         as: "followers",
//       },
//     },
//     {
//       $lookup: {
//         from: "follows",
//         localField: "_id",
//         foreignField: "follower_id",
//         as: "followings",
//       },
//     },
//     {
//       $lookup: {
//         from: "posts",
//         localField: "_id",
//         foreignField: "author_id",
//         as: "posts",
//       },
//     },
  
//     {
//       $lookup: {
//         from: "users",
//         localField: "followings.following_id",
//         foreignField: "_id",
//         as: "followings",
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "followers.follower_id",
//         foreignField: "_id",
//         as: "followers",
//       },
//     },
  
//     // {
//     //   $lookup: {
//     //     from: "follows",
//     //     localField: "followers._id",
//     //     foreignField: "following_id",
//     //     as: "follower.stuff"
//     //   }
//     // },
//     // ig
//     {
//       $setWindowFields: {
//         output: {
//           "followers.stuff": {
//             // $sum: [
//             //   "$totalHomework",
//             //   "$totalQuiz",
//             //   "$extraCredit",
//             // ],
//             $lookup: {
              
//             }
//           },
//         },
//       },
//     },
    
//     //
//   ]