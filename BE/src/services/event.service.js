const Event = require("../models/event.model");

/**
 * Tìm sự kiện theo ID và lấy thêm thông tin người tạo (JOIN tương đương MySQL)
 */
const findEventById = async (id) => {
  // populate("createdBy", "fullName") tương đương với JOIN users u ON e.createdBy = u.id
  const event = await Event.findById(id).populate("createdBy", "fullName");
  return event;
};

/**
 * Lấy tất cả sự kiện, sắp xếp theo ngày bắt đầu giảm dần
 */
const getAllEvents = async () => {
  return await Event.find().sort({ startDate: -1 });
};

/**
 * Tạo sự kiện mới
 */
const createEvent = async (data) => {
  // MongoDB sẽ tự động tạo _id (ObjectId)
  const newEvent = await Event.create(data);
  
  // Sau khi tạo, lấy lại thông tin kèm populate người tạo
  return await findEventById(newEvent._id);
};

/**
 * Cập nhật sự kiện
 */
const updateEvent = async (id, data) => {
  // { new: true } để trả về dữ liệu sau khi đã update
  const updatedEvent = await Event.findByIdAndUpdate(
    id, 
    { $set: data }, 
    { new: true, runValidators: true }
  );

  if (!updatedEvent) throw new Error("Không tìm thấy sự kiện để cập nhật");
  
  return await findEventById(id);
};

/**
 * Xóa sự kiện
 */
const deleteEvent = async (id) => {
  const result = await Event.findByIdAndDelete(id);
  if (!result) throw new Error("Không tìm thấy sự kiện để xóa");
  return result;
};

module.exports = { 
  findEventById, 
  getAllEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent 
};