import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { convertPercentToLatLng, convertPdfCoorsToLatLng } from '../utils/mapUtils';
import type { MapGetResponse } from '../types/PropertyMapDto';

interface FlyToHandlerProps {
  target: {
    x: number;
    y: number;
    xPixel?: number;
    yPixel?: number;
    rotation?: number;
    pageWidth?: number;
    pageHeight?: number;
  } | null;
  maxZoom: number;
  mapData: MapGetResponse | null;
  mapScale?: number;
}

const FlyToHandler = ({ target, maxZoom, mapData, mapScale = 1 }: FlyToHandlerProps) => {
  const map = useMap();
  const prevTargetRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!target) return;

    // Tránh việc lặp lại hiệu ứng flyTo khi dữ liệu target không đổi
    if (
      prevTargetRef.current &&
      prevTargetRef.current.x === target.x &&
      prevTargetRef.current.y === target.y
    ) {
      return;
    }
    prevTargetRef.current = { x: target.x, y: target.y };

    // Thực hiện chuyển đổi tọa độ điểm Focus
    const latLng = mapData
      ? convertPdfCoorsToLatLng(
        target.x,
        target.y,
        mapData.dpi,
        target.xPixel,
        target.yPixel,
        mapScale
      )
      : convertPercentToLatLng(target.x, target.y, undefined, undefined, mapScale);

    // Đi thẳng đến mức maxZoom (mức nét nhất hiển thị rõ từng căn hộ)
    map.flyTo(latLng as L.LatLngTuple, maxZoom, { duration: 1.2 });
  }, [target, map, maxZoom, mapData, mapScale]);

  return null;
};

export default FlyToHandler;