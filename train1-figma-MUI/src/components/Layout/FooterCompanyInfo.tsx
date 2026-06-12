import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Phone, Mail, MapPin } from 'lucide-react';
import { PALETTE } from '../../theme';

/* ── Static Data ── */

interface ContactItem {
  id: string;
  icon: ReactNode;
  text: string;
  alignTop?: boolean;
}

const CONTACT_ITEMS: ContactItem[] = [
  { id: 'phone', icon: <Phone size={16} color={PALETTE.BACKGROUND_DEFAULT} />, text: '0972 72 9999' },
  { id: 'email', icon: <Mail size={16} color={PALETTE.BACKGROUND_DEFAULT} />, text: 'Contact@gmail.com' },
  {
    id: 'address',
    icon: <MapPin size={16} color={PALETTE.BACKGROUND_DEFAULT} />,
    text: 'SB24-36, Sao Biển 24, KĐT Vinhomes Ocean Park, Xã Gia Lâm, TP Hà Nội, Việt Nam',
    alignTop: true,
  },
];

const contactTextSx = {
  fontWeight: 500,
  fontSize: '0.8125rem',
  color: PALETTE.BACKGROUND_DEFAULT,
} as const;

/* ── Component ── */

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
        {CONTACT_ITEMS.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            spacing={1}
            sx={{
              alignItems: item.alignTop ? 'flex-start' : 'center',
              ...(item.alignTop && { pt: 0.5 }),
            }}
          >
            <Stack sx={item.alignTop ? { mt: 0.5 } : undefined}>
              {item.icon}
            </Stack>
            <Typography
              sx={{
                ...contactTextSx,
                lineHeight: item.alignTop ? '21px' : '26px',
                ...(item.alignTop && { textAlign: 'left' }),
              }}
            >
              {item.text}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export default FooterCompanyInfo;

