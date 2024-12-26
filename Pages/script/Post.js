async function toggleLike({ postId, userId, isLiked, button, postAuthorId }) {
    // console.log(postId, userId,typeof isLiked, button, postAuthorId);
    try {
        isLiked = isLiked.toString();
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
        if (endpoint === '/api/likePost') {
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
            // const notificationStatus = await notificationResponse.json();

            // if (notificationStatus.success) {
            //     console.log('Notification created successfully');
            // } else {
            //     console.error('Failed to create notification');
            // }
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