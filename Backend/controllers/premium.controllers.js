const { fn, col, literal } = require("sequelize");
const Expenses = require("../models/expenses.models");
const Users = require("../models/users.models");

const getAllLeaderBorad = async (req, res) => {
  try {
    const result = await Users.findAll({
      attributes: [
        "id",
        "name",
        "email",
        [fn("COALESCE", fn("SUM", col("Expenses.amount")), 0), "total_amount"],
      ],
      include: [
        {
          model: Expenses,
          attributes: [],
          required: false,
        },
      ],
      group: ["Users.id", "Users.name", "Users.email"],
      order: [[literal("total_amount"), "desc"]],
    });

    res.status(200).json({ error: false, data: result });
  } catch (error) {
    res.status(500).json({ error: true, data: error.message });
  }
};

module.exports = { getAllLeaderBorad };
