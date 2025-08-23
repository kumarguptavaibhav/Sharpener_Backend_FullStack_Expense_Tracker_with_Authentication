const Users = require("./users.models");
const Expenses = require("./expenses.models");

Users.hasMany(Expenses);
Expenses.belongsTo(Users);
