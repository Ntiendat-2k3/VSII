import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Maximize, Building } from 'lucide-react';
import type { PropertyType } from '../../types/property';
import { PROPERTY_TYPE_LABELS } from '../../types/property';
import { PALETTE } from '../../theme';

interface PopupDetailsProps {
  area: number;
  type: PropertyType;
}

const PopupDetails = ({ area, type }: PopupDetailsProps) => {
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'space-between',
        pt: '4px',
      }}
    >
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <Maximize size={16} color={PALETTE.TEXT_SECONDARY} />
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '0.8125rem',
            color: PALETTE.TEXT_PRIMARY,
          }}
        >
          {area}m²
        </Typography>
      </Stack>
      <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
        <Building size={16} color={PALETTE.TEXT_SECONDARY} />
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '0.8125rem',
            color: PALETTE.TEXT_SECONDARY,
          }}
        >
          {PROPERTY_TYPE_LABELS[type]}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default PopupDetails;
