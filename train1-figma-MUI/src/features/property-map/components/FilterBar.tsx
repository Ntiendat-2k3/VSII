import { useCallback, memo } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AppCheckbox from '@/components/ui/AppCheckbox';
import { FilterType, UNIT_TYPE_ICONS } from '../constants/propertyMapStatus';
import { useAppDispatch, useAppSelector } from '@/store';
import { setFilters } from '@/store/slices/property-map/propertyMapSlice';
import { PALETTE, BORDER_RADIUS } from '@/theme';

const NORMAL_FILTERS: FilterType[] = [
  FilterType.DON_LAP,
  FilterType.SONG_LAP,
  FilterType.TU_LAP,
  FilterType.LIEN_KE,
  FilterType.SHOPHOUSE,
];

interface FilterChipProps {
  type: FilterType;
  isActive: boolean;
  onClick: (type: FilterType) => void;
}

const FilterChip = memo(({ type, isActive, onClick }: FilterChipProps) => {
  const { unitTypes } = useAppSelector((state) => state.propertyMap.masterData);

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
      <AppCheckbox checked={isActive} />
      {type && (
        <Box
          component="img"
          src={UNIT_TYPE_ICONS[type]}
          alt={unitTypes[type] || type}
          sx={{
            width: 18,
            height: 18,
            objectFit: 'contain',
            filter: isActive ? 'brightness(0) invert(1)' : 'none',
            transition: 'filter 0.2s ease',
          }}
        />
      )}
      <Typography
        variant="caption"
        sx={{
          fontWeight: 500,
          color: isActive ? PALETTE.SURFACE_LIGHT : PALETTE.TEXT_SECONDARY,
        }}
      >
        {unitTypes[type] || type}
      </Typography>
    </Stack>
  );
});

FilterChip.displayName = 'FilterChip';

const FilterBar = () => {
  const dispatch = useAppDispatch();
  const activeFilters = useAppSelector((state) => state.propertyMap.filterTypes);

  const handleToggleFilter = useCallback(
    (type: FilterType) => {
      const newFilters = activeFilters.includes(type)
        ? activeFilters.filter((t) => t !== type)
        : [...activeFilters, type];
      dispatch(setFilters(newFilters));
    },
    [activeFilters, dispatch],
  );

  const isHotActive = activeFilters.includes(FilterType.HOT);

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
      <Stack
        direction="row"
        spacing={1}
        onClick={() => handleToggleFilter(FilterType.HOT)}
        sx={{
          px: '16px',
          py: '8px',
          borderRadius: `${BORDER_RADIUS.PILL}px`,
          backgroundColor: isHotActive ? PALETTE.ERROR : PALETTE.BACKGROUND_PAPER,
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
        <AppCheckbox checked={isHotActive} />
        <Box
          component="img"
          src="/icon_type/hot.png"
          alt="Căn HOT"
          sx={{
            width: 18,
            height: 18,
            objectFit: 'contain',
            filter: isHotActive ? 'brightness(0) invert(1)' : 'none',
            transition: 'filter 0.2s ease',
          }}
        />
        <Typography
          variant="caption"
          sx={{
            fontWeight: 500,
            color: isHotActive ? PALETTE.SURFACE_LIGHT : PALETTE.TEXT_SECONDARY,
          }}
        >
          Căn HOT
        </Typography>
      </Stack>

      {NORMAL_FILTERS.map((type) => (
        <FilterChip
          key={type}
          type={type}
          isActive={activeFilters.includes(type)}
          onClick={handleToggleFilter}
        />
      ))}
    </Stack>
  );
};

export default FilterBar;
