const posts = [
    {
        userProfilePic: "https://i.pinimg.com/564x/fd/cf/c7/fdcfc7eadc949b0a9c85bc08f079998a.jpg",
        username: "olivia.food.blog",
        time: "20m",
        text: "Sau khoảng thời gian 1.5 năm đầu mới đi làm dev chỉ làm \"phần trước\" thì mấy tháng đổ lại đây mình bắt đầu được code \"phần sau\" rùii 🤡. Ai chuyên back-end cho em xin kinh nghiệm cày cuốc cũng như tips để code back-end cho chuẩn chỉ với ạ",
        image: "https://i.pinimg.com/736x/6f/db/c0/6fdbc00490d523929c84078e16d1fb9a.jpg",
        likes: 211,
        comments: 19,
    },
    {
        userProfilePic: "https://i.pinimg.com/564x/5e/9d/ea/5e9deaa039eb8fbbc8a8be06eb07478b.jpg",
        username: "travel.journey",
        time: "15h",
        text: "Chia sẻ cho mọi người một web mình vừa hoàn thành ❤️ Tâm huyết bấy lâu nay của mình lun á =))) Phải nói là quá xứng đáng",
        image: "https://i.pinimg.com/736x/ba/1f/50/ba1f50f644077acc8bedb8b0634c1af8.jpg",
        likes: 1284,
        comments: 272,
    },
    {
        userProfilePic: "https://i.pinimg.com/564x/5e/9d/ea/5e9deaa039eb8fbbc8a8be06eb07478b.jpg",
        username: "keria",
        time: "3d",
        text: `Khi các bạn fresher bắt đầu đi làm, việc phải rework nhiều lần vì các comment trong code review từ các anh Senior là điều dễ gặp. Điều này không chỉ tốn thời gian, mà đôi khi còn khiến bạn mất điểm trong mắt những anh chị quản lý. Để tránh việc này, dưới đây là 3 tips cực kỳ hữu ích giúp anh em fresher giảm thiểu comment khi tạo Pull Request (PR)`,
        image: "",
        likes: 53,
        comments: 7,
    },
    {
        userProfilePic: "https://i.pinimg.com/564x/5e/9d/ea/5e9deaa039eb8fbbc8a8be06eb07478b.jpg",
        username: "keria",
        time: "November 1, 2024",
        text: "Frontend: Nắm chắc cơ bản: HTML, CSS, JavaScript và CSS frameworks: Bootstrap, TailwindCSS, Pico.css",
        image: "https://i.pinimg.com/736x/3f/f3/38/3ff338fded7cab6c231606b35ebe18ab.jpg",
        likes: 6348,
        comments: 451,
    }
];

function createPostElement(post, index) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
  
    let postHTML = `
        <div class="user-info">
            <img src="https://pub-b0a9bdcea1cd4f6ca28d98f878366466.r2.dev/1731293754064" alt="User profile" class="profile-pic">
            <div class="post-info">
                <a href="/Profile.html"><p class="username">phkhang</p></a>
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

let IsActiveFollowers= false;

document.addEventListener('DOMContentLoaded', () => {
    renderFeed();
});

function togglePopupFollower() {
    const popupFl = document.getElementById("popup-follower");
    const overlayFl = document.getElementById("overlay-follower");
    
    popupFl.classList.toggle("active-follower");
    overlayFl.classList.toggle("active-follower");

    IsActiveFollowers = popupFl.classList.contains("active-follower");
}

document.getElementById("overlay-follower").addEventListener("click", () => {
    if (IsActiveFollowers) {
        togglePopupFollower();
    }
});

function toggleFollow(button) {
    button.classList.toggle('follow-btn-clicked');
    
    if (button.classList.contains('follow-btn-clicked')) {
        button.innerText = 'Following';
    } else {
        button.innerText = 'Follow';
    }
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

const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});
function goBack() {
    window.history.back();
}

function scrollToTop() {
    window.scrollTo({
        top: 0, 
        behavior: "smooth"
    });
}