const { inventory } = require("../inventory.model");

class InventoryRepository {
  insertInventory = async ({
    product_id,
    shop_id,
    stock,
    location = "unknown",
  }) => {
    return await inventory.create({
      inven_productId: product_id,
      inven_shopId: shop_id,
      inven_stock: stock,
      inven_location: location,
    });
  };
  reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
      inven_productId: productId,
      inven_stock: { $gte: quantity },
    };
    const updateSet = {
      $inc: {
        inven_stock: -quantity,
      },
      $push: {
        inven_reservations: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    };
    const options = { upsert: true, new: true };
    return await inventory.updateOne(query, updateSet);
  };
}

module.exports = new InventoryRepository();
