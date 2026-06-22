import type { UnitStatus, InquiryStatus } from '../constants/property-map.constant';

export type UnitStatusCode = UnitStatus | null;
export type InquiryStatusCode = InquiryStatus;

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
  inquiryStatusName?: string;
  rotation?: number;
  pageWidth?: number;
  pageHeight?: number;
  x?: number;
  y?: number;
  dpi?: number;
  xPixel?: number;
  yPixel?: number;
}
