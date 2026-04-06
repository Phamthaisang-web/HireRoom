const roomService = require("../services/room.service");
const mongoose = require("mongoose");

/**
 * Hàm tiện ích kiểm tra ID có đúng định dạng MongoDB (24 ký tự hex) hay không.
 * Giúp chặn lỗi ngay tại Controller trước khi gọi xuống Service/DB.
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Lấy danh sách phòng (Lọc, Phân trang, Tìm kiếm bán kính)
 * GET /api/rooms
 */
const getAllRooms = async (req, res) => {
  try {
    const result = await roomService.getAllRooms(req.query);
    res.status(200).json({
      status: 200,
      message: "Lấy danh sách phòng thành công",
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      error: error.message,
    });
  }
};

/**
 * Lấy chi tiết một phòng
 * GET /api/rooms/:id
 */
const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "ID phòng không đúng định dạng" });
    }

    const room = await roomService.getRoomById(id);
    res.status(200).json({
      status: 200,
      message: "Tìm thấy chi tiết phòng",
      roomData: room,
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      error: error.message,
    });
  }
};

/**
 * Tạo phòng mới
 * POST /api/rooms
 */const createRoom = async (req, res) => {
  try {
    const data = req.body;
    console.log("Dữ liệu nhận được từ Frontend:", data); // Kiểm tra xem 'images' có ở đây không

    if (!data.landlordId || !isValidObjectId(data.landlordId)) {
      return res.status(400).json({ error: "landlordId không hợp lệ." });
    }

    // NỚI LỎNG VALIDATE HOẶC KIỂM TRA KỸ HƠN
    if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
      return res.status(400).json({ message: "Vui lòng tải lên ít nhất một ảnh" });
    }

    const newRoom = await roomService.createRoom(data);
    res.status(201).json({
      status: 201,
      message: "Thêm phòng mới thành công",
      roomData: newRoom,
    });
  } catch (error) {
    res.status(400).json({ status: 400, error: error.message });
  }
};
/**
 * Cập nhật thông tin phòng
 * PUT /api/rooms/:id
 */
const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "ID phòng cần cập nhật không hợp lệ" });
    }

    // Nếu có cập nhật landlordId thì cũng phải check định dạng
    if (data.landlordId && !isValidObjectId(data.landlordId)) {
      return res.status(400).json({ error: "ID chủ trọ mới không hợp lệ" });
    }

    const updatedRoom = await roomService.updateRoom(id, data);
    res.status(200).json({
      status: 200,
      message: "Cập nhật thông tin phòng thành công",
      roomData: updatedRoom,
    });
  } catch (error) {
    res.status(400).json({
      status: 400,
      error: error.message,
    });
  }
};

/**
 * Xóa phòng
 * DELETE /api/rooms/:id
 */
const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "ID phòng cần xóa không hợp lệ" });
    }

    await roomService.deleteRoom(id);
    res.status(200).json({
      status: 200,
      message: "Đã xóa phòng thành công",
    });
  } catch (error) {
    res.status(404).json({
      status: 404,
      error: error.message,
    });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};