import { useCallback, useMemo } from 'react';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme, styled } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';
import { MapContainer, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import DziTileLayer from './DziTileLayer';
import LodMarkerBridge from './LodMarkerBridge';
import PropertyMarker from './PropertyMarker';
import FlyToHandler from './FlyToHandler';
import type { UnitItem } from '../types/PropertyMapModel';
import { PALETTE } from '../../../theme';
import { convertPercentToLatLng, convertPdfCoorsToLatLng, IMAGE_WIDTH, IMAGE_HEIGHT } from '../utils/mapUtils';
import { useAppSelector } from '../../../store';

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
  const filteredProperties = properties;

  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties];
    sorted.sort((a, b) => {
      if (a.isHot !== b.isHot) return a.isHot ? -1 : 1;
      return (a.unitCode || '').localeCompare(b.unitCode || '');
    });
    return sorted;
  }, [filteredProperties]);

  const selectedProperty = useMemo(() => 
    properties.find((p) => String(p.id || p.unitCode) === selectedId) ?? null,
    [properties, selectedId]
  );

  const handleMarkerClick = useCallback((id: string | null) => {
    onSelectProperty(id);
  }, [onSelectProperty]);

  const handleClickAway = useCallback(() => {
    onSelectProperty(null);
  }, [onSelectProperty]);

  const handleDrawerClose = useCallback(() => {
    onSelectProperty(null);
  }, [onSelectProperty]);

  const mapData = useAppSelector((state) => state.propertyMap.mapData);

  /**
   * Tính toán kích thước ảnh gốc (pixel) và DZI maxLevel.
   * DZI maxLevel = ceil(log2(max(width, height))).
   */
  const { imgWidth, imgHeight, dziMaxLevel, tileSize } = useMemo(() => {
    if (!mapData) {
      return { imgWidth: IMAGE_WIDTH, imgHeight: IMAGE_HEIGHT, dziMaxLevel: 4, tileSize: 256 };
    }

    // DZI tiles được sinh từ ảnh gốc → kích thước = pageWidth × dpiScale, pageHeight × dpiScale
    // Rotation là metadata hiển thị, KHÔNG ảnh hưởng đến kích thước DZI tiles
    const dpiScale = (mapData.dpi || 72) / 72;

    const fallbackW = Math.round((mapData.pageWidth || 0) * dpiScale);
    const fallbackH = Math.round((mapData.pageHeight || 0) * dpiScale);

    const w = mapData.width || fallbackW || IMAGE_WIDTH;
    const h = mapData.height || fallbackH || IMAGE_HEIGHT;
    const ts = mapData.tileSize || 256;
    const maxLvl = mapData.totalTiles ?? Math.ceil(Math.log2(Math.max(w, h, 1)));

    return { imgWidth: w, imgHeight: h, dziMaxLevel: maxLvl, tileSize: ts };
  }, [mapData]);

  /**
   * Approach: Leaflet zoom = DZI level trực tiếp.
   *
   * CRS.Simple ở zoom z: 1 map unit = 2^z pixels trên màn hình.
   * TileLayer ở zoom z: mỗi tile 256px cover 256/2^z map units.
   *
   * DZI ở level L: ảnh = imgWidth/2^(maxLevel-L) × imgHeight/2^(maxLevel-L) pixels,
   * chia thành tiles 256×256.
   * Tile (col, row) cover pixel [col*256..(col+1)*256] × [row*256..(row+1)*256].
   *
   * Để Leaflet zoom L map đúng tile DZI level L:
   * - Bounds cần scaled sao cho ở zoom = maxLevel, 1 tile = 256 map units (đúng 256px ảnh gốc).
   * - → Bounds = imgPixels / 2^maxLevel * (2^maxLevel / 256) ... 
   *
   * Cách đơn giản nhất: Bounds = [0, imgWidth/tileSize] × [0, imgHeight/tileSize]
   * tức mỗi map unit = 1 tile width/height.
   * Ở zoom z, mỗi tile = tileSize px = 1/(2^z) map units... không đúng.
   *
   * Cách chính xác: set bounds = [0..W] × [0..H] pixel gốc,
   * rồi override getTileUrl để convert (x, y, z) → DZI (col, row, level).
   */
  const bounds = useMemo(() => {
    return [
      [-imgHeight, 0],
      [0, imgWidth],
    ] as L.LatLngBoundsExpression;
  }, [imgWidth, imgHeight]);

  const tileUrlTemplate = useMemo(() => {
    if (!mapData || !mapData.dziKey) return '';
    const baseUrl = mapData.dziKey.replace(/\.dzi$/, '');
    const format = mapData.tileFormat || 'jpg';
    return `${baseUrl}_files/{z}/{x}_{y}.${format}`;
  }, [mapData]);

  /**
   * Zoom config cho CRS.Simple với bounds pixel gốc:
   * - Zoom 0: 1 map unit = 1 screen pixel → ảnh 70216px = 70216 screen px (quá to)
   * - Cần zoom âm để thu nhỏ: zoom = -log2(maxDim/viewportPx)
   * - fitZoom = zoom ban đầu vừa viewport
   * - maxZoom = 0 (full resolution 1:1)
   *
   * Leaflet TileLayer sẽ request tile {z} = leafletZoom + zoomOffset.
   * zoomOffset = dziMaxLevel để: DZI level = leafletZoom + dziMaxLevel.
   * VD: leafletZoom = -7 → DZI level = 10 ✓
   */
  const minZoom = useMemo(() => {
    const targetViewport = 700;
    const maxDim = Math.max(imgWidth, imgHeight);
    return -Math.ceil(Math.log2(maxDim / targetViewport));
  }, [imgWidth, imgHeight]);

  const fitZoom = minZoom;

  const center = useMemo(() => {
    return [-imgHeight / 2, imgWidth / 2] as L.LatLngTuple;
  }, [imgWidth, imgHeight]);

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
            '.custom-leaflet-popup .leaflet-popup-content': { margin: 0 },
            '.custom-leaflet-popup .leaflet-popup-content p': { margin: 0 },
            '.custom-leaflet-popup .leaflet-popup-tip-container': { display: 'none' },
            '.custom-leaflet-popup a.leaflet-popup-close-button': { display: 'none' },
            '.leaflet-container': { touchAction: 'none !important' },
          }}
        />

        <StyledMapContainer
          key={`${projectId}-${imgWidth}-${imgHeight}`}
          crs={L.CRS.Simple}
          bounds={bounds}
          maxBounds={bounds}
          minZoom={minZoom}
          maxZoom={0}
          zoom={fitZoom}
          center={center}
          zoomControl={true}
          attributionControl={false}
          scrollWheelZoom={true}
        >
          {tileUrlTemplate && (
            <DziTileLayer
              urlTemplate={tileUrlTemplate}
              dziMaxLevel={dziMaxLevel}
              tileSize={tileSize}
              bounds={bounds}
            />
          )}

          <LodMarkerBridge
            allProperties={sortedProperties}
            selectedId={selectedId}
            onSelectProperty={handleMarkerClick}
            mapWidth={imgWidth}
            mapHeight={imgHeight}
            mapMaxZoom={dziMaxLevel}
            mapScale={1}
          />

          <FlyToHandler target={focusTarget} maxZoom={0} mapData={mapData} mapScale={1} />

          {!isMobile && selectedProperty && (
            <Popup
              position={
                mapData
                  ? convertPdfCoorsToLatLng(
                    selectedProperty.x || 0,
                    selectedProperty.y || 0,
                    mapData.dpi,
                    selectedProperty.xPixel,
                    selectedProperty.yPixel,
                    1
                  )
                  : convertPercentToLatLng(selectedProperty.x || 0, selectedProperty.y || 0, imgWidth, imgHeight)
              }
              className="custom-leaflet-popup"
              autoPanPadding={[50, 50]}
              closeButton={false}
              closeOnClick={false}
              offset={[0, -25]}
            >
              <PropertyMarker property={selectedProperty} projectId={projectId} />
            </Popup>
          )}
        </StyledMapContainer>


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
              <PropertyMarker property={selectedProperty} projectId={projectId} hideArrow={true} />
            </Box>
          </Drawer>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default MapCanvas;