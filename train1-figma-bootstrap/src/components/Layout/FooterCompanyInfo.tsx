import { Phone, Mail, MapPin } from 'lucide-react';
import { PALETTE } from '../../theme';

const FooterCompanyInfo = () => {
  return (
    <div className="d-flex flex-column gap-3 align-items-start" style={{ maxWidth: 373 }}>
      <div className="d-flex align-items-center gap-2 justify-content-start">
        <img
          src="/logo-white.png"
          alt="Realestate Company Logo"
          className="footer-logo"
        />
        <span className="footer-company-desc">
          Nền tảng công nghệ tiên phong &amp; dẫn đầu lĩnh vực kinh doanh bất động sản tại Việt Nam
        </span>
      </div>

      <div className="d-flex flex-column gap-2 align-items-start">
        <div className="d-flex align-items-center gap-2">
          <Phone size={16} color={PALETTE.BACKGROUND_DEFAULT} />
          <span className="footer-contact-text">0972 72 9999</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Mail size={16} color={PALETTE.BACKGROUND_DEFAULT} />
          <span className="footer-contact-text">Contact@gmail.com</span>
        </div>
        <div className="d-flex align-items-start gap-2 pt-1">
          <div className="mt-1">
            <MapPin size={16} color={PALETTE.BACKGROUND_DEFAULT} />
          </div>
          <span className="footer-address">
            SB24-36, Sao Biển 24, KĐT Vinhomes Ocean Park, Xã Gia Lâm, TP Hà Nội, Việt Nam
          </span>
        </div>
      </div>
    </div>
  );
};

export default FooterCompanyInfo;
