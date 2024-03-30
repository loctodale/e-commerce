const express = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const CheckoutController = require("../../controllers/checkout.controller");
const router = express.Router();
router.post("/review", asyncHandler(CheckoutController.checkoutReview));
router.use(authentication);
module.exports = router;
