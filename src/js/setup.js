import { posts, totalDepth } from './data.js';

export function initScene(setCameraTarget) {
    const postsEl = document.getElementById("posts");
    const voxelField = document.getElementById("voxel-field");

    const globalLiftY = -250;
    const mainTrackOffsetY = -70;
    const intersectionPositions = {
        projects: { x: 0, y: globalLiftY + mainTrackOffsetY, z: 0, rotateY: 0, mapX: 0, mapZ: 0 },
        lab: { x: 450, y: globalLiftY, z: 200, rotateY: -45, mapX: 450, mapZ: 200 },
        tutorial: { x: -450, y: globalLiftY, z: 200, rotateY: 45, mapX: -450, mapZ: 200 },
    };

    const labelToStackGapY = 160;
    const stackSpacingY = 260;
    let labStackIndex = 0;
    let tutorialStackIndex = 0;
    let projectStackIndex = 0;

    // Create Posts
    posts.forEach((post, index) => {
        const frame = document.createElement("article");
        frame.className = "post-frame";

        let z, x, y, rotateY = 0;
        let mapX = 0; 
        let mapZ = 0; 

        if (index === 0) {
            ({ x, y, z, rotateY, mapX, mapZ } = intersectionPositions.projects);
            frame.classList.add("intersection-label", "project-assignments");
        } else if (index === 1) {
            ({ x, y, z, rotateY } = intersectionPositions.lab);
            frame.classList.add("intersection-label", "lab-assignments");
            mapX = 0; mapZ = 0;
        } else if (index === 2) {
            ({ x, y, z, rotateY } = intersectionPositions.tutorial);
            frame.classList.add("intersection-label", "Tutorial-assignments");
            mapX = 0; mapZ = 0;
        } else if (post.isLabRoute) {
            labStackIndex += 1;
            ({ x, z, rotateY, mapX, mapZ } = intersectionPositions.lab);
            y = globalLiftY + labelToStackGapY + (labStackIndex - 1) * stackSpacingY;
            frame.classList.add("stacked-frame");
            frame.classList.add("lab-assignments");
        } else if (post.isTutorialRoute) {
            tutorialStackIndex += 1;
            ({ x, z, rotateY, mapX, mapZ } = intersectionPositions.tutorial);
            y = globalLiftY + labelToStackGapY + (tutorialStackIndex - 1) * stackSpacingY;
            frame.classList.add("stacked-frame");
            frame.classList.add("Tutorial-assignments");
        } else {
            projectStackIndex += 1;
            ({ x, z, rotateY, mapX, mapZ } = intersectionPositions.projects);
            y = intersectionPositions.projects.y + labelToStackGapY + (projectStackIndex - 1) * stackSpacingY;
            frame.classList.add("stacked-frame");
        }

        frame.style.setProperty("--x", `${x}px`);
        frame.style.setProperty("--y", `${y}px`);
        frame.style.setProperty("--z", `${z}px`);
        frame.style.setProperty("--rotateY", `${rotateY}deg`);
        frame.dataset.z = z;

        const isIntersectionFrame = index <= 2;

        if (isIntersectionFrame) {
            frame.innerHTML = `
                <div class="frame-inner">
                    <h2 class="frame-title">${post.title}</h2>
                </div>
            `;
        } else {
            frame.innerHTML = `
                <div class="frame-inner">
                    ${post.image ? `<img src="${post.image}" class="post-hover-image" alt="" />` : ''}
                    <h2 class="frame-title">${post.title}</h2>
                    <div class="frame-meta">${post.meta}</div>
                    <p class="frame-body">${post.body}</p>
                    <div class="frame-tags">
                        ${post.tags.map((tag) => `<span class="frame-tag">${tag}</span>`).join("")}
                    </div>
                </div>
            `;
        }

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

        frame.addEventListener("pointerenter", (e) => {
            if (e.pointerType && e.pointerType !== "mouse") return;

            if (post.isLabAssignments || post.isLabRoute) {
                setCameraTarget(45, 350);
            } else if (post.isTutorialAssignments || post.isTutorialRoute) {
                setCameraTarget(-45, -350);
            } else {
                setCameraTarget(0, 0);
            }
        });

        postsEl.appendChild(frame);
    });

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
}
