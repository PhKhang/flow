document.querySelectorAll('.noti-setting-wrapper').forEach((wrapper) => {
    const settingIcon = wrapper.querySelector('.noti-setting-icon');
    const notiMenu = wrapper.querySelector('.noti-menu');

    settingIcon.addEventListener('click', (event) => {
        event.stopPropagation();
        notiMenu.classList.toggle('hidden'); 
    });

    document.addEventListener('click', (event) => {
        if (!wrapper.contains(event.target)) {
            notiMenu.classList.add('hidden'); 
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const notificationItems = document.querySelectorAll('.notification-item');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const tabType = this.getAttribute('data-tab');
            
            notificationItems.forEach(item => {
                if (tabType === 'all') {
                    item.style.display = 'flex';
                } else if (tabType === 'unread') {
                    const isRead = item.getAttribute('data-read') === 'true';
                    item.style.display = isRead ? 'none' : 'flex';
                }
            });
        });
    });

    notificationItems.forEach(item => {
        item.addEventListener('click', async function(e) {
            if (e.target.closest('.noti-setting-wrapper')) {
                return;
            }
            
            const notificationId = this.getAttribute('data-id');
            const notificationType = this.getAttribute('data-type');
            const postId = this.getAttribute('data-post-id');
            const commentId = this.getAttribute('data-comment-id');
            const currentStatus = this.getAttribute('data-read');
            
            try {
                if (currentStatus === 'false') {
                    const response = await fetch(`/api/notifications/${notificationId}/mark-read`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        this.setAttribute('data-read', 'true');
                        this.classList.add('read');
                    }
                }

                if (notificationType === 'like_comment' || notificationType === 'comment_comment') {
                    window.location.href = `/post/${postId}#comment-${commentId}`;
                } else {
                    window.location.href = `/post/${postId}`;
                }
            } catch (error) {
                console.error('Error updating notification status:', error);
                window.location.href = `/post/${postId}`;
            }
        });
    });

    const markAllReadButton = document.querySelector('.mark-read');
    if (markAllReadButton) {
        markAllReadButton.addEventListener('click', async function() {
            try {
                const response = await fetch('/api/notifications/mark-all-read', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    notificationItems.forEach(item => {
                        item.setAttribute('data-read', 'true');
                        item.classList.add('read');
                    });
                }
            } catch (error) {
                console.error('Error marking all notifications as read:', error);
            }
        });
    }
});