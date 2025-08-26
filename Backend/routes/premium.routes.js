const express = require("express");
const router = express.Router();
const premium_middleware = require("../middleware/premium.middleware");
const auth_middleware = require("../middleware/auth.middleware");
const controller = require("../controllers/premium.controllers");

router.get(
  "/leaderboard",
  auth_middleware,
  premium_middleware,
  controller.getAllLeaderBorad
);

module.exports = router;
