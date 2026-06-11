import { useCallback, useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { MapContainer, TileLayer, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import CanvasMarkerLayer from './CanvasMarkerLayer';
import PropertyPopup from './PropertyPopup';
import FlyToHandler from './FlyToHandler';
import MapPagination from './MapPagination';
import type { UnitItem } from '../../features/property-map/types';
import { PALETTE } from '../../theme';
import { convertPercentToLatLng, convertPdfCoorsToLatLng, IMAGE_WIDTH, IMAGE_HEIGHT } from '../../utils/mapUtils';
import { useAppSelector } from '../../store';
import { CONFIG } from '../../constants/config';

const ITEMS_PER_PAGE = CONFIG.PAGE_SIZE;

interface MapCanvasProps {
  properties: UnitItem[];
  selectedId: string | null;
  onSelectProperty: (id: string | null) => void;
  focusTarget: { x: number; y: number } | null;
  projectId: number;
}

const StyledMapContainer = styled(MapContainer)({
  width: '100%',
  height: '100%',
  touchAction: 'none',
});

const MapCanvas = ({
  properties,
  selectedId,
  onSelectProperty,
  focusTarget,
  projectId,
}: MapCanvasProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Wait, filtering is done at Redux level now in matBangSlice, 
  // but if we pass filteredProperties from Redux, we don't need to filter here again.
  // Actually, we'll keep it simple: index.tsx passes down filtered properties directly, 
  // so we can just use `properties` instead of `filteredProperties`.
  const filteredProperties = properties;

  // Sort: hot first, then alphabetical by code
  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties];
    sorted.sort((a, b) => {
      if (a.isHot !== b.isHot) return a.isHot ? -1 : 1;
      return (a.unitCode || '').localeCompare(b.unitCode || '');
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

  const selectedProperty = properties.find((p) => String(p.id || p.unitCode) === selectedId) ?? null;

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

  // Select mapData from Redux to configure bounds and tile layer
  const mapData = useAppSelector((state) => state.propertyMap.mapData);

  const { width, height, maxZoom } = useMemo(() => {
    if (!mapData) {
      return { width: IMAGE_WIDTH, height: IMAGE_HEIGHT, maxZoom: 4 };
    }
    const w = mapData.width || Math.round((mapData.pageWidth || 0) * ((mapData.dpi || 72) / 72));
    const h = mapData.height || Math.round((mapData.pageHeight || 0) * ((mapData.dpi || 72) / 72));
    const z = mapData.totalTiles || Math.ceil(Math.log2(Math.max(w, h || 1)));
    return { width: w, height: h, maxZoom: z };
  }, [mapData]);

  const bounds = useMemo(() => {
    const scaleFactor = Math.pow(2, maxZoom);
    return [
      [-height / scaleFactor, 0],
      [0, width / scaleFactor],
    ] as L.LatLngBoundsExpression;
  }, [width, height, maxZoom]);

  const tileUrlTemplate = useMemo(() => {
    if (!mapData || !mapData.dziKey) return '/tiles/{z}/{y}/{x}.png';
    const baseUrl = mapData.dziKey.replace(/\.dzi$/, '');
    const format = mapData.tileFormat || 'jpg';
    return `${baseUrl}_files/{z}/{x}_{y}.${format}`;
  }, [mapData]);

  const center = useMemo(() => {
    const scaleFactor = Math.pow(2, maxZoom);
    return [-height / (2 * scaleFactor), width / (2 * scaleFactor)] as L.LatLngTuple;
  }, [width, height, maxZoom]);

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
            '.custom-leaflet-popup .leaflet-popup-content p': {
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
          key={`${projectId}-${width}-${height}`}
          crs={L.CRS.Simple}
          bounds={bounds}
          maxBounds={bounds}
          minZoom={Math.max(0, maxZoom - 7)}
          maxZoom={maxZoom}
          zoom={Math.max(0, maxZoom - 5)}
          center={center}
          zoomControl={true}
          attributionControl={false}
          scrollWheelZoom={true}
        >
          <TileLayer
            url={tileUrlTemplate}
            noWrap={true}
            bounds={bounds}
            updateWhenZooming={false}
            updateWhenIdle={true}
            keepBuffer={2}
          />

          <CanvasMarkerLayer
            properties={paginatedProperties}
            selectedId={selectedId}
            onSelectProperty={handleMarkerClick}
            mapWidth={width}
            mapHeight={height}
            mapMaxZoom={maxZoom}
          />

          {/* FlyTo handler for search-triggered focus */}
          <FlyToHandler target={focusTarget} maxZoom={maxZoom} mapData={mapData} />

          {/* Render Popup inside Leaflet if not on Mobile */}
          {!isMobile && selectedProperty && (
            <Popup
              position={
                mapData
                  ? convertPdfCoorsToLatLng(
                      selectedProperty.x || 0,
                      selectedProperty.y || 0,
                      selectedProperty.pageWidth,
                      selectedProperty.pageHeight,
                      width,
                      height,
                      mapData.pageWidth,
                      mapData.pageHeight,
                      maxZoom
                    )
                  : convertPercentToLatLng(selectedProperty.x || 0, selectedProperty.y || 0)
              }
              className="custom-leaflet-popup"
              autoPanPadding={[50, 50]}
              closeButton={false}
              closeOnClick={false}
              offset={[0, -25]} // Offset so it doesn't overlap the marker
            >
              <PropertyPopup property={selectedProperty} projectId={projectId} />
            </Popup>
          )}
        </StyledMapContainer>

        {/* Pagination Overlay */}
        <MapPagination
          currentPage={currentPage}
          totalPages={totalPages}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
          total={total}
          onPrevPage={handlePrevPage}
          onNextPage={handleNextPage}
        />

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
              <PropertyPopup property={selectedProperty} projectId={projectId} hideArrow={true} />
            </Box>
          </Drawer>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default MapCanvas;
