const shopRepo = require("../models/repositories/shop.repo");
const { NotFoundError, BadRequestError } = require("../core/error.response");
const SPU = require("../models/spu.model");
const { randomProductId } = require("../utils");
const SkuService = require("../services/sku.service");
const skuService = require("../services/sku.service");
const _ = require("lodash");
class SpuService {
  newSpu = async ({
    product_id,
    product_name,
    product_thump,
    product_description,
    product_price,
    product_category,
    product_shop,
    product_attributes,
    product_quantity,
    product_variations,
    sku_list = [],
  }) => {
    try {
      //1. check if shop not found
      const foundShop = await shopRepo.findShopById({
        shop_id: product_shop,
      });
      if (!foundShop) throw NotFoundError("Shop not registry");

      //2. create new spu
      const spu = await SPU.create({
        product_id: randomProductId(),
        product_name,
        product_thump,
        product_description,
        product_price,
        product_category,
        product_shop,
        product_attributes,
        product_quantity,
        product_variations,
      });
      if (spu && sku_list.length) {
        //3. create skus
        SkuService.newSku({
          sku_list,
          spu_id: spu.product_id,
        }).then();
      }

      //4. sync data via elasticsearch (search.service)

      //5. respond result object
      return !!spu;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  };

  oneSpu = async ({ spu_id }) => {
    const spu = await SPU.findOne({
      product_id: spu_id,
    }).lean();
    if (!spu) throw new NotFoundError("spu_id not found");
    const skus = await skuService.allSkuBySpuId({ product_id: spu.product_id });

    return {
      spu_info: _.omit(spu, ["__v", "updatedAt", "createdAt"]),
      sku_list: skus.map((sku) => {
        return _.omit(sku, ["__v", "updatedAt", "createdAt", "isDelete"]);
      }),
    };
  };
}

module.exports = new SpuService();
