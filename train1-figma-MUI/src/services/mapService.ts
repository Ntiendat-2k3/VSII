/* eslint-disable @typescript-eslint/no-unused-vars */
import { MOCK_PROPERTIES } from '../data/mockData';
import type {
  PropertyUnit,
  SearchUnitResponse,
  TileConfig,
  InquiryResponse,
  InquiryStatusCode,
} from '../types/mapApi';

/* ===== Helpers ===== */

const DELAY_MS = 500;
const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Chuyển đổi Property (mock) sang PropertyUnit (chuẩn API).
 * Khi có API thật, hàm này sẽ bị xóa.
 */
const toPropertyUnit = (p: (typeof MOCK_PROPERTIES)[number]): PropertyUnit => {
  const statusMap: Record<string, PropertyUnit['statusCode']> = {
    available: 'AVAILABLE',
    sold: 'SOLD',
  };

  return {
    id: p.id,
    code: p.code,
    isHot: p.isHot,
    type: p.type,
    area: p.area,
    listedPrice: p.listedPrice * 1_000_000_000,
    loanPrice: p.loanPrice * 1_000_000_000,
    statusCode: statusMap[p.status] ?? null,
    inquiryStatusCode: p.status === 'contacting' ? 'PENDING' : null,
    position: { x: p.position.x, y: p.position.y },
  };
};

/* ==========================================================================
 * mapService — Mock API Service Layer
 *
 * Khi backend cấp API thật, chỉ cần thay thế body của từng hàm
 * bằng axios.post / fetch tương ứng. KHÔNG cần sửa bất kỳ component nào.
 * ========================================================================== */

export const mapService = {
  /**
   * GET `/portal/map/get`
   * Lấy thông tin tile bản đồ dự án.
   */
  getMapTiles: async (_projectId: string): Promise<TileConfig> => {
    await delay(DELAY_MS);
    return {
      rotation: 270,
      pageWidth: 2383.93994140625,
      pageHeight: 3370.389892578125,
      dpi: 600,
      maxZoomLevel: '4',
    };
  },

  /**
   * POST `/portal/map/search`
   * Lấy danh sách các căn trạng thái "Còn hàng" trên bản đồ.
   */
  searchProperties: async (_projectId: string): Promise<PropertyUnit[]> => {
    await delay(DELAY_MS);
    return MOCK_PROPERTIES.map(toPropertyUnit);
  },

  /**
   * POST `/portal/map/get-codes`
   * Auto-typing search — trả về danh sách mã căn gợi ý.
   */
  getUnitCodes: async (_projectId: string, keyword: string): Promise<string[]> => {
    if (!keyword.trim()) return [];
    await delay(200);
    const normalized = keyword.trim().toLowerCase();
    const result: string[] = [];
    for (const p of MOCK_PROPERTIES) {
      if (p.code.toLowerCase().includes(normalized)) {
        result.push(p.code);
      }
    }
    return result;
  },

  /**
   * POST `/portal/map/search` (với keyword chính xác)
   * Trả về tọa độ + chi tiết căn hộ khi chọn từ Autocomplete.
   */
  searchUnitDetails: async (
    _projectId: string,
    unitCode: string,
  ): Promise<SearchUnitResponse | null> => {
    await delay(DELAY_MS);
    const match = MOCK_PROPERTIES.find(
      (p) => p.code.toUpperCase() === unitCode.toUpperCase(),
    );
    if (!match) return null;

    const unit = toPropertyUnit(match);

    return {
      statusCode: unit.statusCode,
      inquiryStatusCode: unit.inquiryStatusCode,
      rotation: 270,
      pageWidth: 2383.93994140625,
      pageHeight: 3370.389892578125,
      x: match.position.x,
      y: match.position.y,
      dpi: 600,
      xPixel: Math.round((match.position.x / 100) * 2383.94),
      yPixel: Math.round((match.position.y / 100) * 3370.39),
      unitDetails: unit,
    };
  },

  /**
   * POST `/portal/units-inquiry/create`
   * Gửi yêu cầu xin thông tin căn.
   */
  createInquiry: async (
    _projectId: string,
    _unitCode: string,
  ): Promise<InquiryResponse> => {
    await delay(DELAY_MS);
    return { success: true, status: 'PENDING' as InquiryStatusCode };
  },
};
