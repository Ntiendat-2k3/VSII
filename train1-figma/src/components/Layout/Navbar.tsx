import { useState } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { motion } from 'framer-motion';
import NavbarDrawer from './NavbarDrawer';
import { PALETTE, SHADOW } from '../../theme';

const MotionTypography = motion(Typography);
const MotionBox = motion(Box);

const NAV_ITEMS = ['GIỚI THIỆU', 'DỰ ÁN', 'TIN TỨC'];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <Stack
      component="header"
      direction="row"
      sx={{
        px: { xs: 1.5, md: 3 },
        py: 1.5,
        backgroundColor: PALETTE.BACKGROUND_DEFAULT,
        borderBottom: `1px solid ${PALETTE.BACKGROUND_PAPER}`,
        boxShadow: SHADOW.HEADER,
        backdropFilter: 'blur(13px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        justifyContent: 'space-between',
        alignItems: 'center',
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
      <Stack
        direction="row"
        spacing={4}
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
        }}
      >
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
      </Stack>

      {/* Right side - Online counter & User Icon */}
      <Stack direction="row" spacing={{ xs: 1, sm: 4 }} sx={{ alignItems: 'center' }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
          }}
        >
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
        </Stack>
        
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
          whileHover={{ scale: 1.1, backgroundColor: PALETTE.PRIMARY, color: PALETTE.WHITE }}
          whileTap={{ scale: 0.9 }}
        >
          <Typography sx={{ fontSize: '1.25rem' }}>👤</Typography>
        </MotionBox>

        {/* Mobile Menu Toggle */}
        <IconButton
          color="inherit"
          aria-label="Mở menu"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { md: 'none' }, ml: 1 }}
        >
          <MenuIcon />
        </IconButton>
      </Stack>

      {/* Mobile Drawer */}
      <NavbarDrawer
        open={mobileOpen}
        onClose={handleDrawerToggle}
        navItems={NAV_ITEMS}
      />
    </Stack>
  );
};

export default Navbar;
