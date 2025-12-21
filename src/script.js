const posts = [
    {
        title: "Projects",
        meta: "Main Track",
        body: "Explore our main project portfolio and research initiatives.",
        tags: ["projects", "main"],
        isProjects: true
    },
    {
        title: "Lab Assignments",
        meta: "Lab Track",
        body: "View lab sessions, experiments, and hands-on assignments.",
        tags: ["lab", "assignments"],
        isLabAssignments: true
    },
    {
        title: "Lecture Assignments",
        meta: "Lecture Track",
        body: "Access lecture materials, notes, and theoretical assignments.",
        tags: ["lecture", "theory"],
        isLectureAssignments: true
    },
    {
        title: "Lab 01: Sensor Calibration",
        meta: "Lab Session / Week 2",
        body: "Hands-on sensor calibration and drift correction experiments.",
        tags: ["lab", "sensors", "calibration"],
        isLabRoute: true
    },
    {
        title: "Entry 02: Latency Mirage",
        meta: "Lecture Notes / 2025.02",
        body: "Delayed perception folds into itself. The room repeats, but the data stays coherent.",
        tags: ["latency", "perception", "notes"],
        isLectureRoute: true
    },
    {
        title: "Entry 03: Holo Console",
        meta: "Prototype / 2025.03",
        body: "A floating console surfaces in the noise. Controls stay sharp while the background jitters.",
        tags: ["ui", "prototype", "vr"],
        isProjectRoute: true
    },
    {
        title: "Entry 04: Signal Ritual",
        meta: "Project Log / 2025.04",
        body: "Gesture-based inputs become ritual. Each frame locks in before dissolving into static.",
        tags: ["gesture", "ritual", "log"],
        isProjectRoute: true
    },
    {
        title: "Entry 05: Archive Echo",
        meta: "Field Study / 2025.05",
        body: "Posts echo behind you as glowing traces. The matrix retains every sequence.",
        tags: ["archive", "echo", "field"],
        isProjectRoute: true
    }
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

const totalDepth = (posts.length - 1) * spacing + 2800;
const introDepth = 5400;
scrollTrack.style.height = `${Math.max(520, posts.length * 140)}vh`;

// Store world positions for the minimap
const mapPoints = [];
let mapBounds = { minX: 0, maxX: 0, minZ: -totalDepth, maxZ: introDepth };

let labCount = 0;
let lectureCount = 0;
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
        // Lecture Assignments frame
        z = 200;
        x = -450;
        y = 0;
        rotateY = 45;
        frame.classList.add("lecture-assignments", "intersection-frame");
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
    } else if (post.isLectureRoute) {
        // Lecture Branch
        lectureCount++;
        z = -lectureCount * spacing * Math.cos(Math.PI / 4);
        x = -600 - lectureCount * spacing * Math.sin(Math.PI / 4);
        y = 0;
        rotateY = 45;
        frame.classList.add("lecture-assignments");
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

    frame.innerHTML = `
                <div class="frame-inner">
                    <div class="frame-index">FRAME ${String(index + 1).padStart(2, "0")}</div>
                    <h2 class="frame-title">${post.title}</h2>
                    <div class="frame-meta">${post.meta}</div>
                    <p class="frame-body">${post.body}</p>
                    <div class="frame-tags">
                        ${post.tags.map((tag) => `<span class="frame-tag">${tag}</span>`).join("")}
                    </div>
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
    } else if (post.isLectureAssignments) {
        frame.addEventListener("click", () => {
            targetRotationY = -45; // Rotate 45 degrees to the left
            targetTranslateX = -350; // Move camera to the left (adjust this value)
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
    // From (0,0) (Intersection) to Frame 3 Position
    const labFrame = mapPoints.find(p => p.originalIndex === 3);
    if (labFrame) {
        ctx.beginPath();
        ctx.moveTo(getMapX(0), getMapY(0)); // Intersection point
        ctx.lineTo(getMapX(labFrame.x), getMapY(labFrame.z));
        ctx.strokeStyle = 'rgba(255, 79, 123, 0.4)';
        ctx.stroke();
    }

    // Lecture Branch Line
    const lectureFrame = mapPoints.find(p => p.originalIndex === 4);
    if (lectureFrame) {
        ctx.beginPath();
        ctx.moveTo(getMapX(0), getMapY(0)); // Intersection point
        ctx.lineTo(getMapX(lectureFrame.x), getMapY(lectureFrame.z));
        ctx.strokeStyle = 'rgba(147, 112, 219, 0.4)';
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
        if (p.originalIndex === 3) color = '#ff4f7b';
        if (p.originalIndex === 4) color = '#9370db';

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

console.log(`Starting Camera Position: X=${currentTranslateX}, Y=0, Z=${currentZ}`);

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
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



function onScroll() {
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    scrollProgress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    targetZ = scrollProgress * (totalDepth + introDepth) - introDepth;
    console.log(`Current Position (Target): Z=${targetZ.toFixed(2)}, Scroll=${scrollProgress.toFixed(3)}`);
}

function onPointerMove(event) {
    const nx = (event.clientX / window.innerWidth) - 0.5;
    const ny = (event.clientY / window.innerHeight) - 0.5;
    tiltY = nx * 6;
    tiltX = -ny * 4;
}

function animate() {
    currentZ += (targetZ - currentZ) * 0.08;
    currentRotationY += (targetRotationY - currentRotationY) * 0.08;
    currentTranslateX += (targetTranslateX - currentTranslateX) * 0.08;
    scene.style.transform = `translate3d(${-currentTranslateX}px, 0, ${currentZ}px) rotateX(${tiltX}deg) rotateY(${tiltY + currentRotationY}deg)`;
    updateFrameVisibility(currentZ);

    // Detect intersection arrival (when currentZ is close to 0, meaning we've reached the frames)
    if (!hasReachedIntersection && currentZ >= -500 && currentZ <= 500) {
        hasReachedIntersection = true;
        intersectionHint.classList.add('visible');
        typeWriter('> SELECT TRACK _ Navigate your pathway through the matrix', typedText, 60);
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

onScroll();
animate();