const express = require("express");
const router = express.Router();
const replyController = require("../controllers/reply.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const checkAdminMiddleware = require("../middlewares/checkAdmin.middleware");

router.get("/review/:reviewId", replyController.getRepliesByReview);

router.post(
  "/", 
  authMiddleware, 
  checkAdminMiddleware, 
  replyController.createReply
);


router.delete(
  "/:id", 
  authMiddleware, 
  checkAdminMiddleware, 
  replyController.deleteReply
);

module.exports = router;