import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import RoomCard from '../components/RoomCard';
import { Heart, Home, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FavoriteRooms() {
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Lấy token từ localStorage
  const token = localStorage.getItem("token") || ""; 

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8080/favorites/me", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      
      // Map thêm thuộc tính isFavorited: true vì đây là danh sách yêu thích
      const roomsWithStatus = (data.rooms || []).map(room => ({
        ...room,
        isFavorited: true 
      }));
      
      setFavoriteRooms(roomsWithStatus);
    } catch (err) {
      console.error("Lỗi fetch danh sách yêu thích:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      

      {/* Header Section */}
      <section className="bg-white border-b border-gray-100 pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors text-[11px] font-bold uppercase tracking-widest mb-6">
            <ArrowLeft size={14} /> Quay lại trang chủ
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
                  <Heart size={24} fill="currentColor" />
                </div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-gray-900">
                  Phòng đã <span className="text-rose-500">yêu thích</span>
                </h1>
              </div>
              <p className="text-gray-500 text-sm font-medium">
                Lưu trữ những không gian phù hợp nhất với nhu cầu của bạn.
              </p>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                <span className="text-gray-900 font-black text-lg">{favoriteRooms.length}</span>
                <span className="text-gray-400 text-xs font-bold uppercase ml-2 tracking-widest">Tin lưu trữ</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-16">
        {loading ? (
          /* Skeleton Loading */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 bg-white rounded-[2rem] animate-pulse border border-gray-100 shadow-sm"></div>
            ))}
          </div>
        ) : favoriteRooms.length > 0 ? (
          /* Danh sách phòng */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteRooms.map((room) => (
              <RoomCard 
                key={room.id} 
                room={room} 
              />
            ))}
          </div>
        ) : (
          /* Trạng thái trống */
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight mb-2">Chưa có phòng nào</h3>
            <p className="text-gray-400 text-sm mb-8">Bạn chưa lưu bất kỳ phòng trọ nào vào danh sách yêu thích.</p>
            <Link to="/rooms" className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              Khám phá phòng ngay
            </Link>
          </div>
        )}
      </main>

      {/* Footer Minimal */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-[14px] font-black text-gray-900 uppercase tracking-tighter mb-4">
            Batdongsan<span className="text-blue-500">.Clone</span>
          </div>
          <div className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
            © 2026. Design by Gemini.
          </div>
        </div>
      </footer>
    </div>
  );
}