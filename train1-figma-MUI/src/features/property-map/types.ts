import type { MapType, UnitStatus, InquiryStatus } from '../../constants/map';

export type { MapType };

/* ===== Unit Types ===== */

export type UnitStatusCode = UnitStatus | null;

export type InquiryStatusCode = InquiryStatus;

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



export interface UnitItem {
  id?: number;
  unitCode: string;
  isHot?: boolean;
  unitTypeCode?: string;
  areaLand?: number;
  areaBuilding?: number;
  basePrice?: number;
  loanPrice?: number;
  statusCode: UnitStatusCode;
  inquiryStatusCode?: InquiryStatusCode | null;
  rotation?: number;
  pageWidth?: number;
  pageHeight?: number;
  x?: number;
  y?: number;
  dpi?: number;
  xPixel?: number;
  yPixel?: number;
}

/* ===== Inquiry Types ===== */

export interface UnitInquiryCreateRequest {
  projectId: number;
  unitCode: string;
}

export interface InquiryCreateResponse {
  success: boolean;
  status: InquiryStatusCode;
}


