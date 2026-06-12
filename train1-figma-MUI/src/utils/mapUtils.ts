export const IMAGE_WIDTH = 2784;
export const IMAGE_HEIGHT = 1546;

/**
 * Chuyển đổi tọa độ % (Top-Left) sang tọa độ Leaflet CRS.Simple (normalized theo scale)
 * @param scale - Hệ số scale = 2^dziMaxLevel, mặc định 1 (không normalize)
 */
export const convertPercentToLatLng = (
  percentX: number,
  percentY: number,
  mapWidth: number = IMAGE_WIDTH,
  mapHeight: number = IMAGE_HEIGHT,
  scale: number = 1
): [number, number] => {
  const xPixel = (percentX / 100) * mapWidth;
  const yPixel = (percentY / 100) * mapHeight;
  return [-(yPixel / scale), xPixel / scale];
};

/**
 * Chuyển đổi tọa độ hệ PDF/CAD hoặc Pixel gốc từ API Vinhomes sang Leaflet CRS.Simple
 * Tọa độ được normalize theo scale để khớp bounds đã chia cho 2^dziMaxLevel.
 * @param scale - Hệ số scale = 2^dziMaxLevel, mặc định 1 (không normalize)
 */
export const convertPdfCoorsToLatLng = (
  x: number,
  y: number,
  dpi?: number,
  xPixel?: number,
  yPixel?: number,
  scale: number = 1
): [number, number] => {
  const dpiScale = (dpi || 600) / 72;

  const px = xPixel ?? (x * dpiScale);
  const py = yPixel ?? (y * dpiScale);

  // Trong Leaflet CRS.Simple: Trục X đi sang phải (Dương), Trục Y đi xuống dưới (Âm)
  // Tọa độ từ backend đã map sẵn theo chuẩn ảnh tĩnh cuối cùng, không cần xoay thêm
  return [-(py / scale), px / scale];
};