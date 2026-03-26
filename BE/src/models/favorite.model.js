const pool = require("../config/db");

// thêm vào yêu thích
const addFavorite = async (userId, roomId) => {
  const sql = `
    INSERT INTO favorites (userId, roomId)
    VALUES (?, ?)
  `;
  await pool.execute(sql, [userId, roomId]);
};

// xoá yêu thích
const removeFavorite = async (userId, roomId) => {
  const sql = `
    DELETE FROM favorites
    WHERE userId = ? AND roomId = ?
  `;
  await pool.execute(sql, [userId, roomId]);
};

// check đã favorite chưa
const checkFavorite = async (userId, roomId) => {
  const sql = `
    SELECT * FROM favorites
    WHERE userId = ? AND roomId = ?
  `;
  const [rows] = await pool.execute(sql, [userId, roomId]);
  return rows.length > 0;
};

// lấy danh sách phòng yêu thích
const getFavoriteRooms = async (userId) => {
  const sql = `
    SELECT 
      r.*,
      l.fullName AS landlordName,
      l.phone AS landlordPhone
    FROM favorites f
    JOIN rooms r ON f.roomId = r.id
    JOIN landlords l ON r.landlordId = l.id
    WHERE f.userId = ?
    ORDER BY f.createdAt DESC
  `;
  const [rows] = await pool.execute(sql, [userId]);
  return rows;
};

module.exports = {
  addFavorite,
  removeFavorite,
  checkFavorite,
  getFavoriteRooms,
};