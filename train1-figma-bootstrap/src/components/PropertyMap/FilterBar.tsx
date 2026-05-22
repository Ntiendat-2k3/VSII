import { useCallback } from 'react';
import { SquareCheck, Square, Flame } from 'lucide-react';
import type { PropertyType } from '../../types/property';
import { PROPERTY_TYPE_LABELS } from '../../types/property';
import { PALETTE } from '../../theme';

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
    <div className="d-flex flex-wrap align-items-center justify-content-start justify-content-md-center gap-2 pb-1 pb-md-0">
      {/* HOT filter chip */}
      <button
        type="button"
        className={`filter-chip filter-chip--hot ${showHotOnly ? 'active' : ''}`}
        onClick={onToggleHot}
      >
        <span className="filter-chip-checkbox">
          {showHotOnly
            ? <SquareCheck size={18} color={PALETTE.SURFACE_LIGHT} />
            : <Square size={18} color={PALETTE.SURFACE_LIGHT} />
          }
        </span>
        <span className="d-flex align-items-center gap-1">
          <span className="filter-chip-label">Căn HOT</span>
          <Flame size={16} color={PALETTE.SURFACE_LIGHT} />
        </span>
      </button>

      {/* Type filter chips */}
      {ALL_TYPES.map((type) => {
        const isActive = activeFilters.includes(type);

        return (
          <button
            key={type}
            type="button"
            className={`filter-chip filter-chip--type ${isActive ? 'active' : ''}`}
            onClick={handleToggle(type)}
          >
            <span className="filter-chip-checkbox">
              {isActive
                ? <SquareCheck size={18} color={PALETTE.SURFACE_LIGHT} />
                : <Square size={18} color={PALETTE.TEXT_SECONDARY} />
              }
            </span>
            <span className="filter-chip-label">
              {PROPERTY_TYPE_LABELS[type]}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
