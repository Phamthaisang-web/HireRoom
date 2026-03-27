import React, { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

export default function Notification({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 4000); // Tự động đóng sau 4s
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-100",
    error: "bg-rose-50 border-rose-200 text-rose-800 shadow-rose-100",
  };

  const icons = {
    success: <CheckCircle className="text-emerald-500" size={20} />,
    error: <XCircle className="text-rose-500" size={20} />,
  };

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[3000] w-[90%] max-w-sm animate-in slide-in-from-top-10 duration-500">
      <div className={`flex items-center p-4 border rounded-2xl shadow-xl backdrop-blur-md ${styles[type]}`}>
        <div className="flex-shrink-0">{icons[type]}</div>
        <div className="ml-3 mr-8">
          <p className="text-[13px] font-black leading-tight uppercase tracking-tight">
            {type === "success" ? "Thành công" : "Thất bại"}
          </p>
          <p className="text-[12px] font-medium opacity-90 mt-0.5">{message}</p>
        </div>
        <button 
          onClick={onClose}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-full transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}