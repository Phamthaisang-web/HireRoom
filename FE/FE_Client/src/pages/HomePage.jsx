import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import RoomCard from '../components/RoomCard';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch("http://localhost:8080/rooms?page=1&limit=6");
        const data = await res.json();
        setRooms(data.rooms || []);
      } catch (err) {
        console.error("Lỗi fetch rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <Header />

      {/* Hero Section - Tinh gọn & Hiện đại */}
      <section className="relative w-full h-[380px] flex items-center justify-center overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2000" 
          alt="Banner" 
          className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tighter drop-shadow-md">
            Tìm không gian <span className="text-blue-400">lý tưởng</span>
          </h1>
          <p className="text-white/80 mt-3 text-sm md:text-base font-medium max-w-lg mx-auto leading-relaxed">
            Hệ thống kết nối thuê phòng trực tuyến minh bạch, nhanh chóng và tin cậy nhất hiện nay.
          </p>
          <div className="mt-8">
             <Link to="/rooms" className="bg-white text-gray-900 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl">
                Khám phá ngay
             </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Section Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Đề xuất tốt nhất</h2>
            <h3 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Tin nổi bật</h3>
          </div>
          <Link to="/rooms" className="group flex items-center gap-1 text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-all">
            Xem tất cả <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Room Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-72 bg-white rounded-3xl animate-pulse border border-gray-100 shadow-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}

        {/* CTA Banner - Nhỏ gọn */}
        <div className="mt-20 bg-gray-900 rounded-[2rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            <div className="relative z-10 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-bold mb-2 uppercase tracking-tight">Bạn là chủ phòng trọ?</h3>
                <p className="text-gray-400 text-sm max-w-sm">Tiếp cận hơn 10.000 khách hàng tiềm năng mỗi tháng chỉ với vài bước đăng tin.</p>
            </div>
            <button className="relative z-10 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20">
                Bắt đầu đăng tin
            </button>
        </div>
      </main>

      {/* Footer Minimal */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-[14px] font-black text-gray-900 uppercase tracking-tighter">
            Batdongsan<span className="text-blue-500">.Clone</span>
          </div>
          <div className="flex gap-8 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
             <a href="#" className="hover:text-blue-500">Quy định</a>
             <a href="#" className="hover:text-blue-500">Chính sách</a>
             <a href="#" className="hover:text-blue-500">Liên hệ</a>
          </div>
          <div className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">
            © 2026. Design by Gemini.
          </div>
        </div>
      </footer>
    </div>
  );
}