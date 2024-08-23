/*
 * Filename: d:\Nodejs\e-commerce\src\controllers\user.controller.js
 * Path: d:\Nodejs\e-commerce
 * Created Date: Thursday, May 2nd 2024, 9:40:12 pm
 * Author: loctodalee
 *
 * Copyright (c) 2024 Your Company
 */

const { SuccessReponse } = require("../core/success.response");
const userService = require("../services/user.service");
class UserController {
  // new user
  newUSer = async (req, res, next) => {
    new SuccessReponse({
      message: "new user",
      metaData: await userService.newUser({
        email: req.body.email,
      }),
    }).send(res);
  };

  // check user token via email
  checkLoginEmailToken = async (req, res, next) => {
    const respond = await userService.checkLoginEmailToken({
      token: req.query.token,
    });
    new SuccessReponse(respond).send(res);
  };
}

module.exports = new UserController();
