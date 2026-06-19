import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface DziTileLayerProps {
  urlTemplate: string;
  dziMaxLevel: number;
  tileSize: number;
  bounds: L.LatLngBoundsExpression;
}

/**
 * Custom TileLayer cho DZI (Deep Zoom Image).
 * Override getTileUrl để map Leaflet zoom (âm) → DZI level (dương).
 *
 * Leaflet CRS.Simple zoom 0 = 1 pixel/unit (full res).
 * Leaflet zoom -N = thu nhỏ 2^N lần.
 * DZI level = leafletZoom + dziMaxLevel.
 */
const DziTileLayer = ({ urlTemplate, dziMaxLevel, tileSize, bounds }: DziTileLayerProps) => {
  const map = useMap();
  const layerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    const CustomDziLayer = L.TileLayer.extend({
      getTileUrl(coords: L.Coords) {
        // Convert Leaflet zoom (có thể âm) → DZI level (luôn dương)
        const dziLevel = coords.z + dziMaxLevel;
        const clampedLevel = Math.max(0, Math.min(dziLevel, dziMaxLevel));
        const finalUrl = urlTemplate
          .replace('{z}', String(clampedLevel))
          .replace('{x}', String(coords.x))
          .replace('{y}', String(coords.y));

        if (import.meta.env.DEV) {
          console.log(`[DZI Tile] coords: x=${coords.x}, y=${coords.y}, z=${coords.z} -> level=${clampedLevel}, url=${finalUrl}`);
        }
        return finalUrl;
      },
    }) as unknown as new (url: string, options?: L.TileLayerOptions) => L.TileLayer;

    const layer = new CustomDziLayer(urlTemplate, {
      tileSize,
      noWrap: true,
      bounds: bounds as L.LatLngBoundsExpression,
      updateWhenZooming: false,
      updateWhenIdle: true,
      keepBuffer: 2,
      maxZoom: 0,
      minZoom: -dziMaxLevel,
      maxNativeZoom: 0,
      minNativeZoom: -dziMaxLevel,
      errorTileUrl: '',
    });

    layer.addTo(map);
    layerRef.current = layer;

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, urlTemplate, dziMaxLevel, tileSize, bounds]);

  return null;
};

export default DziTileLayer;
