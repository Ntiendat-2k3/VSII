import axiosClient from '../../../services/axiosClient';
import type {
  MapGetRequest,
  MapGetResponse,
  MapGetCodesRequest,
} from '../types/PropertyMapDto';
import type { UnitItem } from '../types/PropertyMapModel';
import { MAP_TYPE, UNIT_STATUS, BACKEND_UNIT_TYPE } from '../constants/propertyMapStatus';
import { PROPERTY_MAP_ENDPOINTS } from '../../../services/endpoints';

/* ===== MOCK DATA FALLBACK ===== */
const MOCK_MAP_CONFIG: MapGetResponse = {
  id: 1,
  dziKey: 'mock-dzi-key',
  tilesKey: 'mock-tiles-key',
  desktopZoomDefault: 1,
  desktopZoomMax: 3,
};

const MOCK_UNITS: UnitItem[] = [
  {
    id: 101,
    unitCode: 'SH-01',
    isHot: true,
    unitTypeCode: BACKEND_UNIT_TYPE.SHOPHOUSE,
    areaLand: 120,
    areaBuilding: 300,
    basePrice: 15000000000,
    statusCode: UNIT_STATUS.AVAILABLE,
    x: 40,
    y: 30,
  },
  {
    id: 102,
    unitCode: 'DL-15',
    isHot: false,
    unitTypeCode: BACKEND_UNIT_TYPE.DETACHED,
    areaLand: 350,
    areaBuilding: 450,
    basePrice: 45000000000,
    statusCode: UNIT_STATUS.SOLD,
    x: 60,
    y: 50,
  },
  {
    id: 103,
    unitCode: 'SL-88',
    isHot: true,
    unitTypeCode: BACKEND_UNIT_TYPE.SEMI_DETACHED,
    areaLand: 200,
    areaBuilding: 250,
    basePrice: 22000000000,
    statusCode: UNIT_STATUS.AVAILABLE,
    x: 80,
    y: 20,
  },
  {
    id: 104,
    unitCode: 'LK-12',
    isHot: false,
    unitTypeCode: BACKEND_UNIT_TYPE.TOWNHOUSE,
    areaLand: 90,
    areaBuilding: 200,
    basePrice: 11000000000,
    statusCode: UNIT_STATUS.AVAILABLE,
    x: 30,
    y: 70,
  },
];

export const propertyMapQueryApi = {
  /** GET `/portal/map/get` — Lấy thông tin tile bản đồ dự án. */
  getMapData: async (projectId: number): Promise<MapGetResponse> => {
    try {
      const params: MapGetRequest = { mapType: MAP_TYPE.PROJECT, refId: projectId };
      const response = await axiosClient.get(PROPERTY_MAP_ENDPOINTS.MAP_GET, { params });
      
      const mapData = response.data;
      if (mapData && mapData.dziKey) {
        try {
          const xmlRes = await fetch(mapData.dziKey);
          if (xmlRes.ok) {
            const xmlText = await xmlRes.text();
            const formatMatch = xmlText.match(/Format="([^"]+)"/);
            const tileSizeMatch = xmlText.match(/TileSize="([^"]+)"/);
            const overlapMatch = xmlText.match(/Overlap="([^"]+)"/);
            const widthMatch = xmlText.match(/Width="([^"]+)"/);
            const heightMatch = xmlText.match(/Height="([^"]+)"/);

            mapData.tileFormat = formatMatch ? formatMatch[1] : 'jpg';
            mapData.tileSize = tileSizeMatch ? parseInt(tileSizeMatch[1], 10) : 256;
            mapData.overlap = overlapMatch ? parseInt(overlapMatch[1], 10) : 1;
            mapData.width = widthMatch ? parseInt(widthMatch[1], 10) : 0;
            mapData.height = heightMatch ? parseInt(heightMatch[1], 10) : 0;
          }
        } catch {
          // Silent catch in production
        }
      }
      
      return mapData;
    } catch {
      return MOCK_MAP_CONFIG;
    }
  },

  /** GET `/portal/map/get-codes` — Trả về danh sách mã căn gợi ý. */
  getUnitCodes: async (projectId: number, keyword: string): Promise<string[]> => {
    if (!keyword.trim()) return [];

    try {
      const params: MapGetCodesRequest = {
        mapType: MAP_TYPE.PROJECT,
        refId: projectId,
        keyword: keyword.trim(),
      };
      const response = await axiosClient.get(PROPERTY_MAP_ENDPOINTS.MAP_GET_CODES, { params });
      return response.data || [];
    } catch {
      return MOCK_UNITS.reduce<string[]>((codes, u) => {
        if (u.unitCode.toLowerCase().includes(keyword.toLowerCase())) {
          codes.push(u.unitCode);
        }
        return codes;
      }, []);
    }
  },
};
