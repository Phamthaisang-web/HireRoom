import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Layouts
import MainLayout from "./layouts/MainLayout"; 
import AdminLayout from "./layouts/MainLayoutAdmin"; 

// User Pages
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import FavoriteRooms from "./pages/FavoriteRoomPage";
import EventsPage from "./pages/EventPage";

// Admin Pages
import DashboardPageAdmin from "./pages/admins/DashboardPageAdmin"; // Giả sử bạn có trang Dashboard
import RoomPageAdmin from "./pages/admins/RoomsPageAdmin";
import LandlordsPageAdmin from "./pages/admins/LandlordsPageAdmin";
import UsersPageAdmin from "./pages/admins/UsersPageAdmin"; // Nếu có trang quản lý user
import EventsPageAdmin from "./pages/admins/EventsPageAdmin";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          
          {/* GROUP 1: GIAO DIỆN NGƯỜI DÙNG */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="rooms" element={<RoomPage />} />
            <Route path="rooms/:id" element={<RoomDetailPage />} />
            <Route path="favorites" element={<FavoriteRooms />} />
            <Route path="events" element={<EventsPage />} />
          </Route>

          {/* GROUP 2: GIAO DIỆN QUẢN TRỊ (ADMIN) */}
          <Route path="/admin" element={<AdminLayout />}>
            {/* 1. Trang mặc định khi vào /admin: Chuyển hướng hoặc hiện Dashboard */}
            <Route index element={<DashboardPageAdmin/>} />
            
            {/* 2. Quản lý phòng: /admin/rooms */}
            <Route path="rooms" element={<RoomPageAdmin />} />
            
            {/* 3. Quản lý chủ nhà: /admin/landlords */}
            <Route path="landlords" element={<LandlordsPageAdmin />} />
            
            {/* 4. Quản lý người dùng: /admin/users (Nếu bạn đã code menu key này) */}
            <Route path="users" element={<UsersPageAdmin />} />

            {/* 5. Quản lý sự kiện: /admin/events */}
            <Route path="events" element={<EventsPageAdmin />} />
          </Route>

          {/* Trang 404 - Nếu rảnh bạn nên làm thêm trang này */}
          <Route path="*" element={<div className="p-20 text-center">404 - Trang không tồn tại</div>} />

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;