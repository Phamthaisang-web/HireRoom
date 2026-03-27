import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, X, Phone, BadgeCheck } from "lucide-react";
import Notification from "./Notification";

export default function AuthModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    role: "user"
  });
  
  const [notification, setNotification] = useState(null);

  const showNotify = (message, type = "success") => {
    setNotification({ message, type });
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isLogin 
      ? "http://localhost:8080/auth/login" 
      : "http://localhost:8080/auth/register";

    const bodyData = isLogin 
      ? { phone: formData.phone, password: formData.password }
      : formData;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });
      
      const result = await res.json();
      
      if (!res.ok || result.error) {
        throw new Error(result.error || result.message || "Thao tác thất bại");
      }

      if (isLogin) {
        if (result.loginData && result.loginData.token) {
          const { token, dataUser } = result.loginData;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(dataUser));
          
          // Hiện thông báo trước khi đóng modal
          showNotify("Đăng nhập thành công! Đang chuyển hướng...", "success");
          
          // Delay một chút để user kịp nhìn thấy thông báo đẹp
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1200);
        } else {
          throw new Error("Không tìm thấy dữ liệu đăng nhập");
        }
      } else {
        showNotify("Đăng ký thành công! Hãy đăng nhập ngay.", "success");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
      showNotify(err.message, "error"); // Hiện thông báo lỗi lên top luôn
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Đưa Notification ra ngoài cùng để có z-index cao nhất */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}

      <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4 py-6 animate-in fade-in duration-300">
        <div 
          className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
          onClick={onClose} 
        />

        <div 
          onClick={(e) => e.stopPropagation()} 
          className="relative w-full max-w-4xl md:h-[550px] bg-white rounded-[24px] overflow-hidden shadow-2xl border border-gray-100 flex flex-col md:flex-row transition-all duration-500 animate-in zoom-in-95"
        >
          {/* NÚT ĐÓNG */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 z-50 p-2 bg-white/80 rounded-full md:bg-transparent transition-colors"
          >
            <X size={20} />
          </button>

          {/* LỚP PHỦ XANH */}
          <div 
            className={`absolute top-0 h-full w-1/2 z-30 transition-all duration-700 ease-in-out hidden md:flex items-center justify-center text-center p-8
              ${isLogin 
                ? "left-1/2 bg-gradient-to-br from-blue-100 via-blue-50 to-white rounded-l-[50px] border-l border-gray-100" 
                : "left-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-r-[50px] border-r border-gray-100"
              }`}
          >
            <div className="relative z-10 text-blue-950">
              <h2 className="text-2xl font-black mb-2 tracking-tighter italic uppercase">
                {isLogin ? "Xin chào!" : "Chào mừng!"}
              </h2>
              <p className="text-[10px] font-medium text-gray-600 uppercase mb-6">
                {isLogin ? "Bạn chưa có tài khoản?" : "Đã có tài khoản rồi?"}
              </p>
              <button 
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                className="px-8 py-2 border border-blue-200 rounded-full text-[10px] font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all bg-white shadow-sm"
              >
                {isLogin ? "ĐĂNG KÝ NGAY" : "ĐĂNG NHẬP"}
              </button>
            </div>
          </div>

          {/* FORM ĐĂNG NHẬP */}
          <div className={`w-full md:w-1/2 h-full flex flex-col justify-center px-6 py-10 md:px-12 transition-all duration-700 
            ${isLogin ? "flex opacity-100 z-20" : "hidden md:flex md:opacity-0 md:z-10 md:translate-x-4 md:pointer-events-none"}`}>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-blue-950">ĐĂNG NHẬP</h2>
              <div className="h-1 w-12 bg-blue-500 mt-1 rounded-full"></div>
            </div>
            {error && <p className="text-red-500 text-[11px] font-bold mb-4 italic px-2 py-1 bg-red-50 rounded border border-red-100">✕ {error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <CompactInput icon={<Phone size={16}/>} name="phone" type="tel" label="Số điện thoại" value={formData.phone} onChange={handleChange} />
              <CompactInput icon={<Lock size={16}/>} name="password" type="password" label="Mật khẩu" value={formData.password} onChange={handleChange} />
              <button 
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-[11px] font-black shadow-lg shadow-blue-500/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
              >
                {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
              </button>
            </form>
            <p className="md:hidden mt-8 text-center text-[12px] font-medium text-gray-500">
              Chưa có tài khoản? <button onClick={() => setIsLogin(false)} className="text-blue-600 font-bold hover:underline">Đăng ký ngay</button>
            </p>
          </div>

          {/* FORM ĐĂNG KÝ */}
          <div className={`w-full md:w-1/2 h-full flex flex-col justify-center px-6 py-10 md:px-12 transition-all duration-700
            ${!isLogin ? "flex opacity-100 z-20" : "hidden md:flex md:opacity-0 md:z-10 md:-translate-x-4 md:pointer-events-none"}`}>
            <div className="mb-6">
              <h2 className="text-2xl font-black text-blue-950">ĐĂNG KÝ</h2>
              <div className="h-1 w-12 bg-blue-600 mt-1 rounded-full"></div>
            </div>
            {error && <p className="text-red-500 text-[11px] font-bold mb-4 italic px-2 py-1 bg-red-50 rounded border border-red-100">✕ {error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <CompactInput icon={<BadgeCheck size={16}/>} name="fullName" label="Họ và tên" value={formData.fullName} onChange={handleChange} />
              <CompactInput icon={<Phone size={16}/>} name="phone" type="tel" label="Số điện thoại" value={formData.phone} onChange={handleChange} />
              <CompactInput icon={<Lock size={16}/>} name="password" type="password" label="Mật khẩu" value={formData.password} onChange={handleChange} />
              <button 
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 text-white text-[11px] font-black shadow-lg shadow-blue-500/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
              >
                {loading ? "ĐANG XỬ LÝ..." : "TẠO TÀI KHOẢN"}
              </button>
            </form>
            <p className="md:hidden mt-8 text-center text-[12px] font-medium text-gray-500">
              Đã có tài khoản? <button onClick={() => setIsLogin(true)} className="text-blue-600 font-bold hover:underline">Đăng nhập</button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const CompactInput = ({ icon, label, ...props }) => (
  <div className="relative w-full group">
    <label className="block text-[10px] text-gray-500 font-bold uppercase mb-1.5 ml-1 tracking-widest">
      {label}
    </label>
    <div className="relative">
      <input 
        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 py-3 text-[13px] text-blue-950 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all pr-10 placeholder:text-gray-300"
        required 
        {...props} 
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
    </div>
  </div>
);