import { useState, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import type { PropertyUnit, InquiryStatusCode } from '../../types/mapApi';
import { INQUIRY_STATUS_LABELS } from '../../types/mapApi';
import { PALETTE, GRADIENT, BORDER_RADIUS } from '../../theme';
import { formatVndToBillion } from '../../utils/mapUtils';
import { mapService } from '../../services/mapService';
import { showToast } from '../../utils/toast';

interface PopupFooterProps {
  statusCode: PropertyUnit['statusCode'];
  listedPrice: number;
  loanPrice?: number;
  inquiryStatusCode?: InquiryStatusCode | null;
  unitCode: string;
  projectId: string;
}

const PopupFooter = ({
  statusCode,
  listedPrice,
  loanPrice,
  inquiryStatusCode: initialInquiryStatus,
  unitCode,
  projectId,
}: PopupFooterProps) => {
  const [inquiryStatus, setInquiryStatus] = useState<InquiryStatusCode | null | undefined>(
    initialInquiryStatus,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRequestInfo = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const response = await mapService.createInquiry(projectId, unitCode);
      if (response.success) {
        setInquiryStatus(response.status);
        showToast.success('Yêu cầu đã được gửi thành công!');
      }
    } catch {
      showToast.error('Gửi yêu cầu thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }, [projectId, unitCode]);

  /* ── Trạng thái: Còn hàng (AVAILABLE) ── */
  if (statusCode === 'AVAILABLE') {
    return (
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
            {formatVndToBillion(listedPrice)}
          </Typography>
        </Stack>
        {loanPrice != null && (
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
              {formatVndToBillion(loanPrice)}
            </Typography>
          </Stack>
        )}
      </Stack>
    );
  }

  /* ── Trạng thái: Đã bán (SOLD) ── */
  if (statusCode === 'SOLD') {
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

  /* ── Trạng thái: Quỹ ẩn (statusCode === null) ── */

  // Nếu đã gửi yêu cầu rồi → hiển thị trạng thái inquiry
  if (inquiryStatus) {
    return (
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
        {INQUIRY_STATUS_LABELS[inquiryStatus]}
      </Typography>
    );
  }

  // Chưa gửi yêu cầu → hiển thị nút "Xin thông tin"
  return (
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
        Quỹ ẩn
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
        {isSubmitting ? <CircularProgress size={18} sx={{ color: PALETTE.SURFACE_LIGHT }} /> : 'Xin thông tin'}
      </Button>
    </Stack>
  );
};

export default PopupFooter;
