import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  MessageOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Danh sách menu cho Admin
  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: "Bảng điều khiển",
    },
    {
      key: "/admin/landlords",
      icon: <TeamOutlined />, // Icon đại diện cho chủ trọ
      label: "Quản lý chủ trọ",
    },
    {
      key: "/admin/rooms",
      icon: <HomeOutlined />,
      label: "Quản lý phòng trọ",
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: "Người dùng",
    },
    {
      key: "/admin/chat",
      icon: <MessageOutlined />,
      label: "Tin nhắn",
    },
    {
      type: "divider", // Đường kẻ phân cách
    },
    {
      key: "/",
      icon: <LogoutOutlined />,
      label: "Quay lại trang chủ",
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sider (Thanh bên trái) */}
      <Sider
        width={250}
        theme="dark"
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#001529",
            borderBottom: "1px solid #333",
          }}
        >
          <Link to="/" style={{ color: "#ff4d4f", fontSize: "20px", fontWeight: "bold" }}>
            THUÊ PHÒNG ADMIN
          </Link>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(e) => navigate(e.key)}
          items={menuItems}
          style={{ padding: "16px 0" }}
        />
      </Sider>

      {/* Main Layout (Bên phải) */}
      <Layout style={{ marginLeft: 250, transition: "all 0.2s" }}>
        {/* Header trên cùng */}
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            position: "sticky",
            top: 0,
            zIndex: 99,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: "16px" }}>
            Hệ thống Quản lý Bất động sản
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <span>Xin chào, <b>Admin</b></span>
            <button 
              onClick={handleLogout}
              style={{ 
                border: "none", 
                background: "none", 
                cursor: "pointer", 
                color: "#ff4d4f",
                display: "flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <LogoutOutlined /> Đăng xuất
            </button>
          </div>
        </Header>

        {/* Content (Nội dung thay đổi theo Route) */}
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: "calc(100vh - 112px)", // 64px header + margins
            background: "#fff",
            borderRadius: "8px",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}