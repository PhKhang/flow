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
            postImgSrc: 'https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/464870771_1127720692692959_4752701202994234827_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEQBiU9u-WwNBHtOje4a7Bb6YVee1A8PeXphV57UDw95ehDYhf8_eEqbbVuACZu7VDvlOpGUmV32nDzjJj8M7Iy&_nc_ohc=V3DdQ16SEu0Q7kNvgETXjbq&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=AvrWGSR6h0i_rEyyy6JsQ49&oh=00_AYAdhW17ANblM5QfFjamOJZc0lU_zG6t-LSU10FT8io4bg&oe=672E4AA0'
        },
        {
            username: 'uyeernnhiiii',
            time: '2h',
            message: 'Started following you.',
            read: true,
            imgSrc: 'https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg',
            postImgSrc: null
        },
        {
            username: 'uyeernnhiiii',
            time: '1d',
            message: 'Commented on your post: Trộm vía mèo xinh quá chị ạ.',
            read: true,
            imgSrc: 'https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg',
            postImgSrc: 'https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg'
        }
    ];

    const notificationContainer = document.querySelector('.notifications');

    function renderNotifications() {
        notificationsData.forEach(notification => {
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
            `;

            notificationItem.onclick = () => markAsRead(notificationItem);

            notificationContainer.appendChild(notificationItem);
        });
    }

    function markAsRead(notification) {
        notification.dataset.read = "true";
    }

    function markAllAsRead() {
        document.querySelectorAll('.notification-item').forEach(item => {
            markAsRead(item);
        });
    }

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

    document.querySelector('.mark-read').addEventListener('click', markAllAsRead);
});
