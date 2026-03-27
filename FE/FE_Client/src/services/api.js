import axios from "axios";

const api = axios.create({
  // 1. Cập nhật baseURL sang cổng 8080 của bạn
  baseURL: "http://localhost:8080",
});

// Interceptor cho Request: Gửi kèm token vào Header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      // Đảm bảo token được gửi theo định dạng Bearer
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
  
    if (error.response?.status === 401) {
   
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
     
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;