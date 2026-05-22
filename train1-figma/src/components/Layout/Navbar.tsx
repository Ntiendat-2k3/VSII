import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import { motion } from 'framer-motion';
import { PALETTE, SHADOW } from '../../theme';

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

const NAV_ITEMS = ['GIỚI THIỆU', 'DỰ ÁN', 'TIN TỨC'];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <Box
      component="header"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: { xs: 1.5, md: 3 },
        py: 1.5,
        backgroundColor: PALETTE.BACKGROUND_DEFAULT,
        borderBottom: `1px solid ${PALETTE.BACKGROUND_PAPER}`,
        boxShadow: SHADOW.HEADER,
        backdropFilter: 'blur(13px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <MotionBox
        sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Box
          component="img"
          src="/logo.png"
          alt="Realestate Logo"
          sx={{ height: 40, width: 'auto', objectFit: 'contain' }}
        />
      </MotionBox>

      {/* Desktop Menu */}
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 4 }}>
        {NAV_ITEMS.map((item) => (
          <MotionTypography
            key={item}
            sx={{
              fontWeight: 500,
              fontSize: '1.0625rem',
              lineHeight: '25px',
              textTransform: 'uppercase',
              color: PALETTE.TEXT_DISABLED,
              cursor: 'pointer',
            }}
            whileHover={{ color: PALETTE.PRIMARY, y: -2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {item}
          </MotionTypography>
        ))}
      </Box>

      {/* Right side - Online counter & User Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 4 } }}>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
          <MotionBox
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: PALETTE.ACCENT_GREEN,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '0.8125rem',
              color: PALETTE.TEXT_SECONDARY,
            }}
          >
            100 người đang Online
          </Typography>
        </Box>
        <MotionBox
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: PALETTE.BACKGROUND_PAPER,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          whileHover={{ scale: 1.1, backgroundColor: PALETTE.PRIMARY, color: '#fff' }}
          whileTap={{ scale: 0.9 }}
        >
          <Typography sx={{ fontSize: '1.25rem' }}>👤</Typography>
        </MotionBox>

        {/* Mobile Menu Toggle */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none' }, ml: 1 }}
        >
          <MenuIcon />
        </IconButton>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        slotProps={{
          paper: {
            sx: { width: 250, p: 2, backgroundColor: PALETTE.BACKGROUND_DEFAULT },
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV_ITEMS.map((item) => (
            <Typography
              key={item}
              sx={{
                fontWeight: 600,
                fontSize: '1.125rem',
                color: PALETTE.TEXT_PRIMARY,
                borderBottom: `1px solid ${PALETTE.BACKGROUND_PAPER}`,
                pb: 1,
                cursor: 'pointer',
                '&:hover': { color: PALETTE.PRIMARY },
              }}
              onClick={handleDrawerToggle}
            >
              {item}
            </Typography>
          ))}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
            <MotionBox
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: PALETTE.ACCENT_GREEN,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: '0.8125rem',
                color: PALETTE.TEXT_SECONDARY,
              }}
            >
              100 người đang Online
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;
