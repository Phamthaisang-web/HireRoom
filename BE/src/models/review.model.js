const pool = require("../config/db");

/**
 * Tìm một review cụ thể theo ID
 */
const findReviewById = async (id) => {
  const sql = `
    SELECT rev.*, r.title as roomTitle 
    FROM reviews rev
    JOIN rooms r ON rev.roomId = r.id
    WHERE rev.id = ?
  `;
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};

/**
 * Lấy danh sách review của một phòng (Chỉ lấy những review đã được duyệt)
 */
const getReviewsByRoomId = async (roomId) => {
  const sql = `
    SELECT id, userName, rating, comment, createdAt 
    FROM reviews 
    WHERE roomId = ? AND status = 'đã duyệt'
    ORDER BY createdAt DESC
  `;
  const [rows] = await pool.execute(sql, [roomId]);
  return rows;
};

/**
 * Tạo một đánh giá mới (Mặc định trạng thái là 'chờ duyệt')
 */
const createReview = async (data) => {
  const { userName, phone, roomId, rating, comment } = data;

  const sql = `
    INSERT INTO reviews (userName, phone, roomId, rating, comment, status)
    VALUES (?, ?, ?, ?, ?, 'chờ duyệt')
  `;

  const [result] = await pool.execute(sql, [
    userName,
    phone || null,
    roomId,
    rating,
    comment || null,
  ]);

  return await findReviewById(result.insertId);
};

/**
 * Cập nhật trạng thái review (Dành cho Admin: 'đã duyệt', 'vi phạm', v.v.)
 */
const updateReviewStatus = async (id, status) => {
  const sql = `UPDATE reviews SET status = ? WHERE id = ?`;
  await pool.execute(sql, [status, id]);
  return await findReviewById(id);
};

/**
 * Lấy tất cả review (Dành cho trang quản trị Admin)
 */
const getAllReviewsAdmin = async () => {
  const sql = `
    SELECT rev.*, r.title as roomTitle 
    FROM reviews rev
    JOIN rooms r ON rev.roomId = r.id
    ORDER BY rev.createdAt DESC
  `;
  const [rows] = await pool.execute(sql);
  return rows;
};

/**
 * Xóa review
 */
const deleteReview = async (id) => {
  const sql = `DELETE FROM reviews WHERE id = ?`;
  const [result] = await pool.execute(sql, [id]);
  return result;
};

module.exports = {
  findReviewById,
  getReviewsByRoomId,
  createReview,
  updateReviewStatus,
  getAllReviewsAdmin,
  deleteReview,
};