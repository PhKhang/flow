const togglePopup = () => {
    const popupEl = document.getElementById("popup");
    const overlayEl = document.getElementById("overlay");
    
    popupEl.classList.toggle("active");
    overlayEl.classList.toggle("active");
};

document.getElementById("overlay").addEventListener("click", togglePopup);

const posts = [
    {
        userProfilePic: "https://i.pinimg.com/564x/fd/cf/c7/fdcfc7eadc949b0a9c85bc08f079998a.jpg",
        username: "olivia.food.blog",
        time: "8 giờ",
        text: "Finally checked out Mensho Tokyo in Sydney—and luckily, no line! Verdict: super delicious, but not totally convinced it's worth the price point. What do you think?",
        image: "https://i.pinimg.com/564x/fd/cf/c7/fdcfc7eadc949b0a9c85bc08f079998a.jpg",
        likes: 2900,
    },
    {
        userProfilePic: "https://i.pinimg.com/564x/5e/9d/ea/5e9deaa039eb8fbbc8a8be06eb07478b.jpg",
        username: "travel.journey",
        time: "5 giờ",
        text: "Just arrived in Kyoto! The scenery is breathtaking. Can't wait to explore the temples and gardens tomorrow!",
        image: "https://i.pinimg.com/564x/5e/9d/ea/5e9deaa039eb8fbbc8a8be06eb07478b.jpg",
        likes: 2900,
    }
];

// Hàm tạo HTML cho một bài post
function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    
    postElement.innerHTML = `
        <div class="user-info">
            <img src="${post.userProfilePic}" alt="User profile" class="profile-pic">
            <div class="username">
                <strong>${post.username}</strong>
                <span class="time">${post.time}</span>
            </div>
        </div>
        <p class="text">${post.text}</p>
        <div class="media">
            <img src="${post.image}" alt="Post image" class="post-image">
        </div>
        <div class="actions">
            <button class="like-button">❤ ${formatNumber(post.likes)}</button>
            <button class="comment-button">💬</button>
            <button class="share-button">↗️</button>
        </div>
    `;
    
    return postElement;
}

// Hàm format số lượng like
function formatNumber(num) {
    return num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num;
}

function renderFeed() {
    const otherPostsContainer = document.querySelector('.other-posts');
    
    // Xóa bỏ các post cũ (trừ phần add-post-area)
    const existingPosts = otherPostsContainer.querySelectorAll('.post:not(.add-post-area)');
    existingPosts.forEach(post => post.remove());
    
    // Render từng post (giờ sẽ theo thứ tự mới nhất ở đầu)
    posts.forEach(post => {
        const postElement = createPostElement(post);
        otherPostsContainer.appendChild(postElement);
    });
}


function addNewPost(postData) {
    // Thêm post mới vào đầu mảng
    posts.unshift(postData);
    
    // Render lại feed để hiển thị post mới ở đầu
    renderFeed();
}



// Render feed khi trang load
document.addEventListener('DOMContentLoaded', renderFeed);

// Lắng nghe sự kiện submit post
document.querySelector('.post-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && this.value.trim()) {
        const newPost = {
            userProfilePic: "https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg",
            username: "olivia.food.blog",
            time: "Vừa xong",
            text: this.value.trim(),
            image: null, // Bạn có thể thêm logic upload ảnh ở đây
            likes: 0
        };
        
        addNewPost(newPost);
        this.value = ''; // Xóa nội dung input sau khi post
        togglePopup(); // Đóng popup
    }
});