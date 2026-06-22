import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { PROPERTY_MAP_ENDPOINTS } from '../../../constants/endpoints.constant';
import { MAP_TYPE, UNIT_STATUS } from '../constants/property-map.constant';
import type { UnitItem } from '../models/property-map.model';
import type { 
  MapGetRequest, 
  MapGetResponse, 
  MapGetCodesRequest, 
  MapSearchRequest,
  UnitInquiryCreateRequest,
  InquiryCreateResponse,
  MasterDataFilterRequest,
  MasterDataResponse
} from '../models/property-map.dto';
import { environment } from '../../../../environments/environment';

// Fallback MOCK data matching React codebase
const MOCK_MAP_CONFIG: MapGetResponse = {
  id: 1,
  dziKey: 'mock-dzi-key',
  tilesKey: 'mock-tiles-key',
  desktopZoomDefault: 1,
  desktopZoomMax: 3,
};

const MOCK_UNITS: UnitItem[] = [
  { id: 101, unitCode: 'SH-01', isHot: true, unitTypeCode: 'SHOPHOUSE', areaLand: 120, areaBuilding: 300, basePrice: 15000000000, statusCode: UNIT_STATUS.AVAILABLE, x: 40, y: 30 },
  { id: 102, unitCode: 'DL-15', isHot: false, unitTypeCode: 'DETACHED', areaLand: 350, areaBuilding: 450, basePrice: 45000000000, statusCode: UNIT_STATUS.SOLD, x: 60, y: 50 },
  { id: 103, unitCode: 'SL-88', isHot: true, unitTypeCode: 'SEMI_DETACHED', areaLand: 200, areaBuilding: 250, basePrice: 22000000000, statusCode: UNIT_STATUS.AVAILABLE, x: 80, y: 20 },
  { id: 104, unitCode: 'LK-12', isHot: false, unitTypeCode: 'TOWNHOUSE', areaLand: 90, areaBuilding: 200, basePrice: 11000000000, statusCode: UNIT_STATUS.AVAILABLE, x: 30, y: 70 },
];

@Injectable({ providedIn: 'root' })
export class PropertyMapService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getMapData(projectId: number): Observable<MapGetResponse> {
    const params: MapGetRequest = { mapType: MAP_TYPE.PROJECT, refId: projectId };
    return this.http.get<{ code: string; data: MapGetResponse }>(
      `${this.baseUrl}${PROPERTY_MAP_ENDPOINTS.MAP_GET}`, { params: params as any }
    ).pipe(
      map(res => res.data),
      switchMap(mapData => {
        if (!mapData || !mapData.dziKey) return of(mapData);

        // Chuẩn hóa dziKey để trỏ đúng qua proxy nếu là relative path
        if (!mapData.dziKey.startsWith('http') && !mapData.dziKey.startsWith('/api-proxy')) {
          mapData.dziKey = `${this.baseUrl}${mapData.dziKey.startsWith('/') ? '' : '/'}${mapData.dziKey}`;
        }

        // Fetch DZI configuration qua proxy
        return this.http.get(mapData.dziKey, { responseType: 'text' }).pipe(
          map(xmlText => {
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
            return mapData;
          }),
          catchError(() => of(mapData))
        );
      }),
      catchError(() => of(MOCK_MAP_CONFIG))
    );
  }

  getUnitCodes(projectId: number, keyword: string): Observable<string[]> {
    if (!keyword.trim()) return of([]);
    const params: MapGetCodesRequest = { mapType: MAP_TYPE.PROJECT, refId: projectId, keyword: keyword.trim() };
    
    return this.http.get<{ code: string; data: string[] }>(
      `${this.baseUrl}${PROPERTY_MAP_ENDPOINTS.MAP_GET_CODES}`,
      { params: params as any }
    ).pipe(
      map(res => res.data || []),
      catchError(() => {
        const codes = MOCK_UNITS
          .filter(u => u.unitCode.toLowerCase().includes(keyword.toLowerCase()))
          .map(u => u.unitCode);
        return of(codes);
      })
    );
  }

  searchUnits(projectId: number, keyword?: string): Observable<UnitItem[]> {
    const payload: MapSearchRequest = {
      mapType: MAP_TYPE.PROJECT,
      refId: projectId,
      ...(keyword && { keyword }),
    };
    return this.http.post<{ code: string; data: any[] }>(
      `${this.baseUrl}${PROPERTY_MAP_ENDPOINTS.MAP_SEARCH}`,
      payload
    ).pipe(
      map(res => {
        const rawData = res.data || [];
        return rawData.map(item => ({
          ...item,
          id: item.unitId ?? item.id,
          unitCode: item.code ?? item.unitCode,
        })) as UnitItem[];
      }),
      catchError(() => {
        const result = keyword 
          ? MOCK_UNITS.filter(u => u.unitCode.toLowerCase().includes(keyword.toLowerCase()))
          : MOCK_UNITS;
        return of(result);
      })
    );
  }

  createInquiry(projectId: number, unitCode: string): Observable<InquiryCreateResponse> {
    const payload: UnitInquiryCreateRequest = { projectId, unitCode };
    return this.http.post<{ code: string; data: InquiryCreateResponse }>(
      `${this.baseUrl}${PROPERTY_MAP_ENDPOINTS.UNIT_INQUIRY_CREATE}`,
      payload
    ).pipe(
      map(res => res.data || { success: true, status: 'PENDING' as any }),
      catchError(() => of({ success: true, status: 'PENDING' as any }))
    );
  }

  getMasterData(params: MasterDataFilterRequest): Observable<MasterDataResponse[]> {
    return this.http.get<{ code: string; data: MasterDataResponse[] }>(
      `${this.baseUrl}${PROPERTY_MAP_ENDPOINTS.MASTER_DATA_LIST}`,
      { params: params as any }
    ).pipe(
      map(res => res.data || []),
      catchError(() => of([]))
    );
  }
}
