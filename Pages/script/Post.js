const comments = [
    {
        username: "nghoang",
        profilePic: "https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg",
        time: "53m",
        text: "Chúc bạn có một chuyến đi vui vẻ",
        image: null,
        likes: 1,
        replies: 1
    },
    {
        username: "Nini",
        profilePic: "https://i.pinimg.com/736x/cd/9f/bd/cd9fbd7a5a930c7a5b24749da7052399.jpg",
        time: "43s",
        text: "What's a nice place!",
        image: null,
        likes: 1,
        replies: 0
    }
];

// Xử lý preview hình ảnh
const commentImageInput = document.getElementById('commentImageInput');
const commentImagePreview = document.getElementById('commentImagePreview');

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

// Xử lý nhấn Enter để đăng comment
document.getElementById('newCommentInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Ngăn xuống dòng
        addNewComment();
    }
});

// Hàm tạo HTML cho một comment
function createCommentHTML(comment) {
    let commentHTML = `
        <div class="comment">
            <img src="${comment.profilePic}" alt="Profile picture" class="profile-pic">
            <div class="user-info">
                <div class="username">
                    <a href="./otherProfile.html"><span class="username" style="font-weight: 600;">${comment.username}</span></a>
                    <span> • </span>
                    <span class="time">${comment.time}</span>
                </div>
                <div class="comment-block">
            </div>
            `;
    
    // Chỉ hiển thị text nếu có
    if (comment.text) {
        commentHTML += `<p class="text">${comment.text}</p>`;
    }
    
    // Hiển thị hình nếu có
    if (comment.image) {
        commentHTML += `<img src="${comment.image}" alt="Comment image" class="mt-1 comment-image">`;
    }

    commentHTML += `
                <div class="actions container text-center">
                    <button style="margin-left: -10px" class="me-2 like-button button hover-icon" onclick="toggleLike(this)">
                        <svg viewBox="0 0 24 24" width="18" height="18" class="nav-icon">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="none" stroke="currentColor" stroke-width="2"></path>
                        </svg>
                        <p>${formatNumber(comment.likes)}</p>
                    </button>
                    <button style="margin-left: -10px" class="me-2 comment-button button hover-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.663 3.04094 17.0829 4.73812 18.875L2.72681 21.1705C2.44361 21.4937 2.67314 22 3.10288 22H12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg> 
                        <p>${formatNumber(comment.replies)}</p>
                    </button>
                </div>
            </div>
        </div>
    `;
    return commentHTML;
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

function renderComments() {
    const container = document.getElementById('commentsContainer');
    container.innerHTML = comments.map(comment => createCommentHTML(comment)).join('');
}

function addNewComment() {
    const textarea = document.getElementById('newCommentInput');
    if (textarea) {
        textarea.style.height = 'auto'; 
    }

    const input = document.getElementById('newCommentInput');
    const text = input.value.trim();
    const hasImage = commentImagePreview.style.display === 'block';
    
    if (text || hasImage) {
        const newComment = {
            username: "phkhang",
            profilePic: "https://pub-b0a9bdcea1cd4f6ca28d98f878366466.r2.dev/1731293754064",
            time: "1s",
            text: text || "", 
            image: hasImage ? commentImagePreview.src : null,
            likes: 0,
            replies: 0
        };
        
        comments.unshift(newComment);
        renderComments();
        
        // Reset form
        input.value = '';
        commentImagePreview.style.display = 'none';
        commentImagePreview.src = '';
        commentImageInput.value = '';
    }
}

renderComments();

function goBack() {
    window.history.back();
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