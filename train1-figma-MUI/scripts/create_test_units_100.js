import readline from 'readline';
import crypto from 'crypto';

const BASE_URL = 'https://api-uat.vinhomes.biz.vn/hovixi/api/v1';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  console.log('=== KHỞI TẠO 100 CĂN HỘ MẪU TEST GẦN CÁC CĂN THỰC TẾ ===\n');

  // Cho phép nhập hoặc mặc định
  const username = await question('Nhập tài khoản Admin: ');
  const password = await question('Nhập mật khẩu Admin: ');
  const projectIdStr = await question('Nhập Project ID (mặc định: 7): ');
  const projectId = parseInt(projectIdStr, 10) || 7;

  rl.close();

  try {
    console.log('\n[1/4] Đang đăng nhập...');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': crypto.randomUUID(),
        'Locale': 'vi'
      },
      body: JSON.stringify({ username, password })
    });

    const loginData = await loginRes.json();
    if (loginData.code !== 'SUCCESS' || !loginData.data?.accessToken) {
      throw new Error(`Đăng nhập thất bại: ${loginData.message || JSON.stringify(loginData)}`);
    }

    const token = loginData.data.accessToken;
    console.log('=> Đăng nhập thành công.');

    console.log('\n[2/4] Đang lấy thông tin bản đồ của dự án...');
    const mapRes = await fetch(`${BASE_URL}/portal/map/get?mapType=PROJECT&refId=${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Request-Id': crypto.randomUUID(),
        'Locale': 'vi'
      }
    });

    const mapData = await mapRes.json();
    if (mapData.code !== 'SUCCESS' || !mapData.data?.id) {
      throw new Error(`Không lấy được thông tin bản đồ: ${mapData.message || JSON.stringify(mapData)}`);
    }

    const mapId = mapData.data.id;
    const pageWidth = mapData.data.pageWidth || 3370.39;
    const pageHeight = mapData.data.pageHeight || 2383.94;
    console.log(`=> Lấy thông tin bản đồ thành công. Map ID: ${mapId}, Kích thước: ${pageWidth} x ${pageHeight}`);

    // Anchor points from the user's UAT units
    const anchors = [
      { x: 2331.3997, y: 532.6560, name: 'VU6-34' },
      { x: 1487.0575, y: 919.0079, name: 'LV1-06' },
      { x: 2462.5139, y: 757.2960, name: 'VK8-29' },
      { x: 2465.5378, y: 738.2880, name: 'VK6-56' },
      { x: 2373.3254, y: 996.2797, name: 'TK8-04' },
      { x: 2410.3860, y: 658.2240, name: 'VK1-18' },
      { x: 2391.8098, y: 657.9360, name: 'VK1-02' }
    ];

    // Chuẩn bị 100 căn hộ mẫu đủ các loại hình và trạng thái
    const unitTypes = ['SHOPHOUSE', 'TOWNHOUSE', 'DETACHED', 'SEMI_DETACHED'];
    const statuses = ['AVAILABLE', 'SOLD'];
    const units = [];
    const markers = [];
    const inquiryUnitCodes = [];

    // Tạo mã căn ngẫu nhiên từ 10 đến 99 để tránh trùng lặp
    const suffix = Math.floor(10 + Math.random() * 90);

    for (let i = 0; i < 100; i++) {
      const typeIndex = i % unitTypes.length;
      const statusIndex = Math.floor(i / unitTypes.length) % statuses.length;
      const anchor = anchors[i % anchors.length];
      
      const unitType = unitTypes[typeIndex];
      const status = statuses[statusIndex];
      const isHot = i % 4 === 0;

      let prefix = 'LK'; // TOWNHOUSE
      if (unitType === 'SHOPHOUSE') prefix = 'SH';
      if (unitType === 'DETACHED') prefix = 'DL';
      if (unitType === 'SEMI_DETACHED') prefix = 'SL';

      const unitCode = `T-${prefix}-${suffix}-${String(i + 1).padStart(3, '0')}`;

      // Để 20% số căn (i % 5 === 0) làm Quỹ ẩn -> Không tạo bản ghi trong bảng hàng (units)
      const isHiddenFund = i % 5 === 0;
      const isPendingInquiry = i % 10 === 0; // 10% số căn sẽ là Quỹ ẩn có yêu cầu liên hệ PENDING

      if (!isHiddenFund) {
        units.push({
          projectId: projectId,
          buildingType: 'LOW_RISE',
          unitCode: unitCode,
          unitTypeCode: unitType,
          statusCode: status,
          basePrice: 8000000000 + (i * 500000000), // từ 8 tỷ đến 58 tỷ
          areaLand: 70 + (i * 2),                  // từ 70m2 đến 270m2
          isHot: isHot,
          loanPrice: 5600000000 + (i * 350000000)
        });
      } else {
        if (isPendingInquiry) {
          inquiryUnitCodes.push(unitCode);
        }
      }

      // Phân bổ lưới xung quanh anchor tương ứng
      const countForAnchor = Math.floor(i / anchors.length);
      const col = countForAnchor % 4; // Lưới 4 cột
      const row = Math.floor(countForAnchor / 4);
      
      const spacing = 12; // Khoảng cách giữa các căn
      const x = anchor.x + (col - 1.5) * spacing;
      const y = anchor.y + (row - 1.5) * spacing;

      markers.push({
        mapId: mapId,
        code: unitCode,
        area: 70 + (i * 2),
        pageNum: 1,
        x: parseFloat(x.toFixed(4)),
        y: parseFloat(y.toFixed(4)),
        pageWidth: pageWidth,
        pageHeight: pageHeight,
        rotation: 0
      });
    }

    console.log(`\n[3/4] Đang gán tọa độ hiển thị cho 100 căn hộ mẫu gần các mốc thực tế...`);
    for (let i = 0; i < markers.length; i++) {
      const markerPayload = markers[i];
      const anchorName = anchors[i % anchors.length].name;
      
      const markerRes = await fetch(`${BASE_URL}/admin/map-extracted-data/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Request-Id': crypto.randomUUID(),
          'Locale': 'vi'
        },
        body: JSON.stringify(markerPayload)
      });

      const markerData = await markerRes.json();
      if (markerData.code !== 'SUCCESS') {
        throw new Error(`Gán tọa độ thất bại cho căn ${markerPayload.code}: ${markerData.message || JSON.stringify(markerData)}`);
      }
      if ((i + 1) % 10 === 0 || i === 0) {
        console.log(`- Đã gán tọa độ thành công cho ${i + 1}/100 căn (Ví dụ: ${markerPayload.code} gần ${anchorName})`);
      }
    }

    console.log(`\n[4/4] Đang tạo 100 căn hộ trên hệ thống...`);
    const createUnitsRes = await fetch(`${BASE_URL}/admin/units/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-Request-Id': crypto.randomUUID(),
        'Locale': 'vi'
      },
      body: JSON.stringify(units)
    });

    const createUnitsData = await createUnitsRes.json();
    if (createUnitsData.code !== 'SUCCESS') {
      throw new Error(`Tạo căn hộ thất bại: ${createUnitsData.message || ''}\nChi tiết: ${JSON.stringify(createUnitsData, null, 2)}`);
    }
    console.log(`=> Đã tạo thành công 100 căn hộ mẫu.`);

    console.log(`\n[5/5] Đang tạo yêu cầu xin thông tin (Inquiry) cho một số căn Quỹ ẩn để test trạng thái 'Đang liên hệ'...`);
    for (const code of inquiryUnitCodes) {
      const inquiryRes = await fetch(`${BASE_URL}/portal/units-inquiry/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Request-Id': crypto.randomUUID(),
          'Locale': 'vi'
        },
        body: JSON.stringify({
          projectId: projectId,
          unitCode: code
        })
      });
      const inquiryData = await inquiryRes.json();
      if (inquiryData.code === 'SUCCESS') {
        console.log(`- Đã tạo yêu cầu liên hệ cho căn Quỹ ẩn: ${code}`);
      } else {
        console.warn(`- Không thể tạo yêu cầu liên hệ cho căn ${code}: ${inquiryData.message}`);
      }
    }

    console.log('\n=========================================');
    console.log('HOÀN THÀNH! Đã thêm thành công 100 căn hộ và tọa độ (bao gồm cả Quỹ ẩn & Trạng thái yêu cầu).');
    console.log('Bạn có thể tải lại trang web để kiểm tra và test.');
    console.log('=========================================');

  } catch (error) {
    console.error('\n[Lỗi] Có lỗi xảy ra trong quá trình thực thi:');
    console.error(error.message || error);
  }
}

main();
