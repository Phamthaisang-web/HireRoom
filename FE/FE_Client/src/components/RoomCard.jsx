import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Heart, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RoomCard({ room }) {
  const navigate = useNavigate();
  const [mainImage, setMainImage] = useState("https://placehold.co/600x400?text=...");
  const [isFavorited, setIsFavorited] = useState(room.isFavorited || false); // Trạng thái yêu thích
  const BASE_URL = "http://localhost:8080";

  // Lấy Token từ localStorage (Giả sử bạn lưu token khi đăng nhập)
  const token = localStorage.getItem("token") || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; 

  useEffect(() => {
    const fetchRoomImages = async () => {
      try {
        const res = await fetch(`${BASE_URL}/image-rooms?roomId=${room.id}`);
        const data = await res.json();
        if (data.imageRooms?.length > 0) {
          const url = data.imageRooms[0].imageUrl;
          setMainImage(url.startsWith('http') ? url : `${BASE_URL}${url}`);
        } else {
          setMainImage("https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1000");
        }
      } catch (err) {
        console.error("Lỗi lấy ảnh:", err);
      }
    };
    fetchRoomImages();
  }, [room.id]);

  // Hàm xử lý Toggle Yêu thích
  const handleToggleFavorite = async (e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài làm nhảy vào trang chi tiết
    
    try {
      const res = await fetch(`${BASE_URL}/favorites/toggle`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomId: room.id })
      });
      const data = await res.json();
      
      if (res.ok) {
        setIsFavorited(data.favorited); // Cập nhật UI dựa trên kết quả API
      }
    } catch (err) {
      console.error("Lỗi khi yêu thích:", err);
    }
  };
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};
  const formatPrice = (price) => {
    return (parseFloat(price) / 1000000).toFixed(1) + " tr/tháng";
  };

  return (
    <div 
      onClick={() => navigate(`/rooms/${room.id}`)}
      className="bg-white rounded-[1rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden p-2">
        <img 
          src={mainImage} 
          alt={room.title} 
          className="w-full h-full object-cover rounded-[1.5rem] transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = "https://placehold.co/600x400?text=No+Image"; }}
        />
        
        {/* Badge Loại phòng */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-gray-900 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm">
          {room.type}
        </div>

        {/* NÚT YÊU THÍCH - Nhỏ gọn ở góc */}
        <button 
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 z-10 ${
            isFavorited 
            ? 'bg-rose-500 text-white shadow-lg shadow-rose-200 scale-110' 
            : 'bg-white/80 backdrop-blur-md text-gray-400 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart size={14} fill={isFavorited ? "currentColor" : "none"} />
        </button>

        {/* Icon Arrow khi hover */}
        <div className="absolute bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300 shadow-lg shadow-blue-200">
           <ArrowUpRight size={14} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 pt-2">
        <h3 className="text-[13px] font-bold text-gray-800 line-clamp-2 mb-3 leading-snug min-h-[40px] group-hover:text-blue-600 transition-colors uppercase tracking-tight">
          {room.title}
        </h3>

        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Giá thuê</p>
            <span className="text-rose-600 font-black text-base tracking-tight">{formatPrice(room.price)}</span>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Diện tích</p>
            <span className="text-gray-700 font-bold text-sm">{room.area} m²</span>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-50 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
            <MapPin size={12} className="text-blue-400" />
            <span className="truncate font-medium">{room.district}, {room.city}</span>
          </div>
          
          <div className="flex justify-between items-center mt-1">
            <div className="flex items-center gap-1 text-[9px] text-gray-300 uppercase font-black tracking-tighter">
              <Clock size={10} />
              <span>
  {isFavorited 
    ? "Bạn đã thích" 
    : `Đăng ${formatDate(room.createdAt)}`
  }
</span>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}