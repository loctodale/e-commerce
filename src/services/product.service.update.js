const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const ProductRepository = require("../models/repositories/product.repo");
const InventoryRepository = require("../models/repositories/inventory.repo");
const { removeUndefinedObject, updateNestedObject } = require("../utils");
const NotificationService = require("./notification.service");

class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type ${type}`);
    return new productClass(payload).createProduct();
  }

  static async updateProduct({ type, product_id, payload }) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid product type ${type}`);
    console.log("Product ID: " + product_id);
    return new productClass(payload).updateProduct({ product_id });
  }

  // Query
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await ProductRepository.findAllDraftsForShop({
      query,
      limit,
      skip,
    });
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await ProductRepository.findAllPublishedForShop({
      query,
      limit,
      skip,
    });
  }

  //Put Product

  static async publishProductByShop({ product_shop, product_id }) {
    return await ProductRepository.publishProductByShop({
      product_shop,
      product_id,
    });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await ProductRepository.unPublishProductByShop({
      product_shop,
      product_id,
    });
  }

  static async searchProduct({ keySearch }) {
    return await ProductRepository.searchProductByUser({ keySearch });
  }

  static async findAllProduct({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await ProductRepository.findAllProduct({
      limit,
      sort,
      page,
      filter,
      select: [
        "product_name",
        "product_price",
        "product_thump",
        "product_shop",
      ],
    });
  }

  static async findProduct({ product_id }) {
    return await ProductRepository.findProduct({
      product_id,
      unSelect: ["__v", "product_variations"],
    });
  }
}

class Product {
  constructor({
    product_name,
    product_thump,
    product_discription,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attribute,
  }) {
    this.product_name = product_name;
    this.product_thump = product_thump;
    this.product_discription = product_discription;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attribute = product_attribute;
  }

  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      await InventoryRepository.insertInventory({
        product_id: newProduct._id,
        shop_id: this.product_shop,
        stock: this.product_quantity,
      });
      NotificationService.pushNotificationToSystem({
        type: "SHOP-001",
        receivedId: 1,
        senderId: this.product_shop,
        options: {
          product_name: this.product_name,
          shop_name: this.product_shop,
        },
      })
        .then((rs) => console.log(rs))
        .catch((err) => console.error(err));
    }
    return newProduct;
  }

  async updateProduct({ product_id, payload }) {
    return await ProductRepository.updateProductById({
      product_id,
      payload,
      model: product,
    });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("create new clothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }

  async updateProduct({ product_id }) {
    // remove attributes has value is null or undefined
    const objectParams = removeUndefinedObject(this);
    // check update ở chỗ nào
    if (objectParams.product_attribute) {
      await ProductRepository.updateProductById({
        product_id,
        payload: updateNestedObject(objectParams.product_attribute),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct({
      product_id,
      payload: updateNestedObject(objectParams),
    });
    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("create new electronic error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }

  async updateProduct({ product_id }) {
    // remove attributes has value is null or undefined
    const objectParams = removeUndefinedObject(this);
    // check update ở chỗ nào
    if (objectParams.product_attribute) {
      await ProductRepository.updateProductById({
        product_id,
        payload: updateNestedObject(objectParams.product_attribute),
        model: electronic,
      });
    }

    const updateProduct = await super.updateProduct({
      product_id,
      payload: updateNestedObject(objectParams),
    });
    return updateProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attribute,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("create new furniture error");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("create new product error");

    return newProduct;
  }

  async updateProduct({ product_id }) {
    // remove attributes has value is null or undefined
    const objectParams = removeUndefinedObject(this);
    // check update ở chỗ nào
    if (objectParams.product_attribute) {
      await ProductRepository.updateProductById({
        product_id,
        payload: updateNestedObject(objectParams.product_attribute),
        model: furniture,
      });
    }

    const updateProduct = await super.updateProduct({
      product_id,
      payload: updateNestedObject(objectParams),
    });
    return updateProduct;
  }
}

//regis product type
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
