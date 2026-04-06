import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MapPin, Maximize, CircleDollarSign, Calendar, 
  Droplets, Wifi, Zap
} from 'lucide-react';
import RoomCard from '../components/RoomCard'; // Đảm bảo import đúng component này

export default function RoomDetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [relatedRooms, setRelatedRooms] = useState([]); // Thêm state phòng liên quan
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL;
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/rooms/${id}`);
        const data = await res.json();
        
        if (data.roomData) {
          setRoom(data.roomData);
          // Gọi hàm fetch phòng liên quan sau khi có dữ liệu phòng hiện tại
          fetchRelated(data.roomData);
        }
      } catch (err) {
        console.error("Error fetching room detail:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchRelated = async (currentRoom) => {
      try {
        // Tìm các phòng cùng Quận và Thành phố, giới hạn 4 phòng
        const query = new URLSearchParams({
          limit: 4,
          city: currentRoom.city,
          district: currentRoom.district,
        }).toString();

        const res = await fetch(`${API_URL}/rooms?${query}`);
        const data = await res.json();
        
        // Lọc bỏ chính phòng đang xem khỏi danh sách gợi ý
        const filtered = (data.rooms || [])
          .filter(r => (r._id || r.id) !== (currentRoom._id || currentRoom.id))
          .slice(0, 4);
          
        setRelatedRooms(filtered);
      } catch (err) {
        console.error("Error fetching related rooms:", err);
      }
    };

    fetchRoomDetail();
    window.scrollTo(0, 0);
  }, [id, API_URL]);

  const getFullImgUrl = (imgInput) => {
    if (!imgInput) return "";
    const url = typeof imgInput === 'object' ? imgInput.url : imgInput;
    if (!url || typeof url !== 'string') return "";
    return url.startsWith('http') ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-xs text-gray-400 uppercase tracking-widest bg-white">
      Đang tải dữ liệu...
    </div>
  );

  if (!room) return (
    <div className="h-screen flex items-center justify-center text-xs text-red-400 uppercase bg-white">
      Không tìm thấy thông tin phòng
    </div>
  );

  const roomImages = room.images || [];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans text-gray-800">
      <main className="max-w-5xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* CỘT TRÁI (8/12) - Gallery & Nội dung chính */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
              <div className="relative h-[350px] rounded-xl overflow-hidden bg-gray-50">
                {roomImages.length > 0 ? (
                  <img 
                    src={getFullImgUrl(roomImages[activeImg])} 
                    className="w-full h-full object-contain transition-opacity duration-300" 
                    alt="room-main" 
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-gray-400">Không có hình ảnh</div>
                )}
              </div>
              
              <div className="flex gap-2 mt-2 overflow-x-auto py-1 scrollbar-hide">
                {roomImages.map((img, i) => (
                  <img 
                    key={i}
                    onClick={() => setActiveImg(i)}
                    src={getFullImgUrl(img)} 
                    className={`w-16 h-12 flex-shrink-0 object-cover rounded-md cursor-pointer transition-all border-2 ${
                      activeImg === i ? 'border-blue-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`} 
                    alt={`thumb-${i}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">{room.type}</span>
                <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded uppercase">{room.status}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2 uppercase">{room.title}</h1>
              <div className="flex items-center gap-1 text-gray-400 text-xs mb-6">
                <MapPin size={14} className="text-blue-500" />
                <span>{room.ward}/{room.district}/{room.city}</span>
              
              </div>

              <div className="border-t border-gray-50 pt-5">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Mô tả chi tiết</h3>
                <p className="text-[14px] leading-relaxed text-gray-600 whitespace-pre-line">
                  {room.description || "Chưa có mô tả cụ thể cho phòng trọ này."}
                </p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (4/12) - Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-20">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-5">Thông số chi tiết</h3>
              
              <div className="space-y-4">
                <DetailRow 
                  icon={<CircleDollarSign size={16} className="text-rose-500" />} 
                  label="Giá thuê" 
                  value={room.price ? `${(room.price/1000000).toFixed(1)} tr/th` : "Liên hệ"} 
                  color="text-rose-600 text-lg" 
                />
                <DetailRow 
                  icon={<Maximize size={16} className="text-blue-500" />} 
                  label="Diện tích" 
                  value={`${room.area || 0} m²`} 
                />
                <DetailRow 
                  icon={<Zap size={16} className="text-yellow-500" />} 
                  label="Tiền điện" 
                  value={room.electricPrice ? `${Number(room.electricPrice).toLocaleString()} đ/số` : "Theo giá dân"} 
                />
                <DetailRow 
                  icon={<Droplets size={16} className="text-cyan-500" />} 
                  label="Tiền nước" 
                  value={room.waterPrice ? `${Number(room.waterPrice).toLocaleString()} đ/khối` : "Miễn phí"} 
                />
                <DetailRow 
                  icon={<Wifi size={16} className="text-indigo-500" />} 
                  label="Internet" 
                  value={room.internetPrice ? `${Number(room.internetPrice).toLocaleString()} đ/phòng` : "Miễn phí"} 
                />
                <DetailRow 
                  icon={<Calendar size={16} className="text-orange-500" />} 
                  label="Ngày cập nhật" 
                  value={room.createdAt ? new Date(room.createdAt).toLocaleDateString('vi-VN') : "Vừa xong"} 
                />
              </div>

              <div className="mt-6 pt-5 border-t border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3">Tiện ích đi kèm</p>
                <div className="flex flex-wrap gap-2">
                  {room.furniture ? room.furniture.split(',').map((item, i) => (
                    <span key={i} className="text-[11px] bg-gray-50 border border-gray-100 px-3 py-1 rounded-lg text-gray-600 font-medium">
                      {item.trim()}
                    </span>
                  )) : <span className="text-[11px] text-gray-400 italic">Liên hệ để biết thêm</span>}
                </div>
              </div>

             
              <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
  <p className="text-[10px] font-bold text-blue-500 uppercase mb-2">Thông tin liên hệ</p>
  <p className="text-sm font-bold text-gray-800">Nguyễn Việt Anh</p>
  
  {/* Thẻ a với href zalo.me */}
  <a 
    href="https://zalo.me/0395888573" 
    target="_blank" 
    rel="noopener noreferrer"
    className="inline-block text-xs text-blue-600 font-semibold mt-1 hover:underline cursor-pointer"
  >
    SĐT: 0395888573 (Nhấn để Chat Zalo)
  </a>

  {/* Hoặc làm thành một cái Button hẳn hoi cho đẹp */}
  <button 
    onClick={() => window.open('https://zalo.me/0395888573', '_blank')}
    className="w-full mt-3 bg-blue-600 text-white text-[10px] font-black uppercase py-2 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
  >
    Chat qua Zalo
  </button>
</div>

              
            </div>
          </div>
        </div>

        {/* --- PHẦN PHÒNG LIÊN QUAN --- */}
        {relatedRooms.length > 0 && (
          <section className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[3px] mb-2">Gợi ý khu vực</h3>
              <h2 className="text-xl font-bold text-gray-900 uppercase">Phòng trọ tương tự tại {room.district}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedRooms.map((relRoom) => (
                <RoomCard key={relRoom._id || relRoom.id} room={relRoom} />
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
}

function DetailRow({ icon, label, value, color = "text-gray-700" }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-3 text-gray-400">
        <div className="p-1.5 bg-gray-50 rounded-lg">{icon}</div>
        <span className="font-medium text-gray-500">{label}</span>
      </div>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}