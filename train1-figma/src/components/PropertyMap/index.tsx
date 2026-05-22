import { useState, useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import MapHeader from './MapHeader';
import FilterBar from './FilterBar';
import MapCanvas from './MapCanvas';
import type { PropertyType } from '../../types/property';
import { MOCK_PROPERTIES } from '../../data/mockData';

const ALL_TYPES: PropertyType[] = [
  'don-lap',
  'song-lap',
  'tu-lap',
  'lien-ke',
  'shophouse',
];

const PropertyMap = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<PropertyType[]>([...ALL_TYPES]);
  const [showHotOnly, setShowHotOnly] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleToggleFilter = useCallback((type: PropertyType) => {
    setActiveFilters((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type);
      }
      return [...prev, type];
    });
  }, []);

  const handleToggleHot = useCallback(() => {
    setShowHotOnly((prev) => !prev);
  }, []);

  const handleSelectProperty = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const filteredProperties = useMemo(() => {
    let result = MOCK_PROPERTIES;

    if (showHotOnly) {
      result = result.filter((p) => p.isHot);
    }

    if (searchValue.trim()) {
      const query = searchValue.trim().toLowerCase();
      result = result.filter((p) =>
        p.code.toLowerCase().includes(query),
      );
    }

    return result;
  }, [showHotOnly, searchValue]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
      <Box sx={{ px: { xs: 1.5, md: 0 } }}>
        <MapHeader
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
        />
      </Box>
      <Box sx={{ px: { xs: 1.5, md: 0 } }}>
        <FilterBar
          activeFilters={activeFilters}
          showHotOnly={showHotOnly}
          onToggleFilter={handleToggleFilter}
          onToggleHot={handleToggleHot}
        />
      </Box>
      <MapCanvas
        properties={filteredProperties}
        activeFilters={activeFilters}
        selectedId={selectedId}
        onSelectProperty={handleSelectProperty}
      />
    </Box>
  );
};

export default PropertyMap;
