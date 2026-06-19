import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { HTTP_STATUS, API_ERROR_CODES } from '../constants/httpStatus';
import { CONFIG } from '../constants/config';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api-proxy';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: CONFIG.API_TIMEOUT,
});

axiosClient.interceptors.request.use(
  (config) => {
    config.headers['X-Request-Id'] = uuidv4();
    config.headers['Locale'] = 'vi';

    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response.data && response.data.code) {
      return response.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response) {
      const data = error.response.data;
      // Nếu UAT trả về 401 Unauthorized hoặc lỗi mã INVALID_TOKEN
      if (error.response.status === HTTP_STATUS.UNAUTHORIZED || (data && data.code === API_ERROR_CODES.INVALID_TOKEN)) {
        localStorage.removeItem('token');
        window.location.reload(); // Tải lại để ép đăng nhập lại
      }
      return Promise.reject(data || error);
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
