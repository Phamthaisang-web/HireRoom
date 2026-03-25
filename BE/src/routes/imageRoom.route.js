const imageRoomController = require("../controllers/imageRoom.controller");
const validateSchemaYup = require("../middlewares/validateSchemaYup");
const imageRoomValidation= require("../validations/imageRoom.validation");
const express = require("express");
const router = express.Router();

router.get("/", imageRoomController.getAllImageRooms);
router.get("/:id", imageRoomController.getImageRoomById);
router.post("/",validateSchemaYup(imageRoomValidation.createImageRoomSchema), imageRoomController.createImageRoom);
router.put("/:id",validateSchemaYup(imageRoomValidation.updateImageRoomSchema), imageRoomController.updateImageRoom);
router.delete("/:id", imageRoomController.deleteImageRoom);

module.exports = router;