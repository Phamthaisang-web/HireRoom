const imageRoomController = require("../controllers/imageRoom.controller");
const express = require("express");
const router = express.Router();

router.get("/", imageRoomController.getAllImageRooms);
router.get("/:id", imageRoomController.getImageRoomById);
router.post("/", imageRoomController.createImageRoom);
router.put("/:id", imageRoomController.updateImageRoom);
router.delete("/:id", imageRoomController.deleteImageRoom);

module.exports = router;