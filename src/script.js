import { initScene } from './js/setup.js';
import { initCamera, setCameraTarget } from './js/camera.js';
import { initBlog } from './js/blog.js';

// Initialize the 3D Scene (Voxels + Posts)
const { mapPoints, mapBounds } = initScene(setCameraTarget);

// Initialize the Blog Logic (Overlay)
initBlog();

// Initialize the Camera/Animation Loop
initCamera(mapPoints, mapBounds);