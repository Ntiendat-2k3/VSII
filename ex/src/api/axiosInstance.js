// src/api/axiosInstance.js
// Cấu hình axios instance dùng chung toàn app
// Đã xóa toàn bộ mock interceptor - giờ gọi API thật

import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})

// REQUEST INTERCEPTOR - chạy trước khi gửi request
axiosInstance.interceptors.request.use(
  (config) => {
    // Thêm JWT token ở đây nếu cần:
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    return config
  },
  (error) => Promise.reject(error)
)

// RESPONSE INTERCEPTOR - chạy sau khi nhận response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Lỗi kết nối mạng'
    console.error('[API Error]', message)
    return Promise.reject(new Error(message))
  }
)

export default axiosInstance
