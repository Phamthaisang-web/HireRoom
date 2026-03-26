const favoriteService = require("../services/favorite.service");

// ❤️ toggle (like / unlike)
const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id; // lấy từ middleware auth
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({
        message: "Thiếu roomId",
        status: 400,
      });
    }

    const result = await favoriteService.toggleFavorite(userId, roomId);

    res.status(200).json({
      message: result.favorited
        ? "Đã thêm vào yêu thích"
        : "Đã bỏ yêu thích",
      status: 200,
      ...result,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const data = await favoriteService.getMyFavorites(userId);

    res.status(200).json({
      message: "Lấy danh sách yêu thích thành công",
      status: 200,
      ...data,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};const checkFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const roomId = req.params.roomId;

    const result = await favoriteService.checkFavorite(userId, roomId);

    res.status(200).json({
      message: "Check favorite thành công",
      status: 200,
      ...result,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};module.exports = {
  toggleFavorite,
  getMyFavorites,
  checkFavorite,
};