import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Navbar from './components/Layout/Navbar';
import HeroSection from './components/Layout/HeroSection';
import PropertyMap from './components/PropertyMap';
import Footer from './components/Layout/Footer';

const App = () => {
  const [activeTab, setActiveTab] = useState('layout');

  // Khung hoạt ảnh chuyển đổi tab mượt mà
  const viewVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.2 } }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'layout':
        return (
          <motion.div key="layout" variants={viewVariants} initial="hidden" animate="visible" exit="exit">
            <PropertyMap />
          </motion.div>
        );

      case 'overview':
        return (
          <motion.div 
            key="overview" 
            variants={viewVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit"
            className="card border-0 shadow-sm p-4 bg-white rounded-4"
          >
            <h2 className="fs-3 fw-bold text-primary mb-3 text-uppercase">Tổng Quan Dự Án</h2>
            <p className="text-secondary mb-4 lh-lg">
              Vinhomes Ocean Park 3 (The Crown) là hợp phần cuối cùng của siêu quần thị đô thị biển 1.200ha Vinhomes Ocean Park tại phía Đông Hà Nội. Sở hữu vị trí đắc địa bậc nhất cùng hệ thống tiện ích đẳng cấp thế giới, dự án mang đến không gian sống phong cách nghỉ dưỡng biển đỉnh cao cho cộng đồng cư dân tinh hoa.
            </p>
            <div className="row g-3">
              {[
                { title: 'Chủ đầu tư', val: 'Tập đoàn Vingroup' },
                { title: 'Tổng diện tích', val: '294 ha' },
                { title: 'Mật độ xây dựng', val: 'Chỉ khoảng 35%' },
                { title: 'Vị trí tọa lạc', val: 'Huyện Văn Giang & Văn Lâm, Tỉnh Hưng Yên' },
                { title: 'Dòng sản phẩm', val: 'Biệt thự, Liền kề, Shophouse, Căn hộ' },
                { title: 'Tiện ích điểm nhấn', val: 'Vịnh biển bốn mùa Paradise Bay 12ha' },
              ].map((item, idx) => (
                <div key={idx} className="col-12 col-md-6 col-lg-4">
                  <div className="p-3 border rounded-3 bg-light h-100 transition-hover">
                    <span className="text-muted d-block small mb-1">{item.title}</span>
                    <span className="fw-semibold text-dark">{item.val}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'location':
        return (
          <motion.div 
            key="location" 
            variants={viewVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit"
            className="card border-0 shadow-sm p-4 bg-white rounded-4"
          >
            <h2 className="fs-3 fw-bold text-primary mb-3 text-uppercase">Vị Trí Kim Cương</h2>
            <p className="text-secondary mb-4 lh-lg">
              Tọa lạc tại tâm điểm kết nối huyết mạch của hai tỉnh Hưng Yên và TP. Hà Nội, kế cận đường cao tốc Hà Nội - Hải Phòng và đường vành đai 3.5, Vinhomes Ocean Park 3 sở hữu mạng lưới giao thông liên vùng vô cùng hoàn hảo, giúp cư dân dễ dàng di chuyển vào trung tâm thủ đô cũng như các tỉnh thành lân cận.
            </p>
            <div className="row g-3 align-items-center">
              <div className="col-12 col-lg-7">
                <div className="rounded-3 overflow-hidden border shadow-sm position-relative ratio ratio-16x9">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14902.946358245593!2d106.01524388835848!3d20.963102396112933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a5078519e487%3A0xe54d360fbf83a939!2sVinhomes%20Ocean%20Park%203!5e0!3m2!1svi!2s!4v1716388000000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1716388000000!5m2!1svi!2s" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy"
                    title="Bản đồ Vinhomes Ocean Park 3"
                  ></iframe>
                </div>
              </div>
              <div className="col-12 col-lg-5">
                <div className="d-flex flex-column gap-3">
                  {[
                    { time: '1 phút', label: 'Kết nối trực tiếp đường Cao tốc Hà Nội - Hải Phòng' },
                    { time: '3 phút', label: 'Di chuyển sang Đại đô thị Vinhomes Ocean Park 2' },
                    { time: '10 phút', label: 'Đến nút giao Cổ Linh và cầu Vĩnh Tuy' },
                    { time: '20 phút', label: 'Vào trung tâm hồ Hoàn Kiếm, thủ đô Hà Nội' },
                  ].map((loc, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-3 p-3 border rounded-3 bg-light">
                      <span className="badge bg-primary px-3 py-2 fs-6 rounded-pill">{loc.time}</span>
                      <span className="text-secondary small fw-medium">{loc.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'sections':
        return (
          <motion.div 
            key="sections" 
            variants={viewVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit"
            className="card border-0 shadow-sm p-4 bg-white rounded-4"
          >
            <h2 className="fs-3 fw-bold text-primary mb-3 text-uppercase">Các Phân Khu Điểm Nhấn</h2>
            <p className="text-secondary mb-4 lh-lg">
              Vinhomes Ocean Park 3 được chia thành nhiều phân khu với các phong cách thiết kế kiến trúc đặc trưng độc đáo từ châu Âu cổ điển đến hiện đại, mang tới nhiều lựa chọn sống đa dạng phong phú cho từng chủ nhân.
            </p>
            <div className="row g-3">
              {[
                { name: 'Phân khu Phố Biển', desc: 'Thiết kế năng động, phố mua sắm sầm uất kế cận vịnh biển kỳ quan Paradise Bay.', color: 'rgba(42, 82, 190, 0.05)' },
                { name: 'Phân khu Thời Đại', desc: 'Mang nét kiến trúc Đông Dương sang trọng, thanh lịch với vị trí cửa ngõ đắc địa.', color: 'rgba(0, 180, 216, 0.05)' },
                { name: 'Phân khu Vịnh Thiên Đường', desc: 'Trái tim của khu đô thị, sở hữu tầm nhìn trực diện hồ bơi saltwater và công viên nước.', color: 'rgba(0, 200, 179, 0.05)' },
                { name: 'Phân khu Vịnh Tây', desc: 'Tái hiện kiến trúc châu Âu cổ kính với không gian sống yên bình, lãng mạn.', color: 'rgba(255, 56, 60, 0.05)' },
              ].map((sec, idx) => (
                <div key={idx} className="col-12 col-sm-6">
                  <div className="p-3 border rounded-3 h-100" style={{ backgroundColor: sec.color }}>
                    <h4 className="fs-5 fw-bold text-dark mb-2">{sec.name}</h4>
                    <p className="text-secondary mb-0 small lh-base">{sec.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'units':
        return (
          <motion.div 
            key="units" 
            variants={viewVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit"
            className="card border-0 shadow-sm p-4 bg-white rounded-4"
          >
            <h2 className="fs-3 fw-bold text-primary mb-3 text-uppercase">Thống Kê Quỹ Căn Trống</h2>
            <p className="text-secondary mb-4 lh-lg">
              Cập nhật trực tiếp số lượng quỹ căn hộ, liền kề, biệt thự đang mở bán hoặc đã hoàn thành đặt cọc tại dự án Vinhomes Ocean Park 3.
            </p>
            <div className="table-responsive border rounded-3 overflow-hidden shadow-sm">
              <table className="table table-hover align-middle mb-0 text-center">
                <thead className="table-primary text-uppercase small text-nowrap">
                  <tr>
                    <th scope="col" className="py-3 text-start ps-4">Loại hình sản phẩm</th>
                    <th scope="col" className="py-3">Tổng số căn</th>
                    <th scope="col" className="py-3">Đang mở bán</th>
                    <th scope="col" className="py-3">Đã cọc / Bán</th>
                    <th scope="col" className="py-3 pe-4 text-end">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="small">
                  {[
                    { type: 'Biệt thự Đơn lập', total: 120, open: 12, sold: 108, status: 'Quỹ căn hiếm' },
                    { type: 'Biệt thự Song lập', total: 350, open: 24, sold: 326, status: 'Đang mở bán' },
                    { type: 'Biệt thự Tứ lập', total: 280, open: 15, sold: 265, status: 'Đang mở bán' },
                    { type: 'Nhà liền kề', total: 1200, open: 56, sold: 1144, status: 'Hot deal' },
                    { type: 'Shophouse kinh doanh', total: 450, open: 18, sold: 432, status: 'Vị trí đẹp' },
                  ].map((unit, idx) => (
                    <tr key={idx}>
                      <td className="fw-semibold text-dark text-start py-3 ps-4">{unit.type}</td>
                      <td>{unit.total}</td>
                      <td className="text-primary fw-semibold">{unit.open}</td>
                      <td className="text-danger fw-semibold">{unit.sold}</td>
                      <td className="pe-4 text-end">
                        <span className="badge bg-light text-primary border border-primary px-2 py-1 rounded-pill">{unit.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        );

      case 'policy':
        return (
          <motion.div 
            key="policy" 
            variants={viewVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit"
            className="card border-0 shadow-sm p-4 bg-white rounded-4"
          >
            <h2 className="fs-3 fw-bold text-primary mb-3 text-uppercase">Chính Sách Bán Hàng Ưu Đãi</h2>
            <p className="text-secondary mb-4 lh-lg">
              Sở hữu ngay tổ ấm mơ ước tại thành phố nghỉ dưỡng Vinhomes Ocean Park 3 với các giải pháp tài chính siêu việt chưa từng có trên thị trường.
            </p>
            <div className="row g-3">
              {[
                { title: 'Hỗ trợ tài chính vàng', value: 'Hỗ trợ Lãi Suất 0%', desc: 'Được hỗ trợ lãi suất vay ngân hàng 0% trong suốt 24 tháng đầu tiên kể từ thời điểm giải ngân.' },
                { title: 'Ưu đãi thanh toán sớm', value: 'Chiết khấu tới 10%', desc: 'Hưởng mức chiết khấu cực kỳ hấp dẫn lên tới 10% trên tổng giá trị căn hộ khi thanh toán sớm.' },
                { title: 'Quà tặng tân gia khủng', value: 'Voucher VinFast 200tr', desc: 'Nhận ngay Voucher mua xe ô tô điện VinFast thời thượng trị giá lên đến 200.000.000 VNĐ.' },
              ].map((pol, idx) => (
                <div key={idx} className="col-12 col-md-4">
                  <div className="p-4 border rounded-3 bg-light h-100 shadow-sm border-top border-primary border-4 text-center">
                    <span className="text-muted d-block small mb-2 text-uppercase fw-bold">{pol.title}</span>
                    <h3 className="fs-4 text-primary fw-bold mb-3">{pol.value}</h3>
                    <p className="text-secondary mb-0 small lh-base">{pol.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case 'news':
        return (
          <motion.div 
            key="news" 
            variants={viewVariants} 
            initial="hidden" 
            animate="visible" 
            exit="exit"
            className="card border-0 shadow-sm p-4 bg-white rounded-4"
          >
            <h2 className="fs-3 fw-bold text-primary mb-3 text-uppercase">Tin Tức Dự Án Mới Nhất</h2>
            <p className="text-secondary mb-4 lh-lg">
              Cập nhật liên tục tiến độ xây dựng hạ tầng, hình ảnh bàn giao thực tế và các sự kiện cộng đồng sôi động tại Vinhomes Ocean Park 3.
            </p>
            <div className="row g-3">
              {[
                { title: 'Tiến độ xây dựng Vinhomes Ocean Park 3 mới nhất tháng 5/2026', date: '22/05/2026', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&auto=format&fit=crop&q=60' },
                { title: 'Khai trương vịnh biển kỳ quan Paradise Bay - Điểm đến giải trí hàng đầu', date: '15/05/2026', img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&auto=format&fit=crop&q=60' },
                { title: 'Lễ ký kết bàn giao và vận hành các tổ hợp công viên nước đại dương', date: '08/05/2026', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=60' },
              ].map((news, idx) => (
                <div key={idx} className="col-12 col-md-4">
                  <div className="card h-100 border overflow-hidden shadow-sm hover-card transition-hover">
                    <div style={{ height: '180px', overflow: 'hidden' }}>
                      <img src={news.img} alt={news.title} className="w-100 h-100 object-fit-cover transition-scale" />
                    </div>
                    <div className="card-body p-3">
                      <span className="text-muted d-block small mb-2">{news.date}</span>
                      <h4 className="fs-6 fw-bold text-dark mb-0 lh-base line-clamp-2">{news.title}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container d-flex flex-column">
      <Navbar />

      <main className="app-main">
        <HeroSection activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Dynamic Map & Information Section */}
        <div className="px-0 px-md-3 pb-4 pb-md-5 mt-3 mt-md-4">
          <div className="container-fluid px-2 px-md-3">
            <AnimatePresence mode="wait">
              {renderTabContent()}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
