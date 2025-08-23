const express = require("express");
const router = express.Router();
const controller = require("../controllers/expense.controllers");

router.post("/", controller.create);
router.get("/", controller.getAll);
router.put("/:id", controller.update);
router.delete("/:id", controller.deleteExpense);

module.exports = router;
