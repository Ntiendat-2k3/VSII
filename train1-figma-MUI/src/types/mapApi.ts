import type { PropertyType } from './property';

/* ===== Enum-like constants ===== */

export type UnitStatusCode = 'AVAILABLE' | 'SOLD' | null;

export type InquiryStatusCode = 'PENDING' | 'COMPLETED' | 'REJECTED' | 'EXPIRE';

export const INQUIRY_STATUS_LABELS: Record<InquiryStatusCode, string> = {
  PENDING: 'Chờ Admin liên hệ',
  COMPLETED: 'Admin đã gửi thông tin',
  REJECTED: 'Admin từ chối yêu cầu',
  EXPIRE: 'Hết hạn',
} as const;

/* ===== API Responses ===== */

export interface TileConfig {
  rotation: number;
  pageWidth: number;
  pageHeight: number;
  dpi: number;
  maxZoomLevel: string;
}

export interface PropertyUnit {
  id: string;
  code: string;
  isHot: boolean;
  type: PropertyType;
  area: number;
  /** Giá gốc (VNĐ) */
  listedPrice: number;
  /** Giá vay (VNĐ), có thể không có */
  loanPrice?: number;
  statusCode: UnitStatusCode;
  inquiryStatusCode?: InquiryStatusCode | null;
  position: {
    x: number;
    y: number;
    xPixel?: number;
    yPixel?: number;
  };
}

export interface SearchUnitResponse {
  statusCode: UnitStatusCode;
  inquiryStatusCode?: InquiryStatusCode | null;
  rotation: number;
  pageWidth: number;
  pageHeight: number;
  x: number;
  y: number;
  dpi: number;
  xPixel: number;
  yPixel: number;
  unitDetails: PropertyUnit;
}

export interface InquiryResponse {
  success: boolean;
  status: InquiryStatusCode;
}
