const Users = require("./users.models");
const Expenses = require("./expenses.models");
const Orders = require("./orders.model");

Users.hasMany(Expenses);
Expenses.belongsTo(Users);

Users.hasMany(Orders);
Orders.belongsTo(Users);
