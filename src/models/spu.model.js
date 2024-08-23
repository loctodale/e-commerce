const { Schema, model, default: mongoose } = require("mongoose"); // Erase if already required
const slugify = require("slugify");
const COLLECTION_NAME = "Spus";
const DOCUMENT_NAME = "Spu";
// Declare the Schema of the Mongo model
var spuSchema = new Schema(
  {
    product_id: {
      type: String,
      require: true,
    },
    product_name: {
      type: String,
      required: true,
    },
    product_thump: {
      type: String,
      required: true,
    },
    product_discription: {
      type: String,
    },
    product_slug: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_category: {
      type: Array,
      default: [],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "shop" },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: {
      type: Array,
      default: [],
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

// Create index for search
spuSchema.index({ product_name: "text", product_discription: "text" });
// Middleware for product before create or save product
spuSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

//Export the model

module.exports = mongoose.model(DOCUMENT_NAME, spuSchema);
