const pool = require("../config/db");

const createMessage = async ({ conversationId, senderId, senderType, receiverId, receiverType, messageText }) => {
  const sql = `
    INSERT INTO messages (conversationId, senderId, senderType, receiverId, receiverType, messageText)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(sql, [conversationId, senderId, senderType, receiverId, receiverType, messageText]);

  // Lấy message vừa tạo
  const [rows] = await pool.execute(`SELECT * FROM messages WHERE id = ?`, [result.insertId]);
  return rows[0];
};

module.exports = {
  createMessage,
};