const pool = require("../config/db");
const bcrypt = require("bcrypt");

const findUserByPhone = async (phone) => {
  const sql = "SELECT * FROM Users WHERE phone = ?";
  const [rows] = await pool.execute(sql, [phone]);
  return rows[0];
};

const findUserById = async (id) => {
  const sql = `
    SELECT id, fullName, phone, role, createdAt, updatedAt
    FROM Users
    WHERE id = ?
  `;
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};

const createUser = async (data) => {
  const { fullName, phone, password, role } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO Users (fullName, phone, password, role)
    VALUES (?, ?, ?, ?)
  `;

  const [result] = await pool.execute(sql, [
    fullName,
    phone,
    hashedPassword,
    role || "user",
  ]);

  return await findUserById(result.insertId);
};

module.exports = {
  findUserByPhone,
  findUserById,
  createUser,
};