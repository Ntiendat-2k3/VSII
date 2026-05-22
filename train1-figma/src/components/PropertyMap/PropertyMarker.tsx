import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Property } from '../../types/property';
import { PALETTE, BORDER_RADIUS } from '../../theme';

const MotionBox = motion(Box);

interface PropertyMarkerProps {
  property: Property;
  isSelected: boolean;
  onClick: (id: string) => void;
}

const PropertyMarker = ({ property, isSelected, onClick }: PropertyMarkerProps) => {
  const { code, isHot, status, position } = property;

  const getMarkerStyles = () => {
    if (status === 'sold') {
      return {
        backgroundColor: PALETTE.ERROR_LIGHT,
        borderColor: PALETTE.ERROR,
        color: PALETTE.ERROR,
      };
    }
    if (isHot) {
      return {
        backgroundColor: PALETTE.ERROR,
        borderColor: PALETTE.ERROR,
        color: PALETTE.BACKGROUND_DEFAULT,
      };
    }
    return {
      backgroundColor: PALETTE.SURFACE_LIGHT,
      borderColor: PALETTE.PRIMARY,
      color: PALETTE.PRIMARY,
    };
  };

  const styles = getMarkerStyles();

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.15, zIndex: 20 }}
      onClick={() => onClick(property.id)}
      sx={{
        position: 'absolute',
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -100%)',
        cursor: 'pointer',
        zIndex: isSelected ? 10 : 1,
      }}
    >
      {/* Marker Body */}
      <MotionBox
        animate={
          isHot && !isSelected
            ? {
                y: [0, -5, 0],
                transition: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }
              }
            : {}
        }
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          px: '8px',
          py: '5px',
          borderRadius: `${BORDER_RADIUS.SMALL}px`,
          border: `1.5px solid ${styles.borderColor}`,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          whiteSpace: 'nowrap',
          boxShadow: isSelected
            ? `0 0 0 3px ${PALETTE.PRIMARY_LIGHT}`
            : '0px 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        {isHot && (
          <Flame size={14} color="inherit" />
        )}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 700,
            fontSize: '0.6875rem',
            lineHeight: 1,
            color: 'inherit',
          }}
        >
          {code}
        </Typography>
      </MotionBox>

      {/* Arrow pointer */}
      <Box
        sx={{
          width: 0,
          height: 0,
          mx: 'auto',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: `6px solid ${styles.borderColor}`,
          filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.1))'
        }}
      />
    </MotionBox>
  );
};

export default PropertyMarker;
