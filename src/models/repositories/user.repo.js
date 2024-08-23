const USER = require("../user.model");

class UserRepository {
  createUser = async ({
    usr_id,
    usr_slug,
    usr_name,
    usr_password,
    usr_email,
    usr_role,
  }) => {
    const user = await USER.create({
      usr_id,
      usr_slug,
      usr_email,
      usr_name,
      usr_password,
      usr_role,
    });

    return user;
  };
}

module.exports = new UserRepository();
