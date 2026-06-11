import apiClient from './apiClient';
import type { UnitInquiryCreateRequest, InquiryCreateResponse } from '../features/property-map/types';
import { API_ENDPOINTS } from './endpoints';

export const unitInquiryService = {
  /** POST `/portal/units-inquiry/create` — Gửi yêu cầu xin thông tin căn. */
  create: async (projectId: number, unitCode: string): Promise<InquiryCreateResponse> => {
    const payload: UnitInquiryCreateRequest = { projectId, unitCode };
    const response = await apiClient.post(API_ENDPOINTS.UNIT_INQUIRY_CREATE, payload);
    return response.data;
  },
};
