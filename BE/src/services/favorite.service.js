const Favorite = require("../models/favorite.model");
const mongoose = require("mongoose");

/**
 * ❤️ Toggle yêu thích (Sửa lỗi "is not a function")
 * Kết hợp logic add/remove vào 1 hàm để Controller gọi được
 */
const toggleFavorite = async (userId, roomId) => {
  // Kiểm tra xem đã tồn tại yêu thích chưa
  const existing = await Favorite.findOne({ userId, roomId });

  if (existing) {
    // Nếu có rồi thì Xóa (Unlike)
    await Favorite.deleteOne({ _id: existing._id });
    return { favorited: false };
  } else {
    // Nếu chưa có thì Thêm mới (Like) sử dụng logic upsert của bạn
    await Favorite.findOneAndUpdate(
      { userId, roomId },
      { userId, roomId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return { favorited: true };
  }
};

// 3. Kiểm tra trạng thái yêu thích
const checkFavorite = async (userId, roomId) => {
  const exists = await Favorite.exists({ userId, roomId });
  return { favorited: !!exists };
};

// 4. Lấy danh sách phòng yêu thích (Thay thế JOIN)
const getMyFavorites = async (userId) => {
  const favorites = await Favorite.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "roomId",
      populate: {
        path: "landlordId", 
        select: "fullName phone email"
      }
    })
    .lean();

  const data = favorites
    .filter(f => f.roomId) 
    .map(f => {
      const room = f.roomId;
      const landlord = room.landlordId || {};
      
      return {
        ...room,
        landlordName: landlord.fullName || "N/A",
        landlordPhone: landlord.phone || "N/A",
        addedAt: f.createdAt 
      };
    });
    
  return { data };
};

// QUAN TRỌNG: Tên ở đây phải khớp 100% với Controller
module.exports = {
  toggleFavorite, 
  checkFavorite,
  getMyFavorites, // Đổi tên từ getFavoriteRooms thành getMyFavorites để khớp Controller
};