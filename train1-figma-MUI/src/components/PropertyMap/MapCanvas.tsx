import { useCallback, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import CanvasMarkerLayer from './CanvasMarkerLayer';
import PropertyPopup from './PropertyPopup';
import type { Property, PropertyType } from '../../types/property';
import { PALETTE, BORDER_RADIUS } from '../../theme';
import { convertPercentToLatLng, IMAGE_WIDTH, IMAGE_HEIGHT } from '../../utils/mapUtils';

const ITEMS_PER_PAGE = 20;

interface MapCanvasProps {
  properties: Property[];
  activeFilters: PropertyType[];
  selectedId: string | null;
  onSelectProperty: (id: string | null) => void;
}

const StyledMapContainer = styled(MapContainer)({
  width: '100%',
  height: '100%',
  touchAction: 'none',
});

const MapCanvas = ({
  properties,
  activeFilters,
  selectedId,
  onSelectProperty,
}: MapCanvasProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const filteredProperties = useMemo(
    () => properties.filter((p) => activeFilters.includes(p.type)),
    [properties, activeFilters],
  );

  // Sort: hot first, then alphabetical by code
  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties];
    sorted.sort((a, b) => {
      if (a.isHot !== b.isHot) return a.isHot ? -1 : 1;
      return a.code.localeCompare(b.code);
    });
    return sorted;
  }, [filteredProperties]);

  // Pagination
  const [rawPage, setRawPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(sortedProperties.length / ITEMS_PER_PAGE));
  // Clamp page to valid range whenever data changes
  const currentPage = Math.min(rawPage, totalPages - 1);

  const paginatedProperties = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    return sortedProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProperties, currentPage]);

  // Pagination info for display
  const rangeStart = sortedProperties.length === 0 ? 0 : currentPage * ITEMS_PER_PAGE + 1;
  const rangeEnd = Math.min((currentPage + 1) * ITEMS_PER_PAGE, sortedProperties.length);
  const total = sortedProperties.length;

  const handlePrevPage = useCallback(() => {
    setRawPage((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setRawPage((prev) => Math.min(totalPages - 1, prev + 1));
  }, [totalPages]);

  const selectedProperty = properties.find((p) => p.id === selectedId) ?? null;

  const handleMarkerClick = useCallback(
    (id: string | null) => {
      onSelectProperty(id);
    },
    [onSelectProperty],
  );

  const handleClickAway = useCallback(() => {
    onSelectProperty(null);
  }, [onSelectProperty]);

  const handleDrawerClose = useCallback(() => {
    onSelectProperty(null);
  }, [onSelectProperty]);

  // Define bounds for Map (Scale factor is 16 because max zoom is 4)
  const SCALE_FACTOR = 16;
  const bounds: L.LatLngBoundsExpression = [
    [-IMAGE_HEIGHT / SCALE_FACTOR, 0], // Bottom-Left (but lat is negative)
    [0, IMAGE_WIDTH / SCALE_FACTOR],   // Top-Right (origin is at top-left [0,0])
  ];

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        sx={{
          width: '100%',
          height: { xs: '60vh', md: '700px' },
          borderRadius: { xs: 0, md: '16px' },
          border: { xs: 'none', md: `1px solid ${PALETTE.BACKGROUND_PAPER}` },
          boxShadow: { xs: 'none', md: `0px 4px 10px ${PALETTE.SHADOW_LIGHT}` },
          overflow: 'hidden',
          backgroundColor: PALETTE.GREY_LIGHT,
          position: 'relative',
          touchAction: 'none',
          // Ensure Leaflet map takes full height and width
          '& .leaflet-container': {
            width: '100%',
            height: '100%',
            backgroundColor: PALETTE.GREY_LIGHT,
            touchAction: 'none !important',
          }
        }}
      >
        <GlobalStyles
          styles={{
            '.custom-leaflet-popup .leaflet-popup-content-wrapper': {
              background: 'transparent',
              boxShadow: 'none',
              padding: 0,
            },
            '.custom-leaflet-popup .leaflet-popup-content': {
              margin: 0,
            },
            '.custom-leaflet-popup .leaflet-popup-tip-container': {
              display: 'none', // We render our own arrow inside PropertyPopup
            },
            '.custom-leaflet-popup a.leaflet-popup-close-button': {
              display: 'none', // Hide default close button
            },
            '.leaflet-container': {
              touchAction: 'none !important',
            },
          }}
        />

        <StyledMapContainer
          crs={L.CRS.Simple}
          bounds={bounds}
          maxBounds={bounds}
          minZoom={0}
          maxZoom={4}
          zoomControl={true}
          attributionControl={false}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="/tiles/{z}/{y}/{x}.png"
            noWrap={true}
            bounds={bounds}
          />

          <CanvasMarkerLayer 
            properties={paginatedProperties}
            selectedId={selectedId}
            onSelectProperty={handleMarkerClick}
          />

          {/* Render Popup inside Leaflet if not on Mobile */}
          {!isMobile && selectedProperty && (
            <Popup
              position={convertPercentToLatLng(selectedProperty.position.x, selectedProperty.position.y)}
              className="custom-leaflet-popup"
              autoPanPadding={[50, 50]}
              closeButton={false}
              closeOnClick={false}
              offset={[0, -25]} // Offset so it doesn't overlap the marker
            >
              <PropertyPopup property={selectedProperty} />
            </Popup>
          )}
        </StyledMapContainer>

        {/* Pagination Overlay */}
        {totalPages > 1 && (
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
              onClick={handlePrevPage}
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
              onClick={handleNextPage}
              disabled={currentPage >= totalPages - 1}
              sx={{
                color: PALETTE.PRIMARY,
                '&.Mui-disabled': { color: PALETTE.TEXT_HINT },
              }}
            >
              <ChevronRight size={18} />
            </IconButton>
          </Stack>
        )}

        {/* Mobile Drawer Popup */}
        {isMobile && selectedProperty && (
          <Drawer
            anchor="bottom"
            open={!!selectedProperty}
            onClose={handleDrawerClose}
            slotProps={{
              paper: {
                sx: {
                  borderRadius: '16px 16px 0 0',
                  maxHeight: '50vh',
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                },
              },
            }}
          >
            <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto' }}>
              <PropertyPopup property={selectedProperty} />
            </Box>
          </Drawer>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default MapCanvas;
