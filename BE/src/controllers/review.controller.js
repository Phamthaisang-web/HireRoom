const reviewService = require("../services/review.service");
const createReview = async (req, res) => {
  try {
    // Lấy thông tin từ req.user (do middleware checkToken cung cấp)
    // Lưu ý: Kiểm tra xem lúc sign token bạn đặt tên field là 'fullName' hay 'userName'
    const nameFromToken = req.user.fullName || req.user.userName || "Người dùng ẩn danh";
    const userIdFromToken = req.user.id;

    // Chuẩn bị dữ liệu để gửi sang Service
    const reviewData = {
      ...req.body,           // Lấy roomId, rating, comment từ body
      userName: nameFromToken, // Gán tên lấy từ Token
      userId: userIdFromToken  // Lưu thêm ID để sau này dễ quản lý
    };

    const data = await reviewService.createReview(reviewData);

    res.status(201).json({
      message: "Gửi đánh giá thành công, vui lòng chờ duyệt!",
      status: 201,
      data,
    });
  } catch (e) {
    res.status(400).json({
      message: "Không thể gửi đánh giá",
      error: e.message,
      status: 400,
    });
  }
};

// 🏠 Lấy danh sách đánh giá của một phòng (Dành cho khách xem)
const getRoomReviews = async (req, res) => {
  try {
    const { roomId } = req.params;
    const data = await reviewService.getReviewsByRoom(roomId);

    res.status(200).json({
      message: "Lấy danh sách đánh giá thành công",
      status: 200,
      data,
    });
  } catch (e) {
    res.status(400).json({
      message: "Lỗi khi lấy danh giá",
      error: e.message,
      status: 400,
    });
  }
};

// ✅ Duyệt hoặc từ chối đánh giá (Dành cho Admin)
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'đã duyệt' hoặc 'bị từ chối'

    const data = await reviewService.updateReviewStatus(id, status);

    res.status(200).json({
      message: "Cập nhật trạng thái đánh giá thành công",
      status: 200,
      data,
    });
  } catch (e) {
    res.status(400).json({
      message: "Cập nhật thất bại",
      error: e.message,
      status: 400,
    });
  }
};

// 🗑️ Xóa đánh giá
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    await reviewService.deleteReview(id);

    res.status(200).json({
      message: "Đã xóa đánh giá thành công",
      status: 200,
    });
  } catch (e) {
    res.status(400).json({
      message: "Xóa đánh giá thất bại",
      error: e.message,
      status: 400,
    });
  }
};

module.exports = {
  createReview,
  getRoomReviews,
  updateStatus,
  deleteReview,
};