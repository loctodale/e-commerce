const { SuccessReponse } = require("../core/success.response");
const TemplateService = require("../services/template.service");

class EmailController {
  async newTemplate(req, res, next) {
    new SuccessReponse({
      message: "new Template success",
      metaData: await TemplateService.newTemplate(req.body),
    }).send(res);
  }
}
module.exports = new EmailController();
