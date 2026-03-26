const eventModel = require("../models/event.model");

const getAllEvents = async () => {
  return await eventModel.getAllEvents();
};

const getEventDetail = async (id) => {
  const event = await eventModel.findEventById(id);
  if (!event) throw new Error("Sự kiện không tồn tại");
  return event;
};

const createEvent = async (data) => {
  if (!data.title || !data.startDate) throw new Error("Tiêu đề và ngày bắt đầu là bắt buộc");
  return await eventModel.createEvent(data);
};

const deleteEvent = async (id) => {
  const event = await eventModel.findEventById(id);
  if (!event) throw new Error("Sự kiện không tồn tại");
  return await eventModel.deleteEvent(id);
};

module.exports = { getAllEvents, getEventDetail, createEvent, deleteEvent };