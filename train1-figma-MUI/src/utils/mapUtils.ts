export const IMAGE_WIDTH = 2784;
export const IMAGE_HEIGHT = 1546;

// Với TileLayer (sharp google layout), ảnh ở zoom 4 map 1:1 với pixel.
// Leaflet scale ở zoom 4 là 2^4 = 16.
const MAX_ZOOM = 4;
const SCALE_FACTOR = Math.pow(2, MAX_ZOOM);

/**
 * Chuyển đổi tọa độ % (Top-Left) sang tọa độ Leaflet CRS.Simple cho TileLayer
 * @param percentX Tọa độ x (%) từ góc trên bên trái
 * @param percentY Tọa độ y (%) từ góc trên bên trái
 * @returns [lat, lng] cho Leaflet
 */
export const convertPercentToLatLng = (
  percentX: number,
  percentY: number,
): [number, number] => {
  const xPixel = (percentX / 100) * IMAGE_WIDTH;
  const yPixel = (percentY / 100) * IMAGE_HEIGHT;

  // L.CRS.Simple mặc định: lat âm thì đi xuống (giống trục y của ảnh)
  // Chia cho SCALE_FACTOR để khi ở Zoom 4 (scale 16), tọa độ nhân lên khớp đúng pixel.
  return [-yPixel / SCALE_FACTOR, xPixel / SCALE_FACTOR];
};
