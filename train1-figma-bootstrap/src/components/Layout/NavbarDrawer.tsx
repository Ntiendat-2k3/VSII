import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
}

interface NavbarDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

const NavbarDrawer = ({ open, onClose, navItems }: NavbarDrawerProps) => {
  const offcanvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = offcanvasRef.current;
    if (!el) return;

    let bsOffcanvas: { show: () => void; hide: () => void; dispose: () => void } | null = null;

    const initOffcanvas = async () => {
      const bootstrap = await import('bootstrap');
      const instance = new bootstrap.Offcanvas(el, { backdrop: true });
      bsOffcanvas = instance;

      if (open) {
        instance.show();
      }
    };

    initOffcanvas();

    const handleHidden = () => {
      onClose();
    };

    el.addEventListener('hidden.bs.offcanvas', handleHidden);

    return () => {
      el.removeEventListener('hidden.bs.offcanvas', handleHidden);
      if (bsOffcanvas) {
        bsOffcanvas.dispose();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = offcanvasRef.current;
    if (!el) return;

    const initAndToggle = async () => {
      const bootstrap = await import('bootstrap');
      const instance = bootstrap.Offcanvas.getOrCreateInstance(el);

      if (open) {
        instance.show();
      } else {
        instance.hide();
      }
    };

    initAndToggle();
  }, [open]);

  return (
    <div
      ref={offcanvasRef}
      className="offcanvas offcanvas-end offcanvas-custom"
      tabIndex={-1}
      aria-labelledby="navbarDrawerLabel"
    >
      <div className="offcanvas-header justify-content-end">
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Đóng menu"
        />
      </div>
      <div className="offcanvas-body">
        <div className="d-flex flex-column gap-3" role="menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className="offcanvas-nav-link text-start border-0 bg-transparent w-100"
              onClick={onClose}
            >
              {item.label}
            </button>
          ))}
          <div className="d-flex align-items-center gap-2 mt-2">
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
        </div>
      </div>
    </div>
  );
};

export default NavbarDrawer;
