import { Point, LatLng } from 'leaflet';
import type { MapGetResponse } from '../models/property-map.dto';
import type { UnitItem } from '../models/property-map.model';

export const IMAGE_WIDTH = 2560;
export const IMAGE_HEIGHT = 1440;

export const convertPercentToLatLng = (
  xPercent: number,
  yPercent: number,
  imgWidth: number,
  imgHeight: number,
  scale: number = 1
): LatLng => {
  const pixelX = (xPercent / 100) * imgWidth;
  const pixelY = (yPercent / 100) * imgHeight;
  const scaledX = pixelX / scale;
  const scaledY = pixelY / scale;

  return new LatLng(-scaledY, scaledX);
};

export const convertPdfCoorsToLatLng = (
  pdfX: number,
  pdfY: number,
  pdfDpi: number | undefined,
  pixelX?: number,
  pixelY?: number,
  scale: number = 1
): LatLng => {
  if (pixelX !== undefined && pixelY !== undefined) {
    const scaledX = pixelX / scale;
    const scaledY = pixelY / scale;
    return new LatLng(-scaledY, scaledX);
  }

  const dpi = pdfDpi || 72;
  const dpiScale = dpi / 72;

  const rawPixelX = pdfX * dpiScale;
  const rawPixelY = pdfY * dpiScale;

  const scaledX = rawPixelX / scale;
  const scaledY = rawPixelY / scale;

  return new LatLng(-scaledY, scaledX);
};

export const getUnitCoordinates = (
  unit: UnitItem,
  mapData: MapGetResponse | null,
  mapScale: number = 1
): LatLng => {
  if (mapData) {
    return convertPdfCoorsToLatLng(
      unit.x || 0,
      unit.y || 0,
      mapData.dpi,
      unit.xPixel,
      unit.yPixel,
      mapScale
    );
  }

  const imgWidth = IMAGE_WIDTH;
  const imgHeight = IMAGE_HEIGHT;

  return convertPercentToLatLng(
    unit.x || 0,
    unit.y || 0,
    imgWidth,
    imgHeight,
    mapScale
  );
};
