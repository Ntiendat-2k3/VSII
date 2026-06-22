import type { MapType } from '../constants/property-map.constant';
import type { InquiryStatusCode } from './property-map.model';

export interface MapGetRequest {
  mapType: MapType;
  refId: number;
}

export interface MapGetResponse {
  id: number;
  dziKey: string;
  tilesKey: string;
  mobileZoomDefault?: number;
  tabletZoomDefault?: number;
  desktopZoomDefault?: number;
  mobileZoomMax?: number;
  tabletZoomMax?: number;
  desktopZoomMax?: number;
  pageWidth?: number;
  pageHeight?: number;
  dpi?: number;
  rotation?: number;
  totalTiles?: number;
  tileFormat?: string;
  tileSize?: number;
  overlap?: number;
  width?: number;
  height?: number;
}

export interface MapSearchRequest {
  refId: number;
  mapType: MapType;
  unitTypeCodes?: string[];
  keyword?: string;
}

export interface MapGetCodesRequest {
  refId: number;
  mapType: MapType;
  keyword?: string;
}

export interface UnitInquiryCreateRequest {
  projectId: number;
  unitCode: string;
}

export interface InquiryCreateResponse {
  success: boolean;
  status: InquiryStatusCode;
  statusName?: string;
  inquiryStatusName?: string;
}

export interface MasterDataFilterRequest {
  groupCode?: string;
  code?: string;
  subGroupCode?: string;
}

export interface MasterDataResponse {
  groupCode: string;
  code: string;
  value: string;
  description?: string;
  subGroupCode?: string;
  sortOrder?: number;
}
