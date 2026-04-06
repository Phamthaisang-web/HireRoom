import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import {
  Modal, Form, Input, InputNumber, Upload, message,
  Table, Button, Select, Popconfirm, Tag, Space, Typography, Card, Divider
} from "antd";
import { 
  PlusOutlined, SearchOutlined, ReloadOutlined, 
  EnvironmentOutlined, ThunderboltOutlined,
  LayoutOutlined, PictureOutlined, InfoCircleOutlined
} from "@ant-design/icons";

const { Text, Title, Link } = Typography;

export default function RoomPageAdmin() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const token = localStorage.getItem("token");
  
  // Lấy Base URL từ axios instance (thường là http://localhost:8080/api)
  const baseURL = api.defaults.baseURL;
  const noImage = "https://placehold.co/400x300?text=No+Image";

  const [filters, setFilters] = useState({ keyword: "", status: "" });

  // --- Helpers ---
  
  // Hàm ghép full link ảnh chuẩn
  const getFullImageUrl = (url) => {
    if (!url) return noImage;
    if (url.startsWith("http")) return url;
    // Đảm bảo url bắt đầu bằng / để ghép: /uploads/abc.jpg
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${baseURL}${cleanPath}`;
  };

  // --- Fetch dữ liệu địa chính ---
  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then(res => res.json())
      .then(data => setProvinces(data))
      .catch(err => console.error("Lỗi tải tỉnh thành:", err));
  }, []);

  const handleCityChange = async (cityName) => {
    form.setFieldsValue({ district: undefined, ward: undefined });
    setDistricts([]);
    setWards([]);
    const selected = provinces.find(p => p.name === cityName);
    if (selected) {
      const res = await fetch(`https://provinces.open-api.vn/api/p/${selected.code}?depth=2`).then(r => r.json());
      setDistricts(res.districts || []);
    }
  };

  const handleDistrictChange = async (districtName) => {
    form.setFieldsValue({ ward: undefined });
    setWards([]);
    const selected = districts.find(d => d.name === districtName);
    if (selected) {
      const res = await fetch(`https://provinces.open-api.vn/api/d/${selected.code}?depth=2`).then(r => r.json());
      setWards(res.wards || []);
    }
  };

  // --- Queries ---
  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["rooms", filters],
    queryFn: async () => {
      const res = await api.get("/rooms", { params: filters });
      return res.data.rooms || [];
    },
  });

  const { data: landlords = [], isLoading: isLoadingLandlords } = useQuery({
    queryKey: ["landlords"],
    queryFn: async () => {
      const res = await api.get("/landlords");
      return res.data?.landlordData?.landlords || [];
    },
  });

  // --- Mutations ---
  const submitMutation = useMutation({
    mutationFn: async (values) => {
      // Xử lý danh sách ảnh trước khi gửi lên Server
      const imagesPayload = uploadedImages
        .map((file, index) => {
          let relativeUrl = "";
          if (file.status === "done" && file.response?.urls?.[0]) {
            // Ảnh mới upload: lấy path từ server trả về (vd: /uploads/abc.jpg)
            relativeUrl = file.response.urls[0];
          } else if (file.url) {
            // Ảnh cũ: Xóa bỏ baseURL để chỉ lưu path tương đối vào DB
            relativeUrl = file.url.replace(baseURL, "");
          }

          return relativeUrl ? {
            url: relativeUrl,
            public_id: file.name || `rooms/img-${Date.now()}-${index}`,
            isThumbnail: index === 0,
          } : null;
        })
        .filter(img => img !== null);

      const payload = {
        ...values,
        images: imagesPayload,
        location: {
          type: "Point",
          coordinates: [parseFloat(values.longitude) || 0, parseFloat(values.latitude) || 0],
        },
      };

      delete payload.latitude;
      delete payload.longitude;

      const headers = { Authorization: `Bearer ${token}` };
      if (editingRoom) {
        return await api.put(`/rooms/${editingRoom._id}`, payload, { headers });
      }
      return await api.post("/rooms", payload, { headers });
    },
    onSuccess: () => {
      message.success(editingRoom ? "Cập nhật thành công ✨" : "Đăng tin thành công 🎉");
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
    onError: (err) => message.error(err.response?.data?.message || "Có lỗi xảy ra"),
  });

  const deleteRoom = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/rooms/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => {
      message.success("Đã xóa phòng");
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  // --- Handlers ---
  const handleClose = () => {
    setOpen(false);
    setEditingRoom(null);
    setUploadedImages([]);
    setDistricts([]);
    setWards([]);
    form.resetFields();
  };

  const handleEdit = async (record) => {
    setEditingRoom(record);
    setOpen(true);
    
    // Load dữ liệu địa chính khi sửa
    if (record.city) {
      const p = provinces.find(i => i.name === record.city);
      if (p) {
        const dRes = await fetch(`https://provinces.open-api.vn/api/p/${p.code}?depth=2`).then(r => r.json());
        setDistricts(dRes.districts || []);
        const d = dRes.districts?.find(i => i.name === record.district);
        if (d) {
          const wRes = await fetch(`https://provinces.open-api.vn/api/d/${d.code}?depth=2`).then(r => r.json());
          setWards(wRes.wards || []);
        }
      }
    }

    form.setFieldsValue({
      ...record,
      landlordId: record.landlordId?._id || record.landlordId,
      latitude: record.location?.coordinates?.[1],
      longitude: record.location?.coordinates?.[0],
    });

    // Hiển thị ảnh cũ vào Upload component
    if (record.images?.length > 0) {
      setUploadedImages(record.images.map((img, idx) => ({
        uid: img.public_id || idx,
        status: "done",
        url: getFullImageUrl(img.url),
      })));
    }
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "images",
      width: 80,
      align: 'center',
      render: (images) => (
        <div style={{ borderRadius: 8, overflow: 'hidden', width: 50, height: 50, border: '1px solid #f0f0f0', margin: '0 auto' }}>
          <img src={getFullImageUrl(images?.[0]?.url)} style={{ width: '100%', height: '100%', objectFit: "cover" }} alt="thumb" />
        </div>
      ),
    },
    { 
      title: "Thông tin phòng", 
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 14 }}>{r.title}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            <EnvironmentOutlined /> {r.district}, {r.city}
          </Text>
        </Space>
      )
    },
    {
      title: "Giá thuê",
      dataIndex: "price",
      width: 120,
      render: (p) => <Text strong style={{ color: "#ff4d4f" }}>{p?.toLocaleString()}đ</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 110,
      align: 'center',
      render: (s) => (
        <Tag bordered={false} color={s === "còn trống" ? "processing" : "default"} style={{ borderRadius: 12, fontSize: 11 }}>
          {s?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      width: 110,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Link onClick={() => handleEdit(record)}>Sửa</Link>
          <Popconfirm title="Xóa phòng?" onConfirm={() => deleteRoom.mutate(record._id)} okText="Xóa" cancelText="Hủy">
            <Link danger>Xóa</Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px", background: "#f5f7f9", minHeight: "100vh" }}>
      <Card variant="borderless" style={{ borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', marginBottom: 20 }}>
          <Title level={4} style={{ margin: 0 }}>Quản lý danh sách phòng</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Đăng tin mới</Button>
        </div>

        <Space style={{ marginBottom: 20 }} wrap>
          <Input 
            placeholder="Tìm tiêu đề..." 
            prefix={<SearchOutlined />} 
            style={{ width: 220 }} 
            allowClear 
            value={filters.keyword} 
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} 
          />
          <Select 
            placeholder="Trạng thái" 
            style={{ width: 140 }} 
            allowClear 
            onChange={(v) => setFilters({ ...filters, status: v })} 
            options={[{ value: "còn trống", label: "Còn trống" }, { value: "đã thuê", label: "Đã thuê" }]}
          />
          <Button icon={<ReloadOutlined />} onClick={() => setFilters({ keyword: "", status: "" })}>Làm mới</Button>
        </Space>

        <Table 
          columns={columns} 
          dataSource={rooms} 
          rowKey="_id" 
          loading={isLoading} 
          size="small"
          pagination={{ pageSize: 8 }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={<Title level={5} style={{ margin: 0 }}><InfoCircleOutlined /> Chi tiết tin đăng phòng</Title>}
        open={open}
        width={850}
        onCancel={handleClose}
        onOk={() => form.submit()}
        confirmLoading={submitMutation.isPending}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={(v) => submitMutation.mutate(v)} style={{ marginTop: 15 }}>
          <Divider orientation="left" plain><PictureOutlined /> Hình ảnh</Divider>
          <Form.Item>
            <Upload
              action={`${baseURL}/uploads`}
              headers={{ Authorization: `Bearer ${token}` }}
              listType="picture-card"
              fileList={uploadedImages}
              name="images"
              multiple
              onChange={({ fileList }) => setUploadedImages(fileList)}
            >
              {uploadedImages.length < 8 && (
                <div><PlusOutlined /><div style={{ marginTop: 5 }}>Tải lên</div></div>
              )}
            </Upload>
          </Form.Item>

          <Divider orientation="left" plain><InfoCircleOutlined /> Thông tin chính</Divider>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "15px" }}>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input placeholder="Tiêu đề bài đăng..." />
            </Form.Item>
            <Form.Item name="landlordId" label="Chủ sở hữu" rules={[{ required: true }]}>
              <Select 
                showSearch 
                placeholder="Chọn chủ trọ"
                options={landlords.map(l => ({ value: l._id, label: `${l.fullName} (${l.phone})` }))} 
                optionFilterProp="label"
              />
            </Form.Item>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "12px" }}>
            <Form.Item name="price" label="Giá thuê" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
            <Form.Item name="area" label="Diện tích (m²)" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="maxPeople" label="Số người" initialValue={1}><InputNumber style={{ width: "100%" }} /></Form.Item>
            <Form.Item name="status" label="Trạng thái" initialValue="còn trống">
              <Select options={[{ value: "còn trống", label: "Còn trống" }, { value: "đã thuê", label: "Đã thuê" }]} />
            </Form.Item>
          </div>

          <Divider orientation="left" plain><EnvironmentOutlined /> Địa chỉ</Divider>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <Form.Item name="city" label="Thành phố" rules={[{ required: true }]}>
              <Select showSearch onChange={handleCityChange} options={provinces.map(p => ({ value: p.name, label: p.name }))} />
            </Form.Item>
            <Form.Item name="district" label="Quận / Huyện" rules={[{ required: true }]}>
              <Select showSearch disabled={!districts.length} onChange={handleDistrictChange} options={districts.map(d => ({ value: d.name, label: d.name }))} />
            </Form.Item>
            <Form.Item name="ward" label="Phường / Xã" rules={[{ required: true }]}>
              <Select showSearch disabled={!wards.length} options={wards.map(w => ({ value: w.name, label: w.name }))} />
            </Form.Item>
          </div>

          <Form.Item name="address" label="Địa chỉ chi tiết" rules={[{ required: true }]}><Input /></Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <Form.Item name="latitude" label="Vĩ độ"><InputNumber style={{ width: "100%" }} /></Form.Item>
            <Form.Item name="longitude" label="Kinh độ"><InputNumber style={{ width: "100%" }} /></Form.Item>
          </div>

          <Divider orientation="left" plain><LayoutOutlined /> Khác</Divider>
          <Form.Item name="furniture" label="Nội thất"><Input placeholder="Máy lạnh, giường, tủ..." /></Form.Item>
          <Form.Item name="description" label="Mô tả"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}