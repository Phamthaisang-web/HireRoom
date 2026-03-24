const landlordModel = require("../models/landlord.model");


const getAllLandlords = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const keyword = query.keyword ? query.keyword.trim() : "";
  const status = query.status ? query.status.trim() : "";

  if (page < 1 || limit < 1) {
    throw new Error("page hoặc limit không hợp lệ");
  }

  const result = await landlordModel.getAllLandlords({
    page,
    limit,
    keyword,
    status,
  });

  return result;
};
const getLandlordById = async (id) => {
  const landlord = await landlordModel.findLandlordById(id);

  if (!landlord) {
    throw new Error("Không tìm thấy chủ trọ");
  }

  return landlord;
};

const createLandlord = async (data) => {
  const { fullName, phone } = data;

  if (!fullName || !phone) {
    throw new Error("Thiếu dữ liệu");
  }

  const existingLandlord = await landlordModel.findLandlordByPhone(phone);

  if (existingLandlord) {
    throw new Error("Số điện thoại đã tồn tại");
  }

  return await landlordModel.createLandlord(data);
};

const updateLandlord = async (id, data) => {
  const landlord = await landlordModel.findLandlordById(id);

  if (!landlord) {
    throw new Error("Không tìm thấy chủ trọ");
  }

  if (data.phone) {
    const existingLandlord = await landlordModel.findLandlordByPhone(data.phone);

    if (existingLandlord && existingLandlord.id !== Number(id)) {
      throw new Error("Số điện thoại đã tồn tại");
    }
  }

  return await landlordModel.updateLandlord(id, data);
};

const deleteLandlord = async (id) => {
  const landlord = await landlordModel.findLandlordById(id);

  if (!landlord) {
    throw new Error("Không tìm thấy chủ trọ");
  }

  return await landlordModel.deleteLandlord(id);
};

module.exports = {
  getAllLandlords,
  getLandlordById,
  createLandlord,
  updateLandlord,
  deleteLandlord,
};