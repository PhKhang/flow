import bcrypt from "bcrypt";
import User from '../model/user.js';
import Follow from '../model/follow.js';

const UserController = {};

UserController.getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        return null;
    }
}

UserController.addUser = async (username, email, password_hash) => {
    const newUser = new User({ username: username, email: email, password_hash: password_hash });
    try {
        await newUser.save();
        return newUser;
    } catch (error) {
        return null;
    }
}

UserController.fetchUserByEmail = async (email) => {
    try {
        const user = await User.findOne({ email: email });
        return user;
    } catch (error) {
        return null;
    }
}

UserController.fetchUserByUsername = async (username) => {
    console.log("Fetching user by username: ", username);
    try {
        const user = await User.aggregate([
            { $match: { username: "humanbeing" } },
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
        return user[0];
    } catch (error) {
        console.log("Error fetching user by username: ", error);
        return null;
    }
}

UserController.editUser = async (id, data) => {
    console.log("Editing user: ", id, " ", data);

    try {
        const user = await User.findById(id);
        if (!user) {
            console.log("User not found");
            return null;
        }


        if (data["new-password"]) {
            if (!bcrypt.compareSync(data["old-password"], user.password_hash)) {
                console.log("Bad password");
                return null;
            }
            user.password_hash = bcrypt.hashSync(data["new-password"], salt);
        }

        if (data["full-name"]) {
            user.full_name = data["full-name"];
        }

        if (data["bio"]) {
            user.bio = data["bio"];
        }

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