const posts = [
    {
        userProfilePic: "https://i.pinimg.com/736x/69/56/ff/6956ffc5caa89f3bb844c1ab7432739d.jpg",
        username: "travel.journey",
        time: "1w",
        text: "Finally checked out Japan and luckily, no line! Verdict: super delicious, but not totally convinced it's worth the price point. What do you think?",
        image: "https://i.pinimg.com/736x/47/55/ca/4755ca0523caf299505ae160c2a2ca8b.jpg",
        likes: 2900,
        comments: 17,
    },
    {
        userProfilePic: "https://i.pinimg.com/280x280_RS/d2/e5/e9/d2e5e964fddc7c8b5bad913bae95a528.jpg",
        username: "jessica_gordon",
        time: "5h",
        text: "Just arrived in the Valley! The scenery is breathtaking. Can't wait to explore the temples and gardens tomorrow!",
        image: "https://i.pinimg.com/736x/66/7a/cd/667acde78fd8c4f97f48ee20465d7e6e.jpg",
        likes: 810,
        comments: 510,
    },
    {
        userProfilePic: "https://i.pinimg.com/564x/5e/9d/ea/5e9deaa039eb8fbbc8a8be06eb07478b.jpg",
        username: "keria",
        time: "October 1, 2024",
        text: "Just arrived in Kyoto! The scenery is breathtaking. Can't wait to explore the temples and gardens tomorrow!",
        image: "https://i.pinimg.com/564x/d4/09/3b/d4093b6ae68f44bfb8f87d3e73e8d9c1.jpg",
        likes: 34,
        comments: 1377,
    },
    {
        userProfilePic: "https://i.pinimg.com/564x/5e/9d/ea/5e9deaa039eb8fbbc8a8be06eb07478b.jpg",
        username: "keria",
        time: "July 5, 2022",
        text: "Just arrived in Kyoto! The scenery is breathtaking. Can't wait to explore the temples and gardens tomorrow!",
        image: "https://i.pinimg.com/564x/44/5c/09/445c0993ece044d05b2099a1c93c120a.jpg",
        likes: 530319,
        comments: 83109,
    }
];

function createPostElement(post, index) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
  
    let postHTML = `
        <div class="user-info">
            <img src="${post.userProfilePic}" alt="User profile" class="profile-pic">
            <div class="post-info">
                <a href="/otherProfile.html"><p class="username">${post.username}</p></a>
                <span class="time">${post.time}</span>
            </div>
        </div>
        <div class="content-wrapper">
            <p class="text">${post.text}</p>`;
  
    if (post.image) {
        postHTML += `
            <div class="media">
                <img src="${post.image}" alt="Post image" class="post-image" onclick="openFullscreen(${index})">
            </div>
            <div class="modal" id="imageModal-${index}">
                <svg style="display: none;" id="closeButton-${index}" class="close-full-image" onclick="closeFullscreen(${index})" fill="#fff" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg">
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                        <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"></path>
                    </g>
                </svg>
                <img src="${post.image}" alt="Full Image" class="full-image">
            </div>`;
    }
  
    postHTML += `
        </div>
        <div class="actions container text-center">
            <button class="like-button button hover-icon" onclick="toggleLike(this)">
                <svg viewBox="0 0 24 24" width="18" height="18" class="nav-icon">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="2"></path>
                </svg>
                <p>${formatNumber(post.likes)}</p>
            </button>
            <button class="comment-button button hover-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.663 3.04094 17.0829 4.73812 18.875L2.72681 21.1705C2.44361 21.4937 2.67314 22 3.10288 22H12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg> 
                <p>${formatNumber(post.comments)}</p>
            </button>
        </div>`;

        postElement.innerHTML = postHTML;
  
        postElement.addEventListener('click', (event) => {
            if (event.target.closest('.like-button, .close-full-image')) {
                return; 
            }
            if (!event.target.matches('img, .post-image, .modal')) {
                window.location.href = 'Post.html';
            }
        });
  
    return postElement;
}

function toggleLike(button) {
    button.classList.toggle('like-button-clicked');
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

function renderFeed() {
    const otherPostsContainer = document.querySelector('.other-posts');
    
    const existingPosts = otherPostsContainer.querySelectorAll('.post:not(.add-post-area)');
    existingPosts.forEach(post => post.remove());
    
    posts.forEach((post, index) => {
        const postElement = createPostElement(post, index);
        otherPostsContainer.appendChild(postElement);
    });
}


function addNewPost(postData) {
    posts.unshift(postData);
    renderFeed();
}

function openFullscreen(index) {
    let modal = document.getElementById(`imageModal-${index}`);
    let closeButton = document.getElementById(`closeButton-${index}`);
    modal.style.display = 'flex';
    closeButton.style.display = 'block';
    modal.addEventListener('click', function(event) {
        if (event.target === modal) { 
          closeFullscreen(index);
        }
    });
}

function closeFullscreen(index) {
    let modal = document.getElementById(`imageModal-${index}`);
    modal.style.display = 'none';
}