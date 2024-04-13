const { SuccessReponse } = require("../core/success.response");
const CommentSerivce = require("../services/comment.service");

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessReponse({
      message: "Comment created successfully",
      metaData: await CommentSerivce.createComment(req.body),
    }).send(res);
  };

  getCommentByParentId = async (req, res, next) => {
    new SuccessReponse({
      message: "Get Comment successfully",
      metaData: await CommentSerivce.getCommentByParentId(req.query),
    }).send(res);
  };
}
module.exports = new CommentController();
