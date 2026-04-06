const favoriteService = require("../services/favorite.service");

// ❤️ toggle (like / unlike)
const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy từ middleware auth
    const { roomId } = req.body;

    // Kiểm tra đầu vào
    if (!roomId) {
      return res.status(400).json({
        message: "Thiếu roomId trong body yêu cầu",
        status: 400,
      });
    }

    const result = await favoriteService.toggleFavorite(userId, roomId);

    return res.status(200).json({
      status: 200,
      favorited: result.favorited,
      message: result.favorited ? "Đã thêm vào yêu thích" : "Đã bỏ yêu thích",
      ...result,
    });
  } catch (e) {
    console.error("Error in toggleFavorite:", e.message);
    return res.status(400).json({
      status: 400,
      error: e.message,
    });
  }
};

// 📌 Lấy danh sách yêu thích của tôi
const getMyFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await favoriteService.getMyFavorites(userId);

    return res.status(200).json({
      status: 200,
      message: "Lấy danh sách yêu thích thành công",
      ...data,
    });
  } catch (e) {
    console.error("Error in getMyFavorites:", e.message);
    return res.status(400).json({
      status: 400,
      error: e.message,
    });
  }
};

// 🔍 Kiểm tra xem phòng này đã được thích chưa
const checkFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const roomId = req.params.roomId;

    if (!roomId) {
      return res.status(400).json({ message: "Thiếu roomId trên URL", status: 400 });
    }

    const result = await favoriteService.checkFavorite(userId, roomId);

    return res.status(200).json({
      status: 200,
      message: "Kiểm tra trạng thái yêu thích thành công",
      ...result,
    });
  } catch (e) {
    console.error("Error in checkFavorite:", e.message);
    return res.status(400).json({
      status: 400,
      error: e.message,
    });
  }
};

module.exports = {
  toggleFavorite,
  getMyFavorites,
  checkFavorite,
};