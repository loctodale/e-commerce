const { SuccessReponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addTocart = async (req, res, next) => {
    new SuccessReponse({
      message: "Add to Cart successfully",
      metaData: await CartService.addToCart({
        ...req.body,
      }),
    }).send(res);
  };

  updateCart = async (req, res, next) => {
    new SuccessReponse({
      message: "Update Cart successfully",
      metaData: await CartService.updateUserCart({
        ...req.body,
      }),
    }).send(res);
  };

  deleteCart = async (req, res, next) => {
    new SuccessReponse({
      message: "Delete Cart successfully",
      metaData: await CartService.deleteUserCart({
        ...req.body,
      }),
    }).send(res);
  };

  listTocart = async (req, res, next) => {
    new SuccessReponse({
      message: "List Cart successfully",
      metaData: await CartService.getListUserCart({
        ...req.query,
      }),
    }).send(res);
  };
}
module.exports = new CartController();
