import { useState, useCallback, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Lock } from 'lucide-react';
import MapHeader from './MapHeader';
import FilterBar from './FilterBar';
import MapCanvas from './MapCanvas';
import type { PropertyType } from '../../types/property';
import type { PropertyUnit } from '../../types/mapApi';
import { mapService } from '../../services/mapService';
import { showToast } from '../../utils/toast';
import { PALETTE, GRADIENT, BORDER_RADIUS, SHADOW } from '../../theme';

const ALL_TYPES: PropertyType[] = [
  'don-lap',
  'song-lap',
  'tu-lap',
  'lien-ke',
  'shophouse',
];

const PROJECT_ID = 'project-mock-001';

const PropertyMap = () => {
  /* ── Auth State (Mock) ── */
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ── Data State ── */
  const [properties, setProperties] = useState<PropertyUnit[]>([]);
  const [loading, setLoading] = useState(false);

  /* ── UI State ── */
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<PropertyType[]>([...ALL_TYPES]);
  const [showHotOnly, setShowHotOnly] = useState(false);
  const [focusTarget, setFocusTarget] = useState<{ x: number; y: number } | null>(null);

  /* ── Fetch data khi đăng nhập thành công ── */
  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await mapService.searchProperties(PROJECT_ID);
        if (!cancelled) {
          setProperties(data);
        }
      } catch {
        if (!cancelled) {
          showToast.error('Không thể tải dữ liệu quỹ căn. Vui lòng thử lại.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  /* ── Handlers ── */
  const handleLogin = useCallback(() => {
    setIsLoggedIn(true);
    showToast.success('Đăng nhập thành công!');
  }, []);

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

  const handleSelectUnit = useCallback(async (unitCode: string) => {
    try {
      const result = await mapService.searchUnitDetails(PROJECT_ID, unitCode);
      if (!result) {
        showToast.info('Không tìm thấy thông tin căn này.');
        return;
      }

      // Focus bản đồ đến tọa độ căn
      setFocusTarget({ x: result.x, y: result.y });

      // Tìm và chọn căn trong danh sách hiện tại
      const matched = properties.find(
        (p) => p.code.toUpperCase() === unitCode.toUpperCase(),
      );
      if (matched) {
        setSelectedId(matched.id);
      }
    } catch {
      showToast.error('Lỗi khi tìm kiếm căn. Vui lòng thử lại.');
    }
  }, [properties]);

  const filteredProperties = useMemo(() => {
    let result = properties;

    if (showHotOnly) {
      result = result.filter((p) => p.isHot);
    }

    return result;
  }, [properties, showHotOnly]);

  return (
    <Stack spacing={{ xs: 2, md: 3 }} sx={{ width: '100%' }}>
      <Box sx={{ px: { xs: 1.5, md: 0 } }}>
        <MapHeader
          projectId={PROJECT_ID}
          onSelectUnit={handleSelectUnit}
        />
      </Box>

      {isLoggedIn && (
        <Box sx={{ px: { xs: 1.5, md: 0 } }}>
          <FilterBar
            activeFilters={activeFilters}
            showHotOnly={showHotOnly}
            onToggleFilter={handleToggleFilter}
            onToggleHot={handleToggleHot}
          />
        </Box>
      )}

      {/* Map wrapper with login gate overlay */}
      <Box sx={{ position: 'relative' }}>
        {/* Loading spinner overlay */}
        {isLoggedIn && loading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 600,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(2px)',
              borderRadius: { xs: 0, md: '16px' },
            }}
          >
            <CircularProgress size={40} sx={{ color: PALETTE.PRIMARY }} />
          </Box>
        )}

        {/* Login gate overlay */}
        {!isLoggedIn && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 600,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              borderRadius: { xs: 0, md: '16px' },
            }}
          >
            <Stack
              spacing={2.5}
              sx={{
                alignItems: 'center',
                p: 4,
                borderRadius: `${BORDER_RADIUS.LARGE}px`,
                backgroundColor: 'rgba(255, 255, 255, 0.92)',
                boxShadow: SHADOW.POPUP,
                maxWidth: 360,
                width: '90%',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: GRADIENT.PRIMARY,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Lock size={28} color={PALETTE.WHITE} />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  color: PALETTE.TEXT_PRIMARY,
                  textAlign: 'center',
                }}
              >
                Yêu cầu đăng nhập
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: PALETTE.TEXT_SECONDARY,
                  textAlign: 'center',
                }}
              >
                Vui lòng đăng nhập để xem thông tin mặt bằng quỹ căn dự án.
              </Typography>

              <Button
                id="mock-login-button"
                fullWidth
                variant="contained"
                onClick={handleLogin}
                sx={{
                  background: GRADIENT.PRIMARY,
                  color: PALETTE.WHITE,
                  py: 1.25,
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': {
                    background: GRADIENT.PRIMARY,
                    opacity: 0.9,
                    boxShadow: 'none',
                  },
                }}
              >
                Đăng nhập (Giả lập)
              </Button>
            </Stack>
          </Box>
        )}

        <MapCanvas
          properties={filteredProperties}
          activeFilters={activeFilters}
          selectedId={selectedId}
          onSelectProperty={handleSelectProperty}
          focusTarget={focusTarget}
          projectId={PROJECT_ID}
        />
      </Box>
    </Stack>
  );
};

export default PropertyMap;
