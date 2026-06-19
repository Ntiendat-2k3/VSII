import axiosClient from '@/api/axiosClient';
import type { MapSearchRequest } from '../types/PropertyMapDto';
import type { UnitItem } from '../types/PropertyMapModel';
import { MAP_TYPE, UNIT_STATUS, BACKEND_UNIT_TYPE } from '../constants/propertyMapStatus';
import { PROPERTY_MAP_ENDPOINTS } from '@/api/endpoints';

/* ===== MOCK DATA FALLBACK ===== */
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

export const propertyMapMutationApi = {
  /** POST `/portal/map/search` — Lấy danh sách các căn trên bản đồ. */
  searchUnits: async (projectId: number, keyword?: string): Promise<UnitItem[]> => {
    try {
      const payload: MapSearchRequest = {
        mapType: MAP_TYPE.PROJECT,
        refId: projectId,
        ...(keyword && { keyword }),
      };
      const response = await axiosClient.post(PROPERTY_MAP_ENDPOINTS.MAP_SEARCH, payload);
      
      const rawData = (response.data || []) as Array<Record<string, unknown>>;
      const result = rawData.map((item) => ({
        ...item,
        id: (item.unitId ?? item.id) as number | undefined,
        unitCode: (item.code ?? item.unitCode) as string,
      })) as unknown as UnitItem[];
      if (import.meta.env.DEV) {
        console.log('Data trả về của tất cả các căn (API):', result.map(u => ({
          unitCode: u.unitCode,
          rotation: u.rotation,
          pageWidth: u.pageWidth,
          pageHeight: u.pageHeight,
          x: u.x,
          y: u.y,
          dpi: u.dpi,
          xPixel: u.xPixel,
          yPixel: u.yPixel
        })));
      }
      return result;
    } catch {
      const result = keyword 
        ? MOCK_UNITS.filter(u => u.unitCode.toLowerCase().includes(keyword.toLowerCase()))
        : MOCK_UNITS;
      if (import.meta.env.DEV) {
        console.log('Data trả về của tất cả các căn (Mock):', result);
      }
      return result;
    }
  },
};
