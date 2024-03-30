const { SuccessReponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessReponse({
      message: "Create discount successfully",
      metaData: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCode = async (req, res, next) => {
    new SuccessReponse({
      message: "get discount successfully",
      metaData: await DiscountService.getAllDiscountCodeByShop({
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessReponse({
      message: "get discount amount successfully",
      metaData: await DiscountService.getDiscountAmount({
        ...req.body,
        // shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllProductsWithDiscountCode = async (req, res, next) => {
    new SuccessReponse({
      message: "get product with discount code successfully",
      metaData: await DiscountService.getAllProductsWithDiscountCode({
        ...req.query,
      }),
    }).send(res);
  };
}
module.exports = new DiscountController();
