const yup = require("yup");

// Validation cho tạo mới image room
const createImageRoomSchema = yup.object({
  roomId: yup
    .number()
    .required("roomId không được để trống")
    .typeError("roomId phải là số")
    .positive("roomId phải là số dương")
    .integer("roomId phải là số nguyên"),

  imageUrl: yup
    .string()
    .required("imageUrl không được để trống")
    
});

// Validation cho cập nhật image room
const updateImageRoomSchema = yup.object({
  roomId: yup
    .number()
    .notRequired()
    .typeError("roomId phải là số")
    .positive("roomId phải là số dương")
    .integer("roomId phải là số nguyên"),

  imageUrl: yup
    .string()
    .notRequired()
});

module.exports = {
  createImageRoomSchema,
  updateImageRoomSchema,
};