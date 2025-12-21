import { posts } from './data.js';
import { triggerGlitch } from './utils.js';

let lastScrollY = 0;
const blogView = document.getElementById('blog-view');
const backButton = document.getElementById('back-button');
const blogTitle = document.getElementById('blog-title');
const blogMeta = document.getElementById('blog-meta');
const blogImage = document.getElementById('blog-image');
const blogBody = document.getElementById('blog-body');
const viewport = document.getElementById('viewport');
const minimap = document.getElementById('minimap');

export function initBlog() {
    window.addEventListener('hashchange', handleHashChange);
    backButton.addEventListener('click', () => {
        window.location.hash = '';
    });
    // Initial check
    handleHashChange();
}

export function isBlogOpen() {
    return !blogView.classList.contains('hidden');
}

function handleHashChange() {
    triggerGlitch();

    const hash = window.location.hash.substring(1);
    const post = posts.find(p => p.slug === hash);

    if (post) {
        lastScrollY = window.scrollY;

        blogView.classList.remove('hidden');
        viewport.style.opacity = '0';
        if(minimap) minimap.style.display = 'none';
        document.body.style.overflow = 'hidden';
        
        blogTitle.textContent = post.title;
        blogMeta.textContent = post.meta + ' | ' + post.tags.join(', ');
        blogImage.src = 'https://via.placeholder.com/800x400/001018/00f0ff?text=' + encodeURIComponent(post.title); 
        
        if (post.body.length < 50 || post.body === '...' || post.body === '--') {
             blogBody.innerHTML = `
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            `;
        } else {
            blogBody.textContent = post.body;
        }

    } else {
        blogView.classList.add('hidden');
        viewport.style.opacity = '1';
        if(minimap) minimap.style.display = 'block';
        document.body.style.overflow = '';
        
        if (lastScrollY > 0) {
            window.scrollTo(0, lastScrollY);
        }
    }
}
