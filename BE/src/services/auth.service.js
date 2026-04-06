const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

/**
 * Đăng ký tài khoản mới
 */
const register = async (data) => {
  const { fullName, phone, password } = data;

  // 1. Kiểm tra dữ liệu đầu vào
  if (!fullName || !phone || !password) {
    throw new Error("Vui lòng điền đầy đủ Họ tên, Số điện thoại và Mật khẩu");
  }

  // 2. Kiểm tra số điện thoại tồn tại
  const kiemTraPhoneUser = await userModel.findOne({ phone: phone.trim() });
  if (kiemTraPhoneUser) {
    throw new Error("Số điện thoại này đã được đăng ký");
  }

  // 3. Tạo user (Mật khẩu sẽ tự động được hash bởi pre-save hook trong Model)
  const user = await userModel.create(data);

  // 4. Trả về user (nhớ ẩn mật khẩu ở tầng Controller hoặc dùng .toObject())
  return user;
};

/**
 * Đăng nhập
 */
const login = async (data) => {
  const { phone, password } = data;

  // 1. Kiểm tra input
  if (!phone || !password) {
    throw new Error("Thiếu số điện thoại hoặc mật khẩu");
  }

  // 2. Tìm user theo số điện thoại
  const user = await userModel.findOne({ phone: phone.trim() });
  if (!user) {
    throw new Error("Số điện thoại chưa được đăng ký");
  }

  // 3. Sử dụng method comparePassword đã định nghĩa trong User Model
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Mật khẩu không chính xác");
  }

  // 4. Tạo mã Token JWT
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      fullName: user.fullName
    },
    "SECRET_KEY", // Nên để trong file .env
    {
      expiresIn: "1d",
    }
  );

  // 5. Chuẩn bị dữ liệu trả về (ẩn mật khẩu)
  const userData = user.toObject();
  delete userData.password;

  return {
    token,
    user: userData,
  };
};

module.exports = {
  register,
  login,
};