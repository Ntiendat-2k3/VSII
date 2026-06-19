export const PROPERTY_MAP_ENDPOINTS = {
  MAP_GET: '/portal/map/get',
  MAP_SEARCH: '/portal/map/search',
  MAP_GET_CODES: '/portal/map/get-codes',
  UNIT_INQUIRY_CREATE: '/portal/units-inquiry/create',
  MASTER_DATA_LIST: '/master-data/list',
} as const;

export type PropertyMapEndpoint = typeof PROPERTY_MAP_ENDPOINTS[keyof typeof PROPERTY_MAP_ENDPOINTS];
