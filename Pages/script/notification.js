document.addEventListener('DOMContentLoaded', () => {

    const notificationContainer = document.querySelector('.notifications');

    function renderNotifications() {
        notificationsData.forEach((notification, index) => {
            const notificationItem = document.createElement('div');
            notificationItem.classList.add('notification-item');
            notificationItem.dataset.status = notification.status ? 'read' : 'unread';

            notificationItem.innerHTML = `
                <div class="overlay"></div>
                <div class="profile-pic">
                    <img src="${notification.imgSrc}" alt="Profile Picture">
                </div>
                <div class="notification-text">
                    <p><span class="notification-username">${notification.username}</span><span> • </span><span class="time">${notification.time}</span></p>
                    <p>${notification.message}</p>
                </div>
                ${notification.postImgSrc ? `<div class="post-pic"><img src="${notification.postImgSrc}" alt="Post Image"></div>` : ''}
                <div class="noti-setting-wrapper">
                    <div class="noti-setting-icon-wrapper">
                        <img src="/images/icon/notification-setting.svg" alt="noti-setting" class="noti-setting-icon">
                    </div>
                    <div class="noti-menu hidden">
                        <button class="menu-item" onclick="toggleReadStatus(${index})">
                            <img src="/images/icon/tick.svg" alt="mark-read-noti" class="setting-menu-icon">
                            ${notification.status ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                        <button class="menu-item" onclick="deleteNotification(${index})">
                            <img src="/images/icon/trash-can.svg" alt="delete-noti" class="setting-menu-icon">
                            Delete
                        </button>
                    </div>
                </div>
            `;

            notificationItem.onclick = () => markAsRead(notificationItem, notification.href);

            notificationContainer.appendChild(notificationItem);

            const settingIcon = notificationItem.querySelector('.noti-setting-icon');
            const notiMenu = notificationItem.querySelector('.noti-menu');

            settingIcon.addEventListener('click', (event) => {
                event.stopPropagation();
                notiMenu.classList.toggle('hidden');
            });
        });
    }
    
    function markAsRead(notificationElement, href) {
        notificationElement.dataset.status = "read";
        if (href) {
            window.open(href, '_blank'); 
        } else {
            console.error("No URL specified for this notification.");
        }
    }

    function toggleReadStatus(index) {
        const notification = notificationsData[index];
        notification.status = !notification.status;
        
        const button = document.querySelectorAll('.menu-item')[index];
        button.textContent = notification.status ? 'Mark as Unread' : 'Mark as Read';
        console.log(button.textContent);
        document.querySelectorAll('.notification-item')[index].dataset.read = notification.read ? 'read' : 'unread';
    }

    function deleteNotification(index) {
        console.log(notificationsData)
        notificationsData.splice(index, 1);  
        document.querySelectorAll('.notification-item')[index].remove(); 
    }

    document.addEventListener('click', () => {
        document.querySelectorAll('.noti-menu').forEach(menu => {
            menu.classList.add('hidden');
        });
    });

    renderNotifications();

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const showUnread = tab.textContent.trim() === 'Unread'; 
            document.querySelectorAll('.notification-item').forEach(item => {
                item.classList.toggle('hidden', showUnread && item.dataset.status === 'read');
            });
        });
    });

    function markAllAsRead() {
        notificationsData.forEach(notification => notification.status = read);
    
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.dataset.status = 'read';
        });
    }
    
    const markReadButton = document.querySelector('.mark-read');
    if (markReadButton) {
        markReadButton.addEventListener('click', markAllAsRead);
    } 
    
    document.querySelector('.mark-read').addEventListener('click', markAllAsRead);
    
});
