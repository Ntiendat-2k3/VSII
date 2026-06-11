export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  MAP_GET: '/portal/map/get',
  MAP_SEARCH: '/portal/map/search',
  MAP_GET_CODES: '/portal/map/get-codes',
  UNIT_INQUIRY_CREATE: '/portal/units-inquiry/create',
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
