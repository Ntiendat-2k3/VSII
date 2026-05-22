import { memo } from 'react';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Property } from '../../types/property';
import { PALETTE } from '../../theme';

interface PropertyMarkerProps {
  property: Property;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const PropertyMarker = memo(({ property, isSelected, onClick }: PropertyMarkerProps) => {
  const { code, isHot, status, position } = property;

  const getMarkerVariant = () => {
    if (status === 'sold') return 'sold';
    if (isHot) return 'hot';
    return 'default';
  };

  const variant = getMarkerVariant();

  const getArrowColor = () => {
    if (status === 'sold') return PALETTE.ERROR;
    if (isHot) return PALETTE.ERROR;
    return PALETTE.PRIMARY;
  };

  return (
    <motion.div
      className={`property-marker ${isSelected ? 'selected' : ''}`}
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.15, zIndex: 20 }}
      onClick={() => onClick(property.id)}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
    >
      {/* Marker Body */}
      <motion.div
        className={`marker-body marker-body--${variant} ${isSelected ? 'selected-glow' : ''}`}
        animate={
          isHot && !isSelected
            ? {
                y: [0, -5, 0],
                transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
              }
            : {}
        }
      >
        {isHot && (
          <Flame size={14} color="inherit" />
        )}
        <span className="marker-code">{code}</span>
      </motion.div>

      {/* Arrow pointer */}
      <div
        className="marker-arrow"
        style={{
          borderTopColor: getArrowColor(),
          filter: `drop-shadow(0px 2px 2px ${PALETTE.SHADOW_LIGHT})`,
        }}
      />
    </motion.div>
  );
});

export default PropertyMarker;
