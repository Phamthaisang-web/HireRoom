const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (data) => {
  const { fullName, phone, password, role } = data;

  if (!fullName || !phone || !password) {
    throw new Error("Thiếu dữ liệu");
  }

  const kiemTraUser = await userModel.findUserByPhone(phone);

  if (kiemTraUser) {
    throw new Error("Số điện thoại đã có");
  }

  const user = await userModel.createUser({
    fullName,
    phone,
    password,
    role: role || "user",
  });

  return user;
};

const login = async (data) => {
  const { phone, password } = data;

  if (!phone || !password) {
    throw new Error("Thiếu số điện thoại hoặc mật khẩu");
  }

  const user = await userModel.findUserByPhone(phone);

  if (!user) {
    throw new Error("Số điện thoại chưa đăng ký");
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    throw new Error("Mật khẩu sai");
  }

  const dataUser = {
    id: user.id,
    fullName: user.fullName,
    phone: user.phone,
    role: user.role,
  };

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    "SECRET_KEY",
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    dataUser,
  };
};

module.exports = {
  register,
  login,
};