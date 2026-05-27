import type { Property } from '../types/property';
import { PROPERTY_TYPE_LABELS } from '../types/property';
import { PALETTE } from '../theme';

// Fixed dimensions for the marker card
export const MARKER_WIDTH = 140;
export const MARKER_ARROW_HEIGHT = 8;
export const MARKER_ARROW_WIDTH = 16;
export const MARKER_BORDER_RADIUS = 8;

// Colors
const COLORS = {
  white: '#FFFFFF',
  primary: PALETTE.PRIMARY,
  primaryLight: '#E8EFFF', 
  error: PALETTE.ERROR, 
  errorLight: PALETTE.ERROR_LIGHT, 
  textPrimary: PALETTE.TEXT_PRIMARY,
  textSecondary: PALETTE.TEXT_SECONDARY,
  textDisabled: PALETTE.TEXT_DISABLED,
  border: PALETTE.BORDER,
  shadow: PALETTE.SHADOW_LIGHT, 
};

// SVG Paths (24x24 viewport)
const PATHS = {
  flame: new Path2D('M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z'),
  expand: new Path2D('M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7'),
  home: new Path2D('m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10')
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

/**
 * Draws the property marker on canvas
 * @returns Height of the rendered marker (to compute bounding box)
 */
export function drawPropertyMarker(
  ctx: CanvasRenderingContext2D,
  property: Property,
  x: number,
  y: number,
  isSelected: boolean = false
): number {
  const { code, isHot, type, area, listedPrice, loanPrice, status } = property;
  
  // Calculate dynamic height based on status
  let contentHeight = 40 + 36; // Header (32) + padding (8) + Body (36)
  if (status === 'available') contentHeight += 44; 
  else if (status === 'sold') contentHeight += 36; 
  else if (status === 'contact') contentHeight += 56; 
  else if (status === 'contacting') contentHeight += 36; 

  const totalHeight = contentHeight + MARKER_ARROW_HEIGHT;
  
  // Transform context to Top-Left of the card
  ctx.save();
  const startX = x - MARKER_WIDTH / 2;
  const startY = y - totalHeight;
  ctx.translate(startX, startY);

  // 1. Draw main container with shadow
  ctx.shadowColor = COLORS.shadow;
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;
  
  drawRoundRect(ctx, 0, 0, MARKER_WIDTH, contentHeight, MARKER_BORDER_RADIUS);
  ctx.fillStyle = COLORS.white;
  ctx.fill();
  
  // Clear shadow for inner elements
  ctx.shadowColor = 'transparent';
  
  // Draw border
  ctx.strokeStyle = isSelected ? COLORS.primary : COLORS.border;
  ctx.lineWidth = isSelected ? 2 : 1;
  ctx.stroke();

  // Draw Bottom Arrow
  ctx.beginPath();
  const arrowX = MARKER_WIDTH / 2;
  ctx.moveTo(arrowX - MARKER_ARROW_WIDTH / 2, contentHeight - 0.5);
  ctx.lineTo(arrowX + MARKER_ARROW_WIDTH / 2, contentHeight - 0.5);
  ctx.lineTo(arrowX, totalHeight);
  ctx.closePath();
  ctx.fillStyle = COLORS.white;
  ctx.fill();
  ctx.strokeStyle = isSelected ? COLORS.primary : COLORS.border;
  ctx.stroke();
  
  // To hide the line segment under the arrow
  ctx.beginPath();
  ctx.moveTo(arrowX - (MARKER_ARROW_WIDTH / 2) + 1, contentHeight);
  ctx.lineTo(arrowX + (MARKER_ARROW_WIDTH / 2) - 1, contentHeight);
  ctx.strokeStyle = COLORS.white;
  ctx.lineWidth = 2;
  ctx.stroke();

  // 2. Draw Header
  const headerHeight = 32;
  drawRoundRect(ctx, 4, 4, MARKER_WIDTH - 8, headerHeight, {tl: 6, tr: 6, br: 2, bl: 2});
  ctx.fillStyle = isHot ? COLORS.error : (isSelected ? COLORS.primaryLight : COLORS.white);
  ctx.fill();
  if (!isHot && !isSelected) {
    ctx.strokeStyle = COLORS.primaryLight;
    ctx.stroke();
  }

  // Header Text
  ctx.fillStyle = isHot ? COLORS.white : COLORS.primary;
  ctx.font = 'bold 14px "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  if (isHot) {
    // Draw flame icon
    ctx.save();
    ctx.translate(MARKER_WIDTH / 2 - 28, headerHeight / 2 - 10 + 4);
    ctx.scale(0.8, 0.8);
    ctx.fillStyle = COLORS.white;
    ctx.fill(PATHS.flame);
    ctx.restore();
    ctx.fillText(code, MARKER_WIDTH / 2 + 8, headerHeight / 2 + 4);
  } else {
    ctx.fillText(code, MARKER_WIDTH / 2, headerHeight / 2 + 4);
  }

  // 3. Draw Body (Area and Type)
  const bodyY = headerHeight + 12;
  
  // Area
  ctx.save();
  ctx.translate(12, bodyY + 2);
  ctx.scale(0.6, 0.6);
  ctx.strokeStyle = COLORS.primary;
  ctx.lineWidth = 2;
  ctx.stroke(PATHS.expand);
  ctx.restore();
  
  ctx.fillStyle = COLORS.textPrimary;
  ctx.font = '12px "Inter", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`${area}m²`, 30, bodyY + 10);

  // Divider
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(MARKER_WIDTH / 2, bodyY);
  ctx.lineTo(MARKER_WIDTH / 2, bodyY + 18);
  ctx.stroke();

  // Type
  ctx.save();
  ctx.translate(MARKER_WIDTH / 2 + 8, bodyY + 2);
  ctx.scale(0.6, 0.6);
  ctx.strokeStyle = COLORS.primary;
  ctx.lineWidth = 2;
  ctx.stroke(PATHS.home);
  ctx.restore();

  ctx.fillStyle = COLORS.textPrimary;
  ctx.fillText(PROPERTY_TYPE_LABELS[type], MARKER_WIDTH / 2 + 26, bodyY + 10);

  // Dotted divider below body
  ctx.beginPath();
  ctx.setLineDash([2, 2]);
  ctx.moveTo(12, bodyY + 26);
  ctx.lineTo(MARKER_WIDTH - 12, bodyY + 26);
  ctx.stroke();
  ctx.setLineDash([]); // reset

  // 4. Draw Footer based on status
  const footerY = bodyY + 36;
  ctx.textAlign = 'left';
  
  if (status === 'available') {
    // Listed Price
    ctx.fillStyle = COLORS.textSecondary;
    ctx.font = '11px "Inter", sans-serif';
    ctx.fillText('Giá niêm yết:', 12, footerY + 10);
    
    ctx.textAlign = 'right';
    ctx.fillStyle = COLORS.primary;
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillText(`${listedPrice} tỷ`, MARKER_WIDTH - 12, footerY + 10);

    // Loan Price
    ctx.textAlign = 'left';
    ctx.fillStyle = COLORS.textSecondary;
    ctx.font = '11px "Inter", sans-serif';
    ctx.fillText('Giá vay:', 12, footerY + 28);
    
    ctx.textAlign = 'right';
    ctx.fillStyle = COLORS.primary;
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillText(`${loanPrice} tỷ`, MARKER_WIDTH - 12, footerY + 28);
  } 
  else if (status === 'sold') {
    drawRoundRect(ctx, 12, footerY, MARKER_WIDTH - 24, 28, 4);
    ctx.fillStyle = COLORS.errorLight;
    ctx.fill();
    
    ctx.fillStyle = COLORS.error;
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Đã bán', MARKER_WIDTH / 2, footerY + 14);
  }
  else if (status === 'contact') {
    ctx.fillStyle = COLORS.textDisabled;
    ctx.font = 'italic 11px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Quỹ ẩn', MARKER_WIDTH / 2, footerY + 10);

    // Button
    drawRoundRect(ctx, 12, footerY + 20, MARKER_WIDTH - 24, 28, 4);
    ctx.fillStyle = '#0ea5e9'; // Cyan primary gradient proxy
    ctx.fill();
    
    ctx.fillStyle = COLORS.white;
    ctx.font = 'bold 12px "Inter", sans-serif';
    ctx.fillText('Xin thông tin', MARKER_WIDTH / 2, footerY + 34);
  }
  else if (status === 'contacting') {
    ctx.fillStyle = COLORS.textDisabled;
    ctx.font = 'italic 11px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Admin sẽ liên hệ sớm nhất', MARKER_WIDTH / 2, footerY + 14);
  }

  ctx.restore();
  return totalHeight;
}
