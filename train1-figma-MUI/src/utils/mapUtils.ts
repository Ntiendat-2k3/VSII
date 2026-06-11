
export const IMAGE_WIDTH = 2784;
export const IMAGE_HEIGHT = 1546;

const MAX_ZOOM = 4;
const SCALE_FACTOR = Math.pow(2, MAX_ZOOM);

/**
 * Chuyển đổi tọa độ % (Top-Left) sang tọa độ Leaflet CRS.Simple cho TileLayer.
 */
export const convertPercentToLatLng = (
  percentX: number,
  percentY: number,
): [number, number] => {
  const xPixel = (percentX / 100) * IMAGE_WIDTH;
  const yPixel = (percentY / 100) * IMAGE_HEIGHT;

  return [-yPixel / SCALE_FACTOR, xPixel / SCALE_FACTOR];
};

export const convertPdfCoorsToLatLng = (
  x: number,
  y: number,
  unitPageWidth: number | undefined,
  unitPageHeight: number | undefined,
  mapWidth: number,
  mapHeight: number,
  mapPageWidth: number | undefined,
  mapPageHeight: number | undefined,
  maxZoom: number,
): [number, number] => {
  const scaleFactor = Math.pow(2, maxZoom);

  // 1. Find the reference bounds (page dimensions)
  const pw = unitPageWidth || mapPageWidth || mapWidth || IMAGE_WIDTH;
  const ph = unitPageHeight || mapPageHeight || mapHeight || IMAGE_HEIGHT;

  // 2. Map relative percentage to actual MapCanvas pixel dimensions
  const xPixel = (x / pw) * mapWidth;
  const yPixel = (y / ph) * mapHeight;

  return [-yPixel / scaleFactor, xPixel / scaleFactor];
};

