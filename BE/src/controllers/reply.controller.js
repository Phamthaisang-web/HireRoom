const replyService = require("../services/reply.service");

const createReply = async (req, res) => {
  try {
    const replyData = {
      ...req.body,
      staffId: req.user.id // Lấy ID nhân viên từ Token (checkToken middleware)
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

module.exports = { createReply };