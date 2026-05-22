import { useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Drawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import PropertyMarker from './PropertyMarker';
import PropertyPopup from './PropertyPopup';
import MapControls from './MapControls';
import type { Property, PropertyType } from '../../types/property';
import { PALETTE } from '../../theme';

interface MapCanvasProps {
  properties: Property[];
  activeFilters: PropertyType[];
  selectedId: string | null;
  onSelectProperty: (id: string | null) => void;
}

const MapCanvas = ({
  properties,
  activeFilters,
  selectedId,
  onSelectProperty,
}: MapCanvasProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const filteredProperties = properties.filter((p) =>
    activeFilters.includes(p.type),
  );

  const selectedProperty = properties.find((p) => p.id === selectedId) ?? null;

  const handleMarkerClick = useCallback(
    (id: string) => {
      onSelectProperty(id === selectedId ? null : id);
    },
    [selectedId, onSelectProperty],
  );

  const handleClickAway = useCallback(() => {
    onSelectProperty(null);
  }, [onSelectProperty]);

  const handleDrawerClose = useCallback(() => {
    onSelectProperty(null);
  }, [onSelectProperty]);

  const renderPopup = () => {
    if (!selectedProperty) return null;

    if (isMobile) {
      return (
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
      );
    }

    const renderBelow = selectedProperty.position.y < 25;

    return (
      <Box
        sx={{
          position: 'absolute',
          left: `${selectedProperty.position.x}%`,
          top: `${selectedProperty.position.y}%`,
          transform: renderBelow 
            ? 'translate(-50%, 15px)' 
            : 'translate(-50%, calc(-100% - 30px))',
          zIndex: 20,
        }}
      >
        <PropertyPopup property={selectedProperty} position={renderBelow ? 'bottom' : 'top'} />
      </Box>
    );
  };

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
        }}
      >
        <TransformWrapper
          initialScale={1}
          minScale={isMobile ? 0.5 : 0.8}
          maxScale={4}
          centerOnInit={true}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
          panning={{ velocityDisabled: true }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <MapControls
                onZoomIn={() => zoomIn()}
                onZoomOut={() => zoomOut()}
                onReset={() => resetTransform()}
              />

              <TransformComponent
                wrapperStyle={{
                  width: '100%',
                  height: '100%',
                }}
                contentStyle={{
                  width: '100%',
                  height: '100%',
                }}
              >
                <Stack
                  sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <Box sx={{ position: 'relative', width: { xs: 800, md: '100%' } }}>
                    <Box
                      component="img"
                      src="/map-background.png"
                      alt="Mặt bằng quỹ căn Vinhomes Ocean Park 3"
                      sx={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }}
                    />

                    {filteredProperties.map((property) => (
                      <PropertyMarker
                        key={property.id}
                        property={property}
                        isSelected={property.id === selectedId}
                        onClick={handleMarkerClick}
                      />
                    ))}

                    {!isMobile && renderPopup()}
                  </Box>
                </Stack>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>

        {isMobile && renderPopup()}
      </Box>
    </ClickAwayListener>
  );
};

export default MapCanvas;
