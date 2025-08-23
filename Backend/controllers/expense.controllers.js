const Expenses = require("../models/expenses.models");

const create = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    if (!amount || !description || !category) {
      let err = new Error("Invalid Payload");
      err.statusCode = 400;
      throw err;
    }
    const result = await Expenses.create({
      amount: amount,
      description: description,
      category: category,
    });
    res.status(200).json({ error: false, data: result });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const result = await Expenses.findAll();
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
    const { amount, description, category } = req.body;
    if (!amount && !description && !category) {
      let err = new Error("Invalid Payload");
      err.statusCode = 400;
      throw err;
    }
    const result = await Expenses.findOne({
      where: {
        id: id,
      },
    });
    if (!result) {
      let err = new Error("Resource Not Found");
      err.statusCode = 404;
      throw err;
    }
    if (amount) result.amount = amount;
    if (description) result.description = description;
    if (category) result.category = category;
    await result.save();
    res.status(200).json({ error: false, data: "Updated Successfully" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await Expenses.findOne({
      where: {
        id: id,
      },
    });
    if (!result) {
      let err = new Error("Resource Not Found");
      err.statusCode = 404;
      throw err;
    }
    const delete_result = await Expenses.destroy({
      where: {
        id: id,
      },
    });
    res.status(200).json({ error: false, data: "Deleted Successfully" });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ error: true, data: error.message });
  }
};

module.exports = { create, getAll, deleteExpense, update };
