import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import MapHeader from './MapHeader';
import FilterBar from './FilterBar';
import MapCanvas from './MapCanvas';
import LoginForm, { type LoginFormData } from '../../features/property-map/components/LoginForm';
import { mapService } from '../../services/mapService';
import { apiClient } from '../../services/apiClient';
import { showToast } from '../../utils/toast';
import { PALETTE } from '../../theme';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchUnits, fetchMapData, setFocusUnit, forceShowUnit, clearSearchedUnit } from '../../store/slices/propertyMapSlice';
import { API_ENDPOINTS } from '../../services/endpoints';
import { CONFIG } from '../../constants/config';

const PROJECT_ID = CONFIG.DEFAULT_PROJECT_ID; // Real Project ID 7 from UAT has map data and 7 units

const PropertyMap = () => {
  const dispatch = useAppDispatch();
  
  /* ── Auth State ── */
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  /* ── Redux State ── */
  const { filteredUnits, isLoadingUnits, focusCoords } = useAppSelector((state) => state.propertyMap);

  /* ── UI State ── */
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /* ── Fetch data khi đăng nhập ── */
  useEffect(() => {
    if (!isLoggedIn) return;

    // Fetch map configurations
    dispatch(fetchMapData(PROJECT_ID))
      .unwrap()
      .catch(() => showToast.error('Không thể tải dữ liệu bản đồ. Vui lòng thử lại.'));
    
    // Fetch units (no keyword means fetch all)
    dispatch(fetchUnits({ projectId: PROJECT_ID }))
      .unwrap()
      .catch(() => {
        showToast.error('Không thể tải dữ liệu quỹ căn. Vui lòng thử lại.');
      });

  }, [dispatch, isLoggedIn]);

  /* ── Handlers ── */
  const handleLogin = useCallback(async (data: LoginFormData) => {
    setIsLoggingIn(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.LOGIN, data);
      // Giả sử backend trả về dạng { code: "SUCCESS", data: { accessToken: "..." } }
      const token = response.data?.accessToken;
      
      if (token) {
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        showToast.success('Đăng nhập thành công!');
      } else {
        showToast.error('Đăng nhập thất bại. Tài khoản hoặc mật khẩu không đúng.');
      }
    } catch {
      showToast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setIsLoggingIn(false);
    }
  }, []);

  const handleSelectProperty = useCallback((id: string | null) => {
    setSelectedId(id);
    if (!id) {
      dispatch(clearSearchedUnit());
    }
  }, [dispatch]);

  const handleSelectUnit = useCallback(async (unitCode: string) => {
    try {
      const result = await mapService.searchUnits(PROJECT_ID, unitCode);
      const exactUnit = result.find(u => u.unitCode.toUpperCase() === unitCode.toUpperCase());
      
      if (!exactUnit) {
        showToast.info('Không tìm thấy thông tin căn này.');
        return;
      }

      if (exactUnit.x != null && exactUnit.y != null) {
        dispatch(
          setFocusUnit({ 
            x: exactUnit.x || 0, 
            y: exactUnit.y || 0, 
            xPixel: exactUnit.xPixel,
            yPixel: exactUnit.yPixel,
            zoomLevel: 3,
            rotation: exactUnit.rotation,
            pageWidth: exactUnit.pageWidth,
            pageHeight: exactUnit.pageHeight
          })
        );
      }

      if (exactUnit.statusCode === 'AVAILABLE') {
        const isCurrentlyFiltered = !filteredUnits.find(u => String(u.unitCode) === unitCode);
        if (isCurrentlyFiltered) {
          dispatch(forceShowUnit(exactUnit));
        }
      }

      setSelectedId(String(exactUnit.id || exactUnit.unitCode));
    } catch {
      showToast.error('Lỗi khi tìm kiếm căn. Vui lòng thử lại.');
    }
  }, [dispatch, filteredUnits]);

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
          <FilterBar />
        </Box>
      )}

      {/* Map wrapper with login gate overlay */}
      <Box sx={{ position: 'relative' }}>
        {/* Loading spinner overlay */}
        {isLoggedIn && isLoadingUnits && (
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
            <LoginForm onLogin={handleLogin} isLoggingIn={isLoggingIn} />
          </Box>
        )}

        <MapCanvas
          properties={filteredUnits}
          selectedId={selectedId}
          onSelectProperty={handleSelectProperty}
          focusTarget={focusCoords}
          projectId={PROJECT_ID}
        />
      </Box>
    </Stack>
  );
};

export default PropertyMap;
