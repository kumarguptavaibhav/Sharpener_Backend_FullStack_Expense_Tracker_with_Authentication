const Users = require("../models/users.models");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const updateToken = async (req, res) => {
  try {
    const { id } = req.user;
    const existing_user = await Users.findByPk(id);
    if (!existing_user) {
      let err = new Error("Existing User not found");
      err.statusCode = 404;
      throw err;
    }
    const user_obj = {
      id: existing_user.id,
      name: existing_user.name,
      email: existing_user.email,
      is_premium: existing_user.is_premium,
      premium_expiry: existing_user.premium_expiry,
    };
    const new_token = jwt.sign(user_obj, secretKey);

    res.status(200).json({ error: false, data: new_token });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

module.exports = { updateToken };
