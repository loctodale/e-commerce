const otpService = require("./otp.service");
const templateService = require("./template.service");
const transport = require("../dbs/init.nodemailer");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { replacePlaceholder } = require("../utils");
class EmailService {
  sendEmailLinkVerify = async ({
    html,
    toEmail,
    subject = "Xác nhận email đăng ký",
    text = "xác nhận ..",
  }) => {
    try {
      const mailOptions = {
        from: '"ShopDev" <thang336655@gmail.com>',
        to: toEmail,
        subject,
        text,
        html,
      };
      transport.sendMail(mailOptions, (err, info) => {
        console.log(info);
        if (err) {
          console.error(err);
        }

        console.log("Message sent:: ", info.messageId);
      });
    } catch (error) {
      console.error("Error sending message" + error.message);
      return error.message;
    }
  };

  sendEmailToken = async ({ email = null }) => {
    try {
      //1. Get token
      const token = await otpService.newOtp({ email });

      //2. Get template
      const template = await templateService.getTemplate({
        tem_name: "HTML EMAIL TOKEN",
      });

      if (!template) {
        throw new NotFoundError("Template not found");
      }
      //3. replace placeholder with params
      const content = replacePlaceholder(template.tem_html, {
        link_verify: `http://localhost:3055/v1/api/user/welcome_back?token=${token.otp_token}`,
      });
      //4. Send email
      this.sendEmailLinkVerify({
        html: content,
        toEmail: email,
        subject: "Xác nhận email đăng ký!!",
        text: "xác nhận ..",
      }).catch((error) => {
        console.error(error);
      });
      return 1;
    } catch (error) {}
  };
}

module.exports = new EmailService();
