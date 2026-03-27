import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import MainLayout from "./layouts/MainLayout"; 
import DashboardPage from "./pages/admins/DashboardPage";

import HomePage from "./pages/HomePage";
import RoomPage from "./pages/RoomPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import FavoriteRooms from "./pages/FavoriteRoomPage";
import EventsPage from "./pages/EventPage";


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
  
          <Route path="/admin" element={<MainLayout />}>
          
            <Route index element={<DashboardPage />} />
          </Route>

        <Route path="/" element={<HomePage />} />
        <Route path="/rooms" element={<RoomPage />} />
         <Route path="/rooms/:id" element={<RoomDetailPage />} />
        <Route path="/favorites" element={<FavoriteRooms />} />
        <Route path="/events" element={<EventsPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;