const replyService = require("../services/reply.service");

// CREATE
const createReply = async (req, res) => {
  try {
    const replyData = {
      ...req.body,
      staffId: req.user.id
    };

    const data = await replyService.createReply(replyData);

    res.status(201).json({
      message: "Phản hồi đánh giá thành công",
      status: 201,
      data,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// GET BY REVIEW
const getRepliesByReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const data = await replyService.getRepliesByReviewId(reviewId);

    res.json({
      status: 200,
      data,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// DELETE
const deleteReply = async (req, res) => {
  try {
    const { id } = req.params;
    await replyService.deleteReply(id);

    res.json({
      message: "Xóa reply thành công",
      status: 200,
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = { 
  createReply, 
  getRepliesByReview, 
  deleteReply 
};