const morgan = require("morgan");
const compression = require("compression");
const { default: helmet } = require("helmet");
const express = require("express");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//init middleware
app.use(morgan("dev"));
app.use(helmet()); // for protection only
app.use(compression()); // for performance only

//init db
require("./dbs/init.mongodb");
// const { checkOverload } = require("./helper/check.connect");
// checkOverload();

//init router
app.use("/", require("./routes"));
//handle error

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: err.stack,
    message: err.message || "Internal Server Error",
  });
});

//test pub sub
// require("./tests/inventory.test");
// const productTest = require("./tests/product.test");
// productTest.purchaseProduct({ productId: "P001", quantity: 10 });
module.exports = app;
