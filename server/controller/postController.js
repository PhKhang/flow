import Post from  "../model/post.js";

const getAllPosts = async () => {
    try {
        const posts = await Post.find();
        return posts;
    } catch (error) {
        return null;
    }
}

const getFollowPosts = async () => {
    try {
        const posts = await Post.find();
        return posts;
    } catch (error) {
        return null;
    }
}

const addPost = async (author, authorId, content, media) => {
    const newPost = new Post({
        author,
        authorId,
        content,
        media: {
            type: media.type || 'none',
            urls: media.urls || []
        }
    });
    try {
        await newPost.save();
        return newPost;
    } catch (error) {
        return null;
    }
}

const getPostsByAuthor = async (authorId) => {
    try {
        const posts = await Post.find({ authorId }).populate('authorId', 'username fullName');
        return posts;
    } catch (error) {
        return null;
    }
}

const deletePostById = async (postId) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(postId);
        return deletedPost;
    } catch (error) {
        return null;
    }
}

export { getAllPosts, getFollowPosts, addPost, getPostsByAuthor, deletePostById };
