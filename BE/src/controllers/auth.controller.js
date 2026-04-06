const authService = require("../services/auth.service");

// 1. Đăng nhập
const login = async (req, res) => {
  try {
    const data = req.body;
    const user = await authService.login(data);
    
    res.status(200).json({
      message: "Đăng nhập thành công",
      status: 200,
      loginData: user,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

// 2. Đăng ký
const register = async (req, res) => {
  try {
    const data = req.body;
    const user = await authService.register(data);
    
    res.status(201).json({
      message: "Đăng ký tài khoản thành công",
      status: 201,
      registerData: user,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

// 3. Đổi mật khẩu
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Kiểm tra đầu vào cơ bản
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ mật khẩu cũ và mật khẩu mới",
      });
    }

    // Dữ liệu truyền vào Service
    // Lưu ý: req.user.id lấy từ Middleware VerifyToken (JWT)
    const data = {
      userId: req.user.id, 
      oldPassword,
      newPassword,
    };

    const result = await authService.changePassword(data);

    res.status(200).json({
      status: 200,
      message: result.message,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

module.exports = {
  register,
  login,
  changePassword,
};