import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { Home, MapPin, Compass, Map, Building2, ClipboardList, Globe } from 'lucide-react';
import { PALETTE, GRADIENT } from '../../theme';

const MotionStack = motion(Stack);

const TAB_ITEMS = [
  { label: 'Tổng quan', icon: <Home size={18} />, active: false },
  { label: 'Vị trí', icon: <MapPin size={18} />, active: false },
  { label: 'Phân khu', icon: <Compass size={18} />, active: false },
  { label: 'Mặt bằng quỹ căn', icon: <Map size={18} />, active: true },
  { label: 'Quỹ căn', icon: <Building2 size={18} />, active: false },
  { label: 'Chính sách bán hàng', icon: <ClipboardList size={18} />, active: false },
  { label: 'Tin tức', icon: <Globe size={18} />, active: false },
];

const HeroTabs = () => {
  return (
    <Stack
      direction="row"
      spacing={{ xs: 1, md: 3 }}
      sx={{
        px: 2,
        py: 2,
        background: GRADIENT.PRIMARY,
        borderRadius: '16px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        '&::-webkit-scrollbar': { display: 'none' },
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        alignItems: 'center',
      }}
    >
      {TAB_ITEMS.map((tab) => (
        <MotionStack
          key={tab.label}
          direction="row"
          spacing={1}
          whileHover={{ scale: 1.05 }}
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 1.5, md: 2 },
            borderRadius: '32px',
            backgroundColor: tab.active
              ? 'rgba(42, 82, 190, 0.2)'
              : 'transparent',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            alignItems: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', color: PALETTE.SURFACE_LIGHT }}>
            {tab.icon}
          </Box>
          <Typography
            sx={{
              fontWeight: tab.active ? 600 : 500,
              fontSize: { xs: '0.875rem', md: '0.9375rem' },
              color: PALETTE.SURFACE_LIGHT,
            }}
          >
            {tab.label}
          </Typography>
        </MotionStack>
      ))}
    </Stack>
  );
};

export default HeroTabs;
