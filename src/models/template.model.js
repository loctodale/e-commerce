/*
 * Filename: d:\Nodejs\e-commerce\src\models\template.model.js
 * Path: d:\Nodejs\e-commerce
 * Created Date: Thursday, May 2nd 2024, 9:18:11 pm
 * Author: loctodalee
 *
 * Copyright (c) 2024 Your Company
 */

const DOCUMENT_NAME = "template";
const COLLECTION_NAME = "templates";
const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var templateSchema = new mongoose.Schema(
  {
    tem_id: {
      type: Number,
      required: true,
    },
    tem_name: {
      type: String,
      required: true,
    },
    tem_status: {
      type: String,
      default: "active",
    },
    tem_html: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, templateSchema);
