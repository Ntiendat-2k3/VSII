export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
} as const;

export type AuthEndpoint = typeof AUTH_ENDPOINTS[keyof typeof AUTH_ENDPOINTS];
