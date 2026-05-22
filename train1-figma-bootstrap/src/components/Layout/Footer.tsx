import { motion } from 'framer-motion';
import FooterCompanyInfo from './FooterCompanyInfo';
import { PALETTE } from '../../theme';

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={PALETTE.WHITE}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={PALETTE.WHITE}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
    <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="#2A52BE" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PALETTE.WHITE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={PALETTE.WHITE}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SOCIAL_ITEMS = [
  { id: 'fb', icon: <FacebookIcon /> },
  { id: 'yt', icon: <YoutubeIcon /> },
  { id: 'ig', icon: <InstagramIcon /> },
  { id: 'tw', icon: <TwitterIcon /> },
];

const Footer = () => {
  return (
    <footer className="footer-custom d-flex flex-column gap-3">
      <div className="d-flex flex-column flex-md-row gap-4 justify-content-between align-items-start">
        {/* Company info subcomponent */}
        <FooterCompanyInfo />

        <div className="d-flex flex-column flex-md-row gap-4 gap-md-5 flex-grow-1 justify-content-end w-100">
          <div className="d-flex flex-column flex-sm-row gap-4 gap-md-5 justify-content-start">
            {/* Menu */}
            <div className="d-flex flex-column gap-2 align-items-start">
              <span className="footer-heading">Danh mục</span>
              <div className="d-flex flex-column gap-1 align-items-start">
                {['Giới thiệu', 'Dự án', 'Liên hệ'].map((item) => (
                  <span key={item} className="footer-link">
                    - {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="d-flex flex-column gap-2 align-items-start">
              <span className="footer-heading">Kết nối</span>
              <div className="d-flex gap-2 justify-content-start">
                {SOCIAL_ITEMS.map((item) => (
                  <motion.button
                    key={item.id}
                    className="social-icon-btn"
                    whileHover={{ backgroundColor: PALETTE.WHITE_ALPHA_30, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {item.icon}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Map iframe */}
          <div className="footer-map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.811559902302!2d105.93818311540199!3d20.985929986021655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a1a1f5928f09%3A0x633d2fc1a11db9d9!2zVmluaG9tZXMgT2NlYW4gUGFyayBHaWEgTMOibQ!5e0!3m2!1svi!2s!4v1689000000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              title="Vinhomes Ocean Park Map Location"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        © 2026 - Realestate. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
