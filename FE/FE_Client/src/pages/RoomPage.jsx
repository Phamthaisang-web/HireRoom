import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import RoomCard from '../components/RoomCard';
import { 
  Search, MapPin, CircleDollarSign, Home, X, 
  ChevronLeft, ChevronRight, Map, Filter 
} from 'lucide-react';

export default function RoomPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRooms, setTotalRooms] = useState(0);

  // 1. Lấy tất cả params từ URL để đồng bộ hóa giao diện
  const keyword = searchParams.get("keyword") || "";
  const type = searchParams.get("type") || "";
  const city = searchParams.get("city") || "";
  const district = searchParams.get("district") || "";
  const ward = searchParams.get("ward") || "";
  const priceRange = searchParams.get("priceRange") || "";
  const page = parseInt(searchParams.get("page") || "1");
  
  const limit = 9;
  const token = localStorage.getItem("token");

  // 2. Hàm cập nhật filter thông minh
  const updateFilter = (newFilter) => {
    const currentParams = Object.fromEntries([...searchParams]);
    
    // Logic: Nếu thay đổi cấp cha thì reset các cấp con
    if (newFilter.city !== undefined && newFilter.city !== currentParams.city) {
      newFilter.district = "";
      newFilter.ward = "";
    }
    if (newFilter.district !== undefined && newFilter.district !== currentParams.district) {
      newFilter.ward = "";
    }

    const updatedParams = { ...currentParams, ...newFilter, page: 1 };
    
    // Làm sạch params rỗng
    Object.keys(updatedParams).forEach(key => {
      if (!updatedParams[key]) delete updatedParams[key];
    });
    
    setSearchParams(updatedParams);
  };

  // 3. Hiệu ứng lấy dữ liệu khi URL thay đổi
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Tách giá từ range "min-max"
        let minPrice = "";
        let maxPrice = "";
        if (priceRange) {
          [minPrice, maxPrice] = priceRange.split("-");
        }

        const query = new URLSearchParams({
          page,
          limit,
          keyword,
          type,
          city,
          district,
          ward,
          minPrice,
          maxPrice
        }).toString();

        const roomsRes = await fetch(`http://localhost:8080/rooms?${query}`);
        const roomsData = await roomsRes.json();
        
        // Cấu trúc trả về từ Backend: { rooms, pagination: { totalItems, ... } }
        let allRooms = roomsData.rooms || [];
        setTotalRooms(roomsData.pagination?.totalItems || 0); 

        // So khớp yêu thích nếu đã đăng nhập
        if (token && allRooms.length > 0) {
          const favRes = await fetch("http://localhost:8080/favorites/me", {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (favRes.ok) {
            const favData = await favRes.json();
            const favIds = (favData.rooms || []).map(r => r.id);
            allRooms = allRooms.map(room => ({
              ...room,
              isFavorited: favIds.includes(room.id)
            }));
          }
        }

        setRooms(allRooms);
      } catch (error) {
        console.error("Lỗi lấy danh sách phòng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [keyword, type, city, district, ward, priceRange, page, token]);

  const totalPages = Math.ceil(totalRooms / limit);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900">
      <Header />

      {/* FILTER SECTION */}
      <div className="pt-28 pb-8 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col gap-6">
            
            {/* Header Info */}
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                  <Filter size={22} className="text-blue-600" />
                  Kết quả tìm kiếm
                </h1>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                  Tìm thấy {totalRooms} phòng tại {city || "Toàn quốc"} {district && `> ${district}`}
                </p>
              </div>
              
              {(type || city || district || ward || priceRange || keyword) && (
                <button 
                  onClick={() => setSearchParams({})}
                  className="text-red-500 text-[10px] font-black uppercase flex items-center gap-1 hover:underline"
                >
                  <X size={12} /> Xóa tất cả bộ lọc
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              
              {/* Loại hình */}
              <div className="relative">
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select 
                  value={type}
                  onChange={(e) => updateFilter({ type: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-xl pl-9 pr-3 py-3.5 text-[11px] font-bold text-gray-600 focus:ring-2 focus:ring-blue-500/10 appearance-none transition-all"
                >
                  <option value="">Loại hình</option>
                  <option value="Phòng trọ">Phòng trọ</option>
                  <option value="Chung cư">Chung cư mini</option>
                  <option value="Nhà nguyên căn">Nhà nguyên căn</option>
                </select>
              </div>

              {/* Tỉnh / Thành */}
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select 
                  value={city}
                  onChange={(e) => updateFilter({ city: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-xl pl-9 pr-3 py-3.5 text-[11px] font-bold text-gray-600 focus:ring-2 focus:ring-blue-500/10 appearance-none transition-all"
                >
                  <option value="">Tỉnh / Thành</option>
                  <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                </select>
              </div>

              {/* Quận / Huyện */}
              <div className="relative">
                <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select 
                  disabled={!city}
                  value={district}
                  onChange={(e) => updateFilter({ district: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-xl pl-9 pr-3 py-3.5 text-[11px] font-bold text-gray-600 focus:ring-2 focus:ring-blue-500/10 appearance-none disabled:opacity-50 transition-all"
                >
                  <option value="">Quận / Huyện</option>
                  {city === "Hồ Chí Minh" && (
                    <>
                      <option value="Quận 1">Quận 1</option>
                      <option value="Quận 7">Quận 7</option>
                      <option value="Bình Thạnh">Bình Thạnh</option>
                      <option value="Gò Vấp">Gò Vấp</option>
                    </>
                  )}
                </select>
              </div>

              {/* Phường / Xã */}
              <div className="relative">
                <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select 
                  disabled={!district}
                  value={ward}
                  onChange={(e) => updateFilter({ ward: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-xl pl-9 pr-3 py-3.5 text-[11px] font-bold text-gray-600 focus:ring-2 focus:ring-blue-500/10 appearance-none disabled:opacity-50 transition-all"
                >
                  <option value="">Phường / Xã</option>
                  {district === "Quận 1" && (
                    <>
                      <option value="Đa Kao">Đa Kao</option>
                      <option value="Tân Định">Tân Định</option>
                      <option value="Bến Nghé">Bến Nghé</option>
                    </>
                  )}
                </select>
              </div>

              {/* Giá tiền */}
              <div className="relative lg:col-span-2">
                <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select 
                  value={priceRange}
                  onChange={(e) => updateFilter({ priceRange: e.target.value })}
                  className="w-full bg-gray-50 border-none rounded-xl pl-9 pr-3 py-3.5 text-[11px] font-bold text-gray-600 focus:ring-2 focus:ring-blue-500/10 appearance-none transition-all"
                >
                  <option value="">Mọi mức giá</option>
                  <option value="0-2000000">Dưới 2 triệu</option>
                  <option value="2000000-4000000">2 - 4 triệu</option>
                  <option value="4000000-7000000">4 - 7 triệu</option>
                  <option value="7000000-15000000">7 - 15 triệu</option>
                  <option value="15000000-999999999">Trên 15 triệu</option>
                </select>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* LISTING SECTION */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 bg-white rounded-[2.5rem] animate-pulse border border-gray-100 shadow-sm"></div>
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                <button 
                  disabled={page === 1}
                  onClick={() => updateFilter({ page: page - 1 })}
                  className="p-3 rounded-full bg-white border border-gray-100 disabled:opacity-20 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => updateFilter({ page: i + 1 })}
                    className={`w-11 h-11 rounded-full font-bold text-[11px] transition-all ${
                      page === i + 1 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' 
                        : 'bg-white text-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  disabled={page === totalPages}
                  onClick={() => updateFilter({ page: page + 1 })}
                  className="p-3 rounded-full bg-white border border-gray-100 disabled:opacity-20 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-gray-200 shadow-sm">
             <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-gray-300" size={32} />
             </div>
             <h3 className="text-lg font-bold uppercase tracking-tight">Rất tiếc, không có kết quả</h3>
             <p className="text-gray-400 text-xs mt-2 max-w-xs mx-auto uppercase font-bold tracking-widest leading-loose">
                Thử xóa bớt bộ lọc hoặc tìm kiếm bằng từ khóa khác
             </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-16 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
            © 2026 Premium Rental Platform • Ho Chi Minh City
         </p>
      </footer>
    </div>
  );
}