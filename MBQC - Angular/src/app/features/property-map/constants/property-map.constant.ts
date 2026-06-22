export const MAP_TYPE = {
  PROJECT: 'PROJECT',
  PHASE: 'PHASE',
  FLOOR: 'FLOOR',
} as const;

export type MapType = typeof MAP_TYPE[keyof typeof MAP_TYPE];

export const UNIT_STATUS = {
  AVAILABLE: 'AVAILABLE',
  SOLD: 'SOLD',
} as const;

export type UnitStatus = typeof UNIT_STATUS[keyof typeof UNIT_STATUS];

export type InquiryStatus = 'PENDING' | 'COMPLETED' | 'REJECTED' | 'EXPIRE';

export const HOT_FILTER = 'HOT';

export const UNIT_TYPE_ICONS: Record<string, string> = {
  DETACHED: '/icon_type/donlap.png',
  SEMI_DETACHED: '/icon_type/songlap.png',
  QUADRUPLEX: '/icon_type/tulap.png',
  TOWNHOUSE: '/icon_type/lienke.png',
  SHOPHOUSE: '/icon_type/shophouse.png',
  HOT: '/icon_type/hot.png',
} as const;
