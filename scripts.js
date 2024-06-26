document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded event fired');

    // ブログ一覧の表示
    const blogListElement = document.getElementById('blog-list');
    if (blogListElement) {
        console.log('Blog list element found');
        fetch('../blog/posts.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(posts => {
                console.log('Posts fetched successfully');
                posts.forEach(post => {
                    const postElement = document.createElement('div');
                    postElement.classList.add('grid-item');
                    postElement.innerHTML = `
                        <h2><a href="${post.url}?id=${post.id}">${post.title}</a></h2>
                        <p>${post.summary}</p>
                        <p>${post.date}</p>
                    `;
                    blogListElement.appendChild(postElement);
                });
            })
            .catch(error => console.error('Error fetching posts:', error));
    } else {
        console.log('Blog list element not found');
    }

    // 記事ページの表示
    const articleElement = document.getElementById('article');
    if (articleElement) {
        console.log('Article element found');
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('id'); // URLから記事IDを取得する
        console.log('Article ID:', articleId);

        fetch('/website/blog/posts.json')  // 修正: 絶対パスを使用
            .then(response => response.json())
            .then(posts => {
                console.log('Posts fetched for article');
                const articleData = posts.find(post => post.id === articleId);
                if (articleData) {
                    document.getElementById('article-title').textContent = articleData.title;
                    document.getElementById('article-date').textContent = articleData.date;

                    // 記事の内容をフェッチして表示
                    fetch(`/website/blog/${articleData.url}`)  // 修正: 絶対パスを使用
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.text();
                        })
                        .then(articleContent => {
                            console.log('Article content fetched');
                            // DOMParserを使用して記事の本文のみを抽出
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(articleContent, 'text/html');
                            const articleBody = doc.querySelector('article').innerHTML;
                            document.getElementById('article-content').innerHTML = articleBody;
                        })
                        .catch(error => {
                            console.error('Error fetching article content:', error);
                            document.getElementById('article-content').innerHTML = `<p>記事が見つかりません。</p>`;
                        });

                    // 前後の記事のリンクを生成
                    const currentIndex = posts.indexOf(articleData);
                    const prevPost = posts[currentIndex - 1];
                    const nextPost = posts[currentIndex + 1];

                    if (prevPost) {
                        document.getElementById('prev-article').href = `/website/${prevPost.url}?id=${prevPost.id}`;  // 修正: 絶対パスを使用
                        document.getElementById('prev-article').textContent = `Prev: ${prevPost.title}`;
                        console.log('Previous article link set to', `/website/${prevPost.url}?id=${prevPost.id}`);
                    } else {
                        document.getElementById('prev-article').style.display = 'none';
                    }

                    if (nextPost) {
                        document.getElementById('next-article').href = `/website/${nextPost.url}?id=${nextPost.id}`;  // 修正: 絶対パスを使用
                        document.getElementById('next-article').textContent = `Next: ${nextPost.title}`;
                        console.log('Next article link set to', `/website/${nextPost.url}?id=${nextPost.id}`);
                    } else {
                        document.getElementById('next-article').style.display = 'none';
                    }
                } else {
                    document.getElementById('article-content').innerHTML = `<p>記事が見つかりません。</p>`;
                }
            })
            .catch(error => console.error('Error fetching article:', error));
    } else {
        console.log('Article element not found');
    }
});
