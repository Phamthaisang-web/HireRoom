const express = require("express");
const router = express.Router();
const landlordController = require("../controllers/landlord.controller");
const validateSchemaYup = require("../middlewares/validateSchemaYup");
const landlordValidation= require("../validations/landlord.validation");
router.get("/", landlordController.getAllLandlords);
router.get("/:id", landlordController.getLandlordById);
router.post("/", validateSchemaYup(landlordValidation.createLandlordSchema), landlordController.createLandlord);
router.put("/:id", validateSchemaYup(landlordValidation.updateLandlordSchema), landlordController.updateLandlord);
router.delete("/:id", landlordController.deleteLandlord);

module.exports = router;