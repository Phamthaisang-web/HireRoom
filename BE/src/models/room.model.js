const pool = require("../config/db");

const findRoomById = async (id) => {
  const sql = `
    SELECT 
      r.id,
      r.title,
      r.description,
      r.price,
      r.area,
      r.address,
      r.city,
      r.district,
      r.ward,
      r.latitude,
      r.longitude,
      r.status,
      r.type,
      r.electricPrice,
      r.waterPrice,
      r.internetPrice,
      r.maxPeople,
      r.furniture,
      r.landlordId,
      r.createdAt,
      r.updatedAt,
      l.fullName AS landlordName,
      l.phone AS landlordPhone
    FROM rooms r
    JOIN landlords l ON r.landlordId = l.id
    WHERE r.id = ?
  `;
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};
const getAllRooms = async ({
  page = 1,
  limit = 10,
  keyword = "",
  status = "",
  city = "",
  district = "",
  ward = "", // Thêm lọc phường/xã
  type = "",
  minPrice = "",
  maxPrice = "",
  landlordId = "",
}) => {
  const offset = (page - 1) * limit;
  const params = [];
  
  // Base query cho dữ liệu và đếm
  let whereClause = " WHERE 1 = 1";

  // Lọc theo từ khóa (Tiêu đề, Địa chỉ cụ thể, Mô tả)
  if (keyword) {
    whereClause += ` AND (r.title LIKE ? OR r.address LIKE ? OR r.description LIKE ?)`;
    const searchVal = `%${keyword}%`;
    params.push(searchVal, searchVal, searchVal);
  }

  // Lọc theo Địa giới hành chính (City -> District -> Ward)
  if (city) {
    whereClause += ` AND r.city = ?`;
    params.push(city);
  }
  if (district) {
    whereClause += ` AND r.district = ?`;
    params.push(district);
  }
  if (ward) {
    whereClause += ` AND r.ward = ?`;
    params.push(ward);
  }

  // Lọc theo trạng thái và loại phòng
  if (status) {
    whereClause += ` AND r.status = ?`;
    params.push(status);
  }
  if (type) {
    whereClause += ` AND r.type = ?`;
    params.push(type);
  }

  // Lọc theo khoảng giá
  if (minPrice !== "") {
    whereClause += ` AND r.price >= ?`;
    params.push(Number(minPrice));
  }
  if (maxPrice !== "") {
    whereClause += ` AND r.price <= ?`;
    params.push(Number(maxPrice));
  }

  // Lọc theo chủ nhà
  if (landlordId) {
    whereClause += ` AND r.landlordId = ?`;
    params.push(Number(landlordId));
  }

  // SQL chính lấy dữ liệu
  const sql = `
    SELECT r.*, l.fullName AS landlordName, l.phone AS landlordPhone
    FROM rooms r
    JOIN landlords l ON r.landlordId = l.id
    ${whereClause}
    ORDER BY r.id DESC
    LIMIT ? OFFSET ?
  `;

  // SQL đếm tổng số bản ghi (Dùng chung whereClause và params nhưng không có LIMIT/OFFSET)
  const countSql = `
    SELECT COUNT(*) AS total
    FROM rooms r
    JOIN landlords l ON r.landlordId = l.id
    ${whereClause}
  `;

  // Thực thi truy vấn
  const [rows] = await pool.execute(sql, [...params, Number(limit), Number(offset)]);
  const [countRows] = await pool.execute(countSql, params);

  const totalItems = countRows[0].total;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    rooms: rows,
    pagination: {
      currentPage: Number(page),
      limit: Number(limit),
      totalItems,
      totalPages,
    },
    filters: { keyword, status, city, district, ward, type, minPrice, maxPrice, landlordId },
  };
};

const createRoom = async (data) => {
  const {
    title,
    description,
    price,
    area,
    address,
    city,
    district,
    ward,
    latitude,
    longitude,
    status,
    type,
    electricPrice,
    waterPrice,
    internetPrice,
    maxPeople,
    furniture,
    landlordId,
  } = data;

  const sql = `
    INSERT INTO rooms (
      title, description, price, area, address, city, district, ward,
      latitude, longitude, status, type, electricPrice, waterPrice,
      internetPrice, maxPeople, furniture, landlordId
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.execute(sql, [
    title,
    description || null,
    price,
    area,
    address,
    city || null,
    district || null,
    ward || null,
    latitude || null,
    longitude || null,
    status || "còn trống",
    type || null,
    electricPrice || null,
    waterPrice || null,
    internetPrice || null,
    maxPeople || null,
    furniture || null,
    landlordId,
  ]);

  return await findRoomById(result.insertId);
};

const updateRoom = async (id, data) => {
  const oldRoom = await findRoomById(id);
  if (!oldRoom) return null;

  const title = data.title ?? oldRoom.title;
  const description = data.description ?? oldRoom.description;
  const price = data.price ?? oldRoom.price;
  const area = data.area ?? oldRoom.area;
  const address = data.address ?? oldRoom.address;
  const city = data.city ?? oldRoom.city;
  const district = data.district ?? oldRoom.district;
  const ward = data.ward ?? oldRoom.ward;
  const latitude = data.latitude ?? oldRoom.latitude;
  const longitude = data.longitude ?? oldRoom.longitude;
  const status = data.status ?? oldRoom.status;
  const type = data.type ?? oldRoom.type;
  const electricPrice = data.electricPrice ?? oldRoom.electricPrice;
  const waterPrice = data.waterPrice ?? oldRoom.waterPrice;
  const internetPrice = data.internetPrice ?? oldRoom.internetPrice;
  const maxPeople = data.maxPeople ?? oldRoom.maxPeople;
  const furniture = data.furniture ?? oldRoom.furniture;
  const landlordId = data.landlordId ?? oldRoom.landlordId;

  const sql = `
    UPDATE rooms
    SET
      title = ?,
      description = ?,
      price = ?,
      area = ?,
      address = ?,
      city = ?,
      district = ?,
      ward = ?,
      latitude = ?,
      longitude = ?,
      status = ?,
      type = ?,
      electricPrice = ?,
      waterPrice = ?,
      internetPrice = ?,
      maxPeople = ?,
      furniture = ?,
      landlordId = ?
    WHERE id = ?
  `;

  await pool.execute(sql, [
    title,
    description,
    price,
    area,
    address,
    city,
    district,
    ward,
    latitude,
    longitude,
    status,
    type,
    electricPrice,
    waterPrice,
    internetPrice,
    maxPeople,
    furniture,
    landlordId,
    id,
  ]);

  return await findRoomById(id);
};

const deleteRoom = async (id) => {
  const sql = `DELETE FROM rooms WHERE id = ?`;
  const [result] = await pool.execute(sql, [id]);
  return result;
};

module.exports = {
  findRoomById,
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
};