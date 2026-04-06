const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validateSchemaYup = require("../middlewares/validateSchemaYup");
const userValidation = require("../validations/user.validation");

// Login
router.post(
  "/login",
  validateSchemaYup(userValidation.loginUserSchema),
  authController.login
);

// Register
router.post(
  "/register",
  validateSchemaYup(userValidation.registerUserSchema),
  authController.register
);

// Change Password
router.post(
  "/change-password",
  validateSchemaYup(userValidation.changePasswordSchema),
  authController.changePassword
);

module.exports = router;