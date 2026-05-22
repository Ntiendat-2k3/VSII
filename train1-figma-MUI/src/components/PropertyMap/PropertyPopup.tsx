import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { motion, AnimatePresence } from 'framer-motion';
import PopupHeader from './PopupHeader';
import PopupDetails from './PopupDetails';
import PopupFooter from './PopupFooter';
import type { Property } from '../../types/property';
import { PALETTE, BORDER_RADIUS, SHADOW } from '../../theme';

const MotionBox = motion(Box);

interface PropertyPopupProps {
  property: Property;
  position?: 'top' | 'bottom';
}

const PropertyPopup = ({ property, position = 'top' }: PropertyPopupProps) => {
  const { code, isHot, type, area, listedPrice, loanPrice, status } = property;
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
          <Stack spacing={1} sx={{ p: '8px', pb: '4px' }}>
            <PopupHeader code={code} isHot={isHot} />
            <PopupDetails area={area} type={type} />
            <PopupFooter status={status} listedPrice={listedPrice} loanPrice={loanPrice} />
          </Stack>
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
            sx={{
              width: '100%',
              height: 18,
              display: 'block',
              transform: isBottom ? 'rotate(180deg)' : 'none',
            }}
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
