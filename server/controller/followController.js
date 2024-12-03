import Follow from '../model/follow.js';

async function followUser(follower_id, following_id) {
    const existingFollow = await Follow.findOne({ follower_id, following_id });
    if (existingFollow) {
        throw new Error('Already following this user');
    }

    const newFollow = new Follow({ follower_id, following_id });
    await newFollow.save();
    return newFollow;
}

async function unfollowUser(follower_id, following_id) {
    const result = await Follow.findOneAndDelete({ follower_id, following_id });
    if (!result) {
        throw new Error('Follow relationship not found');
    }
    return true;
}

async function getFollowers(user_id) {
    return await Follow.find({ following_id: user_id })
        .populate('follower_id', 'username avatar')
        .sort({ created_at: -1 });
}

async function getFollowing(user_id) {
    return await Follow.find({ follower_id: user_id })
        .populate('following_id', 'username avatar')
        .sort({ created_at: -1 });
}

async function checkFollowing(follower_id, following_id) {
    const follow = await Follow.findOne({ follower_id, following_id });
    return !!follow;
}

export {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    checkFollowing
};
