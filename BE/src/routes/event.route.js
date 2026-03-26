const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkAdminMiddleware = require("../middlewares/checkAdmin.middleware");

router.get("/", eventController.getAllEvents);
router.post("/", authMiddleware, checkAdminMiddleware, eventController.createEvent);
router.delete("/:id", authMiddleware, checkAdminMiddleware, eventController.deleteEvent);

module.exports = router;