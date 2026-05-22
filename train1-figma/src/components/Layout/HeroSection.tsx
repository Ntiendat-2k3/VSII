import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { Home, MapPin, Compass, Map, Building2, ClipboardList, Globe } from 'lucide-react';
import { PALETTE, GRADIENT } from '../../theme';

const MotionBox = motion(Box);


const TAB_ITEMS = [
  { label: 'Tổng quan', icon: <Home size={18} />, active: false },
  { label: 'Vị trí', icon: <MapPin size={18} />, active: false },
  { label: 'Phân khu', icon: <Compass size={18} />, active: false },
  { label: 'Mặt bằng quỹ căn', icon: <Map size={18} />, active: true },
  { label: 'Quỹ căn', icon: <Building2 size={18} />, active: false },
  { label: 'Chính sách bán hàng', icon: <ClipboardList size={18} />, active: false },
  { label: 'Tin tức', icon: <Globe size={18} />, active: false },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const HeroSection = () => {
  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 3, md: 4 },
        px: { xs: 1.5, md: 3 },
        pt: 2,
        pb: 3,
      }}
    >
      {/* Breadcrumb */}
      <MotionBox variants={itemVariants} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '0.9375rem',
            lineHeight: '25px',
            color: PALETTE.PRIMARY,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          Dự án
        </Typography>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '0.9375rem',
            lineHeight: '25px',
            color: PALETTE.PRIMARY,
          }}
        >
          /
        </Typography>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: '0.9375rem',
            lineHeight: '25px',
            color: PALETTE.TEXT_PRIMARY,
          }}
        >
          Vinhomes Ocean Park 3
        </Typography>
      </MotionBox>

      {/* Title + Share */}
      <MotionBox
        variants={itemVariants}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'flex-end' },
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.5rem', md: '2rem' },
              textTransform: 'uppercase',
              color: PALETTE.PRIMARY,
            }}
          >
            Vinhomes Ocean Park 3
          </Typography>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: { xs: '0.9375rem', md: '1.0625rem' },
              color: PALETTE.TEXT_SECONDARY,
            }}
          >
            Theo dõi thông tin chi tiết và bảng giá, mặt bằng, tiến độ và chính sách bán hàng dự án VINHOMES OCEAN PARK 3.
          </Typography>
        </Box>

        <MotionBox
          whileHover={{ scale: 1.05, opacity: 0.9 }}
          whileTap={{ scale: 0.95 }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            px: 3,
            py: 1.5,
            background: GRADIENT.PRIMARY,
            borderRadius: '8px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '0.9375rem',
              color: PALETTE.SURFACE_LIGHT,
            }}
          >
            ↗ Chia sẻ
          </Typography>
        </MotionBox>
      </MotionBox>

      {/* Hero Image */}
      <MotionBox
        variants={itemVariants}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        sx={{
          width: '100vw',
          position: 'relative',
          left: '50%',
          marginLeft: '-50vw',
          height: { xs: 'auto', md: '75vh' },
          overflow: 'hidden',
          mt: { xs: 1, md: 2 },
          mb: { xs: 1, md: 2 },
        }}
      >
        <Box
          component={motion.img}
          src="/hero.png"
          alt="Vinhomes Ocean Park 3"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          sx={{
            width: '100%',
            height: { xs: 'auto', md: '100%' },
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </MotionBox>

      {/* Tab navigation */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, md: 3 },
          px: 2,
          py: 2,
          background: GRADIENT.PRIMARY,
          borderRadius: '16px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {TAB_ITEMS.map((tab) => (
          <MotionBox
            key={tab.label}
            whileHover={{ scale: 1.05 }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              px: { xs: 2, md: 3 },
              py: { xs: 1.5, md: 2 },
              borderRadius: '32px',
              backgroundColor: tab.active
                ? 'rgba(42, 82, 190, 0.2)'
                : PALETTE.BACKGROUND_DEFAULT + '00',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
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
          </MotionBox>
        ))}
      </Box>

    </MotionBox>
  );
};

export default HeroSection;