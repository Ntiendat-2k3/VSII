import axiosClient from '../../../api/axiosClient';
import { PROPERTY_MAP_ENDPOINTS } from '../../../api/endpoints';
import type { MasterDataFilterRequest, MasterDataResponse } from '../types/PropertyMapDto';

export const masterDataQueryApi = {
  /** GET `/master-data/list` — Lấy danh sách thông tin Master Data. */
  getList: async (params: MasterDataFilterRequest): Promise<MasterDataResponse[]> => {
    try {
      const response = await axiosClient.get(PROPERTY_MAP_ENDPOINTS.MASTER_DATA_LIST, { params });
      return (response.data || []) as MasterDataResponse[];
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('Error fetching master data list:', error);
      }
      return [];
    }
  },
};
