import { Maximize, Building } from 'lucide-react';
import type { PropertyType } from '../../types/property';
import { PROPERTY_TYPE_LABELS } from '../../types/property';
import { PALETTE } from '../../theme';

interface PopupDetailsProps {
  area: number;
  type: PropertyType;
}

const PopupDetails = ({ area, type }: PopupDetailsProps) => {
  return (
    <div className="popup-details">
      <div className="d-flex align-items-center gap-1">
        <Maximize size={16} color={PALETTE.TEXT_SECONDARY} />
        <span className="popup-detail-text">{area}m²</span>
      </div>
      <div className="d-flex align-items-center gap-1">
        <Building size={16} color={PALETTE.TEXT_SECONDARY} />
        <span className="popup-detail-text popup-detail-text--secondary">
          {PROPERTY_TYPE_LABELS[type]}
        </span>
      </div>
    </div>
  );
};

export default PopupDetails;
