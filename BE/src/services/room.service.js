const roomModel = require("../models/room.model");
const landlordModel = require("../models/landlord.model");

const getAllRooms = async (query = {}) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const keyword = query.keyword ? query.keyword.trim() : "";
  const status = query.status ? query.status.trim() : "";
  const city = query.city ? query.city.trim() : "";
  const district = query.district ? query.district.trim() : "";
  const type = query.type ? query.type.trim() : "";
  const minPrice = query.minPrice ?? "";
  const maxPrice = query.maxPrice ?? "";
  const landlordId = query.landlordId ?? "";

  if (page < 1 || limit < 1) {
    throw new Error("page hoặc limit không hợp lệ");
  }

  if (minPrice !== "" && Number(minPrice) < 0) {
    throw new Error("minPrice không hợp lệ");
  }

  if (maxPrice !== "" && Number(maxPrice) < 0) {
    throw new Error("maxPrice không hợp lệ");
  }

  return await roomModel.getAllRooms({
    page,
    limit,
    keyword,
    status,
    city,
    district,
    type,
    minPrice,
    maxPrice,
    landlordId,
  });
};

const getRoomById = async (id) => {
  const room = await roomModel.findRoomById(id);

  if (!room) {
    throw new Error("Không tìm thấy phòng");
  }

  return room;
};

const createRoom = async (data) => {
  const { title, price, area, address, landlordId } = data;

  if (!title || !price || !area || !address || !landlordId) {
    throw new Error("Thiếu dữ liệu");
  }

  const landlord = await landlordModel.findLandlordById(landlordId);
  if (!landlord) {
    throw new Error("Chủ trọ không tồn tại");
  }

  return await roomModel.createRoom(data);
};

const updateRoom = async (id, data) => {
  const room = await roomModel.findRoomById(id);

  if (!room) {
    throw new Error("Không tìm thấy phòng");
  }

  if (data.landlordId) {
    const landlord = await landlordModel.findLandlordById(data.landlordId);
    if (!landlord) {
      throw new Error("Chủ trọ không tồn tại");
    }
  }

  return await roomModel.updateRoom(id, data);
};

const deleteRoom = async (id) => {
  const room = await roomModel.findRoomById(id);

  if (!room) {
    throw new Error("Không tìm thấy phòng");
  }

  return await roomModel.deleteRoom(id);
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};