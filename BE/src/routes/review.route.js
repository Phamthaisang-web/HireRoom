const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const  checkAdminMiddleware= require("../middlewares/checkAdmin.middleware");

router.get("/room/:roomId", reviewController.getRoomReviews);
router.post("/", authMiddleware, reviewController.createReview);
router.patch("/:id/status", authMiddleware,checkAdminMiddleware, reviewController.updateStatus);
router.delete("/:id", authMiddleware, reviewController.deleteReview);
module.exports = router;