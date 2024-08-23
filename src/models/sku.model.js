const { Schema, model } = require("mongoose"); // Erase if already required
const slugify = require("slugify");
const COLLECTION_NAME = "Skus";
const DOCUMENT_NAME = "Sku";
// Declare the Schema of the Mongo model
var skuSchema = new Schema(
  {
    sku_id: {
      type: String,
      require: true,
      unique: true,
    },
    sku_tier_idx: {
      type: Array,
      default: [0],
    },
    sku_default: {
      type: Boolean,
      default: false,
    },
    sku_slug: {
      type: String,
      default: "",
    },
    sku_sort: {
      type: Number,
      default: 0,
    },
    sku_price: {
      type: String,
      require: true,
    },
    sku_stock: {
      type: Number,
      default: 0,
    },
    product_id: {
      type: String,
      require: true,
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, skuSchema);
