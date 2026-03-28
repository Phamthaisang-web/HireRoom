import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import RoomCard from '../components/RoomCard';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { 
  Search, MapPin, CircleDollarSign, Home, X, 
  ChevronLeft, ChevronRight, Filter, Map, 
  RotateCcw, ChevronUp, ChevronDown
} from 'lucide-react';

export default function RoomPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalRooms, setTotalRooms] = useState(0);

  // --- State Điều khiển hiển thị bộ lọc ---
  const [isFilterVisible, setIsFilterVisible] = useState(true);

  // --- State Địa giới ---
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // --- State Slider ---
  const [localPrice, setLocalPrice] = useState([0, 20000000]);

  // Lấy params từ URL
  const keyword = searchParams.get("keyword") || "";
  const type = searchParams.get("type") || "";
  const city = searchParams.get("city") || "";
  const district = searchParams.get("district") || "";
  const ward = searchParams.get("ward") || "";
  const priceRange = searchParams.get("priceRange") || "0-20000000";
  const page = parseInt(searchParams.get("page") || "1");
  
  const limit = 20;
  const token = localStorage.getItem("token");

  // --- 1. Fetch Tỉnh/Thành & Đồng bộ Slider ---
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error("Lỗi fetch tỉnh:", err));
  }, []);

  useEffect(() => {
    const [min, max] = priceRange.split("-").map(Number);
    setLocalPrice([min || 0, max || 20000000]);
  }, [priceRange]);

  // --- 2. Fetch Quận/Huyện ---
  useEffect(() => {
    if (!city || provinces.length === 0) {
      setDistricts([]);
      return;
    }
    const selectedProvince = provinces.find(p => 
      p.name.toLowerCase().includes(city.toLowerCase()) || city.toLowerCase().includes(p.name.toLowerCase())
    );
    
    if (selectedProvince) {
      fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
        .then(res => res.json())
        .then(data => setDistricts(data.districts));
    }
  }, [city, provinces]);

  // --- 3. Fetch Phường/Xã ---
  useEffect(() => {
    if (!district || districts.length === 0) {
      setWards([]);
      return;
    }
    const selectedDistrict = districts.find(d => 
      d.name.toLowerCase().includes(district.toLowerCase()) || district.toLowerCase().includes(d.name.toLowerCase())
    );

    if (selectedDistrict) {
      fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
        .then(res => res.json())
        .then(data => setWards(data.wards));
    }
  }, [district, districts]);

  // --- 4. Logic cập nhật Filter ---
  const updateFilter = (newFilter) => {
    const currentParams = Object.fromEntries([...searchParams]);
    
    if (newFilter.city !== undefined && newFilter.city !== currentParams.city) {
      newFilter.district = "";
      newFilter.ward = "";
    }
    if (newFilter.district !== undefined && newFilter.district !== currentParams.district) {
      newFilter.ward = "";
    }

    const updatedParams = { ...currentParams, ...newFilter };

    if (!newFilter.page) {
      updatedParams.page = 1;
    }

    Object.keys(updatedParams).forEach(key => {
      if (updatedParams[key] === "" || updatedParams[key] === undefined || updatedParams[key] === null) {
        delete updatedParams[key];
      }
    });

    setSearchParams(updatedParams);
  };

  // --- 5. Gọi API lấy danh sách phòng ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [minPrice, maxPrice] = priceRange.split("-");
        const query = new URLSearchParams({
          page, limit, keyword, type, city, district, ward, minPrice, maxPrice
        }).toString();

        const roomsRes = await fetch(`http://localhost:8080/rooms?${query}`);
        const roomsData = await roomsRes.json();
        
        let fetchedRooms = roomsData.rooms || [];
        setTotalRooms(roomsData.pagination?.totalItems || roomsData.total || 0); 

        if (token && fetchedRooms.length > 0) {
          const favRes = await fetch("http://localhost:8080/favorites/me", {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (favRes.ok) {
            const favData = await favRes.json();
            const favIds = (favData.rooms || []).map(r => r.id);
            fetchedRooms = fetchedRooms.map(room => ({
              ...room,
              isFavorited: favIds.includes(room.id)
            }));
          }
        }
        setRooms(fetchedRooms);
      } catch (error) {
        console.error("Lỗi fetch rooms:", error);
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
   

      <div className="pt-2 pb-6 bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col gap-5">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2 text-blue-600">
                  <Map size={20} />
                  {district || city || "Khắp Việt Nam"}
                </h1>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                  Tìm thấy {totalRooms} kết quả
                </p>
              </div>
              
              
            </div>
              <div className="flex gap-2 ">
                {/* NÚT ẨN HIỆN BỘ LỌC */}
                <button 
                  onClick={() => setIsFilterVisible(!isFilterVisible)}
                  className="text-[10px] font-black uppercase bg-gray-50 text-gray-500 px-3 py-1.5 rounded-lg hover:bg-gray-100 flex items-center gap-2 transition-colors"
                >
                  <Filter size={12} />
                  {isFilterVisible ? "Ẩn lọc" : "Hiện lọc"}
                  {isFilterVisible ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                {/* NÚT RESET */}
                <button 
                  onClick={() => setSearchParams({})} 
                  className="text-[10px] font-black uppercase bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            {/* VÙNG BỘ LỌC (ẨN/HIỆN THEO STATE) */}
            {isFilterVisible && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 transition-all duration-300 ease-in-out">
                {/* NHẬP ĐỊA ĐIỂM */}
                <div className="md:col-span-6 grid grid-cols-3 gap-2">
                  <div className="relative">
                    <input
                      list="province-list"
                      value={city}
                      placeholder="Nhập Tỉnh/Thành"
                      onChange={(e) => updateFilter({ city: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-xl px-3 py-3 text-[11px] font-bold text-gray-600 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <datalist id="province-list">
                      {provinces.map(p => <option key={p.code} value={p.name} />)}
                    </datalist>
                  </div>

                  <div className="relative">
                    <input
                      list="district-list"
                      disabled={!city}
                      value={district}
                      placeholder="Nhập Quận/Huyện"
                      onChange={(e) => updateFilter({ district: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-xl px-3 py-3 text-[11px] font-bold text-gray-600 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    />
                    <datalist id="district-list">
                      {districts.map(d => <option key={d.code} value={d.name} />)}
                    </datalist>
                  </div>

                  <div className="relative">
                    <input
                      list="ward-list"
                      disabled={!district}
                      value={ward}
                      placeholder="Nhập Phường/Xã"
                      onChange={(e) => updateFilter({ ward: e.target.value })}
                      className="w-full bg-gray-50 border-none rounded-xl px-3 py-3 text-[11px] font-bold text-gray-600 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
                    />
                    <datalist id="ward-list">
                      {wards.map(w => <option key={w.code} value={w.name} />)}
                    </datalist>
                  </div>
                </div>

                {/* Loại hình */}
                <div className="md:col-span-3 relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  <select 
                    value={type}
                    onChange={(e) => updateFilter({ type: e.target.value })}
                    className="w-full bg-gray-50 border-none rounded-xl pl-9 pr-3 py-3 text-[11px] font-bold text-gray-600 focus:ring-2 focus:ring-blue-500/10 appearance-none cursor-pointer"
                  >
                    <option value="">Tất cả loại hình</option>
                    <option value="Phòng trọ">Phòng trọ</option>
                    <option value="Chung cư">Chung cư mini</option>
                    <option value="Nhà nguyên căn">Nhà nguyên căn</option>
                  </select>
                </div>

                {/* Slider Giá */}
                <div className="md:col-span-3 bg-gray-50 rounded-xl px-4 py-2 flex flex-col justify-center">
                  <div className="flex justify-between mb-1">
                    <span className="text-[9px] font-black text-blue-600 uppercase">{localPrice[0].toLocaleString()}đ</span>
                    <span className="text-[9px] font-black text-blue-600 uppercase">{localPrice[1].toLocaleString()}đ</span>
                  </div>
                  <Slider
                    range min={0} max={20000000} step={500000}
                    value={localPrice}
                    onChange={setLocalPrice}
                    onChangeComplete={(val) => updateFilter({ priceRange: `${val[0]}-${val[1]}` })}
                    trackStyle={[{ backgroundColor: '#2563eb' }]}
                    handleStyle={[{ borderColor: '#2563eb' }, { borderColor: '#2563eb' }]}
                    railStyle={{ backgroundColor: '#e5e7eb' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 bg-white rounded-[2.5rem] animate-pulse border border-gray-100 shadow-sm" />
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {rooms.map((room) => <RoomCard key={room.id} room={room} />)}
            </div>

            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => updateFilter({ page: page - 1 })}
                  className="p-3 rounded-full bg-white border border-gray-100 disabled:opacity-20 hover:bg-blue-50 transition-all shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => updateFilter({ page: i + 1 })}
                    className={`w-10 h-10 rounded-full font-bold text-[11px] transition-all ${
                      page === i + 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-400 hover:bg-gray-100'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  disabled={page === totalPages}
                  onClick={() => updateFilter({ page: page + 1 })}
                  className="p-3 rounded-full bg-white border border-gray-100 disabled:opacity-20 hover:bg-blue-50 transition-all shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-300" size={28} />
              </div>
              <h3 className="font-bold text-gray-900 uppercase">Không tìm thấy kết quả</h3>
              <p className="text-gray-400 text-[11px] mt-1 uppercase font-bold tracking-widest leading-relaxed">
                Hãy thử nới lỏng bộ lọc hoặc thay đổi khu vực tìm kiếm
              </p>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 text-center">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
           © 2026 Premium Rental Hub • Vietnam
         </p>
      </footer>
    </div>
  );
}