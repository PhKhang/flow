
commentImageInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            commentImagePreview.src = e.target.result;
            commentImagePreview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
});

document.getElementById('newCommentInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); 
        addNewComment();
    }
});

async function toggleLike({ postId, userId, isLiked, button, postAuthorId }) {
    console.log(postId, userId, isLiked, button, postAuthorId);
    try {
        button.classList.toggle('like-button-clicked');
        let endpoint;
        if (isLiked === "true") {
            endpoint = '/api/unlikePost';
        } else {
            endpoint = '/api/likePost';
        }
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ postId, userId }),
        });
        if(endpoint === '/api/likePost') {
            const notificationResponse = await fetch('/api/createNotification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'like_post',
                    sender_id: userId,
                    receiver_id: postAuthorId,
                    attachment: postId
                }),
            });
            const notificationStatus = await notificationResponse.json();
            console.log(notificationStatus);
            if (notificationStatus.success) {
                console.log('Notification created successfully');
            } else {
                console.error('Failed to create notification');
            }
        }

        const result = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to like or unlike the post');
        }

        let updatedLikesCount = result.post.likes.length;
        document.querySelector(`#like-count-${postId}`).textContent = updatedLikesCount;
        button.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleLike({
                postId,
                userId,
                isLiked: isLiked === 'true' ? 'false' : 'true',
                button,
                postAuthorId,
            });
        };
    } catch (error) {
        button.classList.toggle('like-button-clicked');
        alert('An error occurred while toggling like. Please try again.');
    }
}

function renderComments() {
    const container = document.getElementById('commentsContainer');
    if (!container) {
        console.error('Comments container not found');
        return;
    }

    //const commentsHTML = comments.map(comment => createCommentHTML(comment)).join('');
    //container.innerHTML = commentsHTML;
}

const addNewComment = async ({ postId, authorId, username, profilePicUrl, postAuthorId }) => {
    console.log('Adding new comment:', postId, authorId, username, profilePicUrl, postAuthorId);
    const textarea = document.getElementById('newCommentInput');
    const commentImagePreview = document.getElementById('commentImagePreview');
    const commentImageInput = document.getElementById('commentImageInput');

    if (textarea) textarea.style.height = 'auto';

    const text = textarea.value.trim();
    const hasImage = commentImagePreview && commentImagePreview.style.display === 'block';
    const selectedFile = commentImageInput && commentImageInput.files[0];

    if (!text && !hasImage) return; 

    const newComment = {
        username: username,
        profilePic: profilePicUrl,
        time: "1s",
        text,
        image: hasImage ? selectedFile : null,
        likes: 0,
        replies: 0,
    };

    try {
        const payload = {
            authorId,
            postId,
            content: text,
            typeOfMedia: hasImage ? 'image' : 'none',
            urls: [],
        };

        if (hasImage && selectedFile) {
            const fileFormData = new FormData();
            fileFormData.append('file', selectedFile);

            const fileResponse = await fetch('/uploadImg', {
                method: 'POST',
                body: fileFormData,
            });
            const fileData = await fileResponse.json();
            payload.urls = [fileData.filename];
            newComment.image = fileData.filename; 
        }

        console.log( JSON.stringify(payload))

        const response = await fetch('/api/addComment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const status = await response.json();

        if (status.success) {
            console.log('Comment added successfully');
            // comments.unshift(newComment);
            // renderComments();
            const notificationResponse = await fetch('/api/createNotification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'comment_post',
                    sender_id: authorId,
                    receiver_id: postAuthorId,
                    attachment: postId,
                }),
            });
            const notificationStatus = await notificationResponse.json();
            console.log(notificationStatus);
            if (notificationStatus.success) {
                console.log('Notification created successfully');
            } else {
                console.error('Failed to create notification');
            }
            
            if (textarea) textarea.value = '';
            const commentImagePreview = document.getElementById('commentImagePreview');
            const commentImageInput = document.getElementById('commentImageInput');
            if (commentImagePreview) {
                commentImagePreview.style.display = 'none';
                commentImagePreview.src = '';
            }
            if (commentImageInput) commentImageInput.value = '';
        } else {
            console.error('Failed to add comment');
        }
    } catch (error) {
        console.error('Error while adding comment:', error);
    }
};

renderComments();

function goBack() {
    window.history.back();
}

function openFullscreen(index) {
    let modal = document.getElementById(`imageModal-${index}`);
    let closeButton = document.getElementById(`closeButton-${index}`);
    if (modal && closeButton) {
        modal.style.display = 'flex';
        closeButton.style.display = 'block';
        modal.addEventListener('click', function(event) {
            if (event.target === modal) { 
                closeFullscreen(index);
            }
        });
    } else {
        console.error("Modal or close button not found for index:", index);
    }
}

function closeFullscreen(index) {
    let modal = document.getElementById(`imageModal-${index}`);
    if (modal) {
        modal.style.display = 'none';
    } else {
        console.error("Modal not found for index:", index);
    }
}

function formatNumber(num) {
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    } else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    } else {
        return num.toString();
    }
}