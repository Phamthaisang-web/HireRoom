const reviewModel = require("../models/review.model");
const roomModel = require("../models/room.model");

const getReviewsByRoom = async (roomId) => {
  if (!roomId) {
    throw new Error("roomId là bắt buộc");
  }

  const room = await roomModel.findRoomById(roomId);
  if (!room) {
    throw new Error("Phòng không tồn tại");
  }

  return await reviewModel.getReviewsByRoomId(roomId);
};


const createReview = async (data) => {
  const { userName, roomId, rating, comment } = data;

 
  if (!userName || !roomId || !rating) {
    throw new Error("Thiếu dữ liệu: userName, roomId và rating là bắt buộc");
  }


  if (Number(rating) < 1 || Number(rating) > 5) {
    throw new Error("Rating phải nằm trong khoảng từ 1 đến 5");
  }


  const room = await roomModel.findRoomById(roomId);
  if (!room) {
    throw new Error("Phòng không tồn tại để đánh giá");
  }


  return await reviewModel.createReview(data);
};

const updateReviewStatus = async (id, status) => {
  const review = await reviewModel.findReviewById(id);
  if (!review) {
    throw new Error("Không tìm thấy đánh giá");
  }

  const allowedStatus = ["chờ duyệt", "đã duyệt", "bị từ chối"];
  if (!allowedStatus.includes(status)) {
    throw new Error("Trạng thái không hợp lệ");
  }

  return await reviewModel.updateReviewStatus(id, status);
};


const deleteReview = async (id) => {
  const review = await reviewModel.findReviewById(id);
  if (!review) {
    throw new Error("Không tìm thấy đánh giá để xóa");
  }

  return await reviewModel.deleteReview(id);
};

module.exports = {
  getReviewsByRoom,
  createReview,
  updateReviewStatus,
  deleteReview,
};