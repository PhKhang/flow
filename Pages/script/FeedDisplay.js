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

document.addEventListener('DOMContentLoaded', () => {
    const postInput = document.querySelector('.post-input');
    postInput.addEventListener('input', function() {
        autoResize(this);
    });
});

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