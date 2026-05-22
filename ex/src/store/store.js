// store/store.js
// Cấu hình Redux store - điểm duy nhất khởi tạo store

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    // Thêm reducer khác ở đây khi app lớn hơn
    // products: productReducer,
    // auth: authReducer,
  },
});

export default store;
