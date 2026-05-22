import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import NavbarDrawer from './NavbarDrawer';
import { PALETTE } from '../../theme';

interface NavItem {
  id: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'intro', label: 'GIỚI THIỆU' },
  { id: 'projects', label: 'DỰ ÁN' },
  { id: 'news', label: 'TIN TỨC' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  return (
    <header className="navbar-custom d-flex align-items-center justify-content-between">
      {/* Logo */}
      <motion.div
        className="d-flex align-items-center gap-2 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img
          src="/logo.png"
          alt="Realestate Logo"
          className="navbar-logo"
        />
      </motion.div>

      {/* Desktop Menu */}
      <nav className="d-none d-md-flex align-items-center gap-4" role="menubar">
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            role="menuitem"
            className="nav-link-custom border-0 bg-transparent"
            whileHover={{ color: PALETTE.PRIMARY, y: -2 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {item.label}
          </motion.button>
        ))}
      </nav>

      {/* Right side - Online counter & User Icon */}
      <div className="d-flex align-items-center gap-2 gap-sm-4">
        <div className="d-none d-sm-flex align-items-center gap-2">
          <motion.div
            className="online-dot"
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
          <span className="text-caption text-secondary">
            100 người đang Online
          </span>
        </div>

        <motion.button
          type="button"
          className="user-avatar border-0"
          whileHover={{ scale: 1.1, backgroundColor: PALETTE.PRIMARY }}
          whileTap={{ scale: 0.9 }}
          aria-label="Thông tin tài khoản"
        >
          <span style={{ fontSize: '1.25rem' }}>👤</span>
        </motion.button>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-btn d-md-none"
          onClick={handleDrawerToggle}
          aria-label="Mở menu"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Drawer */}
      <NavbarDrawer
        open={mobileOpen}
        onClose={handleDrawerToggle}
        navItems={NAV_ITEMS}
      />
    </header>
  );
};

export default Navbar;
