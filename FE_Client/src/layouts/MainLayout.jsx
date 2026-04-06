import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';


export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FA] font-sans selection:bg-blue-100">
      {/* 1. Header cố định ở trên cùng */}
      <Header />

      {/* 2. Phần nội dung thay đổi theo Route */}
      <main className="flex-grow">
        <Outlet /> 
      </main>
     
<Footer/>
      
    </div>
  );
}