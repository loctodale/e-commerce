const cartModel = require("../models/cart.model");
const cartRepo = require("../models/repositories/cart.repo");
const productRepo = require("../models/repositories/product.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");

class CartService {
  static async addToCart({ userId, product = {} }) {
    const foundProduct = await productRepo.checkProductByServer([product]);
    product.name = foundProduct[0].productName;
    product.price = foundProduct[0].price;
    const userCart = await cartModel.findOne({
      cart_userId: userId,
    });

    // TH1: User chưa có cart
    if (!userCart) {
      return await cartRepo.createUserCart({ userId, product });
    }

    //TH2: User có cart chưa chưa có sản phẩm
    // if (!userCart.cart_products) {
    //   userCart.cart_products = [product];
    //   return await userCart.save();
    // }
    const th2 = await cartRepo.searchProductIsExsitedInCart({
      userId,
      product,
    });
    console.log(!th2);

    if (!th2) {
      userCart.cart_products.push(product);
      return await userCart.save();
    }

    //TH3: User có cart và đã tồn tại sản phẩnm
    const results = await cartRepo.updateUserCartQuantity({ userId, product });
    return results;
  }

  /*
  shop_order_ids: [
    {
      shopId,
      item_products: [
        {
          quantity,
          price,
          shopId,
          old_quantity,
          productId
        }]
    }
  ]
  */

  static async updateUserCart({ userId, shop_order_ids = {} }) {
    const { productId, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    const foundProduct = await productRepo.getProductId(productId);
    if (!foundProduct) throw new NotFoundError("Not found product");
    //

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError("Not found shopId");

    if (quantity === 0) {
      return await cartRepo.deleteUserCart({
        userId,
        productId,
      });
    }

    return await cartRepo.updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - old_quantity,
      },
    });
  }
  static async deleteUserCart({ userId, productId }) {
    return await cartRepo.deleteUserCart({ userId, productId });
  }

  static async getListUserCart({ userId }) {
    return await cartRepo.getListUsersCart({ userId });
  }
}

module.exports = CartService;
