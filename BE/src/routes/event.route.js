const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkAdminMiddleware = require("../middlewares/checkAdmin.middleware");
const validateSchemaYup = require("../middlewares/validateSchemaYup");
const eventValidation = require("../validations/event.validation");


router.get("/", eventController.getAllEvents);


router.post(
  "/", 
  authMiddleware, 
  checkAdminMiddleware, 
  validateSchemaYup(eventValidation.createEventSchema),
  eventController.createEvent
);


router.delete("/:id", authMiddleware, checkAdminMiddleware, eventController.deleteEvent);

module.exports = router;