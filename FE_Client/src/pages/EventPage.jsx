import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ArrowUpRight, Clock, Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';


export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cấu hình URL từ môi trường
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/events`);
        const json = await res.json();
        
        // Xử lý chuẩn hóa dữ liệu ảnh và ID
        const processedEvents = (json.data || []).map(event => {
          let imageUrl = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000";
          if (event.image) {
            imageUrl = event.image.startsWith('http') 
              ? event.image 
              : `${BASE_URL}${event.image.startsWith('/') ? '' : '/'}${event.image}`;
          }
          return { ...event, displayImage: imageUrl };
        });

        setEvents(processedEvents);
      } catch (err) {
        console.error("Lỗi kết nối API:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [API_URL, BASE_URL]);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900">
    

      {/* Hero Section - Minimalist & Bold */}
      <section className="pt-32 pb-20 px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-12 h-[2px] bg-red-500"></span>
            <span className="text-[11px] font-black tracking-[0.3em] text-red-500 uppercase">
              Cộng đồng cư dân 2026
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9]">
              Sự kiện <br />
              <span className="text-gray-300">& Hoạt động</span>
            </h1>
            <p className="max-w-xs text-gray-500 text-sm font-medium leading-relaxed pb-2">
              Khám phá các hoạt động cộng đồng, workshop và chương trình ưu đãi dành riêng cho thành viên của hệ thống.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-16">
        
        {/* Featured Event (Sự kiện đầu tiên) */}
        {!loading && events.length > 0 && (
          <div className="mb-20">
            <div className="flex items-center gap-2 mb-8">
               <h3 className="text-xl font-black uppercase tracking-tighter">Sự kiện nổi bật</h3>
               <div className="h-px flex-1 bg-gray-100"></div>
            </div>
            <Link to={`/events/${events[0]._id || events[0].id}`} className="group relative block w-full h-[450px] overflow-hidden rounded-[3rem] shadow-2xl">
              <img 
                src={events[0].displayImage} 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                alt="Featured"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10 text-white">
                <div className="flex items-center gap-4 mb-4">
                   <span className="bg-red-600 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Hot Event</span>
                   <span className="flex items-center gap-1 text-xs font-medium text-gray-300">
                     <Calendar size={14} /> {new Date(events[0].startDate).toLocaleDateString('vi-VN')}
                   </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase mb-4 group-hover:text-red-400 transition-colors">{events[0].title}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-300">
                   <div className="flex items-center gap-1"><MapPin size={16} /> {events[0].location}</div>
                   <div className="flex items-center gap-1"><Clock size={16} /> {new Date(events[0].startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* All Events Grid */}
        <div className="flex items-center gap-2 mb-10">
           <h3 className="text-xl font-black uppercase tracking-tighter">Tất cả sự kiện</h3>
           <div className="h-px flex-1 bg-gray-100"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="space-y-4">
                <div className="h-64 bg-gray-200 rounded-[2rem] animate-pulse" />
                <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.map((event, index) => (
              <article key={event._id || event.id} className="group cursor-pointer">
                <Link to={`/events/${event._id || event.id}`}>
                  <div className="relative overflow-hidden rounded-[2.5rem] mb-6 h-64 shadow-lg bg-white">
                    <img 
                      src={event.displayImage} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm">
                        {event.status || 'Sắp diễn ra'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 px-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                      <span>{new Date(event.startDate).toLocaleDateString('vi-VN')}</span>
                      <div className="flex items-center gap-1 text-gray-400">
                         <Clock size={12} /> {new Date(event.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-black uppercase leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                      {event.title}
                    </h2>
                    
                    <p className="text-gray-500 text-sm line-clamp-2 font-medium">
                      {event.description}
                    </p>

                    <div className="pt-4 flex items-center justify-between border-t border-gray-50">
                      <div className="flex items-center gap-1 text-xs text-gray-400 font-bold uppercase">
                        <MapPin size={14} className="text-red-500" />
                        <span className="truncate max-w-[150px]">{event.location}</span>
                      </div>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                        <ArrowUpRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
            <p className="text-gray-300 font-black uppercase tracking-widest text-sm">Hiện chưa có sự kiện nào được cập nhật</p>
          </div>
        )}
      </main>

    </div>
  );
}