import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const MapControls = ({ onZoomIn, onZoomOut, onReset }: MapControlsProps) => {
  return (
    <div className="map-controls">
      <button
        className="map-control-btn"
        onClick={onZoomIn}
        aria-label="Phóng to"
      >
        <ZoomIn size={20} />
      </button>
      <button
        className="map-control-btn"
        onClick={onZoomOut}
        aria-label="Thu nhỏ"
      >
        <ZoomOut size={20} />
      </button>
      <button
        className="map-control-btn"
        onClick={onReset}
        aria-label="Đặt lại vị trí"
      >
        <RotateCcw size={20} />
      </button>
    </div>
  );
};

export default MapControls;
