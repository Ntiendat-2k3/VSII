import { motion, AnimatePresence } from 'framer-motion';
import PopupHeader from './PopupHeader';
import PopupDetails from './PopupDetails';
import PopupFooter from './PopupFooter';
import type { Property } from '../../types/property';
import { PALETTE } from '../../theme';

interface PropertyPopupProps {
  property: Property;
  position?: 'top' | 'bottom';
}

const PropertyPopup = ({ property, position = 'top' }: PropertyPopupProps) => {
  const { code, isHot, type, area, listedPrice, loanPrice, status } = property;
  const isBottom = position === 'bottom';

  return (
    <AnimatePresence>
      <motion.div
        key={property.id}
        className={`popup-wrapper d-flex ${isBottom ? 'popup-wrapper--bottom' : 'popup-wrapper--top'}`}
        initial={{ opacity: 0, scale: 0.5, y: isBottom ? -20 : 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.5, y: isBottom ? -20 : 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        style={{
          filter: `drop-shadow(${PALETTE.SHADOW_LIGHT} 0px 4px 4px)`,
          transformOrigin: isBottom ? 'top center' : 'bottom center',
        }}
      >
        <div className={`popup-card ${isBottom ? 'popup-card--bottom' : 'popup-card--top'}`}>
          <div className="popup-inner">
            <PopupHeader code={code} isHot={isHot} />
            <PopupDetails area={area} type={type} />
            <PopupFooter status={status} listedPrice={listedPrice} loanPrice={loanPrice} />
          </div>
        </div>

        {/* Bottom/Top arrow / triangle */}
        <div className="d-flex justify-content-center">
          <svg
            viewBox="0 0 200 18"
            className="popup-arrow-svg"
            style={{
              transform: isBottom ? 'rotate(180deg)' : 'none',
            }}
          >
            <path
              d="M0,0 L90,0 L100,18 L110,0 L200,0"
              fill={PALETTE.BACKGROUND_DEFAULT}
            />
          </svg>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PropertyPopup;
