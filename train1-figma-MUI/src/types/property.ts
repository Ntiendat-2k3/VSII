export type PropertyStatus = 'available' | 'sold' | 'contact' | 'contacting';

export type PropertyType =
  | 'don-lap'
  | 'song-lap'
  | 'tu-lap'
  | 'lien-ke'
  | 'shophouse';

export interface PropertyPosition {
  x: number;
  y: number;
}

export interface Property {
  id: string;
  code: string;
  isHot: boolean;
  type: PropertyType;
  area: number;
  listedPrice: number;
  loanPrice: number;
  status: PropertyStatus;
  position: PropertyPosition;
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  'don-lap': 'Đơn lập',
  'song-lap': 'Song lập',
  'tu-lap': 'Tứ lập',
  'lien-ke': 'Liền kề',
  'shophouse': 'Shophouse',
} as const;

