// slices/userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadUserFromLocalStorage = () => {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    customer: loadUserFromLocalStorage()?.customer || null,
    accessToken: loadUserFromLocalStorage()?.tokens?.access_token || null,
    refreshToken: loadUserFromLocalStorage()?.tokens?.refresh_token || null,
    isLoggedIn: !!loadUserFromLocalStorage(), // Chuyển đổi thành boolean
  },
  reducers: {
    login(state, action) {
      const { customer, tokens } = action.payload; // Giải nén thông tin từ payload
      state.customer = customer; // Lưu thông tin khách hàng
      state.accessToken = tokens?.access_token; // Lưu token truy cập
      state.refreshToken = tokens?.refresh_token; // Lưu token làm mới
      state.isLoggedIn = true; // Cập nhật trạng thái đăng nhập

      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    logout(state) {
      state.customer = null; // Đặt lại thông tin khách hàng
      state.accessToken = null; // Đặt lại token truy cập
      state.refreshToken = null; // Đặt lại token làm mới
      state.isLoggedIn = false; // Cập nhật trạng thái đăng nhập

      localStorage.removeItem("user");
      localStorage.removeItem("order");
    },
  },
});

// Xuất các action
export const { login, logout } = userSlice.actions;

// Xuất reducer
export default userSlice.reducer;
