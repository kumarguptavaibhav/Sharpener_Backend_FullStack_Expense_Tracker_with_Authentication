const Users = require("../models/users.models");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      let err = new Error("Invalid Payload");
      err.statusCode = 400;
      throw err;
    }
    const find_user = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (find_user) {
      let err = new Error("User Already Registered");
      err.statusCode = 409;
      throw err;
    }
    const create_result = await Users.create({
      name: name,
      email: email,
      password: password,
    });
    res.status(201).json({ error: false, data: "User Created Successfully" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

module.exports = { createUser };
