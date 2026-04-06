import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../services/api";
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Form,
  Tag,
  Space,
  message,
  Popconfirm,
  Pagination,
} from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

export default function LandlordsPageAdmin() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const token = localStorage.getItem("token");

  // State cho lọc và phân trang (khớp với API của bạn)
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    keyword: "",
    status: "",
  });

  // 1. Lấy danh sách chủ trọ
  const { data, isLoading } = useQuery({
    queryKey: ["landlords", params],
    queryFn: async () => {
      const res = await api.get("/landlords", { params });
      // Cấu trúc trả về là res.data.landlordData
      return res.data.landlordData; 
    },
  });

  // 2. Mutation: Tạo mới hoặc Cập nhật
  const submitMutation = useMutation({
    mutationFn: async (values) => {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      if (editingId) {
        return await api.put(`/landlords/${editingId}`, values, config);
      }
      return await api.post("/landlords", values, config);
    },
    onSuccess: () => {
      message.success(editingId ? "Cập nhật thành công" : "Thêm chủ trọ thành công");
      handleClose();
      queryClient.invalidateQueries(["landlords"]);
    },
    onError: (err) => message.error(err.response?.data?.message || "Có lỗi xảy ra"),
  });

  // 3. Mutation: Xóa chủ trọ
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await api.delete(`/landlords/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      message.success("Đã xóa chủ trọ");
      queryClient.invalidateQueries(["landlords"]);
    },
  });

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <b>{text}</b>,
    },
    {
      title: "Liên hệ",
      key: "contact",
      render: (_, record) => (
        <div style={{ fontSize: "13px" }}>
          <div>📞 {record.phone}</div>
          {record.zalo && <div>💬 Zalo: {record.zalo}</div>}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "đang hợp tác" ? "green" : "volcano"}>
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#1890ff" }} />}
            onClick={() => {
              setEditingId(record._id);
              setOpen(true);
              form.setFieldsValue(record);
            }}
          />
          <Popconfirm
            title="Xóa chủ trọ này?"
            onConfirm={() => deleteMutation.mutate(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Quản lý chủ trọ</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Thêm chủ trọ
        </Button>
      </div>

      <Space style={{ marginBottom: "20px" }}>
        <Input
          placeholder="Tìm tên, số điện thoại..."
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
          allowClear
          onChange={(e) => setParams({ ...params, keyword: e.target.value, page: 1 })}
        />
        <Select
          placeholder="Trạng thái"
          style={{ width: 180 }}
          allowClear
          onChange={(val) => setParams({ ...params, status: val, page: 1 })}
          options={[
            { value: "đang hợp tác", label: "Đang hợp tác" },
            { value: "ngừng hợp tác", label: "Ngừng hợp tác" },
          ]}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={data?.landlords || []}
        loading={isLoading}
        rowKey="_id"
        pagination={false} 
      />

      <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
        <Pagination
          current={data?.pagination?.currentPage || 1}
          pageSize={data?.pagination?.limit || 10}
          total={data?.pagination?.totalItems || 0}
          onChange={(page) => setParams({ ...params, page })}
          showSizeChanger={false}
        />
      </div>

      <Modal
        title={editingId ? "Sửa thông tin chủ trọ" : "Thêm chủ trọ mới"}
        open={open}
        onCancel={handleClose}
        onOk={() => form.submit()}
        confirmLoading={submitMutation.isPending}
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={(v) => submitMutation.mutate(v)}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>
            <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập SĐT' }]}>
              <Input placeholder="0909xxxxxx" />
            </Form.Item>
            <Form.Item name="zalo" label="Số Zalo">
              <Input placeholder="0909xxxxxx" />
            </Form.Item>
            <Form.Item name="status" label="Trạng thái" initialValue="đang hợp tác">
              <Select options={[
                { value: "đang hợp tác", label: "Đang hợp tác" },
                { value: "ngừng hợp tác", label: "Ngừng hợp tác" },
              ]} />
            </Form.Item>
          </div>
          <Form.Item name="facebook" label="Link Facebook">
            <Input placeholder="https://facebook.com/..." />
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Mô tả thêm..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}