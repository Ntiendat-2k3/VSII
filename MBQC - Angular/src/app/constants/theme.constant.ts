export const PALETTE = {
  PRIMARY: '#2A52BE',
  PRIMARY_LIGHT: 'rgba(42, 82, 190, 0.2)',
  PRIMARY_LIGHT_BG: '#E8EFFF',
  SECONDARY: '#00B4D8',
  ERROR: '#FF383C',
  ERROR_LIGHT: 'rgba(255, 56, 60, 0.2)',
  TEXT_PRIMARY: '#38393D',
  TEXT_SECONDARY: '#595A60',
  TEXT_DISABLED: '#7C7D84',
  TEXT_HINT: '#A2A3A8',
  BACKGROUND_DEFAULT: '#FFFFFF',
  BACKGROUND_PAPER: '#F0F1F1',
  BORDER: '#C9CACC',
  ACCENT_BORDER: '#BFC7F8',
  SURFACE_LIGHT: '#EEF0FD',
  ACCENT_GREEN: '#00C8B3',
  GREY_LIGHT: '#EAEAEA',
  HOVER_LIGHT: '#F5F5F5',
  WHITE: '#FFFFFF',
  WHITE_ALPHA_10: 'rgba(255, 255, 255, 0.1)',
  WHITE_ALPHA_30: 'rgba(255, 255, 255, 0.3)',
  SHADOW_LIGHT: 'rgba(0, 0, 0, 0.1)',
} as const;

export const GRADIENT = {
  PRIMARY: 'linear-gradient(90deg, rgba(42, 82, 190, 1) 0%, rgba(0, 180, 216, 1) 100%)',
  DIVIDER: 'linear-gradient(90deg, rgba(42, 82, 190, 0) 0%, rgba(42, 82, 190, 0.5) 50%, rgba(42, 82, 190, 0) 100%)',
} as const;

export const BORDER_RADIUS = {
  SMALL: 6,
  MEDIUM: 8,
  LARGE: 16,
  PILL: 100,
} as const;

export const SHADOW = {
  POPUP: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
  HEADER: '0px 2px 8px 0px rgba(42, 82, 190, 0.2)',
} as const;
