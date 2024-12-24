document.addEventListener('DOMContentLoaded', () => {
    const postInput = document.querySelector('.post-input');
    postInput.addEventListener('input', function() {
        autoResize(this);
    });
});

function addNewPost(postData) {
    posts.unshift(postData);
}