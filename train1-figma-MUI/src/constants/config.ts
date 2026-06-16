export const CONFIG = {
  API_TIMEOUT: 30000,
  DEFAULT_PROJECT_ID: 7,
  /** Số marker tối đa hiển thị cùng lúc trên viewport */
  MAX_MARKERS_VIEWPORT: 500,
  /** Phần trăm căn giá rẻ nhất được ưu tiên hiển thị ở LOD 2 */
  LOD_PRICE_PERCENTILE: 0.3,
} as const;
