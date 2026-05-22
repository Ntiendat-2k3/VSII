import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { Maximize, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Property } from '../../types/property';
import { PROPERTY_TYPE_LABELS } from '../../types/property';
import { PALETTE, GRADIENT, BORDER_RADIUS, SHADOW } from '../../theme';

const MotionBox = motion(Box);

interface PropertyPopupProps {
  property: Property;
  position?: 'top' | 'bottom';
}

const PropertyPopup = ({ property, position = 'top' }: PropertyPopupProps) => {
  const { code, isHot, type, area, listedPrice, loanPrice, status } = property;

  const renderHeader = () => {
    if (isHot) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '4px',
            p: '12px 8px',
            backgroundColor: PALETTE.SURFACE_LIGHT,
            border: `1px solid ${PALETTE.ACCENT_BORDER}`,
            borderRadius: `${BORDER_RADIUS.SMALL}px`,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: '0.9375rem',
              color: PALETTE.PRIMARY,
            }}
          >
            {code}
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '4px',
          p: '12px 8px',
          backgroundColor: PALETTE.ERROR,
          borderRadius: `${BORDER_RADIUS.SMALL}px`,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: '0.9375rem',
            color: PALETTE.SURFACE_LIGHT,
          }}
        >
          {code}
        </Typography>
      </Box>
    );
  };

  const renderDetails = () => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        pb: '8px',
        borderBottom: '1px solid',
        borderImage: GRADIENT.DIVIDER,
        borderImageSlice: 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Maximize size={16} color={PALETTE.TEXT_SECONDARY} />
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '0.8125rem',
            color: PALETTE.TEXT_PRIMARY,
          }}
        >
          {area}m²
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Building size={16} color={PALETTE.TEXT_SECONDARY} />
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '0.8125rem',
            color: PALETTE.TEXT_SECONDARY,
          }}
        >
          {PROPERTY_TYPE_LABELS[type]}
        </Typography>
      </Box>
    </Box>
  );

  const renderFooter = () => {
    if (status === 'available') {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '0.8125rem',
                color: PALETTE.TEXT_SECONDARY,
              }}
            >
              Giá niêm yết:
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.8125rem',
                color: PALETTE.PRIMARY,
              }}
            >
              {listedPrice} tỷ
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '0.8125rem',
                color: PALETTE.TEXT_SECONDARY,
              }}
            >
              Giá vay:
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.8125rem',
                color: PALETTE.PRIMARY,
              }}
            >
              {loanPrice} tỷ
            </Typography>
          </Box>
        </Box>
      );
    }

    if (status === 'sold') {
      return (
        <Chip
          label="Đã bán"
          sx={{
            width: '100%',
            backgroundColor: PALETTE.ERROR_LIGHT,
            color: PALETTE.ERROR,
            fontWeight: 500,
            fontSize: '0.6875rem',
            borderRadius: `${BORDER_RADIUS.SMALL}px`,
          }}
        />
      );
    }

    /* status === 'contact' */
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography
          sx={{
            fontWeight: 500,
            fontStyle: 'italic',
            fontSize: '0.8125rem',
            color: PALETTE.TEXT_DISABLED,
          }}
        >
          Quỹ ẩn
        </Typography>
        <Button
          fullWidth
          variant="contained"
          sx={{
            background: GRADIENT.PRIMARY,
            borderRadius: `${BORDER_RADIUS.MEDIUM}px`,
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: PALETTE.SURFACE_LIGHT,
            py: '7px',
            '&:hover': {
              background: GRADIENT.PRIMARY,
              opacity: 0.9,
            },
          }}
        >
          Xin thông tin
        </Button>
      </Box>
    );
  };

  const isBottom = position === 'bottom';

  return (
    <AnimatePresence>
      <MotionBox
        key={property.id}
        initial={{ opacity: 0, scale: 0.5, y: isBottom ? -20 : 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: isBottom ? -20 : 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        sx={{
          width: 200,
          display: 'flex',
          flexDirection: isBottom ? 'column-reverse' : 'column',
          filter: `drop-shadow(${SHADOW.POPUP})`,
          transformOrigin: isBottom ? 'top center' : 'bottom center',
        }}
      >
        <Box
          sx={{
            backgroundColor: PALETTE.BACKGROUND_DEFAULT,
            borderRadius: isBottom 
              ? `0 0 ${BORDER_RADIUS.LARGE}px ${BORDER_RADIUS.LARGE}px`
              : `${BORDER_RADIUS.LARGE}px ${BORDER_RADIUS.LARGE}px 0 0`,
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: '8px', pb: '4px' }}>
            {renderHeader()}
            {renderDetails()}
            {renderFooter()}
          </Box>
        </Box>

        {/* Bottom/Top arrow / triangle */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 200 18"
            sx={{ width: '100%', height: 18, display: 'block', transform: isBottom ? 'rotate(180deg)' : 'none' }}
          >
            <path
              d="M0,0 L90,0 L100,18 L110,0 L200,0"
              fill={PALETTE.BACKGROUND_DEFAULT}
            />
          </Box>
        </Box>
      </MotionBox>
    </AnimatePresence>
  );
};

export default PropertyPopup;
