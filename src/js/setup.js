import { posts, spacing, scatterX, scatterY, totalDepth, introDepth } from './data.js';

export function initScene(setCameraTarget) {
    const postsEl = document.getElementById("posts");
    const voxelField = document.getElementById("voxel-field");
    const mapPoints = [];
    let mapBounds = { minX: 0, maxX: 0, minZ: -totalDepth, maxZ: introDepth };

    let labCount = 0;
    let TutorialCount = 0;
    let projectCount = 0;

    // Create Posts
    posts.forEach((post, index) => {
        const frame = document.createElement("article");
        frame.className = "post-frame";

        let z, x, y, rotateY = 0;
        let mapX = 0; 
        let mapZ = 0; 

        if (index === 0) {
            z = 0; x = 0; y = 0;
            frame.classList.add("intersection-frame", "project-assignments");
            mapZ = 0;
        } else if (index === 1) {
            z = 200; x = 450; y = 0; rotateY = -45;
            frame.classList.add("lab-assignments", "intersection-frame");
            mapX = 0; mapZ = 0;
        } else if (index === 2) {
            z = 200; x = -450; y = 0; rotateY = 45;
            frame.classList.add("Tutorial-assignments", "intersection-frame");
            mapX = 0; mapZ = 0;
        } else if (post.isLabRoute) {
            labCount++;
            z = -labCount * spacing * Math.cos(Math.PI / 4);
            x = 600 + labCount * spacing * Math.sin(Math.PI / 4);
            y = 0; rotateY = -45;
            frame.classList.add("lab-assignments");
            mapX = x; mapZ = z;
        } else if (post.isTutorialRoute) {
            TutorialCount++;
            z = -TutorialCount * spacing * Math.cos(Math.PI / 4);
            x = -600 - TutorialCount * spacing * Math.sin(Math.PI / 4);
            y = 0; rotateY = 45;
            frame.classList.add("Tutorial-assignments");
            mapX = x; mapZ = z;
        } else {
            projectCount++;
            z = -projectCount * spacing;
            x = (Math.random() * 2 - 1) * scatterX;
            y = (Math.random() * 2 - 1) * scatterY;
            mapX = 0; mapZ = z;
        }

        mapPoints.push({ x: mapX, z: mapZ, type: (index <= 2) ? 'node' : 'post', originalIndex: index });

        const absX = Math.abs(mapX);
        mapBounds.maxX = Math.max(mapBounds.maxX, absX);
        mapBounds.minZ = Math.min(mapBounds.minZ, mapZ);

        frame.style.setProperty("--x", `${x}px`);
        frame.style.setProperty("--y", `${y}px`);
        frame.style.setProperty("--z", `${z}px`);
        frame.style.setProperty("--rotateY", `${rotateY}deg`);
        frame.dataset.z = z;

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

        if (post.isProjects) {
            frame.addEventListener("click", () => setCameraTarget(0, 0));
            frame.style.pointerEvents = "auto";
        } else if (post.isLabAssignments) {
            frame.addEventListener("click", () => setCameraTarget(45, 350));
            frame.style.pointerEvents = "auto";
        } else if (post.isTutorialAssignments) {
            frame.addEventListener("click", () => setCameraTarget(-45, -350));
            frame.style.pointerEvents = "auto";
        } else {
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

    const mainTrackPoints = mapPoints.filter((point) => point.x === 0);
    if (mainTrackPoints.length > 0) {
        mapBounds.minZ = Math.min(...mainTrackPoints.map((point) => point.z));
    }

    // Create Voxels
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

    return { mapPoints, mapBounds };
}
