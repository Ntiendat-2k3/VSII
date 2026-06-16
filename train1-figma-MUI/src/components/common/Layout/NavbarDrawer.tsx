import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import { m } from 'framer-motion';
import { PALETTE } from '../../../theme';

const MotionBox = m(Box);

interface NavbarDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: string[];
}

const NavbarDrawer = ({ open, onClose, navItems }: NavbarDrawerProps) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: { width: 250, p: 2, backgroundColor: PALETTE.BACKGROUND_DEFAULT },
        },
      }}
    >
      <Stack direction="row" sx={{ justifyContent: 'flex-end', mb: 2 }}>
        <IconButton onClick={onClose} aria-label="Đóng menu">
          <CloseIcon />
        </IconButton>
      </Stack>
      <Stack spacing={3}>
        {navItems.map((item) => (
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
            onClick={onClose}
          >
            {item}
          </Typography>
        ))}
        <Stack direction="row" spacing={1} sx={{ mt: 2, alignItems: 'center' }}>
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
      </Stack>
    </Drawer>
  );
};

export default NavbarDrawer;
