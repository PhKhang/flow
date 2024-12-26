const commentImageInput = document.querySelector('#commentImageInput');
const commentImagePreview = document.querySelector('#commentImagePreview');

if (commentImageInput && commentImagePreview) {
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
}

const newCommentInput = document.getElementById('newCommentInput');

if (newCommentInput) {
    newCommentInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); 
            addNewComment();
        }
    });
}

async function toggleLikeComment({ commentId, userId, isLiked, button, commentAuthorId }) {
    // console.log(commentId, userId, isLiked, button, commentAuthorId);

    try {
        button.classList.toggle('like-button-clicked');
        let endpoint;

        if (isLiked === "true") {
            endpoint = '/api/unlikeComment';
        } else {
            endpoint = '/api/likeComment';
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentId, userId }),
        });

        if(endpoint === '/api/likeComment') {
            const notificationResponse = await fetch('/api/createNotification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'like_comment',
                    sender_id: userId,
                    receiver_id: commentAuthorId,
                    attachment: commentId
                }),
            });
            // const notificationStatus = await notificationResponse.json();
            
            // if (notificationStatus.success) {
            //     console.log('Notification created successfully');
            // } else {
            //     console.error('Failed to create notification');
            // }
        }

        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to like or unlike the comment');
        }

        const updatedLikesCount = result.comment.likes.length;
        document.querySelector(`#comment-like-count-${commentId}`).textContent = updatedLikesCount;

        button.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleLikeComment({
                commentId,
                userId,
                isLiked: isLiked === 'true' ? 'false' : 'true',
                button,
                commentAuthorId
            });
        };
    } catch (error) {
        button.classList.toggle('like-button-clicked');
        alert('An error occurred while toggling like. Please try again.');
    }
}

function renderComments(newComment) {
    const container = document.getElementById('commentsContainer');
    if (!container) {
        console.error('Comments container not found');
        return;
    }

    const commentHTML = `
        <div id="comment-${newComment.id}" class="comment">
            <img src="${newComment.profilePic}" alt="Profile picture" class="profile-pic">
            <div class="user-info">
                <div class="username">
                    <a href="/profile/${newComment.username}">
                        <span class="username" style="font-weight: 600;">${newComment.username}</span>
                    </a>
                    <span> • </span>
                    <span class="time">${newComment.time}</span>
                </div>
                <div class="comment-block">
                    ${newComment.text ? `<p class="text">${newComment.text}</p>` : ''}
                    ${newComment.image ? `<img src="${newComment.image}" alt="Comment image" class="mt-1 comment-image">` : ''}
                    <div class="actions container text-center">
                        <button 
                            style="margin-left: -10px" 
                            class="me-2 like-button button hover-icon ${newComment.isLiked ? 'like-button-clicked' : ''}" 
                            onclick="event.preventDefault(); event.stopPropagation(); toggleLikeComment({
                                commentId: '${newComment.id}',
                                userId: '${newComment.userId}',
                                isLiked: ${newComment.isLiked},
                                button: this,
                                commentAuthorId: '${newComment.commentAuthorId}'
                            })">
                            <svg viewBox="0 0 24 24" width="18" height="18" class="nav-icon">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="2"></path>
                            </svg>
                            <p id="comment-like-count-${newComment.id}">${newComment.likes}</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', commentHTML);
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
        userId: authorId,
        username: username,
        profilePic: profilePicUrl,
        commentAuthorId: authorId,
        time: "0min",
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
            newComment.id = status.comment._id; 
            renderComments(newComment);

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
            // const notificationStatus = await notificationResponse.json();
            
            // if (notificationStatus.success) {
            //     console.log('Notification created successfully');
            // } else {
            //     console.error('Failed to create notification');
            // }
            
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
