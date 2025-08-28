const express = require("express");
const router = express.Router();
const controller = require("../controllers/expense.controllers");
const auth_middleware = require("../middleware/auth.middleware");

router.post("/", auth_middleware, controller.create);
router.get("/expense", auth_middleware, controller.getAll);
router.put("/:id", auth_middleware, controller.update);
router.delete("/:id", auth_middleware, controller.deleteExpense);
router.get("/download", auth_middleware, controller.downloadExpense);

module.exports = router;
