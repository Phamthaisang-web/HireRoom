import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import thư viện

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

// Hàm hỗ trợ lấy role từ token
export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded.role; // Giả sử backend lưu field là "role"
  } catch (error) {
    return null;
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // 1. Gắn token vào header
      config.headers.Authorization = `Bearer ${token}`;

      // 2. Kiểm tra Role cho các route nhạy cảm (Tùy chọn)
      // Ví dụ: Nếu URL có chứa "/admin" mà role không phải admin thì báo lỗi ngay tại client
      const role = getUserRole();
      if (config.url.includes("/admin") && role !== "admin") {
         console.warn("Cảnh báo: Bạn không có quyền truy cập API này!");
         // Bạn có thể return Promise.reject({ message: "Forbidden" }); 
         // Tuy nhiên thường thì hãy để Backend trả về 403 sẽ chuẩn hơn.
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token hết hạn hoặc không hợp lệ
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    } 
    
    if (status === 403) {
      // LỖI BẠN ĐANG GẶP (FORBIDDEN)
      // Token đúng nhưng Role không đủ quyền xóa/sửa
      console.error("Bạn không có quyền thực hiện hành động này!");
    }

    return Promise.reject(error);
  }
);

export default api;