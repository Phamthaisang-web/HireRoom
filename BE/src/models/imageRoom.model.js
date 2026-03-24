const pool = require("../config/db");

const findImageRoomById = async (id) => {
  const sql = `
    SELECT id, roomId, imageUrl, createdAt
    FROM image_rooms
    WHERE id = ?
  `;
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};

const getAllImageRooms = async ({ page = 1, limit = 10, roomId = "" }) => {
  const offset = (page - 1) * limit;

  let sql = `
    SELECT ir.id, ir.roomId, ir.imageUrl, ir.createdAt, r.title AS roomTitle
    FROM image_rooms ir
    JOIN rooms r ON ir.roomId = r.id
    WHERE 1 = 1
  `;

  let countSql = `
    SELECT COUNT(*) AS total
    FROM image_rooms
    WHERE 1 = 1
  `;

  const params = [];
  const countParams = [];

  if (roomId) {
    sql += ` AND ir.roomId = ?`;
    countSql += ` AND roomId = ?`;
    params.push(Number(roomId));
    countParams.push(Number(roomId));
  }

  sql += ` ORDER BY ir.id DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));

  const [rows] = await pool.execute(sql, params);
  const [countRows] = await pool.execute(countSql, countParams);

  const totalItems = countRows[0].total;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    imageRooms: rows,
    pagination: {
      currentPage: Number(page),
      limit: Number(limit),
      totalItems,
      totalPages,
    },
    filters: {
      roomId,
    },
  };
};

const createImageRoom = async (data) => {
  const { roomId, imageUrl } = data;

  const sql = `
    INSERT INTO image_rooms (roomId, imageUrl)
    VALUES (?, ?)
  `;

  const [result] = await pool.execute(sql, [roomId, imageUrl]);
  return await findImageRoomById(result.insertId);
};

const updateImageRoom = async (id, data) => {
  const oldImageRoom = await findImageRoomById(id);
  if (!oldImageRoom) return null;

  const roomId = data.roomId ?? oldImageRoom.roomId;
  const imageUrl = data.imageUrl ?? oldImageRoom.imageUrl;

  const sql = `
    UPDATE image_rooms
    SET roomId = ?, imageUrl = ?
    WHERE id = ?
  `;

  await pool.execute(sql, [roomId, imageUrl, id]);
  return await findImageRoomById(id);
};

const deleteImageRoom = async (id) => {
  const sql = `DELETE FROM image_rooms WHERE id = ?`;
  const [result] = await pool.execute(sql, [id]);
  return result;
};

module.exports = {
  findImageRoomById,
  getAllImageRooms,
  createImageRoom,
  updateImageRoom,
  deleteImageRoom,
};