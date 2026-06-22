import type { UnitItem } from '../types/PropertyMapModel';
import { PALETTE } from '@/theme';
import { formatShortPrice } from '@/utils/format/formatPrice';
import { getUnitTypeIcon } from '../constants/propertyMapStatus';

// Fixed dimensions for the marker card
export const MARKER_WIDTH = 130;
export const MARKER_ARROW_HEIGHT = 6;
export const MARKER_ARROW_WIDTH = 12;
export const MARKER_BORDER_RADIUS = 6;

// Colors
const COLORS = {
  white: '#FFFFFF',
  primary: PALETTE.PRIMARY,
  primaryLight: PALETTE.PRIMARY_LIGHT_BG, 
  primaryGlow: PALETTE.PRIMARY_LIGHT, 
  error: PALETTE.ERROR, 
  errorLight: PALETTE.ERROR_LIGHT, 
  border: PALETTE.BORDER,
  shadow: PALETTE.SHADOW_LIGHT, 
  textDisabled: PALETTE.TEXT_DISABLED,
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

const iconImages = new Map<string, HTMLImageElement>();



export function getIconImage(type: string): HTMLImageElement | null {
  if (typeof window === 'undefined') return null;
  const path = getUnitTypeIcon(type);
  if (!path) return null;

  if (iconImages.has(type)) {
    const img = iconImages.get(type)!;
    return img.complete ? img : null;
  }

  const img = new Image();
  img.src = path;
  img.onload = () => {
    markerCache.clear();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('unit-icons-loaded'));
    }
  };
  iconImages.set(type, img);
  return null;
}

// Proactively preload on module load in browser
if (typeof window !== 'undefined') {
  ['DETACHED', 'SEMI_DETACHED', 'QUADRUPLEX', 'TOWNHOUSE', 'SHOPHOUSE'].forEach((type) => {
    getIconImage(type);
  });
}

/**
 * Cung cấp API clear cache cho những trường hợp cần giải phóng bộ nhớ (ví dụ: unmount Map)
 */
export function clearMarkerCache() {
  markerCache.clear();
}

/**
 * Helper to get styling attributes based on the 6 Figma states
 */
function getMarkerStyle(property: UnitItem) {
  const { statusCode, inquiryStatusCode, isHot } = property;

  // 1. Hot Available or Hot Hidden (Solid Red background, white text, Flame icon)
  if (isHot && statusCode !== 'SOLD') {
    return {
      fill: COLORS.error,
      stroke: COLORS.error,
      text: COLORS.white,
      isHotStyle: true,
      isDashed: false,
    };
  }

  // 2. Sold (Hot or Normal) (Light Pink background, Red border, Red text)
  if (statusCode === 'SOLD') {
    return {
      fill: COLORS.errorLight,
      stroke: COLORS.error,
      text: COLORS.error,
      isHotStyle: false,
      isDashed: false,
    };
  }

  // 3. Normal Available (Light Blue background, Primary Blue border, Primary Blue text)
  if (statusCode === 'AVAILABLE') {
    return {
      fill: COLORS.primaryLight,
      stroke: COLORS.primary,
      text: COLORS.primary,
      isHotStyle: false,
      isDashed: false,
    };
  }

  // 4. Normal Inquiry Pending/Submitted (White background, Dashed border, Disabled text)
  if (statusCode === null && inquiryStatusCode != null) {
    return {
      fill: COLORS.white,
      stroke: COLORS.border,
      text: COLORS.textDisabled,
      isHotStyle: false,
      isDashed: true,
    };
  }

  // 5. Normal Hidden (White background, Gray border, Blue text)
  return {
    fill: COLORS.white,
    stroke: COLORS.border,
    text: COLORS.primary,
    isHotStyle: false,
    isDashed: false,
  };
}

/**
 * Draws the property marker on canvas using Offscreen Cache for extreme performance
 * @returns Height of the rendered marker (to compute bounding box)
 */
export function drawPropertyMarker(
  ctx: CanvasRenderingContext2D,
  property: UnitItem,
  x: number,
  y: number,
  isSelected: boolean = false
): number {
  const { statusCode, inquiryStatusCode, isHot } = property;
  const cacheKey = `${property.id || property.unitCode}-${statusCode || 'null'}-${inquiryStatusCode || 'null'}-${isHot || 'false'}-${isSelected}`;
  let cached = markerCache.get(cacheKey);

  if (!cached) {
    const contentHeight = 28;
    const totalHeight = contentHeight + MARKER_ARROW_HEIGHT;

    // Padding để chứa đủ phần đổ bóng (shadow/glow) của marker
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
  property: UnitItem,
  x: number,
  y: number,
  isSelected: boolean = false
): number {
  const { unitCode: code } = property;
  
  const contentHeight = 28;
  const totalHeight = contentHeight + MARKER_ARROW_HEIGHT;
  
  ctx.save();
  const startX = x - MARKER_WIDTH / 2;
  const startY = y - totalHeight;
  ctx.translate(startX, startY);

  const style = getMarkerStyle(property);
  const arrowX = MARKER_WIDTH / 2;

  // 1. Draw outer selection highlight ring if selected
  if (isSelected) {
    ctx.save();
    ctx.strokeStyle = COLORS.primaryGlow;
    ctx.lineWidth = 6;
    
    // Outer rounded body highlight
    drawRoundRect(ctx, 0, 0, MARKER_WIDTH, contentHeight, MARKER_BORDER_RADIUS);
    ctx.stroke();

    // Outer arrow highlight
    ctx.beginPath();
    ctx.moveTo(arrowX - MARKER_ARROW_WIDTH / 2 - 1, contentHeight);
    ctx.lineTo(arrowX + MARKER_ARROW_WIDTH / 2 + 1, contentHeight);
    ctx.lineTo(arrowX, totalHeight + 1.5);
    ctx.closePath();
    ctx.stroke();

    ctx.restore();
  }

  // 2. Draw main container with shadow
  ctx.save();
  ctx.shadowColor = COLORS.shadow;
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 2;
  
  drawRoundRect(ctx, 0, 0, MARKER_WIDTH, contentHeight, MARKER_BORDER_RADIUS);
  ctx.fillStyle = style.fill;
  ctx.fill();
  ctx.restore();
  
  // 3. Stroke body container
  ctx.save();
  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = 1.5;
  if (style.isDashed) {
    ctx.setLineDash([4, 2]);
  }
  drawRoundRect(ctx, 0, 0, MARKER_WIDTH, contentHeight, MARKER_BORDER_RADIUS);
  ctx.stroke();
  ctx.restore();

  // 4. Draw Bottom Arrow
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(arrowX - MARKER_ARROW_WIDTH / 2, contentHeight - 0.5);
  ctx.lineTo(arrowX + MARKER_ARROW_WIDTH / 2, contentHeight - 0.5);
  ctx.lineTo(arrowX, totalHeight);
  ctx.closePath();
  ctx.fillStyle = style.fill;
  ctx.fill();
  
  ctx.strokeStyle = style.stroke;
  ctx.lineWidth = 1.5;
  if (style.isDashed) {
    ctx.setLineDash([4, 2]);
  }
  ctx.stroke();
  ctx.restore();
  
  // 5. Hide line segment under arrow to blend it cleanly
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(arrowX - (MARKER_ARROW_WIDTH / 2) + 1, contentHeight);
  ctx.lineTo(arrowX + (MARKER_ARROW_WIDTH / 2) - 1, contentHeight);
  ctx.strokeStyle = style.fill;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // 6. Draw Text & Icon
  ctx.fillStyle = style.text;
  ctx.font = 'bold 13px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Create label: Code - Price (e.g. VU6-34 - 15,1T)
  const priceStr = formatShortPrice(property.basePrice);
  const label = priceStr ? `${code} - ${priceStr}` : code;

  const unitType = property.unitTypeCode || '';
  const iconImg = !style.isHotStyle ? getIconImage(unitType) : null;

  if (iconImg) {
    ctx.save();
    const iconSize = 14;
    const spacing = 5;
    const labelWidth = ctx.measureText(label).width;
    const totalWidth = iconSize + spacing + labelWidth;
    
    // Center the combination of icon and text
    const startX = (MARKER_WIDTH - totalWidth) / 2;
    
    // Draw icon image
    ctx.drawImage(
      iconImg,
      startX,
      (contentHeight - iconSize) / 2,
      iconSize,
      iconSize
    );
    
    // Draw text
    ctx.textAlign = 'left';
    ctx.fillText(
      label,
      startX + iconSize + spacing,
      contentHeight / 2 + 1
    );
    ctx.restore();
  } else {
    if (style.isHotStyle) {
      ctx.save();
      // Move slightly left and up to align flame with text
      const flameX = MARKER_WIDTH / 2 - (ctx.measureText(label).width / 2) - 14;
      ctx.translate(flameX, contentHeight / 2 - 10 + 2);
      ctx.scale(0.7, 0.7);
      ctx.fillStyle = style.text;
      ctx.fill(PATHS.flame);
      ctx.restore();
      ctx.fillText(label, MARKER_WIDTH / 2 + 8, contentHeight / 2 + 1);
    } else {
      ctx.fillText(label, MARKER_WIDTH / 2, contentHeight / 2 + 1);
    }
  }

  ctx.restore();
  return totalHeight;
}
