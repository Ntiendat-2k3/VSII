import { useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import { SquareCheck, Square, Flame } from 'lucide-react';
import type { PropertyType } from '../../types/property';
import { PROPERTY_TYPE_LABELS } from '../../types/property';
import { PALETTE, BORDER_RADIUS } from '../../theme';

const ALL_TYPES: PropertyType[] = [
  'don-lap',
  'song-lap',
  'tu-lap',
  'lien-ke',
  'shophouse',
];

interface FilterBarProps {
  activeFilters: PropertyType[];
  showHotOnly: boolean;
  onToggleFilter: (type: PropertyType) => void;
  onToggleHot: () => void;
}

const FilterBar = ({
  activeFilters,
  showHotOnly,
  onToggleFilter,
  onToggleHot,
}: FilterBarProps) => {
  const handleToggle = useCallback(
    (type: PropertyType) => () => {
      onToggleFilter(type);
    },
    [onToggleFilter],
  );

  return (
    <Stack
      direction="row"
      useFlexGap
      spacing={2}
      sx={{
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: { xs: 'flex-start', md: 'center' },
        pb: { xs: 1, md: 0 },
      }}
    >
      {/* HOT filter chip */}
      <Stack
        direction="row"
        spacing={1}
        onClick={onToggleHot}
        sx={{
          px: '16px',
          py: '8px',
          borderRadius: `${BORDER_RADIUS.PILL}px`,
          backgroundColor: showHotOnly ? PALETTE.ERROR : PALETTE.PRIMARY,
          cursor: 'pointer',
          flexShrink: 0,
          transition: 'all 0.2s ease',
          alignItems: 'center',
          '&:hover': {
            opacity: 0.9,
            transform: 'scale(1.02)',
          },
        }}
      >
        <Checkbox
          checked={showHotOnly}
          icon={<Square size={18} color={PALETTE.SURFACE_LIGHT} />}
          checkedIcon={<SquareCheck size={18} color={PALETTE.SURFACE_LIGHT} />}
          sx={{ p: 0 }}
        />
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '0.8125rem',
              color: PALETTE.SURFACE_LIGHT,
            }}
          >
            Căn HOT
          </Typography>
          <Flame size={16} color={PALETTE.SURFACE_LIGHT} />
        </Stack>
      </Stack>

      {/* Type filter chips */}
      {ALL_TYPES.map((type) => {
        const isActive = activeFilters.includes(type);

        return (
          <Stack
            key={type}
            direction="row"
            spacing={1}
            onClick={handleToggle(type)}
            sx={{
              px: '16px',
              py: '8px',
              borderRadius: `${BORDER_RADIUS.PILL}px`,
              backgroundColor: isActive
                ? PALETTE.PRIMARY
                : PALETTE.BACKGROUND_PAPER,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s ease',
              alignItems: 'center',
              '&:hover': {
                opacity: 0.9,
                transform: 'scale(1.02)',
              },
            }}
          >
            <Checkbox
              checked={isActive}
              icon={
                <Square size={18} color={PALETTE.TEXT_SECONDARY} />
              }
              checkedIcon={
                <SquareCheck size={18} color={PALETTE.SURFACE_LIGHT} />
              }
              sx={{ p: 0 }}
            />
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '0.8125rem',
                color: isActive
                  ? PALETTE.SURFACE_LIGHT
                  : PALETTE.TEXT_SECONDARY,
              }}
            >
              {PROPERTY_TYPE_LABELS[type]}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
};

export default FilterBar;
