const express = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const UserController = require("../../controllers/user.controller");
const router = express.Router();

router.post("/new_user", asyncHandler(UserController.newUSer));
router.get("/welcome_back", asyncHandler(UserController.checkLoginEmailToken));

module.exports = router;
