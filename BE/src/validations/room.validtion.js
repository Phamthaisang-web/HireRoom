// src/validations/room.validation.js
const yup = require("yup");

// Validation khi tạo phòng mới
const createRoomSchema = yup.object({
  title: yup
    .string()
    .required("title không được để trống")
    .max(255, "title tối đa 255 ký tự"),

  description: yup
    .string()
    .nullable()
    .notRequired(),

  price: yup
    .number()
    .required("price không được để trống")
    .min(0, "price phải lớn hơn hoặc bằng 0"),

  area: yup
    .number()
    .required("area không được để trống")
    .min(0, "area phải lớn hơn hoặc bằng 0"),

  address: yup
    .string()
    .required("address không được để trống")
    .max(255, "address tối đa 255 ký tự"),

  city: yup
    .string()
    .nullable()
    .notRequired()
    .max(100, "city tối đa 100 ký tự"),

  district: yup
    .string()
    .nullable()
    .notRequired()
    .max(100, "district tối đa 100 ký tự"),

  ward: yup
    .string()
    .nullable()
    .notRequired()
    .max(100, "ward tối đa 100 ký tự"),

  latitude: yup
    .number()
    .nullable()
    .notRequired()
    .min(-90, "latitude phải từ -90 đến 90")
    .max(90, "latitude phải từ -90 đến 90"),

  longitude: yup
    .number()
    .nullable()
    .notRequired()
    .min(-180, "longitude phải từ -180 đến 180")
    .max(180, "longitude phải từ -180 đến 180"),

  status: yup
    .string()
    .nullable()
    .notRequired()
    .oneOf(["còn trống", "đã thuê"], "status phải là 'còn trống' hoặc 'đã thuê'")
    .default("còn trống"),

  type: yup
    .string()
    .nullable()
    .notRequired()
    .max(50, "type tối đa 50 ký tự"),

  electricPrice: yup
    .number()
    .nullable()
    .notRequired()
    .min(0, "electricPrice phải lớn hơn hoặc bằng 0"),

  waterPrice: yup
    .number()
    .nullable()
    .notRequired()
    .min(0, "waterPrice phải lớn hơn hoặc bằng 0"),

  internetPrice: yup
    .number()
    .nullable()
    .notRequired()
    .min(0, "internetPrice phải lớn hơn hoặc bằng 0"),

  maxPeople: yup
    .number()
    .nullable()
    .notRequired()
    .min(1, "maxPeople phải lớn hơn hoặc bằng 1"),

  furniture: yup
    .string()
    .nullable()
    .notRequired(),

  landlordId: yup
    .number()
    .required("landlordId không được để trống")
    .min(1, "landlordId phải lớn hơn 0"),
});

// Validation khi cập nhật phòng (không bắt buộc tất cả trường)
const updateRoomSchema = yup.object({
  title: yup
    .string()
    .notRequired()
    .max(255, "title tối đa 255 ký tự"),

  description: yup
    .string()
    .nullable()
    .notRequired(),

  price: yup
    .number()
    .notRequired()
    .min(0, "price phải lớn hơn hoặc bằng 0"),

  area: yup
    .number()
    .notRequired()
    .min(0, "area phải lớn hơn hoặc bằng 0"),

  address: yup
    .string()
    .notRequired()
    .max(255, "address tối đa 255 ký tự"),

  city: yup
    .string()
    .nullable()
    .notRequired()
    .max(100, "city tối đa 100 ký tự"),

  district: yup
    .string()
    .nullable()
    .notRequired()
    .max(100, "district tối đa 100 ký tự"),

  ward: yup
    .string()
    .nullable()
    .notRequired()
    .max(100, "ward tối đa 100 ký tự"),

  latitude: yup
    .number()
    .nullable()
    .notRequired()
    .min(-90, "latitude phải từ -90 đến 90")
    .max(90, "latitude phải từ -90 đến 90"),

  longitude: yup
    .number()
    .nullable()
    .notRequired()
    .min(-180, "longitude phải từ -180 đến 180")
    .max(180, "longitude phải từ -180 đến 180"),

  status: yup
    .string()
    .nullable()
    .notRequired()
    .oneOf(["còn trống", "đã thuê"], "status phải là 'còn trống' hoặc 'đã thuê'"),

  type: yup
    .string()
    .nullable()
    .notRequired()
    .max(50, "type tối đa 50 ký tự"),

  electricPrice: yup
    .number()
    .nullable()
    .notRequired()
    .min(0, "electricPrice phải lớn hơn hoặc bằng 0"),

  waterPrice: yup
    .number()
    .nullable()
    .notRequired()
    .min(0, "waterPrice phải lớn hơn hoặc bằng 0"),

  internetPrice: yup
    .number()
    .nullable()
    .notRequired()
    .min(0, "internetPrice phải lớn hơn hoặc bằng 0"),

  maxPeople: yup
    .number()
    .nullable()
    .notRequired()
    .min(1, "maxPeople phải lớn hơn hoặc bằng 1"),

  furniture: yup
    .string()
    .nullable()
    .notRequired(),

  landlordId: yup
    .number()
    .nullable()
    .notRequired()
    .min(1, "landlordId phải lớn hơn 0"),
});

module.exports = {
  createRoomSchema,
  updateRoomSchema,
};