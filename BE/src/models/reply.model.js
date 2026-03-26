const pool = require("../config/db");

const findReplyById = async (id) => {
  const sql = `
    SELECT rr.*, u.fullName as staffName 
    FROM review_replies rr
    JOIN users u ON rr.staffId = u.id
    WHERE rr.id = ?
  `;
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};

const createReply = async (data) => {
  const { reviewId, staffId, replyContent } = data;
  const sql = `INSERT INTO review_replies (reviewId, staffId, replyContent) VALUES (?, ?, ?)`;
  const [result] = await pool.execute(sql, [reviewId, staffId, replyContent]);
  return await findReplyById(result.insertId);
};

const getRepliesByReviewId = async (reviewId) => {
  const sql = `
    SELECT rr.*, u.fullName as staffName 
    FROM review_replies rr
    JOIN users u ON rr.staffId = u.id
    WHERE rr.reviewId = ?
    ORDER BY rr.createdAt ASC
  `;
  const [rows] = await pool.execute(sql, [reviewId]);
  return rows;
};

const deleteReply = async (id) => {
  return await pool.execute("DELETE FROM review_replies WHERE id = ?", [id]);
};

module.exports = { findReplyById, createReply, getRepliesByReviewId, deleteReply };