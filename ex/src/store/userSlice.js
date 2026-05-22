// src/store/userSlice.js
// Redux Toolkit slice - quản lý state users
//
// Thay đổi so với phiên bản mock:
// 1. fetchUsers: gọi API thật, search filter client-side
// 2. createUser: API trả về {id:11} nhưng không persist → ta tự quản lý local state
// 3. updateUser: tương tự, cập nhật local state sau khi API confirm
// 4. deleteUser: API trả về 200 → xóa khỏi local state
//
// Response shape từ JSONPlaceholder /users:
// { id, name, username, email, phone, website, company: { name } }

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../api/userApi";

// Helper: map field JSONPlaceholder → field app dùng
// JSONPlaceholder không có "role" hay "status" → ta tự thêm defaults
const normalizeUser = (raw) => ({
  id: raw.id,
  name: raw.name,
  username: raw.username,
  email: raw.email,
  phone: raw.phone || "",
  company: raw.company?.name || "",
  role: raw.role || "Viewer", // field tự thêm
  status: raw.status || "active", // field tự thêm
});

// ===== ASYNC THUNKS =====

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (searchTerm = "", { rejectWithValue }) => {
    try {
      const res = await userApi.getUsers();
      const normalized = res.data.map(normalizeUser);
      // Search filter client-side (JSONPlaceholder không hỗ trợ query param search)
      if (!searchTerm) return normalized;
      const q = searchTerm.toLowerCase();
      return normalized.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q) ||
          u.company.toLowerCase().includes(q),
      );
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createUser = createAsyncThunk(
  "users/create",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await userApi.createUser(userData);
      // JSONPlaceholder trả về id=11, ta merge với data người dùng nhập
      return normalizeUser({ ...userData, id: res.data.id });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      await userApi.updateUser(id, userData);
      // API confirm OK → trả về data đã merge để cập nhật local state
      return normalizeUser({ ...userData, id });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await userApi.deleteUser(id);
      return id; // Trả về id để xóa khỏi list
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

// ===== SLICE =====
const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    allUsers: [], // Cache toàn bộ users gốc từ API (để filter client-side)
    loading: false,
    error: null,
    searchTerm: "",
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      // Filter client-side từ cache
      const q = action.payload.toLowerCase();
      state.list = q
        ? state.allUsers.filter(
            (u) =>
              u.name.toLowerCase().includes(q) ||
              u.email.toLowerCase().includes(q) ||
              u.role.toLowerCase().includes(q) ||
              u.company.toLowerCase().includes(q),
          )
        : state.allUsers;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        // Chỉ cache khi không có search (lần đầu load)
        if (!state.searchTerm) state.allUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.list = [action.payload, ...state.list];
        state.allUsers = [action.payload, ...state.allUsers];
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const update = (arr) =>
          arr.map((u) => (u.id === action.payload.id ? action.payload : u));
        state.list = update(state.list);
        state.allUsers = update(state.allUsers);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DELETE
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const remove = (arr) => arr.filter((u) => u.id !== action.payload);
        state.list = remove(state.list);
        state.allUsers = remove(state.allUsers);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, clearError } = userSlice.actions;

// Selectors
export const selectUsers = (state) => state.users.list;
export const selectAllUsers = (state) => state.users.allUsers;
export const selectLoading = (state) => state.users.loading;
export const selectError = (state) => state.users.error;
export const selectSearchTerm = (state) => state.users.searchTerm;

export default userSlice.reducer;
