document.addEventListener('DOMContentLoaded', function () {
    let posts = [];
    let currentPage = 1;
    const postsPerPage = 5; // 一度に表示する投稿数

    // JSONから投稿を取得し、日付順にソート
    function fetchPosts() {
        fetch('../blog/posts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                posts = data.sort((a, b) => new Date(b.date) - new Date(a.date)); // 最新順にソート
                displayPosts();
                setupLazyLoad();
            })
            .catch(error => console.error('Error fetching posts:', error));
    }

    // 投稿を表示する
    function displayPosts() {
        const blogList = document.getElementById('blog-list');
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const postsToDisplay = posts.slice(start, end);

        postsToDisplay.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('grid-item');
            postElement.innerHTML = `
                <h2><a href="${post.url}?id=${post.id}">${post.title}</a></h2>
                <p>${post.summary}</p>
                <p>${post.date}</p>
            `;
            blogList.appendChild(postElement);
        });

        currentPage++;
    }

    // Lazy Loadを設定する
    function setupLazyLoad() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    displayPosts();
                    observer.unobserve(entry.target);
                    if (currentPage <= Math.ceil(posts.length / postsPerPage)) {
                        observer.observe(document.querySelector('#blog-list > .grid-item:last-child'));
                    }
                }
            });
        }, {
            rootMargin: '0px 0px 200px 0px',
            threshold: 0.1
        });

        observer.observe(document.querySelector('#blog-list > .grid-item:last-child'));
    }

    fetchPosts();
});
