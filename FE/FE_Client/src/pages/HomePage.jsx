import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import RoomCard from '../components/RoomCard';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, Calendar, MapPin, ArrowUpRight, 
  Search, ShieldCheck, Zap, Heart, Users 
} from 'lucide-react';

export default function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [roomsRes, eventsRes] = await Promise.all([
          fetch("http://localhost:8080/rooms?page=1&limit=8"),
          fetch("http://localhost:8080/events")
        ]);
        const roomsData = await roomsRes.json();
        const eventsData = await eventsRes.json();
        setRooms(roomsData.rooms || []);
        setEvents((eventsData.data || []).slice(0, 3));
      } catch (err) {
        console.error("Lỗi fetch dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/rooms?keyword=${encodeURIComponent(searchKeyword)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans selection:bg-blue-100 text-gray-900">
      {/* --- HERO SECTION: CẢI TIẾN VỚI QUICK SEARCH --- */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
  {/* Ảnh nền - Sử dụng h-full và object-cover để đảm bảo lấp đầy màn hình */}
  <img 
    src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2000" 
    alt="Banner" 
    className="absolute inset-0 w-full h-full object-cover brightness-[0.6]"
  />
  
  <div className="relative z-10 text-center px-6 w-full max-w-3xl">
    {/* Tiêu đề - Giảm size từ 7xl xuống 5xl */}
    <h1 className="text-white text-4xl md:text-5xl font-extrabold uppercase tracking-tight drop-shadow-lg mb-4">
      Nâng tầm trải nghiệm <br/> <span className="text-red-400">thuê trọ</span>
    </h1>
    
    {/* Mô tả - Giảm max-width và margin-bottom */}
    <p className="text-white/90 text-sm md:text-base font-normal max-w-md mx-auto leading-relaxed mb-8">
      Tìm kiếm căn hộ, phòng trọ xác thực 100%. 
    </p>

    {/* Search Box - Thu nhỏ padding và bo góc nhẹ nhàng hơn */}
    <form 
  onSubmit={handleSearch} 
  className="bg-white p-1 rounded-full shadow-lg flex items-center gap-1 max-w-sm mx-auto border border-gray-100"
>
  <div className="flex items-center gap-2 px-3 flex-1">
    {/* Icon nhỏ lại */}
    
    <input 
      type="text" 
      placeholder="Tìm khu vực..."
      className="w-full py-1.5 bg-transparent outline-none text-xs font-medium text-gray-700"
      value={searchKeyword}
      onChange={(e) => setSearchKeyword(e.target.value)}
    />
  </div>
  
  {/* Nút bấm gọn gàng, bỏ chữ uppercase nếu muốn trông nhẹ nhàng hơn */}
  <button className="text-gray-400 border border-gray-300 p-2 hover:text-red-400 hover:border-red-400 rounded-full transition-all active:scale-95">
  <Search size={14} />
</button>
</form>
  </div>
</section>

      <main className="max-w-6xl mx-auto px-4 py-24 space-y-40">
        
        

        {/* --- SECTION 2: PHÒNG MỚI ĐĂNG (ROOMS) --- */}
        <section>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-3">Today's Picks</h2>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Phòng mới nhất</h3>
            </div>
            <Link to="/rooms" className="group flex items-center gap-2 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-all">
              Tất cả phòng <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => <div key={i} className="h-96 bg-white rounded-[2.5rem] animate-pulse border border-gray-100" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {rooms.map((room) => <RoomCard key={room.id} room={room} />)}
            </div>
          )}
        </section>
          {/* --- SECTION 1: DỊCH VỤ KHÁC BIỆT (FEATURES) --- */}
<section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center px-4 py-10">
  
  {/* Item 1 */}
  <div className="flex flex-col items-center group">
    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-sm transition-all group-hover:bg-blue-600 group-hover:text-white">
      <ShieldCheck size={24} className="md:w-8 md:h-8" />
    </div>
    <div className="max-w-[280px] md:max-w-none">
      <h4 className="text-base md:text-1x font-black uppercase tracking-tight text-gray-800">
        Thông tin xác thực
      </h4>
      <p className="text-gray-400 text-xs md:text-sm leading-relaxed mt-2 px-2">
        Mọi bài đăng đều được kiểm duyệt hình ảnh và thông tin pháp lý nghiêm ngặt.
      </p>
    </div>
  </div>

  {/* Item 2 */}
  <div className="flex flex-col items-center group">
    <div className="w-12 h-12 md:w-16 md:h-16 bg-green-50 text-green-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-sm transition-all group-hover:bg-green-600 group-hover:text-white">
      <Zap size={24} className="md:w-8 md:h-8" />
    </div>
    <div className="max-w-[280px] md:max-w-none">
      <h4 className="text-base md:text-1xl font-black uppercase tracking-tight text-gray-800">
        Thuê phòng nhanh
      </h4>
      <p className="text-gray-400 text-xs md:text-sm leading-relaxed mt-2 px-2">
        Quy trình đặt lịch xem phòng trực tuyến đơn giản chỉ với vài lần nhấp chuột.
      </p>
    </div>
  </div>

  {/* Item 3 */}
  <div className="flex flex-col items-center group">
    <div className="w-12 h-12 md:w-16 md:h-16 bg-red-50 text-red-600 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 shadow-sm transition-all group-hover:bg-red-600 group-hover:text-white">
      <Heart size={24} className="md:w-8 md:h-8" />
    </div>
    <div className="max-w-[280px] md:max-w-none">
      <h4 className="text-base md:text-1xl font-black uppercase tracking-tight text-gray-800">
        Cộng đồng văn minh
      </h4>
      <p className="text-gray-400 text-xs md:text-sm leading-relaxed mt-2 px-2">
        Hệ thống đánh giá cư dân giúp bạn tìm thấy những người bạn cùng nhà tuyệt vời.
      </p>
    </div>
  </div>
  
</section>
        {/* --- SECTION 3: KHU VỰC TIÊU BIỂU (LOCATIONS) --- */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-3">Thuê phòng</h2>
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter"> Khám phá phòng trọ theo khu vực và khoảng cách bạn muốn</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Quận 1", img: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=400", count: "120+ phòng" },
              { name: "Bình Thạnh", img: "https://images.unsplash.com/photo-1555620986-044735073676?q=80&w=400", count: "85+ phòng" },
              { name: "Quận 7", img: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=400", count: "60+ phòng" },
              { name: "Quận 9", img: "https://images.unsplash.com/photo-1590001158193-790179980bd3?q=80&w=400", count: "45+ phòng" },
            ].map((loc, i) => (
              <Link to={`/rooms?keyword=${loc.name}`} key={i} className="group relative h-64 rounded-3xl overflow-hidden">
                <img src={loc.img} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={loc.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                  <h4 className="text-white font-black uppercase text-lg">{loc.name}</h4>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{loc.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- SECTION 4: SỰ KIỆN CỘNG ĐỒNG (EVENTS) --- */}
        <section className="bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="max-w-md">
              <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-3">Life at Community</h2>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">Hoạt động sắp tới</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Không chỉ là nơi ở, chúng tôi xây dựng một lối sống gắn kết và sẻ chia.</p>
            </div>
            <Link to="/events" className="group flex items-center gap-2 text-[11px] font-black text-blue-600 uppercase tracking-widest hover:gap-4 transition-all">
              Xem toàn bộ lịch trình <ArrowUpRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {!loading && events.map((event) => (
              <Link to={`/events/${event.id}`} key={event.id} className="group block">
                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden mb-6 bg-gray-100">
                  <img src={event.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={event.title} />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3">
                  <Calendar size={14} />
                  {new Date(event.startDate).toLocaleDateString('vi-VN')}
                </div>
                <h4 className="text-lg font-bold text-gray-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">{event.title}</h4>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                  <MapPin size={12} /> {event.location}
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>

      
    </div>
  );
}