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
    role: "user",
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

          showNotify("Đăng nhập thành công!", "success");

          setTimeout(() => {
            onClose();
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

      <div className="fixed inset-0 z-[2000] flex items-center justify-center px-4 py-6 scale-90 md:scale-95">
        <div
          className="absolute inset-0  "
          onClick={onClose}
        />

        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-3xl md:h-[480px] bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row transition-all duration-500"
        >
          {/* CLOSE */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 z-50 p-1.5 bg-white/80 rounded-full"
          >
            <X size={18} />
          </button>

          {/* OVERLAY */}
          <div
            className={`absolute top-0 h-full w-1/2 z-30  rounded-2xl transition-all duration-700 hidden md:flex items-center justify-center text-center p-6
              ${
                isLogin
                  ? "left-1/2 bg-gradient-to-r from-white to-red-400 rounded-l-[40px]"
                  : "left-0 bg-gradient-to-r from-red-400 to-red-white rounded-r-[40px]"
              }`}
          >
            <div className="text-blue-950">
              <h2 className="text-lg font-black mb-2">
                {isLogin ? "Xin chào!" : "Chào mừng!"}
              </h2>
              <p className="text-[9px] text-gray-600 mb-4">
                {isLogin
                  ? "Bạn chưa có tài khoản?"
                  : "Đã có tài khoản rồi?"}
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="px-6 py-1.5 border rounded-full text-[10px] font-bold text-white hover:bg-red-600 hover:text-white transition"
              >
                {isLogin ? "ĐĂNG KÝ" : "ĐĂNG NHẬP"}
              </button>
            </div>
          </div>

          {/* LOGIN */}
          <div
            className={`w-full md:w-1/2 flex flex-col justify-center px-5 py-8 md:px-10 transition-all
            ${
              isLogin
                ? "flex opacity-100"
                : "hidden md:flex md:opacity-0 md:pointer-events-none"
            }`}
          >
            <h2 className="text-xl font-black text-blue-950 mb-4">
              ĐĂNG NHẬP
            </h2>

            {error && (
              <p className="text-red-500 text-[10px] mb-3">
                ✕ {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <CompactInput
                icon={<Phone size={14} />}
                name="phone"
                type="tel"
                label="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
              />

              <CompactInput
                icon={<Lock size={14} />}
                name="password"
                type="password"
                label="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-red-400 text-white text-[10px] font-bold"
              >
                {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
              </button>
            </form>
          </div>

          {/* REGISTER */}
          <div
            className={`w-full md:w-1/2 flex flex-col justify-center px-5 py-8 md:px-10 transition-all
            ${
              !isLogin
                ? "flex opacity-100"
                : "hidden md:flex md:opacity-0 md:pointer-events-none"
            }`}
          >
            <h2 className="text-xl font-black text-blue-950 mb-4">
              ĐĂNG KÝ
            </h2>

            {error && (
              <p className="text-red-500 text-[10px] mb-3">
                ✕ {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <CompactInput
                icon={<BadgeCheck size={14} />}
                name="fullName"
                label="Họ và tên"
                value={formData.fullName}
                onChange={handleChange}
              />

              <CompactInput
                icon={<Phone size={14} />}
                name="phone"
                type="tel"
                label="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
              />

              <CompactInput
                icon={<Lock size={14} />}
                name="password"
                type="password"
                label="Mật khẩu"
                value={formData.password}
                onChange={handleChange}
              />

              <button
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-red-400 text-white text-[10px] font-bold"
              >
                {loading ? "ĐANG XỬ LÝ..." : "TẠO TÀI KHOẢN"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const CompactInput = ({ icon, label, ...props }) => (
  <div className="w-full">
    <label className="block text-[9px] text-gray-500 mb-1">
      {label}
    </label>
    <div className="relative">
      <input
        className="w-full px-3 py-2.5 text-[12px] rounded-lg border border-gray-200 focus:border-blue-400 outline-none"
        required
        {...props}
      />
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
    </div>
  </div>
);