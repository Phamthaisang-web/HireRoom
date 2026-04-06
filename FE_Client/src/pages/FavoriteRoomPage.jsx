import React, { useState, useEffect } from 'react';
import { Heart, Home, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import RoomCard from '../components/RoomCard';

export default function FavoriteRooms() {
  const [favoriteRooms, setFavoriteRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;
  

  const fetchFavorites = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/favorites/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await res.json();
      
      const rawRooms = result.data || [];
      
      const processedRooms = rawRooms.map(room => {
        // Mặc định ảnh chờ nếu không có dữ liệu
        let mainImage = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000";
        
        if (room.images && room.images.length > 0) {
          // 1. Tìm ảnh có đánh dấu thumbnail, nếu không có thì lấy ảnh đầu tiên
          const thumbObj = room.images.find(img => img.isThumbnail) || room.images[0];
          
          // 2. Lấy giá trị URL (xử lý cả trường hợp img là string hoặc object)
          const rawUrl = typeof thumbObj === 'object' ? thumbObj.url : thumbObj;
          
          if (rawUrl) {
            // 3. Ghép domain nếu là link nội bộ (/uploads/...), giữ nguyên nếu là link tuyệt đối
            mainImage = rawUrl.startsWith('http') 
              ? rawUrl 
              : `${API_URL}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
          }
        }

        return {
          ...room,
          id: room._id || room.id,
          mainImage, 
          isFavorited: true 
        };
      });
      
      setFavoriteRooms(processedRooms);
    } catch (err) {
      console.error("Lỗi fetch danh sách yêu thích:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFromList = (roomId) => {
    setFavoriteRooms(prev => prev.filter(r => (r._id || r.id) !== roomId));
  };
return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans">
      <section className="bg-white border-b border-gray-100 pt-2 md:pt-32 pb-12">
        <div className="max-w-6xl mx-auto px-4">
          
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
                  <Heart size={20} md:size={24} fill="currentColor" />
                </div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-gray-900 leading-none">
                  Phòng đã <span className="text-rose-500">yêu thích</span>
                </h1>
              </div>
              <p className="text-gray-500 text-[12px] md:text-sm font-medium">Lưu trữ những không gian phù hợp nhất.</p>
            </div>
            
            {/* Badge đếm số lượng tinh gọn hơn cho mobile */}
            <div className="bg-gray-100 self-start md:self-end px-4 py-2 rounded-2xl flex items-center shadow-sm">
                <span className="text-gray-900 font-black text-lg leading-none">{favoriteRooms.length}</span>
                <span className="text-gray-400 text-[9px] font-bold uppercase ml-2 tracking-[0.2em]">Phòng</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="font-bold uppercase text-[9px] tracking-widest text-center">Đang tải dữ liệu...</p>
          </div>
        ) : favoriteRooms.length > 0 ? (
          /* SỬA TẠI ĐÂY: grid-cols-2 cho điện thoại, lg:grid-cols-4 cho màn hình lớn */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {favoriteRooms.map((room) => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onToggleSuccess={handleRemoveFromList}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-6 bg-white rounded-[2rem] md:rounded-[3rem] border border-dashed border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <Home size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 uppercase mb-2 tracking-tight">Chưa có phòng nào</h3>
            <p className="text-gray-400 text-xs mb-6 uppercase font-medium tracking-widest">Danh sách đang trống</p>
            <Link to="/rooms" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all shadow-lg active:scale-95">
              Khám phá ngay
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}