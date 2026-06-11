import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PALETTE, BORDER_RADIUS } from '../../theme';

interface MapPaginationProps {
  currentPage: number;
  totalPages: number;
  rangeStart: number;
  rangeEnd: number;
  total: number;
  onPrevPage: () => void;
  onNextPage: () => void;
}

const MapPagination = ({
  currentPage,
  totalPages,
  rangeStart,
  rangeEnd,
  total,
  onPrevPage,
  onNextPage,
}: MapPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 500,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(8px)',
        borderRadius: `${BORDER_RADIUS.MEDIUM}px`,
        border: `1px solid ${PALETTE.BORDER}`,
        boxShadow: `0px 2px 8px ${PALETTE.SHADOW_LIGHT}`,
        px: 1,
        py: 0.5,
      }}
    >
      <IconButton
        size="small"
        onClick={onPrevPage}
        disabled={currentPage === 0}
        sx={{
          color: PALETTE.PRIMARY,
          '&.Mui-disabled': { color: PALETTE.TEXT_HINT },
        }}
      >
        <ChevronLeft size={18} />
      </IconButton>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          color: PALETTE.TEXT_PRIMARY,
          minWidth: 70,
          textAlign: 'center',
          userSelect: 'none',
        }}
      >
        {rangeStart}–{rangeEnd} / {total}
      </Typography>
      <IconButton
        size="small"
        onClick={onNextPage}
        disabled={currentPage >= totalPages - 1}
        sx={{
          color: PALETTE.PRIMARY,
          '&.Mui-disabled': { color: PALETTE.TEXT_HINT },
        }}
      >
        <ChevronRight size={18} />
      </IconButton>
    </Stack>
  );
};

export default MapPagination;
