const multer = require("multer");
const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./src/uploads");
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  }),
});

module.exports = {
  uploadMemory,
  uploadDisk,
};
