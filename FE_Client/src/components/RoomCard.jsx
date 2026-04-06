import React, { useState, useEffect } from 'react';
import { MapPin, Heart, Zap, Droplets, Wifi, Users, Sofa, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification'; // Import component thông báo của bạn

export default function RoomCard({ room }) {
  const navigate = useNavigate();
  const [isFavorited, setIsFavorited] = useState(room.isFavorited || false);
  const [loading, setLoading] = useState(false);
  
  // State để quản lý thông báo ngay trong Card
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    setIsFavorited(room.isFavorited);
  }, [room.isFavorited]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    // Thay thế alert bằng Notification
    if (!token) {
      setNotification({
        show: true,
        message: "Vui lòng đăng nhập để lưu phòng!",
        type: "error"
      });
      return;
    }
    
    if (loading) return;
    const previousState = isFavorited;
    setIsFavorited(!previousState);
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/favorites/toggle`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ roomId: room._id || room.id })
      });

      if (response.ok) {
        setNotification({
          show: true,
          message: !previousState ? "Đã thêm vào yêu thích!" : "Đã xóa khỏi yêu thích!",
          type: "success"
        });
      }
    } catch (err) {
      setIsFavorited(previousState);
      setNotification({
        show: true,
        message: "Có lỗi xảy ra, vui lòng thử lại!",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (path.startsWith('http')) return path;
    return `${import.meta.env.VITE_API_BASE_URL}${path}`;
  };

  return (
    <div 
      onClick={() => navigate(`/rooms/${room._id || room.id}`)}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full relative"
    >
      {/* Hiển thị Notification ngay trong phạm vi Card hoặc Portal */}
      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification({ ...notification, show: false })} 
        />
      )}

      {/* Hình ảnh */}
      <div className="relative h-40 overflow-hidden">
        <img 
          src={getImageUrl(room.mainImage || (room.images?.[0]?.url))} 
          alt={room.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <button 
          onClick={handleToggleFavorite}
          disabled={loading}
          className={`absolute top-3 right-3 p-1.5 rounded-full shadow-md backdrop-blur-sm transition-all z-10 ${
            isFavorited ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-400'
          }`}
        >
          <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
        </button>

        <div className="absolute bottom-2 left-3 bg-blue-600/90 px-2 py-0.5 rounded-full text-white text-[8px] font-bold uppercase tracking-wider">
          {room.type}
        </div>
      </div>

      {/* Nội dung chi tiết */}
      <div className="p-3 flex flex-col flex-1">
        <h4 className="text-[13px] font-bold text-gray-800 line-clamp-2 h-9 group-hover:text-blue-600 transition-colors leading-snug mb-1">
          {room.title}
        </h4>

        {/* Giá & Diện tích */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-rose-600 font-extrabold text-sm tracking-tight">
            {room.price?.toLocaleString()}<small className="text-[10px] ml-0.5 font-bold uppercase">đ</small>
          </span>
          <div className="flex items-center gap-1 text-gray-400 text-[9px] font-bold">
            <Maximize2 size={10} /> {room.area}m²
          </div>
        </div>

        {/* Grid Dịch vụ */}
        <div className="grid grid-cols-2 gap-y-1 gap-x-1 py-2 border-y border-gray-50 mb-2">
          <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500">
            <Zap size={10} className="text-yellow-500" /> {room.electricPrice/1000}k
          </div>
          <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500">
            <Droplets size={10} className="text-blue-400" /> {room.waterPrice/1000}k
          </div>
          <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500">
            <Users size={10} className="text-purple-500" /> Max: {room.maxPeople}
          </div>
          <div className="flex items-center gap-1 text-[9px] font-bold text-gray-500">
            <Wifi size={10} className="text-green-500" /> {room.internetPrice > 0 ? `${room.internetPrice/1000}k` : "Free"}
          </div>
        </div>

        {/* Nội thất tag */}
        {room.furniture && (
          <div className="flex items-center gap-1 mb-2">
            <Sofa size={10} className="text-orange-400 flex-shrink-0" />
            <span className="text-[9px] text-gray-400 truncate">
              {room.furniture}
            </span>
          </div>
        )}

        {/* Địa chỉ */}
        <div className="mt-auto pt-2 flex items-center gap-1 text-gray-400 border-t border-gray-50">
          <MapPin size={9} className="text-blue-500" />
          <span className="text-[9px] font-bold truncate uppercase">
            {room.district}, {room.city}
          </span>
        </div>
      </div>
    </div>
  );
}