import apiClient from './apiClient';
import type { UnitInquiryCreateRequest, InquiryCreateResponse } from '../features/property-map/types';
import { API_ENDPOINTS } from './endpoints';

export const unitInquiryService = {
  /** POST `/portal/units-inquiry/create` — Gửi yêu cầu xin thông tin căn. */
  create: async (projectId: number, unitCode: string): Promise<InquiryCreateResponse> => {
    const payload: UnitInquiryCreateRequest = { projectId, unitCode };
    try {
      const response = await apiClient.post(API_ENDPOINTS.UNIT_INQUIRY_CREATE, payload);
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
