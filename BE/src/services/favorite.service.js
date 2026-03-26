const favoriteModel = require("../models/favorite.model");
const roomModel = require("../models/room.model");

// toggle
const toggleFavorite = async (userId, roomId) => {
  if (!userId || !roomId) {
    throw new Error("Thiếu userId hoặc roomId");
  }

  const room = await roomModel.findRoomById(roomId);
  if (!room) {
    throw new Error("Phòng không tồn tại");
  }

  const isExist = await favoriteModel.checkFavorite(userId, roomId);

  if (isExist) {
    await favoriteModel.removeFavorite(userId, roomId);
    return { favorited: false };
  }

  try {
    await favoriteModel.addFavorite(userId, roomId);
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return { favorited: true };
    }
    throw err;
  }

  return { favorited: true };
};

// list của tôi
const getMyFavorites = async (userId) => {
  if (!userId) throw new Error("Chưa đăng nhập");

  const rooms = await favoriteModel.getFavoriteRooms(userId);

  return {
    total: rooms.length,
    rooms,
  };
};

// check 1 phòng
const checkFavorite = async (userId, roomId) => {
  const isFavorite = await favoriteModel.checkFavorite(userId, roomId);
  return { isFavorite };
};

module.exports = {
  toggleFavorite,
  getMyFavorites,
  checkFavorite,
};