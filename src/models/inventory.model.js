const { Schema, model } = require("mongoose"); // Erase if already required
const COLLECTION_NAME = "Inventories";
const DOCUMENT_NAME = "Inventory";
// Declare the Schema of the Mongo model
var inventorySchema = new Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "product",
    },
    inven_location: {
      type: String,
      default: "unknown",
    },

    inven_stock: {
      type: Number,
      required: true,
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    inven_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = {
  inventory: model(DOCUMENT_NAME, inventorySchema),
};
