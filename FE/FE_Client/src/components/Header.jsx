import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, Heart, Smartphone, Menu, X, 
  User, LogOut, FileText, Search, History, 
  ChevronRight, Settings, Bell, Calendar
} from 'lucide-react';
import LoginModal from './Login';

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); 
    return payload.exp * 1000 < Date.now(); 
  } catch { return true; }
};

export default function Header() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = JSON.parse(localStorage.getItem("user") || "null");

    if (token && !isTokenExpired(token) && savedUser) {
      setUser(savedUser);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [isLoginOpen, navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/rooms?keyword=${encodeURIComponent(searchKeyword.trim())}`);
      setIsMobileMenuOpen(false); // Đóng menu sau khi search trên mobile
    } else {
      navigate('/rooms');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setIsUserMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-[1000] border-b border-gray-100">
      {/* MAIN HEADER ROW */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* LEFT: Menu 3 gạch & Logo */}
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

        {/* CENTER: Search Bar (Desktop) & Event Link */}
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
{/* NAV LINKS */}
  <nav className="hidden lg:flex items-center gap-6 shrink-0">
    {/* Dropdown Tất cả phòng */}
    <div className="relative group py-4">
      <button className="hidden lg:flex items-center gap-1.5 text-[13px] font-medium text-gray-600 hover:text-red-600 transition-colors">
        Tất cả phòng <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
      </button>

      {/* Dropdown Menu - Hiện khi hover */}
      <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-2xl border border-gray-50 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all duration-200 z-[1001]">
        <Link 
          to="/rooms?type=phòng trọ" 
          className="flex items-center justify-between px-4 py-2.5 text-[13px] text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          Phòng trọ <ChevronRight size={12} />
        </Link>
        <Link 
          to="/rooms?type=chung cư" 
          className="flex items-center justify-between px-4 py-2.5 text-[13px] text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          Phòng chung cư <ChevronRight size={12} />
        </Link>
        <div className="h-px bg-gray-50 my-1 mx-2" />
        <Link 
          to="/rooms" 
          className="flex items-center justify-between px-4 py-2.5 text-[13px] font-bold text-gray-800 hover:bg-gray-50 transition-colors"
        >
          Xem tất cả <ChevronRight size={12} />
        </Link>
      </div>
    </div>

    {/* Sự kiện Link */}
    <Link 
      to="/events" 
      className="hidden lg:flex items-center gap-1.5 text-[13px] font-medium text-gray-600 hover:text-red-600 transition-colors"
    >
      <Calendar size={16} /> Sự kiện
    </Link>
  </nav>
          
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          <Link to={""}><div className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600">
            <Heart size={18} />
          </div></Link>

          {user ? (
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-gray-100 rounded-full text-gray-600 relative">
                <Bell size={18} />
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 text-white text-[9px] flex items-center justify-center rounded-full border border-white">2</span>
              </button>
              
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
                    </div>

                    <div className="px-4 py-3 border-b border-gray-50">
                       <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100 flex items-center justify-between">
                          
                  
                       </div>
                    </div>

                    <div className="px-2 space-y-0.5">
                     
                      <Link to={"/favorites"} ><UserMenuItem icon={<Heart size={18}/>} title="Phòng đã yêu thích" /></Link>
                      <UserMenuItem icon={<LogOut size={18} className="text-red-500"/>} title="Đăng xuất" onClick={handleLogout} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setIsLoginOpen(true)} className="text-[13px] font-medium text-gray-700 hover:text-red-600">Đăng nhập | Đăng ký</button>
              
              
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU (SIDEBAR) */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay che màn hình */}
          <div className="fixed inset-0 bg-black/60 z-[2000] md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          {/* Sidebar Panel */}
          <div className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[2001] md:hidden animate-in slide-in-from-left duration-300 shadow-2xl flex flex-col">
            
            {/* Header Sidebar: Có ô Tìm kiếm trên cùng */}
            <div className="p-4 border-b space-y-4 bg-white sticky top-0">
              <div className="flex items-center justify-between">
                <span className="font-black text-red-600 text-lg uppercase tracking-tight">Danh mục</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Ô tìm kiếm tích hợp trong danh mục (Chỉ hiện trên mobile sidebar) */}
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

            {/* List Menu Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <MobileMenuItem icon={<Calendar size={20} />} title="Sự kiện hot" to="/su-kien" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileMenuItem icon={<Search size={20} />} title="Tìm kiếm phòng" to="/rooms" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileMenuItem icon={<Heart size={20} />} title="Yêu thích đã lưu" to="/favorites" onClick={() => setIsMobileMenuOpen(false)} />
              <div className="h-px bg-gray-50 my-2" />
              <MobileMenuItem icon={<Smartphone size={20} />} title="Tải ứng dụng" to="#" onClick={() => setIsMobileMenuOpen(false)} />
              <MobileMenuItem icon={<Settings size={20} />} title="Cài đặt hệ thống" to="#" onClick={() => setIsMobileMenuOpen(false)} />
            </div>

            {/* Footer Sidebar */}
            <div className="p-4 border-t bg-gray-50 text-center">
              <p className="text-[10px] text-gray-400 font-medium">Phiên bản 2.0.26 by PropertyGuru</p>
            </div>
          </div>
        </>
      )}

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      {isUserMenuOpen && <div className="fixed inset-0 z-[1000]" onClick={() => setIsUserMenuOpen(false)} />}
    </header>
  );
}

// Helper Component cho Menu Mobile
function MobileMenuItem({ icon, title, to, onClick }) {
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3.5 hover:bg-red-50 rounded-xl text-gray-700 hover:text-red-600 transition-all group font-medium"
    >
      <span className="text-gray-400 group-hover:text-red-500 transition-colors">{icon}</span>
      <span className="text-[15px]">{title}</span>
      <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:translate-x-1 transition-transform" />
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