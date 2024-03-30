const { Types } = require("mongoose");
const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../product.model");
const { getSelectData, getUnSelectData } = require("../../utils");

class ProductRepository {
  findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await this.queryProduct({ query, limit, skip });
  };

  findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await this.queryProduct({ query, limit, skip });
  };

  searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product
      .find(
        {
          isDraft: false,
          $text: { $search: regexSearch },
        },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .lean();

    return results;
  };

  findAllProduct = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = await product
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();
    return products;
  };

  findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(getUnSelectData(unSelect));
  };

  updateProductById = async ({ product_id, payload, model, isNew = true }) => {
    return await model.findByIdAndUpdate(product_id, payload, {
      new: isNew,
    });
  };

  queryProduct = async ({ query, limit, skip }) => {
    return await product
      .find(query)
      .populate("product_shop", "name email -_id")
      .sort({ updateAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  };

  publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id),
    });

    if (!foundShop) return null;
    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;
  };

  unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id),
    });

    if (!foundShop) return null;
    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;
  };

  getProductId = async (productId) => {
    return await product.findOne({
      _id: new Types.ObjectId(productId),
    });
  };

  checkProductByServer = async (products) => {
    return await Promise.all(
      products.map(async (product) => {
        const foundProduct = await this.getProductId(product.productId);
        if (foundProduct) {
          return {
            price: foundProduct.product_price,
            quantity: product.quantity,
            productId: product.productId,
            productName: foundProduct.product_name,
          };
        }
      })
    );
  };
}

module.exports = new ProductRepository();
