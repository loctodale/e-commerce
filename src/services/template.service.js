const { BadRequestError } = require("../core/error.response");
const templateModel = require("../models/template.model");
const { htmlEmailToken } = require("../utils/tem.html");
class TemplateService {
  static newTemplate = async ({ tem_name, tem_html, tem_id }) => {
    //1. Check if template exists
    const foundTem = await templateModel.findOne({ tem_name }).lean();
    if (foundTem) {
      throw new BadRequestError("Template is existing");
    }
    //2. Create new template
    const newTem = await templateModel.create({
      tem_name,
      tem_id,
      tem_html: htmlEmailToken(),
    });
    //3. Return new template
    return newTem;
  };

  static getTemplate = async ({ tem_name }) => {
    const foundTem = await templateModel.findOne({ tem_name }).lean();
    if (!foundTem) {
      throw new BadRequestError("Template not found");
    }
    return foundTem;
  };
}

module.exports = TemplateService;
