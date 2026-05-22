import type { PropertyStatus } from '../../types/property';

interface PopupFooterProps {
  status: PropertyStatus;
  listedPrice: number;
  loanPrice: number;
}

const PopupFooter = ({ status, listedPrice, loanPrice }: PopupFooterProps) => {
  if (status === 'available') {
    return (
      <div className="d-flex flex-column gap-1">
        <div className="d-flex justify-content-between align-items-center">
          <span className="popup-price-label">Giá niêm yết:</span>
          <span className="popup-price-value">{listedPrice} tỷ</span>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <span className="popup-price-label">Giá vay:</span>
          <span className="popup-price-value">{loanPrice} tỷ</span>
        </div>
      </div>
    );
  }

  if (status === 'sold') {
    return (
      <div className="popup-sold-badge">Đã bán</div>
    );
  }

  /* status === 'contact' */
  return (
    <div className="d-flex flex-column gap-1">
      <span className="popup-hidden-text">Quỹ ẩn</span>
      <button type="button" className="popup-cta-btn">
        Xin thông tin
      </button>
    </div>
  );
};

export default PopupFooter;
