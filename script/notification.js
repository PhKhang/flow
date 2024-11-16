document.addEventListener('DOMContentLoaded', () => {
    const notificationsData = [
        {
            username: 'nezuni1812',
            time: '1s',
            message: 'Liked your post: Giữa dòng đời hối hả, Sài Gòn mang đến những phút giây bình yên khó quên. Những buổi chiều hoàng hôn rực rỡ bên bờ sông hay ly cà phê vỉa hè, tiếng cười bạn bè vang vọng khắp nơi.',
            read: false,
            imgSrc: 'https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg',
            postImgSrc:  null
        },
        {
            username: 'nezuni1812',
            time: '15m',
            message: 'Liked on your photo.',
            read: false,
            imgSrc: 'https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg',
            postImgSrc: 'https://i.pinimg.com/736x/ef/78/37/ef78370fd9db0d29245b16444393baf6.jpg'
        },
        {
            username: 'nghoanghenry',
            time: '2h',
            message: 'Started following you.',
            read: true,
            imgSrc: 'https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg',
            postImgSrc: null
        },
        {
            username: 'phkhang',
            time: '1d',
            message: 'Commented on your post: Trộm vía mèo xinh quá chị ạ.',
            read: true,
            imgSrc: 'https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg',
            postImgSrc: 'https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg'
        }
    ];

    const notificationContainer = document.querySelector('.notifications');

    function renderNotifications() {
        notificationsData.forEach((notification, index) => {
            const notificationItem = document.createElement('div');
            notificationItem.classList.add('notification-item');
            notificationItem.dataset.read = notification.read ? 'true' : 'false';

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
                        <img src="../images/icon/notification-setting.svg" alt="noti-setting" class="noti-setting-icon">
                    </div>
                    <div class="noti-menu hidden">
                        <button class="menu-item" onclick="toggleReadStatus(${index})">
                            <img src="../images/icon/tick.svg" alt="mark-read-noti" class="setting-menu-icon">
                            ${notification.read ? 'Mark as Unread' : 'Mark as Read'}
                        </button>
                        <button class="menu-item" onclick="deleteNotification(${index})">
                            <img src="../images/icon/trash-can.svg" alt="delete-noti" class="setting-menu-icon">
                            Delete
                        </button>
                    </div>
                </div>
            `;

            notificationItem.onclick = () => markAsRead(notificationItem);
            notificationContainer.appendChild(notificationItem);

            const settingIcon = notificationItem.querySelector('.noti-setting-icon');
            const notiMenu = notificationItem.querySelector('.noti-menu');

            settingIcon.addEventListener('click', (event) => {
                event.stopPropagation();
                notiMenu.classList.toggle('hidden');
            });
        });
    }
    
    function markAsRead(notification) {
        notification.dataset.read = "true";
        
    }

    function toggleReadStatus(index) {
        const notification = notificationsData[index];
        notification.read = !notification.read;
        
        const button = document.querySelectorAll('.menu-item')[index];
        button.textContent = notification.read ? 'Mark as Unread' : 'Mark as Read';
        console.log(button.textContent);
        document.querySelectorAll('.notification-item')[index].dataset.read = notification.read ? 'true' : 'false';
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

            const showUnread = tab.textContent === 'Unread';
            document.querySelectorAll('.notification-item').forEach(item => {
                item.classList.toggle('hidden', showUnread && item.dataset.read === 'true');
            });
        });
    });

    function markAllAsRead() {
        notificationsData.forEach(notification => notification.read = true);
    
        const notificationItems = document.querySelectorAll('.notification-item');
        notificationItems.forEach(item => {
            item.dataset.read = 'true';
        });
    }

    document.querySelector('.mark-read').addEventListener('click', markAllAsRead);
    
});
