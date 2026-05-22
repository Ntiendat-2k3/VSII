import React from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import HeroTabs from './HeroTabs';

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

interface HeroSectionProps {
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ activeTab, onTabChange }) => {
  return (
    <motion.div
      className="hero-section d-flex flex-column gap-3 gap-md-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Breadcrumb */}
      <motion.div className="d-flex align-items-center gap-1" variants={itemVariants}>
        <span className="breadcrumb-link">Dự án</span>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">Vinhomes Ocean Park 3</span>
      </motion.div>

      {/* Title + Share */}
      <motion.div
        className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-end gap-3"
        variants={itemVariants}
      >
        <div className="d-flex flex-column gap-2 flex-grow-1">
          <h1 className="hero-title">Vinhomes Ocean Park 3</h1>
          <p className="hero-subtitle mb-0">
            Theo dõi thông tin chi tiết và bảng giá, mặt bằng, tiến độ và chính sách bán hàng dự án VINHOMES OCEAN PARK 3.
          </p>
        </div>

        <motion.button
          className="share-btn d-flex align-items-center gap-2"
          whileHover={{ scale: 1.05, opacity: 0.9 }}
          whileTap={{ scale: 0.95 }}
          type="button"
        >
          ↗ Chia sẻ
        </motion.button>
      </motion.div>

      {/* Hero Image */}
      <motion.div
        className="hero-image-wrapper mt-1 mt-md-2 mb-1 mb-md-2"
        variants={itemVariants}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <motion.img
          src="/hero.png"
          alt="Vinhomes Ocean Park 3"
          className="hero-image"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </motion.div>

      {/* Tab navigation */}
      <HeroTabs activeTabId={activeTab} onTabChange={onTabChange} />
    </motion.div>
  );
};

export default HeroSection;