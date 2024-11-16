document.addEventListener('DOMContentLoaded', () => {
    const postData = [
        {
            avatarSrc: "https://i.pinimg.com/564x/fd/cf/c7/fdcfc7eadc949b0a9c85bc08f079998a.jpg",
            username: "olivia.food.blog",
            time: "8 giờ",
            text: "Finally checked out Mensho Tokyo in Sydney—and luckily, no line! Verdict: super delicious, but not totally convinced it's worth the price point. What do you think?",
            image: "https://i.pinimg.com/564x/fd/cf/c7/fdcfc7eadc949b0a9c85bc08f079998a.jpg",
            likes: 2900,
            type: 'post'
        }
    ];

    const userData = [
        {
            username: '_nezuni1812',
            followers: "305",
            isFollowed: false,
            bio: 'Trần Ngọc Uyển Nhi',
            type: 'user',
            avatarSrc: 'https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg',
        },
        {
            username: 'nghoanghenry',
            followers: "40M",
            isFollowed: false,
            bio: 'Hoang Nguyen',
            type: 'user',
            avatarSrc: 'https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg',
        },
        {
            username: 'phkhang',
            followers: "21.7K",
            isFollowed: false,
            bio: 'Phuc Khang 🫥',
            type: 'user',
            avatarSrc: 'https://i.pinimg.com/564x/30/68/fe/3068feecc66810f705ccec8500626428.jpg',
        },
    ];

    const renderSearchResult = (data) => {
        const searchResults = document.getElementById('search-results');
        searchResults.innerHTML = '';

        data.forEach((item, index) => {
            const div = document.createElement('div');
            div.classList.add('search-result-item');
            div.dataset.type = item.type;

            if (item.type === 'user') {
                div.innerHTML = `
                    <div class="overlay"></div>
                    <div class="profile-pic">
                        <img src="${item.avatarSrc}" alt="User Avatar">
                    </div>
                    <div class="search-text">
                        <a href="./otherProfile.html" class="search-username"><p >${item.username}</p></a>
                        <p class="search-user-bio">${item.bio}</p>
                        <p class="mt-1">${item.followers} followers</p>
                    </div>
                    <button class="follow-btn mt-1 me-1 ${item.isFollowed ? 'following' : ''}" data-index="${index}">
                        <p>${item.isFollowed ? 'Following' : 'Follow'}</p>
                    </button>
                `;
            } else if (item.type === 'post') {
                div.innerHTML = `
                    <div class="profile-pic">
                        <img src="${item.avatarSrc}" alt="User Avatar">
                    </div>
                    <p><strong>${item.username}</strong> - ${item.time}</p>
                    <p>${item.text}</p>
                    <img src="${item.image}" alt="Post Image">
                    <p>Likes: ${item.likes}</p>
                `;
            }

            searchResults.appendChild(div);
        });

        document.querySelectorAll('.follow-btn').forEach(button => {
            button.addEventListener('click', () => {
                const index = button.getAttribute('data-index');
                userData[index].isFollowed = !userData[index].isFollowed;
                renderSearchResult(userData); 
            });
        });
    };

    renderSearchResult(userData);

    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const showPost = tab.textContent === 'Post';
            renderSearchResult(showPost ? postData : userData);
        });
    });
});
