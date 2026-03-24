const pool = require("../config/db");

const findLandlordById = async (id) => {
  const sql = `
    SELECT id, fullName, phone, zalo, facebook, note, status, createdAt, updatedAt
    FROM landlords
    WHERE id = ?
  `;
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};

const findLandlordByPhone = async (phone) => {
  const sql = `
    SELECT id, fullName, phone, zalo, facebook, note, status, createdAt, updatedAt
    FROM landlords
    WHERE phone = ?
  `;
  const [rows] = await pool.execute(sql, [phone]);
  return rows[0];
};
const getAllLandlords = async ({ page = 1, limit = 10, keyword = "", status = "" }) => {
  const offset = (page - 1) * limit;

  let sql = `
    SELECT id, fullName, phone, zalo, facebook, note, status, createdAt, updatedAt
    FROM landlords
    WHERE 1 = 1
  `;

  let countSql = `
    SELECT COUNT(*) AS total
    FROM landlords
    WHERE 1 = 1
  `;

  const params = [];
  const countParams = [];

  if (keyword) {
    sql += ` AND (fullName LIKE ? OR phone LIKE ? OR zalo LIKE ?)`;
    countSql += ` AND (fullName LIKE ? OR phone LIKE ? OR zalo LIKE ?)`;

    params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    countParams.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
  }

  if (status) {
    sql += ` AND status = ?`;
    countSql += ` AND status = ?`;

    params.push(status);
    countParams.push(status);
  }

  sql += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  const [rows] = await pool.execute(sql, params);
  const [countRows] = await pool.execute(countSql, countParams);

  const totalItems = countRows[0].total;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    landlords: rows,
    pagination: {
      currentPage: Number(page),
      limit: Number(limit),
      totalItems,
      totalPages,
    },
    filters: {
      keyword,
      status,
    },
  };
};

const createLandlord = async (data) => {
  const { fullName, phone, zalo, facebook, note, status } = data;

  const sql = `
    INSERT INTO landlords (fullName, phone, zalo, facebook, note, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.execute(sql, [
    fullName,
    phone,
    zalo || null,
    facebook || null,
    note || null,
    status || "đang hợp tác",
  ]);

  return await findLandlordById(result.insertId);
};

const updateLandlord = async (id, data) => {
  const { fullName, phone, zalo, facebook, note, status } = data;

  const sql = `
    UPDATE landlords
    SET fullName = ?, phone = ?, zalo = ?, facebook = ?, note = ?, status = ?
    WHERE id = ?
  `;

  await pool.execute(sql, [
    fullName,
    phone,
    zalo || null,
    facebook || null,
    note || null,
    status || "đang hợp tác",
    id,
  ]);

  return await findLandlordById(id);
};

const deleteLandlord = async (id) => {
  const sql = `DELETE FROM landlords WHERE id = ?`;
  const [result] = await pool.execute(sql, [id]);
  return result;
};

module.exports = {
  findLandlordById,
  findLandlordByPhone,
  getAllLandlords,
  createLandlord,
  updateLandlord,
  deleteLandlord,
};