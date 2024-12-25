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
});

const markAsUnread = async (id) => {
    console.log(`Toggling read status for notification ID: ${id}`);
    const response = await fetch('/api/updateUnreadStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationId: id })
    })

    if (response.ok) {
        //console.log(`Notification ID: ${id} is now unread`);
        newStatus = "unread";
        const notificationElement = document.querySelector(`[data-id="${id}"]`);
        notificationElement.setAttribute("data-read", newStatus === "read" ? "true" : "false");
        const button = notificationElement.querySelector(".menu-item");
        button.textContent = newStatus === "read" ? "Mark as Unread" : "Mark as Read";
    } else {
        console.error(`Failed to mark notification ID: ${id} as unread`);
    }
}

const markAsRead = async (id) => {
    const response = await fetch('/api/updateReadStatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationId: id })
    })

    if (response.ok) {
        //console.log(`Notification ID: ${id} is now read`);
        newStatus = "read";
        const notificationElement = document.querySelector(`[data-id="${id}"]`);
        notificationElement.setAttribute("data-read", newStatus === "read" ? "true" : "false");
        const button = notificationElement.querySelector(".menu-item");
        button.textContent = newStatus === "read" ? "Mark as Unread" : "Mark as Read";
    } else {
        console.error(`Failed to mark notification ID: ${id} as read`);
    }
}

const markAllAsRead = async () => {
    const notifications = document.querySelectorAll('.notification-item');
    notifications.forEach((notification) => {
        const id = notification.getAttribute('data-id');
        markAsRead(id);
    });
}

const deleteNotification = async (id) => {
    const response = await fetch('/api/deleteNotification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notificationId: id })
    })

    if (response.ok) {
        //console.log(`Notification ID: ${id} has been deleted`);
        const notificationElement = document.querySelector(`[data-id="${id}"]`);
        if (notificationElement) {
            notificationElement.remove();
        }
    } else {
        console.error(`Failed to delete notification ID: ${id}`);
    }
}