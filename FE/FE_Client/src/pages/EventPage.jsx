import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowUpRight, Clock } from 'lucide-react';
import Header from '../components/Header';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:8080/events");
        const json = await res.json();
        // Cấu trúc API của bạn: { status: 200, data: [...] }
        setEvents(json.data || []);
      } catch (err) {
        console.error("Lỗi kết nối API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100">
      

      {/* Hero Section - Typography cực đại, tối giản chi tiết */}
      <header className="pt-40 pb-20 px-6 border-b border-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[2px] bg-blue-600"></span>
            <span className="text-[10px] font-black tracking-[0.4em] text-blue-600 uppercase">
              Exclusive Events 2026
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
            Kết nối <br />
            <span className="text-gray-200">Cộng đồng</span>
          </h1>
          <p className="max-w-md text-gray-400 text-sm font-medium leading-relaxed">
            Hệ thống sự kiện dành riêng cho cư dân và đối tác, nơi chia sẻ kiến thức và cơ hội hợp tác mới.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-20">
        {loading ? (
          /* Skeleton Loading chuyên nghiệp */
          <div className="space-y-16">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex flex-col md:flex-row gap-10 animate-pulse">
                <div className="w-full md:w-72 h-44 bg-gray-50 rounded-3xl" />
                <div className="flex-1 space-y-4 py-2">
                  <div className="h-4 w-24 bg-gray-50 rounded" />
                  <div className="h-8 w-full bg-gray-50 rounded" />
                  <div className="h-4 w-2/3 bg-gray-50 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-20">
            {events.map((event) => (
              <article 
                key={event.id} 
                className="group flex flex-col md:flex-row gap-10 items-start transition-all"
              >
                {/* Khối Ảnh - Tối giản & Hiệu ứng Grayscale */}
                <div className="relative w-full md:w-80 h-52 shrink-0 rounded-[2rem] overflow-hidden bg-gray-100 shadow-sm">
                  <img 
                    src={event.image || "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1000"} 
                    alt={event.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                  />
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-900 shadow-sm">
                      {event.status}
                    </div>
                  </div>
                </div>

                {/* Khối Thông tin */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-4 mb-4 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-blue-500" />
                      {new Date(event.startDate).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {new Date(event.startDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  <h2 className="text-1xl md:text-2xl font-bold uppercase tracking-tight leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h2>
                  
                  <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-2xl line-clamp-3">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      <MapPin size={14} className="text-gray-300" />
                      {event.location}
                    </div>
                    
                    <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] group-hover:gap-4 transition-all">
                      Xem chi tiết <ArrowUpRight size={18} className="text-blue-500" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center border-2 border-dashed border-gray-50 rounded-[3rem]">
            <p className="text-gray-300 font-black uppercase tracking-[0.5em] text-xs">
              No events found — 2026
            </p>
          </div>
        )}
      </main>

      {/* Footer Tối giản */}
      <footer className="py-20 border-t border-gray-50">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[12px] font-black uppercase tracking-tighter">
            Batdongsan<span className="text-blue-600">.Clone</span>
          </div>
          <div className="flex gap-10 text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-blue-600 transition-colors">Instagram</a>
            <a href="#" className="hover:text-blue-600 transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Facebook</a>
          </div>
        </div>
      </footer>
    </div>
  );
}