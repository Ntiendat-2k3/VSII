import { useCallback, memo } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AppCheckbox from '../ui/AppCheckbox';
import { Flame } from 'lucide-react';
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

interface FilterChipProps {
  type: PropertyType;
  isActive: boolean;
  onClick: (type: PropertyType) => void;
}

// 1. Optimized sub-component with React.memo to avoid recreating functions in rendering
const FilterChip = memo(({ type, isActive, onClick }: FilterChipProps) => {
  const handleClick = useCallback(() => {
    onClick(type);
  }, [type, onClick]);

  return (
    <Stack
      direction="row"
      spacing={1}
      onClick={handleClick}
      sx={{
        px: '16px',
        py: '8px',
        borderRadius: `${BORDER_RADIUS.PILL}px`,
        backgroundColor: isActive ? PALETTE.PRIMARY : PALETTE.BACKGROUND_PAPER,
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
      <AppCheckbox
        checked={isActive}
      />
      <Typography
        variant="caption"
        sx={{
          fontWeight: 500,
          color: isActive ? PALETTE.SURFACE_LIGHT : PALETTE.TEXT_SECONDARY,
        }}
      >
        {PROPERTY_TYPE_LABELS[type]}
      </Typography>
    </Stack>
  );
});

FilterChip.displayName = 'FilterChip';

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
          backgroundColor: showHotOnly ? PALETTE.ERROR : PALETTE.BACKGROUND_PAPER,
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
        <AppCheckbox
          checked={showHotOnly}
        />
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 500,
              color: showHotOnly ? PALETTE.SURFACE_LIGHT : PALETTE.TEXT_SECONDARY,
            }}
          >
            Căn HOT
          </Typography>
          <Flame size={16} color={showHotOnly ? PALETTE.SURFACE_LIGHT : PALETTE.ERROR} />
        </Stack>
      </Stack>

      {/* Type filter chips */}
      {ALL_TYPES.map((type) => (
        <FilterChip
          key={type}
          type={type}
          isActive={activeFilters.includes(type)}
          onClick={onToggleFilter}
        />
      ))}
    </Stack>
  );
};

export default FilterBar;
