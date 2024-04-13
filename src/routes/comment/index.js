const express = require("express");
const { asyncHandler } = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const CommentController = require("../../controllers/comment.controller");
const router = express.Router();
router.get("", asyncHandler(CommentController.getCommentByParentId));
router.use(authentication);
router.post("", asyncHandler(CommentController.createComment));
module.exports = router;
