const yup = require("yup");

// Regex kiểm tra định dạng ObjectId của MongoDB
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Schema con cho từng tấm ảnh
const imageSchema = yup.object({
  url: yup.string().required("URL ảnh không được để trống"),
  public_id: yup.string().nullable(),
  isThumbnail: yup.boolean().default(false)
});

// 1. Định nghĩa Schema tạo mới
const createRoomSchema = yup.object({
  title: yup.string().required("Tiêu đề không được để trống").max(255),
  description: yup.string().nullable(),
  price: yup.number().required("Giá thuê không được để trống").min(0),
  area: yup.number().required("Diện tích không được để trống").min(0),
  address: yup.string().required("Địa chỉ không được để trống"),
  city: yup.string().nullable(),
  district: yup.string().nullable(),
  ward: yup.string().nullable(),
  
  // Xử lý để nhận giá trị null/rỗng từ frontend mà không lỗi number
  latitude: yup.number().nullable().transform((curr, orig) => orig === "" ? null : curr).min(-90).max(90),
  longitude: yup.number().nullable().transform((curr, orig) => orig === "" ? null : curr).min(-180).max(180),
  
  status: yup.string().oneOf(["còn trống", "đã thuê"]).default("còn trống"),
  type: yup.string().nullable(),
  electricPrice: yup.number().nullable().min(0),
  waterPrice: yup.number().nullable().min(0),
  internetPrice: yup.number().nullable().min(0),
  maxPeople: yup.number().nullable().min(1),
  furniture: yup.string().nullable(),
  
  // --- THÊM TRƯỜNG IMAGES Ở ĐÂY ---
  images: yup.array()
    .of(imageSchema)
    .min(1, "Vui lòng tải lên ít nhất một ảnh")
    .required("Danh sách ảnh là bắt buộc"),

  landlordId: yup.string()
    .required("landlordId không được để trống")
    .matches(objectIdRegex, "ID chủ trọ không hợp lệ")
});

// 2. Định nghĩa Schema cập nhật
const updateRoomSchema = yup.object({
  title: yup.string().notRequired().max(255),
  description: yup.string().nullable().notRequired(),
  price: yup.number().notRequired().min(0),
  area: yup.number().notRequired().min(0),
  address: yup.string().notRequired(),
  city: yup.string().nullable().notRequired(),
  district: yup.string().nullable().notRequired(),
  ward: yup.string().nullable().notRequired(),
  latitude: yup.number().nullable().notRequired().transform((curr, orig) => orig === "" ? null : curr),
  longitude: yup.number().nullable().notRequired().transform((curr, orig) => orig === "" ? null : curr),
  status: yup.string().notRequired().oneOf(["còn trống", "đã thuê"]),
  type: yup.string().nullable().notRequired(),
  electricPrice: yup.number().nullable().notRequired().min(0),
  waterPrice: yup.number().nullable().notRequired().min(0),
  internetPrice: yup.number().nullable().notRequired().min(0),
  maxPeople: yup.number().nullable().notRequired().min(1),
  furniture: yup.string().nullable().notRequired(),
  
  // Update có thể không cần gửi lại toàn bộ ảnh nếu không thay đổi
  images: yup.array().of(imageSchema).notRequired(),
  
  landlordId: yup.string().notRequired().matches(objectIdRegex, "ID chủ trọ không hợp lệ")
});

module.exports = {
  createRoomSchema,
  updateRoomSchema,
};