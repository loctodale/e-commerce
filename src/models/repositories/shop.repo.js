const SHOP = require("../shop.model");

class ShopRepository {
  selectStruct = {
    name: 1,
    email: 1,
    status: 1,
    roles: 1,
  };
  findShopById = async ({ shop_id, select = this.selectStruct }) => {
    return await SHOP.findById(shop_id).select(select).lean();
  };
}

module.exports = new ShopRepository();
