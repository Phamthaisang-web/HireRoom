import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getUserRole } from '../services/api'; // Import hàm bạn vừa viết

const ProtectedRoute = () => {
  const role = getUserRole();
  const token = localStorage.getItem("token");

  // 1. Kiểm tra xem có token không?
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 2. Kiểm tra role giải mã từ token có phải admin không?
  if (role !== 'admin') {
    // Nếu là user bình thường đang cố vào /admin, cho về trang chủ
    return <Navigate to="/" replace />;
  }

  // Nếu thỏa mãn cả 2, cho phép vào trang Admin
  return <Outlet />;
};

export default ProtectedRoute;