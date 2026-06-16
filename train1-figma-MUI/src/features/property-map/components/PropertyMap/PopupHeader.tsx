import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Flame } from 'lucide-react';
import { PALETTE, BORDER_RADIUS } from '../../../../theme';

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
        p: isHotTheme ? '8px 12px' : '6px 8px',
        backgroundColor: isHotTheme ? 'transparent' : PALETTE.PRIMARY_LIGHT_BG,
        border: isHotTheme ? 'none' : `1px solid ${PALETTE.PRIMARY}`,
        borderRadius: isHotTheme ? 0 : `${BORDER_RADIUS.SMALL}px`,
        width: isHotTheme ? '100%' : 'auto',
      }}
    >
      {isHotTheme && <Flame size={16} color={PALETTE.SURFACE_LIGHT} />}
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
