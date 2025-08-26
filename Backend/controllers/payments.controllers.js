const Orders = require("../models/orders.model");
const Users = require("../models/users.models");
const { createOrder, getPaymentStatus } = require("../services/cashfree");

const processPayment = async (req, res) => {
  try {
    const { frontend_base_url } = req.body;
    const user = req.user;
    if (
      user.isPremium &&
      user.premiumExpiry &&
      new Date() < user.premiumExpiry
    ) {
      let err = new Error("User already has active premium subscription");
      err.statusCode = 400;
      throw err;
    }
    const order_id = `ORDER-${user.id}-${Date.now()}`;
    const order_amount = 500;
    const order_currency = "INR";
    const customer_detail = {
      customer_id: String(user.id),
      customer_name: user.name,
      customer_email: user.email,
    };
    const paymentSessionId = await createOrder(
      order_id,
      order_currency,
      order_amount,
      customer_detail,
      frontend_base_url
    );
    if (!paymentSessionId) {
      let err = new Error("Failed to create payment session");
      err.statusCode = 500;
      throw err;
    }
    await Orders.create({
      order_id: order_id,
      payment_session_id: paymentSessionId,
      amount: order_amount,
      currency: order_currency,
      status: "PENDING",
      UserId: user.id,
    });
    res
      .status(201)
      .json({ error: false, data: paymentSessionId, orderId: order_id });
  } catch (error) {
    console.log("error x", error);
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

const getPaymentStatusController = async (req, res) => {
  try {
    const frontend_base_url = req.query.frontend_base_url;
    const orderId = req.params.orderId;
    const order = await Orders.findOne({
      where: { order_id: String(orderId) },
      include: [Users],
    });
    if (!order) {
      let err = new Error("Order not found");
      err.statusCode = 404;
      throw err;
    }
    const paymentStatus = await getPaymentStatus(orderId);
    if (paymentStatus === "SUCCESS" && order.status !== "SUCCESS") {
      await order.update({ status: "SUCCESS" });
      const expiryDate = new Date(Date.now() + 60 * 60 * 1000 * 24); //for 1day
      const formattedExpiryDate = expiryDate.toISOString();
      await order.User.update({
        is_premium: true,
        premium_expiry: formattedExpiryDate,
      });
      return res.redirect(`${frontend_base_url}/Frontend/success.html`);
    } else if (paymentStatus === "FAILED") {
      await order.update({ status: "FAILED" });
      return res.redirect(`${frontend_base_url}/Frontend/failed.html`);
    }
    return res.redirect(`${frontend_base_url}/Frontend/index.html`);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

const checkPremiumStatus = async (req, res) => {
  try {
    const user = req.user;
    const curr_date = new Date();
    const premium_expiry_date = new Date(user.premium_expiry);
    const isPremiumActive =
      user.is_premium && user.premium_expiry && premium_expiry_date > curr_date;
    res
      .status(200)
      .json({ error: false, data: { isPremium: isPremiumActive, user } });
  } catch (error) {
    res.status(500).json({ error: true, data: error.message });
  }
};

module.exports = {
  processPayment,
  getPaymentStatusController,
  checkPremiumStatus,
};
