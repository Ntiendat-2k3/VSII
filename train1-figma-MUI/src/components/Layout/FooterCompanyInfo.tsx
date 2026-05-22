import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Phone, Mail, MapPin } from 'lucide-react';
import { PALETTE } from '../../theme';

const FooterCompanyInfo = () => {
  return (
    <Stack
      spacing={3}
      sx={{
        alignItems: 'flex-start',
        maxWidth: { xs: '100%', md: 373 },
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Box
          component="img"
          src="/logo-white.png"
          alt="Realestate Company Logo"
          sx={{ width: 60, height: 60, objectFit: 'contain' }}
        />
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            lineHeight: '24px',
            color: PALETTE.BACKGROUND_PAPER,
          }}
        >
          Nền tảng công nghệ tiên phong & dẫn đầu lĩnh vực kinh doanh bất động sản tại Việt Nam
        </Typography>
      </Stack>

      <Stack spacing={1.5} sx={{ alignItems: 'flex-start' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Phone size={16} color={PALETTE.BACKGROUND_DEFAULT} />
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '0.8125rem',
              lineHeight: '26px',
              color: PALETTE.BACKGROUND_DEFAULT,
            }}
          >
            0972 72 9999
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Mail size={16} color={PALETTE.BACKGROUND_DEFAULT} />
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '0.8125rem',
              lineHeight: '26px',
              color: PALETTE.BACKGROUND_DEFAULT,
            }}
          >
            Contact@gmail.com
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={1}
          sx={{ pt: 0.5, alignItems: 'flex-start' }}
        >
          <Stack sx={{ mt: 0.5 }}>
            <MapPin size={16} color={PALETTE.BACKGROUND_DEFAULT} />
          </Stack>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '0.8125rem',
              lineHeight: '21px',
              color: PALETTE.BACKGROUND_DEFAULT,
              textAlign: 'left',
            }}
          >
            SB24-36, Sao Biển 24, KĐT Vinhomes Ocean Park, Xã Gia Lâm, TP Hà Nội, Việt Nam
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default FooterCompanyInfo;
