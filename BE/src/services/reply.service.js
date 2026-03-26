const replyModel = require("../models/reply.model");
const reviewModel = require("../models/review.model");

const createReply = async (data) => {
  if (!data.reviewId || !data.replyContent) {
    throw new Error("Thiếu ID đánh giá hoặc nội dung phản hồi");
  }

  // Kiểm tra xem đánh giá có tồn tại không
  const review = await reviewModel.findReviewById(data.reviewId);
  if (!review) {
    throw new Error("Không tìm thấy đánh giá để phản hồi");
  }

  return await replyModel.createReply(data);
};

const getRepliesByReview = async (reviewId) => {
  return await replyModel.getRepliesByReviewId(reviewId);
};

module.exports = { createReply, getRepliesByReview };