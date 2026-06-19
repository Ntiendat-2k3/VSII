import axiosClient from '../../../services/axiosClient';
import type { UnitInquiryCreateRequest, InquiryCreateResponse } from '../types/PropertyMapDto';
import { PROPERTY_MAP_ENDPOINTS } from '../../../services/endpoints';

export const unitInquiryMutationApi = {
  /** POST `/portal/units-inquiry/create` — Gửi yêu cầu xin thông tin căn. */
  create: async (projectId: number, unitCode: string): Promise<InquiryCreateResponse> => {
    const payload: UnitInquiryCreateRequest = { projectId, unitCode };
    try {
      const response = await axiosClient.post(PROPERTY_MAP_ENDPOINTS.UNIT_INQUIRY_CREATE, payload);
      return response.data || { success: true, status: 'PENDING' };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Fallback mock for unit inquiry due to API error:', error);
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              success: true,
              status: 'PENDING',
            });
          }, 500);
        });
      }
      throw error;
    }
  },
};
