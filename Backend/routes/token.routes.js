const express = require("express");
const router = express.Router();
const controller = require("../controllers/token.controller");
const auth_middleware = require("../middleware/auth.middleware");

router.post("/update", auth_middleware, controller.updateToken);

module.exports = router;
