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
editForm ? editForm.addEventListener("click", (e) => {
    document.querySelector("#error").textContent = "";
}) : null;
editForm ? document.querySelector("#edit-info").onsubmit = async (e) => {
    e.preventDefault();
    console.log("Edit profile");
    const data = new FormData(e.target);
    const object = Object.fromEntries(data.entries());
    
    object.username = object.username.trim();
    object.bio = object.bio.trim();
    object["full-name"] = object["full-name"].trim();
    if ((object.username.length < 3 && object.username == "") || object.username.length > 15 || object.username.match(/[^a-zA-Z0-9_]/)) {
        document.querySelector("#error").textContent = "Username must be between 3 and 15 characters, only alphanumerical and underscores";
        return;
    }
    if (object["full-name"].length > 20) {
    document.querySelector("#error").textContent = "Full name must be less than 20 characters";
        return;
    }
    if (object["new-password"] && (object["new-password"] == object["old-password"])) {
        document.querySelector("#error").textContent = "Passwords match";
        return;
    }
    if (object["old-password"] && object["new-password"].length < 8) {
        document.querySelector("#error").textContent = "Password must be at least 8 characters";
        return;
    }
    
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
        document.querySelector("#error").textContent = "Wrong password";
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

        const followersCountElement = document.getElementById('followers-count');
        if (followersCountElement) {
            const followersCountSpan = followersCountElement.querySelector('span');
            if (followersCountSpan) {
                followersCountSpan.textContent = result.followersCount;
            }
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

function createPostHTML(post, curUserID) {
    return `
        <div id="${post._id}" class="post" onclick="window.location.href='/post/${post._id}'">
            <div class="user-info">
                <img src="${post.author_id.profile_pic_url}" alt="${post.author_id.username}" class="profile-pic">
                <div class="post-info">
                    <a href="/profile/${post.author_id.username}">
                        <p class="username">${post.author_id.username}</p>
                    </a>
                    <span class="time">${post.timeAgo}</span>
                </div>
            </div>
            <div class="content-wrapper">
                <p class="text">${post.content}</p>
                ${post.media && post.media.urls && post.media.urls.length ? `
                    <div class="media">
                        <img src="${post.media.urls[0]}" alt="Post media" class="post-image" onclick="event.stopPropagation(); openFullscreen('${post._id}');">
                    </div>
                    <div class="modal" id="imageModal-${post._id}" " onclick="event.stopPropagation();">
                        <svg style="display: none;" id="closeButton-${post._id}" " class="close-full-image" onclick="closeFullscreen('${post._id}')" fill="#fff" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"></path>
                            </g>
                        </svg>
                        <img src="${post.media.urls[0]}" alt="Full Image" class="full-image">
                    </div>
                ` : ''}
            </div>
            <div class="actions container text-center">
                <button class="like-button button hover-icon ${post.isLiked ? 'like-button-clicked' : ''}"
                    onclick="event.preventDefault(); event.stopPropagation(); toggleLike({
                        postId: '${post._id}',
                        userId: '${curUserID}',
                        isLiked: '${post.isLiked}',
                        button: this,
                        postAuthorId: '${post.author_id._id}'
                    })">
                    <svg viewBox="0 0 24 24" width="18" height="18" class="nav-icon">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="2"></path>
                    </svg>
                    <p id="like-count-${post._id}">${post.likes ? post.likes.length : 0}</p>
                </button>
                <button class="comment-button button hover-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.663 3.04094 17.0829 4.73812 18.875L2.72681 21.1705C2.44361 21.4937 2.67314 22 3.10288 22H12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <p>${post.comments_length || 0}</p>
                </button>
            </div>
        </div>
    `;
}

function createPostHTMLwhenAddPost(user, post, curUserID) {
    return `
        <div id="${post._id}" class="post" onclick="window.location.href='/post/${post._id}'">
            <div class="user-info">
                <img src="${user.profile_pic_url}" alt="${user.username}" class="profile-pic">
                <div class="post-info">
                    <a href="/profile/${user.username}">
                        <p class="username">${user.username}</p>
                    </a>
                    <span class="time">0min</span>
                </div>
            </div>
            <div class="content-wrapper">
                <p class="text">${post.content}</p>
                ${post.media && post.media.urls && post.media.urls.length ? `
                    <div class="media">
                        <img src="${post.media.urls[0]}" alt="Post media" class="post-image" onclick="event.stopPropagation(); openFullscreen('${post._id}');">
                    </div>
                    <div class="modal" id="imageModal-${post._id}" " onclick="event.stopPropagation();">
                        <svg style="display: none;" id="closeButton-${post._id}" " class="close-full-image" onclick="closeFullscreen('${post._id}')" fill="#fff" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                            <g id="SVGRepo_iconCarrier">
                                <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"></path>
                            </g>
                        </svg>
                        <img src="${post.media.urls[0]}" alt="Full Image" class="full-image">
                    </div>
                ` : ''}
            </div>
            <div class="actions container text-center">
                <button class="like-button button hover-icon ${post.isLiked ? 'like-button-clicked' : ''}"
                    onclick="event.preventDefault(); event.stopPropagation(); toggleLike({
                        postId: '${post._id}',
                        userId: '${curUserID}',
                        isLiked: '${post.isLiked}',
                        button: this,
                        postAuthorId: '${curUserID}'
                    })">
                    <svg viewBox="0 0 24 24" width="18" height="18" class="nav-icon">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="2"></path>
                    </svg>
                    <p id="like-count-${post._id}">${post.likes ? post.likes.length : 0}</p>
                </button>
                <button class="comment-button button hover-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.663 3.04094 17.0829 4.73812 18.875L2.72681 21.1705C2.44361 21.4937 2.67314 22 3.10288 22H12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <p>${post.comments_length || 0}</p>
                </button>
            </div>
        </div>
    `;
}