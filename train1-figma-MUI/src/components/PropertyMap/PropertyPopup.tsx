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
}

const PropertyPopup = ({ property }: PropertyPopupProps) => {
  const { code, isHot, type, area, listedPrice, loanPrice, status } = property;

  return (
    <AnimatePresence>
      <MotionBox
        key={property.id}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        sx={{
          width: 200,
          display: 'flex',
          flexDirection: 'column',
          filter: `drop-shadow(${SHADOW.POPUP})`,
          transformOrigin: 'bottom center',
        }}
      >
        <Box
          sx={{
            backgroundColor: isHot ? PALETTE.BACKGROUND_DEFAULT : '#F4F7FF',
            borderRadius: `${BORDER_RADIUS.LARGE}px ${BORDER_RADIUS.LARGE}px 0 0`,
            p: 1.5,
            pb: 1,
            borderBottom: `1px dashed ${PALETTE.BORDER}`,
          }}
        >
          <Stack spacing={1}>
            <PopupHeader code={code} isHot={isHot} />
            <PopupDetails area={area} type={type} />
          </Stack>
        </Box>

        <Box
          sx={{
            backgroundColor: PALETTE.BACKGROUND_DEFAULT,
            borderRadius: `0 0 ${BORDER_RADIUS.LARGE}px ${BORDER_RADIUS.LARGE}px`,
            p: 1.5,
            pt: 1,
          }}
        >
          <PopupFooter status={status} listedPrice={listedPrice} loanPrice={loanPrice} />
        </Box>

        {/* Bottom arrow / triangle */}
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
