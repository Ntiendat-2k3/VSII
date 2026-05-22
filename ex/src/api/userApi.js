// src/api/userApi.js
// Tất cả API calls liên quan đến User
// Base URL: https://jsonplaceholder.typicode.com
//
// LƯU Ý về JSONPlaceholder:
// - GET /users        → trả về 10 users thật ✅
// - POST /users       → giả lập tạo mới, trả về {id: 11, ...} nhưng không lưu thật
// - PUT /users/:id    → giả lập update, trả về data mới nhưng không lưu thật
// - DELETE /users/:id → giả lập xóa, trả về {} - không lưu thật
// Đây là đặc điểm của mock API - đủ để học luồng CRUD thật sự

import axiosInstance from "./axiosInstance";

const userApi = {
  // GET https://jsonplaceholder.typicode.com/users
  // Search được thực hiện client-side vì API không hỗ trợ filter theo name/email
  getUsers: () => axiosInstance.get("/users"),

  // GET https://jsonplaceholder.typicode.com/users/:id
  getUserById: (id) => axiosInstance.get(`/users/${id}`),

  // POST https://jsonplaceholder.typicode.com/users
  createUser: (userData) => axiosInstance.post("/users", userData),

  // PUT https://jsonplaceholder.typicode.com/users/:id
  updateUser: (id, userData) => axiosInstance.put(`/users/${id}`, userData),

  // DELETE https://jsonplaceholder.typicode.com/users/:id
  deleteUser: (id) => axiosInstance.delete(`/users/${id}`),
};

export default userApi;
