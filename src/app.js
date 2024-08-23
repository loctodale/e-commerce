const morgan = require("morgan");
const compression = require("compression");
const { default: helmet } = require("helmet");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const app = express();
const initRedis = require("./dbs/init.redis");
const myLogger = require("./loggers/mylogger.log");
initRedis.initRedis();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// logger
app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"];
  req.requestId = requestId ? requestId : uuidv4();
  myLogger.log(`input params::${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method === "POST" ? req.body : req.query,
  ]);

  next();
});

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
  const resMessage = `${statusCode} - ${
    Date.now() - err.now
  }ms - Response: ${JSON.stringify(err)}`;

  myLogger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    { message: err.message },
  ]);
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
