const crypto = require("crypto");
const otpModel = require("../models/otp.model");
const { NotFoundError } = require("../core/error.response");
class OtpService {
  generateTokenRandom = () => {
    const token = crypto.randomInt(0, Math.pow(2, 32));
    return token;
  };
  newOtp = async ({ email = null }) => {
    const token = this.generateTokenRandom();
    console.log(token);
    const newToken = await otpModel.create({
      otp_token: token,
      otp_email: email,
    });
    return newToken;
  };

  checkEmailToken = async ({ token }) => {
    // check token in model db
    const hasToken = await otpModel.findOne({ otp_token: token }).lean();

    if (!hasToken) {
      throw new NotFoundError("Token not found");
    }

    //delete token from model
    otpModel.deleteOne({ otp_token: token }).then();
    return hasToken;
  };
}

module.exports = new OtpService();
