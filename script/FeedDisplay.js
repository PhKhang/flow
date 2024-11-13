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
        time: "1w",
        text: "Finally checked out Mensho Tokyo in Sydney—and luckily, no line! Verdict: super delicious, but not totally convinced it's worth the price point. What do you think?",
        image: "https://i.pinimg.com/564x/fd/cf/c7/fdcfc7eadc949b0a9c85bc08f079998a.jpg",
        likes: 2900,
        comments: 17,
    },
    {
        userProfilePic: "https://i.pinimg.com/564x/5e/9d/ea/5e9deaa039eb8fbbc8a8be06eb07478b.jpg",
        username: "travel.journey",
        time: "5h",
        text: "Just arrived in Kyoto! The scenery is breathtaking. Can't wait to explore the temples and gardens tomorrow!",
        image: "https://i.pinimg.com/564x/5e/9d/ea/5e9deaa039eb8fbbc8a8be06eb07478b.jpg",
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
                <p class="username">${post.username}</p>
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
                <img src="${post.image}" alt="Full Image" class="full-image">
            </div>`;
    }
  
    postHTML += `
        </div>
        <div class="actions">
            <button class="like-button">
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FF0000"></path>
                </svg>
                ${formatNumber(post.likes)}
            </button>
            <button class="comment-button">
                <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M21 15c-1.66 0-3 1.34-3 3v3h-4v-6h5c0.55 0 1-0.45 1-1s-0.45-1-1-1h-5V5h3c1.66 0 3 1.34 3 3s1.34 3 3 3zM3 7c1.66 0 3-1.34 3-3S4.66 1 3 1 0 2.34 0 4s1.34 3 3 3z" fill="#333"></path>
                </svg>
                ${formatNumber(post.comments)}
            </button>
        </div>`;

        postElement.innerHTML = postHTML;
  
        postElement.addEventListener('click', (event) => {
            if (!event.target.matches('img, .like-button, .post-image, .modal')) {
                window.location.href = 'Post.html';
            }
        });
  
    return postElement;
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

document.addEventListener('DOMContentLoaded', () => {
    renderFeed();

    const postInput = document.querySelector('.post-input');
    postInput.addEventListener('input', function() {
        autoResize(this);
    });
});

let selectedImage = null;
const DEFAULT_IMAGE_URL = "https://i.pinimg.com/564x/fd/cf/c7/fdcfc7eadc949b0a9c85bc08f079998a.jpg";

document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        selectedImage = file;
        
        const previewDiv = document.getElementById('imagePreview');
        previewDiv.innerHTML = `
            <img src="${URL.createObjectURL(file)}" alt="Preview">
            <button onclick="removeImage()" class="remove-image">&times;</button>
        `;
    } else {
        selectedImage = null;
        document.getElementById('imagePreview').innerHTML = '';
    }
});

function removeImage() {
    selectedImage = null;
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imageInput').value = '';
}

function handleNewPost(text) {
    const newPost = {
        userProfilePic: "https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg",
        username: "olivia.food.blog",
        time: "Vừa xong",
        text: text.trim(),
        image: selectedImage ? URL.createObjectURL(selectedImage) : null,
        likes: 0, 
        comments: 0
    };

    addNewPost(newPost);
    document.querySelector('.post-input').value = '';
    removeImage();
    togglePopup();
}

document.querySelector('.post-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && this.value.trim()) {
        handleNewPost(this.value);
    }
});

document.querySelector('.post-button').addEventListener('click', function(event) {
    const postInput = document.querySelector('.post-input');
    if (postInput.value.trim()) {
        handleNewPost(postInput.value);
    }
});

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

function openFullscreen(index) {
    let modal = document.getElementById(`imageModal-${index}`);
    modal.style.display = 'flex';
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