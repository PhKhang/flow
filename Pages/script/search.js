document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const categoryInput = document.getElementById('category');
    const searchForm = document.getElementById('search-form');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            categoryInput.value = tab.getAttribute('data-category');
            searchForm.submit();
        });
    });
});
