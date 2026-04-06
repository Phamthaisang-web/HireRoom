import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, X, Phone, BadgeCheck } from "lucide-react";
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
    role: "user",
  });

  const [notification, setNotification] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;
  
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
      ? `${BASE_URL}/auth/login`
      : `${BASE_URL}/auth/register`;

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
          const { token, user } = result.loginData;
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          showNotify("Đăng nhập thành công!", "success");

          setTimeout(() => {
            onClose();
            if (user.role === "admin") navigate("/"); 
            window.location.reload();
          }, 1000);
        } else {
          throw new Error("Không tìm thấy dữ liệu đăng nhập");
        }
      } else {
        showNotify("Đăng ký thành công!", "success");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
      showNotify(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4 py-6">
        {/* Backdrop với blur nhẹ */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />

        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl md:h-[480px] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row transition-all duration-500 overflow-hidden scale-95 md:scale-100"
        >
          {/* NÚT ĐÓNG (Cải thiện để dễ bấm trên mobile) */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 z-50 p-2 bg-gray-100 md:bg-transparent rounded-full"
          >
            <X size={20} />
          </button>

          {/* OVERLAY (GIỮ NGUYÊN CHO PC) */}
          <div
            className={`absolute top-0 h-full w-1/2 z-30 rounded-2xl transition-all duration-700 hidden md:flex items-center justify-center text-center p-6
              ${isLogin
                ? "left-1/2 bg-gradient-to-r from-white to-red-400 rounded-l-[40px]"
                : "left-0 bg-gradient-to-r from-red-400 to-red-white rounded-r-[40px]"
              }`}
          >
            <div className="text-blue-950">
              <h2 className="text-lg font-black mb-2 uppercase">
                {isLogin ? "Xin chào!" : "Chào mừng!"}
              </h2>
              <p className="text-[10px] text-gray-600 mb-4">
                {isLogin ? "Bạn chưa có tài khoản?" : "Đã có tài khoản rồi?"}
              </p>
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(""); }}
                className="px-8 py-2 border border-blue-950 rounded-full text-[10px] font-bold hover:bg-red-500 hover:text-white hover:border-red-500 transition-all"
              >
                {isLogin ? "ĐĂNG KÝ" : "ĐĂNG NHẬP"}
              </button>
            </div>
          </div>

          {/* LOGIN FORM */}
          <div
            className={`w-full md:w-1/2 flex flex-col justify-center px-6 py-10 md:px-10 transition-all duration-500
            ${isLogin ? "flex opacity-100" : "hidden md:flex md:opacity-0 md:pointer-events-none"}`}
          >
            <h2 className="text-xl font-black text-blue-950 mb-4">ĐĂNG NHẬP</h2>

            {error && <p className="text-red-500 text-[10px] mb-3">✕ {error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <CompactInput icon={<Phone size={14} />} name="phone" type="tel" label="Số điện thoại" value={formData.phone} onChange={handleChange} />
              <CompactInput icon={<Lock size={14} />} name="password" type="password" label="Mật khẩu" value={formData.password} onChange={handleChange} />
              <button disabled={loading} className="w-full py-3 rounded-lg bg-red-400 text-white text-[11px] font-bold shadow-md active:scale-95 transition-transform">
                {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
              </button>
            </form>

            {/* Chuyển đổi trạng thái trên MOBILE */}
            <p className="mt-6 text-center text-[11px] text-gray-500 md:hidden">
              Bạn chưa có tài khoản?{" "}
              <button onClick={() => setIsLogin(false)} className="text-red-500 font-bold underline">Đăng ký</button>
            </p>
          </div>

          {/* REGISTER FORM */}
          <div
            className={`w-full md:w-1/2 flex flex-col justify-center px-6 py-10 md:px-10 transition-all duration-500
            ${!isLogin ? "flex opacity-100" : "hidden md:flex md:opacity-0 md:pointer-events-none"}`}
          >
            <h2 className="text-xl font-black text-blue-950 mb-4">ĐĂNG KÝ</h2>

            {error && <p className="text-red-500 text-[10px] mb-3">✕ {error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <CompactInput icon={<BadgeCheck size={14} />} name="fullName" label="Họ và tên" value={formData.fullName} onChange={handleChange} />
              <CompactInput icon={<Phone size={14} />} name="phone" type="tel" label="Số điện thoại" value={formData.phone} onChange={handleChange} />
              <CompactInput icon={<Lock size={14} />} name="password" type="password" label="Mật khẩu" value={formData.password} onChange={handleChange} />
              <button disabled={loading} className="w-full py-3 rounded-lg bg-red-400 text-white text-[11px] font-bold shadow-md active:scale-95 transition-transform">
                {loading ? "ĐANG XỬ LÝ..." : "TẠO TÀI KHOẢN"}
              </button>
            </form>

            {/* Chuyển đổi trạng thái trên MOBILE */}
            <p className="mt-6 text-center text-[11px] text-gray-500 md:hidden">
              Đã có tài khoản?{" "}
              <button onClick={() => setIsLogin(true)} className="text-red-500 font-bold underline">Đăng nhập</button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const CompactInput = ({ icon, label, ...props }) => (
  <div className="w-full">
    <label className="block text-[10px] font-semibold text-gray-500 mb-1 ml-1">
      {label}
    </label>
    <div className="relative group">
      <input
        className="w-full px-3 py-3 text-[12px] rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-50 outline-none transition-all"
        required
        {...props}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
        {icon}
      </div>
    </div>
  </div>
);