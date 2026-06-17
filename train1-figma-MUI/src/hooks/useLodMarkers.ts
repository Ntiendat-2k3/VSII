import { useState, useEffect, useMemo } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import KDBush from 'kdbush';
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

  // Pre-calculate LatLng to avoid doing it 100k times on every move
  const precalculatedUnits = useMemo(() => {
    const dpiScale = (mapData?.dpi || 72) / 72;
    const imgWidth = mapData?.width || (mapData?.pageWidth ? Math.round(mapData.pageWidth * dpiScale) : IMAGE_WIDTH);
    const imgHeight = mapData?.height || (mapData?.pageHeight ? Math.round(mapData.pageHeight * dpiScale) : IMAGE_HEIGHT);

    return allUnits.map(property => {
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

      const tuple = latLng as [number, number]; // [lat, lng]
      return {
        unit: property,
        lat: tuple[0],
        lng: tuple[1]
      };
    });
  }, [allUnits, mapData, mapScale]);

  // Khởi tạo Spatial Index (Cây không gian KD-Tree siêu tốc)
  const spatialIndex = useMemo(() => {
    if (!precalculatedUnits.length) return null;
    const index = new KDBush(precalculatedUnits.length);
    for (const u of precalculatedUnits) {
      // Trục X là Lng, trục Y là Lat
      index.add(u.lng, u.lat);
    }
    index.finish();
    return index;
  }, [precalculatedUnits]);

  useEffect(() => {
    if (!map || !spatialIndex) return;
    let timeoutId: number | null = null;

    const calculateLod = () => {
      const zoom = map.getZoom();
      const bounds = map.getBounds();

      const minZoom = map.getMinZoom();
      const maxZoom = map.getMaxZoom();
      const range = maxZoom - minZoom;

      const lod1Threshold = minZoom + range * 0.3;
      const lod2Threshold = minZoom + range * 0.65;

      const isLod1 = zoom <= lod1Threshold;
      const isLod2 = zoom > lod1Threshold && zoom <= lod2Threshold;

      // Fast viewport filter (O(N) but pure number comparison, takes <1ms for 100k)
      const padLat = (bounds.getNorth() - bounds.getSouth()) * 0.1;
      const padLng = (bounds.getEast() - bounds.getWest()) * 0.1;
      const minLat = bounds.getSouth() - padLat;
      const maxLat = bounds.getNorth() + padLat;
      const minLng = bounds.getWest() - padLng;
      const maxLng = bounds.getEast() + padLng;

      // Truy vấn không gian O(log N) siêu tốc bằng KDBush
      const idsInViewport = spatialIndex.range(minLng, minLat, maxLng, maxLat);
      const viewportUnits = idsInViewport.map(id => precalculatedUnits[id]);

      // LOD Filter
      let lodFiltered = viewportUnits;
      if (isLod1) {
        lodFiltered = viewportUnits.filter(u => u.unit.isHot);
      } else if (isLod2) {
        lodFiltered = viewportUnits.filter(u => u.unit.isHot || (u.unit.basePrice != null && u.unit.basePrice <= cheapPriceThreshold));
      }

      let finalUnits = lodFiltered.map(u => u.unit);

      // Cap at MAX_MARKERS_VIEWPORT to strictly prevent DOM/Canvas lag
      if (finalUnits.length > CONFIG.MAX_MARKERS_VIEWPORT) {
        finalUnits.sort((a, b) => {
          const aHot = !!a.isHot;
          const bHot = !!b.isHot;
          if (aHot !== bHot) return aHot ? -1 : 1;
          const priceA = a.basePrice ?? Infinity;
          const priceB = b.basePrice ?? Infinity;
          if (priceA !== priceB) return priceA - priceB;
          return (a.unitCode || '').localeCompare(b.unitCode || '');
        });
        finalUnits = finalUnits.slice(0, CONFIG.MAX_MARKERS_VIEWPORT);
      }

      setVisibleUnits(finalUnits);
    };

    const handleMapChange = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(calculateLod, 300); // Increased debounce to 300ms
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
  }, [precalculatedUnits, spatialIndex, map, cheapPriceThreshold]);

  return visibleUnits;
};
