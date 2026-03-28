import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import FavoriteRooms from "./pages/FavoriteRoomPage";
import EventsPage from "./pages/EventPage";
import DashboardPage from "./pages/admins/DashboardPage"; // Đảm bảo có dòng này

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* CHỈ DÙNG MỘT THẺ ROUTES DUY NHẤT Ở ĐÂY */}
        <Routes>
          
          {/* Group 1: Các trang dùng MainLayout (Header + Footer) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="rooms" element={<RoomPage />} />
            <Route path="rooms/:id" element={<RoomDetailPage />} />
            <Route path="favorites" element={<FavoriteRooms />} />
            <Route path="events" element={<EventsPage />} />
          </Route>

          {/* Group 2: Các trang không dùng MainLayout */}
          <Route path="/admin" element={<DashboardPage />} />
          
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;