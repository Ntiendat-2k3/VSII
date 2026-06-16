import { useState, useEffect, useMemo } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import L from 'leaflet';
import type { UnitItem, MapGetResponse } from '../features/property-map/types';
import { CONFIG } from '../constants/config';
import { convertPdfCoorsToLatLng, convertPercentToLatLng, IMAGE_WIDTH, IMAGE_HEIGHT } from '../utils/mapUtils';

export const useLodMarkers = (
  allUnits: UnitItem[],
  map: LeafletMap | null,
  mapData: MapGetResponse | null,
  mapScale: number = 1
): UnitItem[] => {
  const [visibleUnits, setVisibleUnits] = useState<UnitItem[]>([]);

  // Pre-calculate cheap threshold (top 30% cheapest among available units)
  const cheapPriceThreshold = useMemo(() => {
    const availableUnits = allUnits.filter(u => u.statusCode === 'AVAILABLE' && u.basePrice != null);
    if (availableUnits.length === 0) return 0;
    const prices = availableUnits.map(u => u.basePrice as number).sort((a, b) => a - b);
    const index = Math.floor(prices.length * CONFIG.LOD_PRICE_PERCENTILE);
    return prices[Math.min(index, prices.length - 1)];
  }, [allUnits]);

  useEffect(() => {
    if (!map) return;
    let timeoutId: number | null = null;

    const calculateLod = () => {
      const zoom = map.getZoom();
      const bounds = map.getBounds();
      
      const minZoom = map.getMinZoom();
      const maxZoom = map.getMaxZoom();
      const range = maxZoom - minZoom;
      
      const lod1Threshold = minZoom + range * 0.3; // Below this, only HOT
      const lod2Threshold = minZoom + range * 0.65; // Below this, HOT + Cheap
      
      const isLod1 = zoom <= lod1Threshold;
      const isLod2 = zoom > lod1Threshold && zoom <= lod2Threshold;
      // const isLod3 = zoom > lod2Threshold;

      // Filter by viewport first
      const padLat = (bounds.getNorth() - bounds.getSouth()) * 0.1;
      const padLng = (bounds.getEast() - bounds.getWest()) * 0.1;
      const paddedBounds = new L.LatLngBounds(
        [bounds.getSouth() - padLat, bounds.getWest() - padLng],
        [bounds.getNorth() + padLat, bounds.getEast() + padLng]
      );

      const dpiScale = (mapData?.dpi || 72) / 72;
      const imgWidth = mapData?.width || (mapData?.pageWidth ? Math.round(mapData.pageWidth * dpiScale) : IMAGE_WIDTH);
      const imgHeight = mapData?.height || (mapData?.pageHeight ? Math.round(mapData.pageHeight * dpiScale) : IMAGE_HEIGHT);

      const viewportUnits = allUnits.filter(property => {
        const latLng = mapData
          ? convertPdfCoorsToLatLng(
            property.x || 0,
            property.y || 0,
            mapData.dpi,
            property.xPixel,
            property.yPixel,
            mapScale
          )
          : convertPercentToLatLng(property.x || 0, property.y || 0, imgWidth, imgHeight, mapScale);
        
        return paddedBounds.contains(latLng as L.LatLngTuple);
      });

      // Filter by LOD
      let lodFiltered = viewportUnits;
      if (isLod1) {
        lodFiltered = viewportUnits.filter(u => u.isHot);
      } else if (isLod2) {
        lodFiltered = viewportUnits.filter(u => u.isHot || (u.basePrice != null && u.basePrice <= cheapPriceThreshold));
      }

      // Cap at MAX_MARKERS_VIEWPORT
      if (lodFiltered.length > CONFIG.MAX_MARKERS_VIEWPORT) {
        // Sort priority: Hot first -> Cheap first -> Alphabetical
        lodFiltered.sort((a, b) => {
          if (a.isHot !== b.isHot) return a.isHot ? -1 : 1;
          const priceA = a.basePrice ?? Infinity;
          const priceB = b.basePrice ?? Infinity;
          if (priceA !== priceB) return priceA - priceB;
          return (a.unitCode || '').localeCompare(b.unitCode || '');
        });
        lodFiltered = lodFiltered.slice(0, CONFIG.MAX_MARKERS_VIEWPORT);
      }

      setVisibleUnits(lodFiltered);
    };

    const handleMapChange = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(calculateLod, 150);
    };

    map.on('zoomend moveend resize', handleMapChange);
    // Initial calculate
    calculateLod();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      map.off('zoomend moveend resize', handleMapChange);
    };
  }, [allUnits, map, mapData, mapScale, cheapPriceThreshold]);

  return visibleUnits;
};
