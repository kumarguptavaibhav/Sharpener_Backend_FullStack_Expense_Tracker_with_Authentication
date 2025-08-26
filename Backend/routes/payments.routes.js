const express = require("express");
const router = express.Router();
const auth_middleware = require("../middleware/auth.middleware");
const controller = require("../controllers/payments.controllers");

router.post("/pay", auth_middleware, controller.processPayment);
router.get("/payment-status/:orderId", controller.getPaymentStatusController);
router.get("/premium-status", auth_middleware, controller.checkPremiumStatus);

module.exports = router;
