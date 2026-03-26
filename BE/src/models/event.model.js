const pool = require("../config/db");

const findEventById = async (id) => {
  const sql = `
    SELECT e.*, u.fullName as creatorName 
    FROM events e
    JOIN users u ON e.createdBy = u.id
    WHERE e.id = ?
  `;
  const [rows] = await pool.execute(sql, [id]);
  return rows[0];
};

const getAllEvents = async () => {
  const sql = "SELECT * FROM events ORDER BY startDate DESC";
  const [rows] = await pool.execute(sql);
  return rows;
};

const createEvent = async (data) => {
  const { title, description, image, startDate, endDate, location, status, createdBy } = data;
  const sql = `
    INSERT INTO events (title, description, image, startDate, endDate, location, status, createdBy)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(sql, [
    title, description, image, startDate, endDate, location, status || 'sắp diễn ra', createdBy
  ]);
  return await findEventById(result.insertId);
};

const updateEvent = async (id, data) => {
  const sql = `
    UPDATE events 
    SET title=?, description=?, image=?, startDate=?, endDate=?, location=?, status=?
    WHERE id=?
  `;
  await pool.execute(sql, [
    data.title, data.description, data.image, data.startDate, data.endDate, data.location, data.status, id
  ]);
  return await findEventById(id);
};

const deleteEvent = async (id) => {
  return await pool.execute("DELETE FROM events WHERE id = ?", [id]);
};

module.exports = { findEventById, getAllEvents, createEvent, updateEvent, deleteEvent };