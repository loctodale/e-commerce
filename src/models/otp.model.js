/*
 * Filename: d:\Nodejs\e-commerce\src\models\otp.model.js
 * Path: d:\Nodejs\e-commerce
 * Created Date: Thursday, May 2nd 2024, 9:18:33 pm
 * Author: loctodalee
 *
 * Copyright (c) 2024 Your Company
 */

const DOCUMENT_NAME = "otp_log";
const COLLECTION_NAME = "otp_logs";
const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var otpSchema = new mongoose.Schema(
  {
    otp_token: {
      type: String,
      required: true,
    },
    otp_email: {
      type: String,
      required: true,
    },
    otp_status: {
      type: String,
      default: "pending",
      enum: ["pending", "active", "block"],
      expireAt: {
        type: Date,
        default: Date.now(),
        expires: 60,
      },
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, otpSchema);
