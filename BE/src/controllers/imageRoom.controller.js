const imageRoomService = require("../services/imageRoom.service");

const getAllImageRooms = async (req, res) => {
  try {
    const result = await imageRoomService.getAllImageRooms(req.query);
    res.status(200).json({
      message: "Lấy danh sách ảnh phòng thành công",
      status: 200,
      ...result,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

const getImageRoomById = async (req, res) => {
  try {
    const id = req.params.id;
    const imageRoom = await imageRoomService.getImageRoomById(id);
    res.status(200).json({
      message: "Tìm thấy ảnh phòng",
      status: 200,
      imageRoomData: imageRoom,
    });
  } catch (e) {
    res.status(404).json({
      error: e.message,
    });
  }
};

const createImageRoom = async (req, res) => {
  try {
    const data = req.body;
    const newImageRoom = await imageRoomService.createImageRoom(data);
    res.status(201).json({
      message: "Thêm ảnh phòng thành công",
      status: 201,
      imageRoomData: newImageRoom,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

const updateImageRoom = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedImageRoom = await imageRoomService.updateImageRoom(id, data);
    res.status(200).json({
      message: "Cập nhật ảnh phòng thành công",
      status: 200,
      imageRoomData: updatedImageRoom,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

const deleteImageRoom = async (req, res) => {
  try {
    const id = req.params.id;
    await imageRoomService.deleteImageRoom(id);
    res.status(200).json({
      message: "Xóa ảnh phòng thành công",
      status: 200,
    });
  } catch (e) {
    res.status(404).json({
      error: e.message,
    });
  }
};

module.exports = {
  getAllImageRooms,
  getImageRoomById,
  createImageRoom,
  updateImageRoom,
  deleteImageRoom,
};