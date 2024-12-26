let IsActiveFollowers = false;

document.addEventListener('DOMContentLoaded', (posts) => {
    // renderFeed(posts);
    toggleTabs();
});

function togglePopupFollower(tab) {
    const popupFl = document.getElementById("popup-follower");
    const overlayFl = document.getElementById("overlay-follower");

    popupFl.classList.toggle("active-follower");
    overlayFl.classList.toggle("active-follower");

    IsActiveFollowers = popupFl.classList.contains("active-follower");

    chooseTab(tab);
}

document.getElementById("overlay-follower").addEventListener("click", () => {
    if (IsActiveFollowers) {
        togglePopupFollower();
    }
});

// const tabs = document.querySelectorAll('.tab');
// tabs.forEach(tab => {
//     tab.addEventListener('click', () => {
//         tabs.forEach(t => t.classList.remove('active'));
//         tab.classList.add('active');
//     });
// });

const editForm = document.querySelector("#edit-info")
editForm ? document.querySelector("#edit-info").onsubmit = async (e) => {
    e.preventDefault();
    console.log("Edit profile");
    const data = new FormData(e.target);
    const object = Object.fromEntries(data.entries());
    const file = document.querySelector(".over #profile-picture input[type='file']").files[0]
    console.log(file);

    if (file) {
        const fileFormData = new FormData();
        fileFormData.append('file', file);

        const fileResponse = await fetch('/uploadImg', {
            method: 'POST',
            body: fileFormData
        });

        const fileData = await fileResponse.json();
        
        console.log(fileData);
        object.profile_pic_url = fileData.filename;
    }

    const response = await fetch("/api/auth/edit", {
        method: "POST",
        body: JSON.stringify(object),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    if (!response.ok) {
        console.log("Error editing user");
        return;
    }

    console.log("Edited user successfully");
    document.querySelector('.over').style.display = 'none';
    location.reload();
} : null;

const chooseTab = (tab) => {
    const followersTab = document.getElementById('followers-tab');
    const followingTab = document.getElementById('following-tab');

    if (tab == 1) {
        followersTab.classList.add('active');
        followingTab.classList.remove('active');
        document.querySelector(".followers-tab").style.display = "block";
        document.querySelector(".following-tab").style.display = "none";
    }
    else {
        followingTab.classList.add('active');
        followersTab.classList.remove('active');
        document.querySelector(".followers-tab").style.display = "none";
        document.querySelector(".following-tab").style.display = "block";
    }
}

function toggleTabs() {
    const followersTab = document.getElementById('followers-tab');
    const followingTab = document.getElementById('following-tab');
    followersTab.addEventListener('click', () => {
        chooseTab(1);
    });
    followingTab.addEventListener('click', () => {
        chooseTab(2);
    });
}


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
