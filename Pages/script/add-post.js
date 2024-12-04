const togglePopup = () => {
    const popupEl = document.getElementById("popup");
    const overlayEl = document.getElementById("overlay");
    
    popupEl.classList.toggle("active");
    overlayEl.classList.toggle("active");
};

document.getElementById("overlay").addEventListener("click", togglePopup);

document.addEventListener('DOMContentLoaded', () => {
    const postInput = document.querySelector('.post-input');
    postInput.addEventListener('input', function() {
        autoResize(this);
    });
});

function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

let selectedImage = null;
const DEFAULT_IMAGE_URL = "https://i.pinimg.com/564x/fd/cf/c7/fdcfc7eadc949b0a9c85bc08f079998a.jpg";

document.getElementById('imageInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        selectedImage = file;
        
        const previewDiv = document.getElementById('imagePreview');
        previewDiv.innerHTML = `
            <svg class="remove-image" onclick="removeImage()" fill="#fff" viewBox="-3.5 0 19 19" xmlns="http://www.w3.org/2000/svg" class="cf-icon-svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"></path></g></svg>
            <img src="${URL.createObjectURL(file)}" alt="Preview">
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

document.addEventListener('DOMContentLoaded', () => {

    const postInput = document.querySelector('.post-input');
    postInput.addEventListener('input', function() {
        autoResize(this);
    });
});

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

