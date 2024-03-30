"use strict";
const mongoose = require("mongoose");
const connectionString = `mongodb://localhost:27017/e-commerce`;
const { countConnect } = require("../helper/check.connect");
// sử dụng singleton để tạo duy nhất 1 instance kết nối với db

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectionString, { maxPoolSize: 50 })
      .then((_) =>
        console.log(
          `Connected Mongodb Success, Number of Connections: ${countConnect()}`
        )
      )
      .catch((err) => console.log(`Error Connecting`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
