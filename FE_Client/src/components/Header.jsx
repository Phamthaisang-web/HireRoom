import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, Heart, Smartphone, Menu, X, 
  User, LogOut, FileText, Search, History, 
  ChevronRight, Settings, Bell, Calendar, LayoutDashboard
} from 'lucide-react';
import LoginModal from './Login';
import Notification from './Notification'; // Đảm bảo bạn đã có file này

// Hàm giải mã token an toàn (hỗ trợ tiếng Việt)
const getDecodedToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = getDecodedToken(token);
  if (!payload) return true;
  return payload.exp * 1000 < Date.now();
};

export default function Header() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); 
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State quản lý thông báo
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (token && !isTokenExpired(token) && savedUser) {
      setUser(savedUser);
      const payload = getDecodedToken(token);
      setRole(payload?.role); 
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setRole(null);
    }
  }, [isLoginOpen, navigate]);

  // HÀM KIỂM TRA ĐĂNG NHẬP TRƯỚC KHI VÀO TRANG YÊU THÍCH
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (!user) {
      // Thay alert bằng Notification
      setNotification({
        show: true,
        message: "Vui lòng đăng nhập để xem danh sách yêu thích!",
        type: "error"
      });
      setIsLoginOpen(true);
      setIsMobileMenuOpen(false);
      setIsUserMenuOpen(false);
    } else {
      navigate("/favorites");
      setIsMobileMenuOpen(false);
      setIsUserMenuOpen(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/rooms?keyword=${encodeURIComponent(searchKeyword.trim())}`);
      setIsMobileMenuOpen(false);
    } else {
      navigate('/rooms');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    setIsUserMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-[1000] border-b border-gray-100">
      
      {/* HIỂN THỊ THÔNG BÁO TỐI GIẢN */}
      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification({ ...notification, show: false })} 
        />
      )}

      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-1 md:hidden text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>

          <Link to="/" className="text-red-600 font-bold text-2xl tracking-tighter flex flex-col leading-none">
            <span>Thuê phòng</span>
            <span className="text-[12px] text-gray-400 font-normal italic">Trọ chung cư </span>
          </Link>
        </div>

        <div className="flex-1 flex items-center gap-4 max-w-xl">
          <form 
            onSubmit={handleSearch}
            className="flex-1 relative group hidden md:block"
          >
            <input
              type="text"
              placeholder="Tìm nhanh: phòng trọ..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-[13px] outline-none focus:bg-white focus:border-red-400 transition-all"
            />
            <Search 
              size={16} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500" 
            />
          </form>

          <nav className="hidden lg:flex items-center gap-6 shrink-0">
            <Link to="/rooms?type=Phòng trọ" className="text-[13px] font-semibold text-gray-600 hover:text-red-600 transition-colors">
              Phòng trọ
            </Link>
            <Link to="/rooms?type=Chung cư" className="text-[13px] font-semibold text-gray-600 hover:text-red-600 transition-colors">
              Chung cư
            </Link>
            <Link to="/rooms?type=Nhà nguyên căn" className="text-[13px] font-semibold text-gray-600 hover:text-red-600 transition-colors">
              Nhà nguyên căn
            </Link>
            <Link to="/events" className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-600 hover:text-red-600 transition-colors">
              <Calendar size={16} /> Sự kiện
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* Icon trái tim chính */}
          <div onClick={handleFavoriteClick} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 cursor-pointer">
            <Heart size={18} />
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="flex items-center gap-1 cursor-pointer" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center bg-gray-50 text-gray-500 shadow-sm">
                    <User size={18} strokeWidth={2.5} />
                  </div>
                  <ChevronDown size={14} className={`text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </div>

                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-4 z-[1001] animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-5 pb-4 flex flex-col items-center border-b border-gray-50">
                      <div className="relative mb-2">
                        <div className="w-14 h-14 rounded-full border border-gray-100 bg-blue-50 flex items-center justify-center text-blue-600">
                          <User size={30} />
                        </div>
                        <button className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow-sm border border-gray-100"><Settings size={10} /></button>
                      </div>
                      <span className="font-bold text-gray-800 text-base">{user.fullName}</span>
                      <span className="text-[11px] text-gray-400 italic">{user.phone}</span>
                      {role === 'admin' && (
                        <span className="mt-1 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded-full uppercase">Quản trị viên</span>
                      )}
                    </div>

                    <div className="px-2 pt-2 space-y-0.5">
                      <UserMenuItem icon={<Heart size={18}/>} title="Phòng đã yêu thích" onClick={handleFavoriteClick} />

                      {role === 'admin' && (
                        <Link to={"/admin"} onClick={() => setIsUserMenuOpen(false)}>
                          <UserMenuItem 
                            icon={<LayoutDashboard size={18} className="text-blue-500"/>} 
                            title="Quản trị hệ thống" 
                          />
                        </Link>
                      )}

                      <Link to={"/profile"} onClick={() => setIsUserMenuOpen(false)}>
                        <UserMenuItem icon={<Settings size={18}/>} title="Cài đặt tài khoản" />
                      </Link>
                      
                      <div className="h-px bg-gray-50 my-1 mx-2" />

                      <UserMenuItem 
                        icon={<LogOut size={18} className="text-red-500"/>} 
                        title="Đăng xuất" 
                        onClick={handleLogout} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setIsLoginOpen(true)} className="text-[13px] font-medium text-gray-700 hover:text-red-600">Đăng nhập</button>
            </div>
          )}
        </div>
      </div>

      {isMobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[2000] md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[2001] md:hidden animate-in slide-in-from-left duration-300 shadow-2xl flex flex-col">
            <div className="p-4 border-b space-y-4 bg-white sticky top-0">
              <div className="flex items-center justify-between">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-red-600 font-bold text-lg uppercase tracking-tight flex flex-col leading-none">
                  <span>Thuê phòng</span>
                  <span className="text-[10px] text-gray-400 font-normal italic">Trọ chung cư </span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSearch} className="relative group">
                <input
                  type="text"
                  placeholder="Tìm quận, phòng trọ..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm outline-none focus:bg-white focus:border-red-400 transition-all"
                />
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-500" />
              </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <p className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Danh mục chính</p>
              
              <MobileMenuItem icon={<FileText size={20} />} title="Phòng trọ" to="/rooms?type=Phòng trọ" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileMenuItem icon={<Smartphone size={20} />} title="Chung cư / Căn hộ" to="/rooms?type=Chung cư" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileMenuItem icon={<Smartphone size={20} />} title="Nhà nguyên căn" to="/rooms?type=Nhà nguyên căn" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileMenuItem icon={<Calendar size={20} />} title="Sự kiện hot" to="/events" onClick={() => setIsMobileMenuOpen(false)} />
              
              {/* Mục yêu thích Mobile Sidebar */}
              <div onClick={handleFavoriteClick} className="flex items-center gap-4 px-4 py-3.5 hover:bg-red-50 rounded-xl text-gray-700 hover:text-red-600 transition-all group font-medium cursor-pointer">
                <span className="text-gray-400 group-hover:text-red-500 transition-colors"><Heart size={20} /></span>
                <span className="text-[14px]">Danh sách yêu thích</span>
                <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:translate-x-1 transition-transform" />
              </div>

              <div className="h-px bg-gray-50 my-4 mx-2" />
            </div>
          </div>
        </>
      )}

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      {isUserMenuOpen && <div className="fixed inset-0 z-[1000]" onClick={() => setIsUserMenuOpen(false)} />}
    </header>
  );
}

// Helper Components
function MobileMenuItem({ icon, title, to, onClick }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3.5 hover:bg-red-50 rounded-xl text-gray-700 hover:text-red-600 transition-all group font-medium"
    >
      <span className="text-gray-400 group-hover:text-red-500 transition-colors">{icon}</span>
      <span className="text-[14px]">{title}</span>
      <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}

function UserMenuItem({ icon, title, onClick }) {
  return (
    <div onClick={onClick} className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-xl cursor-pointer group transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-gray-400 group-hover:text-red-500 transition-colors">{icon}</span>
        <span className="text-[13px] font-medium text-gray-700">{title}</span>
      </div>
      <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-0.5 transition-transform" />
    </div>
  );
}