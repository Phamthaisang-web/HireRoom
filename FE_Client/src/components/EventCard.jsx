import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function EventCard({ event }) {
  // Hàm format ngày tháng
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Hàm format giờ
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800"} 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
            event.status === 'đang diễn ra' ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'
          }`}>
            {event.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-3 line-clamp-2 uppercase tracking-tight">
          {event.title}
        </h3>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-5 leading-relaxed">
          {event.description}
        </p>

        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-gray-400">
            <Calendar size={14} className="text-blue-500" />
            <span className="text-[12px] font-medium">{formatDate(event.startDate)}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <Clock size={14} className="text-blue-500" />
            <span className="text-[12px] font-medium">{formatTime(event.startDate)} - {formatTime(event.endDate)}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <MapPin size={14} className="text-blue-500" />
            <span className="text-[12px] font-medium line-clamp-1">{event.location}</span>
          </div>
        </div>

        <button className="w-full mt-6 py-3 rounded-2xl bg-gray-50 text-gray-900 text-[11px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
}