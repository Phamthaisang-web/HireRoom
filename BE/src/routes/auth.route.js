const authController = require("../controllers/auth.controller");
const validateSchemaYup = require("../middlewares/validateSchemaYup");
const userValidation= require("../validations/user.validation");
const express = require("express");
const router = express.Router();
router.post("/login", validateSchemaYup(userValidation.loginUserSchema),authController.login);
router.post("/register",validateSchemaYup(userValidation.registerUserSchema), authController.register);
module.exports = router;
