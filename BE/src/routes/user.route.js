const categogyController = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();
router.get("/", categogyController.getAlluser);



module.exports = router;
