const { BadRequestError } = require("../core/error.response");
const { SuccessReponse } = require("../core/success.response");
const UploadService = require("../services/upload.service");

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessReponse({
      message: "upload successfully",
      metaData: await UploadService.uploadImageFromUrl(req.body),
    }).send(res);
  };

  uploadFileThumb = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File not found");
    }
    new SuccessReponse({
      message: "upload successfully",
      metaData: await UploadService.uploadImageFromLocal({
        path: file.path,
      }),
    }).send(res);
  };

  uploadFileLocalS3 = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File not found");
    }
    new SuccessReponse({
      message: "upload successfully s3 local",
      metaData: await UploadService.uploadImageFromLocalS3({
        file,
      }),
    }).send(res);
  };
}
module.exports = new UploadController();
