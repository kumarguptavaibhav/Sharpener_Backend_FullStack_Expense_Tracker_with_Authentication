const Users = require("../models/users.models");
const sendMail = require("../services/brevo");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      let err = new Error("Invalid Payload");
      err.statusCode = 400;
      throw err;
    }

    const user = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      let err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    const response = await sendMail(user.name, user.email);
    if (!response) {
      let err = new Error("Email sending failed");
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json({
      error: false,
      data: "Email sent successfully for forgot password",
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

module.exports = { forgotPassword };
