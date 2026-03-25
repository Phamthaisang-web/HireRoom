const express = require("express");
const router = express.Router();

const landlordController = require("../controllers/landlord.controller");
const validateSchemaYup = require("../middlewares/validateSchemaYup");
const { createLandlordSchema, updateLandlordSchema } = require("../validations/landlord.validation"); // destructuring

router.get("/", landlordController.getAllLandlords);
router.get("/:id", landlordController.getLandlordById);
router.post("/", validateSchemaYup(createLandlordSchema), landlordController.createLandlord);
router.put("/:id", validateSchemaYup(updateLandlordSchema), landlordController.updateLandlord);
router.delete("/:id", landlordController.deleteLandlord);

module.exports = router;