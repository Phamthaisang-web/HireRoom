const roomController = require("../controllers/room.controller");
const validateSchemaYup = require("../middlewares/validateSchemaYup");
const roomValidation = require("../validations/room.validtion");
const express = require("express");
const router = express.Router();

router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
router.post("/", validateSchemaYup(roomValidation.createRoomSchema),roomController.createRoom);
router.put("/:id",validateSchemaYup(roomValidation.updateRoomSchema), roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);

module.exports = router;