const express = require("express");
const router = express.Router();
const pool = require("../config/db");


router.post("/conversation", async (req, res) => {
  const { userId, staffId } = req.body;

 
  const [exist] = await pool.execute(
    `SELECT * FROM conversations WHERE userId = ? AND staffId = ? LIMIT 1`,
    [userId, staffId]
  );

  if (exist.length > 0) {
    return res.json(exist[0]); 
  }

  const [result] = await pool.execute(
    `INSERT INTO conversations (userId, staffId) VALUES (?, ?)`,
    [userId, staffId]
  );

  const [rows] = await pool.execute(
    `SELECT * FROM conversations WHERE id = ?`,
    [result.insertId]
  );

  res.json(rows[0]);
});

router.get("/messages/:conversationId", async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const [rows] = await pool.execute(`SELECT * FROM messages WHERE conversationId = ? ORDER BY createdAt ASC`, [conversationId]);
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/admin/conversations/:adminId", async (req, res) => {
  try {
    const adminId = req.params.adminId;

    const [rows] = await pool.execute(`
      SELECT 
        c.id AS conversationId,
        u.id AS userId,
        u.fullName,
        u.phone
      FROM conversations c
      JOIN users u ON c.userId = u.id
      WHERE c.staffId = ?
      ORDER BY c.updatedAt DESC
    `, [adminId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;