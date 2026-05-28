import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import type { PropertyStatus } from '../../types/property';
import { PALETTE, GRADIENT, BORDER_RADIUS } from '../../theme';

interface PopupFooterProps {
  status: PropertyStatus;
  listedPrice: number;
  loanPrice: number;
}

const PopupFooter = ({ status, listedPrice, loanPrice }: PopupFooterProps) => {
  if (status === 'available') {
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
            {listedPrice} tỷ
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
            {loanPrice} tỷ
          </Typography>
        </Stack>
      </Stack>
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

  if (status === 'contacting') {
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
        Admin sẽ liên hệ sớm nhất
      </Typography>
    );
  }

  /* status === 'contact' */
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
        }}
      >
        Xin thông tin
      </Button>
    </Stack>
  );
};

export default PopupFooter;
