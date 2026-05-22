import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { PALETTE } from '../../theme';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
}

// We can extend this with a reset function
interface ExtendedMapControlsProps extends MapControlsProps {
  onReset: () => void;
}

const MapControls = ({ onZoomIn, onZoomOut, onReset }: ExtendedMapControlsProps) => {
  return (
    <Stack
      spacing={1}
      sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 30,
      }}
    >
      <IconButton
        onClick={onZoomIn}
        aria-label="Phóng to"
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 1,
          '&:hover': { bgcolor: PALETTE.HOVER_LIGHT },
        }}
      >
        <ZoomIn size={20} color={PALETTE.TEXT_PRIMARY} />
      </IconButton>
      <IconButton
        onClick={onZoomOut}
        aria-label="Thu nhỏ"
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 1,
          '&:hover': { bgcolor: PALETTE.HOVER_LIGHT },
        }}
      >
        <ZoomOut size={20} color={PALETTE.TEXT_PRIMARY} />
      </IconButton>
      <IconButton
        onClick={onReset}
        aria-label="Đặt lại vị trí"
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 1,
          '&:hover': { bgcolor: PALETTE.HOVER_LIGHT },
        }}
      >
        <RotateCcw size={20} color={PALETTE.TEXT_PRIMARY} />
      </IconButton>
    </Stack>
  );
};

export default MapControls;
