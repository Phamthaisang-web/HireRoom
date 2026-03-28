import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MapPin, Maximize, CircleDollarSign, Calendar, 
  Info, CheckCircle2, ChevronLeft, ChevronRight, Droplets, Wifi, Zap
} from 'lucide-react';
import Header from '../components/Header';

export default function RoomDetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const res = await fetch(`${BASE_URL}/rooms?page=1&limit=100`); 
        const data = await res.json();
        const foundRoom = data.rooms.find(r => r.id === parseInt(id));
        setRoom(foundRoom);

        const imgRes = await fetch(`${BASE_URL}/image-rooms?roomId=${id}`);
        const imgData = await imgRes.json();
        setImages(imgData.imageRooms || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center text-xs text-gray-400 uppercase tracking-widest">Đang tải...</div>;
  if (!room) return <div className="h-screen flex items-center justify-center text-xs text-red-400 uppercase">Không tìm thấy phòng</div>;

  const getFullImgUrl = (url) => url.startsWith('http') ? url : `${BASE_URL}${url}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-10 font-sans text-gray-800">
    

      <main className="max-w-5xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* CỘT TRÁI (8/12) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Gallery Mini */}
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
              <div className="relative h-[350px] rounded-xl overflow-hidden bg-gray-50">
                {images.length > 0 ? (
                  <img src={getFullImgUrl(images[activeImg].imageUrl)} className="w-full h-full object-contain" alt="room" />
                ) : <div className="h-full flex items-center justify-center text-xs text-gray-400">No Image</div>}
              </div>
              
              {/* Thumbnails nhỏ gọn */}
              <div className="flex gap-2 mt-2 overflow-x-auto py-1 scrollbar-hide">
                {images.map((img, i) => (
                  <img 
                    key={i}
                    onClick={() => setActiveImg(i)}
                    src={getFullImgUrl(img.imageUrl)} 
                    className={`w-16 h-12 object-cover rounded-md cursor-pointer transition-all border-2 ${activeImg === i ? 'border-blue-500' : 'border-transparent opacity-50'}`} 
                    alt="thumb"
                  />
                ))}
              </div>
            </div>

            {/* Nội dung nhỏ gọn */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded uppercase">{room.type}</span>
                <span className="text-[10px] font-bold bg-green-50 text-green-600 px-2 py-0.5 rounded uppercase">{room.status}</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight mb-2 uppercase">{room.title}</h1>
              <div className="flex items-center gap-1 text-gray-400 text-xs mb-5">
                <MapPin size={12} />
                <span>{room.address}, {room.district}</span>
              </div>

              <div className="border-t border-gray-50 pt-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Mô tả</h3>
                <p className="text-[13px] leading-relaxed text-gray-600 whitespace-pre-line">{room.description}</p>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI (4/12) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-20">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-[2px] mb-4">Thông số chi tiết</h3>
              
              <div className="space-y-3">
  <DetailRow 
    icon={<CircleDollarSign size={14} className="text-red-500" />} 
    label="Giá thuê" 
    value={`${(room.price/1000000).toFixed(1)} tr/th`} 
    color="text-red-600" 
  />
  <DetailRow 
    icon={<Maximize size={14} className="text-blue-500" />} 
    label="Diện tích" 
    value={`${room.area} m²`} 
  />
  <DetailRow 
    icon={<Zap size={14} className="text-yellow-500" />} 
    label="Điện" 
    value={`${Number(room.electricPrice).toLocaleString()} đ`} 
  />
  <DetailRow 
    icon={<Droplets size={14} className="text-cyan-500" />} 
    label="Nước" 
    value={`${Number(room.waterPrice).toLocaleString()} đ`} 
  />
  <DetailRow 
    icon={<Wifi size={14} className="text-indigo-500" />} 
    label="Internet" 
    value={`${Number(room.internetPrice).toLocaleString()} đ`} 
  />
  <DetailRow 
    icon={<Calendar size={14} className="text-orange-500" />} 
    label="Ngày đăng" 
    value={new Date(room.createdAt).toLocaleDateString('vi-VN')} 
  />
</div>

              <div className="mt-5 pt-4 border-t border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Tiện nghi</p>
                <div className="flex flex-wrap gap-1.5">
                  {room.furniture?.split(',').map((item, i) => (
                    <span key={i} className="text-[11px] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-gray-500">
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full mt-6 bg-gray-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-all uppercase tracking-widest shadow-lg shadow-gray-200">
                Liên hệ ngay
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Component phụ cho dòng chi tiết
function DetailRow({ icon, label, value, color = "text-gray-700" }) {
  return (
    <div className="flex items-center justify-between text-[13px]">
      <div className="flex items-center gap-2 text-gray-400">
        {icon}
        <span>{label}</span>
      </div>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}