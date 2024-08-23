const _ = require("lodash");
const { Types } = require("mongoose");
const crypto = require("crypto");
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = {}) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const getUnSelectData = (select = {}) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null) {
      delete obj[key];
    }
  });

  return obj;
};

const updateNestedObject = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] == "Object" && !Array.isArray(obj[key])) {
      const response = updateNestedObject(obj[key]);
      Object.keys(response).forEach((a) => {
        final[`${key}.${a}`] = response[a];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};

const convertToObjectIdMongoDb = (id) => {
  new Types.ObjectId(id);
};

const replacePlaceholder = (template, params) => {
  Object.keys(params).forEach((key) => {
    const placeholder = `{{${key}}}`;
    template = template.replace(new RegExp(placeholder, "g"), params[key]);
  });
  return template;
};

const randomImageName = () => crypto.randomBytes(16).toString("hex");
const randomProductId = () => {
  return Math.floor(Math.random() * 899999 + 100000);
};
module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObject,
  convertToObjectIdMongoDb,
  randomImageName,
  replacePlaceholder,
  randomProductId,
};
