import { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { m, AnimatePresence } from 'framer-motion';
import { Flame, Maximize, Building } from 'lucide-react';
import type { UnitItem, InquiryStatusCode } from '../types/PropertyMapModel';
import { PALETTE, GRADIENT, BORDER_RADIUS, SHADOW } from '@/theme';
import { formatPrice } from '@/utils/format/formatPrice';
import { unitInquiryMutationApi } from '../requests/unitInquiryMutation';
import { showToast } from '@/utils/toast';
import { UNIT_STATUS, UNIT_TYPE_ICONS } from '../constants/propertyMapStatus';
import { useAppSelector } from '@/store';

const MotionBox = m(Box);

interface PropertyMarkerProps {
  property: UnitItem;
  projectId: number;
  hideArrow?: boolean;
}

const PropertyMarker = ({ property, projectId, hideArrow = false }: PropertyMarkerProps) => {
  const {
    unitCode: code,
    isHot,
    unitTypeCode: type,
    areaLand: area,
    basePrice: listedPrice,
    loanPrice,
    statusCode,
    inquiryStatusCode: initialInquiryStatus,
  } = property;

  const { unitTypes, inquiryStatuses, unitStatuses } = useAppSelector((state) => state.propertyMap.masterData);

  const [inquiryStatus, setInquiryStatus] = useState<InquiryStatusCode | null | undefined>(
    initialInquiryStatus,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestInfo = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const response = await unitInquiryMutationApi.create(projectId, code);
      if (response.success) {
        setInquiryStatus(response.status);
        showToast.success('Yêu cầu đã được gửi thành công!');
      }
    } catch {
      showToast.error('Gửi yêu cầu thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }, [projectId, code]);

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
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              justifyContent: 'center',
              alignItems: 'center',
              p: isHot ? '8px 12px' : '6px 8px',
              backgroundColor: isHot ? 'transparent' : PALETTE.PRIMARY_LIGHT_BG,
              border: isHot ? 'none' : `1px solid ${PALETTE.PRIMARY}`,
              borderRadius: isHot ? 0 : `${BORDER_RADIUS.SMALL}px`,
              width: isHot ? '100%' : 'auto',
            }}
          >
            {isHot && <Flame size={16} color={PALETTE.SURFACE_LIGHT} />}
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '0.9375rem',
                color: isHot ? PALETTE.SURFACE_LIGHT : PALETTE.PRIMARY,
              }}
            >
              {code}
            </Typography>
          </Stack>
        </Box>

        {/* Body & Footer Section */}
        <Box
          sx={{
            backgroundColor: PALETTE.BACKGROUND_DEFAULT,
            borderRadius: `0 0 ${BORDER_RADIUS.LARGE}px ${BORDER_RADIUS.LARGE}px`,
            p: 1.5,
            pt: 1,
          }}
        >
          <Stack spacing={1}>
            {/* Details (Area & Type) */}
            <Stack
              direction="row"
              sx={{
                justifyContent: 'space-between',
                pt: '4px',
              }}
            >
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                <Maximize size={16} color={PALETTE.TEXT_SECONDARY} />
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.8125rem',
                    color: PALETTE.TEXT_PRIMARY,
                  }}
                >
                  {area ?? '—'}m²
                </Typography>
              </Stack>
              <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                {type ? (
                  <Box
                    component="img"
                    src={UNIT_TYPE_ICONS[type] || '/icon_type/donlap.png'}
                    alt={unitTypes[type] || type}
                    sx={{
                      width: 16,
                      height: 16,
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Building size={16} color={PALETTE.TEXT_SECONDARY} />
                )}
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.8125rem',
                    color: PALETTE.TEXT_SECONDARY,
                  }}
                >
                  {type ? (unitTypes[type] || type) : 'Chưa cập nhật'}
                </Typography>
              </Stack>
            </Stack>

            {/* Footer / Status Actions */}
            <Box sx={{ borderTop: `1px solid ${PALETTE.BORDER}`, pt: 1, mt: 0.5 }}>
              {statusCode === UNIT_STATUS.AVAILABLE ? (
                <Stack spacing={1}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
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
                      {listedPrice != null ? formatPrice(listedPrice) : 'Liên hệ'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
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
                      {loanPrice != null ? formatPrice(loanPrice) : 'Đang cập nhật'}
                    </Typography>
                  </Stack>
                </Stack>
              ) : statusCode === UNIT_STATUS.SOLD ? (
                <Chip
                  label={statusCode ? (unitStatuses[statusCode] || 'Đã bán') : 'Đã bán'}
                  sx={{
                    width: '100%',
                    backgroundColor: PALETTE.ERROR_LIGHT,
                    color: PALETTE.ERROR,
                    fontWeight: 500,
                    fontSize: '0.6875rem',
                    borderRadius: `${BORDER_RADIUS.SMALL}px`,
                  }}
                />
              ) : inquiryStatus ? (
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontStyle: 'italic',
                    fontSize: '0.8125rem',
                    color: PALETTE.TEXT_DISABLED,
                    textAlign: 'center',
                    py: 1,
                  }}
                >
                  {inquiryStatus ? (inquiryStatuses[inquiryStatus] || inquiryStatus) : ''}
                </Typography>
              ) : (
                <Stack spacing={1}>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontStyle: 'italic',
                      fontSize: '0.8125rem',
                      color: PALETTE.TEXT_DISABLED,
                      textAlign: 'center',
                    }}
                  >
                    Quỹ hàng ẩn
                  </Typography>
                  <Button
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    onClick={handleRequestInfo}
                    sx={{
                      background: GRADIENT.PRIMARY,
                      borderRadius: `${BORDER_RADIUS.MEDIUM}px`,
                      fontWeight: 600,
                      fontSize: '0.8125rem',
                      color: PALETTE.SURFACE_LIGHT,
                      py: '7px',
                      boxShadow: 'none',
                      '&:hover': {
                        background: GRADIENT.PRIMARY,
                        opacity: 0.9,
                        boxShadow: 'none',
                      },
                      '&.Mui-disabled': {
                        background: PALETTE.GREY_LIGHT,
                      },
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={18} sx={{ color: PALETTE.SURFACE_LIGHT }} />
                    ) : (
                      'Xin thông tin'
                    )}
                  </Button>
                </Stack>
              )}
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
              <path d="M0,0 L90,0 L100,18 L110,0 L200,0" fill={PALETTE.BACKGROUND_DEFAULT} />
            </Box>
          </Box>
        )}
      </MotionBox>
    </AnimatePresence>
  );
};

export default PropertyMarker;
