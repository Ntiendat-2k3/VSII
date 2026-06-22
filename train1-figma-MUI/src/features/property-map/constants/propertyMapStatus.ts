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

export type FilterType = string;

/**
 * Dynamic helper to map any unit type code from backend to its local icon asset path.
 * Matches keywords to support both Vietnamese and English backend values dynamically.
 */
export const getUnitTypeIcon = (code: string | undefined): string => {
  if (!code) return '/icon_type/donlap.png';
  const c = code.toUpperCase();
  if (c === 'HOT') return '/icon_type/hot.png';
  if (c.includes('DON_LAP') || c.includes('DETACHED')) return '/icon_type/donlap.png';
  if (c.includes('SONG_LAP') || c.includes('SEMI_DETACHED')) return '/icon_type/songlap.png';
  if (c.includes('TU_LAP') || c.includes('QUADRANGLE') || c.includes('QUADRUPLEX')) return '/icon_type/tulap.png';
  if (c.includes('LIEN_KE') || c.includes('TOWNHOUSE')) return '/icon_type/lienke.png';
  if (c.includes('SHOPHOUSE')) return '/icon_type/shophouse.png';
  return '/icon_type/donlap.png'; // fallback icon
};

