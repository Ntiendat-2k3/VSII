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
  console.log('=== KHỞI TẠO 20 CĂN HỘ MẪU TEST TRÊN UAT ===\n');

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
    const pageWidth = mapData.data.pageWidth || 2383.94;
    const pageHeight = mapData.data.pageHeight || 3370.39;
    console.log(`=> Lấy thông tin bản đồ thành công. Map ID: ${mapId}, Kích thước: ${pageWidth} x ${pageHeight}`);

    // Chuẩn bị 20 căn hộ mẫu đủ các loại hình và trạng thái
    const unitTypes = ['SHOPHOUSE', 'TOWNHOUSE', 'DETACHED', 'SEMI_DETACHED'];
    const statuses = ['AVAILABLE', 'SOLD'];
    const units = [];

    // Tạo mã căn ngẫu nhiên từ 10 đến 99 để tránh trùng lặp khi chạy nhiều lần
    const suffix = Math.floor(10 + Math.random() * 90);

    for (let i = 0; i < 20; i++) {
      const typeIndex = i % unitTypes.length;
      const statusIndex = Math.floor(i / unitTypes.length) % statuses.length;
      
      const unitType = unitTypes[typeIndex];
      const status = statuses[statusIndex];
      const isHot = i % 4 === 0;

      // Tiền tố mã căn tương ứng loại hình
      let prefix = 'LK'; // TOWNHOUSE
      if (unitType === 'SHOPHOUSE') prefix = 'SH';
      if (unitType === 'DETACHED') prefix = 'DL'; // Đơn lập
      if (unitType === 'SEMI_DETACHED') prefix = 'SL'; // Song lập
      if (unitType === 'TU_LAP') prefix = 'TL'; // Tứ lập

      const unitCode = `TEST-${prefix}-${suffix}-${String(i + 1).padStart(2, '0')}`;

      units.push({
        projectId: projectId,
        buildingType: 'LOW_RISE',
        unitCode: unitCode,
        unitTypeCode: unitType,
        statusCode: status,
        basePrice: 10000000000 + (i * 2000000000), // từ 10 tỷ - 48 tỷ
        areaLand: 90 + (i * 15),                  // từ 90m2 - 375m2
        isHot: isHot,
        loanPrice: 7000000000 + (i * 1400000000)
      });
    }

    console.log(`\n[3/4] Đang gán tọa độ hiển thị cho 20 căn hộ trên bản vẽ...`);

    // Gán tọa độ gom cụm gần căn VK1-18 (x=2410.3860, y=658.2240)
    const centerX = 2410.3860;
    const centerY = 658.2240;
    const spacing = 12; // Khoảng cách giữa các căn để tạo cụm dày đặc

    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      
      // Tính toán tọa độ lưới để các căn không đè lên nhau và gần VK1-18
      const col = i % 5;
      const row = Math.floor(i / 5);
      
      const x = centerX + (col - 2) * spacing;
      const y = centerY + (row - 1.5) * spacing;

      const markerPayload = {
        mapId: mapId,
        code: unit.unitCode,
        area: unit.areaLand,
        pageNum: 1,
        x: parseFloat(x.toFixed(4)),
        y: parseFloat(y.toFixed(4)),
        pageWidth: pageWidth,
        pageHeight: pageHeight,
        rotation: 0
      };

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
        throw new Error(`Gán tọa độ thất bại cho căn ${unit.unitCode}: ${markerData.message || JSON.stringify(markerData)}`);
      }
      console.log(`- Đã gán tọa độ thành công cho: ${unit.unitCode} tại (x: ${markerPayload.x}, y: ${markerPayload.y})`);
    }

    console.log(`\n[4/4] Đang tạo 20 căn hộ trên hệ thống...`);
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
    console.log(`=> Đã tạo thành công 20 căn hộ mẫu.`);

    console.log('\n=========================================');
    console.log('HOÀN THÀNH! Đã thêm thành công 20 căn hộ và tọa độ.');
    console.log('Bạn có thể tải lại trang web để kiểm tra và test.');
    console.log('=========================================');

  } catch (error) {
    console.error('\n[Lỗi] Có lỗi xảy ra trong quá trình thực thi:');
    console.error(error.message || error);
  }
}

main();
