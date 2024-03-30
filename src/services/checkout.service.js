const { NotFoundError, BadRequestError } = require("../core/error.response");
const orderModel = require("../models/order.model");
const cartRepo = require("../models/repositories/cart.repo");
const productRepo = require("../models/repositories/product.repo");
const DiscountService = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
  /*
        {
            "cartId",
            "userId",
            shop_order_ids: [
                {
                    "shopId",
                    "shop_discounts": [
                        {
                            "shopId",
                            "discountId",
                            "codeId"
                        }
                    ],
                    "item_products": [
                        {
                            "price",
                            "quantity",
                            "productId"
                        },
                        {
                            "price",
                            "quantity",
                            "productId"
                        }
                    ]
                },
                {
                    "shopId",
                    "shop_discounts": [],
                    "item_products": [
                        {
                            "price",
                            "quantity",
                            "productId"
                        }
                    ]
                }
            ]
        }
    */

  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    const foundCart = await cartRepo.getCartById({ cartId });
    if (!foundCart) throw new NotFoundError("Cart not found");
    const checkout_order = {
      totalPrice: 0,
      feeShop: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    const shop_order_ids_new = [];
    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopId,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      const checkProductServer = await productRepo.checkProductByServer(
        item_products
      );
      if (!checkProductServer[0]) throw new BadRequestError("order wrong");

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);
      // tong tien truoc khi discount
      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      if (shop_discounts.length > 0) {
        const { discount = 0 } = await DiscountService.getDiscountAmount({
          code: shop_discounts[0].codeId,
          userId,
          shopId,
          products: checkProductServer,
        });
        checkout_order.totalDiscount += discount;

        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }
    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });

    // check xem có vượt tồn kho hay không
    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    console.log(`[1]: `, products);
    const acquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError("order wrong");
    }

    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_product: shop_order_ids_new,
    });

    // insert successfully
    if (newOrder) {
    }

    return newOrder;
  }

  static async getOrdersByUser({}) {}
  static async getOneOrderByUser({}) {}
  static async cancelOrderByUser({}) {}
  static async updateOrderStatusByShop({}) {}
}
module.exports = CheckoutService;
