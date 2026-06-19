import { createTheme } from '@mui/material/styles';
import { PALETTE, BORDER_RADIUS } from './tokens';

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

export { PALETTE, GRADIENT, BORDER_RADIUS, SHADOW } from './tokens';
export default theme;
