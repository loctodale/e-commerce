const { CREATED, SuccessReponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  async handlerRefreshToken(req, res, next) {
    new SuccessReponse({
      message: "Get token successfully",
      metaData: await AccessService.handlerRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  }
  async login(req, res, next) {
    new SuccessReponse({
      metaData: await AccessService.login(req.body),
    }).send(res);
  }

  async logout(req, res, next) {
    new SuccessReponse({
      message: "Logout successfully",
      metaData: await AccessService.logout(req.keyStore),
    }).send(res);
  }

  async signUp(req, res, next) {
    new CREATED({
      message: "Regiserted successfully",
      metaData: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  }
}

module.exports = new AccessController();
