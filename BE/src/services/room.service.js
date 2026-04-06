const Room = require("../models/room.model");
const Landlord = require("../models/landlord.model");

/**
 * Lấy danh sách phòng (Lọc tương đối địa chỉ, Phân trang, Tìm kiếm địa lý, Sắp xếp)
 */
const getAllRooms = async (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Number(query.limit) || 10);
  const skip = (page - 1) * limit;

  const filter = {};

  // 1. Lọc theo từ khóa (Keyword)
  if (query.keyword) {
    const search = query.keyword.trim();
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { address: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { furniture: { $regex: search, $options: "i" } }
    ];
  }

  // 2. Lọc địa chỉ (Dùng regex để gõ "Hồ" vẫn ra "Hồ Chí Minh")
  const addressFields = ['city', 'district', 'ward'];
  addressFields.forEach(field => {
    if (query[field]) {
      filter[field] = { $regex: query[field].trim(), $options: "i" };
    }
  });

  // 3. Lọc chính xác các trường danh mục
  const categoryFields = ['status', 'type', 'landlordId'];
  categoryFields.forEach(field => {
    if (query[field]) filter[field] = query[field].trim();
  });

  // 4. Lọc theo khoảng giá thuê và diện tích
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  
  if (query.minArea || query.maxArea) {
    filter.area = {};
    if (query.minArea) filter.area.$gte = Number(query.minArea);
    if (query.maxArea) filter.area.$lte = Number(query.maxArea);
  }

  // 5. Lọc dịch vụ nâng cao
  if (query.maxPeople) filter.maxPeople = { $gte: Number(query.maxPeople) };
  if (query.maxElectric) filter.electricPrice = { $lte: Number(query.maxElectric) };
  if (query.maxWater) filter.waterPrice = { $lte: Number(query.maxWater) };

  // 6. Xử lý tìm kiếm địa lý ($near)
  const isGeoSearch = query.latitude && query.longitude;
  if (isGeoSearch) {
    filter.location = {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(query.longitude), Number(query.latitude)] },
        $maxDistance: (Number(query.radius) || 5) * 1000, // km to meters
      },
    };
  }

  // 7. Logic Sắp xếp
  let sortOption = {};
  if (isGeoSearch) {
    sortOption = {}; // $near tự động sort theo khoảng cách
  } else {
    switch (query.sort) {
      case "price_asc": sortOption = { price: 1 }; break;
      case "price_desc": sortOption = { price: -1 }; break;
      case "area_desc": sortOption = { area: -1 }; break;
      case "oldest": sortOption = { createdAt: 1 }; break;
      default: sortOption = { createdAt: -1 }; // Mới nhất
    }
  }

  const [rooms, totalItems] = await Promise.all([
    Room.find(filter)
      .populate("landlordId", "fullName phone email")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean(), // Tối ưu performance
    Room.countDocuments(filter)
  ]);

  return {
    rooms,
    pagination: {
      currentPage: page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    }
  };
};

/**
 * Tạo phòng mới
 */const createRoom = async (reqData) => {
  const data = { ...reqData }; // Clone data để tránh side-effect

  const landlord = await Landlord.findById(data.landlordId);
  if (!landlord) throw new Error("Chủ trọ không tồn tại");

  // Chỉ chuẩn hóa GeoJSON nếu location chưa có sẵn
  if (!data.location && data.longitude && data.latitude) {
    data.location = {
      type: "Point",
      coordinates: [Number(data.longitude), Number(data.latitude)]
    };
  }

  // Đảm bảo images luôn là mảng object có trường 'url'
  if (data.images && !Array.isArray(data.images)) {
    data.images = [data.images];
  }

  return await Room.create(data);
};
/**
 * Cập nhật phòng
 */
const updateRoom = async (id, data) => {
  const room = await Room.findById(id);
  if (!room) throw new Error("Không tìm thấy phòng để cập nhật");

  if (data.longitude && data.latitude) {
    data.location = {
      type: "Point",
      coordinates: [Number(data.longitude), Number(data.latitude)]
    };
  }

  if (data.images && !Array.isArray(data.images)) {
    data.images = [data.images];
  }

  return await Room.findByIdAndUpdate(id, { $set: data }, { 
    new: true, 
    runValidators: true 
  });
};

const getRoomById = async (id) => {
  const room = await Room.findById(id).populate("landlordId").lean();
  if (!room) throw new Error("Không tìm thấy phòng");
  return room;
};

const deleteRoom = async (id) => {
  const room = await Room.findByIdAndDelete(id);
  if (!room) throw new Error("Không tìm thấy phòng để xóa");
  return room;
};

module.exports = {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};