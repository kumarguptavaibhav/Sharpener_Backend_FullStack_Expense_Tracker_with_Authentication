const Users = require("../models/users.models");
const jwt = require("jsonwebtoken");
const secretKey = "Vaibhav";

const updateToken = async (req, res) => {
  try {
    const { id } = req.user;
    const existing_user = await Users.findByPk(id);
    if (!existing_user) {
      let err = new Error("Existing User not found");
      err.statusCode = 404;
      throw err;
    }

    const new_token = jwt.sign(existing_user.toJSON(), secretKey);

    res.status(200).json({ error: false, data: new_token });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

module.exports = { updateToken };
