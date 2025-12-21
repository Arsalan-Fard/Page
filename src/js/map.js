import { introDepth } from './data.js';

export function drawMinimap(ctx, minimap, mapPoints, mapBounds, posts, currentZ, currentTranslateX, currentRotationY) {
    if (!ctx || !minimap) return;

    ctx.clearRect(0, 0, minimap.width, minimap.height);

    const padding = 40;
    const availableWidth = minimap.width - padding * 2;
    const availableHeight = minimap.height - padding * 2;

    // Calculate ranges
    const rangeZ = mapBounds.maxZ - mapBounds.minZ;
    const rangeX = Math.max(mapBounds.maxX * 2, 2000); // Ensure minimal width

    // Calculate Scale Factors for each dimension
    const scaleZ = availableHeight / rangeZ;
    const scaleX = availableWidth / rangeX;

    const scale = Math.min(scaleZ, scaleX);

    function getMapY(worldZ) {
        const distanceFromStart = mapBounds.maxZ - worldZ;
        return (minimap.height - padding) - (distanceFromStart * scale);
    }

    function getMapX(worldX) {
        const center = minimap.width / 2;
        return center + (worldX * scale);
    }

    // Draw Connection Lines
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
    ctx.lineWidth = 3;

    // Main Track (Index 0 -> End)
    ctx.moveTo(getMapX(0), getMapY(mapBounds.maxZ)); // Start
    ctx.lineTo(getMapX(0), getMapY(mapBounds.minZ)); // End
    ctx.stroke();

    // Lab Branch Line
    const labPoints = mapPoints.filter(p => posts[p.originalIndex].isLabRoute);
    if (labPoints.length > 0) {
        labPoints.sort((a, b) => b.z - a.z);
        ctx.beginPath();
        ctx.moveTo(getMapX(0), getMapY(0)); 
        labPoints.forEach(p => {
            ctx.lineTo(getMapX(p.x), getMapY(p.z));
        });
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
        ctx.stroke();
    }

    // Tutorial Branch Line
    const tutorialPoints = mapPoints.filter(p => posts[p.originalIndex].isTutorialRoute);
    if (tutorialPoints.length > 0) {
        tutorialPoints.sort((a, b) => b.z - a.z);
        ctx.beginPath();
        ctx.moveTo(getMapX(0), getMapY(0));
        tutorialPoints.forEach(p => {
            ctx.lineTo(getMapX(p.x), getMapY(p.z));
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

    const playerWorldZ = forward * Math.cos(yRadian);
    const playerWorldX = currentTranslateX + forward * Math.sin(yRadian);

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
