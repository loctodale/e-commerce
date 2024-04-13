const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const { asyncHandler } = require("../../helper/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");
const router = express.Router();

router.post("/uploadFromUrl", asyncHandler(uploadController.uploadFile));
router.post(
  "/uploadFromUrl/thumb",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadFileThumb)
);

router.post(
  "/uploadBucket",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadFileLocalS3)
);

module.exports = router;
