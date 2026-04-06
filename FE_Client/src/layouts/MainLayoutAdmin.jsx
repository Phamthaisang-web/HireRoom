import React from "react";
import { Layout, Menu, Button, Space, Avatar } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  HomeOutlined,
  TeamOutlined,
  NotificationOutlined,
  LogoutOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";

const { Header, Sider, Content } = Layout;

export default function MainLayoutAdmin() {
  const navigate = useNavigate();
  const location = useLocation();

  // Danh sách menu - Cập nhật KEY để khớp với App.jsx
  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: "Bảng điều khiển",
    },
    {
      key: "/admin/landlords",
      icon: <TeamOutlined />,
      label: "Quản lý chủ nhà",
    },
    {
      key: "/admin/rooms",
      icon: <HomeOutlined />,
      label: "Phòng cho thuê",
    },
    {
      key: "/admin/users",
      icon: <UserOutlined />,
      label: "Người dùng",
    },
    {
      key: "/admin/events",
      icon: <NotificationOutlined />,
      label: "Sự kiện",
    },
    {
      type: "divider",
      style: { backgroundColor: "rgba(255,255,255,0.1)" }
    },
    {
      key: "/",
      icon: <ArrowLeftOutlined />,
      label: "Quay lại Website",
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar cố định bên trái */}
      <Sider
        width={250}
        theme="dark"
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
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            marginBottom: "8px"
          }}
        >
          <Link to="/admin" style={{ color: "#ff4d4f", fontSize: "18px", fontWeight: "800", letterSpacing: "1px" }}>
            HIRE ROOM ADMIN
          </Link>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={(e) => navigate(e.key)}
          items={menuItems}
        />
      </Sider>

      {/* Vùng nội dung bên phải */}
      <Layout style={{ marginLeft: 250, transition: "all 0.2s" }}>
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
          <div style={{ fontSize: "16px", fontWeight: "600", color: "#595959" }}>
            Hệ thống quản trị <span style={{ color: "#bfbfbf", fontWeight: "normal", margin: "0 8px" }}>/</span> 
            <span style={{ color: "#1890ff" }}>
              {menuItems.find(item => item.key === location.pathname)?.label || "Trang chủ"}
            </span>
          </div>

          <Space size={16}>
            <div style={{ textAlign: "right", lineHeight: "1.2" }}>
              <div style={{ fontWeight: "bold", fontSize: "14px" }}>Quản trị viên</div>
              <div style={{ fontSize: "12px", color: "#8c8c8c" }}>admin@hireroom.com</div>
            </div>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
            <Button 
              type="text" 
              danger 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
              style={{ marginLeft: "8px" }}
            >
              Đăng xuất
            </Button>
          </Space>
        </Header>

        <Content
          style={{
            padding: "24px",
            background: "#f0f2f5",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "12px",
              minHeight: "100%",
              boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
            }}
          >
            {/* Đây là nơi hiển thị nội dung các trang con như RoomsPageAdmin, LandlordsPageAdmin... */}
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}