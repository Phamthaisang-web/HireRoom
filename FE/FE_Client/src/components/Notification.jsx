import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Notification({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3500); 
    return () => clearTimeout(timer);
  }, [onClose]);

  // Chỉ dùng màu nhấn cho icon và border mờ
  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={18} />,
    error: <AlertCircle className="text-rose-500" size={18} />,
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[3000] animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] px-4 py-3 rounded-2xl flex items-center gap-3 min-w-[280px]">
        
        {/* Icon tối giản */}
        <div className="flex-shrink-0">{icons[type]}</div>
        
        {/* Nội dung thu gọn font size */}
        <div className="flex-1 pr-4">
          <p className="text-[12px] font-semibold text-gray-800 leading-none">
            {message}
          </p>
        </div>
        
        {/* Nút đóng mảnh mai */}
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}