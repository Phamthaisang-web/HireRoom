const landlordModel = require("../models/landlord.model");

// 1. Lấy tất cả chủ trọ (Phân trang + Tìm kiếm)
const getAllLandlords = async (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const skip = (page - 1) * limit;

  const keyword = query.keyword ? query.keyword.trim() : "";
  const status = query.status ? query.status.trim() : "";

  // Xây dựng bộ lọc cho Mongoose
  let filter = {};
  if (keyword) {
    filter.$or = [
      { fullName: { $regex: keyword, $options: "i" } },
      { phone: { $regex: keyword, $options: "i" } }
    ];
  }
  if (status) {
    filter.status = status;
  }

  // Thực thi lấy dữ liệu và đếm tổng số bản ghi
  const [landlords, totalItems] = await Promise.all([
    landlordModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    landlordModel.countDocuments(filter)
  ]);

  return {
    landlords,
    pagination: {
      currentPage: page,
      limit: limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
    filters: { keyword, status }
  };
};

// 2. Lấy chi tiết chủ trọ theo ID
const getLandlordById = async (id) => {
  const landlord = await landlordModel.findById(id);
  if (!landlord) {
    throw new Error("Không tìm thấy chủ trọ");
  }
  return landlord;
};

// 3. Tạo mới chủ trọ
const createLandlord = async (data) => {
  const { fullName, phone } = data;

  if (!fullName || !phone) {
    throw new Error("Họ tên và số điện thoại là bắt buộc");
  }

  // Kiểm tra trùng số điện thoại
  const existingLandlord = await landlordModel.findOne({ phone });
  if (existingLandlord) {
    throw new Error("Số điện thoại này đã được đăng ký");
  }

  return await landlordModel.create(data);
};

// 4. Cập nhật chủ trọ
const updateLandlord = async (id, data) => {
  // Kiểm tra tồn tại
  const landlord = await landlordModel.findById(id);
  if (!landlord) {
    throw new Error("Không tìm thấy chủ trọ để cập nhật");
  }

  // Nếu cập nhật số điện thoại, kiểm tra xem có trùng với người khác không
  if (data.phone) {
    const existingLandlord = await landlordModel.findOne({ 
      phone: data.phone, 
      _id: { $ne: id } // Tìm người có số này nhưng không phải là chính nó
    });
    if (existingLandlord) {
      throw new Error("Số điện thoại mới đã tồn tại trong hệ thống");
    }
  }

  return await landlordModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

// 5. Xóa chủ trọ
const deleteLandlord = async (id) => {
  const landlord = await landlordModel.findById(id);
  if (!landlord) {
    throw new Error("Không tìm thấy chủ trọ để xóa");
  }
  return await landlordModel.findByIdAndDelete(id);
};

module.exports = {
  getAllLandlords,
  getLandlordById,
  createLandlord,
  updateLandlord,
  deleteLandlord,
};