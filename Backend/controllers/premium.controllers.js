const Users = require("../models/users.models");

const getAllLeaderBorad = async (req, res) => {
  try {
    const result = await Users.findAll({
      order: [["total_amount", "desc"]],
    });
    res.status(200).json({ error: false, data: result });
  } catch (error) {
    res.status(500).json({ error: true, data: error.message });
  }
};

module.exports = { getAllLeaderBorad };
