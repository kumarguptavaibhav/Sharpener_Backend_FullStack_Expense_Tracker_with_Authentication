const Expenses = require("../models/expenses.models");
const Users = require("../models/users.models");
const sequelize = require("../utils/dbconnection");
const { Parser } = require("json2csv");

const create = async (req, res) => {
  try {
    const { id } = req.user;
    const { amount, description, category, note } = req.body;
    if (!amount || !description || !category) {
      let err = new Error("Invalid Payload");
      err.statusCode = 400;
      throw err;
    }
    await sequelize.transaction(async (t) => {
      const user = await Users.findByPk(id, { transaction: t });
      if (!user) {
        let err = new Error("User not found");
        err.statusCode = 404;
        throw err;
      }
      const expense = await Expenses.create(
        {
          amount: amount,
          description: description,
          category: category,
          UserId: id,
          note: note,
        },
        { transaction: t }
      );
      user.total_amount = Number(user.total_amount) + Number(amount);
      await user.save({ transaction: t });

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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const { id } = req.user;
    const total_expense = await Expenses.count({
      where: {
        UserId: id,
      },
    });
    const total_pages = Math.ceil(total_expense / limit);
    const result = await Expenses.findAll({
      where: {
        UserId: id,
      },
      offset: (page - 1) * limit,
      limit: limit,
    });
    res.status(200).json({
      error: false,
      data: {
        expenses: result,
        current_page: page,
        has_next_page: total_pages > page,
        has_previous_page: page > 1,
        last_page: total_pages,
        next_page: page < total_pages ? page + 1 : null,
        previous_page: page > 1 ? page - 1 : null,
      },
    });
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
    const { amount, description, category, note } = req.body;
    if (!amount && !description && !category) {
      let err = new Error("Invalid Payload");
      err.statusCode = 400;
      throw err;
    }
    await sequelize.transaction(async (t) => {
      const user = await Users.findByPk(userId, { transaction: t });
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
        transaction: t,
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
      if (note) expense.note = note;
      await expense.save({ transaction: t });
      await user.save({ transaction: t });
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
      const user = await Users.findByPk(userId, { transaction: t });
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
        transaction: t,
      });
      if (!expense) {
        let err = new Error("Resource Not Found");
        err.statusCode = 404;
        throw err;
      }
      user.total_amount = Number(user.total_amount) - Number(expense.amount);
      await user.save({ transaction: t });
      const delete_result = await Expenses.destroy({
        where: {
          id: id,
        },
        transaction: t,
      });

      res.status(200).json({ error: false, data: "Deleted Successfully" });
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

const downloadExpense = async (req, res) => {
  try {
    const { id } = req.user;
    const expenses = await Expenses.findAll({
      where: {
        UserId: id,
      },
    });
    if (expenses.length === 0) {
      let err = new Error("No expense has been found");
      err.statusCode = 404;
      throw err;
    }
    const fields = [
      "id",
      "amount",
      "description",
      "category",
      "createdAt",
      "updatedAt",
      "note",
    ];
    const json2csvparser = new Parser({ fields });
    const csv = json2csvparser.parse(expenses);

    res.header("Content-Type", "text/csv");
    return res.send(csv);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

module.exports = { create, getAll, deleteExpense, update, downloadExpense };
