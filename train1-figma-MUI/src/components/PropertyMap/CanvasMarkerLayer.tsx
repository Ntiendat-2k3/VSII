import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { convertPercentToLatLng } from '../../utils/mapUtils';
import type { Property } from '../../types/property';
import { drawPropertyMarker, MARKER_WIDTH } from '../../utils/canvasMarkerRenderer';

interface CanvasMarkerLayerProps {
  properties: Property[];
  selectedId: string | null;
  onSelectProperty: (id: string | null) => void;
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
}: CanvasMarkerLayerProps) => {
  const map = useMap();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bboxesRef = useRef<BBox[]>([]);
  const hoveredIdRef = useRef<string | null>(null);
  
  // Keep refs for callbacks so we don't need to re-bind map events when props change
  const propsRef = useRef({ properties, selectedId, onSelectProperty });
  useEffect(() => {
    propsRef.current = { properties, selectedId, onSelectProperty };
  }, [properties, selectedId, onSelectProperty]);

  useEffect(() => {
    const canvas = L.DomUtil.create('canvas', 'leaflet-zoom-animated') as HTMLCanvasElement;
    
    // Position it such that it doesn't block DOM events, 
    // but wait, if it's pointerEvents = none, how do we catch clicks?
    // We catch clicks and mousemove on the map container instead!
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '400'; // above tiles

    const pane = map.getPane('overlayPane');
    if (!pane) return;
    pane.appendChild(canvas);
    canvasRef.current = canvas;

    const redraw = () => {
      const size = map.getSize();
      
      // We position the canvas exactly at the current top-left of the overlay pane's view
      const topLeft = map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(canvas, topLeft);

      const dpr = window.devicePixelRatio || 1;
      
      // Only resize canvas if needed
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

      const { properties: currentProps, selectedId: currentSelected } = propsRef.current;
      const bboxes: BBox[] = [];

      // Render markers
      // To optimize, we could filter by bounds, but CRS.Simple maps are usually small enough
      
      // Draw unselected first, then selected on top
      const unselected = currentProps.filter(p => p.id !== currentSelected);
      const selected = currentProps.find(p => p.id === currentSelected);

      const drawProp = (property: Property, isSelected: boolean) => {
        const latLng = convertPercentToLatLng(property.position.x, property.position.y);
        
        // Coordinate relative to map container
        const layerPoint = map.latLngToLayerPoint(latLng as L.LatLngTuple);
        const x = layerPoint.x - topLeft.x;
        const y = layerPoint.y - topLeft.y;

        const isHovered = property.id === hoveredIdRef.current;
        // The renderer handles drawing the entire complex card
        const height = drawPropertyMarker(ctx, property, x, y, isSelected || isHovered);
        
        bboxes.push({
            id: property.id,
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

    // Frame request id for requestAnimationFrame
    let rAF: number;
    const requestRedraw = () => {
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(redraw);
    };

    map.on('viewreset move resize zoom', requestRedraw);
    requestRedraw();

    // Hit testing logic
    const handleMouseMove = (e: L.LeafletMouseEvent) => {
        const { x, y } = e.containerPoint;
        let foundId: string | null = null;
        // Search backwards to match topmost drawn marker (selected usually on top, or last drawn)
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
            // we click on a marker
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
    };
  }, [map]);

  // Redraw when properties or selection changes
  useEffect(() => {
    // Dispatch a custom or simply trigger move to redraw
    map.fire('move');
  }, [properties, selectedId, map]);

  return null; // This component renders nothing via React DOM
};

export default CanvasMarkerLayer;
