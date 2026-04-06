import React, { useState, useEffect } from 'react';
import RoomCard from '../components/RoomCard';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Search, ArrowUpRight, ShieldCheck, Zap, Heart, MapPin } from 'lucide-react';

export default function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  
  // URL cấu hình
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // 1. Gọi đồng thời các API để tối ưu tốc độ load
        const [roomsRes, favRes, eventsRes] = await Promise.all([
          fetch(`${API_URL}/rooms?page=1&limit=8`),
          token 
            ? fetch(`${API_URL}/favorites/me`, { headers: { Authorization: `Bearer ${token}` } })
            : Promise.resolve(null),
          fetch(`${API_URL}/events`) 
        ]);

        const roomsData = await roomsRes.json();
        const favData = favRes ? await favRes.json() : { data: [] }; // Sửa lỗi: API trả về .data
        const eventsData = await eventsRes.json();

        // 2. Xử lý danh sách ID đã thích (Chuyển hết sang String để so sánh chính xác)
        const myFavIds = (favData.data || []).map(r => (r._id || r.id).toString());

        // 3. Xử lý Rooms và gắn trạng thái Heart
        const rawRooms = roomsData.rooms || [];
        const processedRooms = rawRooms.map(room => {
          const roomId = (room._id || room.id).toString();
          
          // Logic lấy ảnh thumbnail
          let mainImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000";
          if (room.images && room.images.length > 0) {
            // Ưu tiên ảnh thumbnail, nếu không lấy ảnh đầu tiên
            const thumbObj = room.images.find(img => img.isThumbnail) || room.images[0];
            const url = typeof thumbObj === 'object' ? thumbObj.url : thumbObj;
            
            if (url) {
              mainImage = url.startsWith('http') 
                ? url 
                : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
            }
          }

          return { 
            ...room, 
            id: roomId,
            mainImage, 
            // KIỂM TRA TRẠNG THÁI: Nếu ID nằm trong list favorites thì Heart đỏ
            isFavorited: myFavIds.includes(roomId) 
          };
        });
        setRooms(processedRooms);

        // 4. Xử lý Events
        const rawEvents = eventsData.data || [];
        const processedEvents = rawEvents.slice(0, 3).map(event => ({
          id: event._id || event.id,
          title: event.title || "Chưa có tiêu đề",
          image: event.image || "https://via.placeholder.com/400",
          status: event.status || "Sắp diễn ra",
          startDate: event.startDate,
          location: event.location || "Đang cập nhật"
        }));
        setEvents(processedEvents);

      } catch (err) {
        console.error("Lỗi fetch dữ liệu HomePage:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL, BASE_URL]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) navigate(`/rooms?keyword=${encodeURIComponent(searchKeyword)}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-900">
      {/* Hero Section */}
      <section className="relative w-full h-screen flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover brightness-50"
          alt="Hero"
        />
        <div className="relative z-10 w-full max-w-xl px-6">
          <h1 className="text-white text-4xl font-black uppercase text-center mb-8 tracking-tighter">Tìm phòng trọ ưng ý</h1>
          <form onSubmit={handleSearch} className="bg-white p-1 rounded-full flex shadow-2xl transition-transform focus-within:scale-105">
            <input 
              type="text" 
              className="flex-1 px-6 outline-none text-sm rounded-full" 
              placeholder="Nhập khu vực, địa chỉ cần tìm..." 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="submit" className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all active:scale-95">
              <Search size={20} />
            </button>
          </form>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-20">
        {/* Latest Rooms Section */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tighter">Phòng mới nhất</h3>
            <div className="h-1 w-12 bg-blue-600 mt-2"></div>
          </div>
          <Link to="/rooms" className="text-xs font-bold text-blue-600 uppercase flex items-center gap-1 hover:gap-2 transition-all">
            Xem tất cả <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.length > 0 ? (
              rooms.map(room => <RoomCard key={room.id} room={room} />)
            ) : (
              <p className="col-span-full text-center text-gray-400 py-10 font-medium italic">Hiện chưa có phòng trọ nào được đăng.</p>
            )}
          </div>
        )}

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center py-24 mt-10">
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:-translate-y-2">
              <ShieldCheck size={32} />
            </div>
            <h4 className="text-xl font-black uppercase">Thông tin xác thực</h4>
            <p className="text-gray-500 text-sm mt-2">Đội ngũ kiểm duyệt bài đăng 24/7 đảm bảo an toàn.</p>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-green-600 group-hover:text-white transition-all transform group-hover:-translate-y-2">
              <Zap size={32} />
            </div>
            <h4 className="text-xl font-black uppercase">Thuê nhanh chóng</h4>
            <p className="text-gray-500 text-sm mt-2">Kết nối trực tiếp chủ nhà chỉ với một vài thao tác.</p>
          </div>
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-red-600 group-hover:text-white transition-all transform group-hover:-translate-y-2">
              <Heart size={32} />
            </div>
            <h4 className="text-xl font-black uppercase">Ưu đãi hấp dẫn</h4>
            <p className="text-gray-500 text-sm mt-2">Nhiều chính sách hỗ trợ sinh viên tìm trọ giá tốt.</p>
          </div>
        </section>

        {/* Events Section */}
       {/* Events Section - Minimalist Style */}
<section className="py-20 border-t border-gray-100">
  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
    <div>
      <h3 className="text-2xl font-black uppercase tracking-tighter">Sự kiện</h3>
            <div className="h-1 w-12 bg-blue-600 mt-2"></div>
    </div>
    <Link 
      to="/events" 
      className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-red-600 transition-colors"
    >
      Khám phá tất cả 
      <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
    </Link>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
    {loading ? (
      [1, 2, 3].map(i => (
        <div key={i} className="space-y-4">
          <div className="aspect-[16/10] bg-gray-100 animate-pulse rounded-2xl" />
          <div className="h-4 w-1/4 bg-gray-100 animate-pulse rounded" />
          <div className="h-6 w-full bg-gray-100 animate-pulse rounded" />
        </div>
      ))
    ) : events.length > 0 ? (
      events.map(event => (
        <Link to={`/events/${event.id}`} key={event.id} className="group block">
          {/* Image Container - Aspect Ratio Fix */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6">
            <img 
              src={event.image} 
              alt={event.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm">
                Sắp diễn ra
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>{new Date(event.startDate).toLocaleDateString('vi-VN')}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <div className="flex items-center gap-1">
                <MapPin size={12} className="text-red-400" />
                {event.location}
              </div>
            </div>
            
            <h4 className="text-lg font-bold uppercase leading-tight group-hover:text-red-600 transition-colors line-clamp-1">
              {event.title}
            </h4>
            
            <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Nhấn để xem chi tiết chương trình và cách thức tham gia...
            </p>
          </div>
        </Link>
      ))
    ) : (
      <div className="col-span-full py-10 text-center border-2 border-dashed border-gray-50 rounded-3xl">
        <p className="text-gray-300 uppercase text-xs font-bold tracking-widest">Chưa có sự kiện mới</p>
      </div>
    )}
  </div>
</section>
      </main>
    </div>
  );
}