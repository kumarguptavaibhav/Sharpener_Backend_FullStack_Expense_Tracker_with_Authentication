const Users = require("../models/users.models");
const sendMail = require("../services/brevo");
const { v4: uuidv4 } = require("uuid");
const ForgotPasswordRequests = require("../models/forgotpasswordrequests.models");
const bcrypt = require("bcrypt");
const sequelize = require("../utils/dbconnection");
const saltRound = Number(process.env.SALT_ROUND);

const forgotPassword = async (req, res) => {
  try {
    const frontend_base_url = req.query.frontend_base_url;
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
    const request_id = uuidv4();
    await ForgotPasswordRequests.create({
      id: request_id,
      is_active: true,
      UserId: user.id,
    });

    const request_url = `http://localhost:3000/password/reset-password/${request_id}?frontend_base_url=${frontend_base_url}`;
    const response = await sendMail(user.name, user.email, request_url);
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

const resetPassword = async (req, res) => {
  try {
    const frontend_base_url = req.query.frontend_base_url;
    const requestId = req.params.requestId;
    const request_data = await ForgotPasswordRequests.findByPk(requestId);
    if (!request_data) {
      let err = new Error("Request is not available");
      err.statusCode = 404;
      throw err;
    }
    if (!request_data.is_active) {
      let err = new Error("Forgot password request has been expired");
      err.statusCode = 410;
      throw err;
    }
    return res.redirect(
      `${frontend_base_url}/Frontend/forgotPasswordForm.html?requestId=${requestId}`
    );
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

const updatePassword = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { new_password } = req.body;
    if (!new_password) {
      let err = new Error("Invalid Payload");
      err.statusCode = 400;
      throw err;
    }
    await sequelize.transaction(async (t) => {
      const request_response = await ForgotPasswordRequests.findOne({
        where: { id: requestId },
      });
      if (!request_response) {
        let err = new Error("Request is not available");
        err.statusCode = 404;
        throw err;
      }
      if (!request_response.is_active) {
        let err = new Error("Forgot request has been expired");
        err.statusCode = 410;
        throw err;
      }
      const user = await Users.findByPk(request_response.UserId);
      if (!user) {
        let err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }
      const hash = await bcrypt.hash(new_password, saltRound);
      user.password = hash;
      request_response.is_active = false;
      await user.save({ transaction: t });
      await request_response.save({ transaction: t });
      res
        .status(200)
        .json({ error: false, data: "Password update successfully" });
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

module.exports = { forgotPassword, resetPassword, updatePassword };
