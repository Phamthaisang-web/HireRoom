const roomController = require("../controllers/room.controller");
const validateSchemaYup = require("../middlewares/validateSchemaYup");
const roomValidation = require("../validations/room.validtion");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const checkAdminMiddleware = require("../middlewares/checkAdmin.middleware");
router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
router.post("/", authMiddleware,checkAdminMiddleware, validateSchemaYup(roomValidation.createRoomSchema),roomController.createRoom);
router.put("/:id",authMiddleware,checkAdminMiddleware, validateSchemaYup(roomValidation.updateRoomSchema), roomController.updateRoom);
router.delete("/:id",authMiddleware,checkAdminMiddleware,  roomController.deleteRoom);

module.exports = router;