const express = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const emailController = require("../../controllers/email.controller");
const router = express.Router();

router.post("/new_template", asyncHandler(emailController.newTemplate));

module.exports = router;
