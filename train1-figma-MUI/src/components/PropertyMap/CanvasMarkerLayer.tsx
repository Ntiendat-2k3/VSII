import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { convertPercentToLatLng, convertPdfCoorsToLatLng } from '../../utils/mapUtils';
import type { UnitItem } from '../../features/property-map/types';
import { drawPropertyMarker, MARKER_WIDTH, clearMarkerCache } from '../../utils/canvasMarkerRenderer';
import { useAppSelector } from '../../store';

interface CanvasMarkerLayerProps {
  properties: UnitItem[];
  selectedId: string | null;
  onSelectProperty: (id: string | null) => void;
  mapWidth: number;
  mapHeight: number;
  mapMaxZoom: number;
  mapScale: number;
}

interface BBox {
  id: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
}

const CanvasMarkerLayer = ({
  properties,
  selectedId,
  onSelectProperty,
  mapWidth,
  mapHeight,
  mapMaxZoom,
  mapScale,
}: CanvasMarkerLayerProps) => {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bboxesRef = useRef<BBox[]>([]);
  const hoveredIdRef = useRef<string | null>(null);

  const mapData = useAppSelector((state) => state.propertyMap.mapData);

  const propsRef = useRef({ properties, selectedId, onSelectProperty, mapData, mapWidth, mapHeight, mapMaxZoom, mapScale });
  useEffect(() => {
    propsRef.current = { properties, selectedId, onSelectProperty, mapData, mapWidth, mapHeight, mapMaxZoom, mapScale };
  }, [properties, selectedId, onSelectProperty, mapData, mapWidth, mapHeight, mapMaxZoom, mapScale]);

  useEffect(() => {
    const canvas = L.DomUtil.create('canvas', 'leaflet-zoom-animated') as HTMLCanvasElement;
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '400'; // Đặt lớp Canvas nằm trên đè lên TileLayer hình ảnh mặt bằng

    const pane = map.getPane('overlayPane');
    if (!pane) return;
    pane.appendChild(canvas);
    canvasRef.current = canvas;

    const redraw = () => {
      const size = map.getSize();
      const topLeft = map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(canvas, topLeft);

      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== size.x * dpr || canvas.height !== size.y * dpr) {
        canvas.width = size.x * dpr;
        canvas.height = size.y * dpr;
        canvas.style.width = `${size.x}px`;
        canvas.style.height = `${size.y}px`;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      const { properties: currentProps, selectedId: currentSelected, mapData: currentMapData } = propsRef.current;
      const bboxes: BBox[] = [];

      const unselected = currentProps.filter(p => String(p.id || p.unitCode) !== currentSelected);
      const selected = currentProps.find(p => String(p.id || p.unitCode) === currentSelected);

      const drawProp = (property: UnitItem, isSelected: boolean) => {
        const propertyId = String(property.id || property.unitCode);
        const latLng = currentMapData
          ? convertPdfCoorsToLatLng(
            property.x || 0,
            property.y || 0,
            currentMapData.dpi,
            property.xPixel,
            property.yPixel,
            propsRef.current.mapScale
          )
          : convertPercentToLatLng(property.x || 0, property.y || 0, propsRef.current.mapWidth, propsRef.current.mapHeight, propsRef.current.mapScale);

        // Quy đổi tọa độ LatLng sang tọa độ Pixel thực tế trên Frame hiển thị của Container Web
        const layerPoint = map.latLngToLayerPoint(latLng as L.LatLngTuple);
        const x = layerPoint.x - topLeft.x;
        const y = layerPoint.y - topLeft.y;

        if (import.meta.env.DEV && property.unitCode === 'VK1-18') {
          console.log(`[DEBUG VK1-18] x=${property.x}, y=${property.y}, xPixel=${property.xPixel}, yPixel=${property.yPixel}, px=${x}, py=${y}`);
        }

        const isHovered = propertyId === hoveredIdRef.current;

        // Vẽ khối card căn hộ (Cần đảm bảo hàm drawPropertyMarker vẽ lấy trục (x,y) làm gốc chân/tâm của căn hộ)
        const height = drawPropertyMarker(ctx, property, x, y, isSelected || isHovered);

        // Lưu trữ vùng bấm (Bounding Box) phục vụ cho Hit Testing (Click/Hover chuột)
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

      bboxesRef.current = bboxes;
      ctx.restore();
    };

    let rAF: number;
    const requestRedraw = () => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(redraw);
    };

    map.on('viewreset move resize zoom', requestRedraw);
    requestRedraw();

    // Xử lý sự kiện Hover chuột di chuyển trên bản đồ phẳng
    const handleMouseMove = (e: L.LeafletMouseEvent) => {
      const { x, y } = e.containerPoint;
      let foundId: string | null = null;
      for (let i = bboxesRef.current.length - 1; i >= 0; i--) {
        const bbox = bboxesRef.current[i];
        if (x >= bbox.left && x <= bbox.right && y >= bbox.top && y <= bbox.bottom) {
          foundId = bbox.id;
          break;
        }
      }

      if (hoveredIdRef.current !== foundId) {
        hoveredIdRef.current = foundId;
        map.getContainer().style.cursor = foundId ? 'pointer' : '';
        requestRedraw();
      }
    };

    // Xử lý sự kiện Click chuột chọn căn trên bản đồ phẳng
    const handleClick = (e: L.LeafletMouseEvent) => {
      const { x, y } = e.containerPoint;
      let foundId: string | null = null;
      for (let i = bboxesRef.current.length - 1; i >= 0; i--) {
        const bbox = bboxesRef.current[i];
        if (x >= bbox.left && x <= bbox.right && y >= bbox.top && y <= bbox.bottom) {
          foundId = bbox.id;
          break;
        }
      }

      if (foundId) {
        const { selectedId, onSelectProperty } = propsRef.current;
        onSelectProperty(foundId === selectedId ? null : foundId);
        L.DomEvent.stopPropagation(e);
      }
    };

    map.on('mousemove', handleMouseMove);
    map.on('click', handleClick);

    return () => {
      cancelAnimationFrame(rAF);
      map.off('viewreset move resize zoom', requestRedraw);
      map.off('mousemove', handleMouseMove);
      map.off('click', handleClick);
      pane.removeChild(canvas);
      map.getContainer().style.cursor = '';
      clearMarkerCache();
    };
  }, [map]);

  useEffect(() => {
    map.fire('move');
  }, [properties, selectedId, map]);

  return null;
};

export default CanvasMarkerLayer;