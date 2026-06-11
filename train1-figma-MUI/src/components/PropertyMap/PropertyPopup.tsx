import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { m, AnimatePresence } from 'framer-motion';
import PopupHeader from './PopupHeader';
import PopupDetails from './PopupDetails';
import PopupFooter from './PopupFooter';
import type { UnitItem } from '../../features/property-map/types';
import { PALETTE, BORDER_RADIUS, SHADOW } from '../../theme';

const MotionBox = m(Box);

interface PropertyPopupProps {
  property: UnitItem;
  projectId: number;
  hideArrow?: boolean;
}

const PropertyPopup = ({ property, projectId, hideArrow = false }: PropertyPopupProps) => {
  const { unitCode: code, isHot, unitTypeCode: type, areaLand: area, basePrice: listedPrice, loanPrice, statusCode, inquiryStatusCode } = property;

  return (
    <AnimatePresence>
      <MotionBox
        key={property.id}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        sx={{
          width: hideArrow ? '100%' : 220,
          maxWidth: hideArrow ? 360 : 220,
          display: 'flex',
          flexDirection: 'column',
          filter: `drop-shadow(${SHADOW.POPUP})`,
          transformOrigin: hideArrow ? 'center bottom' : 'bottom center',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            backgroundColor: isHot ? PALETTE.ERROR : PALETTE.BACKGROUND_DEFAULT,
            borderRadius: `${BORDER_RADIUS.LARGE}px ${BORDER_RADIUS.LARGE}px 0 0`,
            p: isHot ? 0 : 1.5,
            pb: isHot ? 0 : 1,
            borderBottom: isHot ? 'none' : `1px solid ${PALETTE.BORDER}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <PopupHeader code={code} isHot={isHot ?? false} />
        </Box>

        {/* Body Section */}
        <Box
          sx={{
            backgroundColor: PALETTE.BACKGROUND_DEFAULT,
            borderRadius: `0 0 ${BORDER_RADIUS.LARGE}px ${BORDER_RADIUS.LARGE}px`,
            p: 1.5,
            pt: 1,
          }}
        >
          <Stack spacing={1}>
            <PopupDetails area={area} type={type} />
            <Box sx={{ borderTop: `1px solid ${PALETTE.BORDER}`, pt: 1, mt: 0.5 }}>
              <PopupFooter
                statusCode={statusCode}
                listedPrice={listedPrice}
                loanPrice={loanPrice}
                inquiryStatusCode={inquiryStatusCode}
                unitCode={code}
                projectId={projectId}
              />
            </Box>
          </Stack>
        </Box>

        {/* Bottom arrow / triangle */}
        {!hideArrow && (
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
        )}
      </MotionBox>
    </AnimatePresence>
  );
};

export default PropertyPopup;
