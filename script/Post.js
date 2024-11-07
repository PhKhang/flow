const comments = [
    {
        username: "Nini",
        profilePic: "https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg",
        time: "53 phút",
        text: "Claim ạ",
        image: null,
        likes: 1,
        replies: 1
    },
    {
        username: "Nini",
        profilePic: "https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg",
        time: "43 phút",
        text: "chúc bạn may mắn",
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
            <div class="user-info">
                <img src="${comment.profilePic}" alt="Profile picture" class="profile-pic">
                <div class="username">
                    <strong>${comment.username}</strong>
                    <span class="time">${comment.time}</span>
                </div>
            </div>
            <div class="comment-block">`;
    
    // Chỉ hiển thị text nếu có
    if (comment.text) {
        commentHTML += `<p class="text">${comment.text}</p>`;
    }
    
    // Hiển thị hình nếu có
    if (comment.image) {
        commentHTML += `<img src="${comment.image}" alt="Comment image" class="comment-image">`;
    }

    commentHTML += `
                <div class="actions">
                    <button class="like-button">❤ ${comment.likes}</button>
                    <button class="comment-button">💬 ${comment.replies || ''}</button>
                    <button class="share-button">🔁</button>
                </div>
            </div>
        </div>
    `;
    return commentHTML;
}

// Hàm render tất cả comments
function renderComments() {
    const container = document.getElementById('commentsContainer');
    container.innerHTML = comments.map(comment => createCommentHTML(comment)).join('');
}

// Hàm thêm comment mới
function addNewComment() {
    const input = document.getElementById('newCommentInput');
    const text = input.value.trim();
    const hasImage = commentImagePreview.style.display === 'block';
    
    // Chỉ đăng khi có text hoặc có hình
    if (text || hasImage) {
        const newComment = {
            username: "Nini",
            profilePic: "https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg",
            time: "Vừa xong",
            text: text || "", // Nếu không có text thì để rỗng
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

// Render comments khi trang load
renderComments();

function goBack() {
    window.history.back();
}