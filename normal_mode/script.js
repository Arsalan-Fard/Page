import { marked } from 'marked';

const postFiles = import.meta.glob('../posts/*.md', { query: '?raw', import: 'default', eager: true });

const posts = [
    { id: 'tutorial-02', mdPath: '../posts/tutorial-02.md', category: 'Tutorials' },
    { id: 'tutorial-01', mdPath: '../posts/tutorial-01.md', category: 'Tutorials' },
    { id: 'lab-01', mdPath: '../posts/lab-01.md', category: 'Labs' },
];

function getMarkdown(mdPath) {
    const content = postFiles[mdPath];
    if (!content) {
        throw new Error(`Missing markdown file: ${mdPath}`);
    }
    return content;
}

function extractTitle(markdown, fallback) {
    const match = markdown.match(/^#\s+(.+)\s*$/m);
    return match ? match[1].trim() : fallback;
}

function extractFirstImage(markdown) {
    const match = markdown.match(/!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/);
    return match ? match[1] : null;
}

function rewriteRelativeAssetUrls(container) {
    const isRelative = (url) =>
        url &&
        !url.startsWith('http://') &&
        !url.startsWith('https://') &&
        !url.startsWith('/') &&
        !url.startsWith('data:');

    container.querySelectorAll('img').forEach((img) => {
        const src = img.getAttribute('src');
        if (isRelative(src)) img.setAttribute('src', `../${src}`);
    });

    container.querySelectorAll('a').forEach((a) => {
        const href = a.getAttribute('href');
        if (isRelative(href)) a.setAttribute('href', `../${href}`);
    });
}

function renderMarkdown(markdown) {
    const html = marked.parse(markdown);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    rewriteRelativeAssetUrls(wrapper);
    return wrapper.innerHTML;
}

function renderCards(container) {
    const fragment = document.createDocumentFragment();

    for (const post of posts) {
        const markdown = getMarkdown(post.mdPath);
        const title = extractTitle(markdown, post.id);
        const firstImage = extractFirstImage(markdown);

        const article = document.createElement('article');
        article.className = 'project-card';
        article.dataset.category = post.category;
        article.dataset.id = post.id;

        article.innerHTML = `
            <div class="image-container">
                ${firstImage ? `<img src="../${firstImage}" alt="${title}">` : ''}
            </div>
            <div class="project-info">
                <h3 class="project-title">${title}</h3>
                <div class="tags">
                    <span class="tag">${post.category}</span>
                </div>
            </div>
        `;

        fragment.appendChild(article);
    }

    container.innerHTML = '';
    container.appendChild(fragment);
}

function setActiveFilter(buttons, activeButton) {
    buttons.forEach((btn) => btn.classList.remove('active'));
    activeButton.classList.add('active');
}

function applyFilter(cards, category) {
    cards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        const show = category === 'all' || cardCategory === category;
        card.classList.toggle('hidden', !show);
    });
}

function showProjectDetails(postId) {
    const gallery = document.getElementById('gallery');
    const filterNav = document.querySelector('.filter-nav');
    const detailView = document.getElementById('project-detail');
    const detailTitle = document.getElementById('detail-title');
    const detailImage = document.getElementById('detail-image');
    const detailContent = document.getElementById('detail-content');

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const markdown = getMarkdown(post.mdPath);
    const title = extractTitle(markdown, post.id);
    const firstImage = extractFirstImage(markdown);

    detailTitle.textContent = title;

    if (firstImage) {
        detailImage.src = `../${firstImage}`;
        detailImage.classList.remove('hidden');
    } else {
        detailImage.src = '';
        detailImage.classList.add('hidden');
    }

    detailContent.innerHTML = renderMarkdown(markdown);

    gallery.classList.add('hidden');
    filterNav.classList.add('hidden');
    detailView.classList.remove('hidden');
    window.scrollTo(0, 0);
}

function showGallery() {
    const gallery = document.getElementById('gallery');
    const filterNav = document.querySelector('.filter-nav');
    const detailView = document.getElementById('project-detail');

    gallery.classList.remove('hidden');
    filterNav.classList.remove('hidden');
    detailView.classList.add('hidden');
    window.scrollTo(0, 0);
}

function initFiltering() {
    const buttons = Array.from(document.querySelectorAll('.filter-btn'));
    const cards = Array.from(document.querySelectorAll('.project-card'));

    buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.filter || 'all';
            setActiveFilter(buttons, btn);
            applyFilter(cards, category);
        });
    });
}

function initNavigation() {
    const backButton = document.getElementById('back-btn');
    if (backButton) backButton.addEventListener('click', showGallery);

    const cards = Array.from(document.querySelectorAll('.project-card'));
    cards.forEach((card) => {
        card.addEventListener('click', () => showProjectDetails(card.dataset.id));
    });
}

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        body.classList.add('dark-mode');
    }

    if (!themeToggle) return;
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');
    renderCards(gallery);
    initFiltering();
    initNavigation();
    initThemeToggle();
});

