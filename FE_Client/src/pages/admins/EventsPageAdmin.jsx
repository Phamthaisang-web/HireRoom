import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import {
  Modal, Form, Input, DatePicker, Upload, message,
  Table, Button, Select, Popconfirm, Tag, Space, Typography, Card, Divider
} from "antd";
import { 
  PlusOutlined, SearchOutlined, ReloadOutlined, 
  EnvironmentOutlined, PictureOutlined, InfoCircleOutlined,
  CalendarOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text, Title, Link } = Typography;
const { RangePicker } = DatePicker;

export default function EventPageAdmin() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]); // Chuyển sang số nhiều
  const [filters, setFilters] = useState({ keyword: "", status: "" });

  const token = localStorage.getItem("token");
  const baseURL = api.defaults.baseURL;
  const noImage = "https://placehold.co/600x400?text=No+Event+Image";

  // --- Helpers ---
  const getFullImageUrl = (url) => {
    if (!url) return noImage;
    if (url.startsWith("http")) return url;
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    return `${baseURL}${cleanPath}`;
  };

  // --- Queries ---
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", filters],
    queryFn: async () => {
      const res = await api.get("/events", { params: filters });
      return res.data.data || []; 
    },
  });

  // --- Mutations ---
  const submitMutation = useMutation({
    mutationFn: async (values) => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      // Xử lý mảng nhiều ảnh
      const imagesPayload = uploadedImages
        .map((file, index) => {
          let url = "";
          if (file.status === "done" && file.response?.urls?.[0]) {
            url = file.response.urls[0]; // Ảnh mới upload
          } else if (file.url) {
            url = file.url.replace(baseURL, ""); // Ảnh cũ
          }

          return url ? {
            url: url,
            public_id: file.name || `event-${Date.now()}-${index}`,
            isThumbnail: index === 0,
          } : null;
        })
        .filter(img => img !== null);

      const payload = {
        title: values.title?.trim(),
        description: values.description?.trim() || "Chưa có mô tả",
        location: values.location?.trim(),
        status: values.status,
        images: imagesPayload, // Gửi mảng images
        startDate: values.dates[0].toISOString(),
        endDate: values.dates[1].toISOString(),
        createdBy: user._id || user.id,
      };

      const headers = { Authorization: `Bearer ${token}` };
      if (editingEvent) {
        return await api.put(`/events/${editingEvent._id}`, payload, { headers });
      }
      return await api.post("/events", payload, { headers });
    },
    onSuccess: () => {
      message.success(editingEvent ? "Cập nhật thành công ✨" : "Tạo sự kiện thành công 🎉");
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Có lỗi xảy ra";
      message.error(errorMsg);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/events/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    },
    onSuccess: () => {
      message.success("Đã xóa sự kiện");
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  // --- Handlers ---
  const handleClose = () => {
    setOpen(false);
    setEditingEvent(null);
    setUploadedImages([]);
    form.resetFields();
  };

  const handleEdit = (record) => {
    setEditingEvent(record);
    setOpen(true);
    form.setFieldsValue({
      ...record,
      dates: [dayjs(record.startDate), dayjs(record.endDate)],
    });

    // Load lại danh sách ảnh vào Upload component
    if (record.images && record.images.length > 0) {
      const formatted = record.images.map((img, idx) => ({
        uid: idx.toString(),
        name: `img-${idx}`,
        status: "done",
        url: getFullImageUrl(img.url),
      }));
      setUploadedImages(formatted);
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "images",
      width: 100,
      align: 'center',
      render: (images) => (
        <div style={{ borderRadius: 8, overflow: 'hidden', width: 60, height: 40, border: '1px solid #f0f0f0', margin: '0 auto' }}>
          <img 
            src={getFullImageUrl(images?.[0]?.url)} 
            style={{ width: '100%', height: '100%', objectFit: "cover" }} 
            alt="event" 
          />
        </div>
      ),
    },
    {
      title: "Thông tin sự kiện",
      render: (_, r) => (
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: 14 }}>{r.title}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            <EnvironmentOutlined /> {r.location}
          </Text>
        </Space>
      ),
    },
    {
      title: "Thời gian",
      width: 220,
      render: (_, r) => (
        <div style={{ fontSize: 12 }}>
          <Tag icon={<CalendarOutlined />} color="default">
            {dayjs(r.startDate).format("DD/MM/YYYY")} - {dayjs(r.endDate).format("DD/MM/YYYY")}
          </Tag>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 130,
      align: 'center',
      render: (s) => {
        const colors = { "đang diễn ra": "green", "sắp diễn ra": "blue", "đã kết thúc": "red" };
        return (
          <Tag bordered={false} color={colors[s] || "default"} style={{ borderRadius: 12 }}>
            {s?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      width: 110,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Link onClick={() => handleEdit(record)}>Sửa</Link>
          <Popconfirm title="Xóa sự kiện này?" onConfirm={() => deleteMutation.mutate(record._id)}>
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
          <Title level={4} style={{ margin: 0 }}>Quản lý Sự kiện</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>Thêm sự kiện</Button>
        </div>

        <Space style={{ marginBottom: 20 }} wrap>
          <Input 
            placeholder="Tìm tên sự kiện..." 
            prefix={<SearchOutlined />} 
            style={{ width: 250 }} 
            allowClear 
            value={filters.keyword} 
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })} 
          />
          <Select 
            placeholder="Trạng thái" 
            style={{ width: 160 }} 
            allowClear 
            onChange={(v) => setFilters({ ...filters, status: v })} 
            options={[
              { value: "sắp diễn ra", label: "Sắp diễn ra" },
              { value: "đang diễn ra", label: "Đang diễn ra" },
              { value: "đã kết thúc", label: "Đã kết thúc" }
            ]}
          />
          <Button icon={<ReloadOutlined />} onClick={() => setFilters({ keyword: "", status: "" })}>Làm mới</Button>
        </Space>

        <Table 
          columns={columns} 
          dataSource={events} 
          rowKey="_id" 
          loading={isLoading} 
          size="middle"
          pagination={{ pageSize: 6 }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={<Title level={5} style={{ margin: 0 }}><InfoCircleOutlined /> {editingEvent ? "Cập nhật sự kiện" : "Tạo sự kiện mới"}</Title>}
        open={open}
        width={750}
        onCancel={handleClose}
        onOk={() => form.submit()}
        confirmLoading={submitMutation.isPending}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={(v) => submitMutation.mutate(v)} style={{ marginTop: 15 }}>
          <Divider orientation="left" plain><PictureOutlined /> Album hình ảnh</Divider>
          <Form.Item label="Tải lên hình ảnh (Tối đa 5)">
            <Upload
              action={`${baseURL}/uploads`}
              headers={{ Authorization: `Bearer ${token}` }}
              listType="picture-card"
              fileList={uploadedImages}
              name="images"
              multiple
              maxCount={5}
              onChange={({ fileList }) => setUploadedImages(fileList)}
            >
              {uploadedImages.length < 5 && (
                <div><PlusOutlined /><div style={{ marginTop: 5 }}>Thêm ảnh</div></div>
              )}
            </Upload>
          </Form.Item>

          <Divider orientation="left" plain><InfoCircleOutlined /> Thông tin chung</Divider>
          <Form.Item name="title" label="Tên sự kiện" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
            <Input placeholder="Nhập tiêu đề sự kiện..." />
          </Form.Item>

          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "15px" }}>
            <Form.Item name="dates" label="Thời gian diễn ra" rules={[{ required: true, message: 'Chọn thời gian!' }]}>
              <RangePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" initialValue="sắp diễn ra">
              <Select options={[
                { value: "sắp diễn ra", label: "Sắp diễn ra" },
                { value: "đang diễn ra", label: "Đang diễn ra" },
                { value: "đã kết thúc", label: "Đã kết thúc" },
              ]} />
            </Form.Item>
          </div>

          <Form.Item name="location" label="Địa điểm tổ chức" rules={[{ required: true, message: 'Nhập địa điểm!' }]}>
            <Input prefix={<EnvironmentOutlined />} placeholder="Ví dụ: Hội trường A, Sân vận động..." />
          </Form.Item>

          <Form.Item name="description" label="Mô tả tóm tắt" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
            <Input.TextArea rows={4} placeholder="Nội dung chính của sự kiện..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}