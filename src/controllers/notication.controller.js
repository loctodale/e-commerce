const { SuccessReponse } = require("../core/success.response");
const NotificationService = require("../services/notification.service");

class NotificationController {
  listNotiByUser = async (req, res, next) => {
    new SuccessReponse({
      message: "get notification successfully",
      metaData: await NotificationService.listNotiByUser(req.query),
    }).send(res);
  };
}
module.exports = new NotificationController();
