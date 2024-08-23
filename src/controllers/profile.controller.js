const { SuccessReponse } = require("../core/success.response");
const dataProfiles = [
  {
    usr_id: 1,
    usr_name: "user1",
    usr_avt: "img.com/user/1",
  },
  { usr_id: 2, usr_name: "user2", usr_avt: "img.com/user/2" },
  { usr_id: 3, usr_name: "user3", usr_avt: "img.com/user/3" },
];
class ProfileController {
  profiles = async (req, res, next) => {
    new SuccessReponse({
      message: "View all profiles",
      metaData: dataProfiles,
    }).send(res);
  };

  profile = async (req, res, next) => {
    new SuccessReponse({
      message: "View one profile",
      metaData: { usr_id: 2, usr_name: "user2", usr_avt: "img.com/user/2" },
    }).send(res);
  };
}
module.exports = new ProfileController();
