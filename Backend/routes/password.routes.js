const express = require("express");
const router = express.Router();
const controller = require("../controllers/password.controllers");

router.post("/forgot-password", controller.forgotPassword);
router.get("/reset-password/:requestId", controller.resetPassword);
router.post("/update/:requestId", controller.updatePassword);

module.exports = router;
