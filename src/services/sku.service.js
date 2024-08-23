const { BadRequestError } = require("../core/error.response");
const SKU = require("../models/sku.model");
const { randomProductId } = require("../utils");
const _ = require("lodash");
class SkuService {
  newSku = async ({ spu_id, sku_list }) => {
    try {
      const convert_sku_list = sku_list.map((sku) => {
        return {
          ...sku,
          product_id: spu_id,
          sku_id: `${spu_id}.${randomProductId()}`,
        };
      });
      const skus = await SKU.create(convert_sku_list);
      return skus;
    } catch (error) {
      return [];
    }
  };

  oneSku = async ({ product_id, sku_id }) => {
    try {
      //1 read cache
      const sku = await SKU.findOne({
        product_id,
        sku_id,
      }).lean();

      if (sku) {
        //set cached
      }
      return _.omit(sku, ["__v", "updatedAt", "createdAt", "isDelete"]);
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  };

  allSkuBySpuId = async ({ product_id }) => {
    try {
      const skus = await SKU.find({
        product_id,
      }).lean();
      return skus;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  };
}

module.exports = new SkuService();
