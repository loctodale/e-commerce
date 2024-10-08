const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);

router.get("/getAll", asyncHandler(productController.findAllProduct));
router.get("/findProduct/:id", asyncHandler(productController.findProduct));

//sku, spu
router.get("/sku/select_variation", asyncHandler(productController.findOneSku));
router.get("/spu/get_spu_info", asyncHandler(productController.findOneSpu));

router.use(authentication);

router.post("/spu/new", asyncHandler(productController.createSpu));
router.post("/addProduct", asyncHandler(productController.createProduct));
router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);

router.patch("/:product_id", asyncHandler(productController.updateProduct));
router.post(
  "/unPublish/:id",
  asyncHandler(productController.unPublishProductByShop)
);

//query product
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishForShop)
);
module.exports = router;
