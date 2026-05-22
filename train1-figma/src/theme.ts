import { createTheme } from '@mui/material/styles';

const PALETTE = {
  PRIMARY: '#2A52BE',
  PRIMARY_LIGHT: 'rgba(42, 82, 190, 0.2)',
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
} as const;

const GRADIENT = {
  PRIMARY: 'linear-gradient(90deg, rgba(42, 82, 190, 1) 0%, rgba(0, 180, 216, 1) 100%)',
  DIVIDER: 'linear-gradient(90deg, rgba(42, 82, 190, 0) 0%, rgba(42, 82, 190, 0.5) 50%, rgba(42, 82, 190, 0) 100%)',
} as const;

const BORDER_RADIUS = {
  SMALL: 6,
  MEDIUM: 8,
  LARGE: 16,
  PILL: 100,
} as const;

const SHADOW = {
  POPUP: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
  HEADER: '0px 2px 8px 0px rgba(42, 82, 190, 0.2)',
} as const;

const theme = createTheme({
  palette: {
    primary: {
      main: PALETTE.PRIMARY,
      light: PALETTE.PRIMARY_LIGHT,
    },
    secondary: {
      main: PALETTE.SECONDARY,
    },
    error: {
      main: PALETTE.ERROR,
      light: PALETTE.ERROR_LIGHT,
    },
    text: {
      primary: PALETTE.TEXT_PRIMARY,
      secondary: PALETTE.TEXT_SECONDARY,
      disabled: PALETTE.TEXT_DISABLED,
    },
    background: {
      default: PALETTE.BACKGROUND_DEFAULT,
      paper: PALETTE.BACKGROUND_PAPER,
    },
    divider: PALETTE.BORDER,
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
      textTransform: 'uppercase',
    },
    h2: {
      fontWeight: 700,
      fontSize: '0.9375rem',
    },
    body1: {
      fontWeight: 500,
      fontSize: '1.0625rem',
    },
    body2: {
      fontWeight: 500,
      fontSize: '0.9375rem',
    },
    caption: {
      fontWeight: 500,
      fontSize: '0.8125rem',
    },
    subtitle2: {
      fontWeight: 500,
      fontSize: '0.6875rem',
    },
  },
  shape: {
    borderRadius: BORDER_RADIUS.MEDIUM,
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.PILL,
          fontFamily: '"Inter", sans-serif',
          fontWeight: 500,
          fontSize: '0.8125rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS.MEDIUM,
          fontFamily: '"Inter", sans-serif',
          fontWeight: 600,
          fontSize: '0.8125rem',
          textTransform: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: BORDER_RADIUS.MEDIUM,
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            fontSize: '0.9375rem',
            '& fieldset': {
              borderColor: PALETTE.BORDER,
            },
            '&:hover fieldset': {
              borderColor: PALETTE.PRIMARY,
            },
          },
        },
      },
    },
  },
});

export { PALETTE, GRADIENT, BORDER_RADIUS, SHADOW };
export default theme;
