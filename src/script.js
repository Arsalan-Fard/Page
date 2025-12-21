const posts = [
    {
        title: "Lecture and Project",
        meta: "Main Track",
        body: "The project subject is Locomotion. You can see presentations, demos and final project in this path.",
        tags: ["projects", "main"],
        isProjects: true,
        slug: "main-track"
    },
    {
        title: "Lab Assignments",
        meta: "Lab Track",
        body: "This path shows lab assignments. You can see unity projects about a ball in Telecom paris!",
        tags: ["lab", "assignments"],
        isLabAssignments: true,
        slug: "lab-track"
    },
    {
        title: "Tutorials",
        meta: "Tutorial Track",
        body: "Learn how to setup a blog like this. And also how to setup Unity 6 for your VR projects.",
        tags: ["Tutorial", "theory"],
        isTutorialAssignments: true,
        slug: "tutorial-track"
    },
    
    {
        title: "Lab 01: The Ball",
        meta: "2025.12.25",
        body: "--",
        tags: ["--"],
        isLabRoute: true,
        slug: "lab-01"
    },
    {
        title: "Lab 02: The VR Ball",
        meta: "2025.12.25",
        body: "--",
        tags: ["--"],
        isLabRoute: true,
        slug: "lab-02"
    },
    {
        title: "Tutorial 01: Blog Setup",
        meta: "2025.12.18",
        body: "This section provides you quick tips about how this blog is created and deployed on github.",
        tags: ["ThreeJS", "GitHub Pages"],
        isTutorialRoute: true,
        slug: "tutorial-01"
    },
    {
        title: "Tutorial 02: Unity Setup",
        meta: "2025.12.20",
        body: "This section provides you quick tips about how to setup Unity 6.",
        tags: ["Unity 6"],
        isTutorialRoute: true,
        slug: "tutorial-02"
    },
    
    {
        title: "Lecture 01: Three Locomotion Techniques",
        meta: "2025.12.08",
        body: "...",
        tags: ["Presentation", "Locomotion", "MR"],
        isProjectRoute: true,
        slug: "lecture-01"
    },
    {
        title: "Lecture 02: Proposing our Locomotion Technique",
        meta: "-",
        body: "...",
        tags: ["Presentation", "Locomotion", "MR"],
        isProjectRoute: true,
        slug: "lecture-02"
    },
    {
        title: "Project 01: ...",
        meta: "-",
        body: "...",
        tags: ["Presentation", "Locomotion", "MR"],
        isProjectRoute: true,
        slug: "project-01"
    },

];

const spacing = 2300;
const scatterX = 220;
const scatterY = 140;
const postsEl = document.getElementById("posts");
const voxelField = document.getElementById("voxel-field");
const scrollTrack = document.getElementById("scroll-track");
const scene = document.getElementById("scene");
const hero = document.getElementById("hero");
const scrollHint = document.getElementById("scroll-hint");
const introDim = document.getElementById("intro-dim");
const intersectionHint = document.getElementById("intersection-hint");
const typedText = document.getElementById("typed-text");
const minimap = document.getElementById("minimap");
const ctx = minimap.getContext("2d");
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

const totalDepth = (posts.length - 1) * spacing + 2800;
const introDepth = 5400;
scrollTrack.style.height = `${Math.max(520, posts.length * 140)}vh`;

// Store world positions for the minimap
const mapPoints = [];
let mapBounds = { minX: 0, maxX: 0, minZ: -totalDepth, maxZ: introDepth };

let labCount = 0;
let TutorialCount = 0;
let projectCount = 0;

posts.forEach((post, index) => {
    const frame = document.createElement("article");
    frame.className = "post-frame";

    // Position intersection frames and routes
    let z, x, y, rotateY = 0;
    let mapX = 0; // Default map X
    let mapZ = 0; // Default map Z

    if (index === 0) {
        // Projects frame - CENTER of screen
        z = 0;
        x = 0;
        y = 0;
        frame.classList.add("intersection-frame", "project-assignments");
        mapZ = 0;
    } else if (index === 1) {
        // Lab Assignments frame
        z = 200;
        x = 450;
        y = 0;
        rotateY = -45;
        frame.classList.add("lab-assignments", "intersection-frame");
        // Map to center (overlap with index 0 for "one dot" effect)
        mapX = 0; mapZ = 0;
    } else if (index === 2) {
        // Tutorial Assignments frame
        z = 200;
        x = -450;
        y = 0;
        rotateY = 45;
        frame.classList.add("Tutorial-assignments", "intersection-frame");
        // Map to center
        mapX = 0; mapZ = 0;
    } else if (post.isLabRoute) {
        // Lab Branch
        labCount++;
        z = -labCount * spacing * Math.cos(Math.PI / 4);
        x = 600 + labCount * spacing * Math.sin(Math.PI / 4);
        y = 0;
        rotateY = -45;
        frame.classList.add("lab-assignments");
        // Keep actual position for map
        mapX = x;
        mapZ = z;
    } else if (post.isTutorialRoute) {
        // Tutorial Branch
        TutorialCount++;
        z = -TutorialCount * spacing * Math.cos(Math.PI / 4);
        x = -600 - TutorialCount * spacing * Math.sin(Math.PI / 4);
        y = 0;
        rotateY = 45;
        frame.classList.add("Tutorial-assignments");
        // Keep actual position for map
        mapX = x;
        mapZ = z;
    } else {
        // Main Track
        projectCount++;
        z = -projectCount * spacing;
        x = (Math.random() * 2 - 1) * scatterX;
        y = (Math.random() * 2 - 1) * scatterY;
        // Force align to center line on map
        mapX = 0;
        mapZ = z;
    }

    // Only add unique points or simplified representation
    // For indices 0, 1, 2, they map to (0,0). We can just add one of them or all (they overlap).
    // Let's add all to track them, but visually they are one.
    mapPoints.push({ x: mapX, z: mapZ, type: (index <= 2) ? 'node' : 'post', originalIndex: index });

    // Update bounds for map (using symmetric X to keep 0 centered)
    const absX = Math.abs(mapX);
    mapBounds.maxX = Math.max(mapBounds.maxX, absX);
    // minZ is already tracked via loop logic mostly, but let's ensure
    mapBounds.minZ = Math.min(mapBounds.minZ, mapZ);

    frame.style.setProperty("--x", `${x}px`);
    frame.style.setProperty("--y", `${y}px`);
    frame.style.setProperty("--z", `${z}px`);
    frame.style.setProperty("--rotateY", `${rotateY}deg`);
    frame.dataset.z = z;

    // Check if this is an intersection frame (indices 0, 1, 2)
    const isIntersectionFrame = index <= 2;

    frame.innerHTML = `
                <div class="frame-inner">
                    <h2 class="frame-title">${post.title}</h2>
                    <div class="frame-meta">${post.meta}</div>
                    <p class="frame-body">${post.body}</p>
                    ${!isIntersectionFrame ? `<div class="frame-tags">
                        ${post.tags.map((tag) => `<span class="frame-tag">${tag}</span>`).join("")}
                    </div>` : ''}
                </div>
            `;

    // Add click handlers
    if (post.isProjects) {
        frame.addEventListener("click", () => {
            targetRotationY = 0; // Rotate back to center
            targetTranslateX = 0; // Move back to center
        });
        frame.style.pointerEvents = "auto";
    } else if (post.isLabAssignments) {
        frame.addEventListener("click", () => {
            targetRotationY = 45; // Rotate 45 degrees to the right
            targetTranslateX = 350; // Move camera to the right (adjust this value)
        });
        frame.style.pointerEvents = "auto";
    } else if (post.isTutorialAssignments) {
        frame.addEventListener("click", () => {
            targetRotationY = -45; // Rotate 45 degrees to the left
            targetTranslateX = -350; // Move camera to the left (adjust this value)
        });
        frame.style.pointerEvents = "auto";
    } else {
        // Generic Post Click
        frame.addEventListener("click", (e) => {
            e.stopPropagation();
            if (post.slug) {
                window.location.hash = post.slug;
            }
        });
        frame.style.pointerEvents = "auto";
    }

    postsEl.appendChild(frame);
});

// End main track at the last main-track point (x === 0).
const mainTrackPoints = mapPoints.filter((point) => point.x === 0);
if (mainTrackPoints.length > 0) {
    mapBounds.minZ = Math.min(...mainTrackPoints.map((point) => point.z));
}

// Setup Minimap
minimap.width = 400; // Double resolution for crispness
minimap.height = 300;

function drawMinimap() {
    ctx.clearRect(0, 0, minimap.width, minimap.height);

    const padding = 40;
    const availableWidth = minimap.width - padding * 2;
    const availableHeight = minimap.height - padding * 2;

    // Calculate ranges
    // Z Range: roughly 15000 units (5400 start to -9200 end)
    // X Range: roughly 4500 units (+/- 2226)
    const rangeZ = mapBounds.maxZ - mapBounds.minZ;
    const rangeX = Math.max(mapBounds.maxX * 2, 2000); // Ensure minimal width

    // Calculate Scale Factors for each dimension
    const scaleZ = availableHeight / rangeZ;
    const scaleX = availableWidth / rangeX;

    // UNIFIED SCALE: Use the smaller scale to fit both dimensions within the box
    // This preserves the aspect ratio (angles).
    // Since the world is very long (Z) and narrow (X), scaleZ will likely be the limiting factor.
    const scale = Math.min(scaleZ, scaleX);

    function getMapY(worldZ) {
        // Map worldZ to canvas Y
        // maxZ (Start) -> Bottom
        // minZ (End) -> Top
        // Formula: BottomY - (distance_from_start * scale)
        const distanceFromStart = mapBounds.maxZ - worldZ;
        return (minimap.height - padding) - (distanceFromStart * scale);
    }

    function getMapX(worldX) {
        // Map worldX to canvas X
        // 0 -> Center
        const center = minimap.width / 2;
        return center + (worldX * scale);
    }

    // Draw Connection Lines
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 3;

    // Main Track (Index 0 -> End)
    // Just draw a line from (0, maxZ) to (0, minZ)
    ctx.moveTo(getMapX(0), getMapY(mapBounds.maxZ)); // Start
    ctx.lineTo(getMapX(0), getMapY(mapBounds.minZ)); // End
    ctx.stroke();

    // Lab Branch Line
    const labPoints = mapPoints.filter(p => posts[p.originalIndex].isLabRoute);
    if (labPoints.length > 0) {
        // Sort points by Z (highest Z is closest to start) to ensure sequential drawing
        labPoints.sort((a, b) => b.z - a.z);

        ctx.beginPath();
        ctx.moveTo(getMapX(0), getMapY(0)); // Start at Intersection
        labPoints.forEach(p => {
            ctx.lineTo(getMapX(p.x), getMapY(p.z)); // Draw to next node
        });
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
        ctx.stroke();
    }

    // Tutorial Branch Line
    const tutorialPoints = mapPoints.filter(p => posts[p.originalIndex].isTutorialRoute);
    if (tutorialPoints.length > 0) {
        // Sort points by Z (highest Z is closest to start)
        tutorialPoints.sort((a, b) => b.z - a.z);

        ctx.beginPath();
        ctx.moveTo(getMapX(0), getMapY(0)); // Start at Intersection
        tutorialPoints.forEach(p => {
            ctx.lineTo(getMapX(p.x), getMapY(p.z)); // Draw to next node
        });
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
        ctx.stroke();
    }

    // Draw Points
    mapPoints.forEach((p, i) => {
        if ((p.originalIndex === 1 || p.originalIndex === 2)) return;

        const mx = getMapX(p.x);
        const my = getMapY(p.z);

        ctx.beginPath();
        ctx.arc(mx, my, p.type === 'node' ? 3 : 5, 0, Math.PI * 2);

        let color = 'rgba(143, 176, 196, 0.5)';
        if (p.type === 'node') color = '#00f0ff';
        
        ctx.fillStyle = color;
        ctx.fill();
    });

    // Draw Player
    const yRadian = -currentRotationY * Math.PI / 180;
    const forward = -currentZ;

    const playerWorldZ = forward * Math.cos(yRadian);;
    const playerWorldX = currentTranslateX + forward * Math.sin(yRadian);;

    const px = getMapX(playerWorldX);
    const py = getMapY(playerWorldZ);

    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ff4f7b';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Start Point (Reference)
    const sx = getMapX(0);
    const sy = getMapY(introDepth);
    ctx.beginPath();
    ctx.moveTo(sx - 45, sy);
    ctx.lineTo(sx + 45, sy);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
}

console.log("--- Frame Layout Debug ---");
document.querySelectorAll('.post-frame').forEach((frame, index) => {
    const x = frame.style.getPropertyValue('--x');
    const y = frame.style.getPropertyValue('--y');
    const z = frame.style.getPropertyValue('--z');
    const type = frame.classList.contains('intersection-frame') ? 'Intersection' : 'Post';
    console.log(`Frame ${index} (${type}): X=${x}, Y=${y}, Z=${z}`);
});

for (let i = 0; i < 160; i += 1) {
    const voxel = document.createElement("span");
    voxel.className = "voxel";
    const x = (Math.random() * 2 - 1) * 1200;
    const y = (Math.random() * 2 - 1) * 800;
    const z = -Math.random() * (totalDepth + 3000);
    voxel.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
    voxel.style.animationDelay = `${Math.random() * 2}s`;
    voxelField.appendChild(voxel);
}

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
let isTyping = false;
let lastScrollY = 0;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let isIntroActive = !prefersReducedMotion;
let introRevealStart = 0;
let introRevealDurationMs = 1100;
let introLock = null;

console.log(`Starting Camera Position: X=${currentTranslateX}, Y=0, Z=${currentZ}`);

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
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

    introRevealStart = performance.now() + 180;
    body.classList.add('intro-revealing');

    const skip = () => finishIntro(true);
    window.addEventListener('keydown', skip, { once: true });
    window.addEventListener('pointerdown', skip, { once: true });
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

// Typewriter effect function
function typeWriter(text, element, speed = 50) {
    if (isTyping) return;
    isTyping = true;
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.add('typing-complete');
            setTimeout(() => {
                intersectionHint.classList.remove('visible');
            }, 4000); // Hide after 4 seconds
        }
    }
    type();
}

function updateFrameVisibility(depth) {
    const frames = document.querySelectorAll(".post-frame");
    frames.forEach((frame) => {
        const z = parseFloat(frame.dataset.z);
        const distance = Math.abs(z + depth);
        const fade = 1 - distance / 2800;
        const opacity = clamp(fade, 0.05, 1);
        frame.style.opacity = opacity.toFixed(2);
        frame.style.filter = `blur(${clamp((1 - opacity) * 3.5, 0, 3)}px)`;
    });
}





function onPointerMove(event) {
    const nx = (event.clientX / window.innerWidth) - 0.5;
    const ny = (event.clientY / window.innerHeight) - 0.5;
    tiltY = nx * 6;
    tiltX = -ny * 4;

    // Update cursor position directly with transform (more performant)
    if (cursorDot) {
        cursorDot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    }
    if (cursorRing) {
        cursorRing.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    }
}

document.addEventListener("mousedown", () => document.body.classList.add("clicking"));
document.addEventListener("mouseup", () => document.body.classList.remove("clicking"));

document.addEventListener("mouseover", (e) => {
    if (e.target.closest("a, button, .post-frame, input, select, textarea")) {
        document.body.classList.add("hovering");
    } else {
        document.body.classList.remove("hovering");
    }
});

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
        if (introDim) {
            introDim.style.opacity = clamp(0.25 * (1 - eased), 0, 0.25).toFixed(2);
        }

        if (t >= 1) {
            finishIntro(false);
        }

        drawMinimap();
        requestAnimationFrame(animate);
        return;
    }

    // Detect intersection arrival (when currentZ is close to 0, meaning we've reached the frames)
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
    if (introDim) {
        const dimOpacity = clamp(0.55 * (1 - introProgress), 0, 0.55);
        introDim.style.opacity = dimOpacity.toFixed(2);
    }
    drawMinimap();
    requestAnimationFrame(animate);
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("pointermove", onPointerMove);
window.addEventListener("resize", onScroll);

startIntro();
onScroll();
animate();

// Blog Routing Logic
const blogView = document.getElementById('blog-view');
const backButton = document.getElementById('back-button');
const blogTitle = document.getElementById('blog-title');
const blogMeta = document.getElementById('blog-meta');
const blogImage = document.getElementById('blog-image');
const blogBody = document.getElementById('blog-body');
const viewport = document.getElementById('viewport');

function triggerGlitch() {
    if (typeof PowerGlitch !== 'undefined') {
        const { startGlitch, stopGlitch } = PowerGlitch.glitch(document.body, {
            playMode: 'manual',
            createContainers: false, // Don't create containers if not needed, but usually required for effect
            hideOverflow: true,
            timing: {
                duration: 500,
                iterations: 1
            },
            glitchTimeDivisor: 1,
            shake: {
                velocity: 20,
                amplitude: 0.1,
            },
            slice: {
                count: 15,
                velocity: 20,
                minHeight: 0.02,
                maxHeight: 0.15,
                hueRotate: true,
            },
            pulse: false
        });

        startGlitch();
        setTimeout(stopGlitch, 600);
    }
}

function handleHashChange() {
    // Trigger glitch effect on every navigation
    triggerGlitch();

    const hash = window.location.hash.substring(1); // Remove #
    const post = posts.find(p => p.slug === hash);

    if (post) {
        // Save current scroll position before opening blog
        lastScrollY = window.scrollY;

        // Show Blog
        blogView.classList.remove('hidden');
        viewport.style.opacity = '0'; // Hide 3D scene visually
        minimap.style.display = 'none'; // Hide Minimap
        document.body.style.overflow = 'hidden'; // Lock 3D Scroll
        
        blogTitle.textContent = post.title;
        blogMeta.textContent = post.meta + ' | ' + post.tags.join(', ');
        
        // Placeholder image logic
        blogImage.src = 'https://via.placeholder.com/800x400/001018/00f0ff?text=' + encodeURIComponent(post.title); 
        
        // Use placeholder text if body is short/empty or generic
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
        // Hide Blog
        blogView.classList.add('hidden');
        viewport.style.opacity = '1';
        minimap.style.display = 'block'; // Show Minimap
        document.body.style.overflow = ''; // Unlock 3D Scroll
        
        // Restore scroll position
        if (lastScrollY > 0) {
            window.scrollTo(0, lastScrollY);
        }
    }
}

window.addEventListener('hashchange', handleHashChange);
backButton.addEventListener('click', () => {
    window.location.hash = ''; // Clear hash to go back
});

function onScroll() {
    if (isIntroActive) return;
    // Stop 3D scroll update if blog is open
    if (!blogView.classList.contains('hidden')) return;

    const maxScroll = document.body.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    targetZ = scrollProgress * (totalDepth + introDepth) - introDepth;
    console.log(`Current Position (Target): Z=${targetZ.toFixed(2)}, Scroll=${scrollProgress.toFixed(3)}`);
}

// Initial check in case user loads with hash
handleHashChange();

