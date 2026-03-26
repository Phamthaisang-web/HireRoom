const imageRoomController = require("../controllers/imageRoom.controller");
const validateSchemaYup = require("../middlewares/validateSchemaYup");
const imageRoomValidation= require("../validations/imageRoom.validation");
const upload = require('../middlewares/upload');
const express = require("express");
const router = express.Router();

router.get("/", imageRoomController.getAllImageRooms);
router.get("/:id", imageRoomController.getImageRoomById);
router.post("/",validateSchemaYup(imageRoomValidation.createImageRoomSchema), imageRoomController.createImageRoom);
router.put("/:id",validateSchemaYup(imageRoomValidation.updateImageRoomSchema), imageRoomController.updateImageRoom);
router.delete("/:id", imageRoomController.deleteImageRoom);

router.post('/uploads', upload.array('images', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'Không có file nào được chọn' });
  }

  const filePaths = req.files.map(file => `/uploads/rooms/${file.filename}`);
  res.json({
    message: 'Upload danh sách ảnh thành công',
    urls: filePaths
  });
});
module.exports = router;