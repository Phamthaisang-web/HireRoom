import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
   <footer className="bg-black text-white pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="md:col-span-2 space-y-6">
             <h2 className="text-2xl font-black uppercase tracking-tighter">Batdongsan.Clone</h2>
             <p className="text-gray-500 text-sm max-w-sm leading-loose">
               Nền tảng tìm kiếm và quản lý thuê trọ hàng đầu Việt Nam. Chúng tôi tin rằng mỗi người đều xứng đáng có một không gian sống tốt đẹp hơn.
             </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Liên kết</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li><Link to="/rooms" className="hover:text-white transition-colors">Tìm phòng</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Sự kiện</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Hỗ trợ</h4>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>Trung tâm trợ giúp</li>
              <li>Quy tắc an toàn</li>
              <li>Chính sách bảo mật</li>
            </ul>
          </div>
        </div>
       
      </footer>
  );
}