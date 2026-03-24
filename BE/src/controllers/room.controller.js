const roomService = require("../services/room.service");

const getAllRooms = async (req, res) => {
  try {
    const rooms = await roomService.getAllRooms(req.query);
    res.status(200).json({
      message: "Lấy danh sách phòng thành công",
      status: 200,
      ...rooms,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

const getRoomById = async (req, res) => {
  try {
    const id = req.params.id;
    const room = await roomService.getRoomById(id);
    res.status(200).json({
      message: "Tìm thấy phòng",
      status: 200,
      roomData: room,
    });
  } catch (e) {
    res.status(404).json({
      error: e.message,
    });
  }
};

const createRoom = async (req, res) => {
  try {
    const data = req.body;
    const newRoom = await roomService.createRoom(data);
    res.status(201).json({
      message: "Thêm phòng thành công",
      status: 201,
      roomData: newRoom,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

const updateRoom = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedRoom = await roomService.updateRoom(id, data);
    res.status(200).json({
      message: "Cập nhật phòng thành công",
      status: 200,
      roomData: updatedRoom,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const id = req.params.id;
    await roomService.deleteRoom(id);
    res.status(200).json({
      message: "Xóa phòng thành công",
      status: 200,
    });
  } catch (e) {
    res.status(404).json({
      error: e.message,
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