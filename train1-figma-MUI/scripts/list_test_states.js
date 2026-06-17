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
  console.log('=== TRA CỨU TRẠNG THÁI CÁC CĂN HỘ MẪU TEST (T-...) ===\n');

  const username = await question('Nhập tài khoản Admin: ');
  const password = await question('Nhập mật khẩu Admin: ');
  const projectIdStr = await question('Nhập Project ID (mặc định: 7): ');
  const projectId = parseInt(projectIdStr, 10) || 7;

  rl.close();

  try {
    console.log('\nĐang đăng nhập...');
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

    console.log('Đang lấy danh sách Map Extracted Data (Tọa độ gốc)...');
    // Ta lấy thông tin bản đồ để tìm mapId
    const mapRes = await fetch(`${BASE_URL}/portal/map/get?mapType=PROJECT&refId=${projectId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Request-Id': crypto.randomUUID(),
        'Locale': 'vi'
      }
    });
    const mapData = await mapRes.json();
    const mapId = mapData.data?.id;
    if (!mapId) {
      throw new Error('Không lấy được Map ID');
    }

    // Lấy danh sách toàn bộ tọa độ đã gán trên map
    const markersRes = await fetch(`${BASE_URL}/admin/map-extracted-data/search?mapId=${mapId}&pageSize=200`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Request-Id': crypto.randomUUID(),
        'Locale': 'vi'
      }
    });
    const markersData = await markersRes.json();
    const testMarkerCodes = (markersData.data || [])
      .map(m => m.code)
      .filter(code => code && code.startsWith('T-'));

    if (testMarkerCodes.length === 0) {
      console.log('Không tìm thấy căn hộ test nào có tiền tố "T-" trên bản vẽ dự án này.');
      return;
    }

    console.log('Đang tải danh sách quỹ căn trong database...');
    // Lấy danh sách quỹ căn (tải tối đa 200 căn)
    const unitsRes = await fetch(`${BASE_URL}/portal/units/search?projectId=${projectId}&pageSize=200&pageNumber=0`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Request-Id': crypto.randomUUID(),
        'Locale': 'vi'
      }
    });
    const unitsData = await unitsRes.json();
    const dbUnits = unitsData.data || [];
    const dbUnitsMap = new Map(dbUnits.map(u => [u.unitCode, u]));

    // Lấy các yêu cầu liên hệ hiện tại
    console.log('Đang tải trạng thái yêu cầu liên hệ (Inquiries)...');
    const inquiriesRes = await fetch(`${BASE_URL}/portal/units-inquiry/search?projectId=${projectId}&pageSize=200&pageNumber=0`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Request-Id': crypto.randomUUID(),
        'Locale': 'vi'
      }
    });
    const inquiriesData = await inquiriesRes.json();
    const inquiriesList = inquiriesData.data || [];
    const inquiriesMap = new Map(inquiriesList.map(inq => [inq.unitCode, inq.responseStatusCode]));

    const availableHot = [];
    const availableNormal = [];
    const sold = [];
    const hiddenFundRequestable = [];
    const hiddenFundInquired = [];

    // Phân loại dựa vào map markers thực tế
    for (const code of testMarkerCodes) {
      const dbUnit = dbUnitsMap.get(code);
      const inquiryStatus = inquiriesMap.get(code);

      if (dbUnit) {
        // Căn có trong database
        if (dbUnit.statusCode === 'AVAILABLE') {
          if (dbUnit.isHot) {
            availableHot.push(code);
          } else {
            availableNormal.push(code);
          }
        } else if (dbUnit.statusCode === 'SOLD') {
          sold.push(code);
        }
      } else {
        // Căn Quỹ ẩn (chỉ có tọa độ, không có trong bảng hàng)
        if (inquiryStatus === 'PENDING') {
          hiddenFundInquired.push(code);
        } else {
          hiddenFundRequestable.push(code);
        }
      }
    }

    // Sắp xếp các danh sách cho đẹp mắt
    const sortCodes = (arr) => arr.sort((a, b) => a.localeCompare(b));
    sortCodes(availableHot);
    sortCodes(availableNormal);
    sortCodes(sold);
    sortCodes(hiddenFundRequestable);
    sortCodes(hiddenFundInquired);

    console.log('\n=========================================');
    console.log(`ĐÃ PHÂN LOẠI THÀNH CÔNG ${testMarkerCodes.length} CĂN HỘ MẪU TEST (T-...):`);
    console.log('=========================================');

    console.log(`\n🔴 1. ĐÃ BÁN (SOLD - Nhãn màu hồng "Đã bán") [${sold.length} căn]:`);
    console.log(sold.slice(0, 10).join(', ') + (sold.length > 10 ? '...' : '') || '(Không có)');

    console.log(`\n🔥 2. CÒN HÀNG & CĂN HOT (AVAILABLE & isHot - Header đỏ + Flame icon) [${availableHot.length} căn]:`);
    console.log(availableHot.slice(0, 10).join(', ') + (availableHot.length > 10 ? '...' : '') || '(Không có)');

    console.log(`\n🟢 3. CÒN HÀNG THƯỜNG (AVAILABLE - Header xanh + Hiển thị giá) [${availableNormal.length} căn]:`);
    console.log(availableNormal.slice(0, 10).join(', ') + (availableNormal.length > 10 ? '...' : '') || '(Không có)');

    console.log(`\n🔵 4. QUỸ ẨN (Nút bấm "Xin thông tin" màu xanh dương) [${hiddenFundRequestable.length} căn]:`);
    console.log(hiddenFundRequestable.slice(0, 10).join(', ') + (hiddenFundRequestable.length > 10 ? '...' : '') || '(Không có)');

    console.log(`\n⏳ 5. QUỸ ẨN ĐÃ YÊU CẦU (Dòng chữ "Admin sẽ liên hệ sớm nhất") [${hiddenFundInquired.length} căn]:`);
    console.log(hiddenFundInquired.slice(0, 10).join(', ') + (hiddenFundInquired.length > 10 ? '...' : '') || '(Không có)');
    console.log('=========================================');

  } catch (error) {
    console.error('\n[Lỗi] Có lỗi xảy ra trong quá trình thực thi:');
    console.error(error.message || error);
  }
}

main();
