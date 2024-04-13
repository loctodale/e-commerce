// Require the cloudinary library
const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  cloud_name: "duuouaim8",
  api_key: "774277582726216",
  api_secret: process.env.CLOUDINARY_SERECT_KEY,
});

// Log the configuration
// console.log(cloudinary.config());
module.exports = cloudinary;
