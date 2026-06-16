import { useMap } from 'react-leaflet';
import { useLodMarkers } from '../../../../hooks/useLodMarkers';
import CanvasMarkerLayer from './CanvasMarkerLayer';
import type { UnitItem } from '../../types';
import { useAppSelector } from '../../../../store';

interface LodMarkerBridgeProps {
  allProperties: UnitItem[];
  selectedId: string | null;
  onSelectProperty: (id: string | null) => void;
  mapWidth: number;
  mapHeight: number;
  mapMaxZoom: number;
  mapScale?: number;
}

const LodMarkerBridge = ({
  allProperties,
  selectedId,
  onSelectProperty,
  mapWidth,
  mapHeight,
  mapMaxZoom,
  mapScale = 1,
}: LodMarkerBridgeProps) => {
  const map = useMap();
  const mapData = useAppSelector((state) => state.propertyMap.mapData);
  const searchedUnit = useAppSelector((state) => state.propertyMap.searchedUnit);
  
  // Lấy danh sách marker hiển thị qua thuật toán LOD
  const visibleMarkers = useLodMarkers(allProperties, map, mapData, mapScale);

  // Thêm searchedUnit vào visibleMarkers nếu chưa có mặt
  const finalMarkers = [...visibleMarkers];
  if (searchedUnit) {
    const isAlreadyVisible = finalMarkers.some(
      (m) => String(m.id || m.unitCode) === String(searchedUnit.id || searchedUnit.unitCode)
    );
    if (!isAlreadyVisible) {
      finalMarkers.push(searchedUnit);
    }
  }

  return (
    <CanvasMarkerLayer
      properties={finalMarkers}
      selectedId={selectedId}
      onSelectProperty={onSelectProperty}
      mapWidth={mapWidth}
      mapHeight={mapHeight}
      mapMaxZoom={mapMaxZoom}
      mapScale={mapScale}
    />
  );
};

export default LodMarkerBridge;
