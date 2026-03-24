const imageRoomModel = require("../models/imageRoom.model");
const roomModel = require("../models/room.model");

const getAllImageRooms = async (query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const roomId = query.roomId ?? "";

  if (page < 1 || limit < 1) {
    throw new Error("page hoặc limit không hợp lệ");
  }

  return await imageRoomModel.getAllImageRooms({
    page,
    limit,
    roomId,
  });
};

const getImageRoomById = async (id) => {
  const imageRoom = await imageRoomModel.findImageRoomById(id);

  if (!imageRoom) {
    throw new Error("Không tìm thấy ảnh phòng");
  }

  return imageRoom;
};

const createImageRoom = async (data) => {
  const { roomId, imageUrl } = data;

  if (!roomId || !imageUrl) {
    throw new Error("Thiếu dữ liệu");
  }

  const room = await roomModel.findRoomById(roomId);
  if (!room) {
    throw new Error("Phòng không tồn tại");
  }

  return await imageRoomModel.createImageRoom(data);
};

const updateImageRoom = async (id, data) => {
  const imageRoom = await imageRoomModel.findImageRoomById(id);

  if (!imageRoom) {
    throw new Error("Không tìm thấy ảnh phòng");
  }

  if (data.roomId) {
    const room = await roomModel.findRoomById(data.roomId);
    if (!room) {
      throw new Error("Phòng không tồn tại");
    }
  }

  return await imageRoomModel.updateImageRoom(id, data);
};

const deleteImageRoom = async (id) => {
  const imageRoom = await imageRoomModel.findImageRoomById(id);

  if (!imageRoom) {
    throw new Error("Không tìm thấy ảnh phòng");
  }

  return await imageRoomModel.deleteImageRoom(id);
};

module.exports = {
  getAllImageRooms,
  getImageRoomById,
  createImageRoom,
  updateImageRoom,
  deleteImageRoom,
};