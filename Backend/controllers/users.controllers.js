const Users = require("../models/users.models");
const bcrypt = require("bcrypt");

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
    const saltRound = 10;
    bcrypt.hash(password, saltRound, async (err, hash) => {
      if (err) {
        throw err;
      }
      const create_result = await Users.create({
        name: name,
        email: email,
        password: hash,
      });
      res.status(201).json({ error: false, data: "User Created Successfully" });
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });
    if (!email || !password) {
      let err = new Error("Invalid Payload");
      err.statusCode = 400;
      throw err;
    }
    const check_user = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (!check_user) {
      let err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }
    const isMatch = await bcrypt.compare(password, check_user.password);
    if (!isMatch) {
      let err = new Error("User not authorized");
      err.statusCode = 401;
      throw err;
    }
    res.status(200).json({ error: false, data: "User Login Successfully" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

module.exports = { createUser, signInUser };
