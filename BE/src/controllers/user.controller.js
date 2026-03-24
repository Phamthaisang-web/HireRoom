const userService = require("../services/user.service");
const getAlluser = async (req, res) => {
  try {
    const user = await userService.getAlluser();
    res.status(200).json({
      message: "lay danh sach thanh",
      status: 200,
      userData: user,
    });
  } catch (e) {
    res.json({
      error: e.message,
    });
  }
};
const getuserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userService.getuserById(id);
    res.status(200).json({
      message: "tim thay id",
      status: 200,
      userData: user,
    });
  } catch (e) {
    res.json({
      error: e.message,
    });
  }
};
module.exports = {
  getAlluser,
  getuserById
 
};
