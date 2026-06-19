export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

export const API_ERROR_CODES = {
  INVALID_TOKEN: 'INVALID_TOKEN',
} as const;

export type ApiErrorCode = typeof API_ERROR_CODES[keyof typeof API_ERROR_CODES];
