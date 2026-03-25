const yup = require("yup");

const registerUserSchema = yup.object({
  fullName: yup
    .string()
    .required("fullName không được để trống")
    .max(100, "fullName tối đa 100 ký tự"),

  phone: yup
    .string()
    .required("phone không được để trống")
    .min(9, "phone ít nhất 9 ký tự")
    .max(15, "phone tối đa 15 ký tự"),

  password: yup
    .string()
    .required("password không được để trống")
    .min(6, "password tối thiểu 6 ký tự"),

  role: yup
    .string()
    .nullable()
    .notRequired()
     
});
const loginUserSchema = yup.object({
  phone: yup
    .string()
    .required("phone không được để trống")
    .min(9, "phone ít nhất 9 ký tự")
    .max(15, "phone tối đa 15 ký tự"),

  password: yup
    .string()
    .required("password không được để trống")
    .min(6, "password tối thiểu 6 ký tự"),
});

module.exports = {
  registerUserSchema,
  loginUserSchema,
};