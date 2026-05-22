import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { PALETTE, BORDER_RADIUS } from '../../theme';

interface PopupHeaderProps {
  code: string;
  isHot: boolean;
}

const PopupHeader = ({ code, isHot }: PopupHeaderProps) => {
  if (isHot) {
    return (
      <Stack
        direction="row"
        spacing={0.5}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
          p: '12px 8px',
          backgroundColor: PALETTE.SURFACE_LIGHT,
          border: `1px solid ${PALETTE.ACCENT_BORDER}`,
          borderRadius: `${BORDER_RADIUS.SMALL}px`,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.9375rem',
            color: PALETTE.PRIMARY,
          }}
        >
          {code}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        p: '12px 8px',
        backgroundColor: PALETTE.ERROR,
        borderRadius: `${BORDER_RADIUS.SMALL}px`,
      }}
    >
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: '0.9375rem',
          color: PALETTE.SURFACE_LIGHT,
        }}
      >
        {code}
      </Typography>
    </Stack>
  );
};

export default PopupHeader;
