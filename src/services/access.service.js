const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const shopModel = require("../models/shop.model");
const { getInfoData } = require("../utils");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const ShopService = require("./shop.service");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  // sign up
  static signUp = async ({ name, email, password }) => {
    const holderhop = await shopModel.findOne({ email }).lean();
    if (holderhop) {
      throw new BadRequestError("Error: Shop already registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      const keyStores = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStores) {
        throw new ConflictRequestError("Invalid key store");
      }

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      return {
        code: 201,
        metaData: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metaData: null,
    };
  };

  // login

  static login = async ({ email, password, refreshToken = null }) => {
    if (!email) {
      throw new BadRequestError("email missing");
    }
    const foundShop = await ShopService.findByEmail({ email });
    if (!foundShop) {
      throw new BadRequestError("Shop not registered");
    }

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Authentication Error");
    }

    const publicKey = crypto.randomBytes(64).toString("hex");
    const privateKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: foundShop._id, email: foundShop.email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  // logout
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log(delKey);
    return delKey;
  };

  // login with refresh token
  static handlerRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something went wrong");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Shop not registered");
    }

    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    // if (foundToken) {
    //   const { userId, email } = await verifyJWT(
    //     refreshToken,
    //     foundToken.privateKey
    //   );
    //   console.log({ userId, email });

    //   await KeyTokenService.deleteKeyById(userId);
    //   throw new ForbiddenError("Something went wrong");
    // }

    // const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    // if (!holderToken) {
    //   throw new AuthFailureError("Shop not registered1");
    // }

    // const { userId, email } = await verifyJWT(
    //   refreshToken,
    //   holderToken.privateKey
    // );

    const foundShop = await ShopService.findByEmail({ email });
    if (!foundShop) {
      throw new AuthFailureError("Shop not registered2");
    }

    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });
    return {
      user,
      tokens,
    };
  };
}

module.exports = AccessService;
