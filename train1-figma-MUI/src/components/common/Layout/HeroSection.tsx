import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import type { Variants } from 'framer-motion';
import HeroTabs from './HeroTabs';
import { PALETTE, GRADIENT } from '../../../theme';

const MotionStack = m(Stack);
const MotionBox = m(Box);

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
    <MotionStack
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      spacing={{ xs: 3, md: 4 }}
      sx={{
        width: '100%',
        pt: 2,
        pb: 3,
      }}
    >
      {/* Centered content header */}
      <Stack
        spacing={{ xs: 3, md: 4 }}
        sx={{
          maxWidth: 1440,
          mx: 'auto',
          width: '100%',
          px: { xs: 1.5, md: 3 },
        }}
      >
        {/* Breadcrumb */}
        <MotionStack direction="row" spacing={0.5} sx={{ alignItems: 'center' }} variants={itemVariants}>
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
        </MotionStack>

        {/* Title + Share */}
        <MotionStack
          variants={itemVariants}
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
          }}
        >
          <Stack spacing={1} sx={{ flex: 1 }}>
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
          </Stack>

          <MotionStack
            direction="row"
            spacing={1}
            whileHover={{ scale: 1.05, opacity: 0.9 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              px: 3,
              py: 1.5,
              background: GRADIENT.PRIMARY,
              borderRadius: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              alignItems: 'center',
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
          </MotionStack>
        </MotionStack>
      </Stack>

      {/* Hero Image */}
      <MotionBox
        variants={itemVariants}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        sx={{
          width: '100%',
          height: { xs: 'auto', md: '75vh' },
          overflow: 'hidden',
          mt: { xs: 1, md: 2 },
          mb: { xs: 1, md: 2 },
        }}
      >
        <Box
          component={m.img}
          src="/hero.png"
          alt="Vinhomes Ocean Park 3"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
          }}
        />
      </MotionBox>

      {/* Tab navigation */}
      <Box
        sx={{
          maxWidth: 1440,
          mx: 'auto',
          width: '100%',
          px: { xs: 1.5, md: 3 },
        }}
      >
        <HeroTabs />
      </Box>
    </MotionStack>
  );
};

export default HeroSection;