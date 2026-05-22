import { useCallback, useEffect, useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import PropertyMarker from './PropertyMarker';
import PropertyPopup from './PropertyPopup';
import MapControls from './MapControls';
import useMediaQuery from '../../hooks/useMediaQuery';
import useClickAway from '../../hooks/useClickAway';
import type { Property, PropertyType } from '../../types/property';

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
  const isMobile = useMediaQuery('(max-width: 767.98px)');

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

  const containerRef = useClickAway<HTMLDivElement>(handleClickAway);

  // Bootstrap Offcanvas for mobile bottom drawer
  const offcanvasRef = useRef<HTMLDivElement>(null);
  const bsOffcanvasRef = useRef<{ show: () => void; hide: () => void; dispose: () => void } | null>(null);

  useEffect(() => {
    if (!isMobile) return;

    const el = offcanvasRef.current;
    if (!el) return;

    const initOffcanvas = async () => {
      const bootstrap = await import('bootstrap');
      bsOffcanvasRef.current = new bootstrap.Offcanvas(el, { backdrop: true });
    };

    initOffcanvas();

    const handleHidden = () => {
      handleDrawerClose();
    };

    el.addEventListener('hidden.bs.offcanvas', handleHidden);

    return () => {
      el.removeEventListener('hidden.bs.offcanvas', handleHidden);
      if (bsOffcanvasRef.current) {
        bsOffcanvasRef.current.dispose();
        bsOffcanvasRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile || !offcanvasRef.current) return;

    const toggle = async () => {
      const bootstrap = await import('bootstrap');
      const instance = bootstrap.Offcanvas.getOrCreateInstance(offcanvasRef.current!);

      if (selectedProperty) {
        instance.show();
      } else {
        instance.hide();
      }
    };

    toggle();
  }, [isMobile, selectedProperty]);

  const renderDesktopPopup = () => {
    if (!selectedProperty || isMobile) return null;

    const renderBelow = selectedProperty.position.y < 25;

    return (
      <div
        className={`popup-absolute ${renderBelow ? 'popup-absolute--below' : ''}`}
        style={{
          left: `${selectedProperty.position.x}%`,
          top: `${selectedProperty.position.y}%`,
        }}
      >
        <PropertyPopup property={selectedProperty} position={renderBelow ? 'bottom' : 'top'} />
      </div>
    );
  };

  return (
    <>
      <div ref={containerRef} className="map-canvas-container">
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
                <div className="map-inner-wrapper">
                  <div className="map-image-container">
                    <img
                      src="/map-background.png"
                      alt="Mặt bằng quỹ căn Vinhomes Ocean Park 3"
                      className="map-image"
                    />

                    {filteredProperties.map((property) => (
                      <PropertyMarker
                        key={property.id}
                        property={property}
                        isSelected={property.id === selectedId}
                        onClick={handleMarkerClick}
                      />
                    ))}

                    {renderDesktopPopup()}
                  </div>
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* Mobile Bottom Offcanvas */}
      {isMobile && (
        <div
          ref={offcanvasRef}
          className="offcanvas offcanvas-bottom offcanvas-bottom-custom"
          tabIndex={-1}
          aria-labelledby="propertyPopupLabel"
        >
          <div className="offcanvas-body offcanvas-bottom-inner">
            {selectedProperty && (
              <PropertyPopup property={selectedProperty} />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MapCanvas;
