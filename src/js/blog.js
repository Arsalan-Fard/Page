import { posts } from './data.js';
import { marked } from 'marked';

const postFiles = import.meta.glob('../../posts/*.md', { query: '?raw', import: 'default', eager: true });
const slideFiles = import.meta.glob('../../slides/*.{jpg,jpeg,png,webp}', { query: '?url', import: 'default', eager: true });
const allSlides = Object.entries(slideFiles)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([path, url]) => url);

let lastScrollY = 0;
const blogView = document.getElementById('blog-view');
const backButton = document.getElementById('back-button');
const blogContent = document.querySelector('.blog-content');
const blogTitle = document.getElementById('blog-title');
const blogMeta = document.getElementById('blog-meta');
const blogBody = document.getElementById('blog-body');
const viewport = document.getElementById('viewport');

export function initBlog() {
    window.addEventListener('hashchange', handleHashChange);
    backButton.addEventListener('click', () => {
        window.location.hash = '';
    });
    handleHashChange();
}

export function isBlogOpen() {
    return !blogView.classList.contains('hidden');
}

function handleHashChange() {
    const hash = window.location.hash.substring(1);
    const post = posts.find(p => p.slug === hash);

    if (!post) {
        blogView.classList.add('hidden');
        viewport.style.opacity = '1';
        document.body.style.overflow = '';
        blogContent.classList.remove('is-slideshow');
        if (lastScrollY > 0) {
            window.scrollTo(0, lastScrollY);
        }
        return;
    }

    lastScrollY = window.scrollY;
    blogView.classList.remove('hidden');
    viewport.style.opacity = '0';
    document.body.style.overflow = 'hidden';

    blogTitle.textContent = post.title;
    blogMeta.textContent = post.meta + ' | ' + post.tags.join(', ');
    blogContent.classList.remove('is-slideshow');

    if (post.slides && allSlides.length > 0) {
        blogContent.classList.add('is-slideshow');
        showSlideshow(allSlides, post.title);
        return;
    }

    const mdPath = `../../posts/${post.slug}.md`;
    const mdContent = postFiles[mdPath];

    if (mdContent) {
        blogBody.innerHTML = marked.parse(mdContent);
    } else if (post.body.length < 50 || post.body === '...' || post.body === '--') {
        blogBody.innerHTML = '<p>No content available yet.</p>';
    } else {
        blogBody.textContent = post.body;
    }
}

function showSlideshow(slideUrls, title) {
    if (slideUrls.length === 0) {
        blogBody.innerHTML = '<p>No slides available.</p>';
        return;
    }

    blogBody.innerHTML = `
        <div class="slideshow">
            <button class="slide-nav slide-prev">&larr;</button>
            <img class="slide-image" src="${slideUrls[0]}" alt="${title} slide 1">
            <button class="slide-nav slide-next">&rarr;</button>
            <div class="slide-counter">1 / ${slideUrls.length}</div>
        </div>
    `;

    const prevBtn = blogBody.querySelector('.slide-prev');
    const nextBtn = blogBody.querySelector('.slide-next');
    const img = blogBody.querySelector('.slide-image');
    const counter = blogBody.querySelector('.slide-counter');
    let currentSlide = 0;

    function goToSlide(newIndex) {
        currentSlide = (newIndex + slideUrls.length) % slideUrls.length;
        img.src = slideUrls[currentSlide];
        img.alt = `${title} slide ${currentSlide + 1}`;
        counter.textContent = `${currentSlide + 1} / ${slideUrls.length}`;
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
}
