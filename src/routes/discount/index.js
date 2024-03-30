const express = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const DiscountController = require("../../controllers/discount.controller");
const router = express.Router();

router.get(
  "/list_product_code",
  asyncHandler(DiscountController.getAllProductsWithDiscountCode)
);
router.post("/amount", asyncHandler(DiscountController.getDiscountAmount));

router.use(authentication);
router.post("/create", asyncHandler(DiscountController.createDiscountCode));

router.get("/", asyncHandler(DiscountController.getAllDiscountCode));
module.exports = router;
