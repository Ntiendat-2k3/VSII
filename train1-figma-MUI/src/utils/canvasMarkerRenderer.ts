import type { PropertyUnit } from '../types/mapApi';
import { PALETTE } from '../theme';

// Fixed dimensions for the marker card
export const MARKER_WIDTH = 90;
export const MARKER_ARROW_HEIGHT = 6;
export const MARKER_ARROW_WIDTH = 12;
export const MARKER_BORDER_RADIUS = 6;

// Colors
const COLORS = {
  white: '#FFFFFF',
  primary: PALETTE.PRIMARY,
  primaryLight: '#E8EFFF', 
  error: PALETTE.ERROR, 
  errorLight: PALETTE.ERROR_LIGHT, 
  border: PALETTE.BORDER,
  shadow: PALETTE.SHADOW_LIGHT, 
};

// SVG Paths (24x24 viewport)
const PATHS = {
  flame: new Path2D('M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z')
};

// Helper: draw rounded rect
function drawRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number | {tl:number, tr:number, br:number, bl:number}) {
  ctx.beginPath();
  if (typeof r === 'number') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.roundRect(x, y, w, h, [r.tl, r.tr, r.br, r.bl]);
  }
  ctx.closePath();
}

const markerCache = new Map<string, { canvas: HTMLCanvasElement; height: number }>();

/**
 * Cung cấp API clear cache cho những trường hợp cần giải phóng bộ nhớ (ví dụ: unmount Map)
 */
export function clearMarkerCache() {
  markerCache.clear();
}

/**
 * Draws the property marker on canvas using Offscreen Cache for extreme performance
 * @returns Height of the rendered marker (to compute bounding box)
 */
export function drawPropertyMarker(
  ctx: CanvasRenderingContext2D,
  property: PropertyUnit,
  x: number,
  y: number,
  isSelected: boolean = false
): number {
  const cacheKey = `${property.id}-${isSelected}`;
  let cached = markerCache.get(cacheKey);

  if (!cached) {
    const contentHeight = 28;
    const totalHeight = contentHeight + MARKER_ARROW_HEIGHT;

    // Padding để chứa đủ phần đổ bóng (shadow) của marker
    const padding = 16;
    const canvasW = MARKER_WIDTH + padding * 2;
    const canvasH = totalHeight + padding * 2;

    const offscreen = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    offscreen.width = canvasW * dpr;
    offscreen.height = canvasH * dpr;
    
    // Rất quan trọng: set style dimension để khớp dpr
    offscreen.style.width = `${canvasW}px`;
    offscreen.style.height = `${canvasH}px`;
    
    const octx = offscreen.getContext('2d');
    
    if (octx) {
      octx.scale(dpr, dpr);
      // Di chuyển hệ toạ độ sao cho gốc (0,0) của hàm render nằm đúng vị trí có padding
      octx.translate(padding + MARKER_WIDTH / 2, padding + totalHeight);
      renderMarkerToContext(octx, property, 0, 0, isSelected);
    }
    
    cached = { canvas: offscreen, height: totalHeight };
    
    // Thuật toán LRU đơn giản: xoá phần tử cũ nhất nếu vượt quá 200 (giới hạn an toàn RAM)
    if (markerCache.size > 200) {
      const firstKey = markerCache.keys().next().value;
      if (firstKey) markerCache.delete(firstKey);
    }
    markerCache.set(cacheKey, cached);
  }

  // Draw cached image lên canvas chính
  const padding = 16;
  const drawX = x - MARKER_WIDTH / 2 - padding;
  const drawY = y - cached.height - padding;
  
  ctx.drawImage(cached.canvas, drawX, drawY, MARKER_WIDTH + padding * 2, cached.height + padding * 2);
  
  return cached.height;
}

function renderMarkerToContext(
  ctx: CanvasRenderingContext2D,
  property: PropertyUnit,
  x: number,
  y: number,
  isSelected: boolean = false
): number {
  const { code, isHot } = property;
  
  const contentHeight = 28;
  const totalHeight = contentHeight + MARKER_ARROW_HEIGHT;
  
  ctx.save();
  const startX = x - MARKER_WIDTH / 2;
  const startY = y - totalHeight;
  ctx.translate(startX, startY);

  // 1. Draw main container with shadow
  ctx.shadowColor = COLORS.shadow;
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;
  
  drawRoundRect(ctx, 0, 0, MARKER_WIDTH, contentHeight, MARKER_BORDER_RADIUS);
  ctx.fillStyle = isHot ? COLORS.error : (isSelected ? COLORS.primaryLight : COLORS.white);
  ctx.fill();
  
  ctx.shadowColor = 'transparent';
  
  ctx.strokeStyle = isSelected ? COLORS.primary : (isHot ? COLORS.error : COLORS.border);
  ctx.lineWidth = isSelected ? 2 : 1;
  ctx.stroke();

  // Draw Bottom Arrow
  ctx.beginPath();
  const arrowX = MARKER_WIDTH / 2;
  ctx.moveTo(arrowX - MARKER_ARROW_WIDTH / 2, contentHeight - 0.5);
  ctx.lineTo(arrowX + MARKER_ARROW_WIDTH / 2, contentHeight - 0.5);
  ctx.lineTo(arrowX, totalHeight);
  ctx.closePath();
  ctx.fillStyle = isHot ? COLORS.error : (isSelected ? COLORS.primaryLight : COLORS.white);
  ctx.fill();
  ctx.strokeStyle = isSelected ? COLORS.primary : (isHot ? COLORS.error : COLORS.border);
  ctx.stroke();
  
  // Hide line segment under arrow
  ctx.beginPath();
  ctx.moveTo(arrowX - (MARKER_ARROW_WIDTH / 2) + 1, contentHeight);
  ctx.lineTo(arrowX + (MARKER_ARROW_WIDTH / 2) - 1, contentHeight);
  ctx.strokeStyle = isHot ? COLORS.error : (isSelected ? COLORS.primaryLight : COLORS.white);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Text
  ctx.fillStyle = isHot ? COLORS.white : COLORS.primary;
  ctx.font = 'bold 13px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  if (isHot) {
    ctx.save();
    // Move slightly left and up to align flame with text
    ctx.translate(MARKER_WIDTH / 2 - 24, contentHeight / 2 - 10 + 2);
    ctx.scale(0.7, 0.7);
    ctx.fillStyle = COLORS.white;
    ctx.fill(PATHS.flame);
    ctx.restore();
    ctx.fillText(code, MARKER_WIDTH / 2 + 8, contentHeight / 2 + 1);
  } else {
    ctx.fillText(code, MARKER_WIDTH / 2, contentHeight / 2 + 1);
  }

  ctx.restore();
  return totalHeight;
}
