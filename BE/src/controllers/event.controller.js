const eventService = require("../services/event.service");

const getAllEvents = async (req, res) => {
  try {
    const data = await eventService.getAllEvents();
    res.status(200).json({ status: 200, data });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const createEvent = async (req, res) => {
  try {
    // createdBy lấy từ Token (authMiddleware)
    const eventData = { ...req.body, createdBy: req.user.id };
    const data = await eventService.createEvent(eventData);
    res.status(201).json({ message: "Tạo sự kiện thành công", data });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await eventService.deleteEvent(req.params.id);
    res.status(200).json({ message: "Xóa sự kiện thành công" });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = { getAllEvents, createEvent, deleteEvent };