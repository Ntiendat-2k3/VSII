import { Component, AfterViewInit, OnDestroy, Input, Output, EventEmitter, inject, effect, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { PropertyMapStateService } from '../../services/property-map-state.service';
import type { UnitItem } from '../../models/property-map.model';
import { drawPropertyMarker, MARKER_WIDTH, clearMarkerCache } from '../../utils/canvas-marker-renderer.util';
import { convertPercentToLatLng, convertPdfCoorsToLatLng } from '../../utils/map.util';

interface BBox {
  id: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

@Component({
  selector: 'app-canvas-marker-layer',
  standalone: true,
  imports: [CommonModule],
  template: '', // No template needed as it appends directly to Leaflet overlayPane
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvasMarkerLayerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) map!: L.Map;
  @Input() properties: UnitItem[] = [];
  @Input() selectedId: string | null = null;
  @Input() mapWidth!: number;
  @Input() mapHeight!: number;
  @Input() mapMaxZoom!: number;
  @Input() mapScale: number = 1;

  @Output() selectProperty = new EventEmitter<string | null>();

  private readonly state = inject(PropertyMapStateService);

  private canvas: HTMLCanvasElement | null = null;
  private bboxes: BBox[] = [];
  private hoveredId: string | null = null;
  private rAFId = 0;

  constructor() {
    effect(() => {
      // Re-trigger redraw when global mapData changes
      const data = this.state.mapData();
      if (data) {
        this.requestRedraw();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.canvas) {
      this.requestRedraw();
    }
  }

  ngAfterViewInit() {
    if (!this.map) return;

    // Create Leaflet overlay canvas
    this.canvas = L.DomUtil.create('canvas', 'leaflet-zoom-animated') as HTMLCanvasElement;
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '400';

    const pane = this.map.getPane('overlayPane');
    if (pane) {
      pane.appendChild(this.canvas);
    }

    // Leaflet map events
    this.map.on('viewreset move resize zoom', this.requestRedraw, this);

    // Hit Testing Events on the map
    this.map.on('mousemove', this.handleMouseMove, this);
    this.map.on('click', this.handleClick, this);

    // Preload icons listener
    window.addEventListener('unit-icons-loaded', this.handleIconsLoaded);

    this.requestRedraw();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.rAFId);

    if (this.map) {
      this.map.off('viewreset move resize zoom', this.requestRedraw, this);
      this.map.off('mousemove', this.handleMouseMove, this);
      this.map.off('click', this.handleClick, this);
      this.map.getContainer().style.cursor = '';
    }

    window.removeEventListener('unit-icons-loaded', this.handleIconsLoaded);

    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }

    clearMarkerCache();
  }

  private handleIconsLoaded = () => {
    this.requestRedraw();
  };

  private requestRedraw = () => {
    cancelAnimationFrame(this.rAFId);
    this.rAFId = requestAnimationFrame(() => this.redraw());
  };

  private redraw() {
    if (!this.canvas || !this.map) return;

    const size = this.map.getSize();

    // Guard: if container hasn't been laid out yet, skip and schedule retry
    if (size.x === 0 || size.y === 0) {
      cancelAnimationFrame(this.rAFId);
      this.rAFId = requestAnimationFrame(() => this.redraw());
      return;
    }

    const topLeft = this.map.containerPointToLayerPoint([0, 0]);
    L.DomUtil.setPosition(this.canvas, topLeft);

    const dpr = window.devicePixelRatio || 1;

    // Ensure canvas dimensions matches pixel density
    if (this.canvas.width !== size.x * dpr || this.canvas.height !== size.y * dpr) {
      this.canvas.width = size.x * dpr;
      this.canvas.height = size.y * dpr;
      this.canvas.style.width = `${size.x}px`;
      this.canvas.style.height = `${size.y}px`;
    }

    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    const bboxes: BBox[] = [];
    const mapData = this.state.mapData();

    const unselected = this.properties.filter(p => String(p.id || p.unitCode) !== this.selectedId);
    const selected = this.properties.find(p => String(p.id || p.unitCode) === this.selectedId);

    const drawProp = (property: UnitItem, isSelected: boolean) => {
      const propertyId = String(property.id || property.unitCode);
      const latLng = mapData
        ? convertPdfCoorsToLatLng(
            property.x || 0,
            property.y || 0,
            mapData.dpi,
            property.xPixel,
            property.yPixel,
            this.mapScale
          )
        : convertPercentToLatLng(
            property.x || 0,
            property.y || 0,
            this.mapWidth,
            this.mapHeight,
            this.mapScale
          );

      const layerPoint = this.map.latLngToLayerPoint(latLng);
      const x = layerPoint.x - topLeft.x;
      const y = layerPoint.y - topLeft.y;

      const isHovered = propertyId === this.hoveredId;

      const height = drawPropertyMarker(ctx, x, y, property, isSelected || isHovered);

      bboxes.push({
        id: propertyId,
        left: x - MARKER_WIDTH / 2,
        top: y - height,
        right: x + MARKER_WIDTH / 2,
        bottom: y
      });
    };

    unselected.forEach(p => drawProp(p, false));
    if (selected) {
      drawProp(selected, true);
    }

    this.bboxes = bboxes;
    ctx.restore();
  }

  private handleMouseMove(e: L.LeafletMouseEvent) {
    const { x, y } = e.containerPoint;
    let foundId: string | null = null;

    for (let i = this.bboxes.length - 1; i >= 0; i--) {
      const bbox = this.bboxes[i];
      if (x >= bbox.left && x <= bbox.right && y >= bbox.top && y <= bbox.bottom) {
        foundId = bbox.id;
        break;
      }
    }

    if (this.hoveredId !== foundId) {
      this.hoveredId = foundId;
      this.map.getContainer().style.cursor = foundId ? 'pointer' : '';
      this.requestRedraw();
    }
  }

  private handleClick(e: L.LeafletMouseEvent) {
    const { x, y } = e.containerPoint;
    let foundId: string | null = null;

    for (let i = this.bboxes.length - 1; i >= 0; i--) {
      const bbox = this.bboxes[i];
      if (x >= bbox.left && x <= bbox.right && y >= bbox.top && y <= bbox.bottom) {
        foundId = bbox.id;
        break;
      }
    }

    if (foundId) {
      this.selectProperty.emit(foundId === this.selectedId ? null : foundId);
      L.DomEvent.stopPropagation(e);
    } else {
      if (this.selectedId !== null) {
        this.selectProperty.emit(null);
      }
    }
  }
}
