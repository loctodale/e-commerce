const cloudinary = require("../configs/cloudinary.config");
const fs = require("fs");
const {
  s3,
  PutObjectCommand,
  GetObjectCommand,
  DeleteBucketCommand,
} = require("../configs/s3.config.js");
const crypto = require("crypto");

// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");

const { randomImageName } = require("../utils/index.js");
const urlImagePublic = "https://d1wgdb29ewxosj.cloudfront.net";

//1 upload from url image
class UploadService {
  uploadImageFromUrl = async () => {
    try {
      const urlImage =
        "https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/435894962_805050234984593_707151922073582426_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=uiIDhcc3TSAAb4f2Frv&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfBvBmNBBXbS3jL9GeLGcH6B2uL1_tolH-oFED2w8MKSGA&oe=661DD5C9";
      const folderName = "product/shopId";
      const newFileName = "testdemo";
      const result = await cloudinary.uploader.upload(urlImage, {
        public_id: newFileName,
        folder: folderName,
      });
      console.log(result);
      return result;
    } catch (error) {
      console.error(error);
    }
  };

  uploadImageFromLocal = async ({ path, folderName = "product/shopId" }) => {
    try {
      const result = await cloudinary.uploader.upload(path, {
        public_id: "thumb",
        folder: folderName,
      });

      return {
        image_url: result.secure_url,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: "jpg",
        }),
      };
    } catch (error) {
      console.error(error);
      ran;
    }
  };

  // upload file use S3Client
  uploadImageFromLocalS3 = async ({ file }) => {
    try {
      const imageName = randomImageName();
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageName,
        Body: file.buffer,
        ContentType: "image/jpeg",
      });
      const result = await s3.send(command);
      console.log(result);

      // const singedUrl = new GetObjectCommand({
      //   Bucket: process.env.AWS_BUCKET_NAME,
      //   Key: imageName,
      // });
      const url = getSignedUrl({
        url: `${urlImagePublic}/${imageName}`,
        keyPairId: process.env.AWS_BUCKET_PUBLIC_KEY,
        dateLessThan: new Date(Date.now() + 1000 * 60),
        privateKey: fs.readFileSync("../keys/private_key.pem").toString(),
      });
      // await getSignedUrl(s3 , singedUrl, { expiresIn: 3600 });

      return {
        url,
        result,
      };
    } catch (error) {
      console.error(error);
    }
  };
}
module.exports = new UploadService();
