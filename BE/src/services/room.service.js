const roomModel = require("../models/room.model");
const landlordModel = require("../models/landlord.model");

const getAllRooms = async (query = {}) => {
  // 1. Phân trang
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);

  // 2. Làm sạch dữ liệu lọc (Tránh injection và khoảng trắng thừa)
  const filters = {
    keyword: query.keyword?.trim() || "",
    status: query.status?.trim() || "",
    city: query.city?.trim() || "",
    district: query.district?.trim() || "",
    ward: query.ward?.trim() || "", // THÊM MỚI: Lọc theo Phường/Xã
    type: query.type?.trim() || "",
    landlordId: query.landlordId ? Number(query.landlordId) : "",
    minPrice: query.minPrice !== "" && !isNaN(query.minPrice) ? Number(query.minPrice) : "",
    maxPrice: query.maxPrice !== "" && !isNaN(query.maxPrice) ? Number(query.maxPrice) : "",
  };

  // 3. Validation logic đơn giản
  if (filters.minPrice < 0 || filters.maxPrice < 0) {
    throw new Error("Giá tiền không được là số âm");
  }
  
  if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) {
    throw new Error("Giá tối thiểu không thể lớn hơn giá tối đa");
  }

  // 4. Gọi Model với tham số đã chuẩn hóa
  return await roomModel.getAllRooms({
    page,
    limit,
    ...filters // Spread toán tử để truyền tất cả filters vào Model
  });
};

const getRoomById = async (id) => {
  const room = await roomModel.findRoomById(id);
  if (!room) throw new Error("Không tìm thấy phòng");
  return room;
};

const createRoom = async (data) => {
  const { title, price, area, address, landlordId } = data;

  if (!title || !price || !area || !address || !landlordId) {
    throw new Error("Thiếu dữ liệu bắt buộc để tạo phòng");
  }

  const landlord = await landlordModel.findLandlordById(landlordId);
  if (!landlord) throw new Error("Chủ trọ không tồn tại");

  return await roomModel.createRoom(data);
};

const updateRoom = async (id, data) => {
  const room = await roomModel.findRoomById(id);
  if (!room) throw new Error("Không tìm thấy phòng");

  if (data.landlordId) {
    const landlord = await landlordModel.findLandlordById(data.landlordId);
    if (!landlord) throw new Error("Chủ trọ không tồn tại");
  }

  return await roomModel.updateRoom(id, data);
};

const deleteRoom = async (id) => {
  const room = await roomModel.findRoomById(id);
  if (!room) throw new Error("Không tìm thấy phòng");

  return await roomModel.deleteRoom(id);
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};