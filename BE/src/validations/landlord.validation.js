const yup = require("yup");

const createLandlordSchema = yup.object({
  fullName: yup
    .string()
    .required("fullName không được để trống")
    .max(100, "fullName tối đa 100 ký tự"),

  phone: yup
    .string()
    .required("phone không được để trống")
    .min(9, "phone ít nhất 9 ký tự")
    .max(15, "phone tối đa 15 ký tự"),

  zalo: yup
    .string()
    .nullable()
    .notRequired(),

  facebook: yup
    .string()
    .nullable()
    .notRequired()
    .url("facebook phải là URL hợp lệ"),

  note: yup
    .string()
    .nullable()
    .notRequired(),

  status: yup
    .string()
    .nullable()
    .notRequired(),
});

const updateLandlordSchema = yup.object({
  fullName: yup
    .string()
    .notRequired()
    .max(100, "fullName tối đa 100 ký tự"),

  phone: yup
    .string()
    .notRequired()
    .min(9, "phone ít nhất 9 ký tự")
    .max(15, "phone tối đa 15 ký tự"),

  zalo: yup
    .string()
    .nullable()
    .notRequired(),

  facebook: yup
    .string()
    .nullable()
    .notRequired()
    .url("facebook phải là URL hợp lệ"),

  note: yup
    .string()
    .nullable()
    .notRequired(),

  status: yup
    .string()
    .nullable()
    .notRequired(),
});

module.exports = {
  createLandlordSchema,
  updateLandlordSchema,
};