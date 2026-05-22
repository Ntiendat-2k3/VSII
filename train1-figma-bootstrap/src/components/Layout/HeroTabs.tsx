import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, MapPin, Compass, Map, Building2, ClipboardList, Globe } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  Icon: LucideIcon;
}

const TAB_ITEMS: TabItem[] = [
  { id: 'overview', label: 'Tổng quan', Icon: Home },
  { id: 'location', label: 'Vị trí', Icon: MapPin },
  { id: 'sections', label: 'Phân khu', Icon: Compass },
  { id: 'layout', label: 'Mặt bằng quỹ căn', Icon: Map },
  { id: 'units', label: 'Quỹ căn', Icon: Building2 },
  { id: 'policy', label: 'Chính sách bán hàng', Icon: ClipboardList },
  { id: 'news', label: 'Tin tức', Icon: Globe },
];

interface HeroTabsProps {
  defaultTabId?: string;
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
}

const HeroTabs: React.FC<HeroTabsProps> = ({
  defaultTabId = 'layout',
  activeTabId,
  onTabChange,
}) => {
  const [localActiveTab, setLocalActiveTab] = useState(defaultTabId);
  const currentActiveId = activeTabId !== undefined ? activeTabId : localActiveTab;

  const handleTabClick = (tabId: string) => {
    if (activeTabId === undefined) {
      setLocalActiveTab(tabId);
    }
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div
      className="hero-tabs d-flex align-items-center justify-content-md-center gap-1 gap-md-3"
      role="tablist"
      aria-label="Dự án điều hướng"
    >
      {TAB_ITEMS.map(({ id, label, Icon }) => {
        const isActive = currentActiveId === id;

        return (
          <motion.button
            key={id}
            role="tab"
            aria-selected={isActive}
            tabIndex={0}
            className={`hero-tab-item d-flex align-items-center gap-2 ${isActive ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleTabClick(id)}
            type="button"
          >
            <span className="hero-tab-icon" aria-hidden="true">
              <Icon size={18} />
            </span>
            <span className="hero-tab-label">{label}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default HeroTabs;
