/*
 * Filename: d:\Nodejs\e-commerce\src\services\user.service.js
 * Path: d:\Nodejs\e-commerce
 * Created Date: Thursday, May 2nd 2024, 9:42:59 pm
 * Author: loctodalee
 *
 * Copyright (c) 2024 Your Company
 */
const {
  ErrorResponse,
  SuccessRes,
  BadRequestError,
} = require("../core/error.response");
const userRepo = require("../models/repositories/user.repo");
const userModel = require("../models/user.model");
const EmailService = require("./email.service");
const otpService = require("./otp.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
class UserService {
  newUser = async ({ email = null, captcha = null }) => {
    //1. check email is exist in dbs
    const user = await userModel.findOne({ email }).lean();
    //2. If exists
    if (user) {
      return ErrorResponse({
        message: "Email already exists",
      });
    }
    //3. send token via email user
    const result = await EmailService.sendEmailToken({
      email,
    });

    return {
      message: "verify email user",
      metadata: { token: result },
    };
  };

  checkLoginEmailToken = async ({ token }) => {
    try {
      //1. Check token is in model otp
      console.log(token);
      const { otp_email: email, otp_token } = await otpService.checkEmailToken({
        token,
      });

      if (!email) throw new ErrorResponse(`Email not found`);

      //2. Check email exists in user model
      const hasUser = await this.findUserByEmailWithLogin({ email });
      if (hasUser) throw new ErrorResponse("Email is already existed");

      //3. new user
      const passwordHash = await bcrypt.hash(email, 10);

      const newUser = await userRepo.createUser({
        usr_id: 1,
        usr_email: email,
        usr_slug: email,
        usr_name: email,
        usr_password: passwordHash,
        usr_role: ["USER"],
      });

      if (newUser) {
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const keyStores = await KeyTokenService.createKeyToken({
          userId: newUser.usr_id,
          publicKey,
          privateKey,
        });

        if (!keyStores) {
          throw new ConflictRequestError("Invalid key store");
        }

        const tokens = await createTokenPair(
          { userId: newUser.usr_id, email },
          publicKey,
          privateKey
        );
        return {
          code: 201,
          message: "verify successfully",
          metaData: {
            user: getInfoData({
              fields: ["usr_id", "usr_name", "usr_email"],
              object: newUser,
            }),
            tokens,
          },
        };
      }
      return {
        code: 200,
        metaData: null,
      };
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  };

  findUserByEmailWithLogin = async ({ email }) => {
    const user = userModel.findOne({ usr_email: email }).lean();
    return user;
  };
}

module.exports = new UserService();
