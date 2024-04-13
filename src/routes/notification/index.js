const express = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const NotificationController = require("../../controllers/notication.controller");
const router = express.Router();
router.use(authentication);
router.get("", asyncHandler(NotificationController.listNotiByUser));

module.exports = router;
