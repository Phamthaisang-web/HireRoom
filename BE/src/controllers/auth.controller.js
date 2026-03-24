const authService = require("../services/auth.service");
const login = async (req, res) => {
  try {
    const data = req.body;
    const user = await authService.login(data);
    res.status(200).json({
      message: "Login thanh cong",
      status: 200,
      loginData: user,
    });
  } catch (e) {
    res.json({
      error: e.message,
    });
  }
};
const register = async (req, res) => {
  try {
    const data = req.body;
    const user = await authService.register(data);
    console.log(user)
    res.status(201).json({
      message: "Register thanh cong",
      status: 201,
      registerData: user,
    });
  } catch (e) {
    res.json({
      error: e.message,
    });
  }
};
module.exports = {
  register,
  login,
};
