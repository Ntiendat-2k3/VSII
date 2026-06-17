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

export const BACKEND_UNIT_TYPE = {
  TOWNHOUSE: 'TOWNHOUSE',
  SEMI_DETACHED: 'SEMI_DETACHED',
  DETACHED: 'DETACHED',
  QUADRANGLE: 'QUADRANGLE',
  TU_LAP: 'TU_LAP',
  SHOPHOUSE: 'SHOPHOUSE',
} as const;

export type BackendUnitType = typeof BACKEND_UNIT_TYPE[keyof typeof BACKEND_UNIT_TYPE];

export const FilterType = {
  HOT: 'HOT',
  DON_LAP: 'DON_LAP',
  SONG_LAP: 'SONG_LAP',
  TU_LAP: 'TU_LAP',
  LIEN_KE: 'LIEN_KE',
  SHOPHOUSE: 'SHOPHOUSE',
} as const;

export type FilterType = typeof FilterType[keyof typeof FilterType];

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  PENDING: 'Admin sẽ liên hệ sớm nhất',
  COMPLETED: 'Admin đã gửi thông tin',
  REJECTED: 'Admin từ chối yêu cầu',
  EXPIRE: 'Hết hạn',
} as const;

export const UNIT_TYPE_LABELS: Record<string, string> = {
  DON_LAP: 'Đơn lập',
  DETACHED: 'Đơn lập',
  SONG_LAP: 'Song lập',
  SEMI_DETACHED: 'Song lập',
  TU_LAP: 'Tứ lập',
  QUADRANGLE: 'Tứ lập',
  LIEN_KE: 'Liền kề',
  TOWNHOUSE: 'Liền kề',
  SHOPHOUSE: 'Shophouse',
} as const;

export const UNIT_TYPE_ICONS: Record<string, string> = {
  DON_LAP: '/icon_type/donlap.png',
  DETACHED: '/icon_type/donlap.png',
  SONG_LAP: '/icon_type/songlap.png',
  SEMI_DETACHED: '/icon_type/songlap.png',
  TU_LAP: '/icon_type/tulap.png',
  QUADRANGLE: '/icon_type/tulap.png',
  LIEN_KE: '/icon_type/lienke.png',
  TOWNHOUSE: '/icon_type/lienke.png',
  SHOPHOUSE: '/icon_type/shophouse.png',
} as const;


