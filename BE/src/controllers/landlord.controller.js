const landlordService = require("../services/landlord.service");

const getAllLandlords = async (req, res) => {
  try {
    const landlords = await landlordService.getAllLandlords(req.query);
    res.status(200).json({
      message: "Lấy danh sách chủ trọ thành công",
      status: 200,
      landlordData: landlords,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

const getLandlordById = async (req, res) => {
  try {
    const id = req.params.id;
    const landlord = await landlordService.getLandlordById(id);
    res.status(200).json({
      message: "Tìm thấy chủ trọ",
      status: 200,
      landlordData: landlord,
    });
  } catch (e) {
    res.status(404).json({
      error: e.message,
    });
  }
};

const createLandlord = async (req, res) => {
  try {
    const data = req.body;
    const newLandlord = await landlordService.createLandlord(data);
    res.status(201).json({
      message: "Thêm chủ trọ thành công",
      status: 201,
      landlordData: newLandlord,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

const updateLandlord = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const updatedLandlord = await landlordService.updateLandlord(id, data);
    res.status(200).json({
      message: "Cập nhật chủ trọ thành công",
      status: 200,
      landlordData: updatedLandlord,
    });
  } catch (e) {
    res.status(400).json({
      error: e.message,
    });
  }
};

const deleteLandlord = async (req, res) => {
  try {
    const id = req.params.id;
    await landlordService.deleteLandlord(id);
    res.status(200).json({
      message: "Xóa chủ trọ thành công",
      status: 200,
    });
  } catch (e) {
    res.status(404).json({
      error: e.message,
    });
  }
};

module.exports = {
  getAllLandlords,
  getLandlordById,
  createLandlord,
  updateLandlord,
  deleteLandlord,
};