const express = require("express");
const router = express.Router();
const landlordController = require("../controllers/landlord.controller");
const validateSchemaYup = require("../middlewares/validateSchemaYup");
const landlordValidation= require("../validations/landlord.validation");
const authMiddleware = require("../middlewares/auth.middleware");
const checkAdminMiddleware = require("../middlewares/checkAdmin.middleware");
router.get("/", landlordController.getAllLandlords);
router.get("/:id", landlordController.getLandlordById);
router.post("/",authMiddleware,checkAdminMiddleware, validateSchemaYup(landlordValidation.createLandlordSchema), landlordController.createLandlord);
router.put("/:id",authMiddleware,checkAdminMiddleware, validateSchemaYup(landlordValidation.updateLandlordSchema), landlordController.updateLandlord);
router.delete("/:id",authMiddleware,checkAdminMiddleware,  landlordController.deleteLandlord);

module.exports = router;