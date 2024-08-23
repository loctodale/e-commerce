const express = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const RbacController = require("../../controllers/rbac.controller");
const router = express.Router();
// router.use(authentication);
router.post("/role", asyncHandler(RbacController.newRole));
router.get("/roles", asyncHandler(RbacController.listRoles));

router.post("/resource", asyncHandler(RbacController.newResource));
router.get("/resources", asyncHandler(RbacController.listResouces));

module.exports = router;
