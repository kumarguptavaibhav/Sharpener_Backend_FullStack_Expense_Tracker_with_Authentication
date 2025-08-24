const express = require("express");
const router = express.Router();
const controller = require("../controllers/users.controllers");

router.post("/", controller.createUser);
router.post("/signin", controller.signInUser);

module.exports = router;
