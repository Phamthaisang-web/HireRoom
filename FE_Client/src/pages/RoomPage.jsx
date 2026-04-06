import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import RoomCard from '../components/RoomCard';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { 
  Search, MapPin, Filter, 
  RotateCcw, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight
} from 'lucide-react';

export default function RoomPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRooms, setTotalRooms] = useState(0);

  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [localPrice, setLocalPrice] = useState([0, 20000000]);

  // Cấu hình URL
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  // Các giá trị lọc từ URL
  const keyword = searchParams.get("keyword") || "";
  const type = searchParams.get("type") || "";
  const city = searchParams.get("city") || "";
  const district = searchParams.get("district") || "";
  const ward = searchParams.get("ward") || "";
  const priceRange = searchParams.get("priceRange") || "0-20000000";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 12; // Điều chỉnh limit cho cân đối layout grid

  // 1. Fetch Tỉnh/Thành ban đầu
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error("Lỗi fetch tỉnh:", err));
  }, []);

  // Đồng bộ thanh kéo Slider khi URL thay đổi (VD: bấm Reset)
  useEffect(() => {
    const [min, max] = priceRange.split("-").map(Number);
    setLocalPrice([min || 0, max || 20000000]);
  }, [priceRange]);

  // 2. Fetch Quận/Huyện & Phường/Xã dựa trên lựa chọn
  useEffect(() => {
    if (!city || provinces.length === 0) { setDistricts([]); return; }
    const selected = provinces.find(p => p.name === city); // So khớp chính xác name
    if (selected) {
      fetch(`https://provinces.open-api.vn/api/p/${selected.code}?depth=2`)
        .then(res => res.json()).then(data => setDistricts(data.districts));
    }
  }, [city, provinces]);

  useEffect(() => {
    if (!district || districts.length === 0) { setWards([]); return; }
    const selected = districts.find(d => d.name === district);
    if (selected) {
      fetch(`https://provinces.open-api.vn/api/d/${selected.code}?depth=2`)
        .then(res => res.json()).then(data => setWards(data.wards));
    }
  }, [district, districts]);

  // Hàm cập nhật URL Params
  const updateFilter = (newFilter) => {
    const currentParams = Object.fromEntries([...searchParams]);
    
    // Reset địa chỉ con nếu đổi địa chỉ cha
    if (newFilter.city !== undefined && newFilter.city !== currentParams.city) {
      newFilter.district = ""; 
      newFilter.ward = "";
    }
    if (newFilter.district !== undefined && newFilter.district !== currentParams.district) {
      newFilter.ward = "";
    }

    const updatedParams = { ...currentParams, ...newFilter };
    if (!newFilter.page) updatedParams.page = 1; // Reset về trang 1 khi lọc

    // Xóa các param rỗng
    Object.keys(updatedParams).forEach(key => {
      if (!updatedParams[key] || updatedParams[key] === "undefined") delete updatedParams[key];
    });
    setSearchParams(updatedParams);
  };

  // 3. LOGIC FETCH PHÒNG
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const [minPrice, maxPrice] = priceRange.split("-");
        
        const query = new URLSearchParams({
          page, limit, keyword, type, city, district, ward, minPrice, maxPrice
        }).toString();

        const [roomsRes, favRes] = await Promise.all([
          fetch(`${API_URL}/rooms?${query}`),
          token 
            ? fetch(`${API_URL}/favorites/me`, { headers: { Authorization: `Bearer ${token}` } }) 
            : Promise.resolve(null)
        ]);

        const roomsData = await roomsRes.json();
        const favData = favRes ? await favRes.json() : { data: [] }; // Sửa lỗi .rooms thành .data
        
        const rawRooms = roomsData.rooms || [];
        const favIds = (favData.data || []).map(r => (r._id || r.id).toString());
        setTotalRooms(roomsData.pagination?.totalItems || 0);

        const processedRooms = rawRooms.map(room => {
          const roomId = (room._id || room.id).toString();
          let mainImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000";
          
          if (room.images && room.images.length > 0) {
            const thumb = room.images.find(img => img.isThumbnail) || room.images[0];
            const url = typeof thumb === 'object' ? thumb.url : thumb;
            mainImage = url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
          }

          return { 
            ...room, 
            id: roomId,
            mainImage, 
            isFavorited: favIds.includes(roomId) 
          };
        });

        setRooms(processedRooms);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Cuộn lên đầu trang khi đổi trang/lọc
      } catch (error) {
        console.error("Lỗi fetch phòng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [keyword, type, city, district, ward, priceRange, page, API_URL, BASE_URL]);

  const totalPages = Math.ceil(totalRooms / limit);

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-gray-900">
      {/* Filter Section */}{/* CHỈNH SỬA TẠI ĐÂY:
  1. Thêm top-[64px] (thay 64px bằng chiều cao Header của bạn, thường là h-16 = 64px). Nếu không có Header trên cùng, hãy để top-0.
  2. Tăng z-20 lên z-[100] để đảm bảo luôn nằm trên các phần tử khác.
  3. Thêm w-full để đảm bảo độ rộng khi fixed/sticky.
*/}
<div className="pt-6 pb-6 bg-white border-b border-gray-100 sticky top-[64px] z-[100] shadow-sm w-full">
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className=" font-black uppercase tracking-tighter flex items-center gap-2 text-blue-600">
            <MapPin size={20} />
            {ward || district || city || "Khắp Việt Nam"}
          </h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Tìm thấy {totalRooms} kết quả phù hợp
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsFilterVisible(!isFilterVisible)}
            className="text-[10px] font-black uppercase bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-all"
          >
            <Filter size={12} />
            {isFilterVisible ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            {isFilterVisible ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          <button 
            onClick={() => setSearchParams({})} 
            className="text-[10px] font-black uppercase bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={12} /> Làm mới
          </button>
        </div>
      </div>

      {isFilterVisible && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="md:col-span-6 grid grid-cols-3 gap-2">
            <select 
              value={city} 
              onChange={(e) => updateFilter({ city: e.target.value })} 
              className="bg-gray-50 rounded-xl px-3 py-3 text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 border-none cursor-pointer"
            >
              <option value="">Tỉnh/Thành</option>
              {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
            </select>

            <select 
              disabled={!city} 
              value={district} 
              onChange={(e) => updateFilter({ district: e.target.value })} 
              className="bg-gray-50 rounded-xl px-3 py-3 text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 border-none cursor-pointer"
            >
              <option value="">Quận/Huyện</option>
              {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
            </select>
            
            <select 
              disabled={!district} 
              value={ward} 
              onChange={(e) => updateFilter({ ward: e.target.value })} 
              className="bg-gray-50 rounded-xl px-3 py-3 text-[11px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 border-none cursor-pointer"
            >
              <option value="">Phường/Xã</option>
              {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
            </select>
          </div>

          <div className="md:col-span-3">
            <select value={type} onChange={(e) => updateFilter({ type: e.target.value })} className="w-full bg-gray-50 rounded-xl px-3 py-3 text-[11px] font-bold outline-none h-full border-none cursor-pointer">
              <option value="">Tất cả loại hình</option>
              <option value="Phòng trọ">Phòng trọ</option>
              <option value="Chung cư">Chung cư</option>
              <option value="Chung cư">Căn hộ mini</option>
              <option value="Nhà nguyên căn">Nhà nguyên căn</option>
            </select>
          </div>

          <div className="md:col-span-3 bg-gray-50 rounded-xl px-4 py-2 flex flex-col justify-center">
            <div className="flex justify-between mb-1 text-[9px] font-black text-blue-600 uppercase">
              <span>{localPrice[0].toLocaleString()}đ</span>
              <span>{localPrice[1].toLocaleString()}đ</span>
            </div>
            <Slider 
              range min={0} max={20000000} step={500000} 
              value={localPrice} 
              onChange={setLocalPrice} 
              onChangeComplete={(val) => updateFilter({ priceRange: `${val[0]}-${val[1]}` })} 
              trackStyle={[{backgroundColor:'#2563eb'}]} 
              handleStyle={[{borderColor:'#2563eb', backgroundColor:'#fff'},{borderColor:'#2563eb', backgroundColor:'#fff'}]} 
            />
          </div>
        </div>
      )}
    </div>
  </div>
</div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-72 bg-gray-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {rooms.map((room) => <RoomCard key={room.id} room={room} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-2">
                <button 
                  disabled={page === 1} 
                  onClick={() => updateFilter({ page: page - 1 })} 
                  className="p-2 bg-white border border-gray-100 rounded-full disabled:opacity-20 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => updateFilter({ page: i + 1 })} 
                    className={`w-10 h-10 rounded-full font-bold text-[11px] transition-all duration-300 ${page === i + 1 ? 'bg-blue-600 text-white shadow-lg scale-110' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button 
                  disabled={page === totalPages} 
                  onClick={() => updateFilter({ page: page + 1 })} 
                  className="p-2 bg-white border border-gray-100 rounded-full disabled:opacity-20 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-sm animate-in zoom-in-95 duration-500">
            <Search className="text-gray-200 mx-auto mb-4" size={48} />
            <h3 className="font-black text-gray-900 uppercase tracking-tighter text-xl">Không tìm thấy kết quả</h3>
            <p className="text-gray-400 text-[11px] mt-1 uppercase font-bold tracking-widest">Hãy thử nới lỏng bộ lọc hoặc tìm khu vực khác</p>
          </div>
        )}
      </main>
    </div>
  );
}