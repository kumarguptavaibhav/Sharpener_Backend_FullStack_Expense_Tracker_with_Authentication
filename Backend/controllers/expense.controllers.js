const Expenses = require("../models/expenses.models");
const Users = require("../models/users.models");
const sequelize = require("../utils/dbconnection");

const create = async (req, res) => {
  try {
    const { id } = req.user;
    const { amount, description, category } = req.body;
    if (!amount || !description || !category) {
      let err = new Error("Invalid Payload");
      err.statusCode = 400;
      throw err;
    }
    await sequelize.transaction(async (t) => {
      const user = await Users.findByPk(id);
      if (!user) {
        let err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }
      const expense = await Expenses.create({
        amount: amount,
        description: description,
        category: category,
        UserId: id,
      });
      user.total_amount = Number(user.total_amount) + Number(amount);
      await user.save();

      res.status(200).json({ error: false, data: expense });
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const { id } = req.user;
    const result = await Expenses.findAll({
      where: {
        UserId: id,
      },
    });
    res.status(200).json({ error: false, data: result });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

const update = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { id: userId } = req.user;
    const { amount, description, category } = req.body;
    if (!amount && !description && !category) {
      let err = new Error("Invalid Payload");
      err.statusCode = 400;
      throw err;
    }
    await sequelize.transaction(async (t) => {
      const user = await Users.findByPk(userId);
      if (!user) {
        let err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }
      const expense = await Expenses.findOne({
        where: {
          id: id,
          UserId: userId,
        },
      });
      if (!expense) {
        let err = new Error("Resource Not Found");
        err.statusCode = 404;
        throw err;
      }
      if (amount) {
        user.total_amount = Number(user.total_amount) - Number(expense.amount);
        expense.amount = amount;
        user.total_amount = Number(user.total_amount) + Number(expense.amount);
      }
      if (description) expense.description = description;
      if (category) expense.category = category;
      await expense.save();
      await user.save();
      res.status(200).json({ error: false, data: "Updated Successfully" });
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { id: userId } = req.user;
    await sequelize.transaction(async (t) => {
      const user = await Users.findByPk(userId);
      if (!user) {
        let err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }
      const expense = await Expenses.findOne({
        where: {
          id: id,
          UserId: userId,
        },
      });
      if (!expense) {
        let err = new Error("Resource Not Found");
        err.statusCode = 404;
        throw err;
      }
      user.total_amount = Number(user.total_amount) - Number(expense.amount);
      await user.save();
      const delete_result = await Expenses.destroy({
        where: {
          id: id,
        },
      });

      res.status(200).json({ error: false, data: "Deleted Successfully" });
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

module.exports = { create, getAll, deleteExpense, update };
