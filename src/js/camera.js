import { totalDepth, introDepth, posts } from './data.js';
import { drawMinimap } from './map.js';
import { clamp, easeOutCubic, typeWriter } from './utils.js';
import { isBlogOpen } from './blog.js';

let targetZ = -introDepth;
let currentZ = -introDepth;
let scrollProgress = 0;
let tiltX = 0;
let tiltY = 0;
let targetRotationY = 0;
let currentRotationY = 0;
let targetTranslateX = 0;
let currentTranslateX = 0;
let hasReachedIntersection = false;

const scene = document.getElementById("scene");
const hero = document.getElementById("hero");
const scrollHint = document.getElementById("scroll-hint");
const normalModeLink = document.getElementById("normal-mode-link");
const introDim = document.getElementById("intro-dim");
const minimap = document.getElementById("minimap");
const ctx = minimap ? minimap.getContext("2d") : null;
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let isIntroActive = !prefersReducedMotion;
let introRevealStart = 0;
let introRevealDurationMs = 1100;
let introLock = null;

export function setCameraTarget(rotY, transX) {
    targetRotationY = rotY;
    targetTranslateX = transX;
}

function updateFrameVisibility(depth) {
    const frames = document.querySelectorAll(".post-frame");
    frames.forEach((frame) => {
        const z = parseFloat(frame.dataset.z);
        const distance = Math.abs(z + depth);
        
        let fadeDist = 2800;
        // if (frame.classList.contains('lab-assignments') || frame.classList.contains('Tutorial-assignments')) {
        //     fadeDist = 3200;
        // }

        const fade = 1 - distance / fadeDist;
        const opacity = clamp(fade, 0.15, 1);
        frame.style.opacity = opacity.toFixed(2);
        // frame.style.filter = `blur(${clamp((1 - opacity) * 3.5, 0, 2)}px)`;
    });
}

function onScroll() {
    if (isIntroActive) return;
    if (isBlogOpen()) return;

    const maxScroll = document.body.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    targetZ = scrollProgress * (totalDepth + introDepth) - introDepth;
}

function onPointerMove(event) {
    const nx = (event.clientX / window.innerWidth) - 0.5;
    const ny = (event.clientY / window.innerHeight) - 0.5;
    tiltY = nx * 6;
    tiltX = -ny * 4;

    if (cursorDot) {
        cursorDot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    }
    if (cursorRing) {
        cursorRing.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    }
}

function finishIntro(immediate = false) {
    if (!isIntroActive) return;
    isIntroActive = false;

    const html = document.documentElement;
    const body = document.body;
    if (body) {
        body.classList.remove('intro-running');
        body.classList.remove('intro-revealing');
    }

    if (introLock) {
        html.style.overflow = introLock.htmlOverflow;
        if (body) body.style.overflow = introLock.bodyOverflow;
        introLock = null;
    } else {
        html.style.overflow = '';
        if (body) body.style.overflow = '';
    }

    if (immediate) {
        if (hero) {
            hero.style.opacity = '1';
            hero.style.transform = 'translate3d(0, 0, 0)';
        }
    }

    onScroll();
}

function startIntro() {
    if (!isIntroActive) {
        if (document.body) {
            document.body.classList.remove('intro-preload');
        }
        return;
    }

    const html = document.documentElement;
    const body = document.body;
    if (!body) return;

    introLock = {
        htmlOverflow: html.style.overflow,
        bodyOverflow: body.style.overflow
    };

    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    body.classList.remove('intro-preload');
    body.classList.add('intro-running');

    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translate3d(0, 0, 0)';
    }
    if (scrollHint) {
        scrollHint.style.opacity = '0';
    }
    if (normalModeLink) {
        normalModeLink.style.opacity = '0';
    }

    introRevealStart = performance.now() + 180;
    body.classList.add('intro-revealing');

    const skip = () => finishIntro(true);
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });
}

export function initCamera(mapPoints, mapBounds) {
    const intersectionHint = document.getElementById("intersection-hint-3d");
    const typedText = document.getElementById("typed-text-3d");

    // Scroll Track sizing
    const scrollTrack = document.getElementById("scroll-track");
    scrollTrack.style.height = `${Math.max(520, posts.length * 140)}vh`;

    // Listeners
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", onScroll);
    document.addEventListener("mousedown", () => document.body.classList.add("clicking"));
    document.addEventListener("mouseup", () => document.body.classList.remove("clicking"));
    document.addEventListener("mouseover", (e) => {
        if (e.target.closest("a, button, .post-frame, input, select, textarea")) {
            document.body.classList.add("hovering");
        } else {
            document.body.classList.remove("hovering");
        }
    });

    if (minimap) {
        minimap.width = 400; 
        minimap.height = 300;
    }

    // Animation Loop
    function animate() {
        currentZ += (targetZ - currentZ) * 0.08;
        currentRotationY += (targetRotationY - currentRotationY) * 0.08;
        currentTranslateX += (targetTranslateX - currentTranslateX) * 0.08;
        
        scene.style.transform = `translate3d(${-currentTranslateX}px, 0, ${currentZ}px) rotateX(${tiltX}deg) rotateY(${tiltY + currentRotationY}deg)`;
        
        updateFrameVisibility(currentZ);

        if (isIntroActive) {
            const now = performance.now();
            const t = clamp((now - introRevealStart) / introRevealDurationMs, 0, 1);
            const eased = easeOutCubic(t);

            if (hero) {
                hero.style.opacity = eased.toFixed(2);
                hero.style.transform = 'translate3d(0, 0, 0)';
            }
            if (scrollHint) {
                scrollHint.style.opacity = clamp(eased * 0.9, 0, 0.9).toFixed(2);
            }
            if (normalModeLink) {
                normalModeLink.style.opacity = clamp(eased * 0.9, 0, 0.9).toFixed(2);
            }
            if (introDim) {
                introDim.style.opacity = clamp(0.25 * (1 - eased), 0, 0.25).toFixed(2);
            }

            if (t >= 1) {
                finishIntro(false);
            }

            drawMinimap(ctx, minimap, mapPoints, mapBounds, posts, currentZ, currentTranslateX, currentRotationY);
            requestAnimationFrame(animate);
            return;
        }

        if (!hasReachedIntersection && currentZ >= -500 && currentZ <= 500) {
            hasReachedIntersection = true;
            intersectionHint.classList.add('visible');
            typeWriter('> CLICK ON A TRACK: Continue scrolling to see more.', typedText, 60);
        }

        const introProgress = clamp((currentZ + introDepth) / introDepth, 0, 1);
        const heroOpacity = clamp(1 - introProgress * 2, 0, 1);
        if (hero) {
            hero.style.opacity = heroOpacity.toFixed(2);
            hero.style.transform = `translate3d(0, ${introProgress * -50}px, 0)`;
        }
        if (scrollHint) {
            scrollHint.style.opacity = clamp(heroOpacity * 0.9, 0, 0.9).toFixed(2);
        }
        if (normalModeLink) {
            normalModeLink.style.opacity = clamp(heroOpacity * 0.9, 0, 0.9).toFixed(2);
        }
        if (introDim) {
            const dimOpacity = clamp(0.55 * (1 - introProgress), 0, 0.55);
            introDim.style.opacity = dimOpacity.toFixed(2);
        }
        
        drawMinimap(ctx, minimap, mapPoints, mapBounds, posts, currentZ, currentTranslateX, currentRotationY);
        requestAnimationFrame(animate);
    }

    startIntro();
    onScroll();
    animate();
}
