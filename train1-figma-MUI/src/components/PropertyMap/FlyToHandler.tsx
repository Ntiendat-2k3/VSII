import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { convertPercentToLatLng, convertPdfCoorsToLatLng } from '../../utils/mapUtils';
import type { MapGetResponse } from '../../features/property-map/types';

interface FlyToHandlerProps {
  target: { x: number; y: number } | null;
  maxZoom: number;
  mapData: MapGetResponse | null;
}

const FlyToHandler = ({ target, maxZoom, mapData }: FlyToHandlerProps) => {
  const map = useMap();
  const prevTargetRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!target) return;
    // Avoid re-flying to the same target
    if (
      prevTargetRef.current &&
      prevTargetRef.current.x === target.x &&
      prevTargetRef.current.y === target.y
    ) {
      return;
    }
    prevTargetRef.current = target;

    // Convert coordinates using the correct helper
    // We recalculate map dimensions here or just pass mapData and let the helper handle it?
    // Wait, FlyToHandler doesn't receive width/height. It just receives mapData.
    // Let's recalculate the map dimensions exactly as MapCanvas does.
    const w = mapData ? mapData.width || Math.round((mapData.pageWidth || 0) * ((mapData.dpi || 72) / 72)) || 2784 : 2784;
    const h = mapData ? mapData.height || Math.round((mapData.pageHeight || 0) * ((mapData.dpi || 72) / 72)) || 1546 : 1546;

    const latLng = mapData
      ? convertPdfCoorsToLatLng(target.x, target.y, undefined, undefined, w, h, mapData.pageWidth, mapData.pageHeight, maxZoom)
      : convertPercentToLatLng(target.x, target.y);

    map.flyTo(latLng as L.LatLngTuple, maxZoom, { duration: 1.2 });
  }, [target, map, maxZoom, mapData]);

  return null;
};

export default FlyToHandler;
