import { initScene } from './js/setup.js';
import { initCamera, setCameraTarget } from './js/camera.js';
import { initBlog } from './js/blog.js';

initScene(setCameraTarget);
initBlog();
initCamera();
