const yup = require("yup");
const eventValidationRules = {
  title: yup
    .string()
    .trim()
    .required("Tiêu đề sự kiện không được để trống")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự"),

  description: yup
    .string()
    .trim()
    .required("Mô tả sự kiện là bắt buộc"),

  // ĐỔI TỪ 'image' SANG 'images' VÀ KIỂM TRA DẠNG MẢNG
  images: yup
    .array()
    .of(
      yup.object().shape({
        url: yup.string().required(),
        public_id: yup.string().nullable(),
        isThumbnail: yup.boolean().default(false)
      })
    )
    .nullable()
    .default([]),

  startDate: yup
    .date()
    .typeError("Ngày bắt đầu không đúng định dạng")
    .required("Ngày bắt đầu là bắt buộc"),
    // Giữ nguyên phần test "is-future" của bạn

  endDate: yup
    .date()
    .typeError("Ngày kết thúc không đúng định dạng")
    .required("Ngày kết thúc là bắt buộc")
    .test(
      "is-after-start",
      "Ngày kết thúc phải sau ngày bắt đầu",
      function (value) {
        const { startDate } = this.parent;
        return value && startDate ? new Date(value) > new Date(startDate) : true;
      }
    ),

  location: yup
    .string()
    .trim()
    .required("Địa điểm tổ chức không được để trống"),

  status: yup
    .string()
    .oneOf(["sắp diễn ra", "đang diễn ra", "đã kết thúc"], "Trạng thái không hợp lệ")
    .default("sắp diễn ra"),
};
const createEventSchema = yup.object().shape({
  ...eventValidationRules,
});

const updateEventSchema = yup.object().shape(
  Object.keys(eventValidationRules).reduce((acc, key) => {
    if (key !== "createdBy") {
      // Đối với Update, chúng ta cho phép các trường có thể null/trống
      // nhưng nếu có nhập thì phải đúng định dạng của Rules bên trên.
      acc[key] = eventValidationRules[key].optional();
    }
    return acc;
  }, {})
);

module.exports = { createEventSchema, updateEventSchema };