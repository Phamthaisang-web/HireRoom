const yup = require("yup");

const eventSchema = {
  title: yup
    .string()
    .required("Tiêu đề không được để trống")
    .max(255, "Tiêu đề tối đa 255 ký tự"),
  
  description: yup
    .string()
    .required("Mô tả không được để trống"),

  image: yup
    .string()
    .nullable()
    .url("Link ảnh phải là một URL hợp lệ"),

  startDate: yup
    .date()
    .typeError("Ngày bắt đầu không hợp lệ")
    .required("Ngày bắt đầu là bắt buộc"),

  endDate: yup
    .date()
    .typeError("Ngày kết thúc không hợp lệ")
    .required("Ngày kết thúc là bắt buộc")
    // Kiểm tra logic: Ngày kết thúc phải sau ngày bắt đầu
    .min(yup.ref('startDate'), "Ngày kết thúc không thể trước ngày bắt đầu"),

  location: yup
    .string()
    .required("Địa điểm không được để trống"),

  status: yup
    .string()
    .oneOf(['sắp diễn ra', 'đang diễn ra', 'đã kết thúc'], "Trạng thái không hợp lệ")
    .default('sắp diễn ra'),

 
};

// Schema cho việc tạo mới (Yêu cầu đầy đủ các trường chính)
const createEventSchema = yup.object().shape({
  ...eventSchema
});

// Schema cho việc cập nhật (Các trường là tùy chọn nhưng nếu có phải đúng định dạng)
const updateEventSchema = yup.object().shape({
  title: eventSchema.title.notRequired(),
  description: eventSchema.description.notRequired(),
  image: eventSchema.image.notRequired(),
  startDate: eventSchema.startDate.notRequired(),
  endDate: eventSchema.endDate.notRequired(),
  location: eventSchema.location.notRequired(),
  status: eventSchema.status.notRequired(),
  // Thông thường createdBy không cho phép update qua API này
});

module.exports = {
  createEventSchema,
  updateEventSchema,
};