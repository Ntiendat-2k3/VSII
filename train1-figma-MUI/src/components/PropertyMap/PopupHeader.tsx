import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PALETTE, BORDER_RADIUS } from '../../theme';

interface PopupHeaderProps {
  code: string;
  isHot: boolean;
}

const PopupHeader = ({ code, isHot }: PopupHeaderProps) => {
  const isHotTheme = isHot;

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        p: '12px 8px',
        backgroundColor: isHotTheme ? PALETTE.ERROR : PALETTE.SURFACE_LIGHT,
        border: isHotTheme ? 'none' : `1px solid ${PALETTE.ACCENT_BORDER}`,
        borderRadius: `${BORDER_RADIUS.SMALL}px`,
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '0.9375rem',
          color: isHotTheme ? PALETTE.SURFACE_LIGHT : PALETTE.PRIMARY,
        }}
      >
        {code}
      </Typography>
    </Stack>
  );
};

export default PopupHeader;
