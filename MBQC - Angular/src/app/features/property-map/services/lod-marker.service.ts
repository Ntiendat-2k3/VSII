import { Injectable } from '@angular/core';
import type { Map as LeafletMap } from 'leaflet';
import KDBush from 'kdbush';
import type { UnitItem } from '../models/property-map.model';
import type { MapGetResponse } from '../models/property-map.dto';
import { CONFIG } from '../../../constants/config.constant';
import { convertPdfCoorsToLatLng, convertPercentToLatLng, IMAGE_WIDTH, IMAGE_HEIGHT } from '../utils/map.util';

@Injectable({ providedIn: 'root' })
export class LodMarkerService {
  calculateVisibleMarkers(
    allUnits: UnitItem[],
    map: LeafletMap,
    mapData: MapGetResponse | null,
    mapScale: number = 1
  ): UnitItem[] {
    if (!allUnits.length || !map) return [];

    const availableUnits = allUnits.filter(u => u.statusCode === 'AVAILABLE' && u.basePrice != null);
    let cheapPriceThreshold = 0;
    if (availableUnits.length > 0) {
      const prices = availableUnits.map(u => u.basePrice as number).sort((a, b) => a - b);
      const index = Math.floor(prices.length * CONFIG.LOD_PRICE_PERCENTILE);
      cheapPriceThreshold = prices[Math.min(index, prices.length - 1)];
    }

    const dpiScale = (mapData?.dpi || 72) / 72;
    const imgWidth = mapData?.width || (mapData?.pageWidth ? Math.round(mapData.pageWidth * dpiScale) : IMAGE_WIDTH);
    const imgHeight = mapData?.height || (mapData?.pageHeight ? Math.round(mapData.pageHeight * dpiScale) : IMAGE_HEIGHT);

    const precalculated = allUnits.map(property => {
      const latLng = mapData
        ? convertPdfCoorsToLatLng(property.x || 0, property.y || 0, mapData.dpi, property.xPixel, property.yPixel, mapScale)
        : convertPercentToLatLng(property.x || 0, property.y || 0, imgWidth, imgHeight, mapScale);
      
      return { unit: property, lat: latLng.lat, lng: latLng.lng };
    });

    const spatialIndex = new KDBush(precalculated.length);
    for (const u of precalculated) {
      spatialIndex.add(u.lng, u.lat);
    }
    spatialIndex.finish();

    const zoom = map.getZoom();
    const bounds = map.getBounds();
    const minZoom = map.getMinZoom();
    const maxZoom = map.getMaxZoom();
    const range = maxZoom - minZoom;

    const lod1Threshold = minZoom + range * 0.3;
    const lod2Threshold = minZoom + range * 0.65;

    const isLod1 = zoom <= lod1Threshold;
    const isLod2 = zoom > lod1Threshold && zoom <= lod2Threshold;

    const padLat = (bounds.getNorth() - bounds.getSouth()) * 0.1;
    const padLng = (bounds.getEast() - bounds.getWest()) * 0.1;
    const minLat = bounds.getSouth() - padLat;
    const maxLat = bounds.getNorth() + padLat;
    const minLng = bounds.getWest() - padLng;
    const maxLng = bounds.getEast() + padLng;

    const idsInViewport = spatialIndex.range(minLng, minLat, maxLng, maxLat);
    const viewportUnits = idsInViewport.map(id => precalculated[id]);

    let lodFiltered = viewportUnits;
    if (isLod1) {
      lodFiltered = viewportUnits.filter(u => u.unit.isHot);
    } else if (isLod2) {
      lodFiltered = viewportUnits.filter(u => u.unit.isHot || (u.unit.basePrice != null && u.unit.basePrice <= cheapPriceThreshold));
    }

    let finalUnits = lodFiltered.map(u => u.unit);

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

    return finalUnits;
  }
}
