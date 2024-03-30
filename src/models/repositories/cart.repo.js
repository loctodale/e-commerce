const cartModel = require("../cart.model");

class CartRepository {
  async createUserCart({ userId, product }) {
    const query = { cart_userId: userId, cart_state: "active" };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  async updateUserCartQuantity({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    };
    const updateSet = {
      $inc: {
        "cart_products.$.quantity": quantity,
      },
    };

    const options = { upsert: true, new: true };
    return await cartModel.findOneAndUpdate(query, updateSet, options);
  }

  async searchProductIsExsitedInCart({ userId, product }) {
    const { productId, quantity } = product;
    const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    };

    return await cartModel.findOne(query);
  }

  async deleteUserCart({ userId, productId }) {
    const query = {
      cart_userId: userId,
      cart_state: "active",
    };
    const updateSet = {
      $pull: {
        cart_products: { productId },
      },
    };
    const deleteCart = await cartModel.updateOne(query, updateSet);
    return deleteCart;
  }
  async getListUsersCart({ userId }) {
    return await cartModel
      .findOne({
        cart_userId: +userId,
      })
      .lean();
  }

  async getCartById({ cartId }) {
    return await cartModel
      .findOne({
        _id: cartId,
        cart_state: "active",
      })
      .lean();
  }
}

module.exports = new CartRepository();
