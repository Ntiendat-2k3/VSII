import { Search } from 'lucide-react';

interface MapHeaderProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const MapHeader = ({ searchValue, onSearchChange }: MapHeaderProps) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2 w-100">
      <h2 className="map-section-title mb-0">Mặt bằng quỹ căn</h2>

      <div className="search-input-wrapper">
        <span className="search-input-icon">
          <Search size={20} />
        </span>
        <input
          id="search-property-input"
          type="text"
          className="search-input"
          placeholder="Tìm vị trí căn theo mã căn"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Tìm vị trí căn theo mã căn"
        />
      </div>
    </div>
  );
};

export default MapHeader;
