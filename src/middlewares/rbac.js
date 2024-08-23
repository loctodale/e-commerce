const { AuthFailureError } = require("../core/error.response");
const rbacService = require("../services/rbac.service");
const rbac = require("./role.middleware");
const grantAccess = (action, resouce) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(await rbacService.roleList({ userId: "099999" }));
      const rol_name = req.query.role;
      const permission = rbac.can(rol_name)[action](resouce);
      if (!permission.granted) {
        throw new AuthFailureError("you dont have permission");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  grantAccess,
};
