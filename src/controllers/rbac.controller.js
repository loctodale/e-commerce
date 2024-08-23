const { SuccessReponse } = require("../core/success.response");
const RbacService = require("../services/rbac.service");

class RbacController {
  /**
   * @desc create new role
   * @param {string} name
   * @param {string} slug
   * @param {string} description
   * @param {Array} grants
   * @returns {new Role}
   */
  newRole = async (req, res, next) => {
    new SuccessReponse({
      message: "create role",
      metaData: await RbacService.createRole(req.body),
    }).send(res);
  };

  /**
   * @desc create new resource
   * @param {string} name
   * @param {string} slug
   * @param {string} description
   * @returns {new resource}
   */
  newResource = async (req, res, next) => {
    new SuccessReponse({
      message: "create resource",
      metaData: await RbacService.createResource(req.body),
    }).send(res);
  };

  /**
   * @desc get a list roles
   * @param {string} userId
   * @param {number} limit
   * @param {number} offset
   * @param {string} search
   */
  listRoles = async (req, res, next) => {
    new SuccessReponse({
      message: "list role",
      metaData: await RbacService.roleList(req.query),
    }).send(res);
  };

  /**
   * @desc get a list resources
   * @param {string} userId
   * @param {number} limit
   * @param {number} offset
   * @param {string} search
   */
  listResouces = async (req, res, next) => {
    new SuccessReponse({
      message: "list resouces",
      metaData: await RbacService.resourceList(req.query),
    }).send(res);
  };
}

module.exports = new RbacController();
