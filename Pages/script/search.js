document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const categoryInput = document.getElementById('category');
    const searchForm = document.getElementById('search-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            categoryInput.value = tab.getAttribute('data-category');
            searchForm.submit();
        });
    });
});

async function toggleFollow({ followerId, followingId, isFollowed, button }) {
    // console.log(followerId, followingId, isFollowed, button);

    try {
        button.classList.toggle('following');
        let endpoint;

        if (isFollowed === "true") {
            endpoint = '/api/unfollow';
        } else {
            endpoint = '/api/follow';
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ followerId, followingId }),
        });

        if (endpoint === '/api/follow') {
            const notificationResponse = await fetch('/api/createNotification', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'following',
                    sender_id: followerId,
                    receiver_id: followingId
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
            throw new Error(result.message || 'Failed to follow or unfollow the user');
        }

        const buttonText = button.querySelector('p');
        if (buttonText) {
            buttonText.textContent = isFollowed === 'true' ? 'Follow' : 'Following';
        }

        const followersCountElement = document.getElementById(`followers-count-${followingId}`);
        if (followersCountElement) {
            followersCountElement.textContent = `${result.followersCount} followers`;
        }

        button.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            toggleFollow({
                followerId,
                followingId,
                isFollowed: isFollowed === 'true' ? 'false' : 'true',
                button
            });
        };
    } catch (error) {
        button.classList.toggle('following');
        alert('An error occurred while toggling follow. Please try again.');
    }
}
