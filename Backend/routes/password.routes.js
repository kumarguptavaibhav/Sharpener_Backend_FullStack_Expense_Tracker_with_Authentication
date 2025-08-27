const express = require("express");
const router = express.Router();
const controller = require("../controllers/password.controllers");

router.post("/forgot-password", controller.forgotPassword);

module.exports = router;
