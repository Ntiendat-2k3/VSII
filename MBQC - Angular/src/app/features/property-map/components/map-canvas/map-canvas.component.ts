import { Component, ChangeDetectionStrategy, ViewChild, ElementRef, AfterViewInit, OnDestroy, inject, effect, ComponentRef, ApplicationRef, createComponent, EnvironmentInjector, signal, computed, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map as rxMap } from 'rxjs/operators';
import * as L from 'leaflet';
import KDBush from 'kdbush';

import { PropertyMapStateService } from '../../services/property-map-state.service';
import type { UnitItem } from '../../models/property-map.model';
import { CONFIG } from '../../../../constants/config.constant';
import { getUnitCoordinates, convertPdfCoorsToLatLng, convertPercentToLatLng } from '../../utils/map.util';
import { CanvasMarkerLayerComponent } from '../canvas-marker-layer/canvas-marker-layer.component';
import { PropertyMarkerComponent } from '../property-marker/property-marker.component';

// DziTileLayer implementation adapted to map negative Leaflet zoom to DZI levels correctly
const DziTileLayer = L.TileLayer.extend({
  initialize: function (url: string, options: any) {
    this.dziMaxLevel = options.dziMaxLevel || 0;
    (L.TileLayer.prototype as any).initialize.call(this, url, options);
  },
  getTileUrl: function (coords: L.Coords) {
    // Map Leaflet zoom (negative) -> DZI level (positive)
    const dziLevel = coords.z + this.dziMaxLevel;
    const clampedLevel = Math.max(0, Math.min(dziLevel, this.dziMaxLevel));
    
    return this._url
      .replace('{z}', String(clampedLevel))
      .replace('{x}', String(coords.x))
      .replace('{y}', String(coords.y));
  },
}) as any;

@Component({
  selector: 'app-map-canvas',
  standalone: true,
  imports: [CommonModule, CanvasMarkerLayerComponent, PropertyMarkerComponent],
  templateUrl: './map-canvas.component.html',
  styleUrls: ['./map-canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapCanvasComponent implements AfterViewInit, OnDestroy {
  private resizeObserver: ResizeObserver | null = null;
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLElement>;

  private readonly state = inject(PropertyMapStateService);
  private readonly appRef = inject(ApplicationRef);
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly ngZone = inject(NgZone);

  // Responsive mobile signal
  readonly isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 959.98px)').pipe(rxMap(result => result.matches)),
    { initialValue: false }
  );

  map: L.Map | null = null;
  private popupRef: ComponentRef<PropertyMarkerComponent> | null = null;
  private mapReady = false;

  // DZI configurations
  imgWidth = 2784;
  imgHeight = 1546;
  dziMaxLevel = 4;
  tileSize = 256;

  // Local map state signals for LOD
  readonly mapBounds = signal<L.LatLngBounds | null>(null);
  readonly mapZoom = signal<number>(0);
  readonly selectedId = signal<string | null>(null);

  // Retrieve selected property object — searches ALL units (not just filtered/AVAILABLE)
  // so that sold/hidden/requested units can still be selected via search
  readonly selectedProperty = computed(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.state.units().find(u => String(u.id || u.unitCode) === id) || null;
  });

  // Cheap threshold (bottom 30% of available prices) — uses ALL units, not filtered,
  // so the percentile boundary stays stable regardless of active filters
  readonly cheapPriceThreshold = computed(() => {
    const allUnits = this.state.units();
    const availableUnits = allUnits.filter(u => u.statusCode === 'AVAILABLE' && u.basePrice != null);
    if (availableUnits.length === 0) return 0;
    const prices = availableUnits.map(u => u.basePrice as number).sort((a, b) => a - b);
    const index = Math.floor(prices.length * CONFIG.LOD_PRICE_PERCENTILE);
    return prices[Math.min(index, prices.length - 1)];
  });

  // Spatial Index Variables
  private spatialIndex: KDBush | null = null;
  private precalculatedUnits: Array<{ unit: UnitItem; lat: number; lng: number }> = [];
  private readonly triggerLODUpdate = signal(0);

  // Build Spatial Index (KD-Tree)
  private readonly rebuildSpatialIndex = effect(() => {
    const allUnits = this.state.filteredUnits();
    const mapData = this.state.mapData();
    if (!allUnits.length) {
      this.spatialIndex = null;
      this.precalculatedUnits = [];
      return;
    }

    const dpiScale = (mapData?.dpi || 72) / 72;
    const w = mapData?.width || (mapData?.pageWidth ? Math.round(mapData.pageWidth * dpiScale) : 2784);
    const h = mapData?.height || (mapData?.pageHeight ? Math.round(mapData.pageHeight * dpiScale) : 1546);

    this.precalculatedUnits = allUnits.map(unit => {
      const latLng = mapData
        ? convertPdfCoorsToLatLng(unit.x || 0, unit.y || 0, mapData.dpi, unit.xPixel, unit.yPixel, 1)
        : convertPercentToLatLng(unit.x || 0, unit.y || 0, w, h, 1);

      return {
        unit,
        lat: latLng.lat,
        lng: latLng.lng
      };
    });

    const index = new KDBush(this.precalculatedUnits.length);
    for (const u of this.precalculatedUnits) {
      index.add(u.lng, u.lat);
    }
    index.finish();
    this.spatialIndex = index;
    this.triggerLODUpdate.update(v => v + 1);
  });

  // Compute visible markers in current viewport based on LOD settings
  readonly visibleProperties = computed(() => {
    this.triggerLODUpdate(); // Dependency
    const bounds = this.mapBounds();
    const zoom = this.mapZoom();
    const index = this.spatialIndex;
    const map = this.map;
    if (!bounds || !index || !map) return [];

    const minZoom = map.getMinZoom();
    const maxZoom = map.getMaxZoom();
    const range = maxZoom - minZoom;

    const lod1Threshold = minZoom + range * 0.3;
    const lod2Threshold = minZoom + range * 0.65;

    const isLod1 = zoom <= lod1Threshold;
    const isLod2 = zoom > lod1Threshold && zoom <= lod2Threshold;

    // Viewport padding (10%)
    const padLat = (bounds.getNorth() - bounds.getSouth()) * 0.1;
    const padLng = (bounds.getEast() - bounds.getWest()) * 0.1;
    const minLat = bounds.getSouth() - padLat;
    const maxLat = bounds.getNorth() + padLat;
    const minLng = bounds.getWest() - padLng;
    const maxLng = bounds.getEast() + padLng;

    const idsInViewport = index.range(minLng, minLat, maxLng, maxLat);
    const viewportUnits = idsInViewport.map(id => this.precalculatedUnits[id]);

    let lodFiltered = viewportUnits;
    if (isLod1) {
      lodFiltered = viewportUnits.filter(u => u.unit.isHot);
    } else if (isLod2) {
      const cheapThresh = this.cheapPriceThreshold();
      lodFiltered = viewportUnits.filter(u => u.unit.isHot || (u.unit.basePrice != null && u.unit.basePrice <= cheapThresh));
    }

    let finalUnits = lodFiltered.map(u => u.unit);

    // Cap at MAX_MARKERS_VIEWPORT to prevent canvas lag
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
  });

  // Properties list including search results if not in current viewport list
  readonly propertiesForMap = computed(() => {
    const visible = this.visibleProperties();
    const searched = this.state.searchedUnit();
    if (!searched) return visible;

    const exists = visible.some(
      u => String(u.id || u.unitCode).toUpperCase() === String(searched.id || searched.unitCode).toUpperCase()
    );
    if (exists) return visible;
    return [...visible, searched];
  });

  constructor() {
    effect(() => {
      const mapData = this.state.mapData();
      if (mapData && this.mapReady && !this.map) {
        this.initMap(mapData);
      }
    });

    effect(() => {
      const searchedUnit = this.state.searchedUnit();
      if (searchedUnit && this.map) {
        const latLng = getUnitCoordinates(searchedUnit, this.state.mapData());
        this.map.flyTo(latLng, 0, { // Max zoom is 0 in CRS.Simple
          animate: true,
          duration: 1.5
        });
        
        const idStr = String(searchedUnit.id || searchedUnit.unitCode);
        this.selectedId.set(idStr);

        if (!this.isMobile()) {
          this.showPopup(searchedUnit, latLng);
        }
      }
    });

    effect(() => {
      const units = this.state.units();
      if (units.length > 0 && this.map) {
        // ponytail: Leaflet canvas overlay sometimes fails to render on initial async data load until browser resize.
        // Forcing invalidateSize when units arrive programmatically simulates the resize to fix it.
        this.ngZone.runOutsideAngular(() => {
          setTimeout(() => {
            if (this.map) {
              this.map.invalidateSize({ animate: false });
              this.ngZone.run(() => this.updateMapState());
            }
          }, 150);
        });
      }
    });
  }

  ngAfterViewInit() {
    this.mapReady = true;
    const mapData = this.state.mapData();
    if (mapData && !this.map) {
      this.initMap(mapData);
    }
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.map) {
      this.map.remove();
    }
    this.destroyPopup();
  }

  private initMap(mapData: any) {
    const dpiScale = (mapData.dpi || 72) / 72;
    const fallbackW = Math.round((mapData.pageWidth || 0) * dpiScale);
    const fallbackH = Math.round((mapData.pageHeight || 0) * dpiScale);

    this.imgWidth = mapData.width || fallbackW || 2784;
    this.imgHeight = mapData.height || fallbackH || 1546;
    this.tileSize = mapData.tileSize || 256;
    this.dziMaxLevel = mapData.totalTiles ?? Math.ceil(Math.log2(Math.max(this.imgWidth, this.imgHeight, 1)));

    const bounds = new L.LatLngBounds(new L.LatLng(-this.imgHeight, 0), new L.LatLng(0, this.imgWidth));

    const targetViewport = 700;
    const maxDim = Math.max(this.imgWidth, this.imgHeight);
    const minZoom = -Math.ceil(Math.log2(maxDim / targetViewport));
    const fitZoom = minZoom;
    const center = new L.LatLng(-this.imgHeight / 2, this.imgWidth / 2);

    this.map = L.map(this.mapContainer.nativeElement, {
      crs: L.CRS.Simple,
      minZoom: minZoom,
      maxZoom: 0,
      zoomControl: true,
      attributionControl: false,
      maxBounds: bounds,
      maxBoundsViscosity: 0.8,
      zoomAnimation: true,
    });

    this.map.setView(center, fitZoom);

    // Custom Dzi TileLayer
    const tileUrlTemplate = mapData.dziKey 
      ? mapData.dziKey.replace(/\.dzi$/, '') + '_files/{z}/{x}_{y}.' + (mapData.tileFormat || 'jpg')
      : '';

    if (tileUrlTemplate) {
      const tileLayer = new DziTileLayer(tileUrlTemplate, {
        dziMaxLevel: this.dziMaxLevel,
        tileSize: this.tileSize,
        bounds: bounds,
        noWrap: true,
        keepBuffer: 2,
        maxZoom: 0,
        minZoom: minZoom,
        maxNativeZoom: 0,
        minNativeZoom: minZoom,
        errorTileUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
      });
      tileLayer.addTo(this.map);
    }

    // Monitor map moves
    this.map.on('moveend zoomend resize', () => {
      this.ngZone.run(() => this.updateMapState());
    });
    
    // Initial State Pull
    this.updateMapState();

    // Fix: invalidateSize with multiple retries so Leaflet recalculates container dimensions.
    // The container may not have its final layout dimensions on the first tick.
    const mapRef = this.map;
    const containerEl = this.mapContainer.nativeElement;

    const doInvalidate = () => {
      mapRef.invalidateSize({ animate: false });
      this.ngZone.run(() => this.updateMapState());
    };

    this.ngZone.runOutsideAngular(() => {
      // Multi-stage invalidation to handle various layout timing scenarios
      setTimeout(doInvalidate, 0);
      setTimeout(doInvalidate, 150);
      setTimeout(doInvalidate, 500);

      // ResizeObserver: catches the exact moment the container gets real dimensions
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          if (width > 0 && height > 0) {
            doInvalidate();
          }
        }
      });
      this.resizeObserver.observe(containerEl);
    });
  }

  private updateMapState() {
    if (!this.map) return;
    this.mapBounds.set(this.map.getBounds());
    this.mapZoom.set(this.map.getZoom());
  }

  handleSelectProperty(id: string | null) {
    this.selectedId.set(id);
    if (!id) {
      this.state.clearSearchedUnit();
      if (this.map) this.map.closePopup();
    } else {
      const selectedProperty = this.state.units().find(u => String(u.id || u.unitCode) === id);
      if (selectedProperty) {
        if (!this.isMobile()) {
          const latLng = getUnitCoordinates(selectedProperty, this.state.mapData());
          this.showPopup(selectedProperty, latLng);
        }
      }
    }
  }

  handleCloseDrawer() {
    this.handleSelectProperty(null);
  }

  private showPopup(unit: any, latLng: L.LatLng) {
    if (!this.map) return;

    this.destroyPopup();

    this.popupRef = createComponent(PropertyMarkerComponent, {
      environmentInjector: this.environmentInjector,
    });
    this.popupRef.instance.unit = unit;
    this.popupRef.instance.close.subscribe(() => {
      this.handleSelectProperty(null);
    });

    this.appRef.attachView(this.popupRef.hostView);

    const domElem = (this.popupRef.hostView as any).rootNodes[0] as HTMLElement;

    L.popup({
      className: 'custom-leaflet-popup',
      closeButton: false,
      autoPan: true,
      autoPanPadding: [50, 50],
      offset: L.point(0, -25)
    })
      .setLatLng(latLng)
      .setContent(domElem)
      .openOn(this.map);

    this.map.once('popupclose', () => {
      this.handleSelectProperty(null);
    });
  }

  private destroyPopup() {
    if (this.popupRef) {
      this.appRef.detachView(this.popupRef.hostView);
      this.popupRef.destroy();
      this.popupRef = null;
    }
  }
}
