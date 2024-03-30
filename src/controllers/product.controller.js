const { SuccessReponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceUpdate = require("../services/product.service.update");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessReponse({
      message: "Create product successfully",
      metaData: await ProductServiceUpdate.createProduct(
        req.body.product_type,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessReponse({
      message: "publish product successfully",
      metaData: await ProductServiceUpdate.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  unPublishProductByShop = async (req, res, next) => {
    new SuccessReponse({
      message: "unPublished product successfully",
      metaData: await ProductServiceUpdate.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  //Query
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  getAllDraftsForShop = async (req, res) => {
    new SuccessReponse({
      message: "get draft product successfully",
      metaData: await ProductServiceUpdate.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishForShop = async (req, res) => {
    new SuccessReponse({
      message: "get publish product successfully",
      metaData: await ProductServiceUpdate.findAllPublishedForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res) => {
    new SuccessReponse({
      message: "search product successfully",
      metaData: await ProductServiceUpdate.searchProduct(req.params),
    }).send(res);
  };

  findAllProduct = async (req, res) => {
    new SuccessReponse({
      message: "findAllProduct successfully",
      metaData: await ProductServiceUpdate.findAllProduct(req.query),
    }).send(res);
  };

  findProduct = async (req, res) => {
    new SuccessReponse({
      message: "findProduct successfully",
      metaData: await ProductServiceUpdate.findProduct({
        product_id: req.params.id,
      }),
    }).send(res);
  };

  updateProduct = async (req, res) => {
    new SuccessReponse({
      message: "update successfully",
      metaData: await ProductServiceUpdate.updateProduct({
        type: req.body.product_type,
        product_id: req.params.product_id,
        payload: {
          ...req.body,
          product_shop: req.user.userId,
        },
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
